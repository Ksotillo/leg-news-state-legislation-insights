import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';

interface User {
	id: string;
	email: string;
	name: string;
	favorite_states: string[];
	favorite_categories: string[];
}

export function useUser() {
	const { isSignedIn, userId } = useAuth();
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchUser() {
			if (!isSignedIn || !userId) {
				setUser(null);
				setLoading(false);
				return;
			}

			try {
				const response = await fetch('/api/user');
				if (!response.ok) {
					throw new Error('Failed to fetch user');
				}
				const userData = await response.json();
				setUser(userData);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'An error occurred');
			} finally {
				setLoading(false);
			}
		}

		fetchUser();
	}, [isSignedIn, userId]);

	const updatePreferences = async (preferences: {
		favorite_states?: { [key: string]: boolean };
		favorite_categories?: { [key: string]: boolean };
	}) => {
		try {
			const response = await fetch('/api/user', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(preferences),
			});

			if (!response.ok) {
				throw new Error('Failed to update preferences');
			}

			const updatedUser = await response.json();
			setUser(updatedUser);
			return updatedUser;
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
			throw err;
		}
	};

	return {
		user,
		loading,
		error,
		updatePreferences,
	};
}