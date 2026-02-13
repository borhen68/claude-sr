"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import Link from "next/link";

const mockProjects = [
  { id: "1", title: "Summer in Tuscany", status: "draft", photoCount: 47, pageCount: 24, createdAt: "2026-01-15", theme: "quiet-luxe" },
  { id: "2", title: "Baby Liam — Year One", status: "completed", photoCount: 120, pageCount: 40, createdAt: "2025-12-20", theme: "quiet-luxe" },
  { id: "3", title: "Our Wedding Day", status: "printing", photoCount: 230, pageCount: 60, createdAt: "2025-11-08", theme: "quiet-luxe" },
];

const statusColors: Record<string, string> = {
  draft: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  printing: "bg-blue-100 text-blue-700",
};

export default function Dashboard() {
  const [projects] = useState(mockProjects);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-serif font-light">Your Books</h1>
              <p className="text-[#8A8279] mt-1">Manage and create your photo books</p>
            </div>
            <Link href="/projects/new">
              <Button>+ New Book</Button>
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">📖</div>
              <h2 className="text-2xl font-serif font-light mb-3">No books yet</h2>
              <p className="text-[#8A8279] mb-8">Create your first AI-designed photo book</p>
              <Link href="/projects/new"><Button>Create Your First Book</Button></Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Link href={`/editor/${project.id}`}>
                    <div className="bg-white rounded-2xl border border-[#E8E3DE] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                      <div className="aspect-[4/3] bg-gradient-to-br from-[#E8E3DE] to-[#D4CEC7] flex items-center justify-center">
                        <span className="text-4xl opacity-40">📸</span>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-[#2C2825]">{project.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${statusColors[project.status]}`}>
                            {project.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-[#8A8279]">
                          <span>{project.photoCount} photos</span>
                          <span>{project.pageCount} pages</span>
                          <span>{project.createdAt}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Order History */}
          <div className="mt-16">
            <h2 className="text-2xl font-serif font-light mb-6">Order History</h2>
            <div className="bg-white rounded-2xl border border-[#E8E3DE] overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#F5F0EB]">
                  <tr className="text-left text-xs text-[#8A8279] uppercase tracking-wider">
                    <th className="px-6 py-3">Book</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E3DE]">
                  <tr>
                    <td className="px-6 py-4 text-sm">Our Wedding Day</td>
                    <td className="px-6 py-4 text-sm text-[#8A8279]">Nov 10, 2025</td>
                    <td className="px-6 py-4"><span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Delivered</span></td>
                    <td className="px-6 py-4 text-sm">$89.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
