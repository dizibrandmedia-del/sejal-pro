import React, { useState } from 'react';
import { Gift, X, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { crmService } from '../../services/crmService';
import { AIGiftFinderResult, AIGiftFinderQuery } from '../../types/personalisation';
import { useCurrency } from '../../context/CurrencyContext';

interface AIGiftFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIGiftFinderModal: React.FC<AIGiftFinderModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [occasion, setOccasion] = useState<AIGiftFinderQuery['occasion']>('Royal Wedding');
  const [recipient, setRecipient] = useState<AIGiftFinderQuery['recipient']>('Wife / Partner');
  const [budgetMax, setBudgetMax] = useState<number>(1000000);
  const [aesthetic, setAesthetic] = useState<AIGiftFinderQuery['aesthetic']>('Modern Haute Joaillerie');
  const [result, setResult] = useState<AIGiftFinderResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { formatPrice } = useCurrency();

  if (!isOpen) return null;

  const handleDiscover = async () => {
    setLoading(true);
    try {
      const res = await crmService.findLuxuryGift({
        occasion,
        recipient,
        budgetINRRange: { min: Math.round(budgetMax * 0.4), max: budgetMax },
        aesthetic,
      });
      setResult(res);
      setStep(3);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
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
        maxWidth: '680px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        padding: '32px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B' }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#B76E79', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>
            <Sparkles size={14} /> MAISON SEJAL LUXURY CONCIERGE
          </div>
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.4rem', color: '#0F172A', letterSpacing: '0.05em', margin: '6px 0 0 0' }}>
            {step === 3 ? 'YOUR CURATED GIFT PAIRING' : 'THE AI LUXURY GIFT FINDER'}
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '4px auto 0 auto', maxWidth: '440px' }}>
            {step === 3
              ? 'Hand-selected by our gemologists for the momentous occasion.'
              : 'Answer three refined questions to uncover a bespoke heirloom selection.'}
          </p>
        </div>

        {/* Step 1: Occasion & Recipient */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                1. SELECT OCCASION
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {(['Royal Wedding', 'Milestone Anniversary', 'Gala Evening', 'High Festive', 'Bespoke Birthday'] as const).map((occ) => (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => setOccasion(occ)}
                    style={{
                      padding: '10px 14px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textAlign: 'left',
                      borderRadius: '4px',
                      border: occasion === occ ? '1px solid #0F172A' : '1px solid #E2E8F0',
                      backgroundColor: occasion === occ ? '#0F172A' : '#F8FAFC',
                      color: occasion === occ ? '#FFFFFF' : '#334155',
                      cursor: 'pointer',
                    }}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                2. WHO IS THIS GIFT FOR?
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {(['Wife / Partner', 'Daughter', 'Mother', 'Self-Gifting', 'Royal Dignitary'] as const).map((rec) => (
                  <button
                    key={rec}
                    type="button"
                    onClick={() => setRecipient(rec)}
                    style={{
                      padding: '10px 14px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textAlign: 'left',
                      borderRadius: '4px',
                      border: recipient === rec ? '1px solid #0F172A' : '1px solid #E2E8F0',
                      backgroundColor: recipient === rec ? '#0F172A' : '#F8FAFC',
                      color: recipient === rec ? '#FFFFFF' : '#334155',
                      cursor: 'pointer',
                    }}
                  >
                    {rec}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              style={{
                marginTop: '12px',
                padding: '12px',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Continue to Aesthetic & Budget →
            </button>
          </div>
        )}

        {/* Step 2: Budget & Aesthetic */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                3. SARTORIAL AESTHETIC
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {(['Modern Haute Joaillerie', 'Heritage Brocade & Silk', 'Minimalist Diamond', 'Extrait Perfumery'] as const).map((aes) => (
                  <button
                    key={aes}
                    type="button"
                    onClick={() => setAesthetic(aes)}
                    style={{
                      padding: '10px 14px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textAlign: 'left',
                      borderRadius: '4px',
                      border: aesthetic === aes ? '1px solid #0F172A' : '1px solid #E2E8F0',
                      backgroundColor: aesthetic === aes ? '#0F172A' : '#F8FAFC',
                      color: aesthetic === aes ? '#FFFFFF' : '#334155',
                      cursor: 'pointer',
                    }}
                  >
                    {aes}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                <span>4. MAXIMUM ACQUISITION BUDGET</span>
                <span style={{ color: '#B76E79' }}>{formatPrice(budgetMax)}</span>
              </div>
              <input
                type="range"
                min={100000}
                max={5000000}
                step={50000}
                value={budgetMax}
                onChange={(e) => setBudgetMax(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#0F172A' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#94A3B8', marginTop: '4px' }}>
                <span>₹1,00,000</span>
                <span>₹50,00,000+</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ flex: 1, padding: '12px', backgroundColor: '#F1F5F9', color: '#0F172A', fontSize: '0.8rem', fontWeight: 600, border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleDiscover}
                disabled={loading}
                style={{ flex: 2, padding: '12px', backgroundColor: '#0F172A', color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 600, border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                {loading ? 'Consulting Vault...' : 'Discover Bespoke Pairing ✨'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Result Presentation */}
        {step === 3 && result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Primary Curated Creation */}
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px', backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
              <img
                src={result.curatedProduct.media?.[0]?.url || ''}
                alt={result.curatedProduct.name}
                style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '4px' }}
              />
              <div>
                <span style={{ fontSize: '0.65rem', color: '#B76E79', letterSpacing: '0.1em', fontWeight: 700, textTransform: 'uppercase' }}>
                  RECOMMENDED HEIRLOOM
                </span>
                <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.05rem', color: '#0F172A', margin: '2px 0 6px 0' }}>
                  {result.curatedProduct.name}
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
                  {result.curationReason}
                </p>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginTop: '8px' }}>
                  {formatPrice(result.curatedProduct.basePriceINR)}
                </div>
              </div>
            </div>

            {/* Packaging & Concierge Service */}
            <div style={{ backgroundColor: '#FAF5FF', border: '1px solid #E9D5FF', padding: '14px', borderRadius: '6px', fontSize: '0.75rem', color: '#581C87' }}>
              <strong>Signature Luxury Presentation:</strong> {result.suggestedPackaging}
              <div style={{ marginTop: '4px', fontSize: '0.7rem', color: '#6B21A8' }}>
                <ShieldCheck size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                {result.conciergeNote}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href={`/product/${result.curatedProduct.slug}`}
                style={{ flex: 1, textAlign: 'center', textDecoration: 'none', padding: '12px', backgroundColor: '#0F172A', color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 600, borderRadius: '4px' }}
              >
                View Creation Details
              </a>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ padding: '12px 18px', backgroundColor: '#F1F5F9', color: '#0F172A', fontSize: '0.8rem', fontWeight: 600, border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Search Another Gift
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
