import { useAuth } from "@/contexts/AuthContext";
import { LandingNavbar } from "@/components/LandingNavbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { PricingSection } from "@/components/PricingSection";
import { useState, useEffect } from "react";
import { StockSearch } from "@/components/StockSearch";
import { StockCard } from "@/components/StockCard";
import { NewsCard } from "@/components/NewsCard";
import { AIAnalysis } from "@/components/AIAnalysis";
import SubscriptionCard from "@/components/SubscriptionCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TrendingUp, DollarSign, BarChart3, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

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

const Index = () => {
  const { user } = useAuth();
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  // Load default stocks on component mount
  useEffect(() => {
    if (user) {
      loadMultipleStocks();
    }
  }, [user]);

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
      
      if (data) {
        setSelectedStock(data);
        
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

  // Landing page for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
        <LandingNavbar />
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        
        {/* Footer */}
        <footer className="py-12 border-t border-border/50 bg-card/20 backdrop-blur-sm">
          <div className="container mx-auto px-6 text-center">
            <p className="text-muted-foreground">
              © 2024 VeritasPilot. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // Dashboard for authenticated users
  return (
    <div className="min-h-screen bg-gradient-terminal">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            VeritasPilot Terminal
          </h1>
          <p className="text-muted-foreground">AI-powered financial analysis and market insights</p>
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

        <StockSearch onSearch={handleStockSelect} />
        
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

        {selectedStock && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <StockCard stock={selectedStock} />
              
              {analysis && (
                <AIAnalysis {...analysis} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
