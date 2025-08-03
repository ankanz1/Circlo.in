import React from 'react';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassButton } from '../components/GlassComponents';

const CartPage: React.FC = () => {
  // This is a placeholder - you can implement cart functionality later
  const cartItems: any[] = [];

  return (
    <div className="min-h-screen gradient-bg py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <ShoppingCart className="w-12 h-12 text-circlo-yellow mx-auto mb-4" />
          <h1 className="text-4xl font-display font-bold text-circlo-black mb-4">
            Shopping Cart
          </h1>
          <p className="text-lg text-circlo-black/70">
            Review your selected items before checkout
          </p>
        </motion.div>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card text-center py-16"
          >
            <ShoppingCart className="w-16 h-16 text-circlo-black/30 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-circlo-black mb-4">
              Your cart is empty
            </h2>
            <p className="text-circlo-black/60 mb-8">
              Discover amazing items from our community and add them to your cart.
            </p>
            <GlassButton 
              size="lg" 
              className="bg-gradient-gold text-circlo-black font-semibold"
              onClick={() => window.location.href = '/listings'}
            >
              Start Shopping
            </GlassButton>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Cart items will be rendered here when implemented */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glass-card p-6"
            >
              <h2 className="text-xl font-semibold text-circlo-black mb-4">
                Cart Summary
              </h2>
              <div className="flex justify-between items-center text-lg font-semibold text-circlo-black">
                <span>Total: $0.00</span>
                <GlassButton 
                  size="lg" 
                  className="bg-gradient-gold text-circlo-black font-bold"
                >
                  Proceed to Checkout
                </GlassButton>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;