import { Address } from '../types/customer';
import { MOCK_DEFAULT_ADDRESSES } from '../data/mockCustomer';

const ADDRESS_STORAGE_KEY = 'sejal_pro_addresses_v1';

class AddressService {
  public getAddresses(): Address[] {
    try {
      const saved = localStorage.getItem(ADDRESS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }

    this.saveAddresses(MOCK_DEFAULT_ADDRESSES);
    return [...MOCK_DEFAULT_ADDRESSES];
  }

  public saveAddresses(addresses: Address[]): void {
    try {
      localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(addresses));
    } catch {
      // ignore
    }
  }

  public addAddress(address: Omit<Address, 'id'>): Address {
    const addresses = this.getAddresses();
    const newAddress: Address = {
      ...address,
      id: `addr_${Date.now()}`,
    };

    if (newAddress.isDefault || addresses.length === 0) {
      addresses.forEach((a) => (a.isDefault = false));
      newAddress.isDefault = true;
    }

    const updated = [newAddress, ...addresses];
    this.saveAddresses(updated);
    return newAddress;
  }

  public updateAddress(id: string, updates: Partial<Address>): Address[] {
    let addresses = this.getAddresses();
    if (updates.isDefault) {
      addresses = addresses.map((a) => ({ ...a, isDefault: false }));
    }

    addresses = addresses.map((a) => (a.id === id ? { ...a, ...updates } : a));
    this.saveAddresses(addresses);
    return addresses;
  }

  public deleteAddress(id: string): Address[] {
    let addresses = this.getAddresses().filter((a) => a.id !== id);
    if (addresses.length > 0 && !addresses.some((a) => a.isDefault)) {
      addresses[0].isDefault = true;
    }
    this.saveAddresses(addresses);
    return addresses;
  }

  public setDefault(id: string): Address[] {
    const addresses = this.getAddresses().map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    this.saveAddresses(addresses);
    return addresses;
  }
}

export const addressService = new AddressService();
