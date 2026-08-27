import React, { useState } from 'react';
import { RotateCcw, Check, AlertCircle, Upload, ArrowRight } from 'lucide-react';
import { Modal } from '../ui/Modal/Modal';
import { Select, Input } from '../ui/Form/Form';
import { Button } from '../ui/Button/Button';
import { Order, OrderItem } from '../../types/order';
import { ReturnReason } from '../../types/returns';
import { apiClient } from '../../services/apiClient';
import { useToast } from '../../context/ToastContext';

interface ReturnRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onReturnSubmitted?: () => void;
}

export const ReturnRequestModal: React.FC<ReturnRequestModalProps> = ({
  isOpen,
  onClose,
  order,
  onReturnSubmitted,
}) => {
  const { showToast } = useToast();
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [reason, setReason] = useState<ReturnReason>('Styling Preference Change');
  const [customDetail, setCustomDetail] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!order) return null;

  const handleToggleItem = (itemId: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleAddPhoto = () => {
    if (photoUrl.trim()) {
      setPhotos((prev) => [...prev, photoUrl.trim()]);
      setPhotoUrl('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItemIds.length === 0) {
      showToast('Selection Required', 'Please select at least one creation to return.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const itemsPayload = selectedItemIds.map((itemId) => {
        const orderItem = order.items.find((i) => i.id === itemId)!;
        return {
          orderItemId: orderItem.id,
          quantity: orderItem.quantity,
          reason,
          customReasonDetail: customDetail,
          photos,
        };
      });

      await apiClient.submitReturn({
        orderId: order.id,
        items: itemsPayload,
      });

      showToast(
        'Return Request Logged',
        'Your luxury return request has been submitted for white-glove review.',
        'luxury'
      );

      if (onReturnSubmitted) onReturnSubmitted();
      onClose();
    } catch (err: any) {
      showToast('Return Error', err.message || 'Unable to submit return request.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="REQUEST A PRIVÉ RETURN"
      subtitle={`Order Reference: ${order.orderNumber}`}
      maxWidth="680px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Item Selection Checklist */}
        <div>
          <label style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sejal-espresso)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
            SELECT CREATIONS TO RETURN:
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {order.items.map((item) => {
              const isSelected = selectedItemIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => handleToggleItem(item.id)}
                  style={{
                    border: `1px solid ${isSelected ? 'var(--sejal-rose-gold)' : 'var(--sejal-border-light)'}`,
                    backgroundColor: isSelected ? '#FAF0F2' : '#FFFFFF',
                    borderRadius: '2px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input type="checkbox" checked={isSelected} readOnly style={{ accentColor: 'var(--sejal-rose-gold)' }} />
                    <img src={item.imageUrl} alt={item.productName} style={{ width: '40px', height: '48px', objectFit: 'cover', borderRadius: '2px' }} />
                    <div>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--sejal-espresso)', display: 'block' }}>
                        {item.productName}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--sejal-text-muted)' }}>
                        Qty: {item.quantity} • {item.selectedOptionsText}
                      </span>
                    </div>
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--sejal-espresso)' }}>
                    ₹{item.totalINR.toLocaleString('en-IN')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reason Dropdown */}
        <Select
          label="Primary Reason for Return"
          options={[
            { label: 'Defective Craftsmanship or Gem Loose', value: 'Defective Craftsmanship or Gem Loose' },
            { label: 'Incorrect Size or Fit', value: 'Incorrect Size or Fit' },
            { label: 'Different from Presentation', value: 'Different from Presentation' },
            { label: 'Damaged in Transit / Seal Broken', value: 'Damaged in Transit / Seal Broken' },
            { label: 'Styling Preference Change', value: 'Styling Preference Change' },
            { label: 'Other Inviolable Reason', value: 'Other Inviolable Reason' },
          ]}
          value={reason}
          onChange={(e) => setReason(e.target.value as any)}
        />

        {/* Custom Detail Notes */}
        <div>
          <label style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sejal-espresso)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
            Detailed Explanation:
          </label>
          <textarea
            rows={3}
            placeholder="Please provide specifics regarding condition, packaging, or fit..."
            value={customDetail}
            onChange={(e) => setCustomDetail(e.target.value)}
            style={{ width: '100%', padding: '12px', fontSize: '0.8125rem', border: '1px solid var(--sejal-border)', borderRadius: '2px', outline: 'none' }}
          />
        </div>

        {/* Photo Evidence Upload / URL Link */}
        <div>
          <label style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sejal-espresso)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
            Photo Evidence (Optional for Defect Verification):
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Input
              placeholder="Paste image URL (e.g. https://...)"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
            <Button type="button" variant="outline" size="sm" onClick={handleAddPhoto}>
              ADD
            </Button>
          </div>

          {photos.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              {photos.map((p, idx) => (
                <img key={idx} src={p} alt="Evidence" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '2px', border: '1px solid var(--sejal-border)' }} />
              ))}
            </div>
          )}
        </div>

        <div style={{ backgroundColor: '#FAF6F0', padding: '12px 16px', borderRadius: '2px', fontSize: '0.75rem', color: 'var(--sejal-text-secondary)', lineHeight: 1.5 }}>
          🛡️ <strong>Maison Policy:</strong> Once approved, our courier will collect the item in its original rigid box and tamper-evident seal. Refunds are credited upon quality check inspection.
        </div>

        <div style={{ marginTop: '8px' }}>
          <Button type="submit" fullWidth size="lg" isLoading={isSubmitting} rightIcon={<ArrowRight size={16} />}>
            SUBMIT PRIVÉ RETURN REQUEST
          </Button>
        </div>
      </form>
    </Modal>
  );
};
