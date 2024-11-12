export interface NewsArticle {
	source: {
		id: string | null;
		name: string;
	};
	author: string | null;
	title: string;
	description: string;
	url: string;
	urlToImage: string | null;
	publishedAt: string;
	content: string;
}

export type Category = "politics" | "economy" | "health" | "education" | "technology" | "environment" | "general";

export type NewsArticleWithCategoryAndReadTime = NewsArticle & {
	category: Category;
	readTime: number;
}

export interface NewsApiResponse {
	status: string;
	totalResults: number;
	articles: NewsArticle[];
}

export interface NewsFilters {
	search?: string;
	state?: string;
	topic?: string;
	page?: number;
	pageSize?: number;
}