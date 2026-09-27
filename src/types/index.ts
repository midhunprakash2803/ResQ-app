export type UserRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';

export type VehicleType = 'car' | 'bike' | 'truck' | 'ev';
export type FuelType = 'petrol' | 'diesel' | 'electric' | 'cng';

export interface Vehicle {
  id: string;
  userId: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  fuelType: FuelType;
  isDefault: boolean;
  photoUrl?: string;
}

export type IssueCategory =
  | 'fuel'
  | 'tyre'
  | 'battery'
  | 'breakdown'
  | 'mechanical'
  | 'electrical'
  | 'engine'
  | 'towing'
  | 'accident'
  | 'unknown';

export type UrgencyLevel = 'LOW' | 'NORMAL' | 'URGENT' | 'EMERGENCY';

export type RequestStatus =
  | 'REQUESTED'
  | 'SEARCHING'
  | 'PROVIDER_ASSIGNED'
  | 'PROVIDER_ON_THE_WAY'
  | 'ARRIVED'
  | 'ASSISTANCE_IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface GeoLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface RequestTimelineEvent {
  status: RequestStatus;
  timestamp: string;
  note: string;
}

export interface AssistanceRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  vehicle: Vehicle;
  issueCategory: IssueCategory;
  problemDescription: string;
  urgency: UrgencyLevel;
  location: GeoLocation;
  providerId?: string;
  providerName?: string;
  providerPhone?: string;
  providerRating?: number;
  providerLocation?: GeoLocation;
  status: RequestStatus;
  timeline: RequestTimelineEvent[];
  serviceType: string;
  basePrice: number;
  distanceKm: number;
  totalPrice: number;
  etaMinutes: number;
  paymentStatus: 'pending' | 'completed';
  paymentMethod?: 'upi' | 'card' | 'cash';
  rating?: number;
  review?: string;
  photoUrl?: string;
  aiDiagnostic?: {
    confidence: number;
    observation: string;
    safetyAdvice?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type ProviderVerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';
export type ProviderWorkStatus = 'ONLINE' | 'OFFLINE' | 'BUSY';

export interface ServiceProvider {
  id: string;
  name: string;
  businessName: string;
  phone: string;
  email: string;
  avatarUrl: string;
  rating: number;
  reviewCount: number;
  workStatus: ProviderWorkStatus;
  verificationStatus: ProviderVerificationStatus;
  serviceCategories: IssueCategory[];
  serviceArea: string;
  currentLocation: GeoLocation;
  vehicleType: string;
  completedJobs: number;
  todayEarnings: number;
  totalEarnings: number;
  documents: {
    licenseNumber: string;
    mechanicCert: string;
    verifiedAt?: string;
  };
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export type SafePlaceType = 'fuel_station' | 'hospital' | 'police' | 'towing' | 'workshop';

export interface SafePlace {
  id: string;
  name: string;
  type: SafePlaceType;
  distanceKm: number;
  etaMinutes: number;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  isOpen24x7: boolean;
  extraInfo?: string;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  language?: 'en' | 'ta' | 'hi' | 'tanglish';
  structuredData?: {
    issueType?: IssueCategory;
    vehicleType?: VehicleType;
    urgency?: UrgencyLevel;
    confidence?: number;
    recommendedService?: string;
    estimatedCost?: number;
    followUpQuestions?: string[];
    actions?: {
      label: string;
      action: 'request_service' | 'view_fuel_stations' | 'call_towing' | 'call_emergency' | 'ask_question';
      payload?: any;
    }[];
    safetyGuidance?: string;
  };
  photoUrl?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl: string;
  selectedLanguage: 'en' | 'ta' | 'hi';
  theme: 'light' | 'dark' | 'system';
  activeVehicleId?: string;
  createdAt: string;
}
