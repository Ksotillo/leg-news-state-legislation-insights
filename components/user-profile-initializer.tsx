"use client";

import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function UserProfileInitializer() {
	const { isSignedIn, userId } = useAuth();
	const router = useRouter();

	useEffect(() => {
		async function initializeUserProfile() {
			if (!isSignedIn || !userId) return;

			try {
				const response = await fetch('/api/user', {
					method: 'GET'
				});

				if (!response.ok) {
					throw new Error('Failed to initialize user profile');
				}

				// Refresh the page to ensure all user data is loaded
				router.refresh();
			} catch (error) {
				console.error('Error initializing user profile:', error);
			}
		}

		initializeUserProfile();
	}, [isSignedIn, userId]);

	// This component doesn't render anything
	return null;
}