import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';
import type { DropdownOptions } from '../types';

interface OptionsContextType {
  properties: string[];
  typeOfOperations: string[];
  typeOfPayments: string[];
  loading: boolean;
  error: string | null;
  refreshOptions: () => Promise<void>;
}

const OptionsContext = createContext<OptionsContextType | undefined>(undefined);

export function OptionsProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<string[]>([]);
  const [typeOfOperations, setTypeOfOperations] = useState<string[]>([]);
  const [typeOfPayments, setTypeOfPayments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOptions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getDropdownOptions();
      
      if (response.ok && response.data) {
        setProperties(response.data.properties || []);
        setTypeOfOperations(response.data.typeOfOperations || []);
        setTypeOfPayments(response.data.typeOfPayments || []);
      } else {
        throw new Error(response.error || 'Failed to fetch dropdown options');
      }
    } catch (err) {
      console.error('Failed to fetch dropdown options:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setProperties([]);
      setTypeOfOperations([]);
      setTypeOfPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const value: OptionsContextType = {
    properties,
    typeOfOperations,
    typeOfPayments,
    loading,
    error,
    refreshOptions: fetchOptions,
  };

  return (
    <OptionsContext.Provider value={value}>
      {children}
    </OptionsContext.Provider>
  );
}

export function useOptions() {
  const context = useContext(OptionsContext);
  if (context === undefined) {
    throw new Error('useOptions must be used within an OptionsProvider');
  }
  return context;
}
