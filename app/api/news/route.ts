import { NextRequest, NextResponse } from 'next/server';
import { NEWS_API_KEY, NEWS_API_BASE_URL } from '@/lib/config';
import { NewsApiResponse } from '@/lib/types';
import { memoryCache } from '@/lib/memory-cache';
import { sanitizeMiddleware } from '@/middleware/sanitize-middleware';
import { rateLimitMiddleware } from '@/middleware/rate-limit-middleware';
import { supabase } from '@/lib/supabase';

// Legislative keywords:
const keywords = ['Law', 'Legislation', 'Congress', 'Senate', 'House'].join(' OR ');

// Enable Next.js Route Handler caching
export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5 minutes

export async function GET(request: NextRequest) {
	// Check rate limit first
    const rateLimitResponse = await rateLimitMiddleware(request);
    if (rateLimitResponse.status === 429) {
        return rateLimitResponse;
    }

    // Sanitize inputs
    const sanitizedRequest = await sanitizeMiddleware(request);

    // If sanitization failed, it will return a Response
    if (sanitizedRequest instanceof Response) {
	    return sanitizedRequest;
    }

	const searchParams = request.nextUrl.searchParams;
	const state = searchParams.get('state');
	const topic = searchParams.get('topic');
	const search = searchParams.get('search');
	const page = searchParams.get('page') || '1';
	const pageSize = searchParams.get('pageSize') || '10';

	// Create a cache key from the search params
	const cacheKey = `news:${searchParams.toString()}`;

	// Try to get from memory cache first
	const cachedData = memoryCache.get(cacheKey);
	if (cachedData) {
		return NextResponse.json(cachedData, {
			headers: { 'X-Cache': 'HIT' },
		});
	}

	// Build query string for News API
	const queryParts = [];
	if (state) queryParts.push(state);
	if (topic) queryParts.push(topic);
	if (search) queryParts.push(search);

    const query = queryParts.length > 0 ? `(${keywords})+AND+(${queryParts.join(" AND ")})` : keywords;

	const params = new URLSearchParams({
		pageSize,
		page,
		q: query,
	});

	try {
		// Fetch from News API
		const newsApiResponse = await fetch(
			`${NEWS_API_BASE_URL}/everything?${params.toString()}`,
			{
				headers: {
					'X-Api-Key': NEWS_API_KEY,
				},
			}
		);

		if (!newsApiResponse.ok) {
			throw new Error('News API request failed');
		}

		const newsApiData: NewsApiResponse = await newsApiResponse.json();

		// Fetch from Supabase
		let supabaseQuery = supabase.from('article').select('*');
		
		if (state) {
			supabaseQuery = supabaseQuery.eq('state', state);
		}
		if (topic) {
			supabaseQuery = supabaseQuery.eq('category', topic);
		}
		if (search) {
			supabaseQuery = supabaseQuery.ilike('title', `%${search}%`);
		}

		const { data: supabaseData, error: supabaseError } = await supabaseQuery;

		if (supabaseError) {
			throw supabaseError;
		}

		// Combine and format the data
		const combinedData = {
			...newsApiData,
			articles: [
				...(supabaseData || []).map(article => ({
					title: article.title,
					description: article.description,
					content: article.content,
					url: `/article/${article.id}`,
					urlToImage: article.urlToImage,
					publishedAt: article.created_at,
					source: { id: 'local', name: 'Local News' }
				})),
				...newsApiData.articles
			],
			totalResults: (newsApiData.totalResults || 0) + (supabaseData?.length || 0)
		};

		// Store in memory cache
		memoryCache.set(cacheKey, combinedData);

		// Return the combined data
		return NextResponse.json(combinedData, {
			headers: { 'X-Cache': 'MISS' },
		});
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to fetch news: ' + error },
			{ status: 500 }
		);
	}
}
