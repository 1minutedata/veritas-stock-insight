import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { StockSearch } from "@/components/StockSearch";
import { StockCard } from "@/components/StockCard";
import { NewsCard } from "@/components/NewsCard";
import { AIAnalysis } from "@/components/AIAnalysis";
import SubscriptionCard from "@/components/SubscriptionCard";
import LangflowChat from "@/components/LangflowChat";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TrendingUp, DollarSign, BarChart3, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigate, Link } from "react-router-dom";

interface Stock {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

interface NewsItem {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  sentiment?: 'bullish' | 'bearish' | 'neutral';
}

interface Analysis {
  analysis: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  valuation: 'overvalued' | 'undervalued' | 'fairly valued';
  symbol: string;
  timestamp: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  // Redirect to auth if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Load default stocks on component mount
  useEffect(() => {
    loadMultipleStocks();
  }, []);

  const loadMultipleStocks = async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase.functions.invoke('financial-data', {
        body: {
          action: 'getMultipleStocks',
          symbols: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA']
        }
      });

      if (error) throw error;
      
      if (data?.stocks) {
        setStocks(data.stocks);
      }
    } catch (error) {
      console.error('Error loading stocks:', error);
      toast({
        title: "Error",
        description: "Failed to load stock data",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleStockSelect = async (symbol: string) => {
    setLoading(true);
    setNews([]);
    setAnalysis(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('financial-data', {
        body: { action: 'getStockData', symbol }
      });

      if (error) throw error;
      
      if (data && data.stockData) {
        setSelectedStock(data.stockData);
        
        // Load news
        const newsResponse = await supabase.functions.invoke('financial-data', {
          body: { action: 'getStockNews', symbol }
        });
        
        if (newsResponse.data?.news) {
          setNews(newsResponse.data.news);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load stock data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (symbol: string) => {
    setAnalysisLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('financial-data', {
        body: { action: 'analyzeStock', symbol }
      });

      if (error) throw error;
      
      if (data) {
        setAnalysis({
          analysis: data.analysis,
          sentiment: data.sentiment,
          valuation: data.valuation,
          symbol,
          timestamp: Date.now()
        });
        
        toast({
          title: "Analysis Complete",
          description: "AI analysis has been generated successfully",
        });
      }
    } catch (error) {
      console.error('Error analyzing stock:', error);
      toast({
        title: "Analysis Error",
        description: "Failed to generate AI analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalysisLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Live Market Insights</h1>
            <p className="text-muted-foreground">Real-time data and AI-powered analysis</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/integrations">
              <Button className="px-5">Manage Integrations</Button>
            </Link>
          </div>
        </header>

        <SubscriptionCard />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 border border-border bg-card/50">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-bullish" />
              <div>
                <p className="text-sm text-muted-foreground">Market Status</p>
                <p className="text-lg font-semibold text-bullish">Active</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 border border-border bg-card/50">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Portfolio Value</p>
                <p className="text-lg font-semibold">$124,532</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 border border-border bg-card/50">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-bullish" />
              <div>
                <p className="text-sm text-muted-foreground">Today's Gain</p>
                <p className="text-lg font-semibold text-bullish">+$2,341</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 border border-border bg-card/50">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
                <p className="text-lg font-semibold">7</p>
              </div>
            </div>
          </Card>
        </div>

        <StockSearch onSearch={handleStockSelect} isLoading={loading} />
        
        {stocks.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Market Overview</h2>
              <button
                onClick={loadMultipleStocks}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50"
              >
                {refreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <TrendingUp className="h-4 w-4" />
                )}
                Refresh
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stocks.map((stock) => (
                <StockCard 
                  key={stock.symbol} 
                  stock={stock}
                  onClick={() => handleStockSelect(stock.symbol)}
                />
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {selectedStock && (
              <>
                <div className="space-y-4">
                  <StockCard stock={selectedStock} />
                  
                  <Card className="p-6 shadow-card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">AI Analysis</h3>
                      <button
                        onClick={() => handleAnalyze(selectedStock.symbol)}
                        disabled={analysisLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50"
                      >
                        {analysisLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Analyze with AI"
                        )}
                      </button>
                    </div>
                    
                    {analysis && (
                      <AIAnalysis {...analysis} />
                    )}
                  </Card>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Latest News</h3>
                  {news.map((item, index) => (
                    <NewsCard 
                      key={index} 
                      news={{
                        title: item.title,
                        summary: item.description || "",
                        publisher: item.source || "Unknown",
                        publishTime: (item as any).publishTime ?? (item.publishedAt ? Math.floor(new Date(item.publishedAt).getTime() / 1000) : Math.floor(Date.now() / 1000)),
                        link: item.url || (item as any).link || "#",
                        uuid: `${index}-${item.title}`
                      }} 
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          
          <div className="lg:col-span-1">
            <LangflowChat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;