import Header from '@/components/header'
import NewsCard from '@/components/news-card'
import { fetchNews } from '@/lib/news-service'
import { NewsFilters } from '@/lib/types';
import { processArticles } from '@/lib/article-utils';

export default async function Home({ searchParams }: { searchParams: NewsFilters }) {
  const response = await fetchNews(searchParams);

  // Add inferred categories to articles
  const articlesWithCategories = processArticles(response.articles);

  const [headlineArticle, ...restArticles] = articlesWithCategories;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">

        {/* Headline Section */}
        {headlineArticle && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Top Story</h2>
            <NewsCard {...headlineArticle} isHeadline />
          </section>
        )}

        {/* Rest of the News */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Latest News</h2>
          <div className="grid grid-cols-4 gap-6">
            {restArticles.map((article) => (
              <NewsCard 
                key={article.url} 
                {...article} 
                variant='vertical'
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
