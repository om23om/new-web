# MonetizePro - Complete Monetization Platform

A modern, full-featured monetization platform for digital creators and entrepreneurs. Built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### 1. Product Sales & E-commerce
- Browse digital products, courses, and services
- Add items to shopping cart
- Secure checkout process
- Order history tracking

### 2. Content Monetization
- Free articles for audience engagement
- Premium content for subscribers
- Sponsored content partnerships
- Content management and publishing

### 3. Subscription Management
- Multiple pricing tiers (Basic, Premium, VIP)
- Monthly and yearly billing options
- Subscription status tracking
- Automatic access control to premium content

### 4. Affiliate Program
- Unique referral codes for each affiliate
- 30% commission on sales
- Real-time earnings tracking
- Referral count monitoring

### 5. User Features
- Secure email/password authentication
- Personal dashboard
- Profile management
- Purchase history
- Cart management
- Subscription overview

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase account

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up your database:
   - Follow instructions in `DATABASE_SETUP.md`
   - Apply the migration from `supabase/migrations/20250102_create_monetization_platform.sql`

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/          # React components
│   ├── AuthModal.tsx   # Login/Signup modal
│   ├── CartSidebar.tsx # Shopping cart sidebar
│   └── UserDashboard.tsx # User dashboard
├── lib/                # Utilities and services
│   ├── auth.ts         # Authentication functions
│   └── supabase.ts     # Supabase client setup
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## Database Schema

The platform uses a comprehensive database schema with:
- User profiles with affiliate support
- Products catalog
- Content library (articles)
- Subscription plans and user subscriptions
- Shopping cart
- Orders and order items
- Affiliate tracking

All tables are secured with Row Level Security (RLS) policies.

## Key Features Implementation

### Authentication
- Email/password authentication via Supabase
- Automatic profile creation on signup
- Session management with state persistence

### Shopping Experience
- Real-time cart updates
- Product catalog with images
- Smooth add-to-cart flow
- Cart item management

### Dashboard
- Overview with key metrics
- Order history
- Subscription management
- Affiliate program access
- Profile settings

### Security
- Row Level Security on all database tables
- Secure authentication flow
- Protected routes and data access
- Input validation

## Design Principles

- Clean, modern aesthetic with emerald/teal color scheme
- Responsive design for all screen sizes
- Smooth transitions and hover effects
- Accessible UI components
- Clear visual hierarchy

## License

MIT
