import React, { useState } from 'react';
import { Car, Bike, Truck, Zap, Plus, Trash2, Edit2, CheckCircle2, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { storageService } from '../services/storageService';
import { Vehicle, VehicleType, FuelType } from '../types';

export const VehiclesView: React.FC = () => {
  const { currentUser } = useAuth();
  const [vehicles, setVehicles] = useState(() => storageService.getVehicles(currentUser.id));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Form State
  const [type, setType] = useState<VehicleType>('car');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [plateNumber, setPlateNumber] = useState('');
  const [fuelType, setFuelType] = useState<FuelType>('petrol');
  const [isDefault, setIsDefault] = useState(false);

  const reload = () => {
    setVehicles(storageService.getVehicles(currentUser.id));
  };

  const openAddModal = () => {
    setEditingVehicle(null);
    setType('car');
    setMake('');
    setModel('');
    setYear(2023);
    setPlateNumber('');
    setFuelType('petrol');
    setIsDefault(vehicles.length === 0);
    setIsModalOpen(true);
  };

  const openEditModal = (v: Vehicle) => {
    setEditingVehicle(v);
    setType(v.type);
    setMake(v.make);
    setModel(v.model);
    setYear(v.year);
    setPlateNumber(v.plateNumber);
    setFuelType(v.fuelType);
    setIsDefault(v.isDefault);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make.trim() || !model.trim() || !plateNumber.trim()) return;

    if (editingVehicle) {
      storageService.updateVehicle({
        ...editingVehicle,
        type,
        make,
        model,
        year: Number(year),
        plateNumber: plateNumber.toUpperCase(),
        fuelType,
        isDefault,
      });
    } else {
      storageService.addVehicle({
        userId: currentUser.id,
        type,
        make,
        model,
        year: Number(year),
        plateNumber: plateNumber.toUpperCase(),
        fuelType,
        isDefault,
      });
    }

    setIsModalOpen(false);
    reload();
  };

  const handleDelete = (id: string) => {
    storageService.deleteVehicle(id);
    reload();
  };

  const handleSetDefault = (v: Vehicle) => {
    storageService.updateVehicle({ ...v, isDefault: true });
    reload();
  };

  const getVehicleIcon = (t: VehicleType) => {
    if (t === 'bike') return Bike;
    if (t === 'truck') return Truck;
    if (t === 'ev') return Zap;
    return Car;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            My Registered Vehicles
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Registered vehicles receive priority technician matching and faster dispatch.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* Vehicle Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vehicles.map((v) => {
          const Icon = getVehicleIcon(v.type);
          return (
            <div
              key={v.id}
              className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition ${
                v.isDefault
                  ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">
                        {v.make} {v.model}
                      </h3>
                      {v.isDefault && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 mt-0.5">
                      {v.plateNumber}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(v)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Edit vehicle"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="p-1.5 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                    title="Delete vehicle"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span className="capitalize">
                  {v.year} • {v.fuelType} • {v.type}
                </span>
                {!v.isDefault && (
                  <button
                    onClick={() => handleSetDefault(v)}
                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingVehicle ? 'Edit Vehicle' : 'Register New Vehicle'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Vehicle Type
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['car', 'bike', 'truck', 'ev'] as VehicleType[]).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setType(t)}
                      className={`py-2 rounded-xl border text-center uppercase font-bold text-xs transition ${
                        type === t
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-600'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Brand / Make
                  </label>
                  <input
                    type="text"
                    required
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    placeholder="e.g. Hyundai, Honda"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Model
                  </label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. Creta, Classic 350"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Plate Number
                  </label>
                  <input
                    type="text"
                    required
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    placeholder="TN 07 BZ 4590"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 uppercase font-mono outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Fuel / Energy Type
                  </label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value as FuelType)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric (EV)</option>
                    <option value="cng">CNG</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="defaultCheck"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <label htmlFor="defaultCheck" className="text-slate-700 dark:text-slate-300 font-medium">
                  Set as primary roadside assistance vehicle
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
