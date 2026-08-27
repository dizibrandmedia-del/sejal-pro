export type PriveTier = 'Member' | 'Silver Privé' | 'Gold Privé' | 'Diamond High Salon';

export interface Address {
  id: string;
  label: 'Home' | 'Work' | 'Boutique' | 'Other';
  recipientName: string;
  phoneNumber: string;
  country: string; // 'India' | 'United Arab Emirates' | 'United States' | 'Australia'
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  isDefault: boolean;
}

export interface CustomerProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthday?: string;
  anniversary?: string;
  preferredCurrency: 'INR' | 'USD' | 'AED' | 'AUD';
  priveTier: PriveTier;
  privePoints: number;
  newsletterOptIn: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  customer: CustomerProfile | null;
  token: string | null;
  isLoading: boolean;
}

export interface ConciergeRequest {
  id: string;
  customerId?: string;
  customerName: string;
  email: string;
  phone: string;
  preferredContact: 'WhatsApp' | 'Phone Call' | 'Private Salon Visit' | 'Virtual Video Appointment';
  preferredDate?: string;
  serviceType: 'Bespoke Haute Joaillerie' | 'Private Styling & Wardrobe' | 'Royal Gifting & Bridal Registry' | 'High Horology Consultation';
  notes: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
  createdAt: string;
}
