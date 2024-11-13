import { Suspense } from 'react'
import Header from '@/components/header'
import NewsCard from '@/components/news-card'
import { NewsCardSkeleton } from '@/components/news-skeleton'
import { fetchNews } from '@/lib/news-service'
import { Category, NewsFilters } from '@/lib/types'
import { processArticles } from '@/lib/article-utils'
import InfiniteScroll from '@/components/infinite-scroll'

async function NewsContent({ searchParams }: { searchParams: NewsFilters }) {
	const response = await fetchNews(searchParams);
	const articlesWithCategories = processArticles(response.articles, searchParams.topic as Category);
	const [headlineArticle, ...restArticles] = articlesWithCategories;

	const contentKey = JSON.stringify(searchParams);

	return (
		<div key={contentKey} className="animate-fade">
			{/* Headline Section */}
			{headlineArticle && (
				<section className="mb-8 md:mb-12">
					<h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">Top Story</h2>
					<NewsCard {...headlineArticle} isHeadline />
				</section>
			)}

			{/* Rest of the News */}
			<section className="mb-6 md:mb-8">
				<h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">Latest News</h2>
				<InfiniteScroll
					searchParams={searchParams}
					initialItems={restArticles}
				/>
			</section>
		</div>
	);
}

export default function Home({ searchParams }: { searchParams: NewsFilters }) {
	return (
		<div className="min-h-screen bg-white">
			<Header />
			<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
				<Suspense fallback={
					<>
						<section className="mb-8 md:mb-12">
							<h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">Top Story</h2>
							<NewsCardSkeleton isHeadline />
						</section>
						<section className="mb-6 md:mb-8">
							<h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">Latest News</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
								{Array.from({ length: 8 }).map((_, i) => (
									<NewsCardSkeleton key={i} variant="vertical" />
								))}
							</div>
						</section>
					</>
				}>
					<NewsContent searchParams={searchParams} />
				</Suspense>
			</main>
		</div>
	)
}
