/*
  # MonetizePro Platform Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `full_name` (text)
      - `email` (text)
      - `avatar_url` (text)
      - `is_affiliate` (boolean)
      - `affiliate_commission_rate` (numeric)
      - `created_at` (timestamptz)

    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `category` (text)
      - `image_url` (text)
      - `is_active` (boolean)
      - `created_at` (timestamptz)

    - `articles`
      - `id` (uuid, primary key)
      - `title` (text)
      - `excerpt` (text)
      - `content` (text)
      - `content_type` (text: 'free', 'premium', 'sponsored')
      - `author_id` (uuid, references profiles)
      - `published_at` (timestamptz)
      - `created_at` (timestamptz)

    - `subscription_plans`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `billing_interval` (text: 'monthly', 'yearly')
      - `features` (jsonb)
      - `is_active` (boolean)
      - `created_at` (timestamptz)

    - `user_subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `plan_id` (uuid, references subscription_plans)
      - `status` (text: 'active', 'cancelled', 'expired')
      - `starts_at` (timestamptz)
      - `ends_at` (timestamptz)
      - `created_at` (timestamptz)

    - `cart_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `product_id` (uuid, references products)
      - `quantity` (integer)
      - `created_at` (timestamptz)

    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `total_amount` (numeric)
      - `status` (text: 'pending', 'completed', 'cancelled')
      - `created_at` (timestamptz)

    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, references orders)
      - `product_id` (uuid, references products)
      - `quantity` (integer)
      - `price_at_purchase` (numeric)
      - `created_at` (timestamptz)

    - `affiliates`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `referral_code` (text, unique)
      - `total_referrals` (integer)
      - `total_earnings` (numeric)
      - `status` (text: 'active', 'inactive')
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to:
      - Read their own profile data
      - Update their own profile
      - Read active products and articles
      - Manage their own cart items
      - View their own orders and subscriptions
      - Manage their affiliate account

  3. Important Notes
    - All tables use UUID primary keys for scalability
    - RLS policies ensure users can only access their own data
    - Product and article data is readable by all authenticated users
    - Subscription and order history is private to each user
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text UNIQUE NOT NULL,
  avatar_url text,
  is_affiliate boolean DEFAULT false,
  affiliate_commission_rate numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  category text DEFAULT 'general',
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active products"
  ON products FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text,
  content text,
  content_type text DEFAULT 'free' CHECK (content_type IN ('free', 'premium', 'sponsored')),
  author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read free articles"
  ON articles FOR SELECT
  TO authenticated
  USING (content_type = 'free');

CREATE POLICY "Subscribers can read premium articles"
  ON articles FOR SELECT
  TO authenticated
  USING (
    content_type = 'premium' AND
    EXISTS (
      SELECT 1 FROM user_subscriptions
      WHERE user_subscriptions.user_id = auth.uid()
      AND user_subscriptions.status = 'active'
      AND user_subscriptions.ends_at > now()
    )
  );

CREATE POLICY "Anyone can read sponsored articles"
  ON articles FOR SELECT
  TO authenticated
  USING (content_type = 'sponsored');

-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  billing_interval text DEFAULT 'monthly' CHECK (billing_interval IN ('monthly', 'yearly')),
  features jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active subscription plans"
  ON subscription_plans FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  plan_id uuid REFERENCES subscription_plans(id) ON DELETE SET NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  starts_at timestamptz DEFAULT now(),
  ends_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own subscriptions"
  ON user_subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity integer DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own cart items"
  ON cart_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  total_amount numeric NOT NULL DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  quantity integer DEFAULT 1 CHECK (quantity > 0),
  price_at_purchase numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Create affiliates table
CREATE TABLE IF NOT EXISTS affiliates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  referral_code text UNIQUE NOT NULL,
  total_referrals integer DEFAULT 0,
  total_earnings numeric DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own affiliate data"
  ON affiliates FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own affiliate data"
  ON affiliates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own affiliate data"
  ON affiliates FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert sample data for products
INSERT INTO products (name, description, price, category, image_url) VALUES
  ('Starter Toolkit', 'Everything you need to start your digital journey', 49.99, 'toolkit', 'https://images.pexels.com/photos/4065876/pexels-photo-4065876.jpeg'),
  ('Premium Course', 'Advanced strategies for scaling your business', 299.99, 'course', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg'),
  ('1-on-1 Consulting', 'Personalized guidance for your unique challenges', 199.99, 'service', 'https://images.pexels.com/photos/3184436/pexels-photo-3184436.jpeg');

-- Insert sample subscription plans
INSERT INTO subscription_plans (name, description, price, billing_interval, features) VALUES
  ('Basic', 'Access to premium content', 9.99, 'monthly', '["Premium articles", "Email support"]'::jsonb),
  ('Premium', 'Everything in Basic plus exclusive perks', 29.99, 'monthly', '["Premium articles", "Email support", "Monthly Q&A calls", "Resource library"]'::jsonb),
  ('VIP', 'Full access to all features and priority support', 99.99, 'monthly', '["Premium articles", "Email support", "Monthly Q&A calls", "Resource library", "Priority support", "1-on-1 coaching session"]'::jsonb);

-- Insert sample articles
INSERT INTO articles (title, excerpt, content, content_type) VALUES
  ('Getting Started with Digital Monetization', 'Learn the fundamentals of building income streams online', 'This is a comprehensive guide to getting started...', 'free'),
  ('Advanced Marketing Strategies', 'Unlock the secrets to scaling your audience', 'Premium content available to subscribers only...', 'premium'),
  ('Partner Spotlight: Amazing Tool', 'Discover how this tool can transform your workflow', 'Sponsored content in partnership with...', 'sponsored');
