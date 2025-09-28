import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, Activity, BarChart3, AlertCircle, Target } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";

const LyticalAnalyzer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tradesData, setTradesData] = useState<any>(null);
  const [lastTradeData, setLastTradeData] = useState<any>(null);
  const [quotesData, setQuotesData] = useState<any>(null);
  const [smaData, setSmaData] = useState<any>(null);
  const [rsiData, setRsiData] = useState<any>(null);
  const [ticker, setTicker] = useState("AAPL");
  const [dateRange, setDateRange] = useState({ from: "2024-01-01", to: "2024-01-02" });

  const API_KEY = "bPZA8eqxhGpk2xoKB2RPj8FIY7giprqD";

  const fetchTrades = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.polygon.io/v3/trades/${ticker}?timestamp.gte=${dateRange.from}&timestamp.lt=${dateRange.to}&limit=50&apiKey=${API_KEY}`
      );
      const data = await response.json();
      setTradesData(data);
      toast.success("Trades data fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch trades data");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLastTrade = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.polygon.io/v2/last/trade/${ticker}?apiKey=${API_KEY}`
      );
      const data = await response.json();
      setLastTradeData(data);
      toast.success("Last trade data fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch last trade data");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQuotes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.polygon.io/v3/quotes/${ticker}?timestamp.gte=${dateRange.from}&timestamp.lt=${dateRange.to}&limit=50&apiKey=${API_KEY}`
      );
      const data = await response.json();
      setQuotesData(data);
      toast.success("Quotes data fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch quotes data");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSMA = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.polygon.io/v1/indicators/sma/${ticker}?timestamp.gte=${dateRange.from}&timestamp.lt=${dateRange.to}&timespan=day&adjusted=true&window=20&series_type=close&limit=120&apiKey=${API_KEY}`
      );
      const data = await response.json();
      setSmaData(data);
      toast.success("SMA data fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch SMA data");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRSI = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.polygon.io/v1/indicators/rsi/${ticker}?timestamp.gte=${dateRange.from}&timestamp.lt=${dateRange.to}&timespan=day&adjusted=true&window=14&series_type=close&limit=120&apiKey=${API_KEY}`
      );
      const data = await response.json();
      setRsiData(data);
      toast.success("RSI data fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch RSI data");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    }).format(price);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Layout>
      <div className="space-y-6 grid-pattern min-h-screen">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Lytical Analyzer
            </h1>
            <p className="text-muted-foreground">Advanced financial data analysis using Polygon API</p>
          </div>
        </div>

        <Card className="border-glow bg-gradient-card">
          <CardHeader>
            <CardTitle>Stock Analysis Configuration</CardTitle>
            <CardDescription>Configure ticker and date range for analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Stock Ticker</label>
                <Input
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  placeholder="AAPL"
                  className="input-tech"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">From Date</label>
                <Input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                  className="input-tech"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">To Date</label>
                <Input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                  className="input-tech"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="trades" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-secondary/50">
            <TabsTrigger value="trades" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Trades</TabsTrigger>
            <TabsTrigger value="lasttrade" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Last Trade</TabsTrigger>
            <TabsTrigger value="quotes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Quotes</TabsTrigger>
            <TabsTrigger value="sma" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">SMA</TabsTrigger>
            <TabsTrigger value="rsi" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">RSI</TabsTrigger>
          </TabsList>

          <TabsContent value="trades" className="space-y-4">
            <Card className="border-glow bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Stock Trades
                </CardTitle>
                <CardDescription>
                  Real-time trade data showing executed transactions with price, size, and timestamps
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={fetchTrades} 
                  disabled={isLoading}
                  className="bg-gradient-primary hover:shadow-intense"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Fetch Trades Data
                </Button>
                
                {tradesData && (
                  <div className="space-y-4">
                    <Badge variant="secondary" className="bg-primary/20 text-primary">
                      Status: {tradesData.status} | Results: {tradesData.results?.length || 0}
                    </Badge>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                      {tradesData.results?.slice(0, 12).map((trade: any, index: number) => (
                        <Card key={index} className="border-glow bg-card/50 backdrop-blur">
                          <CardContent className="p-4 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Price</span>
                              <span className="font-bold text-primary text-lg">
                                {formatPrice(trade.price)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Size:</span>
                              <span className="font-medium">{trade.size?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Exchange:</span>
                              <span className="font-medium">{trade.exchange}</span>
                            </div>
                            <div className="text-xs text-muted-foreground border-t border-border/50 pt-2">
                              {formatTimestamp(trade.participant_timestamp)}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lasttrade" className="space-y-4">
            <Card className="border-glow bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Last Trade
                </CardTitle>
                <CardDescription>
                  Most recent trade information for the specified stock
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={fetchLastTrade} 
                  disabled={isLoading}
                  className="bg-gradient-primary hover:shadow-intense"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Fetch Last Trade
                </Button>
                
                {lastTradeData && lastTradeData.status === "OK" && (
                  <Card className="border-glow bg-card/50 backdrop-blur max-w-md">
                    <CardHeader>
                      <CardTitle className="text-xl">{ticker} - Last Trade</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Price:</span>
                          <span className="font-bold text-primary text-2xl">
                            {formatPrice(lastTradeData.results?.price)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Size:</span>
                          <span className="font-medium">
                            {lastTradeData.results?.size?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Exchange:</span>
                          <span className="font-medium">
                            {lastTradeData.results?.exchange}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground border-t border-border/50 pt-2">
                          {formatTimestamp(lastTradeData.results?.timestamp)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quotes" className="space-y-4">
            <Card className="border-glow bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Stock Quotes (Bid/Ask)
                </CardTitle>
                <CardDescription>
                  Real-time bid and ask quotes showing market depth and spread
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={fetchQuotes} 
                  disabled={isLoading}
                  className="bg-gradient-primary hover:shadow-intense"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Fetch Quotes Data
                </Button>
                
                {quotesData && (
                  <div className="space-y-4">
                    <Badge variant="secondary" className="bg-primary/20 text-primary">
                      Status: {quotesData.status} | Results: {quotesData.results?.length || 0}
                    </Badge>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                      {quotesData.results?.slice(0, 12).map((quote: any, index: number) => (
                        <Card key={index} className="border-glow bg-card/50 backdrop-blur">
                          <CardContent className="p-4 space-y-2">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <span className="text-xs text-muted-foreground">BID</span>
                                <div className="text-green-400 font-bold">
                                  {formatPrice(quote.bid)}
                                </div>
                                <div className="text-xs">Size: {quote.bid_size}</div>
                              </div>
                              <div className="space-y-1">
                                <span className="text-xs text-muted-foreground">ASK</span>
                                <div className="text-red-400 font-bold">
                                  {formatPrice(quote.ask)}
                                </div>
                                <div className="text-xs">Size: {quote.ask_size}</div>
                              </div>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-border/50">
                              <span className="text-xs">Spread:</span>
                              <span className="text-xs font-medium text-primary">
                                {formatPrice(quote.ask - quote.bid)}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatTimestamp(quote.participant_timestamp)}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sma" className="space-y-4">
            <Card className="border-glow bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Simple Moving Average (SMA)
                </CardTitle>
                <CardDescription>
                  20-period simple moving average for trend analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={fetchSMA} 
                  disabled={isLoading}
                  className="bg-gradient-primary hover:shadow-intense"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Fetch SMA Data
                </Button>
                
                {smaData && (
                  <div className="space-y-4">
                    <Badge variant="secondary" className="bg-primary/20 text-primary">
                      Status: {smaData.status} | Results: {smaData.results?.values?.length || 0}
                    </Badge>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {smaData.results?.values?.slice(0, 8).map((sma: any, index: number) => (
                        <Card key={index} className="border-glow bg-card/50 backdrop-blur">
                          <CardContent className="p-4 text-center space-y-2">
                            <div className="text-2xl font-bold text-primary">
                              {formatPrice(sma.value)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(sma.timestamp).toLocaleDateString()}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rsi" className="space-y-4">
            <Card className="border-glow bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Relative Strength Index (RSI)
                </CardTitle>
                <CardDescription>
                  14-period RSI indicator for momentum analysis (0-100 scale)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={fetchRSI} 
                  disabled={isLoading}
                  className="bg-gradient-primary hover:shadow-intense"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Fetch RSI Data
                </Button>
                
                {rsiData && (
                  <div className="space-y-4">
                    <Badge variant="secondary" className="bg-primary/20 text-primary">
                      Status: {rsiData.status} | Results: {rsiData.results?.values?.length || 0}
                    </Badge>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {rsiData.results?.values?.slice(0, 8).map((rsi: any, index: number) => (
                        <Card key={index} className="border-glow bg-card/50 backdrop-blur">
                          <CardContent className="p-4 text-center space-y-2">
                            <div className={`text-2xl font-bold ${
                              rsi.value > 70 ? 'text-red-400' : 
                              rsi.value < 30 ? 'text-green-400' : 
                              'text-primary'
                            }`}>
                              {rsi.value?.toFixed(2)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(rsi.timestamp).toLocaleDateString()}
                            </div>
                            <div className="text-xs">
                              {rsi.value > 70 ? 'Overbought' : 
                               rsi.value < 30 ? 'Oversold' : 
                               'Neutral'}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default LyticalAnalyzer;