import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Eye, EyeOff, Save, CheckCircle2, Home } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { HomepageSection } from '../../../types/cms';
import { useToast } from '../../../context/ToastContext';

export const HomepageBuilderPage: React.FC = () => {
  const { showToast } = useToast();
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSections = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getHomepageSections(true);
      setSections(data);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleToggle = async (section: HomepageSection) => {
    try {
      const updated = await adminService.updateHomepageSection(section.id, { isEnabled: !section.isEnabled });
      setSections(sections.map((s) => (s.id === section.id ? updated : s)));
      showToast('Section Updated', `${section.title} is now ${!section.isEnabled ? 'Active' : 'Hidden'}.`, 'success');
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const reordered = [...sections];
    const temp = reordered[index - 1];
    reordered[index - 1] = reordered[index];
    reordered[index] = temp;
    setSections(reordered);
  };

  const moveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const reordered = [...sections];
    const temp = reordered[index + 1];
    reordered[index + 1] = reordered[index];
    reordered[index] = temp;
    setSections(reordered);
  };

  const handleSaveOrder = async () => {
    try {
      const orderedIds = sections.map((s) => s.id);
      await adminService.reorderHomepageSections(orderedIds, 'Content Manager');
      showToast('Homepage Updated', 'New section layout published to live customer storefront.', 'success');
      fetchSections();
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Dynamic Homepage Section Builder
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '2px 0 0 0' }}>
            Reorder, toggle visibility, and schedule storefront sections with real-time propagation.
          </p>
        </div>

        <button
          onClick={handleSaveOrder}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '4px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Save size={15} />
          <span>PUBLISH HOMEPAGE ORDER</span>
        </button>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', textAlign: 'left' }}>
              <th style={{ padding: '12px 16px', width: '80px' }}>Order</th>
              <th style={{ padding: '12px 16px' }}>Section Title</th>
              <th style={{ padding: '12px 16px' }}>Section Archetype</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Live Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Reorder Position</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((sec, idx) => (
              <tr key={sec.id} style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: sec.isEnabled ? '#FFFFFF' : '#FAFAFA' }}>
                <td style={{ padding: '12px 16px', fontWeight: 700, color: '#64748B' }}>
                  #{idx + 1}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <strong style={{ color: sec.isEnabled ? '#0F172A' : '#94A3B8', display: 'block' }}>{sec.title}</strong>
                  <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>id: {sec.id}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <code style={{ fontSize: '0.75rem', backgroundColor: '#F1F5F9', padding: '2px 6px', borderRadius: '3px', color: '#334155' }}>
                    {sec.type}
                  </code>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <button
                    onClick={() => handleToggle(sec)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      border: 'none',
                      backgroundColor: sec.isEnabled ? '#ECFDF5' : '#F1F5F9',
                      color: sec.isEnabled ? '#059669' : '#64748B',
                      cursor: 'pointer',
                    }}
                  >
                    {sec.isEnabled ? <Eye size={12} /> : <EyeOff size={12} />}
                    <span>{sec.isEnabled ? 'ENABLED' : 'DISABLED'}</span>
                  </button>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '4px' }}>
                    <button
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      style={{
                        padding: '6px',
                        border: '1px solid #CBD5E1',
                        borderRadius: '4px',
                        backgroundColor: '#FFFFFF',
                        color: idx === 0 ? '#CBD5E1' : '#0F172A',
                        cursor: idx === 0 ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      onClick={() => moveDown(idx)}
                      disabled={idx === sections.length - 1}
                      style={{
                        padding: '6px',
                        border: '1px solid #CBD5E1',
                        borderRadius: '4px',
                        backgroundColor: '#FFFFFF',
                        color: idx === sections.length - 1 ? '#CBD5E1' : '#0F172A',
                        cursor: idx === sections.length - 1 ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <ArrowDown size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
