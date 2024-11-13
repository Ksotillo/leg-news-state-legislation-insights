"use client";

import { useArticle } from "@/context/ArticleContext";
import Image from "next/image";
import { newsAuthors } from "@/lib/news-autors";
import { formatDistanceToNow } from "date-fns";

export default function ArticleDetail() {
	const { selectedArticle } = useArticle();

	if (!selectedArticle) return <div>No article selected</div>;

	const sourceIcon =
		newsAuthors[selectedArticle.source?.id as keyof typeof newsAuthors] || newsAuthors[selectedArticle.source?.name as keyof typeof newsAuthors] || newsAuthors.generic;

	const content = selectedArticle.content?.replace(/\[\+\d+ chars\]$/, '');

	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-[1200px]">
			<h1 className="font-aleo font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-4">{selectedArticle.title}</h1>
			{selectedArticle.urlToImage && (
				<div className="w-full h-[200px] sm:h-[400px] md:h-[500px] lg:h-[650px] relative rounded-xl my-4 sm:my-6 lg:my-8">
					<Image 
						src={selectedArticle.urlToImage} 
						alt={selectedArticle.title} 
						fill 
						className="object-cover rounded-xl"
						sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1200px"
					/>
				</div>
			)}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 my-4 sm:my-6 lg:my-8">
				<div className="flex items-center gap-2">
					<Image 
						src={sourceIcon} 
						alt={selectedArticle.source.name} 
						width={32} 
						height={32} 
						className="rounded-full sm:w-[40px]"
					/>
					<span className="text-sm sm:text-base text-gray-600">
						{selectedArticle.source.name} · {formatDistanceToNow(new Date(selectedArticle.publishedAt))} ago
					</span>
				</div>

				<div className="flex items-center gap-2">
					<span className="text-fireOpal font-semibold capitalize text-sm sm:text-base">{selectedArticle.category}</span>
					<span className="text-base sm:text-lg text-osloGray">·</span>
					{selectedArticle.readTime && <span className="text-osloGray font-semibold text-sm sm:text-base">{selectedArticle.readTime} min read</span>}
				</div>
			</div>
			<p className="text-base sm:text-lg mb-2 sm:mb-4">{selectedArticle.description}</p>
			<p className="text-sm sm:text-base">{content}</p>
			<div className="flex justify-center mt-4 sm:mt-6 lg:mt-8">
				<a
					href={selectedArticle.url}
					target="_blank"
					rel="noopener noreferrer"
					className="px-3 py-2 sm:px-4 sm:py-2 bg-fireOpal text-white rounded-xl inline-block hover:bg-red-600 transition-colors text-sm sm:text-base"
				>
					See full article
				</a>
			</div>
		</div>
	);
}
