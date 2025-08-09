import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const useConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(apiService.isOnline());
  const [lastChecked, setLastChecked] = useState(null);
  const [serverStatus, setServerStatus] = useState('unknown');

  useEffect(() => {
    // Listen for connection changes
    const unsubscribe = apiService.onConnectionChange((online) => {
      setIsOnline(online);
      setLastChecked(new Date());
      
      if (online) {
        // Test server connection when coming back online
        testServerConnection();
      } else {
        setServerStatus('offline');
      }
    });

    // Initial server test
    testServerConnection();

    return unsubscribe;
  }, []);

  const testServerConnection = async () => {
    try {
      const result = await apiService.testConnection();
      setServerStatus(result.success ? 'online' : 'error');
      setLastChecked(new Date());
    } catch (error) {
      setServerStatus('error');
      setLastChecked(new Date());
    }
  };

  return {
    isOnline,
    serverStatus,
    lastChecked,
    testConnection: testServerConnection
  };
};
