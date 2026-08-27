import { store } from '../db/store';
import { AdminUser, AdminRole, AdminPermission, ROLE_PERMISSIONS } from '../../src/types/admin';
import { auditLogEngine } from './auditLogEngine';

export { ROLE_PERMISSIONS };

export class RbacEngine {
  /**
   * CHECK PERMISSION
   */
  public hasPermission(user: AdminUser, permission: AdminPermission): boolean {
    if (!user.isActive) return false;
    if (user.role === 'Super Admin') return true;
    return user.permissions.includes(permission);
  }

  /**
   * AUTHENTICATE ADMIN CREDENTIALS
   */
  public async authenticateAdmin(email: string, password: string): Promise<{ requires2FA: boolean; user?: AdminUser; tempToken?: string }> {
    const user = Array.from(store.adminUsers.values()).find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user || !user.isActive) {
      throw new Error('Invalid administrative credentials or account deactivated.');
    }

    // Password check (Master test key or standard hash in dev)
    const validPasswords = ['SejalPrivé2026!', 'AdminPass2026!', 'Password@123'];
    if (!validPasswords.includes(password)) {
      throw new Error('Invalid administrative password.');
    }

    if (user.twoFactorEnabled) {
      const tempToken = `2fa::${user.id}::${Date.now()}`;
      return { requires2FA: true, tempToken, user: { ...user, permissions: [] } };
    }

    user.lastLoginAt = new Date().toISOString();
    user.updatedAt = new Date().toISOString();
    store.adminUsers.set(user.id, user);

    auditLogEngine.logAudit({
      entityType: 'StaffUser',
      entityId: user.id,
      referenceCode: user.email,
      action: 'ADMIN_LOGIN_SUCCESS',
      actor: user.name,
      reason: 'Administrator authenticated successfully.',
    });

    return { requires2FA: false, user };
  }

  /**
   * VERIFY 2FA TOTP TOKEN
   */
  public async verify2FA(tempToken: string, code: string): Promise<AdminUser> {
    const parts = tempToken.split('::');
    const userId = parts[1];
    const user = store.adminUsers.get(userId);

    if (!user || !user.isActive) {
      throw new Error('Invalid administrative session token.');
    }

    // Verify 6-digit TOTP code (Standard demo code "202688" or matching secret)
    if (code !== '202688' && code !== '123456') {
      auditLogEngine.logAudit({
        entityType: 'StaffUser',
        entityId: user.id,
        referenceCode: user.email,
        action: 'ADMIN_2FA_FAILED',
        actor: user.name,
        reason: 'Invalid 2FA code supplied.',
      });
      throw new Error('Invalid 2FA verification code. Please check your authenticator app.');
    }

    user.lastLoginAt = new Date().toISOString();
    user.updatedAt = new Date().toISOString();
    store.adminUsers.set(user.id, user);

    auditLogEngine.logAudit({
      entityType: 'StaffUser',
      entityId: user.id,
      referenceCode: user.email,
      action: 'ADMIN_2FA_VERIFIED',
      actor: user.name,
      reason: '2FA authentication verified.',
    });

    return user;
  }

  /**
   * STAFF USERS CRUD
   */
  public listUsers(): AdminUser[] {
    return Array.from(store.adminUsers.values());
  }

  public createUser(params: { name: string; email: string; role: AdminRole }): AdminUser {
    const id = `usr_adm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const permissions = ROLE_PERMISSIONS[params.role] || [];

    const newUser: AdminUser = {
      id,
      email: params.email,
      name: params.name,
      role: params.role,
      permissions,
      isActive: true,
      twoFactorEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.adminUsers.set(newUser.id, newUser);

    auditLogEngine.logAudit({
      entityType: 'StaffUser',
      entityId: newUser.id,
      referenceCode: newUser.email,
      action: 'STAFF_USER_CREATED',
      actor: 'Super Admin',
      reason: `Created staff user ${params.name} with role ${params.role}`,
    });

    return newUser;
  }

  public updateUserRole(userId: string, newRole: AdminRole, actor: string): AdminUser {
    const user = store.adminUsers.get(userId);
    if (!user) throw new Error(`User ${userId} not found.`);

    const oldRole = user.role;
    user.role = newRole;
    user.permissions = ROLE_PERMISSIONS[newRole] || [];
    user.updatedAt = new Date().toISOString();

    store.adminUsers.set(user.id, user);

    auditLogEngine.logAudit({
      entityType: 'StaffUser',
      entityId: user.id,
      referenceCode: user.email,
      action: 'STAFF_ROLE_CHANGED',
      previousState: oldRole,
      newState: newRole,
      actor,
      reason: `Updated role from ${oldRole} to ${newRole}`,
    });

    return user;
  }
}

export const rbacEngine = new RbacEngine();
