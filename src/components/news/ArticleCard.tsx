import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ExternalLink } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: string;
  publishedAt: Date;
  imageUrl?: string;
}

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => {
  const timeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <Card 
      className="cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="flex flex-col sm:flex-row">
        {article.imageUrl && (
          <div className="sm:w-48 h-48 sm:h-auto">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
            />
          </div>
        )}
        
        <div className="flex-1">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-start gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {article.category}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {article.source}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                <Clock className="h-3 w-3" />
                {timeAgo(article.publishedAt)}
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-foreground line-clamp-2 mb-2">
              {article.title}
            </h3>
          </CardHeader>
          
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
              {article.summary}
            </p>
            
            <div className="flex items-center gap-2 text-xs text-primary">
              <ExternalLink className="h-3 w-3" />
              <span>Read full article</span>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};