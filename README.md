# Legislative News Aggregator

A modern web application that aggregates and displays news articles related to state legislation, allowing users to filter by state and legislative topics. Built with Next.js 14, Supabase, and Clerk Authentication.

[Live Demo](https://leg-news-state-legislation-insights.vercel.app/)

## Design

This project was implemented following a custom design created in Figma. The complete design system and components can be viewed here:
[LegNews - State Legislation Insights (Figma)](https://www.figma.com/design/hd367dMC1nTiHpfRORyfu8/LegNews---State-Legislation-Insights?node-id=0-1&node-type=canvas&t=Z1r5TGZCIOfey1IC-0)

The UI implementation closely follows the Figma design specifications, ensuring consistency in:
- Typography
- Color palette
- Component layouts
- Responsive design
- Visual hierarchy

## Features

- 📰 Real-time news feed with infinite scroll
- 🔍 Filter news by state and legislative topics
- 🎯 Personalized news preferences
- 👤 User authentication and profiles
- ✍️ Article creation and management
- 📱 Responsive design with modern UI
- ⚡ Server-side rendering for optimal performance

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase
- **Authentication**: Clerk
- **Storage**: Supabase Storage
- **UI Components**: shadcn/ui

## Key Features

- Dynamic news feed with headline and latest news sections
- State and category-based filtering
- User preference management
- Article creation with image upload
- Infinite scroll for seamless content loading
- Responsive design for all devices
- Server-side rendering with Suspense for optimal loading states

## System Design

### News Aggregation Strategy
- Articles are fetched from multiple sources using the NewsAPI
- Articles are categorized using keyword-based topic inference
- State information is extracted through keyword matching
- Basic filtering and search functionality implemented through Supabase queries

Note: Future improvements could include:
- Content deduplication through title and content hashing
- Advanced NLP-based categorization
- More sophisticated state and location entity extraction

Proposed Improvements for Multi-Source Aggregation:
1. **Source Integration**:
   - Implement adapters for multiple news APIs (NewsAPI, Reuters, AP)
   - Create standardized format for article data across sources
   - Use webhooks for real-time updates where available

2. **Deduplication Strategy**:
   - Generate content fingerprints using title + first paragraph
   - Implement Levenshtein distance for similarity checking
   - Store article hashes in a separate table for quick comparison
   - Use timestamp + source as additional uniqueness validators

3. **Data Freshness**:
   - Implement TTL (Time-To-Live) for cached articles
   - Set up periodic revalidation (every 15 minutes)
   - Use background jobs for data refresh
   - Maintain update logs for data staleness monitoring

### Data Storage Architecture
- **Primary Storage**: Supabase (PostgreSQL) for structured data
- **Caching Layer**: Built-in Next.js caching for API routes
- **Image Storage**: Supabase Storage for article images

Proposed Scalability Solutions:
1. **Database Optimization**:
   - Implement table partitioning by date
   - Create materialized views for common queries
   - Set up read replicas for query distribution
   - Archive older articles to cold storage

2. **Indexing Strategy**:
   - B-tree indexes on frequently queried columns (state, category, date)
   - Full-text search indexes on title and content
   - Composite indexes for common filter combinations
   - Partial indexes for active/recent articles

3. **Data Distribution**:
   - Implement sharding based on date ranges
   - Use content delivery networks for static content
   - Set up geographic data distribution
   - Implement caching at multiple levels

### Caching Implementation
- Server-side caching using Next.js 14 cache()
- Static page generation for common filters
- Revalidation triggers on new article creation
- Client-side caching with SWR for real-time updates

### Search Implementation
- Basic search functionality through Supabase queries
- Paginated results with infinite scroll
- Debounced search input for performance

Proposed Search Improvements:
1. **Search Infrastructure**:
   - Implement Elasticsearch (or similar) for efficient full-text search
   - Set up search indices with proper analyzers
   - Use denormalized search documents
   - Implement faceted search capabilities

2. **Query Optimization**:
   - Implement query result caching
   - Use cursor-based pagination
   - Add search result scoring
   - Implement search suggestions

3. **Performance Enhancements**:
   - Asynchronous index updates
   - Search query optimization
   - Result caching strategies
   - Load balancing for search queries

## Scalability Considerations

### Database Structure
- Basic Supabase tables for articles and user preferences
- Simple queries for filtering by state and category
- Standard PostgreSQL indexing

### Performance Optimizations
- Image optimization using Next.js Image component
- Lazy loading for off-screen content

### Load Handling
- Serverless functions for API routes
- Rate limiting on API endpoints

### Future Scale Considerations
- Potential migration to elastic search for better search capabilities
- Implementation of Redis for caching
- Content Delivery Network (CDN) for static assets
- Microservices architecture for specific features

## Assumptions and Technical Decisions

### Current Limitations
- News API rate limits on free tier
- Limited historical data storage
- Basic text-based search implementation
- Simple category inference

### Technical Decisions
1. **Next.js 14**: Chosen for:
   - Server components
   - Built-in TypeScript support
   - API routes
   - Basic caching

2. **Supabase**: Selected for:
   - Database storage
   - Image storage
   - Basic querying

3. **Clerk**: Implemented for:
   - Secure authentication
   - OAuth integration
   - User management
   - Session handling

### Future Improvements
1. **Features**:
   - Email notifications for saved searches
   - Advanced filtering options
   - Collaborative features
   - Mobile application

2. **Technical**:
   - Advanced analytics
   - Machine learning for better categorization
   - Real-time notifications
   - API rate limit increase

3. **Infrastructure**:
   - Multi-region deployment
   - Backup and disaster recovery
   - Monitoring and alerting
   - Performance analytics

### Development Workflow
- Main branch for production code
- Basic ESLint configuration
- TypeScript for type safety
- Vercel for deployment

## Setup Instructions

## Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- A Clerk account and application
- A NewsAPI key


1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/legislative-news-aggregator.git
cd legislative-news-aggregator
```

2. **Set Up Environment Variables**
Create a `.env.local` file in the root directory with the following variables:
```bash
# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

3. **Set Up Supabase**
- Create a new Supabase project
- Run the following SQL commands to set up the database schema:
```sql
-- Create articles table
CREATE TABLE articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  state TEXT,
  category TEXT,
  content TEXT,
  urlToImage TEXT,
  author UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create user preferences table
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  favorite_states TEXT[],
  favorite_categories TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);
```

4. **Set Up Clerk**
- Create a new Clerk application
- Configure OAuth providers if needed
- Set up the required environment variables

5. **Install Dependencies**
```bash
npm install
# or
yarn install
```

6. **Run Development Server**
```bash
npm run dev
# or
yarn dev
```

7. **Build for Production**
```bash
npm run build
# or
yarn build
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a custom font.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Supabase Documentation](https://supabase.com/docs) - learn about Supabase features.
- [Clerk Documentation](https://clerk.com/docs) - learn about Clerk authentication.
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - learn about Tailwind CSS.
- [shadcn/ui Documentation](https://ui.shadcn.com/docs) - learn about shadcn/ui components.

## Live Demo

The application is live and can be accessed at: [Legislative News Aggregator](https://leg-news-state-legislation-insights.vercel.app/)

## Deploy on Vercel

This project is deployed on Vercel. If you want to deploy your own instance:

1. Fork this repository
2. Create a new project on [Vercel](https://vercel.com)
3. Connect your forked repository
4. Set up the following environment variables in your Vercel project settings:
   ```bash
   # Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=

   # Database
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   ```
5. Deploy!

Check out [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## API Routes

- `GET /api/news` - Fetch news articles with optional filters
  - Query params: state, topic, search, page
- `GET /api/news/:id` - Fetch specific article details
- `POST /api/articles` - Create new article (authenticated)
- `GET /api/user/preferences` - Get user preferences (authenticated)
- `POST /api/user/preferences` - Update user preferences (authenticated)

## Project Structure

```
├── app/                  # Next.js app router pages
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── ...             # Feature-specific components
├── lib/                # Utilities and configurations
├── hooks/              # Custom React hooks
└── public/             # Static assets
```