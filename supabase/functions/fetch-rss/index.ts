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
    const { rssUrl } = await req.json();

    if (!rssUrl) {
      throw new Error('RSS URL is required');
    }

    console.log('Fetching RSS feed from:', rssUrl);

    // Fetch RSS feed
    const response = await fetch(rssUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status}`);
    }

    const xmlText = await response.text();
    
    // Parse RSS feed
    const articles = parseRSS(xmlText);
    
    console.log(`Parsed ${articles.length} articles from RSS feed`);

    return new Response(JSON.stringify({ articles }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching RSS:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to fetch RSS feed' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function parseRSS(xmlText: string) {
  const articles: any[] = [];
  
  // Simple RSS/Atom parser using regex (basic implementation)
  // Matches both RSS 2.0 and Atom feeds
  
  // Try RSS 2.0 format first
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  const items = xmlText.match(itemRegex);
  
  if (items) {
    items.forEach((item, index) => {
      const title = extractTag(item, 'title');
      const link = extractTag(item, 'link');
      const description = extractTag(item, 'description');
      const pubDate = extractTag(item, 'pubDate');
      const source = extractTag(item, 'source') || extractTag(xmlText, 'title') || 'RSS Feed';
      
      if (title && link) {
        articles.push({
          id: index,
          title: cleanText(title),
          source: cleanText(source),
          url: cleanText(link),
          publishedAt: pubDate || new Date().toISOString(),
          time: formatTimeAgo(pubDate ? new Date(pubDate) : new Date()),
          description: cleanText(description) || '',
          imageUrl: extractImageUrl(item) || '',
        });
      }
    });
  } else {
    // Try Atom format
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/gi;
    const entries = xmlText.match(entryRegex);
    
    if (entries) {
      entries.forEach((entry, index) => {
        const title = extractTag(entry, 'title');
        const linkMatch = entry.match(/<link[^>]*href=["']([^"']+)["']/i);
        const link = linkMatch ? linkMatch[1] : '';
        const summary = extractTag(entry, 'summary') || extractTag(entry, 'content');
        const published = extractTag(entry, 'published') || extractTag(entry, 'updated');
        const authorName = extractTag(entry, 'name') || extractTag(xmlText, 'title') || 'Atom Feed';
        
        if (title && link) {
          articles.push({
            id: index,
            title: cleanText(title),
            source: cleanText(authorName),
            url: cleanText(link),
            publishedAt: published || new Date().toISOString(),
            time: formatTimeAgo(published ? new Date(published) : new Date()),
            description: cleanText(summary) || '',
            imageUrl: extractImageUrl(entry) || '',
          });
        }
      });
    }
  }
  
  return articles.slice(0, 20); // Limit to 20 articles
}

function extractTag(xml: string, tagName: string): string {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\/${tagName}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1] : '';
}

function extractImageUrl(xml: string): string {
  // Try to find image in enclosure tag
  const enclosureMatch = xml.match(/<enclosure[^>]*url=["']([^"']+)["'][^>]*type=["']image/i);
  if (enclosureMatch) return enclosureMatch[1];
  
  // Try to find image in media:content tag
  const mediaMatch = xml.match(/<media:content[^>]*url=["']([^"']+)["']/i);
  if (mediaMatch) return mediaMatch[1];
  
  // Try to find image in content
  const imgMatch = xml.match(/<img[^>]*src=["']([^"']+)["']/i);
  if (imgMatch) return imgMatch[1];
  
  return '';
}

function cleanText(text: string): string {
  return text
    .replace(/<!\[CDATA\[/g, '')
    .replace(/\]\]>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
}
