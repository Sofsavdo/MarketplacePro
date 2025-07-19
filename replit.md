# O'zbek Marketplace - E-commerce Platform

## Overview

O'zbek Marketplace - O'zbekiston bozoriga moslashtirilgan keng qamrovli e-commerce platform. Bu loyiha sotuvchilar kabineti, blogerlar uchun affiliate tizimi, xaridorlar interfeysi va admin paneli bilan to'liq funksional marketplace hisoblanadi. Uzum Market, Yandex Market va Noon kabi platformalardan ilhomlanib yaratilgan. React, Express.js va PostgreSQL bilan qurilgan, to'liq TypeScript qo'llab-quvvatlash bilan.

## User Preferences

Preferred communication style: Simple, everyday language.
Language: O'zbek tili (Uzbek) - all UI components support Uzbek localization
Payment methods: Click.uz va Payme.uz (Uzbekistan local payment systems)
Design inspiration: Uzum Market (seller/affiliate), Yandex Market (admin), Noon (customer)
Target market: O'zbekiston (Uzbekistan market focus)

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state management
- **UI Components**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Simple session storage using connect-pg-simple
- **API Design**: RESTful API with JSON responses
- **Error Handling**: Centralized error handling middleware

### Database Schema
The system uses PostgreSQL with the following main entities:
- **Users**: Supports buyer, seller, and affiliate roles
- **Products**: Managed by sellers with commission rates for affiliates
- **Orders**: Tracks purchases with affiliate attribution
- **Affiliate Links**: Unique tracking codes for affiliate marketing
- **Affiliate Clicks**: Click tracking for analytics

## Key Components

### Platform Architecture
- **Main Marketplace**: Professional e-commerce interface similar to Wildberries.ru
- **Landing Page**: Professional introduction to the platform
- **Seller Portal**: Dedicated onboarding and dashboard for sellers
- **Affiliate Portal**: Separate onboarding and dashboard for affiliates
- **Clear Separation**: No affiliate information visible in main marketplace

### Authentication System
- Role-based authentication (buyer/seller/affiliate)
- Client-side authentication manager with local storage persistence
- Protected routes with AuthGuard component
- Session-based authentication on the server

### Main Marketplace Features
- Professional product grid with advanced filtering
- Category-based browsing with product counts
- Search functionality across products
- Shopping cart and wishlist features
- No affiliate commission or earning information displayed
- Focus on pure e-commerce experience

### Seller Onboarding & Management
- Professional onboarding flow with benefits showcase
- Detailed seller registration process
- Product management dashboard
- Sales analytics and reporting
- Order tracking and management

### Affiliate Marketing System
- Dedicated affiliate onboarding with commission structure
- Unique affiliate link generation and tracking
- Real-time analytics and earnings reports
- Marketing materials and tools
- Commission management (5-25% based on category)

### Dashboard Systems
- **Marketplace**: Clean e-commerce interface for customers
- **Seller Dashboard**: Product management, order tracking, sales analytics
- **Affiliate Dashboard**: Link management, click tracking, earnings reports
- **Onboarding Pages**: Professional conversion-focused experiences

## Data Flow

1. **User Registration/Login**: Users register with a specific role (buyer/seller/affiliate)
2. **Product Management**: Sellers create and manage products with commission rates
3. **Affiliate Marketing**: Affiliates generate unique links for products
4. **Order Processing**: Buyers purchase products, potentially through affiliate links
5. **Analytics**: System tracks clicks, conversions, and generates reports

## External Dependencies

### Frontend Dependencies
- **UI Library**: Radix UI for accessible components
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Fetch API with TanStack React Query
- **Icons**: Lucide React
- **Date Handling**: date-fns

### Backend Dependencies
- **Database**: Neon serverless PostgreSQL
- **ORM**: Drizzle ORM with Zod schema validation
- **Session Store**: connect-pg-simple for PostgreSQL session storage
- **Build Tool**: ESBuild for server bundling

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx for TypeScript execution
- **Database**: Neon serverless PostgreSQL
- **Environment**: Replit with cartographer plugin for development

### Production Build
- **Frontend**: Vite build to `dist/public`
- **Backend**: ESBuild bundle to `dist/index.js`
- **Database**: Drizzle migrations for schema management
- **Static Files**: Express serves frontend from `dist/public`

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Node.js ESM modules throughout the application
- TypeScript compilation with strict mode enabled

The application uses a monorepo structure with shared TypeScript types and schemas between frontend and backend, ensuring type safety across the entire stack.