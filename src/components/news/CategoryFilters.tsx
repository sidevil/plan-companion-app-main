import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const categories = [
  { name: 'All', count: 156 },
  { name: 'Technology', count: 64 },
  { name: 'Weather', count: 32 },
  { name: 'Smart Home', count: 28 },
  { name: 'Health', count: 18 },
  { name: 'Business', count: 14 }
];

interface CategoryFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {categories.map((category) => (
          <div 
            key={category.name}
            className="flex items-center justify-between"
          >
            <button
              onClick={() => onCategoryChange(category.name)}
              className={`text-sm font-medium transition-colors cursor-pointer ${
                selectedCategory === category.name
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {category.name}
            </button>
            <Badge 
              variant={selectedCategory === category.name ? 'default' : 'secondary'}
              className="text-xs"
            >
              {category.count}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};