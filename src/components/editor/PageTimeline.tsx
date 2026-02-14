"use client";
import { Plus, Copy, Trash2 } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';

export default function PageTimeline() {
  const { project, currentPageId, setCurrentPage, addPage, deletePage, duplicatePage } = useEditorStore();

  if (!project) return null;

  return (
    <div className="h-32 bg-white border-t border-gray-200 overflow-x-auto">
      <div className="p-4 flex items-center gap-3 h-full">
        {project.pages.map((page) => (
          <div
            key={page.id}
            onClick={() => setCurrentPage(page.id)}
            className={`
              group relative flex-shrink-0 w-24 h-full rounded-lg border-2 transition-all cursor-pointer
              ${currentPageId === page.id 
                ? 'border-blue-500 shadow-lg' 
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <div className="w-full h-full bg-white rounded-lg overflow-hidden flex items-center justify-center text-xs text-gray-400">
              Page {page.number}
            </div>
            
            {/* Page actions */}
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); duplicatePage(page.id); }}
                className="w-6 h-6 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                title="Duplicate"
              >
                <Copy className="w-3 h-3" />
              </button>
              {project.pages.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); deletePage(page.id); }}
                  className="w-6 h-6 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-red-50 hover:border-red-300"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3 text-red-600" />
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Add page button */}
        <button
          onClick={addPage}
          className="flex-shrink-0 w-24 h-full rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-1 text-gray-500 hover:text-blue-600"
        >
          <Plus className="w-5 h-5" />
          <span className="text-xs">Add Page</span>
        </button>
      </div>
    </div>
  );
}
