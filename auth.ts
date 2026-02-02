// auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Check if the entered details match your .env.local variables
        const isAdmin = 
          credentials.username === process.env.ADMIN_USERNAME &&
          credentials.password === process.env.ADMIN_PASSWORD;

        if (isAdmin) {
          return { id: "1", name: "Vinay", email: "admin@covercapital.com" };
        }
        return null; // Login failed
      },
    }),
  ],
  pages: {
    signIn: "/login", // We will create this page next
  },
});