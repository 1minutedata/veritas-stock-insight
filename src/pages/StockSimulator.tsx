import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, PieChart, Activity, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Client } from "@gradio/client";
import { useAuth } from "@/contexts/AuthContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StockSimulator() {
  const [accountData, setAccountData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initialDeposit, setInitialDeposit] = useState("");
  const [stockSymbol, setStockSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [amount, setAmount] = useState("");
  const [stockPrice, setStockPrice] = useState("");
  const [holdings, setHoldings] = useState("");
  const [portfolioValue, setPortfolioValue] = useState("");
  const [profitLoss, setProfitLoss] = useState("");
  const [transactions, setTransactions] = useState("");
  const [priceHistory, setPriceHistory] = useState<Array<{time: string, price: number}>>([]);
  const [trackingSymbol, setTrackingSymbol] = useState("AAPL");
  
  const { toast } = useToast();
  const { user } = useAuth();

  const connectToGradio = async () => {
    try {
      const client = await Client.connect("vikshinde/trading_simulator");
      return client;
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Failed to connect to trading simulator",
        variant: "destructive",
      });
      throw error;
    }
  };

  const createAccount = async () => {
    if (!user || !initialDeposit) {
      toast({
        title: "Missing Information",
        description: "Please provide Initial Deposit",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const client = await connectToGradio();
      const result = await client.predict("/create_account", {
        user_id: user.id,
        initial_deposit: initialDeposit,
      });
      
      setAccountData(result.data[0]);
      toast({
        title: "Account Created",
        description: "Your trading account has been created successfully",
      });
    } catch (error) {
      console.error("Create account error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deposit = async () => {
    if (!amount) return;
    
    setIsLoading(true);
    try {
      const client = await connectToGradio();
      const result = await client.predict("/deposit", { amount });
      
      toast({
        title: "Deposit Successful",
        description: result.data[0],
      });
      await getAccountSummary();
    } catch (error) {
      console.error("Deposit error:", error);
    } finally {
      setIsLoading(false);
      setAmount("");
    }
  };

  const withdraw = async () => {
    if (!amount) return;
    
    setIsLoading(true);
    try {
      const client = await connectToGradio();
      const result = await client.predict("/withdraw", { amount });
      
      toast({
        title: "Withdrawal Processed",
        description: result.data[0],
      });
      await getAccountSummary();
    } catch (error) {
      console.error("Withdraw error:", error);
    } finally {
      setIsLoading(false);
      setAmount("");
    }
  };

  const getStockPrice = async () => {
    if (!stockSymbol) return;
    
    setIsLoading(true);
    try {
      const client = await connectToGradio();
      const result = await client.predict("/get_stock_price", { symbol: stockSymbol });
      setStockPrice(result.data[0]);
    } catch (error) {
      console.error("Get stock price error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const buyShares = async () => {
    if (!stockSymbol || !quantity) return;
    
    setIsLoading(true);
    try {
      const client = await connectToGradio();
      const result = await client.predict("/buy_shares", {
        symbol: stockSymbol,
        quantity: quantity,
      });
      
      toast({
        title: "Purchase Complete",
        description: result.data[0],
      });
      await getAccountSummary();
      await getHoldings();
    } catch (error) {
      console.error("Buy shares error:", error);
    } finally {
      setIsLoading(false);
      setStockSymbol("");
      setQuantity("");
    }
  };

  const sellShares = async () => {
    if (!stockSymbol || !quantity) return;
    
    setIsLoading(true);
    try {
      const client = await connectToGradio();
      const result = await client.predict("/sell_shares", {
        symbol: stockSymbol,
        quantity: quantity,
      });
      
      toast({
        title: "Sale Complete",
        description: result.data[0],
      });
      await getAccountSummary();
      await getHoldings();
    } catch (error) {
      console.error("Sell shares error:", error);
    } finally {
      setIsLoading(false);
      setStockSymbol("");
      setQuantity("");
    }
  };

  const getAccountSummary = async () => {
    setIsLoading(true);
    try {
      const client = await connectToGradio();
      const result = await client.predict("/account_summary", {});
      setAccountData(result.data[0]);
    } catch (error) {
      console.error("Get account summary error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getHoldings = async () => {
    setIsLoading(true);
    try {
      const client = await connectToGradio();
      const result = await client.predict("/get_holdings", {});
      setHoldings(result.data[0]);
    } catch (error) {
      console.error("Get holdings error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPortfolioValue = async () => {
    setIsLoading(true);
    try {
      const client = await connectToGradio();
      const result = await client.predict("/get_portfolio_value", {});
      setPortfolioValue(result.data[0]);
    } catch (error) {
      console.error("Get portfolio value error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProfitLoss = async () => {
    setIsLoading(true);
    try {
      const client = await connectToGradio();
      const result = await client.predict("/get_profit_loss", {});
      setProfitLoss(result.data[0]);
    } catch (error) {
      console.error("Get profit/loss error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactions = async () => {
    setIsLoading(true);
    try {
      const client = await connectToGradio();
      const result = await client.predict("/get_transactions", {});
      setTransactions(result.data[0]);
    } catch (error) {
      console.error("Get transactions error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const trackStockPrice = async (symbol: string) => {
    try {
      const client = await connectToGradio();
      const result = await client.predict("/get_stock_price", { symbol });
      const priceData = result.data[0];
      
      // Extract numerical price from the response
      const priceMatch = priceData.match(/\$?([\d,]+\.?\d*)/);
      if (priceMatch) {
        const price = parseFloat(priceMatch[1].replace(/,/g, ''));
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        
        setPriceHistory(prev => {
          const newHistory = [...prev, { time: timeString, price }];
          // Keep only last 20 data points
          return newHistory.slice(-20);
        });
      }
    } catch (error) {
      console.error("Error tracking stock price:", error);
    }
  };

  useEffect(() => {
    if (!user) return;

    // Initial price fetch
    trackStockPrice(trackingSymbol);
    
    // Set up periodic tracking every 30 seconds
    const interval = setInterval(() => {
      trackStockPrice(trackingSymbol);
    }, 30000);

    return () => clearInterval(interval);
  }, [trackingSymbol, user]);

  if (!user) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Please log in to access the Stock Simulator</h1>
        <p className="text-muted-foreground">You need to be authenticated to use trading features.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Stock Trading Simulator
        </h1>
        <p className="text-muted-foreground mt-2">
          Practice trading with virtual money in a realistic market environment
        </p>
      </div>

      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="chart">Price Chart</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Create Trading Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="userId">User ID</Label>
                  <Input
                    id="userId"
                    value={user.email || user.id}
                    disabled
                    placeholder="Logged in user"
                  />
                </div>
                <div>
                  <Label htmlFor="initialDeposit">Initial Deposit ($)</Label>
                  <Input
                    id="initialDeposit"
                    type="number"
                    value={initialDeposit}
                    onChange={(e) => setInitialDeposit(e.target.value)}
                    placeholder="10000"
                  />
                </div>
              </div>
              <Button onClick={createAccount} disabled={isLoading} className="w-full">
                Create Account
              </Button>
              
              {accountData && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Account Created:</h3>
                  <pre className="text-sm whitespace-pre-wrap">{accountData}</pre>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Deposit Funds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount to deposit"
                />
                <Button onClick={deposit} disabled={isLoading} className="w-full">
                  Deposit
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Withdraw Funds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount to withdraw"
                />
                <Button onClick={withdraw} disabled={isLoading} className="w-full">
                  Withdraw
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trading" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Stock Price Lookup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={stockSymbol}
                  onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
                  placeholder="Stock Symbol (e.g., AAPL, TSLA, GOOGL)"
                />
                <Button onClick={getStockPrice} disabled={isLoading}>
                  Get Price
                </Button>
              </div>
              
              {stockPrice && (
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Price Information:</h3>
                  <pre className="text-sm whitespace-pre-wrap">{stockPrice}</pre>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="h-5 w-5" />
                  Buy Shares
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  value={stockSymbol}
                  onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
                  placeholder="Stock Symbol"
                />
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Quantity"
                />
                <Button onClick={buyShares} disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700">
                  Buy Shares
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <TrendingDown className="h-5 w-5" />
                  Sell Shares
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  value={stockSymbol}
                  onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
                  placeholder="Stock Symbol"
                />
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Quantity"
                />
                <Button onClick={sellShares} disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700">
                  Sell Shares
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={getHoldings} disabled={isLoading} className="w-full mb-4">
                  Refresh Holdings
                </Button>
                {holdings && (
                  <pre className="text-sm whitespace-pre-wrap bg-muted p-3 rounded">{holdings}</pre>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Portfolio Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={getPortfolioValue} disabled={isLoading} className="w-full mb-4">
                  Get Portfolio Value
                </Button>
                {portfolioValue && (
                  <pre className="text-sm whitespace-pre-wrap bg-muted p-3 rounded">{portfolioValue}</pre>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profit/Loss</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={getProfitLoss} disabled={isLoading} className="w-full mb-4">
                  Calculate P&L
                </Button>
                {profitLoss && (
                  <pre className="text-sm whitespace-pre-wrap bg-muted p-3 rounded">{profitLoss}</pre>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={getAccountSummary} disabled={isLoading} className="w-full mb-4">
                Refresh Account Summary
              </Button>
              {accountData && (
                <div className="p-4 bg-muted rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap">{accountData}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={getTransactions} disabled={isLoading} className="w-full mb-4">
                Load Transactions
              </Button>
              {transactions && (
                <div className="p-4 bg-muted rounded-lg max-h-96 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap">{transactions}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chart" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Real-Time Stock Price Chart
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 items-center">
                <Label htmlFor="trackingSymbol">Track Symbol:</Label>
                <Input
                  id="trackingSymbol"
                  value={trackingSymbol}
                  onChange={(e) => setTrackingSymbol(e.target.value.toUpperCase())}
                  placeholder="AAPL"
                  className="w-32"
                />
                <Button onClick={() => trackStockPrice(trackingSymbol)} disabled={isLoading}>
                  Update Now
                </Button>
              </div>
              
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Price']} />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {priceHistory.length > 0 && (
                <div className="text-center">
                  <Badge variant="outline" className="text-lg p-2">
                    Latest {trackingSymbol}: ${priceHistory[priceHistory.length - 1]?.price?.toFixed(2)}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}