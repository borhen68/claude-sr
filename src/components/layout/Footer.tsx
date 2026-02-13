export default function Footer() {
  return (
    <footer className="bg-[#2C2825] text-[#8A8279] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-serif font-light text-[#F5F0EB] mb-4">Frametale</h3>
            <p className="text-sm leading-relaxed max-w-md">
              AI-powered photo books that tell your story. Upload your memories, and let our design
              intelligence craft a beautiful, print-ready book in minutes.
            </p>
          </div>
          <div>
            <h4 className="text-[#F5F0EB] text-sm font-medium mb-4 tracking-wide uppercase">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/pricing" className="hover:text-[#F5F0EB] transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-[#F5F0EB] transition-colors">Templates</a></li>
              <li><a href="#" className="hover:text-[#F5F0EB] transition-colors">Print Quality</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#F5F0EB] text-sm font-medium mb-4 tracking-wide uppercase">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-[#F5F0EB] transition-colors">About</a></li>
              <li><a href="#" className="hover:text-[#F5F0EB] transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-[#F5F0EB] transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-[#3d3632] text-xs text-center">
          © 2026 Frametale. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
