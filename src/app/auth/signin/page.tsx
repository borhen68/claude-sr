"use client";
import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#2C2825] items-center justify-center p-12">
        <div className="text-center">
          <h1 className="text-5xl font-serif font-light text-[#F5F0EB] mb-4">Frametale</h1>
          <p className="text-[#8A8279] text-lg">Your memories, beautifully told</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <Link href="/" className="text-2xl font-serif text-[#2C2825] lg:hidden block mb-8">Frametale</Link>
            <h2 className="text-3xl font-serif font-light mb-2">Welcome back</h2>
            <p className="text-[#8A8279]">Sign in to continue creating</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[#8A8279]">
                <input type="checkbox" className="rounded" /> Remember me
              </label>
              <a href="#" className="text-[#2C2825] hover:underline">Forgot password?</a>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-8 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E8E3DE]" /></div>
              <div className="relative flex justify-center"><span className="bg-[#F5F0EB] px-4 text-sm text-[#8A8279]">or continue with</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="md">Google</Button>
              <Button variant="outline" size="md">Apple</Button>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-[#8A8279]">
            Don&apos;t have an account? <Link href="/auth/signup" className="text-[#2C2825] hover:underline font-medium">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
