import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/articles/new", '/settings']);

export default clerkMiddleware(async (auth, req) => {
	const { userId, redirectToSignIn } = await auth();

	if (!userId && isProtectedRoute(req)) {
		return redirectToSignIn({ returnBackUrl: "/" });
	}

	if (userId && isProtectedRoute(req)) {
		return NextResponse.next();
	}
});

export const config = {
	matcher: [
		'/((?!_next/static|_next/image|favicon.ico).*)',
		'/',
		'/(api|trpc)(.*)'
	],
};
