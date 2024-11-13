import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createArticle } from '@/lib/article-service';

export async function POST(request: Request) {
	try {
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const formData = await request.formData();

		const article = await createArticle({
			title: formData.get('title') as string,
			description: formData.get('description') as string,
			category: formData.get('category') as string,
			state: formData.get('state') as string,
			content: formData.get('content') as string,
			authorId: parseInt(formData.get('authorId') as string) || 0,
			imageFile: formData.get('image') as File || undefined
		});

		return NextResponse.json(article, { status: 201 });
	} catch (error) {
		console.error('Error in POST /api/articles:', error);
		return NextResponse.json(
			{ error: 'Failed to create article: ' + error },
			{ status: 500 }
		);
	}
}