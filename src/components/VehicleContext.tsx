import { createContext, useContext, useState, ReactNode } from 'react';
import { Vehicle, VehicleLog, createMockVehicles } from './vehicle-data';

interface VehicleContextType {
  vehicles: Vehicle[];
  setVehicles: (vehicles: Vehicle[]) => void;
  getVehicleById: (id: string) => Vehicle | undefined;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  addLogToVehicle: (vehicleId: string, log: Omit<VehicleLog, 'id'>) => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export function VehicleProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(createMockVehicles());

  const getVehicleById = (id: string) => {
    return vehicles.find(v => v.id === id);
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
  };

  const addLogToVehicle = (vehicleId: string, log: Omit<VehicleLog, 'id'>) => {
    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        const newLog: VehicleLog = {
          ...log,
          id: `log-${Date.now()}-${Math.random()}`,
        };
        return {
          ...v,
          logs: [newLog, ...v.logs],
          mileage: log.mileage || v.mileage,
        };
      }
      return v;
    }));
  };

  return (
    <VehicleContext.Provider value={{ vehicles, setVehicles, getVehicleById, updateVehicle, addLogToVehicle }}>
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicles() {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicles must be used within a VehicleProvider');
  }
  return context;
}
