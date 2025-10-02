import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
};

export type Article = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  content_type: 'free' | 'premium' | 'sponsored';
  author_id: string | null;
  published_at: string;
  created_at: string;
};

export type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  billing_interval: 'monthly' | 'yearly';
  features: string[];
  is_active: boolean;
  created_at: string;
};

export type CartItem = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  products?: Product;
};

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  is_affiliate: boolean;
  affiliate_commission_rate: number;
  created_at: string;
};
