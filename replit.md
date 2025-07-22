# replit.md

## Overview

This is a full-stack e-commerce application called "TexnoGrand" - a modern online marketplace for electronic products. The application features a React frontend with TypeScript, an Express.js backend, and uses Drizzle ORM for database management with PostgreSQL. The system supports multi-language functionality (Uzbek and Russian), user authentication, shopping cart management, and payment processing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with clear separation between client, server, and shared components:

- **Frontend**: React with TypeScript, using Vite for build tooling
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Client-side routing using Wouter
- **State Management**: TanStack Query for server state management

## Key Components

### Frontend Architecture
- **Component Structure**: Modular component architecture with shadcn/ui components
- **Pages**: Home, product details, category listing, cart, authentication pages
- **State Management**: TanStack Query for API calls and caching
- **Internationalization**: Custom language switching between Uzbek and Russian
- **Styling**: Tailwind CSS with custom design tokens for brand colors

### Backend Architecture
- **API Structure**: RESTful API with Express.js
- **Authentication**: JWT-based authentication with bcrypt for password hashing
- **Database Layer**: Drizzle ORM with PostgreSQL for data persistence
- **Route Organization**: Centralized route registration with middleware support

### Database Schema
The application uses a comprehensive e-commerce schema including:
- **Users**: Multi-role system (buyer, seller, partner, admin)
- **Products**: Full product catalog with multilingual support
- **Categories**: Hierarchical category structure
- **Cart Management**: User shopping cart functionality
- **Orders**: Complete order management system
- **Reviews**: Product review and rating system
- **Banners**: Homepage promotional content

### Key Features
- **Multi-language Support**: Uzbek and Russian language switching
- **User Roles**: Different user types (buyers, sellers, partners, admins)
- **Product Management**: Complete product catalog with categories, images, and reviews
- **Shopping Cart**: Add/remove items, quantity management
- **Authentication**: User registration and login system
- **Payment Integration**: Click and Payme payment gateway integration
- **Responsive Design**: Mobile-first responsive design

## Data Flow

1. **Client Requests**: React components make API calls through TanStack Query
2. **API Layer**: Express.js handles requests with authentication middleware
3. **Business Logic**: Server processes requests and applies business rules
4. **Database Operations**: Drizzle ORM performs type-safe database operations
5. **Response**: JSON responses sent back to client with appropriate status codes

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React 18, TypeScript, Vite for development
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom configuration
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing

### Backend Dependencies
- **Framework**: Express.js with TypeScript support
- **Database**: Drizzle ORM with PostgreSQL (Neon Database)
- **Authentication**: JWT tokens, bcrypt for password hashing
- **Session Management**: connect-pg-simple for session storage
- **Payment Processing**: Integration setup for Click and Payme

### Development Tools
- **Build System**: Vite for frontend, esbuild for backend
- **Type Checking**: TypeScript with strict configuration
- **Code Quality**: ESLint and Prettier (implied by structure)
- **Development**: Hot reload support for both frontend and backend

## Deployment Strategy

The application is configured for deployment with the following approach:

- **Build Process**: Separate build commands for frontend (Vite) and backend (esbuild)
- **Production Setup**: Single production server serving both API and static files
- **Database**: PostgreSQL database with Drizzle migrations
- **Environment Variables**: Configuration through environment variables for database and JWT secrets

### Build Commands
- `npm run dev`: Development mode with hot reload
- `npm run build`: Production build for both client and server
- `npm run start`: Production server startup
- `npm run db:push`: Database schema deployment

The architecture supports easy scaling and maintenance while providing a robust foundation for an e-commerce platform with modern web technologies.