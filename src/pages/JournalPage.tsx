import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb/Breadcrumb';

export const JournalPage: React.FC = () => {
  const articles = [
    {
      id: 'art-1',
      title: 'The Alchemy of Rose Gold: Crafting Warm Brilliance for the Modern Sovereign',
      category: 'HIGH JOAILLERIE',
      date: 'August 2026',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
      excerpt: 'Explore why 18K rose gold holds a warm, intimate luster that enhances natural diamonds and complements every skin tone under candlelight.',
    },
    {
      id: 'art-2',
      title: 'The Scent of Grasse: Extracting Centifolia Rose at the Dawn of May',
      category: 'PARFUMERIE PRIVÉE',
      date: 'July 2026',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop',
      excerpt: 'A journey into the historic flower fields of Provence, where ten thousand petals are harvested by hand to create a single flacon of Rose Impériale.',
    },
    {
      id: 'art-3',
      title: 'The 40-Momme Silk Standard: Why Weight Defines True Couture Draping',
      category: 'HAUTE COUTURE',
      date: 'June 2026',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop',
      excerpt: 'Understanding the artisanal difference between commercial silk and heavy mulberry crepe de chine loomed by ancestral Italian masters.',
    },
  ];

  return (
    <div style={{ backgroundColor: '#FAF6F0', minHeight: '100vh', paddingBottom: '96px' }}>
      {/* Banner */}
      <div style={{ backgroundColor: '#1A1215', color: '#FAF6F0', padding: '80px 0 64px 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Sparkles size={14} color="#D4AF37" />
            <span style={{ fontSize: '0.6875rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 600 }}>
              EDITORIAL CHRONICLES
            </span>
          </div>

          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.4rem, 5vw, 4rem)', color: '#FFFFFF', margin: '0 0 14px 0' }}>
            The SEJAL Journal
          </h1>
          <p style={{ fontSize: '1rem', color: '#F5E6D3', fontWeight: 300 }}>
            Essays on rare gemology, haute couture draping, niche botanical extractions, and the philosophy of timeless elegance.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '24px' }}>
        <Breadcrumb items={[{ label: 'Editorial Journal' }]} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', margin: '48px 0' }}>
          {articles.map((art) => (
            <article
              key={art.id}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--sejal-border)',
                borderRadius: '2px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ aspectRatio: '16/10', overflow: 'hidden', backgroundColor: '#FAF6F0' }}>
                <img src={art.image} alt={art.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.6875rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--sejal-rose-gold)', fontWeight: 600 }}>
                    {art.category}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--sejal-text-muted)' }}>{art.date}</span>
                </div>

                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.45rem', color: 'var(--sejal-espresso)', lineHeight: 1.25, margin: '0 0 10px 0' }}>
                  {art.title}
                </h3>

                <p style={{ fontSize: '0.85rem', color: 'var(--sejal-text-secondary)', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                  {art.excerpt}
                </p>

                <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--sejal-border-light)' }}>
                  <a
                    href="#"
                    style={{
                      fontSize: '0.75rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--sejal-espresso)',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>READ ESSAY</span>
                    <ArrowRight size={13} color="var(--sejal-rose-gold)" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
