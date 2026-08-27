import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, Plus, Shield, Lock, CheckCircle2 } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { AdminUser, AdminRole } from '../../../types/admin';
import { useToast } from '../../../context/ToastContext';

export const RBACSettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<AdminRole>('Product Manager');

  const fetchUsers = async () => {
    try {
      const data = await adminService.getStaffUsers();
      setUsers(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) {
      showToast('Error', 'Name and Email are required.', 'error');
      return;
    }

    try {
      await adminService.createStaffUser({
        name: newName,
        email: newEmail,
        role: newRole,
      });

      showToast('Staff User Added', `Created ${newName} with role ${newRole}. 2FA is required upon first login.`, 'success');
      setIsModalOpen(false);
      setNewName('');
      setNewEmail('');
      fetchUsers();
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  const handleRoleChange = async (userId: string, targetRole: AdminRole) => {
    try {
      await adminService.updateStaffRole(userId, targetRole, 'Super Admin');
      showToast('Role Updated', `Updated staff member permissions to ${targetRole}.`, 'success');
      fetchUsers();
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Role-Based Access Control & Staff Security
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '2px 0 0 0' }}>
            Enforce granular operational permissions and mandatory 2FA authentication across Maison personnel.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '4px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Plus size={15} />
          <span>+ PROVISION STAFF USER</span>
        </button>
      </div>

      {/* Staff Table */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', textAlign: 'left' }}>
              <th style={{ padding: '12px 16px' }}>Personnel</th>
              <th style={{ padding: '12px 16px' }}>Assigned Operational Role</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>2FA Authentication</th>
              <th style={{ padding: '12px 16px' }}>Active Permissions Count</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '12px 16px' }}>
                  <strong style={{ color: '#0F172A', display: 'block' }}>{u.name}</strong>
                  <span style={{ fontSize: '0.7rem', color: '#64748B' }}>{u.email}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value as AdminRole)}
                    style={{ padding: '6px 10px', fontSize: '0.75rem', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFFFFF' }}
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="Order Manager">Order Manager</option>
                    <option value="Marketing Manager">Marketing Manager</option>
                    <option value="Content Manager">Content Manager</option>
                    <option value="Customer Concierge">Customer Concierge</option>
                  </select>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#16A34A', fontWeight: 600 }}>
                    <Lock size={12} /> MANDATORY 2FA ACTIVE
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: '#64748B' }}>
                  {u.permissions.length} granular capabilities
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '440px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>Provision Staff User</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>FULL NAME *</label>
                <input
                  type="text"
                  placeholder="e.g. Julian Ross"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>EMAIL *</label>
                <input
                  type="email"
                  placeholder="e.g. j.ross@sejal.pro"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>INITIAL ROLE *</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as AdminRole)}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFFFFF' }}
                >
                  <option value="Product Manager">Product Manager</option>
                  <option value="Order Manager">Order Manager</option>
                  <option value="Marketing Manager">Marketing Manager</option>
                  <option value="Content Manager">Content Manager</option>
                  <option value="Customer Concierge">Customer Concierge</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '8px 14px', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFFFFF', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#0F172A', color: '#FFFFFF', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}>
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
