'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { states } from '@/lib/constants';
import { categoryKeywords } from '@/lib/category-inference';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { InputSanitizer } from '@/lib/sanitize';

export default function ArticleForm() {
	const { toast } = useToast();
	const router = useRouter();
	const { user } = useUser();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		category: '',
		state: '',
		content: '',
	});
	const [image, setImage] = useState<File | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			// Sanitize form data
			const sanitizedData = {
				title: InputSanitizer.sanitizeText(formData.title),
				description: InputSanitizer.sanitizeText(formData.description),
				category: InputSanitizer.sanitizeTopic(formData.category),
				state: InputSanitizer.sanitizeState(formData.state),
				content: InputSanitizer.sanitizeText(formData.content),
			};

			// Validate sanitized data
			if (!sanitizedData.title || !sanitizedData.description || !sanitizedData.content) {
				throw new Error('Please fill in all required fields with valid content');
			}

			if (!sanitizedData.category || !sanitizedData.state) {
				throw new Error('Please select a valid category and state');
			}

			const submitData = new FormData();
			Object.entries(sanitizedData).forEach(([key, value]) => {
				if (value) {
					submitData.append(key, value);
				}
			});
			if (image) {
				submitData.append('image', image);
			}

			submitData.append('authorId', user?.id || '');

			const response = await fetch('/api/articles', {
				method: 'POST',
				body: submitData,
			});

			if (!response.ok) throw new Error('Failed to create article');

			toast({
				title: 'Success',
				description: 'Article created successfully',
			});

			router.push('/');
			router.refresh();
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'Error',
				description: error instanceof Error ? error.message : 'Failed to create article',
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="space-y-2">
				<label className="text-sm font-medium">Title</label>
				<Input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="bg-gray-100 rounded-xl" />
			</div>

			<div className="space-y-2">
				<label className="text-sm font-medium">Description</label>
				<Textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="bg-gray-100 rounded-xl" />
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<label className="text-sm font-medium">State</label>
					<Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
						<SelectTrigger className="bg-gray-100 rounded-xl">
							<SelectValue placeholder="Select state" />
						</SelectTrigger>
						<SelectContent className="bg-gray-100 rounded-xl">
							{states.map((state) => (
								<SelectItem key={state.value} value={state.value}>
									{state.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<label className="text-sm font-medium">Category</label>
					<Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
						<SelectTrigger className="bg-gray-100 rounded-xl">
							<SelectValue placeholder="Select category" />
						</SelectTrigger>
						<SelectContent className="bg-gray-100 rounded-xl">
							{Object.keys(categoryKeywords).map((category) => (
								<SelectItem key={category} value={category}>
									{category.charAt(0).toUpperCase() + category.slice(1)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="space-y-2">
				<label className="text-sm font-medium">Content</label>
				<Textarea required value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="h-32 bg-gray-100 rounded-xl" />
			</div>

            {/* Had too much trouble with the image upload, so I'm just going to leave this here for now */}

			{/* <div className="space-y-2">
				<label className="text-sm font-medium">Image</label>
				<Input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="bg-gray-100 rounded-xl" />
			</div> */}

			<div className='flex justify-center'>
				<Button
					type="submit"
					disabled={loading}
					className="px-3 py-2 sm:px-4 sm:py-2 min-w-24 bg-fireOpal text-white rounded-xl inline-block hover:bg-red-600 transition-colors text-sm flex items-center justify-center gap-2 sm:text-base"
				>
					{loading ? <Loader2 className="animate-spin" />: "Create Article"}
				</Button>
			</div>
		</form>
	);
}