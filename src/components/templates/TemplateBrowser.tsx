"use client";
import { useState } from 'react';
import { templates, TemplateCategory, Template } from '@/data/templates';
import { Check, Sparkles } from 'lucide-react';

interface TemplateBrowserProps {
  onSelectTemplate: (template: Template) => void;
  selectedTemplateId?: string;
}

const categories: { id: TemplateCategory; label: string }[] = [
  { id: 'wedding', label: 'Wedding' },
  { id: 'baby', label: 'Baby' },
  { id: 'travel', label: 'Travel' },
  { id: 'family', label: 'Family' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'bold', label: 'Bold' },
  { id: 'vintage', label: 'Vintage' },
];

export default function TemplateBrowser({ onSelectTemplate, selectedTemplateId }: TemplateBrowserProps) {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-serif font-light mb-2">Choose a Template</h2>
        <p className="text-sm text-gray-600">
          Start with a professionally designed template, then customize
        </p>
      </div>

      {/* Category Filter */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-[#28BAAB] to-[#0376AD] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Templates
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#28BAAB] to-[#0376AD] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map(template => (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className={`group relative rounded-xl overflow-hidden transition-all ${
                selectedTemplateId === template.id
                  ? 'ring-4 ring-[#28BAAB] shadow-xl scale-105'
                  : 'hover:shadow-lg hover:scale-102'
              }`}
            >
              {/* Thumbnail */}
              <div 
                className="aspect-[3/4] bg-gradient-to-br flex items-center justify-center text-white text-sm font-medium"
                style={{
                  background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})`,
                }}
              >
                <div className="text-center p-4">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <div className="text-xs opacity-75">{template.name}</div>
                </div>
              </div>

              {/* Info */}
              <div className="p-3 bg-white border-t border-gray-100">
                <h3 className="font-medium text-sm mb-1 truncate">{template.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{template.description}</p>
              </div>

              {/* Selected Badge */}
              {selectedTemplateId === template.id && (
                <div className="absolute top-2 right-2 w-8 h-8 bg-[#28BAAB] rounded-full flex items-center justify-center shadow-lg">
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}

              {/* Category Badge */}
              <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-xs text-white font-medium capitalize">
                {template.category}
              </div>
            </button>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No templates in this category yet</p>
            <p className="text-sm mt-1">More templates coming soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
