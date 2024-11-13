import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { InputSanitizer } from '@/lib/sanitize';

export function sanitizeMiddleware(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const sanitizedParams = new URLSearchParams();

	// Sanitize search query
	const query = searchParams.get('search');
	const sanitizedQuery = InputSanitizer.sanitizeSearchQuery(query);
	if (query && !sanitizedQuery) {
		return NextResponse.json(
			{ error: 'Invalid search query' },
			{ status: 400 }
		);
	}
	if (sanitizedQuery) {
		sanitizedParams.set('search', sanitizedQuery);
	}

	// Sanitize state
	const state = searchParams.get('state');
	const sanitizedState = InputSanitizer.sanitizeState(state);
	if (state && !sanitizedState) {
		return NextResponse.json(
			{ error: 'Invalid state code' },
			{ status: 400 }
		);
	}
	if (sanitizedState) {
		sanitizedParams.set('state', sanitizedState);
	}

	// Sanitize topic
	const topic = searchParams.get('topic');
	const sanitizedTopic = InputSanitizer.sanitizeTopic(topic);
	if (topic && !sanitizedTopic) {
		return NextResponse.json(
			{ error: 'Invalid topic' },
			{ status: 400 }
		);
	}
	if (sanitizedTopic) {
		sanitizedParams.set('topic', sanitizedTopic);
	}

	// Sanitize page number
	const page = searchParams.get('page');
	sanitizedParams.set('page', InputSanitizer.sanitizePage(page).toString());

	// Clone the request and update the URL with sanitized parameters
	const sanitizedUrl = new URL(request.url);
	sanitizedUrl.search = sanitizedParams.toString();
	
	const sanitizedRequest = new Request(sanitizedUrl, {
		headers: request.headers,
		method: request.method,
	});

	return sanitizedRequest;
} 