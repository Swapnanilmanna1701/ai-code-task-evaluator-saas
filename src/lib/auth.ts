import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer } from "better-auth/plugins";
import { NextRequest } from 'next/server';
import { db } from "@/db";
 
export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "sqlite",
	}),
	emailAndPassword: {    
		enabled: true
	},
	plugins: [bearer()]
});

// Session validation helper - properly reads Authorization header from request
export async function getCurrentUser(request: NextRequest) {
  // Create headers object from the request
  const requestHeaders = new Headers();
  
  // Copy Authorization header if present
  const authHeader = request.headers.get('Authorization');
  if (authHeader) {
    requestHeaders.set('Authorization', authHeader);
  }
  
  // Copy cookies if present
  const cookieHeader = request.headers.get('Cookie');
  if (cookieHeader) {
    requestHeaders.set('Cookie', cookieHeader);
  }
  
  const session = await auth.api.getSession({ headers: requestHeaders });
  return session?.user || null;
}