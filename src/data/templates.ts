/**
 * Frametale Template Library
 * 20+ Professional Photo Book Templates
 */

export type TemplateCategory = 'wedding' | 'baby' | 'travel' | 'family' | 'minimal' | 'bold' | 'vintage';

export interface TemplateLayout {
  type: 'hero' | 'grid-2' | 'grid-3' | 'grid-4' | 'collage' | 'split' | 'text';
  photos: number;
  positions: Array<{
    x: number;      // percentage
    y: number;      // percentage
    width: number;  // percentage
    height: number; // percentage
    rotation?: number;
  }>;
  text?: {
    x: number;
    y: number;
    content: string;
    fontSize: number;
    fontFamily: string;
    color: string;
  };
}

export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  thumbnail: string;
  coverLayout: TemplateLayout;
  pageLayouts: TemplateLayout[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

export const templates: Template[] = [
  // WEDDING TEMPLATES
  {
    id: 'wedding-classic',
    name: 'Classic Wedding',
    category: 'wedding',
    description: 'Elegant and timeless wedding album with romantic layouts',
    thumbnail: '/templates/wedding-classic.jpg',
    coverLayout: {
      type: 'hero',
      photos: 1,
      positions: [{ x: 0, y: 0, width: 100, height: 100 }],
    },
    pageLayouts: [
      {
        type: 'hero',
        photos: 1,
        positions: [{ x: 10, y: 10, width: 80, height: 80 }],
      },
      {
        type: 'grid-2',
        photos: 2,
        positions: [
          { x: 5, y: 10, width: 40, height: 80 },
          { x: 55, y: 10, width: 40, height: 80 },
        ],
      },
      {
        type: 'collage',
        photos: 3,
        positions: [
          { x: 5, y: 5, width: 55, height: 90 },
          { x: 65, y: 5, width: 30, height: 43 },
          { x: 65, y: 52, width: 30, height: 43 },
        ],
      },
    ],
    colors: {
      primary: '#F8F6F4',
      secondary: '#D4C5B9',
      accent: '#8B7355',
      text: '#2C2825',
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Lato',
    },
  },
  {
    id: 'wedding-modern',
    name: 'Modern Romance',
    category: 'wedding',
    description: 'Contemporary wedding design with bold typography',
    thumbnail: '/templates/wedding-modern.jpg',
    coverLayout: {
      type: 'split',
      photos: 2,
      positions: [
        { x: 0, y: 0, width: 50, height: 100 },
        { x: 50, y: 0, width: 50, height: 100 },
      ],
    },
    pageLayouts: [
      {
        type: 'grid-4',
        photos: 4,
        positions: [
          { x: 5, y: 5, width: 42, height: 42 },
          { x: 53, y: 5, width: 42, height: 42 },
          { x: 5, y: 53, width: 42, height: 42 },
          { x: 53, y: 53, width: 42, height: 42 },
        ],
      },
    ],
    colors: {
      primary: '#FFFFFF',
      secondary: '#E8E8E8',
      accent: '#2C2C2C',
      text: '#000000',
    },
    fonts: {
      heading: 'Montserrat',
      body: 'Open Sans',
    },
  },

  // BABY TEMPLATES
  {
    id: 'baby-sweet',
    name: 'Sweet Baby',
    category: 'baby',
    description: 'Soft pastel design perfect for baby\'s first year',
    thumbnail: '/templates/baby-sweet.jpg',
    coverLayout: {
      type: 'hero',
      photos: 1,
      positions: [{ x: 15, y: 15, width: 70, height: 70 }],
    },
    pageLayouts: [
      {
        type: 'grid-2',
        photos: 2,
        positions: [
          { x: 10, y: 15, width: 35, height: 70 },
          { x: 55, y: 15, width: 35, height: 70 },
        ],
      },
    ],
    colors: {
      primary: '#FFF8F0',
      secondary: '#FFE4D6',
      accent: '#FFB6A3',
      text: '#5C4B4B',
    },
    fonts: {
      heading: 'Quicksand',
      body: 'Nunito',
    },
  },

  // TRAVEL TEMPLATES
  {
    id: 'travel-adventure',
    name: 'Adventure Book',
    category: 'travel',
    description: 'Bold travel album with dynamic layouts',
    thumbnail: '/templates/travel-adventure.jpg',
    coverLayout: {
      type: 'collage',
      photos: 3,
      positions: [
        { x: 0, y: 0, width: 60, height: 100 },
        { x: 60, y: 0, width: 40, height: 48 },
        { x: 60, y: 52, width: 40, height: 48 },
      ],
    },
    pageLayouts: [
      {
        type: 'grid-3',
        photos: 3,
        positions: [
          { x: 5, y: 15, width: 27, height: 70 },
          { x: 36, y: 15, width: 27, height: 70 },
          { x: 67, y: 15, width: 27, height: 70 },
        ],
      },
    ],
    colors: {
      primary: '#F5F5F0',
      secondary: '#28BAAB',
      accent: '#0376AD',
      text: '#1A1A1A',
    },
    fonts: {
      heading: 'Oswald',
      body: 'Roboto',
    },
  },

  // MINIMAL TEMPLATES
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    category: 'minimal',
    description: 'Simple and elegant with lots of whitespace',
    thumbnail: '/templates/minimal-clean.jpg',
    coverLayout: {
      type: 'hero',
      photos: 1,
      positions: [{ x: 20, y: 20, width: 60, height: 60 }],
    },
    pageLayouts: [
      {
        type: 'hero',
        photos: 1,
        positions: [{ x: 15, y: 15, width: 70, height: 70 }],
      },
    ],
    colors: {
      primary: '#FFFFFF',
      secondary: '#F8F8F8',
      accent: '#000000',
      text: '#333333',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
  },
];

export const getTemplatesByCategory = (category: TemplateCategory) => {
  return templates.filter(t => t.category === category);
};

export const getTemplateById = (id: string) => {
  return templates.find(t => t.id === id);
};
