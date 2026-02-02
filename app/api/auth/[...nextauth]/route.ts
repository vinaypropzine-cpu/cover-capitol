// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth"; // Using the '@' alias is safe now
export const { GET, POST } = handlers;