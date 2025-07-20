import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Search, Filter, MapPin, Star, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const ListingsPage: React.FC = () => {
  const { listings, searchQuery, setSearchQuery } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [locationFilter, setLocationFilter] = useState('');

  const categories = ['all', 'electronics', 'fashion', 'tools', 'culture'];

  const filteredAndSortedListings = useMemo(() => {
    let filtered = listings.filter(listing => {
      const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           listing.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
                             listing.category.toLowerCase() === selectedCategory ||
                             (selectedCategory === 'culture' && listing.isVaultItem);
      
      const matchesPrice = (!priceRange.min || listing.price >= parseInt(priceRange.min)) &&
                          (!priceRange.max || listing.price <= parseInt(priceRange.max));
      
      const matchesLocation = !locationFilter || (listing.location || '').toLowerCase().includes(locationFilter.toLowerCase());
      
      return matchesSearch && matchesCategory && matchesPrice && matchesLocation;
    });

    // Sort listings
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return filtered;
  }, [listings, searchQuery, selectedCategory, sortBy, priceRange, locationFilter]);

  return (
    <div className="min-h-screen bg-white font-['Inter','Poppins',sans-serif]">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-sm border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Items</h1>
              <p className="text-gray-600 text-lg">{filteredAndSortedListings.length} items available</p>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all shadow-sm hover:shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:w-72 flex-shrink-0"
          >
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h3 className="text-xl font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-[#FFD700] hover:text-yellow-600 p-2 rounded-lg hover:bg-yellow-50 transition-colors"
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>
              
              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Categories */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Categories</h4>
                  <div className="space-y-3">
                    {categories.map(category => (
                      <label key={category} className="flex items-center cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={selectedCategory === category}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="text-[#FFD700] focus:ring-[#FFD700] border-gray-300"
                        />
                        <span className="ml-3 text-sm text-gray-700 capitalize group-hover:text-[#FFD700] transition-colors">
                          {category === 'all' ? 'All Categories' : category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Price Range</h4>
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all"
                    />
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Sort By</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Location</h4>
                  <input
                    type="text"
                    placeholder="Enter city or area"
                    value={locationFilter}
                    onChange={e => setLocationFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Listings Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1"
          >
            {filteredAndSortedListings.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">No items found</h3>
                <p className="text-gray-600 text-lg">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedListings.map((listing, index) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    whileHover={{ y: -4, boxShadow: '0 8px 32px 0 rgba(255,215,0,0.15)' }}
                    className="group"
                  >
                    <Link
                      to={`/listings/${listing.id}`}
                      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden block"
                    >
                      <div className="relative">
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {listing.isVaultItem && (
                          <div className="absolute top-3 left-3 bg-[#FFD700] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                            Vault Item
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-white bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1 shadow-md">
                          <Star className="w-3 h-3 text-[#FFD700] fill-current" />
                          <span className="text-xs font-semibold">{listing.rating}</span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#FFD700] transition-colors text-lg">
                          {listing.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {listing.description}
                        </p>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-1">
                            <span className="text-2xl font-bold text-gray-900">₹{listing.price}</span>
                            <span className="text-gray-500 text-sm">/{listing.priceUnit}</span>
                          </div>
                          <span className="text-xs text-[#FFD700] bg-yellow-50 px-3 py-1 rounded-full font-medium">
                            {listing.category}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{listing.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>Available</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ListingsPage;