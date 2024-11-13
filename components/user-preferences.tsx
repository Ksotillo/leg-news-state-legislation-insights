'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { states } from '@/lib/constants';
import { categoryKeywords } from '@/lib/category-inference';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SelectWithSearch } from '@/components/ui/select-with-search';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/useUser';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UserPreferences() {
	const { isSignedIn } = useAuth();
	const { toast } = useToast();
	const router = useRouter();
	const { user, loading, updatePreferences } = useUser();
	const [saving, setSaving] = useState(false);
	const [selectedState, setSelectedState] = useState<string>(Object.keys(user?.favorite_states || {})[0] || '');
	const [selectedCategory, setSelectedCategory] = useState<string>(Object.keys(user?.favorite_categories || {})[0] || '');

    useEffect(() => {
        if (user) {
            setSelectedState(Object.keys(user.favorite_states || {})[0] || '');
            setSelectedCategory(Object.keys(user.favorite_categories || {})[0] || '');
        }
    }, [user])

	const handleSave = async () => {
		try {
			setSaving(true);
			await updatePreferences({
				favorite_states: selectedState ? { [selectedState]: true } : {},
				favorite_categories: selectedCategory ? { [selectedCategory]: true } : {},
			});

			toast({
				title: "Success",
				description: "Your preferences have been saved",
			});

			// Redirect using Next.js router
            setTimeout(() => {
                router.push('/');
            }, 600);
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Failed to save preferences" + error,
			});
		} finally {
			setSaving(false);
		}
	};

	if (!isSignedIn) {
		return (
			<Card className="p-6">
				<p>Please sign in to manage your preferences.</p>
			</Card>
		);
	}

	if (loading) {
		return (
			<Card className="p-6">
				<p>Loading preferences...</p>
			</Card>
		);
	}

	const categoryOptions = Object.keys(categoryKeywords).map(category => ({
		label: category.charAt(0).toUpperCase() + category.slice(1),
		value: category
	}));

	return (
		<Card className="p-6">
			<div className="space-y-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div className="space-y-1">
						<h2 className="text-lg font-medium">Favorite State</h2>
						<p className="text-sm text-gray-500">
							Select your preferred state for news filtering
						</p>
					</div>
					<SelectWithSearch
						options={states}
						value={selectedState}
						onValueChange={setSelectedState}
						placeholder="Select a state"
						className="w-full sm:w-[180px] bg-gray-100 rounded-xl"
					/>
				</div>

				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div className="space-y-1">
						<h2 className="text-lg font-medium">Favorite Category</h2>
						<p className="text-sm text-gray-500">
							Select your preferred news category
						</p>
					</div>
					<SelectWithSearch
						options={categoryOptions}
						value={selectedCategory}
						onValueChange={setSelectedCategory}
						placeholder="Select a category"
						className="w-full sm:w-[180px] bg-gray-100 rounded-xl"
					/>
				</div>

				<div className='flex justify-center'>
					<Button 
						onClick={handleSave} 
						disabled={saving}
						className="px-3 py-2 sm:px-4 sm:py-2 min-w-24 bg-fireOpal text-white rounded-xl inline-block hover:bg-red-600 transition-colors text-sm flex items-center justify-center gap-2 sm:text-base"
					>
						{saving ? <Loader2 className="animate-spin" /> : 'Save Preferences'}
					</Button>
				</div>
			</div>
		</Card>
	);
}