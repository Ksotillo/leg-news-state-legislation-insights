import { NewsArticle, Category } from "./types";

export const categoryKeywords: Record<Category, string[]> = {
	politics: ['election', 'vote', 'congress', 'senate', 'governor', 'bill', 'legislation', 'democrat', 'republican', 'political'],
	economy: ['economy', 'business', 'market', 'finance', 'trade', 'tax', 'budget', 'economic', 'investment'],
	health: ['health', 'medical', 'hospital', 'healthcare', 'disease', 'treatment', 'patient', 'doctor', 'medicine'],
	education: ['education', 'school', 'student', 'teacher', 'university', 'college', 'academic', 'learning'],
	technology: ['tech', 'technology', 'digital', 'software', 'internet', 'cyber', 'AI', 'data', 'innovation'],
	environment: ['climate', 'environment', 'energy', 'pollution', 'renewable', 'sustainability', 'green'],
	general: [] // fallback category
};

export function inferCategoryFromArticle(article: NewsArticle): Category {
	const textToAnalyze = [
		article.title,
		article.description,
		article.content
	].join(' ').toLowerCase();

	// Count matches for each category
	const categoryMatches = Object.entries(categoryKeywords).map(([category, keywords]) => {
		const matches = keywords.filter(keyword => textToAnalyze.includes(keyword)).length;
		return { category: category as Category, matches };
	});

	// Sort by number of matches
	const [bestMatch] = categoryMatches
		.sort((a, b) => b.matches - a.matches)
		.filter(match => match.matches > 0);

	return bestMatch?.category || 'general';
}