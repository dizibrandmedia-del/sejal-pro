import React, { useState, useEffect } from 'react';
import { cmsService } from '../services/cmsService';
import { productService } from '../services/productService';
import { LandingPage } from '../types/cms';
import { ProductCard } from '../components/product/ProductCard/ProductCard';
import { ArrowRight, Sparkles, Shield, Award } from 'lucide-react';

interface DynamicLandingPageProps {
  slug: string;
}

export const DynamicLandingPage: React.FC<DynamicLandingPageProps> = ({ slug }) => {
  const [page, setPage] = useState<LandingPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const allProducts = productService.getAllProducts();

  useEffect(() => {
    const fetchPage = async () => {
      setIsLoading(true);
      const data = await cmsService.getLandingPageBySlug(slug);
      setPage(data);
      setIsLoading(false);
    };
    fetchPage();
  }, [slug]);

  if (isLoading) {
    return (
      <div style={{ padding: '120px 24px', textAlign: 'center', backgroundColor: '#FAF9F6' }}>
        <div style={{ display: 'inline-block', width: '36px', height: '36px', border: '2px solid #CBD5E1', borderTopColor: '#D4AF37', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '16px', fontFamily: "'Cinzel', serif", letterSpacing: '0.1em', color: '#2C1810' }}>
          UNVEILING MAISON SEJAL CURATION...
        </p>
      </div>
    );
  }

  if (!page) {
    return (
      <div style={{ padding: '120px 24px', textAlign: 'center', backgroundColor: '#FAF9F6' }}>
        <h2 style={{ fontFamily: "'Cinzel', serif", color: '#2C1810' }}>Curation Not Found</h2>
        <p style={{ color: '#666' }}>The requested luxury edit is unavailable or has completed its seasonal exhibition.</p>
        <a href="/shop" style={{ display: 'inline-block', marginTop: '16px', color: '#D4AF37', fontWeight: 600 }}>
          EXPLORE MASTER CATALOGUE →
        </a>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FAF9F6', minHeight: '100vh' }}>
      {/* Modular Blocks Renderer */}
      {page.blocks.map((block) => {
        if (block.type === 'hero_banner') {
          return (
            <section
              key={block.id}
              style={{
                position: 'relative',
                minHeight: '75vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.6)), url(${block.mediaUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: '#FFFFFF',
                textAlign: 'center',
                padding: '40px 20px',
              }}
            >
              <div style={{ maxWidth: '800px' }}>
                <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 600, display: 'block', marginBottom: '12px' }}>
                  MAISON SEJAL PRIVATE CURATION
                </span>
                <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, letterSpacing: '0.05em', margin: '0 0 16px 0' }}>
                  {block.title}
                </h1>
                <p style={{ fontSize: '1.1rem', color: '#F1F5F9', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto 24px auto' }}>
                  {block.content}
                </p>
              </div>
            </section>
          );
        }

        if (block.type === 'collection_spotlight') {
          const products = allProducts.slice(0, 4);
          return (
            <section key={block.id} style={{ maxWidth: '1400px', margin: '0 auto', padding: '80px 24px' }}>
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '2rem', color: '#2C1810', margin: 0 }}>
                  {block.title || 'Curated Creations'}
                </h2>
                <div style={{ width: '60px', height: '1px', backgroundColor: '#D4AF37', margin: '16px auto 0 auto' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          );
        }

        if (block.type === 'call_to_action') {
          return (
            <section
              key={block.id}
              style={{
                backgroundColor: '#2C1810',
                color: '#FFFFFF',
                padding: '80px 24px',
                textAlign: 'center',
              }}
            >
              <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                <Sparkles size={28} color="#D4AF37" style={{ marginBottom: '16px' }} />
                <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '2rem', margin: '0 0 14px 0', letterSpacing: '0.05em' }}>
                  {block.title}
                </h2>
                <p style={{ color: '#D1C7BD', lineHeight: 1.6, marginBottom: '28px' }}>
                  {block.content}
                </p>
                <a
                  href={block.ctaUrl || '/account?tab=concierge'}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#D4AF37',
                    color: '#2C1810',
                    padding: '14px 28px',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    letterSpacing: '0.15em',
                    textDecoration: 'none',
                    borderRadius: '2px',
                  }}
                >
                  <span>{block.ctaText || 'REQUEST CONCIERGE ACCESS'}</span>
                  <ArrowRight size={15} />
                </a>
              </div>
            </section>
          );
        }

        return null;
      })}
    </div>
  );
};
