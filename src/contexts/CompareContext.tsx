import { createContext, useContext, useState, ReactNode } from 'react';

interface ComparePackage {
  id: string;
  title: string;
  slug: string;
  price: number;
  duration_days: number;
  images: string[];
  destination: { name: string; country: string } | null;
}

interface CompareContextType {
  compareList: ComparePackage[];
  addToCompare: (pkg: ComparePackage) => void;
  removeFromCompare: (id: string) => void;
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<ComparePackage[]>([]);

  const addToCompare = (pkg: ComparePackage) => {
    if (compareList.length >= 3) return;
    if (compareList.some((p) => p.id === pkg.id)) return;
    setCompareList((prev) => [...prev, pkg]);
  };

  const removeFromCompare = (id: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== id));
  };

  const isInCompare = (id: string) => compareList.some((p) => p.id === id);

  const clearCompare = () => setCompareList([]);

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, isInCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
}
