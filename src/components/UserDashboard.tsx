import { useState, useEffect } from 'react';
import { ArrowLeft, User, Package, FileText, DollarSign, TrendingUp, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Profile } from '../lib/auth';

type UserDashboardProps = {
  user: any;
  profile: Profile | null;
  onBack: () => void;
  onSignOut: () => void;
};

type Order = {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
};

type Subscription = {
  id: string;
  status: string;
  starts_at: string;
  ends_at: string;
  subscription_plans: {
    name: string;
    price: number;
  };
};

export default function UserDashboard({ user, profile, onBack, onSignOut }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'subscriptions' | 'affiliate' | 'settings'>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [affiliateData, setAffiliateData] = useState<any>(null);

  useEffect(() => {
    fetchOrders();
    fetchSubscriptions();
    fetchAffiliateData();
  }, [user]);

  async function fetchOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data);
    }
  }

  async function fetchSubscriptions() {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        subscription_plans (name, price)
      `)
      .eq('user_id', user.id);

    if (!error && data) {
      setSubscriptions(data);
    }
  }

  async function fetchAffiliateData() {
    const { data, error } = await supabase
      .from('affiliates')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!error) {
      setAffiliateData(data);
    }
  }

  async function createAffiliate() {
    const referralCode = `${profile?.full_name?.replace(/\s+/g, '').toLowerCase() || 'user'}-${Math.random().toString(36).substr(2, 6)}`;

    const { data, error } = await supabase
      .from('affiliates')
      .insert([
        {
          user_id: user.id,
          referral_code: referralCode,
        },
      ])
      .select()
      .single();

    if (!error && data) {
      setAffiliateData(data);
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'subscriptions', label: 'Subscriptions', icon: FileText },
    { id: 'affiliate', label: 'Affiliate', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center text-slate-600 hover:text-emerald-600 transition"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </button>
            <button
              onClick={onSignOut}
              className="px-4 py-2 text-slate-600 hover:text-red-600 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, {profile?.full_name || 'User'}!</h1>
          <p className="text-slate-600">Manage your account and track your progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <div className="flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mx-auto mb-4">
                <User className="h-10 w-10 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 text-center">{profile?.full_name}</h2>
              <p className="text-slate-600 text-center text-sm mt-1">{profile?.email}</p>
            </div>

            <nav className="bg-white rounded-xl shadow-sm">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center space-x-3 px-6 py-4 transition border-l-4 ${
                      activeTab === tab.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-600'
                        : 'border-transparent hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Dashboard Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-600">Total Orders</span>
                        <Package className="h-5 w-5 text-emerald-600" />
                      </div>
                      <p className="text-3xl font-bold text-slate-900">{orders.length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-600">Active Subscriptions</span>
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <p className="text-3xl font-bold text-slate-900">
                        {subscriptions.filter((s) => s.status === 'active').length}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-600">Affiliate Earnings</span>
                        <DollarSign className="h-5 w-5 text-amber-600" />
                      </div>
                      <p className="text-3xl font-bold text-slate-900">
                        ${affiliateData?.total_earnings?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
                    {orders.length === 0 ? (
                      <p className="text-slate-500 text-center py-8">No recent orders</p>
                    ) : (
                      <div className="space-y-3">
                        {orders.slice(0, 5).map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div>
                              <p className="font-semibold text-slate-900">Order #{order.id.slice(0, 8)}</p>
                              <p className="text-sm text-slate-600">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-emerald-600">${order.total_amount}</p>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                order.status === 'completed'
                                  ? 'bg-green-100 text-green-700'
                                  : order.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Order History</h2>
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 text-lg">No orders yet</p>
                      <button
                        onClick={onBack}
                        className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-slate-200 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-bold text-slate-900">Order #{order.id}</h3>
                              <p className="text-sm text-slate-600">
                                {new Date(order.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-emerald-600">${order.total_amount}</p>
                              <span className={`text-xs px-3 py-1 rounded-full ${
                                order.status === 'completed'
                                  ? 'bg-green-100 text-green-700'
                                  : order.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'subscriptions' && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">My Subscriptions</h2>
                  {subscriptions.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 text-lg">No active subscriptions</p>
                      <button
                        onClick={onBack}
                        className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                      >
                        View Plans
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {subscriptions.map((subscription) => (
                        <div key={subscription.id} className="border border-slate-200 rounded-lg p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-bold text-slate-900 text-lg">
                                {subscription.subscription_plans.name}
                              </h3>
                              <p className="text-slate-600 mt-1">
                                Started: {new Date(subscription.starts_at).toLocaleDateString()}
                              </p>
                              {subscription.ends_at && (
                                <p className="text-slate-600">
                                  Ends: {new Date(subscription.ends_at).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-emerald-600">
                                ${subscription.subscription_plans.price}/mo
                              </p>
                              <span className={`text-xs px-3 py-1 rounded-full ${
                                subscription.status === 'active'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'affiliate' && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Affiliate Program</h2>
                  {!affiliateData ? (
                    <div className="text-center py-12">
                      <DollarSign className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Join Our Affiliate Program</h3>
                      <p className="text-slate-600 mb-6 max-w-md mx-auto">
                        Start earning 30% commission on every sale you refer. Get your unique referral code and start promoting today!
                      </p>
                      <button
                        onClick={createAffiliate}
                        className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold"
                      >
                        Become an Affiliate
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6">
                          <p className="text-slate-600 mb-2">Total Earnings</p>
                          <p className="text-3xl font-bold text-slate-900">
                            ${affiliateData.total_earnings?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
                          <p className="text-slate-600 mb-2">Referrals</p>
                          <p className="text-3xl font-bold text-slate-900">{affiliateData.total_referrals || 0}</p>
                        </div>
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6">
                          <p className="text-slate-600 mb-2">Status</p>
                          <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                            affiliateData.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {affiliateData.status.charAt(0).toUpperCase() + affiliateData.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-lg p-6">
                        <h3 className="font-bold text-slate-900 mb-2">Your Referral Code</h3>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-lg font-mono text-emerald-600">
                            {affiliateData.referral_code}
                          </code>
                          <button
                            onClick={() => navigator.clipboard.writeText(affiliateData.referral_code)}
                            className="px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                          >
                            Copy
                          </button>
                        </div>
                        <p className="text-sm text-slate-600 mt-2">
                          Share this code with your audience to earn commission on their purchases
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Account Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profile?.full_name || ''}
                        readOnly
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={profile?.email || ''}
                        readOnly
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
                      />
                    </div>
                    <div className="pt-4 border-t border-slate-200">
                      <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">
                        Update Profile
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
