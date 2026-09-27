import React, { useState } from 'react';
import { Clock, Star, Receipt, CheckCircle2, ChevronRight, X, Shield, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { storageService } from '../services/storageService';
import { AssistanceRequest } from '../types';

export const RequestsHistory: React.FC = () => {
  const { currentUser } = useAuth();
  const [requests] = useState(() =>
    storageService.getRequests().filter((r) => r.customerId === currentUser.id)
  );

  const [selectedReceipt, setSelectedReceipt] = useState<AssistanceRequest | null>(null);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Assistance & Service History
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Complete verified record of roadside triage, towing, and emergency jobs.
        </p>
      </div>

      <div className="space-y-3">
        {requests.map((req) => (
          <div
            key={req.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                  {req.id}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    req.status === 'COMPLETED'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      : req.status === 'CANCELLED'
                      ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {req.status.replace(/_/g, ' ')}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(req.createdAt).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {req.serviceType}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {req.vehicle.make} {req.vehicle.model} ({req.vehicle.plateNumber}) • {req.providerName || 'Pending Provider'}
              </p>

              {req.review && (
                <div className="text-xs text-slate-600 dark:text-slate-300 italic pt-1 flex items-center gap-1.5">
                  <div className="flex text-amber-500">
                    {[...Array(req.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <span>"{req.review}"</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
              <div className="text-left md:text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Settled Amount</span>
                <span className="font-black text-slate-900 dark:text-white text-base">
                  ₹{req.totalPrice}
                </span>
              </div>

              <button
                onClick={() => setSelectedReceipt(req)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                <span>Invoice</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Invoice / Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-xl text-blue-600">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white">
                    RoadResQ Tax Invoice
                  </h3>
                  <span className="font-mono text-xs text-slate-400">
                    Receipt #{selectedReceipt.id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <span className="text-slate-400 block font-bold">Customer</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedReceipt.customerName}
                  </span>
                  <span className="text-slate-500 block">{selectedReceipt.customerPhone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">Assigned Provider</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedReceipt.providerName}
                  </span>
                  <span className="text-slate-500 block">Verified Partner</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Base Roadside Service Fee</span>
                  <span className="font-bold">₹{selectedReceipt.basePrice}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">
                    Distance Fee ({selectedReceipt.distanceKm} km)
                  </span>
                  <span className="font-bold">
                    ₹{selectedReceipt.totalPrice - selectedReceipt.basePrice}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">GST / Platform Facilitation</span>
                  <span className="font-bold text-emerald-600">Included</span>
                </div>
                <div className="flex justify-between pt-2 text-sm">
                  <span className="font-bold text-slate-900 dark:text-white">Total Amount Paid</span>
                  <span className="font-black text-slate-900 dark:text-white text-base">
                    ₹{selectedReceipt.totalPrice}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[11px] flex items-center gap-2">
                <Shield className="w-4 h-4 shrink-0 text-blue-600" />
                <span>
                  Settled via {selectedReceipt.paymentMethod?.toUpperCase() || 'UPI'}. Tax Invoice generated in compliance with roadside transport standards.
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
