import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { Search, ArrowRight, Star, Shield, Heart, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { listings } = useApp();

  const categories = [
    {
      name: 'Electronics',
      icon: '📱',
      count: listings.filter(l => l.category === 'Electronics').length,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      name: 'Fashion',
      icon: '👗',
      count: listings.filter(l => l.category === 'Fashion').length,
      color: 'bg-pink-100 text-pink-800'
    },
    {
      name: 'Tools',
      icon: '🔧',
      count: listings.filter(l => l.category === 'Tools').length,
      color: 'bg-orange-100 text-orange-800'
    },
    {
      name: 'Culture',
      icon: '🎨',
      count: listings.filter(l => l.isVaultItem).length,
      color: 'bg-purple-100 text-purple-800'
    }
  ];

  const featuredListings = listings.slice(0, 3);

  return (
    <div className="bg-white font-['Inter','Poppins',sans-serif]">
      {/* Hero Section */}
      <section className="relative bg-white text-gray-900 overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(120deg, #fff 60%, #FFD70011 100%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 flex flex-col items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold mb-6 text-center leading-tight tracking-tight"
          >
            Rent - <span className="text-[#FFD700] drop-shadow">what you need</span>
            <br />
            Share - <span className="text-[#FFD700] drop-shadow">what you don't</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-xl lg:text-2xl mb-8 text-gray-600 max-w-2xl mx-auto text-center"
          >
            Discover unique items from your community. From everyday essentials to rare treasures, everything you need is just a click away.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12 w-full sm:w-auto"
          >
            <Link
              to="/listings"
              className="bg-[#FFD700] text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg shadow-md hover:bg-yellow-400 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2"
            >
              <Search className="w-5 h-5" />
              <span>Start Renting</span>
            </Link>
            <Link
              to={user ? "/add-listing" : "/login"}
              className="bg-white border-2 border-[#FFD700] text-[#FFD700] px-8 py-4 rounded-xl font-semibold text-lg shadow-md hover:bg-[#FFD700] hover:text-white transition-all transform hover:scale-105 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2"
            >
              <span>List Your Item</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto w-full"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-[#FFD700] drop-shadow">10K+</div>
              <div className="text-gray-500 text-base sm:text-lg">Items Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#FFD700] drop-shadow">5K+</div>
              <div className="text-gray-500 text-base sm:text-lg">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#FFD700] drop-shadow">50+</div>
              <div className="text-gray-500 text-base sm:text-lg">Cities</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="py-16 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Explore Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From tech gadgets to vintage treasures, find exactly what you're looking for
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <motion.div
                key={category.name}
                whileHover={{ scale: 1.06, boxShadow: '0 8px 32px 0 rgba(255,215,0,0.15)' }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Link
                  to={`/listings?category=${category.name.toLowerCase()}`}
                  className="bg-white rounded-2xl p-6 text-center shadow-md border border-gray-100 hover:shadow-lg transition-all"
                >
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-[#FFD700] text-white">
                    {category.count} items
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Featured Listings */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="py-16 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Featured Items
              </h2>
              <p className="text-xl text-gray-600">
                Hand-picked items from our community
              </p>
            </div>
            <Link
              to="/listings"
              className="text-[#FFD700] hover:text-yellow-600 font-semibold flex items-center space-x-2"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredListings.map((listing, idx) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * idx }}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"
              >
                <Link
                  to={`/listings/${listing.id}`}
                  className="block"
                >
                  <div className="relative">
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {listing.isVaultItem && (
                      <div className="absolute top-3 left-3 bg-[#FFD700] text-white px-2 py-1 rounded-full text-xs font-semibold shadow">
                        Vault Item
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1 shadow">
                      <Star className="w-3 h-3 text-[#FFD700] fill-current" />
                      <span className="text-xs font-semibold">{listing.rating}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#FFD700] transition-colors">
                      {listing.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {listing.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-1">
                        <span className="text-2xl font-bold text-gray-900">₹{listing.price}</span>
                        <span className="text-gray-500">/{listing.priceUnit}</span>
                      </div>
                      <span className="text-gray-500 text-sm">{listing.location}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Cultural Vault Preview */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="py-16 bg-gradient-to-r from-white via-yellow-100 to-yellow-200 text-gray-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              The Cultural Vault
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover rare and unique items with fascinating stories. Each piece in our vault 
              carries history, culture, and extraordinary experiences.
            </p>
          </div>
          <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-md">
            <div className="text-6xl mb-4">🏛️</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Curated Treasures</h3>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              From vintage cameras used by famous photographers to designer pieces worn by celebrities, 
              explore items that tell incredible stories.
            </p>
            <Link
              to="/cultural-vault"
              className="bg-[#FFD700] text-white px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400 transition-colors inline-flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2"
            >
              <span>Explore the Vault</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="py-16 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How Circlo Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, safe, and secure. Start renting or lending in just a few clicks.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(255,215,0,0.10)' }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="text-center bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 bg-[#FFD700] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-[#FFD700]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Browse & Discover</h3>
              <p className="text-gray-600">
                Explore thousands of items from your local community. Use filters to find exactly what you need.
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(255,215,0,0.10)' }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="text-center bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 bg-[#FFD700] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-[#FFD700]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Book Securely</h3>
              <p className="text-gray-600">
                Connect with item owners, check availability, and book with confidence. All transactions are protected.
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(255,215,0,0.10)' }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="text-center bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 bg-[#FFD700] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-[#FFD700]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Enjoy & Share</h3>
              <p className="text-gray-600">
                Use the item for your project or event, then rate your experience and build community karma.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Trust & Safety */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="py-16 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Built on Trust & Community
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[#FFD700] bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="w-4 h-4 text-[#FFD700]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Verified Users</h3>
                    <p className="text-gray-600">All users are verified through our comprehensive identity and background check process.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[#FFD700] bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Heart className="w-4 h-4 text-[#FFD700]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Karma System</h3>
                    <p className="text-gray-600">Build trust through our karma point system. Great renters and lenders earn rewards and recognition.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[#FFD700] bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="w-4 h-4 text-[#FFD700]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Community Support</h3>
                    <p className="text-gray-600">Join a community that values sharing, sustainability, and meaningful connections.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">🌟</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Join Our Community</h3>
                <p className="text-gray-600">
                  Start building your karma and connecting with amazing people in your neighborhood.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-[#FFD700]">4.9★</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#FFD700]">99%</div>
                  <div className="text-sm text-gray-600">Happy Users</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;