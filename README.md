# Modular Fuel App

A modular full-stack web application built with Next.js 15 and MongoDB, featuring a plug-and-play module architecture.

## Features

- **Modular Architecture**: Plug-and-play modules with automatic registration
- **Authentication**: Clerk authentication with role-based access control
- **Admin Panel**: User management, role controls, and audit logging
- **Fuel Log Module**: Vehicle tracking, fuel consumption, and service records
- **Theme System**: Multiple color themes with light/dark mode support
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Testing**: Comprehensive test suite with Vitest and Testing Library

## Tech Stack

- **Frontend**: Next.js 15, React 18, Tailwind CSS v4
- **Backend**: Next.js API Routes, Server Actions
- **Database**: MongoDB with Mongoose
- **Authentication**: Clerk with role-based access control
- **State Management**: React Query (TanStack Query), Zustand
- **UI Components**: shadcn/ui, Radix UI
- **Charts**: Recharts
- **Testing**: Vitest, Testing Library, Playwright
- **Development**: TypeScript, ESLint, Prettier

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud)
- Clerk account for authentication
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd modular-fuel-app
\`\`\`

2. Install dependencies:
\`\`\`bash
pnpm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` with your configuration:
\`\`\`env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
\`\`\`

4. Start MongoDB (if using Docker):
\`\`\`bash
docker-compose up -d
\`\`\`

5. Seed the database:
\`\`\`bash
pnpm seed
\`\`\`

6. Start the development server:
\`\`\`bash
pnpm dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### Demo Accounts

After seeding the database and setting up Clerk, create test accounts through the Clerk dashboard or sign-up flow.

## Module Development

### Creating a New Module

Use the CLI to scaffold a new module:

\`\`\`bash
pnpm mod:new "My Module"
\`\`\`

This creates:
- Module directory structure
- Models, repositories, services
- Validators and actions
- Basic UI components
- Route pages

### Module Structure

\`\`\`
modules/
  my-module/
    models/          # Database models
    repositories/    # Data access layer
    services/        # Business logic
    actions/         # Server actions
    validators/      # Zod schemas
    ui/             # UI components
app/
  (modules)/
    my-module/      # Route pages
\`\`\`

### Registering a Module

Add your module to `modules/registry.ts`:

\`\`\`typescript
{
  id: 'my-module',
  name: 'My Module',
  description: 'Module description',
  icon: MyIcon,
  version: '1.0.0',
  enabled: true,
  requiredRoles: ['user', 'admin'],
  routes: [
    {
      path: '/my-module',
      label: 'Dashboard',
      icon: DashboardIcon,
    },
    // ... more routes
  ],
}
\`\`\`

## Testing

Run the test suite:

\`\`\`bash
# Unit tests
pnpm test

# Test with UI
pnpm test:ui

# Coverage report
pnpm test:coverage

# E2E tests
pnpm playwright test
\`\`\`

## Architecture

### Core Principles

1. **Modular by Design**: Each module is self-contained with its own models, services, and UI
2. **Shared Infrastructure**: Common utilities, UI components, and patterns
3. **Type Safety**: Full TypeScript coverage with Zod validation
4. **Server Components**: Default to server components, client only when needed
5. **Progressive Enhancement**: Works without JavaScript, enhanced with it

### Key Patterns

- **Repository Pattern**: Data access abstraction
- **Service Layer**: Business logic separation
- **Action Factory**: Reusable server action creation
- **Route Factory**: Standardized API route handling
- **Widget System**: Pluggable dashboard components

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Docker

\`\`\`bash
# Build image
docker build -t modular-fuel-app .

# Run container
docker run -p 3000:3000 modular-fuel-app
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

MIT License - see LICENSE file for details
