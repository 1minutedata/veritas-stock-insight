import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, DollarSign, BarChart3, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";

const LyticalAnalyzer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [inflationData, setInflationData] = useState<any>(null);
  const [inflationExpectations, setInflationExpectations] = useState<any>(null);
  const [optionsData, setOptionsData] = useState<any>(null);
  const [dailyData, setDailyData] = useState<any>(null);
  const [optionsTicker, setOptionsTicker] = useState("O:SPY251219C00650000");
  const [dateRange, setDateRange] = useState({ from: "2023-01-09", to: "2023-02-10" });

  const API_KEY = "bPZA8eqxhGpk2xoKB2RPj8FIY7giprqD";

  const fetchInflationData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.polygon.io/fed/v1/inflation?limit=100&sort=date.asc&apiKey=${API_KEY}`
      );
      const data = await response.json();
      setInflationData(data);
      toast.success("Inflation data fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch inflation data");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInflationExpectations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.polygon.io/fed/v1/inflation-expectations?limit=100&sort=date.asc&apiKey=${API_KEY}`
      );
      const data = await response.json();
      setInflationExpectations(data);
      toast.success("Inflation expectations fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch inflation expectations");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOptionsAggregates = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/${optionsTicker}/range/1/day/${dateRange.from}/${dateRange.to}?adjusted=true&sort=asc&limit=120&apiKey=${API_KEY}`
      );
      const data = await response.json();
      setOptionsData(data);
      toast.success("Options aggregates fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch options aggregates");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDailyTickerSummary = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.polygon.io/v1/open-close/${optionsTicker}/${dateRange.from}?adjusted=true&apiKey=${API_KEY}`
      );
      const data = await response.json();
      setDailyData(data);
      toast.success("Daily ticker summary fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch daily ticker summary");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Lytical Analyzer</h1>
            <p className="text-muted-foreground">Advanced financial data analysis using Polygon API</p>
          </div>
        </div>

        <Tabs defaultValue="inflation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="inflation">Inflation</TabsTrigger>
            <TabsTrigger value="expectations">Expectations</TabsTrigger>
            <TabsTrigger value="options">Options OHLC</TabsTrigger>
            <TabsTrigger value="daily">Daily Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="inflation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Inflation Data
                </CardTitle>
                <CardDescription>
                  Retrieve key indicators of realized inflation, reflecting actual changes in consumer prices 
                  and spending behavior in the U.S. economy.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={fetchInflationData} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Fetch Inflation Data
                </Button>
                
                {inflationData && (
                  <div className="space-y-2">
                    <Badge variant="secondary">
                      Status: {inflationData.status}
                    </Badge>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {inflationData.results?.slice(0, 6).map((item: any, index: number) => (
                        <Card key={index} className="p-4">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{item.date}</span>
                            <span className="text-primary font-bold">{item.value}%</span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expectations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Inflation Expectations
                </CardTitle>
                <CardDescription>
                  Broad view of how inflation is expected to evolve over time in the U.S. economy, 
                  combining signals from financial markets and economic models.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={fetchInflationExpectations} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Fetch Inflation Expectations
                </Button>
                
                {inflationExpectations && (
                  <div className="space-y-2">
                    <Badge variant="secondary">
                      Status: {inflationExpectations.status}
                    </Badge>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {inflationExpectations.results?.slice(0, 6).map((item: any, index: number) => (
                        <Card key={index} className="p-4">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{item.date}</span>
                            <span className="text-primary font-bold">{item.value}%</span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="options" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Custom Bars (OHLC)
                </CardTitle>
                <CardDescription>
                  Retrieve aggregated historical OHLC data for specified options contracts 
                  over custom date ranges and time intervals.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Options Ticker</label>
                    <Input
                      value={optionsTicker}
                      onChange={(e) => setOptionsTicker(e.target.value)}
                      placeholder="O:SPY251219C00650000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">From Date</label>
                    <Input
                      type="date"
                      value={dateRange.from}
                      onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">To Date</label>
                    <Input
                      type="date"
                      value={dateRange.to}
                      onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                    />
                  </div>
                </div>
                
                <Button onClick={fetchOptionsAggregates} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Fetch Options Data
                </Button>
                
                {optionsData && (
                  <div className="space-y-2">
                    <Badge variant="secondary">
                      Status: {optionsData.status} | Results: {optionsData.resultsCount}
                    </Badge>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {optionsData.results?.slice(0, 9).map((item: any, index: number) => (
                        <Card key={index} className="p-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Date</span>
                              <span className="text-sm">{new Date(item.t).toLocaleDateString()}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>Open: <span className="font-medium">${item.o}</span></div>
                              <div>High: <span className="font-medium text-green-600">${item.h}</span></div>
                              <div>Low: <span className="font-medium text-red-600">${item.l}</span></div>
                              <div>Close: <span className="font-medium">${item.c}</span></div>
                            </div>
                            <div className="text-sm">
                              Volume: <span className="font-medium">{item.v?.toLocaleString()}</span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="daily" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Daily Ticker Summary (OHLC)
                </CardTitle>
                <CardDescription>
                  Retrieve opening and closing prices for specific options contracts on given dates, 
                  including pre-market and after-hours trade prices.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Options Ticker</label>
                    <Input
                      value={optionsTicker}
                      onChange={(e) => setOptionsTicker(e.target.value)}
                      placeholder="O:SPY251219C00650000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <Input
                      type="date"
                      value={dateRange.from}
                      onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                    />
                  </div>
                </div>
                
                <Button onClick={fetchDailyTickerSummary} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Fetch Daily Summary
                </Button>
                
                {dailyData && (
                  <div className="space-y-4">
                    <Badge variant="secondary">
                      Status: {dailyData.status}
                    </Badge>
                    {dailyData.status === "OK" && (
                      <Card className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <h3 className="font-semibold text-lg">Trading Data</h3>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>Symbol:</span>
                                <span className="font-medium">{dailyData.symbol}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Date:</span>
                                <span className="font-medium">{dailyData.from}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Open:</span>
                                <span className="font-medium">${dailyData.open}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Close:</span>
                                <span className="font-medium">${dailyData.close}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>High:</span>
                                <span className="font-medium text-green-600">${dailyData.high}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Low:</span>
                                <span className="font-medium text-red-600">${dailyData.low}</span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <h3 className="font-semibold text-lg">Volume & Additional</h3>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>Volume:</span>
                                <span className="font-medium">{dailyData.volume?.toLocaleString()}</span>
                              </div>
                              {dailyData.preMarket && (
                                <div className="flex justify-between">
                                  <span>Pre-Market:</span>
                                  <span className="font-medium">${dailyData.preMarket}</span>
                                </div>
                              )}
                              {dailyData.afterHours && (
                                <div className="flex justify-between">
                                  <span>After Hours:</span>
                                  <span className="font-medium">${dailyData.afterHours}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    )}
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