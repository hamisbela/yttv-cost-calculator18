import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { Youtube, Search } from 'lucide-react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import BlogPreview from './components/BlogPreview';
import ScrollToTop from './components/ScrollToTop';
import Sitemap from './components/Sitemap';
import SearchBar from './components/SearchBar';
import siteConfig from './config/site';

interface AddOnPackage {
  id: string;
  name: string;
  price: number;
  description: string;
}

function App() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedState, setSelectedState] = useState('California (7.25%)');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const BASE_PLAN_PRICE = 72.99;
  const TAX_RATE = 0.0725;

  const addOnPackages: AddOnPackage[] = [
    {
      id: '4k-plus',
      name: '4K Plus',
      price: 9.99,
      description: 'Watch select content in 4K resolution, plus unlimited streams at home.',
    },
    {
      id: 'spanish-plus',
      name: 'Spanish Plus',
      price: 14.99,
      description: 'Get Spanish language channels and content.',
    },
    {
      id: 'sports-plus',
      name: 'Sports Plus',
      price: 10.99,
      description: 'Additional sports channels like NFL RedZone, Fox College Sports, and more.',
    },
    {
      id: 'entertainment-plus',
      name: 'Entertainment Plus',
      price: 29.99,
      description: 'Bundle of HBO Max, Showtime, and Starz.',
    },
  ];

  const calculateSubtotal = () => {
    const addOnsTotal = selectedAddOns.reduce((total, addOnId) => {
      const addOn = addOnPackages.find(pkg => pkg.id === addOnId);
      return total + (addOn?.price || 0);
    }, 0);
    return BASE_PLAN_PRICE + addOnsTotal;
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return (
    <Router>
      <HelmetProvider>
        <ScrollToTop />
        <div className="min-h-screen bg-gray-50">
          <Helmet>
            <title>{siteConfig.title}</title>
            <meta name="description" content={siteConfig.description} />
            <meta property="og:title" content={siteConfig.title} />
            <meta property="og:description" content={siteConfig.description} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={siteConfig.siteUrl} />
            <link rel="canonical" href={siteConfig.siteUrl} />
          </Helmet>

          <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <Link to="/" className="flex items-center">
                    <Youtube className="h-8 w-8 text-red-600 mr-2" />
                    <span className="font-bold text-xl">YouTube TV Calculator</span>
                  </Link>
                </div>
                <div className="flex items-center">
                  <div className="hidden md:block mr-4">
                    <SearchBar compact={true} />
                  </div>
                  <Link 
                    to="/blog" 
                    className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Blog
                  </Link>
                  <Link 
                    to="/sitemap" 
                    className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Sitemap
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          <Routes>
            <Route path="/blog" element={<BlogList />} />
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="/" element={
              <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <Youtube className="h-8 w-8 text-red-600 mr-2" />
                      <h1 className="text-2xl font-bold text-gray-900">YouTube TV Subscription Calculator</h1>
                    </div>
                    <div className="hidden md:block">
                      <SearchBar compact={true} />
                    </div>
                  </div>

                  <p className="text-gray-600 mb-8">
                    Select your preferred YouTube TV subscription plan and any add-on packages you'd like to include. 
                    The calculator will show you the total monthly cost including applicable taxes.
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            <button
                              className={`px-4 py-2 rounded-md ${
                                billingCycle === 'monthly' 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                              onClick={() => setBillingCycle('monthly')}
                            >
                              Monthly
                            </button>
                            <button
                              className={`px-4 py-2 rounded-md ${
                                billingCycle === 'yearly' 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                              onClick={() => setBillingCycle('yearly')}
                            >
                              Yearly
                            </button>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-700 mr-2">State:</span>
                            <select
                              className="form-select rounded-md border-gray-300"
                              value={selectedState}
                              onChange={(e) => setSelectedState(e.target.value)}
                            >
                              <option>California (7.25%)</option>
                              {/* Add more states as needed */}
                            </select>
                          </div>
                        </div>

                        <div className="mb-8">
                          <h2 className="text-xl font-semibold mb-4">Base Plan</h2>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-lg font-medium">YouTube TV Base Plan</h3>
                              <span className="text-lg font-semibold">${BASE_PLAN_PRICE}/month</span>
                            </div>
                            <p className="text-gray-600">
                              Watch major broadcast and cable networks, plus unlimited DVR space.
                            </p>
                          </div>
                        </div>

                        <div>
                          <h2 className="text-xl font-semibold mb-4">Add-on Packages</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {addOnPackages.map((pkg) => (
                              <div 
                                key={pkg.id}
                                className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer"
                                onClick={() => {
                                  setSelectedAddOns(prev => 
                                    prev.includes(pkg.id) 
                                      ? prev.filter(id => id !== pkg.id)
                                      : [...prev, pkg.id]
                                  );
                                }}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={selectedAddOns.includes(pkg.id)}
                                      onChange={() => {}}
                                      className="h-4 w-4 text-blue-600 rounded"
                                    />
                                    <h3 className="ml-2 text-lg font-medium">{pkg.name}</h3>
                                  </div>
                                  <span className="text-lg font-semibold">${pkg.price}/month</span>
                                </div>
                                <p className="text-gray-600 ml-6">{pkg.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-1">
                      <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
                        <h2 className="text-xl font-semibold mb-4">Your Subscription</h2>
                        <div className="mb-6">
                          <h3 className="text-lg font-medium mb-4">Cost Summary</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span>YouTube TV Base Plan</span>
                              <span>${BASE_PLAN_PRICE.toFixed(2)}</span>
                            </div>
                            {selectedAddOns.map((addOnId) => {
                              const addOn = addOnPackages.find(pkg => pkg.id === addOnId);
                              return (
                                <div key={addOnId} className="flex justify-between">
                                  <span>{addOn?.name}</span>
                                  <span>${addOn?.price.toFixed(2)}</span>
                                </div>
                              );
                            })}
                            <div className="flex justify-between pt-3 border-t">
                              <span>Subtotal</span>
                              <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                              <span>Tax ({(TAX_RATE * 100).toFixed(2)}%)</span>
                              <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between pt-3 border-t font-semibold text-lg">
                              <span>Total</span>
                              <span className="text-blue-600">${total.toFixed(2)}</span>
                            </div>
                            <div className="text-gray-500 text-sm text-right">
                              per month
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-16">
                    <BlogPreview />
                  </div>
                  
                  <div className="mt-16 pt-8 border-t border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Site Links</h2>
                    <Sitemap compact={true} />
                  </div>
                </div>
              </div>
            } />
            {/* This should be the last route for catching blog posts */}
            <Route path="/:slug" element={<BlogPostWrapper />} />
          </Routes>
        </div>
      </HelmetProvider>
    </Router>
  );
}

// Wrapper for blog posts to handle proper routing
function BlogPostWrapper() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const path = location.pathname;
  
  // Exclude specific paths that have their own routes
  if (path === '/blog' || path === '/sitemap' || path === '/sitemap.xml') {
    return <Navigate to={path} replace />;
  }
  
  // If there's a page parameter, likely it's a request for a paginated blog route
  if (searchParams.has('page') && path === '/') {
    return <Navigate to={`/blog?${searchParams.toString()}`} replace />;
  }
  
  return <BlogPost />;
}

export default App;