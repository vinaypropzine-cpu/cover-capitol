// app/login/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // We set redirect: false to stop the 404/api/auth/error loop
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false, 
    });

    if (result?.error) {
      alert("Invalid Credentials, Vinay! Try again.");
    } else {
      // Manual push is much more reliable in Next.js 14
      router.push("/admin");
      router.refresh(); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-2xl font-bold mb-6">Cover Capital Admin</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <input 
          type="text" 
          placeholder="Username" 
          className="p-2 bg-zinc-900 border border-zinc-700 rounded outline-none focus:border-white"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="p-2 bg-zinc-900 border border-zinc-700 rounded outline-none focus:border-white"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-white text-black p-2 rounded font-bold hover:bg-zinc-200">
          Sign In
        </button>
      </form>
    </div>
  );
}