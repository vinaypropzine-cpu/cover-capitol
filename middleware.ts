import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { auth as nextAuth } from "./auth"; // Your original NextAuth import

// 1. Define routes Clerk should ignore entirely
const isPublicRoute = createRouteMatcher([
  '/',
  '/product/(.*)',
  '/login',          
  '/api/uploadthing',
  '/api/razorpay',
  '/admin(.*)' // Clerk will not process these, leaving them "open" for NextAuth
]);

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  // 2. ADMIN PROTECTION (NextAuth Logic)
  if (pathname.startsWith("/admin")) {
    const session = await nextAuth();
    if (!session) {
      // We use a fresh URL object to prevent the 'immutable' header error
      const url = new URL("/login", request.url);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 3. CUSTOMER PROTECTION (Clerk Logic)
  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Standard Next.js/Clerk matcher to skip static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};