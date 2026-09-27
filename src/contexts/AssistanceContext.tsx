import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AssistanceRequest, RequestStatus, Vehicle } from '../types';
import { storageService } from '../services/storageService';
import { useAuth } from './AuthContext';

interface AssistanceContextType {
  activeRequest: AssistanceRequest | null;
  requestsHistory: AssistanceRequest[];
  createNewRequest: (params: {
    vehicle: Vehicle;
    issueCategory: any;
    problemDescription: string;
    urgency: any;
    location: { lat: number; lng: number; address: string };
    serviceType: string;
    basePrice: number;
    totalPrice: number;
    distanceKm: number;
    etaMinutes: number;
    providerId?: string;
    providerName?: string;
    providerPhone?: string;
    providerRating?: number;
    aiDiagnostic?: any;
  }) => AssistanceRequest;
  updateStatus: (status: RequestStatus, note?: string) => void;
  cancelActiveRequest: () => void;
  completeActiveRequest: (paymentMethod: 'upi' | 'card' | 'cash') => void;
  rateRequest: (requestId: string, rating: number, review?: string) => void;
  simulateProviderProgress: () => void;
  isSimulating: boolean;
  setIsSimulating: (sim: boolean) => void;
}

const AssistanceContext = createContext<AssistanceContextType | undefined>(undefined);

export const AssistanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [requestsHistory, setRequestsHistory] = useState<AssistanceRequest[]>(() =>
    storageService.getRequests()
  );

  const [activeRequestId, setActiveRequestIdState] = useState<string | null>(() =>
    storageService.getActiveRequestId()
  );

  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const simulationTimerRef = useRef<any>(null);

  // Sync with storage updates
  useEffect(() => {
    const handleUpdate = () => {
      setRequestsHistory(storageService.getRequests());
      setActiveRequestIdState(storageService.getActiveRequestId());
    };

    window.addEventListener('roadresq_storage_update', handleUpdate);
    return () => window.removeEventListener('roadresq_storage_update', handleUpdate);
  }, []);

  const activeRequest =
    requestsHistory.find((r) => r.id === activeRequestId && r.status !== 'COMPLETED' && r.status !== 'CANCELLED') ||
    null;

  // Real-time Provider Movement Simulation
  useEffect(() => {
    if (!isSimulating || !activeRequest || activeRequest.status !== 'PROVIDER_ON_THE_WAY') {
      if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
      return;
    }

    simulationTimerRef.current = setInterval(() => {
      setRequestsHistory((prev) => {
        const req = prev.find((r) => r.id === activeRequest.id);
        if (!req || req.status !== 'PROVIDER_ON_THE_WAY' || !req.providerLocation) return prev;

        // Move provider slightly closer to customer
        const targetLat = req.location.lat;
        const targetLng = req.location.lng;
        const currentLat = req.providerLocation.lat;
        const currentLng = req.providerLocation.lng;

        const dLat = (targetLat - currentLat) * 0.15;
        const dLng = (targetLng - currentLng) * 0.15;

        const newLat = currentLat + dLat;
        const newLng = currentLng + dLng;
        const remainingEta = Math.max(0, req.etaMinutes - 1);

        // Check if arrived
        const distanceRemaining = Math.sqrt(
          Math.pow(targetLat - newLat, 2) + Math.pow(targetLng - newLng, 2)
        );

        let newStatus: RequestStatus = req.status;
        const newTimeline = [...req.timeline];

        if (distanceRemaining < 0.001 || remainingEta === 0) {
          newStatus = 'ARRIVED';
          newTimeline.push({
            status: 'ARRIVED',
            timestamp: new Date().toISOString(),
            note: `${req.providerName || 'Provider'} has arrived at your location.`,
          });
        }

        const updated: AssistanceRequest = {
          ...req,
          providerLocation: {
            ...req.providerLocation,
            lat: newLat,
            lng: newLng,
          },
          etaMinutes: remainingEta,
          status: newStatus,
          timeline: newTimeline,
          updatedAt: new Date().toISOString(),
        };

        storageService.updateRequest(updated);
        return prev.map((r) => (r.id === updated.id ? updated : r));
      });
    }, 4000);

    return () => {
      if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
    };
  }, [isSimulating, activeRequest?.id, activeRequest?.status]);

  const createNewRequest = (params: any): AssistanceRequest => {
    const provLoc = params.location
      ? {
          lat: params.location.lat + (Math.random() - 0.5) * 0.02,
          lng: params.location.lng + (Math.random() - 0.5) * 0.02,
          address: 'En route to incident location',
        }
      : undefined;

    const newReq = storageService.createRequest({
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      vehicle: params.vehicle,
      issueCategory: params.issueCategory,
      problemDescription: params.problemDescription,
      urgency: params.urgency || 'NORMAL',
      location: params.location,
      providerId: params.providerId || 'prov-1',
      providerName: params.providerName || 'Murugan Selvam (Murugan QuickFix)',
      providerPhone: params.providerPhone || '+91 98409 55112',
      providerRating: params.providerRating || 4.9,
      providerLocation: provLoc,
      status: 'PROVIDER_ON_THE_WAY',
      serviceType: params.serviceType,
      basePrice: params.basePrice,
      distanceKm: params.distanceKm || 2.4,
      totalPrice: params.totalPrice,
      etaMinutes: params.etaMinutes || 8,
      paymentStatus: 'pending',
      paymentMethod: 'upi',
      aiDiagnostic: params.aiDiagnostic,
    });

    setActiveRequestIdState(newReq.id);
    return newReq;
  };

  const updateStatus = (status: RequestStatus, note?: string) => {
    if (!activeRequest) return;
    const updated = storageService.updateRequestStatus(activeRequest.id, status, note);
    if (updated) {
      setRequestsHistory(storageService.getRequests());
    }
  };

  const cancelActiveRequest = () => {
    if (!activeRequest) return;
    storageService.updateRequestStatus(activeRequest.id, 'CANCELLED', 'Request cancelled by user');
    storageService.setActiveRequestId(null);
    setActiveRequestIdState(null);
  };

  const completeActiveRequest = (paymentMethod: 'upi' | 'card' | 'cash') => {
    if (!activeRequest) return;
    const now = new Date().toISOString();
    const updated: AssistanceRequest = {
      ...activeRequest,
      status: 'COMPLETED',
      paymentStatus: 'completed',
      paymentMethod,
      updatedAt: now,
      timeline: [
        ...activeRequest.timeline,
        {
          status: 'COMPLETED',
          timestamp: now,
          note: `Assistance completed. Payment of ₹${activeRequest.totalPrice} settled via ${paymentMethod.toUpperCase()}.`,
        },
      ],
    };
    storageService.updateRequest(updated);
    storageService.setActiveRequestId(null);
    setActiveRequestIdState(null);
  };

  const rateRequest = (requestId: string, rating: number, review?: string) => {
    const target = requestsHistory.find((r) => r.id === requestId);
    if (!target) return;
    const updated: AssistanceRequest = {
      ...target,
      rating,
      review,
      updatedAt: new Date().toISOString(),
    };
    storageService.updateRequest(updated);
  };

  const simulateProviderProgress = () => {
    if (!activeRequest) return;
    if (activeRequest.status === 'PROVIDER_ON_THE_WAY') {
      updateStatus('ARRIVED', 'Technician arrived at the vehicle location.');
    } else if (activeRequest.status === 'ARRIVED') {
      updateStatus('ASSISTANCE_IN_PROGRESS', 'Inspection and roadside triage in progress.');
    } else if (activeRequest.status === 'ASSISTANCE_IN_PROGRESS') {
      completeActiveRequest('upi');
    }
  };

  return (
    <AssistanceContext.Provider
      value={{
        activeRequest,
        requestsHistory,
        createNewRequest,
        updateStatus,
        cancelActiveRequest,
        completeActiveRequest,
        rateRequest,
        simulateProviderProgress,
        isSimulating,
        setIsSimulating,
      }}
    >
      {children}
    </AssistanceContext.Provider>
  );
};

export const useAssistance = () => {
  const context = useContext(AssistanceContext);
  if (!context) {
    throw new Error('useAssistance must be used within an AssistanceProvider');
  }
  return context;
};
