"use client";
import { useState } from 'react';
import { Keyboard, X } from 'lucide-react';

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { keys: ['V'], action: 'Select tool' },
    { keys: ['T'], action: 'Add text' },
    { keys: ['P'], action: 'Photo tool' },
    { keys: ['R'], action: 'Rectangle tool' },
    { keys: ['Delete'], action: 'Delete selected' },
    { keys: ['Ctrl', 'Z'], action: 'Undo' },
    { keys: ['Ctrl', 'Y'], action: 'Redo' },
    { keys: ['Ctrl', 'S'], action: 'Save' },
    { keys: ['Ctrl', '+'], action: 'Zoom in' },
    { keys: ['Ctrl', '-'], action: 'Zoom out' },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow border border-gray-200 z-50"
        title="Keyboard Shortcuts (Ctrl+/)"
      >
        <Keyboard className="w-5 h-5 text-gray-700" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setIsOpen(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Keyboard className="w-5 h-5" />
                Keyboard Shortcuts
              </h3>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {shortcuts.map((shortcut, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{shortcut.action}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, j) => (
                        <span key={j}>
                          <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">
                            {key}
                          </kbd>
                          {j < shortcut.keys.length - 1 && <span className="mx-1 text-gray-400">+</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
