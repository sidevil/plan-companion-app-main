import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface NewsArticle {
  id: number;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  time: string;
  description: string;
  imageUrl: string;
}

export const useNews = (category: string = 'general', country: string = 'us', rssUrl?: string) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use RSS feed if provided, otherwise use default news API
      if (rssUrl) {
        const { data, error: functionError } = await supabase.functions.invoke('fetch-rss', {
          body: { rssUrl }
        });

        if (functionError) {
          throw functionError;
        }

        if (data?.error) {
          throw new Error(data.error);
        }

        setArticles(data.articles);
      } else {
        const { data, error: functionError } = await supabase.functions.invoke('fetch-news', {
          body: { category, country }
        });

        if (functionError) {
          throw functionError;
        }

        if (data?.error) {
          throw new Error(data.error);
        }

        setArticles(data.articles);
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
      
      // Keep existing articles on error
      if (articles.length > 0) {
        console.log('Using cached news articles');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    
    // Refresh news every 15 minutes
    const interval = setInterval(fetchNews, 15 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [category, country, rssUrl]);

  return { articles, loading, error, refetch: fetchNews };
};
