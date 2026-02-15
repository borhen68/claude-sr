import { getServerSession } from "next-auth/next";
import { authOptions } from "./config";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/auth/signin");
  }
  
  return session.user;
}

export async function requireRole(role: string | string[]) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/auth/signin");
  }
  
  const roles = Array.isArray(role) ? role : [role];
  
  if (!roles.includes(session.user.role)) {
    redirect("/dashboard");
  }
  
  return session.user;
}
