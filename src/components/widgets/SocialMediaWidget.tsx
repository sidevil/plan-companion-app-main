import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Heart, Share, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Placeholder data - will be replaced with real social media API data in Phase 7
const mockPosts = [
  {
    id: 1,
    user: 'TechNews',
    avatar: '',
    content: 'New breakthrough in quantum computing announced today!',
    likes: 42,
    comments: 8,
    time: '2h ago'
  },
  {
    id: 2,
    user: 'WeatherAlert',
    avatar: '',
    content: 'Beautiful sunny weather expected this weekend 🌞',
    likes: 15,
    comments: 3,
    time: '4h ago'
  }
];

export const SocialMediaWidget = () => {
  return (
    <>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-accent" />
          Social Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="max-h-48 overflow-y-auto space-y-3">
          {mockPosts.map((post) => (
            <div key={post.id} className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={post.avatar} alt={post.user} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{post.user}</span>
                    <span className="text-xs text-muted-foreground">{post.time}</span>
                  </div>
                  <p className="text-sm text-foreground mb-2 line-clamp-2">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {post.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {post.comments}
                    </div>
                    <Share className="h-3 w-3 cursor-pointer hover:text-foreground" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center pt-2">
          <button className="text-sm text-accent hover:text-accent/80 font-medium transition-colors">
            View Full Feed →
          </button>
        </div>
      </CardContent>
    </>
  );
};