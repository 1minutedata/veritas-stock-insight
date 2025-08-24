import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { StockSearch } from "@/components/StockSearch";
import { StockCard } from "@/components/StockCard";
import { NewsCard } from "@/components/NewsCard";
import { AIAnalysis } from "@/components/AIAnalysis";
import { supabase } from "@/integrations/supabase/client";
import { Brain, Activity, Newspaper, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  dayHigh?: number;
  dayLow?: number;
  marketCap?: number;
  previousClose?: number;
}

interface NewsItem {
  title: string;
  summary: string;
  publisher: string;
  publishTime: number;
  link: string;
  uuid: string;
}

interface AnalysisData {
  analysis: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  valuation: 'overvalued' | 'undervalued' | 'fairly valued';
  stockData: StockData;
  timestamp: number;
}

const Index = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStock, setCurrentStock] = useState<StockData | null>(null);
  const [watchlist, setWatchlist] = useState<StockData[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);

  const handleStockSearch = async (symbol: string) => {
    setIsLoading(true);
    try {
      // Get stock data
      const { data: stockResponse, error: stockError } = await supabase.functions.invoke('financial-data', {
        body: { action: 'getStockData', symbol }
      });

      if (stockError) throw stockError;

      const stockData = stockResponse.stockData;
      setCurrentStock(stockData);

      // Get news
      const { data: newsResponse, error: newsError } = await supabase.functions.invoke('financial-data', {
        body: { action: 'getStockNews', symbol }
      });

      if (newsError) throw newsError;
      setNews(newsResponse.news);

      // Get AI analysis
      const { data: analysisResponse, error: analysisError } = await supabase.functions.invoke('financial-data', {
        body: { action: 'analyzeStock', symbol }
      });

      if (analysisError) throw analysisError;
      setAnalysis(analysisResponse);

      // Add to watchlist if not already there
      if (!watchlist.find(stock => stock.symbol === symbol)) {
        setWatchlist(prev => [stockData, ...prev.slice(0, 9)]);
      }

      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${symbol} with VeritasPilot AI`,
      });

    } catch (error) {
      console.error('Error fetching stock data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch stock data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadWatchlist = async () => {
    const defaultSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
    try {
      const { data: response, error } = await supabase.functions.invoke('financial-data', {
        body: { action: 'getMultipleStocks', symbols: defaultSymbols }
      });

      if (error) throw error;
      setWatchlist(response.stocks);
    } catch (error) {
      console.error('Error loading watchlist:', error);
    }
  };

  // Load default watchlist on component mount
  useEffect(() => {
    loadWatchlist();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-terminal">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-primary rounded-xl shadow-glow">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                VeritasPilot
              </h1>
              <p className="text-muted-foreground">AI-Powered Stock Analysis Co-pilot</p>
            </div>
          </div>
          
          <div className="flex justify-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Zap className="h-3 w-3" />
              Real-time Data
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Brain className="h-3 w-3" />
              AI Analysis
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <TrendingUp className="h-3 w-3" />
              Market Insights
            </Badge>
          </div>
        </div>

        {/* Search Section */}
        <Card className="p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Stock Analysis</h2>
          </div>
          <StockSearch onSearch={handleStockSearch} isLoading={isLoading} />
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {currentStock && (
              <StockCard stock={currentStock} />
            )}

            {analysis && (
              <AIAnalysis
                analysis={analysis.analysis}
                sentiment={analysis.sentiment}
                valuation={analysis.valuation}
                symbol={analysis.stockData.symbol}
                timestamp={analysis.timestamp}
              />
            )}

            {news.length > 0 && (
              <Card className="p-6 shadow-card">
                <div className="flex items-center gap-2 mb-4">
                  <Newspaper className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Latest News</h2>
                </div>
                <div className="space-y-4">
                  {news.map((item) => (
                    <NewsCard key={item.uuid} news={item} />
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Watchlist</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadWatchlist}
                  disabled={isLoading}
                >
                  Refresh
                </Button>
              </div>
              <div className="space-y-3">
                {watchlist.map((stock) => (
                  <StockCard
                    key={stock.symbol}
                    stock={stock}
                    onClick={() => handleStockSearch(stock.symbol)}
                  />
                ))}
              </div>
            </Card>

            <Card className="p-6 shadow-card">
              <h3 className="font-semibold mb-3">About VeritasPilot</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Advanced AI-powered stock analysis platform providing:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Real-time market data</li>
                  <li>• AI sentiment analysis</li>
                  <li>• Valuation insights</li>
                  <li>• News aggregation</li>
                  <li>• Risk assessment</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
