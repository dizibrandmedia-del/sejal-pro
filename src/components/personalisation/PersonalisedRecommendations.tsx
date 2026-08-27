import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { crmService } from '../../services/crmService';
import { RecommendationResult } from '../../types/personalisation';
import { Product } from '../../types/product';
import { useCurrency } from '../../context/CurrencyContext';

interface PersonalisedRecommendationsProps {
  targetProductId?: string;
}

export const PersonalisedRecommendations: React.FC<PersonalisedRecommendationsProps> = ({ targetProductId }) => {
  const [sections, setSections] = useState<RecommendationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    loadRecommendations();
  }, [targetProductId]);

  const loadRecommendations = async () => {
    try {
      // Fetch recent categories and viewed products from localStorage
      const recentIds: string[] = JSON.parse(localStorage.getItem('sejal_viewed_products') || '[]');
      const recentCategories: string[] = JSON.parse(localStorage.getItem('sejal_viewed_categories') || '[]');

      const results = await crmService.getRecommendations(
        {
          country: 'India',
          preferredCurrency: 'INR',
          recentProductIds: recentIds,
          recentCategories,
          wishlistProductIds: [],
        },
        targetProductId
      );
      setSections(results);
    } catch {
      // Non-blocking fallback
    } finally {
      setLoading(false);
    }
  };

  if (loading || sections.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '60px', padding: '60px 0', borderTop: '1px solid #F1F5F9' }}>
      {sections.map((section, sIdx) => (
        <div key={sIdx} className="container">
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B76E79', fontWeight: 600 }}>
              {section.sectionSubtitle || 'Curated Selection'}
            </span>
            <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.6rem', color: '#0F172A', letterSpacing: '0.08em', marginTop: '6px' }}>
              {section.sectionTitle}
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748B', maxWidth: '600px', margin: '8px auto 0 auto' }}>
              {section.explanation}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {section.products.map((prod) => (
              <a
                key={prod.id}
                href={`/product/${prod.slug}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ position: 'relative', aspectRatio: '4/5', backgroundColor: '#F8FAFC', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
                  <img
                    src={prod.media?.[0]?.url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600'}
                    alt={prod.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  />
                  {prod.isSignature && (
                    <span style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'rgba(15,23,42,0.85)', color: '#D4AF37', fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', letterSpacing: '0.1em', backdropFilter: 'blur(4px)' }}>
                      SIGNATURE
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.7rem', color: '#B76E79', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
                  {prod.brand || 'SEJAL Signature'}
                </div>
                <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '0.95rem', color: '#0F172A', margin: '4px 0 6px 0', fontWeight: 600 }}>
                  {prod.name}
                </h3>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>
                  {formatPrice(prod.basePriceINR)}
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
