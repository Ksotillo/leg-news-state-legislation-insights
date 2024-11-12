export async function fetchWithCache<T>(
	url: string,
	options: RequestInit = {}
): Promise<T> {
	const response = await fetch(url, {
		...options,
		next: {
			revalidate: 300, // 5 minutes cache
		},
	});

	if (!response.ok) {
		throw new Error('Network response was not ok');
	}

	return response.json();
}