	import Header from '@/components/header';

	export default function ArticleLayout({
		children,
	}: {
		children: React.ReactNode;
	}) {
		return (
			<div className="min-h-screen bg-white">
				<Header hideFilters={true} />
				{children}
			</div>
		);
	} 