# Praxis Fortis - Workflow Optimization Platform

## Overview

Praxis Fortis is a comprehensive workflow optimization platform designed specifically for specialty medical practices. The application combines AI-powered workflow analysis with intuitive visual workflow building capabilities, helping healthcare professionals identify inefficiencies and implement Lean methodology improvements.

## System Architecture

The application follows a full-stack monorepo architecture with clear separation between client and server code:

- **Frontend**: React with TypeScript, using Vite for build tooling
- **Backend**: Express.js server with TypeScript
- **Database**: Supabase PostgreSQL 
- **Authentication**: Supabase Auth with Google OAuth
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
- **Database Layer**: Supabase client with built-in connection pooling
- **Authentication**: Supabase Auth with JWT token validation
- **Session Management**: Supabase Auth session management
- **AI Services**: OpenAI integration for workflow analysis

### Database Schema
- **Users Table**: User profiles with subscription status and usage tracking
- **Workflows Table**: User-created workflows with JSON data storage
- **Templates Table**: Pre-built workflow templates
- **Auth Tables**: Managed by Supabase Auth service

## Data Flow

1. **User Authentication**: Users authenticate via Supabase Auth (Google OAuth)
2. **Workflow Creation**: Users build workflows using drag-and-drop interface
3. **AI Analysis**: Workflows are analyzed by OpenAI for optimization suggestions
4. **Data Persistence**: Workflows and analysis results stored in PostgreSQL
5. **Subscription Management**: Stripe handles payment processing and subscription status

## External Dependencies

- **Supabase**: PostgreSQL database hosting and authentication service
- **OpenAI API**: GPT-4o for workflow analysis and optimization suggestions
- **Stripe**: Payment processing and subscription management
- **React Flow**: Workflow visualization library
- **Mermaid.js**: Diagram generation

## Deployment Strategy

The application is configured for deployment on Replit with autoscaling:

- **Development**: `npm run dev` starts both client and server in development mode
- **Production Build**: `npm run build` creates optimized client build and bundles server
- **Production Start**: `npm run start` runs the production server
- **Database Migrations**: `npm run db:push` applies schema changes

The Vite configuration handles client-side routing and API proxying in development, while the Express server serves static files in production.

## Recent Changes

- **June 25, 2025 - Supabase Integration**: 
  - Migrated from Neon database and Replit Auth to Supabase
  - Implemented Supabase Auth with Google OAuth provider
  - Updated database layer to use Supabase client instead of Drizzle ORM
  - Created database tables for users, workflows, and templates
  - Enhanced authentication flow with auth callback handling

- **June 25, 2025 - Brand Updates**: 
  - Updated application name from "Praxis Fortis" to "Workflow Optimization Tool"
  - Implemented elegant color palette with blues, silver, and emerald green theme
  - Fixed text contrast issues on landing page hero section
  - Royal Blue (primary): hsl(208, 100%, 43%)
  - Slate Blue (foreground): hsl(215, 25%, 27%)
  - Silver Gray: hsl(210, 14%, 53%)  
  - Platinum (backgrounds): hsl(210, 14%, 89%)
  - Emerald Green (accent): hsl(158, 58%, 48%)
  - Pearl White (canvas): hsl(210, 20%, 98%)

## Changelog

- June 25, 2025. Initial setup and branding implementation

## User Preferences

Preferred communication style: Simple, everyday language.
User prefers step-by-step guidance for technical setup processes.