import {
  UserProfile,
  Vehicle,
  ServiceProvider,
  AssistanceRequest,
  SafePlace,
  EmergencyContact,
  RequestStatus,
  ProviderVerificationStatus,
  ProviderWorkStatus,
} from '../types';
import {
  INITIAL_CUSTOMERS,
  INITIAL_VEHICLES,
  INITIAL_PROVIDERS,
  INITIAL_REQUESTS,
  INITIAL_SAFE_PLACES,
  INITIAL_EMERGENCY_CONTACTS,
} from './mockData';

const STORAGE_KEYS = {
  CUSTOMERS: 'roadresq_customers',
  VEHICLES: 'roadresq_vehicles',
  PROVIDERS: 'roadresq_providers',
  REQUESTS: 'roadresq_requests',
  SAFE_PLACES: 'roadresq_safe_places',
  EMERGENCY_CONTACTS: 'roadresq_emergency_contacts',
  ACTIVE_REQUEST_ID: 'roadresq_active_request_id',
  CURRENT_USER_ID: 'roadresq_current_user_id',
};

class StorageService {
  private get<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return defaultValue;
      return JSON.parse(data) as T;
    } catch (e) {
      console.error(`Error reading ${key} from storage:`, e);
      return defaultValue;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      window.dispatchEvent(new Event('roadresq_storage_update'));
    } catch (e) {
      console.error(`Error writing ${key} to storage:`, e);
    }
  }

  public init() {
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
      this.set(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.VEHICLES)) {
      this.set(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PROVIDERS)) {
      this.set(STORAGE_KEYS.PROVIDERS, INITIAL_PROVIDERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
      this.set(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SAFE_PLACES)) {
      this.set(STORAGE_KEYS.SAFE_PLACES, INITIAL_SAFE_PLACES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.EMERGENCY_CONTACTS)) {
      this.set(STORAGE_KEYS.EMERGENCY_CONTACTS, INITIAL_EMERGENCY_CONTACTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_REQUEST_ID)) {
      this.set(STORAGE_KEYS.ACTIVE_REQUEST_ID, 'RESQ-9041');
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID)) {
      this.set(STORAGE_KEYS.CURRENT_USER_ID, 'cust-1');
    }
  }

  public resetToDemoData(): void {
    this.set(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    this.set(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
    this.set(STORAGE_KEYS.PROVIDERS, INITIAL_PROVIDERS);
    this.set(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
    this.set(STORAGE_KEYS.SAFE_PLACES, INITIAL_SAFE_PLACES);
    this.set(STORAGE_KEYS.EMERGENCY_CONTACTS, INITIAL_EMERGENCY_CONTACTS);
    this.set(STORAGE_KEYS.ACTIVE_REQUEST_ID, 'RESQ-9041');
    this.set(STORAGE_KEYS.CURRENT_USER_ID, 'cust-1');
  }

  // Customers
  public getCustomers(): UserProfile[] {
    return this.get(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  }

  public getCustomerById(id: string): UserProfile | undefined {
    return this.getCustomers().find((c) => c.id === id);
  }

  public updateCustomer(customer: UserProfile): void {
    const list = this.getCustomers().map((c) => (c.id === customer.id ? customer : c));
    this.set(STORAGE_KEYS.CUSTOMERS, list);
  }

  // Vehicles
  public getVehicles(userId?: string): Vehicle[] {
    const all = this.get(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
    return userId ? all.filter((v) => v.userId === userId) : all;
  }

  public addVehicle(vehicle: Omit<Vehicle, 'id'>): Vehicle {
    const all = this.getVehicles();
    const newVehicle: Vehicle = {
      ...vehicle,
      id: `veh-${Date.now()}`,
    };
    if (newVehicle.isDefault) {
      all.forEach((v) => {
        if (v.userId === newVehicle.userId) v.isDefault = false;
      });
    }
    all.push(newVehicle);
    this.set(STORAGE_KEYS.VEHICLES, all);
    return newVehicle;
  }

  public updateVehicle(vehicle: Vehicle): void {
    const all = this.getVehicles().map((v) => {
      if (v.userId === vehicle.userId && vehicle.isDefault) {
        return v.id === vehicle.id ? vehicle : { ...v, isDefault: false };
      }
      return v.id === vehicle.id ? vehicle : v;
    });
    this.set(STORAGE_KEYS.VEHICLES, all);
  }

  public deleteVehicle(id: string): void {
    const all = this.getVehicles().filter((v) => v.id !== id);
    this.set(STORAGE_KEYS.VEHICLES, all);
  }

  // Providers
  public getProviders(): ServiceProvider[] {
    return this.get(STORAGE_KEYS.PROVIDERS, INITIAL_PROVIDERS);
  }

  public getProviderById(id: string): ServiceProvider | undefined {
    return this.getProviders().find((p) => p.id === id);
  }

  public updateProvider(provider: ServiceProvider): void {
    const all = this.getProviders().map((p) => (p.id === provider.id ? provider : p));
    this.set(STORAGE_KEYS.PROVIDERS, all);
  }

  public setProviderWorkStatus(id: string, status: ProviderWorkStatus): void {
    const all = this.getProviders().map((p) => (p.id === id ? { ...p, workStatus: status } : p));
    this.set(STORAGE_KEYS.PROVIDERS, all);
  }

  public setProviderVerification(id: string, status: ProviderVerificationStatus): void {
    const all = this.getProviders().map((p) =>
      p.id === id
        ? {
            ...p,
            verificationStatus: status,
            documents: {
              ...p.documents,
              verifiedAt: status === 'VERIFIED' ? new Date().toISOString().split('T')[0] : undefined,
            },
          }
        : p
    );
    this.set(STORAGE_KEYS.PROVIDERS, all);
  }

  // Requests
  public getRequests(): AssistanceRequest[] {
    return this.get(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  }

  public getRequestById(id: string): AssistanceRequest | undefined {
    return this.getRequests().find((r) => r.id === id);
  }

  public createRequest(requestData: Omit<AssistanceRequest, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>): AssistanceRequest {
    const now = new Date().toISOString();
    const newRequest: AssistanceRequest = {
      ...requestData,
      id: `RESQ-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: now,
      updatedAt: now,
      timeline: [
        {
          status: requestData.status,
          timestamp: now,
          note: 'Assistance request logged in system',
        },
      ],
    };

    const all = [newRequest, ...this.getRequests()];
    this.set(STORAGE_KEYS.REQUESTS, all);
    this.setActiveRequestId(newRequest.id);
    return newRequest;
  }

  public updateRequestStatus(requestId: string, status: RequestStatus, note?: string): AssistanceRequest | undefined {
    const all = this.getRequests();
    const target = all.find((r) => r.id === requestId);
    if (!target) return undefined;

    const now = new Date().toISOString();
    const updated: AssistanceRequest = {
      ...target,
      status,
      updatedAt: now,
      timeline: [
        ...target.timeline,
        {
          status,
          timestamp: now,
          note: note || `Status updated to ${status.replace(/_/g, ' ')}`,
        },
      ],
    };

    const updatedList = all.map((r) => (r.id === requestId ? updated : r));
    this.set(STORAGE_KEYS.REQUESTS, updatedList);
    return updated;
  }

  public updateRequest(request: AssistanceRequest): void {
    const all = this.getRequests().map((r) => (r.id === request.id ? request : r));
    this.set(STORAGE_KEYS.REQUESTS, all);
  }

  public getActiveRequestId(): string | null {
    return this.get(STORAGE_KEYS.ACTIVE_REQUEST_ID, null);
  }

  public setActiveRequestId(id: string | null): void {
    this.set(STORAGE_KEYS.ACTIVE_REQUEST_ID, id);
  }

  // Safe Places
  public getSafePlaces(): SafePlace[] {
    return this.get(STORAGE_KEYS.SAFE_PLACES, INITIAL_SAFE_PLACES);
  }

  // Emergency Contacts
  public getEmergencyContacts(): EmergencyContact[] {
    return this.get(STORAGE_KEYS.EMERGENCY_CONTACTS, INITIAL_EMERGENCY_CONTACTS);
  }

  public addEmergencyContact(contact: Omit<EmergencyContact, 'id'>): EmergencyContact {
    const all = this.getEmergencyContacts();
    const newContact: EmergencyContact = { ...contact, id: `ec-${Date.now()}` };
    all.push(newContact);
    this.set(STORAGE_KEYS.EMERGENCY_CONTACTS, all);
    return newContact;
  }

  public deleteEmergencyContact(id: string): void {
    const all = this.getEmergencyContacts().filter((c) => c.id !== id);
    this.set(STORAGE_KEYS.EMERGENCY_CONTACTS, all);
  }
}

export const storageService = new StorageService();
storageService.init();
