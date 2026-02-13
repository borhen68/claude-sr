"use client";
import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function SignUp() {
  const [name, setName] = useState("");
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
          <p className="text-[#8A8279] text-lg">Create your first photo book in minutes</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <Link href="/" className="text-2xl font-serif text-[#2C2825] lg:hidden block mb-8">Frametale</Link>
            <h2 className="text-3xl font-serif font-light mb-2">Create your account</h2>
            <p className="text-[#8A8279]">Start designing beautiful photo books</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Full Name" placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <p className="text-xs text-[#8A8279]">By signing up, you agree to our Terms and Privacy Policy.</p>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          <p className="mt-8 text-center text-sm text-[#8A8279]">
            Already have an account? <Link href="/auth/signin" className="text-[#2C2825] hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
