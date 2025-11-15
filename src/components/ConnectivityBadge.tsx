import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { apiService } from '../services/api';
import { COLORS } from '../config/theme';

interface ConnectivityBadgeProps {
  style?: any;
}

export function ConnectivityBadge({ style }: ConnectivityBadgeProps) {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [checking, setChecking] = useState(false);

  const checkHealth = async () => {
    if (checking) return;
    
    try {
      setChecking(true);
      const result = await apiService.getHealth();
      setIsHealthy(result.ok);
      setLastCheck(new Date());
    } catch (error) {
      // Silently handle API errors - don't show error messages
      // Just update badge to show offline status
      console.debug('Health check failed (offline mode):', error);
      setIsHealthy(false);
      setLastCheck(new Date());
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
    
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getBadgeColor = () => {
    if (checking) return COLORS.TEXT_SECONDARY;
    if (isHealthy === null) return COLORS.TEXT_SECONDARY;
    return isHealthy ? '#10b981' : '#ef4444'; // green-500 : red-500
  };

  const getStatusText = () => {
    if (checking) return 'Checking...';
    if (isHealthy === null) return 'Unknown';
    return isHealthy ? 'Online' : 'Offline';
  };

  return (
    <TouchableOpacity 
      onPress={checkHealth}
      style={[styles.container, style]}
      disabled={checking}
    >
      <View style={[styles.dot, { backgroundColor: getBadgeColor() }]} />
      <Text style={styles.statusText}>
        {getStatusText()}
      </Text>
      {lastCheck && (
        <Text style={styles.timeText}>
          ({lastCheck.toLocaleTimeString()})
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: 'Aileron',
  },
  timeText: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
    marginLeft: 4,
    fontFamily: 'Aileron',
  },
});