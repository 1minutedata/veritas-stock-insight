import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, DollarSign, TrendingUp, BarChart3, PieChart } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";

const FinancialStatements = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [cashFlowData, setCashFlowData] = useState<any>(null);
  const [incomeData, setIncomeData] = useState<any>(null);
  const [ratiosData, setRatiosData] = useState<any>(null);
  const [ticker, setTicker] = useState("AAPL");

  const API_KEY = "bPZA8eqxhGpk2xoKB2RPj8FIY7giprqD";

  const fetchCashFlowStatements = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.polygon.io/v3/reference/financials?ticker=${ticker}&limit=10&sort=period_of_report_date.desc&apikey=${API_KEY}`
      );
      const data = await response.json();
      
      if (data.status === "ERROR") {
        toast.error(`API Error: ${data.error || 'Unknown error'}`);
        return;
      }
      
      setCashFlowData(data);
      toast.success("Cash flow data fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch cash flow data");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchIncomeStatements = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.polygon.io/v3/reference/financials?ticker=${ticker}&limit=10&sort=period_of_report_date.desc&apikey=${API_KEY}`
      );
      const data = await response.json();
      
      if (data.status === "ERROR") {
        toast.error(`API Error: ${data.error || 'Unknown error'}`);
        return;
      }
      
      setIncomeData(data);
      toast.success("Income statement data fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch income statement data");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRatios = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.polygon.io/v3/reference/financials?ticker=${ticker}&limit=10&sort=period_of_report_date.desc&apikey=${API_KEY}`
      );
      const data = await response.json();
      
      if (data.status === "ERROR") {
        toast.error(`API Error: ${data.error || 'Unknown error'}`);
        return;
      }
      
      setRatiosData(data);
      toast.success("Financial ratios fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch financial ratios");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    if (!value) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatNumber = (value: number) => {
    if (!value) return "N/A";
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <Layout>
      <div className="space-y-6 grid-pattern min-h-screen">
        <div className="flex items-center gap-3">
          <PieChart className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Financial Statements
            </h1>
            <p className="text-muted-foreground">Comprehensive financial analysis and company metrics</p>
          </div>
        </div>

        <Card className="border-glow bg-gradient-card">
          <CardHeader>
            <CardTitle>Company Ticker</CardTitle>
            <CardDescription>Enter a stock ticker to analyze financial statements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Input
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                placeholder="Enter ticker (e.g., AAPL)"
                className="input-tech max-w-xs"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="cashflow" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-secondary/50">
            <TabsTrigger value="cashflow" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Cash Flow
            </TabsTrigger>
            <TabsTrigger value="income" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Income Statements
            </TabsTrigger>
            <TabsTrigger value="ratios" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Financial Ratios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cashflow" className="space-y-4">
            <Card className="border-glow bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Cash Flow Statements
                </CardTitle>
                <CardDescription>
                  Comprehensive cash flow data including operating, investing, and financing activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={fetchCashFlowStatements} 
                  disabled={isLoading}
                  className="bg-gradient-primary hover:shadow-intense"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Fetch Cash Flow Data
                </Button>
                
                {cashFlowData && (
                  <div className="space-y-4">
                    <Badge variant="secondary" className="bg-primary/20 text-primary">
                      Status: {cashFlowData.status} | Results: {cashFlowData.results?.length || 0}
                    </Badge>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cashFlowData.results?.slice(0, 4).map((statement: any, index: number) => (
                        <Card key={index} className="border-glow bg-card/50 backdrop-blur">
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-center">
                              <Badge variant="outline" className="border-primary/50">
                                {statement.period}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {statement.period_end}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">Operating Cash Flow:</span>
                                <span className="font-medium text-primary">
                                  {formatCurrency(statement.operating_cash_flow)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Investing Cash Flow:</span>
                                <span className="font-medium">
                                  {formatCurrency(statement.investing_cash_flow)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Financing Cash Flow:</span>
                                <span className="font-medium">
                                  {formatCurrency(statement.financing_cash_flow)}
                                </span>
                              </div>
                              <div className="flex justify-between border-t border-border/50 pt-2">
                                <span className="text-sm font-medium">Net Cash Flow:</span>
                                <span className={`font-bold ${statement.net_cash_flow >= 0 ? 'text-primary' : 'text-destructive'}`}>
                                  {formatCurrency(statement.net_cash_flow)}
                                </span>
                              </div>
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

          <TabsContent value="income" className="space-y-4">
            <Card className="border-glow bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Income Statements
                </CardTitle>
                <CardDescription>
                  Revenue, expenses, and profitability metrics across reporting periods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={fetchIncomeStatements} 
                  disabled={isLoading}
                  className="bg-gradient-primary hover:shadow-intense"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Fetch Income Statements
                </Button>
                
                {incomeData && (
                  <div className="space-y-4">
                    <Badge variant="secondary" className="bg-primary/20 text-primary">
                      Status: {incomeData.status} | Results: {incomeData.results?.length || 0}
                    </Badge>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {incomeData.results?.slice(0, 4).map((statement: any, index: number) => (
                        <Card key={index} className="border-glow bg-card/50 backdrop-blur">
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-center">
                              <Badge variant="outline" className="border-primary/50">
                                {statement.period}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {statement.period_end}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">Revenue:</span>
                                <span className="font-medium text-primary">
                                  {formatCurrency(statement.revenue)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Operating Income:</span>
                                <span className="font-medium">
                                  {formatCurrency(statement.operating_income)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Gross Profit:</span>
                                <span className="font-medium">
                                  {formatCurrency(statement.gross_profit)}
                                </span>
                              </div>
                              <div className="flex justify-between border-t border-border/50 pt-2">
                                <span className="text-sm font-medium">Net Income:</span>
                                <span className={`font-bold ${statement.net_income >= 0 ? 'text-primary' : 'text-destructive'}`}>
                                  {formatCurrency(statement.net_income)}
                                </span>
                              </div>
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

          <TabsContent value="ratios" className="space-y-4">
            <Card className="border-glow bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Financial Ratios
                </CardTitle>
                <CardDescription>
                  Key valuation, profitability, liquidity, and leverage metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={fetchRatios} 
                  disabled={isLoading}
                  className="bg-gradient-primary hover:shadow-intense"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Fetch Financial Ratios
                </Button>
                
                {ratiosData && (
                  <div className="space-y-4">
                    <Badge variant="secondary" className="bg-primary/20 text-primary">
                      Status: {ratiosData.status} | Results: {ratiosData.results?.length || 0}
                    </Badge>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {ratiosData.results?.slice(0, 6).map((ratio: any, index: number) => (
                        <Card key={index} className="border-glow bg-card/50 backdrop-blur">
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-center">
                              <Badge variant="outline" className="border-primary/50">
                                {ratio.period}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {ratio.period_end}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">P/E Ratio:</span>
                                <span className="font-medium text-primary">
                                  {formatNumber(ratio.price_earnings_ratio)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">ROE:</span>
                                <span className="font-medium">
                                  {formatNumber(ratio.return_on_equity)}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">ROA:</span>
                                <span className="font-medium">
                                  {formatNumber(ratio.return_on_assets)}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Debt to Equity:</span>
                                <span className="font-medium">
                                  {formatNumber(ratio.debt_to_equity_ratio)}
                                </span>
                              </div>
                              <div className="flex justify-between border-t border-border/50 pt-2">
                                <span className="text-sm font-medium">Current Ratio:</span>
                                <span className="font-bold text-primary">
                                  {formatNumber(ratio.current_ratio)}
                                </span>
                              </div>
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

export default FinancialStatements;