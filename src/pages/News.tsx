import React, { useState } from 'react';
import { NewsSourceSelector } from '@/components/news/NewsSourceSelector';
import { CategoryFilters } from '@/components/news/CategoryFilters';
import { ArticleCard } from '@/components/news/ArticleCard';
import { ReadingView } from '@/components/news/ReadingView';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const mockArticles = [
  {
    id: '1',
    title: 'Smart Home Technology Trends for 2024',
    summary: 'Exploring the latest innovations in home automation and IoT devices.',
    source: 'TechNews',
    category: 'Technology',
    publishedAt: new Date('2024-01-15T10:30:00Z'),
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    content: 'Full article content would be loaded here...'
  },
  {
    id: '2',
    title: 'Voice Assistants Become More Intelligent',
    summary: 'AI-powered voice assistants are getting better at understanding context.',
    source: 'AI Daily',
    category: 'Technology',
    publishedAt: new Date('2024-01-15T08:15:00Z'),
    imageUrl: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=400',
    content: 'Full article content would be loaded here...'
  },
  {
    id: '3',
    title: 'Weather Systems Show Unusual Patterns',
    summary: 'Meteorologists track significant changes in global weather patterns.',
    source: 'Weather Central',
    category: 'Weather',
    publishedAt: new Date('2024-01-15T06:45:00Z'),
    imageUrl: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400',
    content: 'Full article content would be loaded here...'
  }
];

const News = () => {
  const [selectedArticle, setSelectedArticle] = useState<typeof mockArticles[0] | null>(null);
  const [selectedSources, setSelectedSources] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const filteredArticles = mockArticles.filter(article => {
    const sourceMatch = selectedSources.includes('All') || selectedSources.includes(article.source);
    const categoryMatch = selectedCategory === 'All' || article.category === selectedCategory;
    return sourceMatch && categoryMatch;
  });

  if (selectedArticle) {
    return (
      <ReadingView 
        article={selectedArticle} 
        onBack={() => setSelectedArticle(null)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">News & Information</h1>
          <p className="text-muted-foreground">Stay updated with the latest headlines</p>
        </div>
        
        <Button 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          className="w-full sm:w-auto"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/4 space-y-4">
          <NewsSourceSelector 
            selectedSources={selectedSources}
            onSourcesChange={setSelectedSources}
          />
          <CategoryFilters 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
        
        <div className="lg:w-3/4">
          <div className="grid gap-4">
            {filteredArticles.map((article) => (
              <ArticleCard 
                key={article.id} 
                article={article}
                onClick={() => setSelectedArticle(article)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;