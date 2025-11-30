import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';

// Google Custom Search API configuration
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;

interface SearchResult {
  url: string;
  thumbnail: string;
  title: string;
  source: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Search query required' }, { status: 400 });
    }

    // Check if Google API is configured
    if (!GOOGLE_API_KEY || !GOOGLE_SEARCH_ENGINE_ID) {
      // Fallback: Use a simple approach with DuckDuckGo or return sample data
      // For production, you should configure Google Custom Search API
      return NextResponse.json({
        images: [],
        error: 'Bitte konfigurieren Sie GOOGLE_API_KEY und GOOGLE_SEARCH_ENGINE_ID in der .env Datei',
      });
    }

    // Search Google Images
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&searchType=image&num=20&imgType=product`;

    const response = await fetch(searchUrl);
    const data = await response.json();

    if (data.error) {
      console.error('Google API error:', data.error);
      return NextResponse.json({
        error: `Google API Fehler: ${data.error.message}`,
        images: []
      });
    }

    const images: SearchResult[] = (data.items || []).map((item: any) => ({
      url: item.link,
      thumbnail: item.image?.thumbnailLink || item.link,
      title: item.title || '',
      source: item.displayLink || new URL(item.link).hostname,
    }));

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Image search error:', error);
    return NextResponse.json({ error: 'Fehler bei der Bildersuche', images: [] }, { status: 500 });
  }
}
