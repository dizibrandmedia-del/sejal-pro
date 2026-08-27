import React, { useState } from 'react';
import { ZoomIn, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ProductMedia } from '../../../types/product';

interface ProductGalleryProps {
  media: ProductMedia[];
  productName: string;
  className?: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  media,
  productName,
  className = '',
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const currentMedia = media[selectedIndex] || media[0];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : media.length - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < media.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 1. Main Stage / Large Interactive Image */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '3 / 4',
          backgroundColor: '#FAF6F0',
          borderRadius: '2px',
          overflow: 'hidden',
          cursor: 'zoom-in',
        }}
        onClick={() => setIsLightboxOpen(true)}
      >
        <img
          src={currentMedia?.url}
          alt={currentMedia?.alt || productName}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
        />

        {/* Zoom Overlay Indicator */}
        <button
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(6px)',
            border: '1px solid var(--sejal-border)',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--sejal-espresso)',
            cursor: 'pointer',
          }}
          aria-label="Enlarge image"
        >
          <ZoomIn size={18} />
        </button>

        {/* Carousel Arrow Controls if multiple media */}
        {media.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '12px',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                border: '1px solid var(--sejal-border-light)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--sejal-espresso)',
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              style={{
                position: 'absolute',
                top: '50%',
                right: '12px',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                border: '1px solid var(--sejal-border-light)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--sejal-espresso)',
              }}
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* 2. Thumbnail Strip */}
      {media.length > 1 && (
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
          {media.map((item, index) => {
            const isSelected = selectedIndex === index;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedIndex(index)}
                style={{
                  width: '72px',
                  height: '96px',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  border: isSelected ? '2px solid var(--sejal-rose-gold)' : '1px solid var(--sejal-border-light)',
                  padding: 0,
                  cursor: 'pointer',
                  flexShrink: 0,
                  opacity: isSelected ? 1 : 0.7,
                  transition: 'opacity 0.2s, border-color 0.2s',
                }}
              >
                <img
                  src={item.url}
                  alt={item.alt || `${productName} thumbnail ${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* 3. Full-Screen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 'var(--z-modal)',
            backgroundColor: 'rgba(26, 18, 21, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
            }}
            aria-label="Close fullscreen view"
          >
            <X size={24} />
          </button>

          <img
            src={currentMedia?.url}
            alt={currentMedia?.alt || productName}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: '2px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
