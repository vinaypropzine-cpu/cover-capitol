// middleware.ts
import { auth } from "./auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnAdmin = req.nextUrl.pathname.startsWith("/admin");

  if (isOnAdmin && !isLoggedIn) {
    // Force the user back to login if they try to sneak into /admin
    return Response.redirect(new URL("/login", req.nextUrl.origin));
  }
});

export const config = {
  // Matches all routes inside the admin folder
  matcher: ["/admin/:path*"],
};