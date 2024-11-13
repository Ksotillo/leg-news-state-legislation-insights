interface RateLimitInfo {
	count: number;
	resetTime: number;
}

export class RateLimiter {
	private store: Map<string, RateLimitInfo>;
	private readonly limit: number;
	private readonly windowMs: number;

	constructor(limit: number = 100, windowMs: number = 15 * 60 * 1000) { // 100 requests per 15 minutes
		this.store = new Map();
		this.limit = limit;
		this.windowMs = windowMs;
	}

	check(key: string): { success: boolean; remaining: number; resetTime: number } {
		this.cleanup();
		
		const now = Date.now();
		const info = this.store.get(key) || { count: 0, resetTime: now + this.windowMs };
		
		// Reset if window has expired
		if (now >= info.resetTime) {
			info.count = 0;
			info.resetTime = now + this.windowMs;
		}

		const remaining = this.limit - info.count;
		
		if (remaining <= 0) {
			return { 
				success: false, 
				remaining: 0, 
				resetTime: info.resetTime 
			};
		}

		// Increment counter
		info.count++;
		this.store.set(key, info);

		return { 
			success: true, 
			remaining: remaining - 1, 
			resetTime: info.resetTime 
		};
	}

	private cleanup() {
		const now = Date.now();
		for (const [key, info] of Array.from(this.store.entries())) {
			if (now >= info.resetTime) {
				this.store.delete(key);
			}
		}
	}
}

// Create a singleton instance
export const rateLimiter = new RateLimiter();