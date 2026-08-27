/**
 * SEJAL.PRO — API Client Layer
 * Full REST client connecting to backend /api endpoints.
 */

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
  count?: number;
  timestamp?: string;
}

export class ApiClient {
  private baseUrl: string = '/api';

  public async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      const search = new URLSearchParams(params).toString();
      if (search) url += `?${search}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    if (!response.ok || data.success === false) {
      throw new Error(data.error || `GET request to ${endpoint} failed with status ${response.status}`);
    }
    return data;
  }

  public async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    if (!response.ok || data.success === false) {
      throw new Error(data.error || `POST request to ${endpoint} failed with status ${response.status}`);
    }
    return data;
  }

  public async patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    if (!response.ok || data.success === false) {
      throw new Error(data.error || `PATCH request to ${endpoint} failed with status ${response.status}`);
    }
    return data;
  }

  // --- Convenience Commerce Methods ---

  public async createServerOrder(payload: any) {
    return this.post<any>('/orders', payload);
  }

  public async getOrders(customerEmail?: string) {
    return this.get<any[]>('/orders', customerEmail ? { customerEmail } : undefined);
  }

  public async getOrderById(id: string) {
    return this.get<any>(`/orders/${id}`);
  }

  public async cancelOrder(id: string, reason: string) {
    return this.post<any>(`/orders/${id}/cancel`, { reason, cancelledBy: 'customer' });
  }

  public async trackOrder(id: string) {
    return this.get<any>(`/orders/${id}/track`);
  }

  public async createRazorpayOrder(orderId: string) {
    return this.post<any>('/payments/razorpay/create-order', { orderId });
  }

  public async verifyRazorpaySignature(payload: any) {
    return this.post<any>('/payments/razorpay/verify', payload);
  }

  public async getShippingRates(country: string, orderTotalINR: number) {
    return this.post<any[]>('/shipping/rates', { country, orderTotalINR });
  }

  public async submitReturn(payload: any) {
    return this.post<any>('/returns', payload);
  }

  public async getReturns(customerEmail?: string) {
    return this.get<any[]>('/returns', customerEmail ? { customerEmail } : undefined);
  }
}

export const apiClient = new ApiClient();
