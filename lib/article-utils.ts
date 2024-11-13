import { Category, NewsArticle, NewsArticleWithCategoryAndReadTime } from './types';
import { inferCategoryFromArticle } from './category-inference';


const isRemoved = (text: string | null) => !text || text === "[Removed]" || text.toLowerCase().includes("removed");

const WORDS_PER_MINUTE = 200;
const CHARS_PER_WORD = 5;

const calculateReadTime = (content: string) => {
	const words = content.split(' ').length;
	return Math.ceil(words + (content.match(/\[\+(\d+)\]/) ? parseInt(content.match(/\[\+(\d+)\]/)?.[1] || '0') / CHARS_PER_WORD : 0) / WORDS_PER_MINUTE);
}

export function processArticles(articles: NewsArticle[], category: Category): NewsArticleWithCategoryAndReadTime[] {
	return articles
		// First filter out invalid articles
		.filter(article => {

			return !isRemoved(article.title) && 
				!isRemoved(article.description) && 
				!isRemoved(article.content)
				//article.urlToImage !== null;  // Only keep articles with images
		})
		// Then add categories to remaining articles
		.map(article => ({
			...article,
			category: category || inferCategoryFromArticle(article),
			readTime: calculateReadTime(article.content),
		}));
}