# Praxis Fortis - Workflow Optimization Platform

## Overview

Praxis Fortis is a comprehensive workflow optimization platform designed specifically for specialty medical practices. The application combines AI-powered workflow analysis with intuitive visual workflow building capabilities, helping healthcare professionals identify inefficiencies and implement Lean methodology improvements.

## System Architecture

The application follows a full-stack monorepo architecture with clear separation between client and server code:

- **Frontend**: React with TypeScript, using Vite for build tooling
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **AI Integration**: OpenAI GPT-4o for workflow analysis
- **Payment Processing**: Stripe for subscription management
- **UI Framework**: Tailwind CSS with shadcn/ui components

## Key Components

### Frontend Architecture
- **React Router**: wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom brand colors and typography
- **Workflow Builder**: React Flow for visual workflow creation
- **Charts**: Mermaid.js for workflow diagrams

### Backend Architecture
- **Express Server**: RESTful API with middleware for logging and error handling
- **Database Layer**: Drizzle ORM with connection pooling via Neon
- **Authentication**: Passport.js with OpenID Connect strategy
- **Session Management**: PostgreSQL-backed sessions with connect-pg-simple
- **AI Services**: OpenAI integration for workflow analysis

### Database Schema
- **Users Table**: User profiles with subscription status and usage tracking
- **Workflows Table**: User-created workflows with JSON data storage
- **Templates Table**: Pre-built workflow templates
- **Sessions Table**: Authentication session storage (required for Replit Auth)

## Data Flow

1. **User Authentication**: Users authenticate via Replit Auth (OpenID Connect)
2. **Workflow Creation**: Users build workflows using drag-and-drop interface
3. **AI Analysis**: Workflows are analyzed by OpenAI for optimization suggestions
4. **Data Persistence**: Workflows and analysis results stored in PostgreSQL
5. **Subscription Management**: Stripe handles payment processing and subscription status

## External Dependencies

- **Neon Database**: PostgreSQL database hosting
- **OpenAI API**: GPT-4o for workflow analysis and optimization suggestions
- **Stripe**: Payment processing and subscription management
- **Replit Auth**: Authentication service
- **React Flow**: Workflow visualization library
- **Mermaid.js**: Diagram generation

## Deployment Strategy

The application is configured for deployment on Replit with autoscaling:

- **Development**: `npm run dev` starts both client and server in development mode
- **Production Build**: `npm run build` creates optimized client build and bundles server
- **Production Start**: `npm run start` runs the production server
- **Database Migrations**: `npm run db:push` applies schema changes

The Vite configuration handles client-side routing and API proxying in development, while the Express server serves static files in production.

## Changelog

- June 25, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.