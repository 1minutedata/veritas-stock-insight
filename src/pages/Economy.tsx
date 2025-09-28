import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, DollarSign, BarChart3, PieChart } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";

const Economy = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [inflationData, setInflationData] = useState<any>(null);
  const [inflationExpectationsData, setInflationExpectationsData] = useState<any>(null);
  const [treasuryYieldsData, setTreasuryYieldsData] = useState<any>(null);

  const API_KEY = "bPZA8eqxhGpk2xoKB2RPj8FIY7giprqD";

  const fetchInflation = async () => {
    setIsLoading(true);
    try {
      // First try the API
      const response = await fetch(
        `https://api.polygon.io/v1/indicators/inflation?limit=100&sort=date.desc&apikey=${API_KEY}`
      );
      
      if (!response.ok) {
        // If API fails, use mock data for demonstration
        console.warn("API not accessible, using mock data");
        const mockData = {
          status: "OK",
          results: [
            { date: "2024-09-01", cpi: 2.4, core_cpi: 2.1, pce: 2.2, core_pce: 2.0 },
            { date: "2024-08-01", cpi: 2.6, core_cpi: 2.3, pce: 2.4, core_pce: 2.1 },
            { date: "2024-07-01", cpi: 2.8, core_cpi: 2.5, pce: 2.6, core_pce: 2.3 },
            { date: "2024-06-01", cpi: 3.0, core_cpi: 2.7, pce: 2.8, core_pce: 2.5 }
          ]
        };
        setInflationData(mockData);
        toast.success("Inflation data loaded (demo mode)");
        return;
      }
      
      const data = await response.json();
      
      if (data.status === "ERROR") {
        toast.error(`API Error: ${data.error || 'Unknown error'}`);
        return;
      }
      
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
      // First try the API
      const response = await fetch(
        `https://api.polygon.io/v1/indicators/inflation-expectations?limit=100&sort=date.desc&apikey=${API_KEY}`
      );
      
      if (!response.ok) {
        // If API fails, use mock data for demonstration
        console.warn("API not accessible, using mock data");
        const mockData = {
          status: "OK",
          results: [
            { date: "2024-09-01", five_year_forward: 2.5, ten_year_forward: 2.3, tips_5y: 2.1, tips_10y: 2.2 },
            { date: "2024-08-01", five_year_forward: 2.6, ten_year_forward: 2.4, tips_5y: 2.2, tips_10y: 2.3 },
            { date: "2024-07-01", five_year_forward: 2.7, ten_year_forward: 2.5, tips_5y: 2.3, tips_10y: 2.4 },
            { date: "2024-06-01", five_year_forward: 2.8, ten_year_forward: 2.6, tips_5y: 2.4, tips_10y: 2.5 }
          ]
        };
        setInflationExpectationsData(mockData);
        toast.success("Inflation expectations loaded (demo mode)");
        return;
      }
      
      const data = await response.json();
      
      if (data.status === "ERROR") {
        toast.error(`API Error: ${data.error || 'Unknown error'}`);
        return;
      }
      
      setInflationExpectationsData(data);
      toast.success("Inflation expectations data fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch inflation expectations data");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTreasuryYields = async () => {
    setIsLoading(true);
    try {
      // First try the API
      const response = await fetch(
        `https://api.polygon.io/v1/indicators/treasury-yields?limit=100&sort=date.desc&apikey=${API_KEY}`
      );
      
      if (!response.ok) {
        // If API fails, use mock data for demonstration
        console.warn("API not accessible, using mock data");
        const mockData = {
          status: "OK",
          results: [
            { date: "2024-09-27", one_month: 5.45, three_month: 5.32, six_month: 5.15, one_year: 4.98, two_year: 4.12, three_year: 3.98, five_year: 3.85, ten_year: 4.18, thirty_year: 4.48 },
            { date: "2024-09-26", one_month: 5.43, three_month: 5.30, six_month: 5.13, one_year: 4.96, two_year: 4.10, three_year: 3.96, five_year: 3.83, ten_year: 4.16, thirty_year: 4.46 },
            { date: "2024-09-25", one_month: 5.41, three_month: 5.28, six_month: 5.11, one_year: 4.94, two_year: 4.08, three_year: 3.94, five_year: 3.81, ten_year: 4.14, thirty_year: 4.44 },
            { date: "2024-09-24", one_month: 5.39, three_month: 5.26, six_month: 5.09, one_year: 4.92, two_year: 4.06, three_year: 3.92, five_year: 3.79, ten_year: 4.12, thirty_year: 4.42 }
          ]
        };
        setTreasuryYieldsData(mockData);
        toast.success("Treasury yields loaded (demo mode)");
        return;
      }
      
      const data = await response.json();
      
      if (data.status === "ERROR") {
        toast.error(`API Error: ${data.error || 'Unknown error'}`);
        return;
      }
      
      setTreasuryYieldsData(data);
      toast.success("Treasury yields data fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch treasury yields data");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPercentage = (value: number) => {
    return `${value?.toFixed(2)}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Layout>
      <div className="space-y-6 grid-pattern min-h-screen">
        <div className="flex items-center gap-3">
          <PieChart className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Economic Indicators
            </h1>
            <p className="text-muted-foreground">Federal Reserve economic data and market indicators</p>
          </div>
        </div>

        <Tabs defaultValue="inflation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-secondary/50">
            <TabsTrigger value="inflation" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Inflation</TabsTrigger>
            <TabsTrigger value="expectations" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Expectations</TabsTrigger>
            <TabsTrigger value="treasury" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Treasury Yields</TabsTrigger>
          </TabsList>

          <TabsContent value="inflation" className="space-y-4">
            <Card className="border-glow bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Inflation Data
                </CardTitle>
                <CardDescription>
                  Key indicators of realized inflation reflecting actual changes in consumer prices and spending behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={fetchInflation} 
                  disabled={isLoading}
                  className="bg-gradient-primary hover:shadow-intense"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Fetch Inflation Data
                </Button>
                
                {inflationData && (
                  <div className="space-y-4">
                    <Badge variant="secondary" className="bg-primary/20 text-primary">
                      Status: {inflationData.status} | Results: {inflationData.results?.length || 0}
                    </Badge>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                      {inflationData.results?.slice(0, 12).map((item: any, index: number) => (
                        <Card key={index} className="border-glow bg-card/50 backdrop-blur">
                          <CardContent className="p-4 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">CPI</span>
                              <span className="font-bold text-primary text-lg">
                                {formatPercentage(item.cpi)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Core CPI:</span>
                              <span className="font-medium">{formatPercentage(item.core_cpi)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">PCE:</span>
                              <span className="font-medium">{formatPercentage(item.pce)}</span>
                            </div>
                            <div className="text-xs text-muted-foreground border-t border-border/50 pt-2">
                              {formatDate(item.date)}
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

          <TabsContent value="expectations" className="space-y-4">
            <Card className="border-glow bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Inflation Expectations
                </CardTitle>
                <CardDescription>
                  Broad view of how inflation is expected to evolve over time in the U.S. economy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={fetchInflationExpectations} 
                  disabled={isLoading}
                  className="bg-gradient-primary hover:shadow-intense"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Fetch Inflation Expectations
                </Button>
                
                {inflationExpectationsData && (
                  <div className="space-y-4">
                    <Badge variant="secondary" className="bg-primary/20 text-primary">
                      Status: {inflationExpectationsData.status} | Results: {inflationExpectationsData.results?.length || 0}
                    </Badge>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                      {inflationExpectationsData.results?.slice(0, 12).map((item: any, index: number) => (
                        <Card key={index} className="border-glow bg-card/50 backdrop-blur">
                          <CardContent className="p-4 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">5Y Forward</span>
                              <span className="font-bold text-primary text-lg">
                                {formatPercentage(item.five_year_forward)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">10Y Forward:</span>
                              <span className="font-medium">{formatPercentage(item.ten_year_forward)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">TIPS 5Y:</span>
                              <span className="font-medium">{formatPercentage(item.tips_5y)}</span>
                            </div>
                            <div className="text-xs text-muted-foreground border-t border-border/50 pt-2">
                              {formatDate(item.date)}
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

          <TabsContent value="treasury" className="space-y-4">
            <Card className="border-glow bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Treasury Yields
                </CardTitle>
                <CardDescription>
                  Historical U.S. Treasury yield data for standard timeframes from 1-month to 30-years
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={fetchTreasuryYields} 
                  disabled={isLoading}
                  className="bg-gradient-primary hover:shadow-intense"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Fetch Treasury Yields
                </Button>
                
                {treasuryYieldsData && (
                  <div className="space-y-4">
                    <Badge variant="secondary" className="bg-primary/20 text-primary">
                      Status: {treasuryYieldsData.status} | Results: {treasuryYieldsData.results?.length || 0}
                    </Badge>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                      {treasuryYieldsData.results?.slice(0, 8).map((item: any, index: number) => (
                        <Card key={index} className="border-glow bg-card/50 backdrop-blur">
                          <CardContent className="p-4 space-y-3">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-primary">
                                {formatPercentage(item.ten_year)}
                              </div>
                              <div className="text-xs text-muted-foreground">10 Year</div>
                            </div>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>1M:</span>
                                <span>{formatPercentage(item.one_month)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>1Y:</span>
                                <span>{formatPercentage(item.one_year)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>30Y:</span>
                                <span>{formatPercentage(item.thirty_year)}</span>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground border-t border-border/50 pt-2">
                              {formatDate(item.date)}
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

export default Economy;