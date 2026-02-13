export interface PhotoAnalysis {
  themes: string[];
  dominantColors: string[];
  emotion: string;
  eventType: string;
  timeRange: string;
}

export interface PageLayout {
  id: string;
  type: "hero" | "duo" | "grid" | "collage" | "quote" | "divider";
  photos: string[];
  text?: string;
  order: number;
}

export interface DesignTheme {
  name: string;
  primaryColor: string;
  accentColor: string;
  neutralColor: string;
  textColor: string;
  fontHeadline: string;
  fontBody: string;
}

export interface ProjectData {
  id: string;
  title: string;
  status: string;
  theme: string;
  photoCount: number;
  pageCount: number;
  createdAt: string;
  coverImage?: string;
}
