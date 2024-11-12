import { NextRequest, NextResponse } from 'next/server';
import { NEWS_API_KEY, NEWS_API_BASE_URL } from '@/lib/config';
import { NewsApiResponse } from '@/lib/types';

// Legislative keywords:
const keywords = ['Law', 'Legislation', 'Congress', 'Senate', 'House'].join(' OR ');

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const state = searchParams.get('state');
	const topic = searchParams.get('topic');
	const search = searchParams.get('search');
	const page = searchParams.get('page') || '1';
	const pageSize = searchParams.get('pageSize') || '10';

	// Build query string
	const queryParts = [];
	if (state) queryParts.push(state);
	if (topic) queryParts.push(topic);
	if (search) queryParts.push(search);

    const query = queryParts.length > 0 ? `(${keywords}) AND (${queryParts.join(" AND ")})` : keywords;

	const params = new URLSearchParams({
		pageSize,
		page,
		q: query,
	});

	try {
		const response = await fetch(
			`${NEWS_API_BASE_URL}/everything?${params.toString()}`,
			{
				headers: {
					'X-Api-Key': NEWS_API_KEY,
				},
			}
		);
		console.log("Response status:", response.status, response.statusText, `${NEWS_API_BASE_URL}/everything?${params.toString()}`);
		if (!response.ok) {
			throw new Error('News API request failed');
		}

		const data: NewsApiResponse = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to fetch news' + error },
			{ status: 500 }
		);
	}
}

// Optional: POST endpoint for adding new articles
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		// Here you would typically save to your database
		// For now, we'll just return the posted data
		return NextResponse.json(body, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to add article' + error },
			{ status: 500 }
		);
	}
}