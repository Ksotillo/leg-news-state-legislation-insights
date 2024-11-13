import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimiter } from '@/lib/rate-limiter';

export function rateLimitMiddleware(request: NextRequest) {
	// Get IP address from headers or request
	const ip = request.headers.get('x-forwarded-for') || 
		request.ip || 
		'unknown';
	
	const { success, remaining, resetTime } = rateLimiter.check(ip);

	if (!success) {
		return NextResponse.json({
			error: 'Too many requests',
			message: 'Please try again later',
			resetTime: new Date(resetTime).toISOString()
		}, {
			status: 429,
			headers: {
				'X-RateLimit-Limit': '100',
				'X-RateLimit-Remaining': remaining.toString(),
				'X-RateLimit-Reset': resetTime.toString(),
				'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString()
			}
		});
	}

	// Add rate limit headers to successful requests
	const response = NextResponse.next();
	response.headers.set('X-RateLimit-Limit', '100');
	response.headers.set('X-RateLimit-Remaining', remaining.toString());
	response.headers.set('X-RateLimit-Reset', resetTime.toString());

	return response;
}