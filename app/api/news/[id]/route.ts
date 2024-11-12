import { NextRequest, NextResponse } from 'next/server';
import { NEWS_API_KEY, NEWS_API_BASE_URL } from '@/lib/config';

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const response = await fetch(
			`${NEWS_API_BASE_URL}/everything?apiKey=${NEWS_API_KEY}&qInTitle=${params.id}`,
			{
				headers: {
					'X-Api-Key': NEWS_API_KEY,
				},
			}
		);

		if (!response.ok) {
			throw new Error('News API request failed');
		}

		const data = await response.json();
		const article = data.articles[0];

		if (!article) {
			return NextResponse.json(
				{ error: 'Article not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(article);
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to fetch article' + error },
			{ status: 500 }
		);
	}
}