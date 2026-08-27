import React, { useState, useEffect } from 'react';
import { Zap, Play, Pause, Clock, ArrowRight, ShieldCheck, Mail, MessageSquare, AlertCircle } from 'lucide-react';
import { crmService } from '../../../services/crmService';
import { MarketingWorkflow } from '../../../types/automation';
import { useToast } from '../../../context/ToastContext';

export const MarketingAutomationPage: React.FC = () => {
  const [workflows, setWorkflows] = useState<MarketingWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      const data = await crmService.getWorkflows();
      setWorkflows(data);
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.4rem', color: '#0F172A', letterSpacing: '0.05em', margin: 0 }}>
          MARKETING AUTOMATION & ABANDONED SELECTION RECOVERY
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '4px 0 0 0' }}>
          Quiet, respectful omnichannel workflows with purchase suppression and strict frequency limits.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px' }}>
          <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>ACTIVE WORKFLOWS</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '4px' }}>
            {workflows.filter((w) => w.isActive).length}
          </div>
          <span style={{ fontSize: '0.7rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <ShieldCheck size={13} /> Quiet Hours & Frequency Enabled
          </span>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px' }}>
          <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>TOTAL CLIENTS ENROLLED</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '4px' }}>
            {workflows.reduce((s, w) => s + w.totalEnrolledCount, 0)}
          </div>
          <span style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '4px', display: 'block' }}>
            Across all trigger types
          </span>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px' }}>
          <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>RECOVERED REVENUE</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#059669', marginTop: '4px' }}>
            ₹{workflows.reduce((s, w) => s + w.totalRevenueGeneratedINR, 0).toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '4px', display: 'block' }}>
            Attributed to automated recovery
          </span>
        </div>
      </div>

      {/* Workflows List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {workflows.map((wf) => (
          <div
            key={wf.id}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ backgroundColor: '#0F172A', color: '#FFFFFF', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '3px' }}>
                    {wf.triggerType.replace('_', ' ').toUpperCase()}
                  </span>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                    {wf.name}
                  </h3>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '4px 0 0 0' }}>
                  {wf.description}
                </p>
              </div>

              <div style={{ textAlign: 'right', fontSize: '0.75rem' }}>
                <span style={{ color: '#64748B' }}>Cooldown Cap:</span> <strong>{wf.frequencyCapHours} Hours</strong>
              </div>
            </div>

            {/* Visual Workflow Steps Flow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', padding: '12px 0' }}>
              {/* Trigger Node */}
              <div style={{ backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', padding: '10px 14px', borderRadius: '6px', fontSize: '0.75rem', minWidth: '140px' }}>
                <strong style={{ display: 'block', color: '#0F172A' }}>1. TRIGGER</strong>
                <span style={{ color: '#475569' }}>{wf.triggerType}</span>
              </div>

              <ArrowRight size={16} style={{ color: '#94A3B8', flexShrink: 0 }} />

              {/* Sequential Steps */}
              {wf.steps.map((step, idx) => (
                <React.Fragment key={step.id}>
                  <div style={{ backgroundColor: step.stepType === 'action' ? '#EFF6FF' : '#F8FAFC', border: '1px solid #CBD5E1', padding: '10px 14px', borderRadius: '6px', fontSize: '0.75rem', minWidth: '160px' }}>
                    <strong style={{ display: 'block', color: '#0F172A' }}>
                      {idx + 2}. {step.stepType.toUpperCase()}
                    </strong>
                    {step.stepType === 'delay' && <span style={{ color: '#64748B' }}>Wait {step.delayMinutes} mins</span>}
                    {step.stepType === 'condition' && <span style={{ color: '#64748B' }}>Check {step.condition?.field}</span>}
                    {step.stepType === 'action' && <span style={{ color: '#1D4ED8', fontWeight: 600 }}>Dispatch {step.action?.channel.toUpperCase()}</span>}
                  </div>
                  {idx < wf.steps.length - 1 && <ArrowRight size={16} style={{ color: '#94A3B8', flexShrink: 0 }} />}
                </React.Fragment>
              ))}

              <ArrowRight size={16} style={{ color: '#94A3B8', flexShrink: 0 }} />

              {/* Exit Node */}
              <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '10px 14px', borderRadius: '6px', fontSize: '0.75rem', minWidth: '140px' }}>
                <strong style={{ display: 'block', color: '#065F46' }}>EXIT / CONVERSION</strong>
                <span style={{ color: '#047857' }}>Purchase Completed</span>
              </div>
            </div>

            {/* Performance Footer */}
            <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748B' }}>
              <div>
                Enrolled: <strong>{wf.totalEnrolledCount} clients</strong> • Converted: <strong>{wf.totalConvertedCount}</strong> (Conversion Rate: {wf.totalEnrolledCount > 0 ? ((wf.totalConvertedCount / wf.totalEnrolledCount) * 100).toFixed(1) : 0}%)
              </div>
              <div style={{ fontWeight: 700, color: '#059669' }}>
                Revenue Recovered: ₹{wf.totalRevenueGeneratedINR.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
