"use client";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image 
            src="/logo.svg" 
            alt="Frametale" 
            width={160} 
            height={32}
            className="h-8 w-auto transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/products" className="text-gray-700 hover:text-gray-900 transition-colors">
            Products
          </Link>
          <Link href="/pricing" className="text-gray-700 hover:text-gray-900 transition-colors">
            Pricing
          </Link>
          <Link href="/templates" className="text-gray-700 hover:text-gray-900 transition-colors">
            Templates
          </Link>
          <Link href="/inspiration" className="text-gray-700 hover:text-gray-900 transition-colors">
            Inspiration
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/auth/signin" className="text-gray-700 hover:text-gray-900 transition-colors">
            Sign In
          </Link>
          <Link href="/projects/new">
            <Button size="md">
              Create Book
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
