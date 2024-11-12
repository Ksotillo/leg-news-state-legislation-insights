import { NewsApiResponse, NewsFilters } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function fetchNews(filters: NewsFilters): Promise<NewsApiResponse> {
	try {
		const params = new URLSearchParams();

		if (filters.search) params.append('search', filters.search);
		if (filters.state) params.append('state', filters.state);
		if (filters.topic) params.append('topic', filters.topic);
		if (filters.page) params.append('page', filters.page.toString());
		if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());

		const url = `${API_BASE_URL}/news?${params.toString()}`;

		const response = await fetch(url);

		if (!response.ok) {
			const errorText = await response.text();
			console.error('API Error:', errorText);
			throw new Error(`API request failed: ${response.status} ${errorText}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error fetching news:', error);
		throw error;
	}
}

export async function fetchArticle(id: string) {
	try {
		const response = await fetch(`/api/news/${id}`);

		if (!response.ok) {
			throw new Error('API request failed');
		}

		return await response.json();
	} catch (error) {
		console.error('Error fetching article:', error);
		throw error;
	}
}

export async function addArticle(article: any) {
	try {
		const response = await fetch('/api/news', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(article),
		});

		if (!response.ok) {
			throw new Error('API request failed');
		}

		return await response.json();
	} catch (error) {
		console.error('Error adding article:', error);
		throw error;
	}
}