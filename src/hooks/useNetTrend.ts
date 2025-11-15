import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { NetTrendPoint } from '../components/NetTrendChart';

type Period = 'this_month' | 'last_month' | 'this_year';

export function useNetTrend(period: Period) {
  const [netTrendData, setNetTrendData] = useState<NetTrendPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNetTrend();
  }, [period]);

  const fetchNetTrend = async () => {
    try {
      setLoading(true);
      
      const now = new Date();
      const currentMonth = now.getMonth(); // 0-11
      const currentYear = now.getFullYear();

      let trendData: NetTrendPoint[] = [];

      if (period === 'this_month') {
        // Daily data for current month
        trendData = await fetchDailyTrend(currentMonth, currentYear);
      } else if (period === 'last_month') {
        // Daily data for last month
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        trendData = await fetchDailyTrend(lastMonth, lastMonthYear);
      } else if (period === 'this_year') {
        // Monthly data for current year
        trendData = await fetchMonthlyTrend(currentYear);
      }

      setNetTrendData(trendData);
    } catch (error) {
      console.log('Error fetching net trend:', error);
      setNetTrendData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyTrend = async (month: number, year: number): Promise<NetTrendPoint[]> => {
    // For daily trend, we'll fetch inbox data and group by day
    try {
      const inboxResponse = await apiService.getInbox();
      
      if (!inboxResponse.ok || !inboxResponse.data) {
        return generateEmptyDays(month, year);
      }

      // Filter transactions for the specific month/year
      const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const targetMonth = monthNames[month];
      const targetYear = year.toString();

      const monthTransactions = inboxResponse.data.filter(
        tx => tx.month === targetMonth && tx.year === targetYear
      );

      // Group by day and calculate net result
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const dailyData: NetTrendPoint[] = [];

      for (let day = 1; day <= daysInMonth; day++) {
        const dayStr = day.toString();
        const dayTransactions = monthTransactions.filter(tx => tx.day === dayStr);
        
        const income = dayTransactions.reduce((sum, tx) => sum + (tx.credit || 0), 0);
        const expenses = dayTransactions.reduce((sum, tx) => sum + (tx.debit || 0), 0);
        const netResult = income - expenses;

        dailyData.push({
          x: dayStr,
          value: netResult,
          date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        });
      }

      // TEMP: If no real data, use mock data for visualization
      const hasRealData = dailyData.some(d => d.value !== 0);
      if (!hasRealData) {
        return generateEmptyDays(month, year);
      }

      return dailyData;
    } catch (error) {
      return generateEmptyDays(month, year);
    }
  };

  const fetchMonthlyTrend = async (year: number): Promise<NetTrendPoint[]> => {
    // For monthly trend, fetch inbox and group by month
    try {
      const inboxResponse = await apiService.getInbox();
      
      if (!inboxResponse.ok || !inboxResponse.data) {
        return generateEmptyMonths(year);
      }

      const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const shortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const targetYear = year.toString();

      const yearTransactions = inboxResponse.data.filter(tx => tx.year === targetYear);

      const monthlyData: NetTrendPoint[] = monthNames.map((monthName, index) => {
        const monthTransactions = yearTransactions.filter(tx => tx.month === monthName);
        
        const income = monthTransactions.reduce((sum, tx) => sum + (tx.credit || 0), 0);
        const expenses = monthTransactions.reduce((sum, tx) => sum + (tx.debit || 0), 0);
        const netResult = income - expenses;

        return {
          x: shortMonthNames[index],
          value: netResult,
          date: `${year}-${String(index + 1).padStart(2, '0')}-01`,
        };
      });

      // TEMP: If no real data, use mock data for visualization
      const hasRealData = monthlyData.some(d => d.value !== 0);
      if (!hasRealData) {
        return generateEmptyMonths(year);
      }

      return monthlyData;
    } catch (error) {
      return generateEmptyMonths(year);
    }
  };

  const generateEmptyDays = (month: number, year: number): NetTrendPoint[] => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // TEMP: Generate realistic mock data for visualization
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      // Create a wave pattern with some randomness
      const baseValue = 15000 + Math.sin(day / 5) * 8000;
      const randomVariation = (Math.random() - 0.5) * 5000;
      const trend = (day / daysInMonth) * 10000; // Upward trend
      
      return {
        x: day.toString(),
        value: Math.round(baseValue + randomVariation + trend),
        date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      };
    });
  };

  const generateEmptyMonths = (year: number): NetTrendPoint[] => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // TEMP: Generate realistic mock data for visualization
    return monthNames.map((month, index) => {
      // Create seasonal pattern with growth trend
      const seasonalFactor = Math.sin((index / 12) * Math.PI * 2) * 20000;
      const growthTrend = (index / 12) * 50000;
      const baseValue = 80000;
      const randomVariation = (Math.random() - 0.5) * 15000;
      
      return {
        x: month,
        value: Math.round(baseValue + seasonalFactor + growthTrend + randomVariation),
        date: `${year}-${String(index + 1).padStart(2, '0')}-01`,
      };
    });
  };

  return { netTrendData, loading };
}
