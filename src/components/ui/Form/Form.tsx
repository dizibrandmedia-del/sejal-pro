import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  id,
  className = '',
  style,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ marginBottom: '16px', width: '100%' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            display: 'block',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--sejal-espresso)',
            marginBottom: '6px',
            fontWeight: 500,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={`luxury-input ${className}`}
        style={{
          width: '100%',
          padding: '12px 14px',
          fontSize: '0.875rem',
          backgroundColor: '#FFFFFF',
          border: `1px solid ${error ? 'var(--sejal-error)' : 'var(--sejal-border)'}`,
          borderRadius: '2px',
          outline: 'none',
          color: 'var(--sejal-espresso)',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          ...style,
        }}
        {...props}
      />

      {error && (
        <span
          style={{
            display: 'block',
            fontSize: '0.75rem',
            color: 'var(--sejal-error)',
            marginTop: '4px',
          }}
        >
          {error}
        </span>
      )}

      {helperText && !error && (
        <span
          style={{
            display: 'block',
            fontSize: '0.75rem',
            color: 'var(--sejal-text-muted)',
            marginTop: '4px',
          }}
        >
          {helperText}
        </span>
      )}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  id,
  className = '',
  style,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ marginBottom: '16px', width: '100%' }}>
      {label && (
        <label
          htmlFor={selectId}
          style={{
            display: 'block',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--sejal-espresso)',
            marginBottom: '6px',
            fontWeight: 500,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {label}
        </label>
      )}

      <select
        id={selectId}
        className={`luxury-select ${className}`}
        style={{
          width: '100%',
          padding: '12px 14px',
          fontSize: '0.875rem',
          backgroundColor: '#FFFFFF',
          border: `1px solid ${error ? 'var(--sejal-error)' : 'var(--sejal-border)'}`,
          borderRadius: '2px',
          outline: 'none',
          color: 'var(--sejal-espresso)',
          appearance: 'auto',
          ...style,
        }}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <span
          style={{
            display: 'block',
            fontSize: '0.75rem',
            color: 'var(--sejal-error)',
            marginTop: '4px',
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
};

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, id, style, ...props }) => {
  const checkId = id || `check_${Math.random()}`;

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px', cursor: 'pointer' }}>
      <input
        type="checkbox"
        id={checkId}
        style={{
          marginTop: '3px',
          accentColor: 'var(--sejal-rose-gold)',
          width: '16px',
          height: '16px',
          cursor: 'pointer',
          ...style,
        }}
        {...props}
      />
      <label htmlFor={checkId} style={{ fontSize: '0.8125rem', color: 'var(--sejal-text-secondary)', cursor: 'pointer', lineHeight: 1.5 }}>
        {label}
      </label>
    </div>
  );
};
