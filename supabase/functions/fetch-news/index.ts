import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category = 'general', country = 'us' } = await req.json();
    const NEWS_API_KEY = Deno.env.get('NEWS_API_KEY');

    if (!NEWS_API_KEY) {
      throw new Error('NEWS_API_KEY is not configured');
    }

    console.log('Fetching news for category:', category);

    // Fetch news from NewsAPI
    const newsUrl = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&pageSize=10&apiKey=${NEWS_API_KEY}`;
    
    const response = await fetch(newsUrl);
    
    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform the data into our format
    const articles = data.articles.map((article: any, index: number) => ({
      id: index,
      title: article.title,
      source: article.source.name,
      url: article.url,
      publishedAt: article.publishedAt,
      time: formatTimeAgo(new Date(article.publishedAt)),
      description: article.description,
      imageUrl: article.urlToImage,
    }));

    console.log(`Fetched ${articles.length} articles successfully`);

    return new Response(JSON.stringify({ articles }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to fetch news' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) {
    return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }
}
