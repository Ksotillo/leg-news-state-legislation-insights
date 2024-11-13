import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createOrGetUser, updateUserPreferences } from '@/lib/user-service';

export async function GET() {
	try {
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const user = await createOrGetUser(userId);
		return NextResponse.json(user);
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to get user' + error },
			{ status: 500 }
		);
	}
}

export async function PATCH(request: Request) {
	try {
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const body = await request.json();
		const updatedUser = await updateUserPreferences(userId, body);
		
		return NextResponse.json(updatedUser);
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to update preferences' + error },
			{ status: 500 }
		);
	}
}