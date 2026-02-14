import { create } from 'zustand';

export interface Page {
  id: string;
  number: number;
  width: number;
  height: number;
  elements: any[];
  background: string;
}

export interface Project {
  id: string;
  name: string;
  size: '8x8' | '8x10' | '10x10' | '11x8.5' | '12x12';
  coverType: 'hardcover' | 'softcover' | 'layflat';
  paperType: 'matte' | 'glossy' | 'silk';
  pages: Page[];
  coverDesign?: any;
}

interface EditorState {
  project: Project | null;
  currentPageId: string | null;
  selectedTool: 'select' | 'text' | 'photo' | 'shape';
  zoom: number;
  history: any[];
  historyIndex: number;
  
  // Actions
  setProject: (project: Project) => void;
  setCurrentPage: (pageId: string) => void;
  setTool: (tool: EditorState['selectedTool']) => void;
  setZoom: (zoom: number) => void;
  addPage: () => void;
  deletePage: (pageId: string) => void;
  duplicatePage: (pageId: string) => void;
  reorderPages: (from: number, to: number) => void;
  undo: () => void;
  redo: () => void;
  updatePage: (pageId: string, updates: Partial<Page>) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  project: null,
  currentPageId: null,
  selectedTool: 'select',
  zoom: 1,
  history: [],
  historyIndex: -1,

  setProject: (project) => set({ project, currentPageId: project.pages[0]?.id }),
  
  setCurrentPage: (pageId) => set({ currentPageId: pageId }),
  
  setTool: (tool) => set({ selectedTool: tool }),
  
  setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(3, zoom)) }),
  
  addPage: () => set((state) => {
    if (!state.project) return state;
    const newPage: Page = {
      id: `page-${Date.now()}`,
      number: state.project.pages.length + 1,
      width: 800,
      height: 800,
      elements: [],
      background: '#ffffff',
    };
    return {
      project: {
        ...state.project,
        pages: [...state.project.pages, newPage],
      },
    };
  }),
  
  deletePage: (pageId) => set((state) => {
    if (!state.project || state.project.pages.length <= 1) return state;
    return {
      project: {
        ...state.project,
        pages: state.project.pages.filter(p => p.id !== pageId),
      },
    };
  }),
  
  duplicatePage: (pageId) => set((state) => {
    if (!state.project) return state;
    const page = state.project.pages.find(p => p.id === pageId);
    if (!page) return state;
    
    const newPage: Page = {
      ...page,
      id: `page-${Date.now()}`,
      number: state.project.pages.length + 1,
    };
    
    return {
      project: {
        ...state.project,
        pages: [...state.project.pages, newPage],
      },
    };
  }),
  
  reorderPages: (from, to) => set((state) => {
    if (!state.project) return state;
    const pages = [...state.project.pages];
    const [moved] = pages.splice(from, 1);
    pages.splice(to, 0, moved);
    
    return {
      project: {
        ...state.project,
        pages: pages.map((p, i) => ({ ...p, number: i + 1 })),
      },
    };
  }),
  
  updatePage: (pageId, updates) => set((state) => {
    if (!state.project) return state;
    return {
      project: {
        ...state.project,
        pages: state.project.pages.map(p => 
          p.id === pageId ? { ...p, ...updates } : p
        ),
      },
    };
  }),
  
  undo: () => {
    // TODO: Implement undo
  },
  
  redo: () => {
    // TODO: Implement redo
  },
}));
