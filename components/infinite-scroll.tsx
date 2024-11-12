'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { NewsCardSkeleton } from './news-skeleton';
import { Category, NewsApiResponse, NewsArticleWithCategoryAndReadTime, NewsFilters } from '@/lib/types';
import { processArticles } from '@/lib/article-utils';
import NewsCard from './news-card';
import { fetchWithCache } from '@/lib/fetch-utils';

interface InfiniteScrollProps {
	searchParams: NewsFilters;
	initialItems: NewsArticleWithCategoryAndReadTime[];
}

export default function InfiniteScroll({ searchParams, initialItems }: InfiniteScrollProps) {
	const [items, setItems] = useState(initialItems);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const { ref, inView } = useInView();

	useEffect(() => {
		setItems(initialItems);
		setPage(1);
		setHasMore(true);
	}, [initialItems]);

	useEffect(() => {
		const loadMore = async () => {
			if (!inView || isLoading || !hasMore) return;

			setIsLoading(true);
			try {
				const nextPage = page + 1;
				const data = await fetchWithCache<NewsApiResponse>(`/api/news?${new URLSearchParams({
					...searchParams,
					page: nextPage.toString(),
					pageSize: '10'
				})}`);

				if (!data.articles || data.articles.length === 0) {
					setHasMore(false);
					return;
				}

				const processedArticles = processArticles(data.articles, searchParams.topic as Category);
				setItems(prev => [...prev, ...processedArticles]);
				setPage(nextPage);
			} catch (error) {
				console.error('Error loading more items:', error);
				setHasMore(false);
			} finally {
				setIsLoading(false);
			}
		};

		loadMore();
	}, [inView, isLoading, hasMore, page, searchParams]);

	return (
		<>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
				{items.map((article) => (
					<NewsCard 
						key={article.url} 
						{...article} 
						variant='vertical'
					/>
				))}
			</div>

			{hasMore && (
				<div ref={ref} className="mt-4 md:mt-8">
					{isLoading && (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
							{Array.from({ length: 4 }).map((_, i) => (
								<NewsCardSkeleton key={i} variant="vertical" />
							))}
						</div>
					)}
				</div>
			)}

			{!hasMore && (
				<div className="text-center text-gray-500 mt-4 md:mt-8">
					No more articles to load
				</div>
			)}
		</>
	);
} 