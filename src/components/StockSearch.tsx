import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StockSearchProps {
  onSearch: (symbol: string) => void;
  isLoading?: boolean;
}

const popularStocks = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 
  'META', 'NVDA', 'JPM', 'V', 'JNJ'
];

export function StockSearch({ onSearch, isLoading }: StockSearchProps) {
  const [symbol, setSymbol] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symbol.trim()) {
      onSearch(symbol.trim().toUpperCase());
      setSymbol("");
    }
  };

  const handlePopularStock = (stock: string) => {
    onSearch(stock);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter stock symbol (e.g., AAPL)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            className="pl-10 bg-card border-border focus:ring-primary"
            disabled={isLoading}
          />
        </div>
        <Button 
          type="submit" 
          disabled={!symbol.trim() || isLoading}
          className="bg-gradient-primary hover:opacity-90"
        >
          {isLoading ? "Searching..." : "Analyze"}
        </Button>
      </form>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          Popular Stocks
        </div>
        <div className="flex flex-wrap gap-2">
          {popularStocks.map((stock) => (
            <Button
              key={stock}
              variant="outline"
              size="sm"
              onClick={() => handlePopularStock(stock)}
              disabled={isLoading}
              className={cn(
                "text-xs font-mono hover:bg-primary hover:text-primary-foreground",
                "border-border hover:border-primary transition-all duration-200"
              )}
            >
              {stock}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}