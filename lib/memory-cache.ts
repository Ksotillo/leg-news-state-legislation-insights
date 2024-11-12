interface CacheItem<T> {
	data: T;
	timestamp: number;
}

class MemoryCache<T> {
	private cache: Map<string, CacheItem<T>> = new Map();
	private defaultTTL: number = 5 * 60 * 1000; // 5 minutes

	set(key: string, data: T, ttl: number = this.defaultTTL) {
		this.cache.set(key, {
			data,
			timestamp: Date.now() + ttl,
		});
	}

	get<T>(key: string): T | null {
		const item = this.cache.get(key);
		
		if (!item) return null;
		
		if (Date.now() > item.timestamp) {
			this.cache.delete(key);
			return null;
		}
		
		return item.data as T | null;
	}

	delete(key: string) {
		this.cache.delete(key);
	}

	clear() {
		this.cache.clear();
	}
}

export const memoryCache = new MemoryCache();