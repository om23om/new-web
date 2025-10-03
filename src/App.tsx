import { useState } from 'react';
import { ShoppingCart, Menu, X, ChevronDown, Package, BookOpen, CreditCard, Users, TrendingUp } from 'lucide-react';
import CartSidebar from './components/CartSidebar';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
};

type Article = {
  id: string;
  title: string;
  excerpt: string;
  content_type: 'free' | 'premium' | 'sponsored';
  published_at: string;
};

type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  billing_interval: 'monthly' | 'yearly';
  features: string[];
};

type CartItem = {
  id: string;
  product: Product;
  quantity: number;
};

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Complete Business Toolkit',
    description: 'Everything you need to start and grow your online business',
    price: 99,
    category: 'Digital Product',
    image_url: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '2',
    name: 'Marketing Masterclass',
    description: 'Learn proven strategies to market your products effectively',
    price: 149,
    category: 'Course',
    image_url: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '3',
    name: '1-on-1 Consulting',
    description: 'Personalized guidance to accelerate your growth',
    price: 299,
    category: 'Service',
    image_url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

const mockArticles: Article[] = [
  {
    id: '1',
    title: '10 Ways to Monetize Your Skills Online',
    excerpt: 'Discover proven methods to turn your expertise into income streams that work for you 24/7.',
    content_type: 'free',
    published_at: '2025-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Building a Sustainable Subscription Business',
    excerpt: 'Learn the secrets to creating recurring revenue and building long-term customer relationships.',
    content_type: 'premium',
    published_at: '2025-01-10T10:00:00Z',
  },
  {
    id: '3',
    title: 'The Complete Guide to Affiliate Marketing',
    excerpt: 'Everything you need to know about earning commissions by promoting products you love.',
    content_type: 'free',
    published_at: '2025-01-05T10:00:00Z',
  },
];

const mockPlans: SubscriptionPlan[] = [
  {
    id: '1',
    name: 'Starter',
    description: 'Perfect for individuals just getting started',
    price: 9,
    billing_interval: 'monthly',
    features: [
      'Access to free content',
      'Community forum access',
      'Monthly newsletter',
      'Basic support',
    ],
  },
  {
    id: '2',
    name: 'Professional',
    description: 'For serious creators ready to scale',
    price: 29,
    billing_interval: 'monthly',
    features: [
      'All Starter features',
      'Access to premium content',
      'Exclusive webinars',
      'Priority support',
      'Affiliate program access',
      'Advanced analytics',
    ],
  },
  {
    id: '3',
    name: 'Enterprise',
    description: 'Maximum features for power users',
    price: 99,
    billing_interval: 'monthly',
    features: [
      'All Professional features',
      '1-on-1 consulting sessions',
      'Custom integration support',
      'White-label options',
      'Dedicated account manager',
    ],
  },
];

function App() {
  const [products] = useState<Product[]>(mockProducts);
  const [articles] = useState<Article[]>(mockArticles);
  const [plans] = useState<SubscriptionPlan[]>(mockPlans);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  function addToCart(productId: string) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === productId);
      if (existing) {
        return prev.map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { id: Date.now().toString(), product, quantity: 1 }];
    });
  }

  function updateCartQuantity(itemId: string, quantity: number) {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } else {
      setCartItems(prev =>
        prev.map(item => (item.id === itemId ? { ...item, quantity } : item))
      );
    }
  }

  function removeFromCart(itemId: string) {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  }

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const faqs = [
    {
      question: 'How do subscriptions work?',
      answer: 'Subscriptions give you access to premium content and exclusive features. You can choose from monthly or yearly billing and cancel anytime.',
    },
    {
      question: 'Can I become an affiliate?',
      answer: 'Yes! Once you create an account, you can apply to become an affiliate through your dashboard. You\'ll earn commission on every sale you refer.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, and digital wallets through our secure payment processor.',
    },
    {
      question: 'Is there a refund policy?',
      answer: 'Yes, we offer a 30-day money-back guarantee on all products and a pro-rated refund on subscriptions if you cancel within the first week.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-emerald-600" />
              <h1 className="ml-2 text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                MonetizePro
              </h1>
            </div>

            <nav className="hidden md:flex space-x-8">
              <a href="#products" className="text-slate-700 hover:text-emerald-600 transition">Products</a>
              <a href="#content" className="text-slate-700 hover:text-emerald-600 transition">Content</a>
              <a href="#subscriptions" className="text-slate-700 hover:text-emerald-600 transition">Subscriptions</a>
              <a href="#affiliates" className="text-slate-700 hover:text-emerald-600 transition">Affiliates</a>
            </nav>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCart(true)}
                className="relative p-2 text-slate-700 hover:text-emerald-600 transition"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-700"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2">
              <a href="#products" className="block px-4 py-2 text-slate-700 hover:bg-slate-100 rounded">Products</a>
              <a href="#content" className="block px-4 py-2 text-slate-700 hover:bg-slate-100 rounded">Content</a>
              <a href="#subscriptions" className="block px-4 py-2 text-slate-700 hover:bg-slate-100 rounded">Subscriptions</a>
              <a href="#affiliates" className="block px-4 py-2 text-slate-700 hover:bg-slate-100 rounded">Affiliates</a>
            </div>
          )}
        </div>
      </header>

      <main>
        <section className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-5xl font-bold text-slate-900 mb-6">
                Turn Your Passion Into Profit
              </h2>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                The all-in-one platform for creators and entrepreneurs to monetize their expertise through products, content, and subscriptions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-lg font-semibold">
                  Get Started Free
                </button>
                <button className="px-8 py-3 bg-white text-emerald-600 rounded-lg hover:bg-slate-50 transition text-lg font-semibold border-2 border-emerald-600">
                  View Demo
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="products" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-2 bg-emerald-100 rounded-full mb-4">
                <Package className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Premium Products & Services</h3>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Curated offerings designed to accelerate your journey to success
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition group">
                  <div className="aspect-video bg-slate-200 overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full mb-3">
                      {product.category}
                    </span>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">{product.name}</h4>
                    <p className="text-slate-600 mb-4">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-emerald-600">${product.price}</span>
                      <button
                        onClick={() => addToCart(product.id)}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="content" className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-2 bg-teal-100 rounded-full mb-4">
                <BookOpen className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Expert Content & Insights</h3>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Learn from industry leaders and stay ahead of the curve
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {articles.map((article) => (
                <article key={article.id} className="bg-white rounded-xl p-6 hover:shadow-lg transition">
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        article.content_type === 'free'
                          ? 'bg-slate-100 text-slate-700'
                          : article.content_type === 'premium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {article.content_type === 'free' ? 'Free' : article.content_type === 'premium' ? 'Premium' : 'Sponsored'}
                    </span>
                    <span className="text-sm text-slate-500">
                      {new Date(article.published_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">{article.title}</h4>
                  <p className="text-slate-600 mb-4">{article.excerpt}</p>
                  <button className="text-emerald-600 font-semibold hover:text-emerald-700 transition">
                    Read More →
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="subscriptions" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-2 bg-cyan-100 rounded-full mb-4">
                <CreditCard className="h-6 w-6 text-cyan-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Flexible Subscription Plans</h3>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Choose the plan that fits your needs and unlock exclusive benefits
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <div
                  key={plan.id}
                  className={`rounded-xl p-8 ${
                    index === 1
                      ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white transform scale-105 shadow-2xl'
                      : 'bg-white border-2 border-slate-200'
                  }`}
                >
                  <h4 className={`text-2xl font-bold mb-2 ${index === 1 ? 'text-white' : 'text-slate-900'}`}>
                    {plan.name}
                  </h4>
                  <p className={`mb-6 ${index === 1 ? 'text-emerald-50' : 'text-slate-600'}`}>
                    {plan.description}
                  </p>
                  <div className="mb-6">
                    <span className={`text-4xl font-bold ${index === 1 ? 'text-white' : 'text-slate-900'}`}>
                      ${plan.price}
                    </span>
                    <span className={index === 1 ? 'text-emerald-50' : 'text-slate-600'}>
                      /{plan.billing_interval}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className={`flex items-start ${index === 1 ? 'text-emerald-50' : 'text-slate-600'}`}>
                        <svg
                          className={`h-5 w-5 mr-2 flex-shrink-0 ${index === 1 ? 'text-emerald-200' : 'text-emerald-600'}`}
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition ${
                      index === 1
                        ? 'bg-white text-emerald-600 hover:bg-emerald-50'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="affiliates" className="py-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-2 bg-emerald-600 rounded-full mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Join Our Affiliate Program</h3>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Earn generous commissions by promoting products you believe in
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-slate-800 rounded-xl p-8">
                <div className="text-4xl font-bold text-emerald-400 mb-2">30%</div>
                <p className="text-slate-300">Commission Rate</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-8">
                <div className="text-4xl font-bold text-emerald-400 mb-2">90 Days</div>
                <p className="text-slate-300">Cookie Duration</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-8">
                <div className="text-4xl font-bold text-emerald-400 mb-2">$50</div>
                <p className="text-slate-300">Minimum Payout</p>
              </div>
            </div>
            <div className="text-center mt-12">
              <button className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-lg font-semibold">
                Become an Affiliate
              </button>
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition"
                  >
                    <span className="font-semibold text-slate-900">{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-slate-500 transition-transform ${
                        expandedFaq === index ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                      <p className="text-slate-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <TrendingUp className="h-6 w-6 text-emerald-400" />
                <span className="ml-2 text-xl font-bold">MonetizePro</span>
              </div>
              <p className="text-slate-400">Empowering creators to build sustainable income streams.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-emerald-400 transition">Digital Products</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Courses</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Services</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-emerald-400 transition">About Us</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Careers</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-emerald-400 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2025 MonetizePro. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {showCart && (
        <CartSidebar
          items={cartItems}
          onClose={() => setShowCart(false)}
          onUpdateQuantity={updateCartQuantity}
          onRemove={removeFromCart}
        />
      )}
    </div>
  );
}

export default App;
