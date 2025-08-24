import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  dayHigh?: number;
  dayLow?: number;
}

interface StockCardProps {
  stock: StockData;
  onClick?: () => void;
}

export function StockCard({ stock, onClick }: StockCardProps) {
  const isPositive = stock.change > 0;
  const isNegative = stock.change < 0;
  
  const TrendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;
  const trendColor = isPositive ? "text-bullish" : isNegative ? "text-bearish" : "text-neutral";
  const bgColor = isPositive ? "bg-bullish/10" : isNegative ? "bg-bearish/10" : "bg-neutral/10";

  return (
    <Card 
      className={cn(
        "p-4 cursor-pointer transition-all duration-200 hover:shadow-glow border-border",
        bgColor,
        onClick && "hover:scale-105"
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg">{stock.symbol}</h3>
          <TrendIcon className={cn("h-4 w-4", trendColor)} />
        </div>
        <Badge variant={isPositive ? "default" : isNegative ? "destructive" : "secondary"}>
          {isPositive ? "+" : ""}{stock.changePercent.toFixed(2)}%
        </Badge>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Price</span>
          <span className="font-mono text-lg">${stock.price.toFixed(2)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Change</span>
          <span className={cn("font-mono", trendColor)}>
            {isPositive ? "+" : ""}{stock.change.toFixed(2)}
          </span>
        </div>
        
        {stock.volume && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Volume</span>
            <span className="font-mono text-sm">
              {(stock.volume / 1000000).toFixed(1)}M
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}