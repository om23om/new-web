# Database Setup Instructions

This MonetizePro platform uses Supabase as its database. The database schema has been designed and is ready to be applied.

## Database Schema

The migration file is located at:
```
supabase/migrations/20250102_create_monetization_platform.sql
```

## What's Included

The database schema includes:

1. **User Profiles** - Extended user information including affiliate status
2. **Products** - Digital products, courses, and services for sale
3. **Articles** - Content library with free, premium, and sponsored articles
4. **Subscription Plans** - Flexible pricing tiers for recurring revenue
5. **User Subscriptions** - Tracks active and expired subscriptions
6. **Cart Items** - Shopping cart functionality
7. **Orders & Order Items** - Purchase history and order details
8. **Affiliates** - Referral tracking and commission management

## Sample Data

The migration includes sample data:
- 3 products (Starter Toolkit, Premium Course, 1-on-1 Consulting)
- 3 subscription plans (Basic, Premium, VIP)
- 3 sample articles (free, premium, and sponsored content)

## Security

Row Level Security (RLS) is enabled on all tables with appropriate policies to ensure:
- Users can only access their own data
- Products and articles are publicly readable
- Cart items, orders, and subscriptions are private
- Affiliate data is restricted to the affiliate user

## Applying the Migration

To apply the migration to your Supabase database:

1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Copy the contents of the migration file
4. Execute the SQL script

Alternatively, if you have the Supabase CLI installed:
```bash
supabase db push
```

## Next Steps

After applying the migration:
1. The application will automatically connect to your database
2. Users can sign up and log in
3. Products, articles, and subscription plans will be displayed
4. Users can add items to cart and manage their account
