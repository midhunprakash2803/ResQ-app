import React, { useState } from 'react';
import {
  Users,
  Wrench,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  FileText,
  DollarSign,
  Activity,
  Layers,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { ServiceProvider, AssistanceRequest, ProviderVerificationStatus } from '../../types';

export const AdminDashboard: React.FC = () => {
  const [providers, setProviders] = useState<ServiceProvider[]>(() =>
    storageService.getProviders()
  );
  const [requests] = useState<AssistanceRequest[]>(() => storageService.getRequests());
  const [customers] = useState(() => storageService.getCustomers());
  const [tab, setTab] = useState<'overview' | 'providers' | 'requests' | 'users'>('overview');

  const reloadProviders = () => {
    setProviders(storageService.getProviders());
  };

  const handleVerify = (id: string, status: ProviderVerificationStatus) => {
    storageService.setProviderVerification(id, status);
    reloadProviders();
  };

  // Metrics
  const totalRevenue = requests
    .filter((r) => r.status === 'COMPLETED')
    .reduce((sum, r) => sum + r.totalPrice, 0);

  const pendingProvidersCount = providers.filter((p) => p.verificationStatus === 'PENDING').length;
  const verifiedProvidersCount = providers.filter((p) => p.verificationStatus === 'VERIFIED').length;
  const activeRequestsCount = requests.filter(
    (r) => r.status !== 'COMPLETED' && r.status !== 'CANCELLED'
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            RoadResQ Platform Administration
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time supervisor dispatch, provider KYC accreditation, and emergency response analytics.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {[
            { id: 'overview', label: 'Overview & Charts' },
            { id: 'providers', label: `Providers (${pendingProvidersCount} Pending)` },
            { id: 'requests', label: `Live Incidents (${requests.length})` },
            { id: 'users', label: `Users (${customers.length})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                tab === t.id
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Total Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            +18.4% from last week
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Active Roadside Dispatches</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {activeRequestsCount}
          </div>
          <div className="text-[11px] text-slate-400 font-semibold mt-1">
            Avg response: 7.8 mins
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Verified Fleet Partners</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {verifiedProvidersCount}
          </div>
          <div className="text-[11px] text-amber-500 font-semibold mt-1">
            {pendingProvidersCount} pending KYC audit
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Completion Rate</span>
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            96.8%
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            Zero unresolved escalations
          </div>
        </div>
      </div>

      {/* TAB 1: OVERVIEW & ANALYTICS CHARTS */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Requests by Service Category */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Incidents by Service Category
              </h3>
              <div className="space-y-3 pt-2">
                {[
                  { label: 'Flat Tyre & Puncture Repairs', count: 6, pct: 40, color: 'bg-amber-500' },
                  { label: 'Battery Jumpstarts & EV 12V', count: 4, pct: 27, color: 'bg-blue-500' },
                  { label: 'Fuel Emergency Guidance & Tow', count: 3, pct: 20, color: 'bg-orange-500' },
                  { label: 'Mechanical & Hydraulic Towing', count: 2, pct: 13, color: 'bg-emerald-500' },
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {item.label}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {item.count} jobs ({item.pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`${item.color} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 2: Daily Dispatch Trend Line */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  7-Day Incident Volume
                </h3>
                <span className="text-xs text-slate-400">Total: 48 Dispatches</span>
              </div>

              {/* Clean SVG Trend Chart */}
              <div className="h-44 pt-4 flex items-end justify-between gap-3">
                {[
                  { day: 'Mon', count: 5, h: '45%' },
                  { day: 'Tue', count: 7, h: '60%' },
                  { day: 'Wed', count: 6, h: '52%' },
                  { day: 'Thu', count: 9, h: '78%' },
                  { day: 'Fri', count: 12, h: '95%' },
                  { day: 'Sat', count: 14, h: '100%' },
                  { day: 'Sun', count: 10, h: '82%' },
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                      {bar.count}
                    </span>
                    <div
                      className="w-full bg-blue-600 hover:bg-[#FF6500] transition rounded-t-lg"
                      style={{ height: bar.h }}
                    />
                    <span className="text-[10px] text-slate-400 font-bold">{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROVIDER ACCREDITATION / KYC AUDIT */}
      {tab === 'providers' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Fleet Providers & Mechanic Audit Queue
            </h3>
            <span className="text-xs text-slate-500">{providers.length} registered partners</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Provider / Business</th>
                  <th className="p-3.5">Vehicle & Tools</th>
                  <th className="p-3.5">Credentials</th>
                  <th className="p-3.5">Work Status</th>
                  <th className="p-3.5">KYC Status</th>
                  <th className="p-3.5 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {providers.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.avatarUrl}
                          alt={p.name}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">
                            {p.businessName}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {p.name} • {p.phone}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 text-slate-600 dark:text-slate-300">
                      {p.vehicleType}
                    </td>

                    <td className="p-3.5">
                      <div className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                        {p.documents.licenseNumber}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-xs">
                        {p.documents.mechanicCert}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.workStatus === 'ONLINE'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {p.workStatus}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.verificationStatus === 'VERIFIED'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : p.verificationStatus === 'PENDING'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                            : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                        }`}
                      >
                        {p.verificationStatus}
                      </span>
                    </td>

                    <td className="p-3.5 text-right space-x-1.5">
                      {p.verificationStatus !== 'VERIFIED' && (
                        <button
                          onClick={() => handleVerify(p.id, 'VERIFIED')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition shadow-sm"
                        >
                          Approve
                        </button>
                      )}
                      {p.verificationStatus !== 'SUSPENDED' && (
                        <button
                          onClick={() => handleVerify(p.id, 'SUSPENDED')}
                          className="px-2.5 py-1 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg font-bold text-[11px] transition"
                        >
                          Suspend
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE INCIDENT SUPERVISION */}
      {tab === 'requests' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Platform Incident Dispatches
            </h3>
            <span className="text-xs text-slate-500">{requests.length} total logged events</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">ID</th>
                  <th className="p-3.5">Customer & Vehicle</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Assigned Partner</th>
                  <th className="p-3.5">Fee</th>
                  <th className="p-3.5">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {r.id}
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {r.customerName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {r.vehicle.make} {r.vehicle.model} ({r.vehicle.plateNumber})
                      </div>
                    </td>

                    <td className="p-3.5 font-medium capitalize text-slate-700 dark:text-slate-300">
                      {r.issueCategory}
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.status === 'COMPLETED'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : r.status === 'CANCELLED'
                            ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {r.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="p-3.5 text-slate-600 dark:text-slate-300">
                      {r.providerName || 'Searching...'}
                    </td>

                    <td className="p-3.5 font-black text-slate-900 dark:text-white">
                      ₹{r.totalPrice}
                    </td>

                    <td className="p-3.5 text-slate-400">
                      {new Date(r.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: REGISTERED CUSTOMERS */}
      {tab === 'users' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Registered Motorist Accounts
            </h3>
            <span className="text-xs text-slate-500">{customers.length} verified motorists</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Mobile</th>
                  <th className="p-3.5">Language</th>
                  <th className="p-3.5">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={c.avatarUrl}
                          alt={c.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="font-bold text-slate-900 dark:text-white">{c.name}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-500">{c.email}</td>
                    <td className="p-3.5 text-slate-700 dark:text-slate-300 font-mono">{c.phone}</td>
                    <td className="p-3.5 uppercase font-bold text-blue-600">{c.selectedLanguage}</td>
                    <td className="p-3.5 text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString([], {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
