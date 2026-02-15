#!/bin/bash

echo "🚀 Initializing Frametale Database..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your database credentials and secrets!"
    exit 1
fi

# Check if DATABASE_URL is set
if ! grep -q "DATABASE_URL=" .env; then
    echo "❌ DATABASE_URL not set in .env"
    exit 1
fi

# Check if NEXTAUTH_SECRET is set
if grep -q "your-secret-key-here" .env; then
    echo "⚠️  Generating NEXTAUTH_SECRET..."
    SECRET=$(openssl rand -base64 32)
    sed -i "s/your-secret-key-here-change-in-production/$SECRET/" .env
    echo "✅ NEXTAUTH_SECRET generated"
fi

echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo "🔄 Generating Prisma Client..."
npx prisma generate

echo "🗄️  Pushing schema to database..."
npx prisma db push

echo "✅ Database initialized successfully!"
echo ""
echo "Next steps:"
echo "1. Update OAuth credentials in .env (optional)"
echo "2. Run 'npm run dev' to start development server"
echo "3. Visit http://localhost:3000"
