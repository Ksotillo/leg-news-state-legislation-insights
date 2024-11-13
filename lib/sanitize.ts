/**
 * Utility functions for sanitizing user input to prevent injection attacks
 */

// Allowed characters for search queries and filters
const SAFE_SEARCH_PATTERN = /^[a-zA-Z0-9\s,.'()-]+$/;
// Allowed characters for state names
const SAFE_STATE_PATTERN = /^[a-z\s-]+$/;
// Allowed characters for topics
const SAFE_TOPIC_PATTERN = /^[a-zA-Z]+$/;

export class InputSanitizer {
	/**
	 * Sanitizes a search query string
	 * @param query - The search query to sanitize
	 * @returns Sanitized query string or null if invalid
	 */
	static sanitizeSearchQuery(query: string | null | undefined): string | null {
		if (!query) return null;
		
		// Trim whitespace and convert to lowercase
		const sanitized = query.trim().toLowerCase();
		
		// Check if query contains only allowed characters
		if (!SAFE_SEARCH_PATTERN.test(sanitized)) {
			return null;
		}
		
		// Escape special characters used in search
		return sanitized
			.replace(/[+\-&|!(){}[\]^"~*?:\\]/g, ' ')
			.replace(/\s+/g, ' ');
	}

	/**
	 * Sanitizes a state code
	 * @param state - The state code to sanitize
	 * @returns Sanitized state code or null if invalid
	 */
	static sanitizeState(state: string | null | undefined): string | null {
		if (!state) return null;
		
		const sanitized = state.trim().toLowerCase();
		
		if (!SAFE_STATE_PATTERN.test(sanitized)) {
			return null;
		}
		
		return sanitized;
	}

	/**
	 * Sanitizes a topic string
	 * @param topic - The topic to sanitize
	 * @returns Sanitized topic or null if invalid
	 */
	static sanitizeTopic(topic: string | null | undefined): string | null {
		if (!topic) return null;
		
		const sanitized = topic.trim().toLowerCase();
		
		if (!SAFE_TOPIC_PATTERN.test(sanitized)) {
			return null;
		}
		
		return sanitized;
	}

	/**
	 * Sanitizes page number
	 * @param page - The page number to sanitize
	 * @returns Sanitized page number or 1 if invalid
	 */
	static sanitizePage(page: string | null | undefined): number {
		if (!page) return 1;
		
		const pageNum = parseInt(page, 10);
		if (isNaN(pageNum) || pageNum < 1) {
			return 1;
		}
		
		return pageNum;
	}

	/**
	 * Sanitizes text input
	 * @param text - The text to sanitize
	 * @returns Sanitized text or null if invalid
	 */
	static sanitizeText(text: string | null | undefined): string | null {
		if (!text) return null;
		return text.trim();
	}
}