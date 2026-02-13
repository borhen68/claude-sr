"use client";
import Link from "next/link";
import { useState } from "react";
import Button from "../ui/Button";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E8E3DE]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-serif font-light tracking-wide text-[#2C2825]">
          Frametale
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/products" className="text-[#8A8279] hover:text-[#2C2825] transition-colors text-sm tracking-wide">
            Products
          </Link>
          <Link href="/pricing" className="text-[#8A8279] hover:text-[#2C2825] transition-colors text-sm tracking-wide">
            Pricing
          </Link>
          <Link href="/dashboard" className="text-[#8A8279] hover:text-[#2C2825] transition-colors text-sm tracking-wide">
            Dashboard
          </Link>
          <Link href="/auth/signin">
            <Button size="sm">Sign In</Button>
          </Link>
        </div>
        <button className="md:hidden text-[#2C2825]" onClick={() => setMobileOpen(!mobileOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-[#E8E3DE] bg-white px-6 py-4 space-y-3">
          <Link href="/products" className="block text-[#8A8279]">Products</Link>
          <Link href="/pricing" className="block text-[#8A8279]">Pricing</Link>
          <Link href="/dashboard" className="block text-[#8A8279]">Dashboard</Link>
          <Link href="/auth/signin"><Button size="sm" className="w-full">Sign In</Button></Link>
        </div>
      )}
    </nav>
  );
}
