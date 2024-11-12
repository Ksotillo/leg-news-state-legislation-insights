import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { NewsArticleWithCategoryAndReadTime } from '@/lib/types';

interface ArticleContextType {
	selectedArticle: NewsArticleWithCategoryAndReadTime | null;
	setSelectedArticle: (article: NewsArticleWithCategoryAndReadTime) => void;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export const ArticleProvider = ({ children }: { children: ReactNode }) => {
	const [selectedArticle, setSelectedArticle] = useState<NewsArticleWithCategoryAndReadTime | null>(() => {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('selectedArticle');
			return saved ? JSON.parse(saved) : null;
		}
		return null;
	});

	useEffect(() => {
		if (selectedArticle) {
			localStorage.setItem('selectedArticle', JSON.stringify(selectedArticle));
		} else {
			localStorage.removeItem('selectedArticle');
		}
	}, [selectedArticle]);

	return (
		<ArticleContext.Provider value={{ selectedArticle, setSelectedArticle }}>
			{children}
		</ArticleContext.Provider>
	);
};

export const useArticle = () => {
	const context = useContext(ArticleContext);
	if (!context) {
		throw new Error('useArticle must be used within an ArticleProvider');
	}
	return context;
};