import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';

const CACHE_KEY = '@bookmate:dropdown_options';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

interface CachedOptions {
  data: {
    properties: string[];
    typeOfOperations: string[];
    typeOfPayments: string[];
    months: string[];
  };
  timestamp: number;
}

interface OptionsContextType {
  properties: string[];
  typeOfOperations: string[];
  typeOfPayments: string[];
  months: string[];
  loading: boolean;
  error: string | null;
  refreshOptions: () => Promise<void>;
}

const OptionsContext = createContext<OptionsContextType | undefined>(undefined);

export function OptionsProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<string[]>([]);
  const [typeOfOperations, setTypeOfOperations] = useState<string[]>([]);
  const [typeOfPayments, setTypeOfPayments] = useState<string[]>([]);
  const [months, setMonths] = useState<string[]>([]);
  const [loading, setLoading] = useState(false); // Changed to false - don't block rendering
  const [error, setError] = useState<string | null>(null);

  const loadFromCache = async (): Promise<boolean> => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (!cached) return false;

      const cachedData: CachedOptions = JSON.parse(cached);
      const now = Date.now();
      
      // Check if cache is still valid (within 1 hour)
      if (now - cachedData.timestamp < CACHE_DURATION) {
        console.log('📦 Using cached dropdown options');
        setProperties(cachedData.data.properties || []);
        setTypeOfOperations(cachedData.data.typeOfOperations || []);
        setTypeOfPayments(cachedData.data.typeOfPayments || []);
        setMonths(cachedData.data.months || []);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Failed to load cached options:', err);
      return false;
    }
  };

  const saveToCache = async (data: CachedOptions['data']) => {
    try {
      const cacheData: CachedOptions = {
        data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      console.log('💾 Cached dropdown options');
    } catch (err) {
      console.error('Failed to cache options:', err);
    }
  };

  const fetchOptions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 OptionsContext: Fetching fresh dropdown options...');
      
      const response = await apiService.getDropdownOptions();
      
      if (response.ok && response.data) {
        const data = {
          properties: response.data.properties || [],
          typeOfOperations: response.data.typeOfOperations || [],
          typeOfPayments: response.data.typeOfPayments || [],
          months: response.data.months || [],
        };
        
        setProperties(data.properties);
        setTypeOfOperations(data.typeOfOperations);
        setTypeOfPayments(data.typeOfPayments);
        setMonths(data.months);
        
        // Cache the fresh data
        await saveToCache(data);
        
        console.log('✅ OptionsContext: Options loaded for account');
        console.log('   Properties:', data.properties);
      } else {
        throw new Error(response.error || 'Failed to fetch dropdown options');
      }
    } catch (err) {
      console.error('Failed to fetch dropdown options:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // On error, try to use cache if available
      const hasCache = await loadFromCache();
      if (!hasCache) {
        setProperties([]);
        setTypeOfOperations([]);
        setTypeOfPayments([]);
        setMonths([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      // First, try to load from cache (instant)
      const hasCache = await loadFromCache();
      
      // Then fetch fresh data in background (updates when ready)
      await fetchOptions();
    };
    
    initialize();
  }, []);

  const value: OptionsContextType = {
    properties,
    typeOfOperations,
    typeOfPayments,
    months,
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
