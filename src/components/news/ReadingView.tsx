import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Share2, Bookmark } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: string;
  publishedAt: Date;
  imageUrl?: string;
  content: string;
}

interface ReadingViewProps {
  article: Article;
  onBack: () => void;
}

export const ReadingView: React.FC<ReadingViewProps> = ({ article, onBack }) => {
  const timeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to News
        </Button>
        
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Bookmark className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <article className="space-y-6">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{article.category}</Badge>
            <Badge variant="outline">{article.source}</Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {timeAgo(article.publishedAt)}
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            {article.title}
          </h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            {article.summary}
          </p>
        </header>

        {article.imageUrl && (
          <div className="relative aspect-video w-full rounded-lg overflow-hidden">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <div className="text-base leading-relaxed space-y-4">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
};