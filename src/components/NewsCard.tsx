import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsItem {
  title: string;
  summary: string;
  publisher: string;
  publishTime: number;
  link: string;
  uuid: string;
}

interface NewsCardProps {
  news: NewsItem;
  className?: string;
}

export function NewsCard({ news, className }: NewsCardProps) {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 168) return `${Math.floor(diffHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const handleClick = () => {
    if (news.link && news.link !== "#") {
      window.open(news.link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Card 
      className={cn(
        "p-4 cursor-pointer transition-all duration-200 hover:shadow-glow border-border",
        "hover:bg-card/80 group",
        className
      )}
      onClick={handleClick}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-semibold leading-tight group-hover:text-primary transition-colors">
            {news.title}
          </h4>
          {news.link && news.link !== "#" && (
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
          )}
        </div>
        
        {news.summary && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {news.summary}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs">
          <Badge variant="secondary" className="font-medium">
            {news.publisher}
          </Badge>
          
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatTime(news.publishTime)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}