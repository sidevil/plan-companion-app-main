import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { useNews } from '@/hooks/useNews';
export const NewsTicker: React.FC<{
  config?: any;
}> = ({
  config = {}
}) => {
  const {
    articles,
    loading,
    error
  } = useNews(config.category || 'general', config.country || 'us', config.rssUrl);
  if (loading) {
    return <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-accent" />
            Latest News
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </CardContent>
      </Card>;
  }
  if (error) {
    return <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-accent" />
            Latest News
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-48 gap-2">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-sm text-muted-foreground">Unable to load news</p>
        </CardContent>
      </Card>;
  }
  return <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all duration-300">
      <CardHeader className="pb-3 my-0 mx-0 px-0 py-[3px]">
        <CardTitle className="text-lg flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-accent" />
          Latest News
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="max-h-48 overflow-y-auto space-y-3">
          {articles.slice(0, 5).map(article => <a key={article.id} href={article.url} target="_blank" rel="noopener noreferrer" className="group cursor-pointer block">
              <div className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-200 group-hover:shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-accent transition-colors">
                      {article.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span>{article.source}</span>
                      <span>•</span>
                      <span>{article.time}</span>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0" />
                </div>
              </div>
            </a>)}
        </div>
      </CardContent>
    </Card>;
};