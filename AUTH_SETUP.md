# Frametale Authentication & Project Management Setup

This document describes the complete authentication and project management system for Frametale.

## Features Implemented

### 🔐 Authentication
- **NextAuth.js** integration with multiple providers:
  - Email/Password (credentials)
  - Google OAuth
  - Facebook OAuth
- Secure password hashing with bcrypt (12 rounds)
- JWT-based sessions (30-day expiration)
- Protected routes with middleware
- Email validation and password strength requirements (min 8 characters)

### 👤 User Management
- User registration and login
- Profile management (name, image, password change)
- Role-based access control (user, admin)
- User statistics (project count, order count)

### 📁 Project Management
- Create, read, update, delete projects
- Project metadata (title, description, theme, cover image)
- Project status tracking (draft, published, archived)
- Public/private projects
- Last saved timestamp tracking

### 🔄 Versioning & Autosave
- **Automatic versioning** on project creation
- **Manual version snapshots** with descriptions
- Version history with user attribution
- **Autosave hook** (configurable interval, default 30s)
- Full project state snapshots (pages, photos, metadata)

### 🤝 Collaboration
- Share projects with other users
- Role-based permissions:
  - **Viewer**: Read-only access
  - **Editor**: Can edit project
  - **Admin**: Full access (except ownership transfer)
- Invitation system (auto-accept for now)
- Remove collaborators (owner only)
- Update collaborator roles (owner only)

### 🛒 Order Management
- Create orders linked to projects
- Unique order numbers (FT-timestamp-random)
- Order status tracking:
  - pending
  - processing
  - shipped
  - delivered
  - cancelled
- Shipping address management
- Tracking number support
- Order history with filtering
- Admin-only status updates

## Database Schema

### Key Models
- **User**: Authentication and profile data
- **Account**: OAuth provider accounts
- **Session**: Active user sessions
- **Project**: User projects with metadata
- **ProjectVersion**: Version snapshots
- **ProjectCollaborator**: Shared access
- **Page**: Project pages
- **Photo**: Project photos
- **Order**: Purchase orders
- **Template**: Design templates

## API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `GET/POST /api/auth/[...nextauth]` - NextAuth handlers
- `GET /api/user/profile` - Get user profile
- `PATCH /api/user/profile` - Update profile

### Projects
- `GET /api/projects` - List user's projects
- `POST /api/projects` - Create project
- `GET /api/projects/[id]` - Get project details
- `PATCH /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project
- `POST /api/projects/[id]/autosave` - Autosave endpoint
- `GET /api/projects/[id]/versions` - List versions
- `POST /api/projects/[id]/versions` - Create version
- `GET /api/projects/[id]/collaborators` - List collaborators
- `POST /api/projects/[id]/collaborators` - Add collaborator
- `PATCH /api/projects/[id]/collaborators` - Update role
- `DELETE /api/projects/[id]/collaborators` - Remove collaborator

### Orders
- `GET /api/orders` - List user's orders
- `POST /api/orders` - Create order
- `GET /api/orders/[id]` - Get order details
- `PATCH /api/orders/[id]` - Update order

## Security Features

### Password Security
- bcrypt hashing with 12 rounds
- Minimum 8 character requirement
- Current password verification for changes
- OAuth accounts cannot change password

### Access Control
- Route protection via middleware
- Session-based authentication
- Role-based permissions
- Owner-only operations (delete, share)
- Collaborator permission checks

### Data Protection
- User can only access own data
- Collaborators checked on every request
- Public projects available to all
- Admin role for elevated operations

## Usage Examples

### Client-Side Hooks

```typescript
// Use authentication
import { useAuth } from "@/hooks/useAuth";

const { user, isAuthenticated, isLoading } = useAuth();

// Autosave
import { useAutosave } from "@/hooks/useAutosave";

const { save, lastSaved } = useAutosave({
  projectId: "project-id",
  data: { pages, photos },
  interval: 30000, // 30 seconds
  onSave: (savedAt) => console.log("Saved at", savedAt),
});
```

### API Client

```typescript
import { createProject, updateProject } from "@/lib/api/projects";

// Create project
const { project } = await createProject({
  title: "My Photo Book",
  description: "Family vacation 2024",
  theme: "quiet-luxe",
});

// Update project
await updateProject(project.id, {
  status: "published",
});
```

### Server-Side Auth

```typescript
import { getCurrentUser, requireAuth } from "@/lib/auth/session";

// Get current user (returns null if not logged in)
const user = await getCurrentUser();

// Require authentication (redirects if not logged in)
const user = await requireAuth();

// Require specific role
const admin = await requireRole("admin");
```

## Environment Variables

Create a `.env` file with:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/frametale?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Facebook OAuth
FACEBOOK_CLIENT_ID="your-facebook-app-id"
FACEBOOK_CLIENT_SECRET="your-facebook-app-secret"
```

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Generate NextAuth secret**:
   ```bash
   openssl rand -base64 32
   ```

4. **Set up PostgreSQL database**:
   ```bash
   # Create database
   createdb frametale
   ```

5. **Run Prisma migrations**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. **Run development server**:
   ```bash
   npm run dev
   ```

## OAuth Setup

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env`

### Facebook OAuth
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Set Valid OAuth Redirect URIs: `http://localhost:3000/api/auth/callback/facebook`
5. Copy App ID and App Secret to `.env`

## Protected Routes

The following routes are protected by middleware:
- `/dashboard/*` - User dashboard
- `/editor/*` - Project editor
- `/projects/*` - Project management
- `/auth/*` - Auth pages (redirect if logged in)

## Production Checklist

- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Use production database URL
- [ ] Configure OAuth redirect URIs for production domain
- [ ] Set `NEXTAUTH_URL` to production URL
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure rate limiting
- [ ] Add email verification (currently disabled)
- [ ] Add password reset flow
- [ ] Set up monitoring and logging
- [ ] Test all auth flows
- [ ] Review and update security policies

## Future Enhancements

- Email verification on signup
- Password reset via email
- Two-factor authentication (2FA)
- Social profile sync
- Invitation system with email notifications
- Real-time collaboration
- Activity logs
- API rate limiting
- Webhooks for order updates
- Export project data
