import React, { useState, useEffect } from 'react';
import { History, RefreshCw, Search } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { AuditLogEntry } from '../../../types/events';

export const AuditLogPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getAuditLogs();
      setLogs(data.auditLogs || []);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.actor.toLowerCase().includes(search.toLowerCase()) ||
      l.entityType.toLowerCase().includes(search.toLowerCase()) ||
      (l.reason && l.reason.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Immutable Activity Audit Trail
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '2px 0 0 0' }}>
            Cryptographically timestamped operational event journal across all staff mutations and state transitions.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={13} />
          <span>Refresh Audit Logs</span>
        </button>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '14px' }}>
        <input
          type="text"
          placeholder="Filter by Actor, Action, Entity or Reason..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '8px 12px', fontSize: '0.8125rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
        />
      </div>

      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', textAlign: 'left' }}>
              <th style={{ padding: '12px 16px' }}>Timestamp</th>
              <th style={{ padding: '12px 16px' }}>Actor</th>
              <th style={{ padding: '12px 16px' }}>Action Code</th>
              <th style={{ padding: '12px 16px' }}>Entity</th>
              <th style={{ padding: '12px 16px' }}>Details / Reason</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#64748B' }}>
                  No audit log entries found matching criteria.
                </td>
              </tr>
            ) : (
              filtered.map((l) => (
                <tr key={l.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 16px', color: '#64748B', whiteSpace: 'nowrap' }}>
                    {new Date(l.timestamp).toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0F172A' }}>{l.actor}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <code style={{ fontSize: '0.75rem', color: '#2563EB', backgroundColor: '#EFF6FF', padding: '2px 6px', borderRadius: '3px' }}>
                      {l.action}
                    </code>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#334155' }}>
                    {l.entityType}: <code>{l.referenceCode || l.entityId}</code>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#475569' }}>
                    {l.reason || 'State recorded.'}
                    {l.previousState && l.newState && (
                      <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748B' }}>
                        Transition: {l.previousState} → {l.newState}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
