// Vehicle data types and mock data

export type VehicleStatus = 'available' | 'maintenance' | 'cleaning' | 'out-of-service';
export type LogType = 'maintenance' | 'cleaning' | 'inspection' | 'damage' | 'fuel' | 'transfer' | 'other';
export type Company = 'europcar' | 'goldcar';

export interface VehicleLog {
  id: string;
  type: LogType;
  timestamp: string;
  user: string;
  notes: string;
  mileage?: number;
  photos?: string[];
  metadata?: {
    maintenanceType?: string;
    damageDescription?: string;
    fuelLevel?: number;
    cost?: number;
    location?: string;
    transferFrom?: string;
    transferTo?: string;
    [key: string]: any;
  };
}

export interface Vehicle {
  id: string;
  company: Company;
  plate: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  color: string;
  mileage: number;
  status: VehicleStatus;
  location: string;
  logs: VehicleLog[];
  images: string[];
  notes: string;
  lastService?: string;
  nextService?: string;
}

// Excel mapping interface
export interface ExcelMapping {
  plate?: string;
  vin?: string;
  make?: string;
  model?: string;
  year?: string;
  color?: string;
  mileage?: string;
  location?: string;
  status?: string;
}

// Mock data generator
export function createMockVehicles(): Vehicle[] {
  const makes = ['Toyota', 'BMW', 'Mercedes', 'Volkswagen', 'Audi', 'Ford', 'Hyundai', 'Nissan', 'Renault', 'Peugeot'];
  const models = {
    Toyota: ['Corolla', 'RAV4', 'Camry', 'Yaris', 'Aygo'],
    BMW: ['3 Series', 'X5', 'X3', 'Series 5', '1 Series'],
    Mercedes: ['C-Class', 'E-Class', 'GLA', 'A-Class', 'CLA'],
    Volkswagen: ['Golf', 'Passat', 'Tiguan', 'Polo', 'T-Roc'],
    Audi: ['A4', 'Q5', 'A3', 'Q3', 'A6'],
    Ford: ['Focus', 'Fiesta', 'Kuga', 'Mondeo', 'Puma'],
    Hyundai: ['i30', 'Tucson', 'i20', 'Kona', 'i10'],
    Nissan: ['Qashqai', 'Juke', 'Micra', 'X-Trail', 'Leaf'],
    Renault: ['Clio', 'Captur', 'Megane', 'Kadjar', 'Zoe'],
    Peugeot: ['208', '308', '2008', '3008', '508'],
  };
  
  const colors = ['White', 'Black', 'Silver', 'Blue', 'Red', 'Grey', 'Green'];
  const statuses: VehicleStatus[] = ['available', 'maintenance', 'cleaning', 'out-of-service'];
  const locations = ['Main Office', 'Airport', 'Downtown Branch', 'Service Center', 'Storage'];
  const companies: Company[] = ['europcar', 'goldcar'];

  const vehicles: Vehicle[] = [];

  for (let i = 0; i < 30; i++) {
    const make = makes[i % makes.length];
    const model = models[make as keyof typeof models][Math.floor(Math.random() * models[make as keyof typeof models].length)];
    const year = 2018 + Math.floor(Math.random() * 7);
    const mileage = 10000 + Math.floor(Math.random() * 90000);
    const status = statuses[i % statuses.length];
    const company = companies[i % 2];
    
    // Generate realistic logs
    const logs: VehicleLog[] = [];
    const logCount = 5 + Math.floor(Math.random() * 15);
    
    for (let j = 0; j < logCount; j++) {
      const daysAgo = j * (1 + Math.floor(Math.random() * 3));
      const timestamp = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
      
      const logTypes: LogType[] = ['cleaning', 'maintenance', 'inspection', 'fuel', 'transfer'];
      const logType = logTypes[Math.floor(Math.random() * logTypes.length)];
      
      let notes = '';
      let metadata: VehicleLog['metadata'] = {};
      
      switch (logType) {
        case 'cleaning':
          notes = ['Interior and exterior cleaning completed', 'Full detail wash', 'Quick interior vacuum', 'Deep cleaning service'][Math.floor(Math.random() * 4)];
          metadata.cost = 20 + Math.floor(Math.random() * 80);
          break;
        case 'maintenance':
          notes = ['Oil change completed', 'Tire rotation', 'Brake inspection', 'Regular service - 10k km', 'Air filter replacement'][Math.floor(Math.random() * 5)];
          metadata.maintenanceType = ['Oil Change', 'Tire Service', 'Brake Service', 'General Service'][Math.floor(Math.random() * 4)];
          metadata.cost = 50 + Math.floor(Math.random() * 450);
          break;
        case 'inspection':
          notes = ['Pre-delivery inspection passed', 'Monthly inspection completed', 'Safety check - no issues'][Math.floor(Math.random() * 3)];
          break;
        case 'fuel':
          notes = 'Vehicle refueled';
          metadata.fuelLevel = 100;
          metadata.cost = 40 + Math.floor(Math.random() * 60);
          break;
        case 'transfer':
          notes = 'Vehicle transferred between locations';
          metadata.transferFrom = locations[Math.floor(Math.random() * locations.length)];
          metadata.transferTo = locations[Math.floor(Math.random() * locations.length)];
          break;
      }
      
      logs.push({
        id: `log-${i}-${j}`,
        type: logType,
        timestamp,
        user: ['Admin', 'John Doe', 'Jane Smith', 'Mike Wilson'][Math.floor(Math.random() * 4)],
        notes,
        mileage: mileage - (logCount - j) * 100,
        metadata,
      });
    }

    const lastServiceDate = new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000);
    const nextServiceDate = new Date(lastServiceDate.getTime() + 180 * 24 * 60 * 60 * 1000);

    vehicles.push({
      id: `vehicle-${i}`,
      company,
      plate: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${1000 + i}`,
      vin: `VIN${year}${make.substring(0, 3).toUpperCase()}${String(i).padStart(8, '0')}`,
      make,
      model,
      year,
      color: colors[Math.floor(Math.random() * colors.length)],
      mileage,
      status,
      location: locations[Math.floor(Math.random() * locations.length)],
      logs: logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
      images: [],
      notes: '',
      lastService: lastServiceDate.toISOString(),
      nextService: nextServiceDate.toISOString(),
    });
  }

  return vehicles;
}
