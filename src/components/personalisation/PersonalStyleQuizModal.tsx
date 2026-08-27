import React, { useState, useEffect } from 'react';
import { Sparkles, X, Check, ArrowRight } from 'lucide-react';
import { crmService } from '../../services/crmService';
import { StyleQuizQuestion } from '../../types/personalisation';

interface PersonalStyleQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (affinityTag: string) => void;
}

export const PersonalStyleQuizModal: React.FC<PersonalStyleQuizModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [questions, setQuestions] = useState<StyleQuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      crmService.getStyleQuiz().then((q) => {
        setQuestions(q);
        setCurrentIdx(0);
        setIsCompleted(false);
      });
    }
  }, [isOpen]);

  if (!isOpen || questions.length === 0) return null;

  const currentQ = questions[currentIdx];

  const handleSelectOption = (categoryTag: string) => {
    const updated = { ...selectedAnswers, [currentQ.id]: categoryTag };
    setSelectedAnswers(updated);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsCompleted(true);
      // Store in local storage for contextual recommendations
      const tags = Object.values(updated);
      localStorage.setItem('sejal_viewed_categories', JSON.stringify(tags));
      if (onComplete) onComplete(tags[0] || 'high-jewellery');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        maxWidth: '600px',
        width: '100%',
        padding: '32px',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B' }}
        >
          <X size={20} />
        </button>

        {!isCompleted ? (
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#B76E79', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>
              <Sparkles size={14} /> PRIVÉ STYLE QUESTIONNAIRE ({currentIdx + 1}/{questions.length})
            </div>
            <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.3rem', color: '#0F172A', letterSpacing: '0.05em', margin: '8px 0 16px 0' }}>
              {currentQ.question}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentQ.options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(opt.categoryTag)}
                  style={{
                    padding: '16px',
                    borderRadius: '6px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#F8FAFC',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#0F172A')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#E2E8F0')}
                >
                  <strong style={{ fontSize: '0.85rem', color: '#0F172A', display: 'block' }}>{opt.label}</strong>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px', display: 'block' }}>{opt.description}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#ECFDF5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <Check size={24} />
            </div>
            <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.3rem', color: '#0F172A', margin: 0 }}>
              YOUR PRIVÉ PROFILE IS TUNED
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#64748B', maxWidth: '380px', margin: '8px auto 24px auto' }}>
              Your recommendations and bespoke catalogue edits have been tailored to your royal aesthetic affinity.
            </p>
            <button
              onClick={onClose}
              style={{ padding: '12px 32px', backgroundColor: '#0F172A', color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 600, border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Explore Your Custom Salon
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
