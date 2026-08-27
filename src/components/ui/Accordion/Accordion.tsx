import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionItem {
  id: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  defaultOpen?: boolean;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  className = '',
}) => {
  const [openIds, setOpenIds] = useState<string[]>(() => {
    return items.filter((i) => i.defaultOpen).map((i) => i.id);
  });

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={`divide-y divide-gray-100 ${className}`} style={{ width: '100%' }}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div
            key={item.id}
            style={{
              borderBottom: '1px solid var(--sejal-border-light)',
              transition: 'background-color 0.2s',
            }}
          >
            <button
              onClick={() => toggle(item.id)}
              style={{
                width: '100%',
                padding: '18px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                textAlign: 'left',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              aria-expanded={isOpen}
            >
              <div>
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.2rem',
                    fontWeight: 500,
                    letterSpacing: '0.04em',
                    color: 'var(--sejal-espresso)',
                  }}
                >
                  {item.title}
                </span>
                {item.subtitle && (
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--sejal-text-muted)',
                      margin: 0,
                    }}
                  >
                    {item.subtitle}
                  </p>
                )}
              </div>

              <ChevronDown
                size={18}
                style={{
                  color: 'var(--sejal-rose-gold)',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </button>

            {isOpen && (
              <div
                className="animate-fade-in"
                style={{
                  paddingBottom: '20px',
                  color: 'var(--sejal-text-secondary)',
                  fontSize: '0.875rem',
                  lineHeight: 1.7,
                }}
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
