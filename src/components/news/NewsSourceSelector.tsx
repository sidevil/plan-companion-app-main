import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

const newsSources = [
  { id: 'all', name: 'All Sources', count: 156 },
  { id: 'technews', name: 'TechNews', count: 45 },
  { id: 'aidaily', name: 'AI Daily', count: 32 },
  { id: 'weathercentral', name: 'Weather Central', count: 28 },
  { id: 'smarthomeliving', name: 'Smart Home Living', count: 23 },
  { id: 'futuretech', name: 'Future Tech', count: 28 }
];

interface NewsSourceSelectorProps {
  selectedSources: string[];
  onSourcesChange: (sources: string[]) => void;
}

export const NewsSourceSelector: React.FC<NewsSourceSelectorProps> = ({
  selectedSources,
  onSourcesChange
}) => {
  const handleSourceToggle = (sourceName: string) => {
    if (sourceName === 'All Sources') {
      onSourcesChange(['All']);
      return;
    }

    const currentSources = selectedSources.filter(s => s !== 'All');
    const isSelected = currentSources.includes(sourceName);
    
    if (isSelected) {
      const newSources = currentSources.filter(s => s !== sourceName);
      onSourcesChange(newSources.length === 0 ? ['All'] : newSources);
    } else {
      onSourcesChange([...currentSources, sourceName]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">News Sources</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {newsSources.map((source) => (
          <div key={source.id} className="flex items-center space-x-3">
            <Checkbox
              id={source.id}
              checked={
                source.name === 'All Sources' 
                  ? selectedSources.includes('All')
                  : selectedSources.includes(source.name)
              }
              onCheckedChange={() => handleSourceToggle(source.name)}
            />
            <label 
              htmlFor={source.id} 
              className="flex-1 flex justify-between items-center text-sm font-medium cursor-pointer"
            >
              <span>{source.name}</span>
              <span className="text-muted-foreground">({source.count})</span>
            </label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};