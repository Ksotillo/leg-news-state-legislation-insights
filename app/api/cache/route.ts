import { memoryCache } from '@/lib/memory-cache';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function DELETE() {
	try {
		// Clear memory cache
		memoryCache.clear();

		// Revalidate all news pages
		revalidatePath('/articles');

		return NextResponse.json({
			success: true,
			message: 'Cache cleared successfully',
		});
	} catch (error) {
		return NextResponse.json({ success: false, error: "Failed to clear cache" + error }, { status: 500 });
	}
}