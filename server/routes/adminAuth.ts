import { Router, Request, Response } from 'express';
import { rbacEngine } from '../services/rbacEngine';
import { store } from '../db/store';

export const adminAuthRouter = Router();

/**
 * POST /api/admin/auth/login
 * Step 1: Password authentication + 2FA challenge initiation
 */
adminAuthRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const authResult = await rbacEngine.authenticateAdmin(email, password);
    return res.status(200).json({
      success: true,
      requires2FA: authResult.requires2FA,
      tempToken: authResult.tempToken,
      user: authResult.user,
    });
  } catch (err: any) {
    return res.status(401).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/auth/verify-2fa
 * Step 2: 2FA TOTP code verification
 */
adminAuthRouter.post('/verify-2fa', async (req: Request, res: Response) => {
  try {
    const { tempToken, code } = req.body;
    if (!tempToken || !code) {
      return res.status(400).json({ success: false, error: 'Temporary token and 2FA code are required.' });
    }

    const verifiedUser = await rbacEngine.verify2FA(tempToken, code);
    return res.status(200).json({
      success: true,
      verified: true,
      user: verifiedUser,
    });
  } catch (err: any) {
    return res.status(401).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/admin/users
 * List staff members with roles & permissions
 */
adminAuthRouter.get('/users', (_req: Request, res: Response) => {
  const users = rbacEngine.listUsers();
  return res.status(200).json({ success: true, data: users, count: users.length });
});

/**
 * POST /api/admin/users
 * Create new staff user
 */
adminAuthRouter.post('/users', (req: Request, res: Response) => {
  try {
    const { name, email, role } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({ success: false, error: 'Name, email, and role are required.' });
    }

    const newUser = rbacEngine.createUser({ name, email, role });
    return res.status(201).json({ success: true, data: newUser });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * PATCH /api/admin/users/:id/role
 * Change staff role & permissions
 */
adminAuthRouter.patch('/users/:id/role', (req: Request, res: Response) => {
  try {
    const { newRole, actor } = req.body;
    if (!newRole) {
      return res.status(400).json({ success: false, error: 'Missing newRole.' });
    }

    const updated = rbacEngine.updateUserRole(req.params.id, newRole, actor || 'Super Admin');
    return res.status(200).json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});
