import { NextResponse } from "next/server";
import { auth as nextAuth } from "./auth"; // Your existing NextAuth import

export default async function middleware(request: any) {
  const { pathname } = request.nextUrl;

  // 1. ADMIN PROTECTION (NextAuth Logic)
  // This ensures that the /admin routes remain secure even after removing Clerk
  if (pathname.startsWith("/admin")) {
    const session = await nextAuth();
    if (!session) {
      // Redirect to login if no valid session is found
      const url = new URL("/login", request.url);
      return NextResponse.redirect(url);
    }
  }

  // 2. PUBLIC & CUSTOMER ROUTES
  // With Firebase OTP, we handle customer protection within the components 
  // (e.g., checking 'user' status in the Checkout or Profile pages)
  return NextResponse.next();
}

// 3. MATCHING CONFIGURATION
export const config = {
  matcher: [
    // Standard Next.js matcher to skip static files and internal folders
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};