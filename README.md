# Frametale — AI-Powered Photo Books

Transform your photos into beautiful, professionally designed photo books with AI.

## Tech Stack

- **Frontend:** Next.js 16 + TypeScript + Tailwind CSS
- **Database:** Prisma ORM + SQLite (swap to PostgreSQL for production)
- **Animations:** Framer Motion
- **Icons:** Lucide React

## Quick Start

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — hero, features, testimonials, CTA |
| `/auth/signin` | Sign in with email/password or OAuth |
| `/auth/signup` | Create account |
| `/dashboard` | Project list, order history |
| `/projects/new` | Multi-step: name → upload → AI analysis → template |
| `/editor/[id]` | Visual book editor with spread/single view |
| `/preview/[id]` | Print preview of all spreads |
| `/pricing` | Three-tier pricing (Softcover/Hardcover/Premium) |

## API Routes (Mocked)

- `POST /api/analyze-photos` — Returns AI photo analysis (themes, emotions, colors)
- `POST /api/generate-layout` — Returns auto-generated page layout
- `POST /api/checkout` — Returns mocked Stripe checkout session

## Design System — "Quiet Luxe"

- **Colors:** Parchment `#F5F0EB` / Text `#2C2825` / Muted `#8A8279`
- **Typography:** Playfair Display (headlines) + Inter (body)
- **Mood:** Intimate · Unhurried · Refined

## Production Deployment

1. Switch to PostgreSQL in `prisma/schema.prisma`
2. Set `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
3. Add real AI APIs (OpenAI Vision, Stability AI)
4. Add Stripe keys for payments
5. Deploy to Vercel

## License

MIT
