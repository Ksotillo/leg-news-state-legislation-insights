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

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="20%" />
      <stop stop-color="#edeef1" offset="50%" />
      <stop stop-color="#f6f7f8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)

function NewsImage({ urlToImage, title, variant, isHeadline }: Pick<NewsCardProps, 'urlToImage' | 'title'> & { variant: 'horizontal' | 'vertical', isHeadline?: boolean }) {
  if (!urlToImage) return null;

  return (
    <div
      className={`
      ${variant === "vertical" ? "w-full h-48 relative" : `${isHeadline ? "w-1/2 h-80" : "w-80 h-48"} relative shrink-0`}
      bg-gray-200 rounded-xl overflow-hidden group cursor-pointer
    `}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-shimmer"
        style={{
          background: "linear-gradient(to right, transparent 0%, #f6f7f8 50%, transparent 100%)",
          animation: "shimmer 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        }}
      />
      <Image
        src={urlToImage}
        alt={title}
        fill
        className="object-cover rounded-xl transition-all duration-300 group-hover:scale-105"
        placeholder="blur"
        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
        sizes={variant === "vertical" ? "100vw" : isHeadline ? "50vw" : "20vw"}
      />
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
      <h2 className={`font-aleo font-semibold mb-4 cursor-pointer
        ${variant === "horizontal" && isHeadline ? "text-5xl" : "text-xl"}
        hover:text-fireOpal transition-colors duration-200`}>
        {title}
      </h2>
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
  const containerClassName = `${variant === 'vertical'
    ? "flex flex-col gap-4 py-4 border-b border-gray-100"
    : "flex gap-12 py-4 border-b border-gray-100"} 
    transition-opacity duration-300 ease-in-out opacity-0 animate-fade-in`

  return (
    <article className={containerClassName}>
      <NewsImage urlToImage={props.urlToImage} title={props.title} variant={variant} isHeadline={isHeadline} />
      <NewsContent {...props} variant={variant} isHeadline={isHeadline} />
    </article>
  )
}