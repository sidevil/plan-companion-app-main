import React, { useState, useEffect } from 'react';
import { DraggableWidgetGrid } from '@/components/widgets/DraggableWidgetGrid';
import { useWidgets } from '@/contexts/WidgetContext';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const { widgets, updateWidget } = useWidgets();
  const { user } = useAuth();
  const { profile, loading } = useProfile();
  const [currentPage, setCurrentPage] = useState(1);
  const enabledWidgets = widgets.filter(w => w.enabled);
  const [quote, setQuote] = useState<string>("Believe in yourself and all that you are.");
  
  // Calculate total pages
  const totalPages = enabledWidgets.length > 0 
    ? Math.max(...enabledWidgets.map(w => w.page || 1))
    : 1;
  
  // Filter widgets for current page
  const currentPageWidgets = enabledWidgets.filter(w => (w.page || 1) === currentPage);

  useEffect(() => {
    const fetchDailyQuote = async () => {
      const today = new Date().toDateString();
      const cachedQuote = localStorage.getItem('dailyQuote');
      const cachedDate = localStorage.getItem('dailyQuoteDate');

      if (cachedQuote && cachedDate === today) {
        setQuote(cachedQuote);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('generate-quote');
        
        if (error) throw error;
        
        if (data?.quote) {
          setQuote(data.quote);
          localStorage.setItem('dailyQuote', data.quote);
          localStorage.setItem('dailyQuoteDate', today);
        }
      } catch (error) {
        console.error('Error fetching quote:', error);
      }
    };

    fetchDailyQuote();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const displayName = profile?.display_name || user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User';
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          {greeting}, {displayName}!
        </h1>
        <p className="text-muted-foreground italic">
          "{quote}"
        </p>
      </div>

      {/* Quick Actions */}
      {enabledWidgets.length === 0 && (
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          <Link to="/widgets">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Widget
            </Button>
          </Link>
          <Link to="/smarthome">
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Setup Smart Home
            </Button>
          </Link>
        </div>
      )}

      {/* Widget Grid */}
      {enabledWidgets.length > 0 ? (
        <>
          <DraggableWidgetGrid currentPage={currentPage} />
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="fixed bottom-20 left-0 right-0 flex items-center justify-center gap-4 pb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="h-8 w-8 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-2 w-2 rounded-full transition-all ${
                      page === currentPage
                        ? 'bg-primary w-6'
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                    aria-label={`Go to page ${page}`}
                  />
                ))}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="h-8 w-8 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🪞</div>
          <p className="text-muted-foreground mb-4 text-lg">Your mirror is ready to be personalized!</p>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Add widgets to see your calendar, weather, news, and control your smart home devices all in one place.
          </p>
        </div>
      )}
    </div>
  );
};

export default Index;
