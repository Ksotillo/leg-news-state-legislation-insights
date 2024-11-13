import ArticleForm from '@/components/article-form';

export default function NewArticlePage() {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-2xl font-bold mb-6">Create New Article</h1>
				<ArticleForm />
			</div>
		</div>
	);
}