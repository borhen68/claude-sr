import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const photoCount = body.photoCount || 24;

  const pageTypes = ["hero", "duo", "grid", "collage", "quote", "divider"];
  const pages = [];
  let photoIndex = 0;

  // Cover
  pages.push({ type: "hero", photos: [photoIndex++], text: null, order: 0 });

  // Generate rhythm: Hero → Grid → Duo → Quote → repeat
  const rhythm = ["grid", "duo", "quote", "hero", "grid", "collage", "divider"];
  let rhythmIndex = 0;

  while (photoIndex < photoCount) {
    const type = rhythm[rhythmIndex % rhythm.length];
    const photosPerPage = type === "hero" ? 1 : type === "duo" ? 2 : type === "grid" ? 4 : type === "collage" ? 6 : 0;
    const pagePhotos = [];
    for (let i = 0; i < Math.min(photosPerPage, photoCount - photoIndex); i++) {
      pagePhotos.push(photoIndex++);
    }
    pages.push({
      type,
      photos: pagePhotos,
      text: type === "quote" ? "Every moment tells a story worth preserving." : null,
      order: pages.length,
    });
    rhythmIndex++;
  }

  // End with divider
  pages.push({ type: "divider", photos: [], text: "The End", order: pages.length });

  await new Promise((r) => setTimeout(r, 1000));
  return NextResponse.json({ pages, totalPages: pages.length, theme: "quiet-luxe" });
}
