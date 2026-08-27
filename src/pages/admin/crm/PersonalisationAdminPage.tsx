import React, { useState, useEffect } from 'react';
import { Sparkles, Gift, HelpCircle, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { crmService } from '../../../services/crmService';
import { StyleQuizQuestion } from '../../../types/personalisation';
import { useToast } from '../../../context/ToastContext';

export const PersonalisationAdminPage: React.FC = () => {
  const [quizQuestions, setQuizQuestions] = useState<StyleQuizQuestion[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    loadQuiz();
  }, []);

  const loadQuiz = async () => {
    try {
      const q = await crmService.getStyleQuiz();
      setQuizQuestions(q);
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.4rem', color: '#0F172A', letterSpacing: '0.05em', margin: 0 }}>
          PERSONALISATION & AI-READY MERCHANDISING
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '4px 0 0 0' }}>
          Enforce editorial priority rules, AI Gift Finder parameters, and Personal Style Quiz definitions.
        </p>
      </div>

      {/* Priority Hierarchy Rules */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} color="#B76E79" /> Strict Recommendation Priority Hierarchy
        </h2>
        <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0 0 16px 0' }}>
          Per Master PRD v2.0 §41, experimental algorithmic recommendations never silently override curated luxury merchandising.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: '#F8FAFC', borderLeft: '4px solid #0F172A', borderRadius: '4px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>PRIORITY 1:</span>
            <div style={{ fontSize: '0.8rem', color: '#334155' }}>
              <strong>Explicit Founder & Admin Curation</strong> — Featured hero creations and hand-paired pieces.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: '#F8FAFC', borderLeft: '4px solid #475569', borderRadius: '4px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>PRIORITY 2:</span>
            <div style={{ fontSize: '0.8rem', color: '#334155' }}>
              <strong>Collection & Category Pairing Rules</strong> — "Complete Your SEJAL Edit" category harmonies.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: '#F8FAFC', borderLeft: '4px solid #B76E79', borderRadius: '4px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#B76E79' }}>PRIORITY 3:</span>
            <div style={{ fontSize: '0.8rem', color: '#334155' }}>
              <strong>Customer Context & Privé Affinity</strong> — Regional currency preferences, wishlist affinity, and VIP level.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: '#F8FAFC', borderLeft: '4px solid #94A3B8', borderRadius: '4px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8' }}>PRIORITY 4:</span>
            <div style={{ fontSize: '0.8rem', color: '#334155' }}>
              <strong>AI & Behavioural Heuristics</strong> — Fallback recommendations with strict catalogue-grounding.
            </div>
          </div>
        </div>
      </div>

      {/* Style Quiz Questions Config */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HelpCircle size={18} color="#0F172A" /> Personal Style Quiz Configuration ({quizQuestions.length} Questions)
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {quizQuestions.map((q, idx) => (
            <div key={q.id} style={{ border: '1px solid #E2E8F0', borderRadius: '6px', padding: '16px', backgroundColor: '#F8FAFC' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A', marginBottom: '8px' }}>
                Question {idx + 1}: {q.question}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                {q.options.map((opt) => (
                  <div key={opt.id} style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '4px', padding: '10px', fontSize: '0.75rem' }}>
                    <strong style={{ color: '#0F172A', display: 'block' }}>{opt.label}</strong>
                    <span style={{ color: '#64748B' }}>{opt.description}</span>
                    <span style={{ display: 'block', fontSize: '0.65rem', color: '#3B82F6', marginTop: '4px' }}>
                      Affinity Tag: <code>{opt.categoryTag}</code>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
