import { CustomerProfile, AuthState } from '../types/customer';
import { MOCK_CUSTOMER } from '../data/mockCustomer';

const AUTH_STORAGE_KEY = 'sejal_pro_auth_v1';

class AuthService {
  public getStoredAuthState(): AuthState {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }

    // Default: Authenticated with VIP Demo user for seamless testing
    const defaultState: AuthState = {
      isAuthenticated: true,
      customer: MOCK_CUSTOMER,
      token: 'jwt_sejal_prive_demo_token_8892',
      isLoading: false,
    };
    this.saveAuthState(defaultState);
    return defaultState;
  }

  public saveAuthState(state: AuthState): void {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }

  public async login(emailOrPhone: string): Promise<AuthState> {
    // In Phase 1: simulated secure login
    const customer: CustomerProfile = {
      ...MOCK_CUSTOMER,
      email: emailOrPhone.includes('@') ? emailOrPhone : MOCK_CUSTOMER.email,
      phoneNumber: !emailOrPhone.includes('@') ? emailOrPhone : MOCK_CUSTOMER.phoneNumber,
    };

    const newState: AuthState = {
      isAuthenticated: true,
      customer,
      token: `jwt_sejal_${Date.now()}`,
      isLoading: false,
    };
    this.saveAuthState(newState);
    return newState;
  }

  public async register(name: string, email: string, phone: string): Promise<AuthState> {
    const names = name.split(' ');
    const firstName = names[0] || 'Client';
    const lastName = names.slice(1).join(' ') || 'SEJAL';

    const customer: CustomerProfile = {
      id: `cust_${Date.now()}`,
      firstName,
      lastName,
      email,
      phoneNumber: phone,
      preferredCurrency: 'INR',
      priveTier: 'Member',
      privePoints: 1000,
      newsletterOptIn: true,
      createdAt: new Date().toISOString(),
    };

    const newState: AuthState = {
      isAuthenticated: true,
      customer,
      token: `jwt_sejal_${Date.now()}`,
      isLoading: false,
    };
    this.saveAuthState(newState);
    return newState;
  }

  public logout(): AuthState {
    const emptyState: AuthState = {
      isAuthenticated: false,
      customer: null,
      token: null,
      isLoading: false,
    };
    this.saveAuthState(emptyState);
    return emptyState;
  }

  public updateProfile(updates: Partial<CustomerProfile>): CustomerProfile {
    const current = this.getStoredAuthState();
    if (!current.customer) throw new Error('Not authenticated');

    const updatedCustomer: CustomerProfile = {
      ...current.customer,
      ...updates,
    };

    this.saveAuthState({
      ...current,
      customer: updatedCustomer,
    });

    return updatedCustomer;
  }
}

export const authService = new AuthService();
