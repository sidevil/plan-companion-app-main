import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  latestTradingDay: string;
}

export const useStocks = (symbols: string[] = ['AAPL', 'GOOGL', 'MSFT']) => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: functionError } = await supabase.functions.invoke('fetch-stocks', {
        body: { symbols }
      });

      if (functionError) {
        throw functionError;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setStocks(data.stocks);
    } catch (err) {
      console.error('Error fetching stocks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stocks');
      
      // Keep cached stock data on error
      if (stocks.length > 0) {
        console.log('Using cached stock data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
    
    // Refresh stocks every 5 minutes (respecting API rate limits)
    const interval = setInterval(fetchStocks, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [symbols.join(',')]);

  return { stocks, loading, error, refetch: fetchStocks };
};
