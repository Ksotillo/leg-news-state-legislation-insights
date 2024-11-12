import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { NewsArticle } from '@/lib/types'
import { newsAuthors } from '@/lib/news-autors'

interface NewsCardProps extends NewsArticle {
  category: string
  readTime?: number
  variant?: 'horizontal' | 'vertical'
  isHeadline?: boolean
}

function NewsImage({ urlToImage, title, variant, isHeadline }: Pick<NewsCardProps, 'urlToImage' | 'title'> & { variant: 'horizontal' | 'vertical', isHeadline?: boolean }) {
  if (!urlToImage) return null;
  return (
    <div className={variant === "vertical" ? "w-full h-48 relative" : `${isHeadline ? "w-1/2 h-80" : "w-80 h-48"} relative shrink-0`}>
      <Image src={urlToImage} alt={title} fill className="object-cover rounded-xl" />
    </div>
  );
}

function NewsContent({ title, description, source, publishedAt, category, readTime, variant, isHeadline }: Omit<NewsCardProps, 'urlToImage'>) {
  if (!source) return null;

  const sourceIcon = newsAuthors[source?.id as keyof typeof newsAuthors] || newsAuthors[source.name as keyof typeof newsAuthors] || newsAuthors.generic;

  return (
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-2">
        <Image src={sourceIcon} alt={source.name} width={20} height={20} className="rounded-full" />
        <span className="text-sm text-gray-600">
          {source.name} <span className="text-lg mx-1">·</span> {formatDistanceToNow(new Date(publishedAt))} ago
        </span>
      </div>
      <h2 className={`font-aleo font-semibold mb-4 ${variant === "horizontal" && isHeadline ? "text-5xl" : "text-xl"}`}>{title}</h2>
      <p className="text-osloGray font-semibold mb-4">{description}</p>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-fireOpal font-semibold capitalize">{category}</span>
        <span className="text-lg text-osloGray">·</span>
        {readTime && <span className="text-osloGray font-semibold">{readTime} min read</span>}
      </div>
    </div>
  );
}

export default function NewsCard({
  variant = 'horizontal',
  isHeadline = false,
  ...props
}: NewsCardProps) {
  const containerClassName = variant === 'vertical'
    ? "flex flex-col gap-4 py-4 border-b border-gray-100"
    : "flex gap-12 py-4 border-b border-gray-100"

  return (
    <article className={containerClassName}>
      <NewsImage urlToImage={props.urlToImage} title={props.title} variant={variant} isHeadline={isHeadline} />
      <NewsContent {...props} variant={variant} isHeadline={isHeadline} />
    </article>
  )
}