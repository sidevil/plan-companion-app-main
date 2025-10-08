import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Loader2, AlertCircle } from 'lucide-react';
import { useStocks } from '@/hooks/useStocks';

interface StockWidgetProps {
  config?: {
    symbols?: string;
    showChart?: boolean;
  };
}

export const StockWidget: React.FC<StockWidgetProps> = ({ config = {} }) => {
  const symbolsString = config.symbols || 'AAPL,GOOGL,MSFT';
  const symbols = symbolsString.split(',').map(s => s.trim()).filter(Boolean);
  const { stocks, loading, error } = useStocks(symbols);

  if (loading) {
    return (
      <>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-accent" />
            Stock Market
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </CardContent>
      </>
    );
  }

  if (error) {
    return (
      <>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-accent" />
            Stock Market
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-32 gap-2">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-sm text-muted-foreground">Unable to load stock data</p>
        </CardContent>
      </>
    );
  }
  return (
    <>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-accent" />
          Stock Market
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          {stocks.map((stock) => (
            <div key={stock.symbol} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-sm">{stock.symbol}</span>
                <span className="text-sm text-foreground">${stock.price}</span>
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                stock.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stock.change >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{stock.change >= 0 ? '+' : ''}{stock.change}</span>
                <span>({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%)</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center pt-2">
          <button className="text-sm text-accent hover:text-accent/80 font-medium transition-colors">
            View Portfolio →
          </button>
        </div>
      </CardContent>
    </>
  );
};