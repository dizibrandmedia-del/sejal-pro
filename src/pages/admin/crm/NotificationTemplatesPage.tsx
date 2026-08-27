import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Phone, Plus, Eye, Send } from 'lucide-react';
import { crmService } from '../../../services/crmService';
import { NotificationTemplate, CommunicationLog } from '../../../types/automation';
import { useToast } from '../../../context/ToastContext';

export const NotificationTemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [logs, setLogs] = useState<CommunicationLog[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [previewOutput, setPreviewOutput] = useState('');
  const [mockCustomerName, setMockCustomerName] = useState('Princess Gayatri Devi');
  const [mockProductName, setMockProductName] = useState('The Aura Crowned Diamond Choker');
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tmplList, logList] = await Promise.all([
        crmService.getTemplates(),
        crmService.getCommunicationLogs(30),
      ]);
      setTemplates(tmplList);
      setLogs(logList);
      if (tmplList.length > 0) {
        handleSelectTemplate(tmplList[0]);
      }
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  const handleSelectTemplate = async (tmpl: NotificationTemplate) => {
    setSelectedTemplate(tmpl);
    const preview = await crmService.previewTemplate(tmpl.bodyTemplate, {
      customer_name: mockCustomerName,
      product_name: mockProductName,
      prive_tier: 'Diamond High Salon',
      cart_url: 'https://sejal.pro/cart',
    });
    setPreviewOutput(preview);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.4rem', color: '#0F172A', letterSpacing: '0.05em', margin: 0 }}>
          NOTIFICATION TEMPLATES & MULTI-CHANNEL DISPATCH
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '4px 0 0 0' }}>
          Omnichannel template manager with safe variable interpolation and live communication audit logs.
        </p>
      </div>

      {/* Two-Column Editor & Live Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left: Templates Roster */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Master Templates ({templates.length})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {templates.map((tmpl) => {
              const isSelected = selectedTemplate?.id === tmpl.id;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => handleSelectTemplate(tmpl)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '6px',
                    border: isSelected ? '1px solid #0F172A' : '1px solid #E2E8F0',
                    backgroundColor: isSelected ? '#F8FAFC' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        backgroundColor: tmpl.channel === 'email' ? '#EFF6FF' : tmpl.channel === 'whatsapp' ? '#ECFDF5' : '#FEF3C7',
                        color: tmpl.channel === 'email' ? '#1D4ED8' : tmpl.channel === 'whatsapp' ? '#047857' : '#B45309',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '3px',
                      }}>
                        {tmpl.channel.toUpperCase()}
                      </span>
                      <strong style={{ fontSize: '0.85rem', color: '#0F172A' }}>{tmpl.name}</strong>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Category: {tmpl.category}</span>
                  </div>

                  <Eye size={15} style={{ color: isSelected ? '#0F172A' : '#94A3B8' }} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live Variable Simulator */}
        {selectedTemplate && (
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                Live Variable Simulator ({selectedTemplate.channel.toUpperCase()})
              </h2>
              <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>Active in Engine</span>
            </div>

            {/* Test Context Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', color: '#475569', marginBottom: '2px' }}>Customer Name Variable</label>
                <input
                  type="text"
                  value={mockCustomerName}
                  onChange={(e) => {
                    setMockCustomerName(e.target.value);
                    handleSelectTemplate(selectedTemplate);
                  }}
                  style={{ width: '100%', padding: '6px 10px', fontSize: '0.75rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#475569', marginBottom: '2px' }}>Product Name Variable</label>
                <input
                  type="text"
                  value={mockProductName}
                  onChange={(e) => {
                    setMockProductName(e.target.value);
                    handleSelectTemplate(selectedTemplate);
                  }}
                  style={{ width: '100%', padding: '6px 10px', fontSize: '0.75rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>
            </div>

            {/* Simulated Output Box */}
            <div style={{ backgroundColor: selectedTemplate.channel === 'whatsapp' ? '#F0FDF4' : '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '16px', fontSize: '0.8rem', color: '#0F172A', whiteSpace: 'pre-wrap', lineHeight: '1.5', fontFamily: 'inherit' }}>
              {selectedTemplate.subjectTemplate && (
                <div style={{ fontWeight: 700, borderBottom: '1px solid #E2E8F0', paddingBottom: '8px', marginBottom: '8px' }}>
                  Subject: {selectedTemplate.subjectTemplate.replace('{{customer_name}}', mockCustomerName)}
                </div>
              )}
              {previewOutput}
            </div>

            <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
              Supported Variables: <code>{selectedTemplate.supportedVariables.map((v) => `{{${v}}}`).join(', ')}</code>
            </div>
          </div>
        )}
      </div>

      {/* Communication Delivery Logs */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px' }}>
        <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: '0 0 16px 0' }}>
          Real-Time Omnichannel Communication Ledger ({logs.length})
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                <th style={{ padding: '8px 12px' }}>Recipient</th>
                <th style={{ padding: '8px 12px' }}>Channel</th>
                <th style={{ padding: '8px 12px' }}>Type</th>
                <th style={{ padding: '8px 12px' }}>Message Preview</th>
                <th style={{ padding: '8px 12px' }}>Status</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Sent Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: '#94A3B8' }}>
                    No recent communication dispatches.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0F172A' }}>
                      {log.recipientName}
                      <span style={{ display: 'block', fontSize: '0.65rem', color: '#64748B', fontWeight: 400 }}>{log.recipientEmail}</span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ textTransform: 'uppercase', fontWeight: 700, color: log.channel === 'whatsapp' ? '#047857' : '#1D4ED8' }}>
                        {log.channel}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ backgroundColor: log.messageType === 'transactional' ? '#F1F5F9' : '#FEF3C7', padding: '2px 6px', borderRadius: '3px', fontSize: '0.65rem', fontWeight: 600 }}>
                        {log.messageType}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#475569' }}>
                      {log.body}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        backgroundColor: log.status === 'delivered' ? '#ECFDF5' : '#FEF2F2',
                        color: log.status === 'delivered' ? '#047857' : '#B91C1C',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                      }}>
                        {log.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: '#64748B' }}>
                      {new Date(log.sentAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
