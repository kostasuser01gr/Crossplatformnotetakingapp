import { createContext, useContext, useState, ReactNode } from 'react';

export interface Photo {
  id: string;
  url: string;
  vehicleId: string;
  vehiclePlate: string;
  timestamp: string;
  logType?: string;
  notes?: string;
  mileage?: number;
  company?: 'europcar' | 'goldcar';
}

interface PhotoContextType {
  photos: Photo[];
  addPhotos: (newPhotos: Photo[]) => void;
  getPhotosByVehicle: (vehicleId: string) => Photo[];
  getPhotosByCompany: (company: 'europcar' | 'goldcar') => Photo[];
  getAllPhotos: () => Photo[];
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export function PhotoProvider({ children }: { children: ReactNode }) {
  const [photos, setPhotos] = useState<Photo[]>([]);

  const addPhotos = (newPhotos: Photo[]) => {
    setPhotos(prev => [...newPhotos, ...prev]);
  };

  const getPhotosByVehicle = (vehicleId: string) => {
    return photos.filter(photo => photo.vehicleId === vehicleId);
  };

  const getPhotosByCompany = (company: 'europcar' | 'goldcar') => {
    return photos.filter(photo => photo.company === company);
  };

  const getAllPhotos = () => {
    return photos;
  };

  return (
    <PhotoContext.Provider value={{ photos, addPhotos, getPhotosByVehicle, getPhotosByCompany, getAllPhotos }}>
      {children}
    </PhotoContext.Provider>
  );
}

export function usePhotos() {
  const context = useContext(PhotoContext);
  if (!context) {
    throw new Error('usePhotos must be used within a PhotoProvider');
  }
  return context;
}
