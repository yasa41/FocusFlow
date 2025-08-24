// hooks/useDashboard.js - FIXED VERSION
import { useState, useEffect } from 'react';
import { getUserDashboard } from '../services/api';

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ DEFINE fetchDashboard OUTSIDE useEffect so it can be reused
  const fetchDashboard = async () => {
    try {
      console.log('🚀 Calling /dashboard endpoint...');
      const response = await getUserDashboard();
      console.log('📊 Dashboard data received:', response.data);
      
      if (response.data.success) {
        setDashboardData(response.data.dashboard);
        setError(null);
      } else {
        setError(response.data.message || 'Failed to load dashboard');
      }
    } catch (err) {
      console.error('❌ Dashboard API error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // ✅ useEffect calls the function that's now accessible
  useEffect(() => {
    fetchDashboard(); // This runs automatically when component mounts
  }, []); // Empty array = run once on mount

  // ✅ refetch function can now access fetchDashboard
  const refetch = () => {
    setLoading(true);
    setError(null);
    fetchDashboard(); // This will work now
  };

  return { dashboardData, loading, error, refetch };
};
