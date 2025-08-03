import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import SmoothScrollProvider from './components/SmoothScrollProvider';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AddListingPage from './pages/AddListingPage';
import DashboardPage from './pages/DashboardPage';
import CulturalVaultPage from './pages/CulturalVaultPage';
import ChatPage from './pages/ChatPage';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import ReturnAnalysisPage from './pages/ReturnAnalysisPage';
import CartPage from './pages/CartPage';
import ChatHubPage from './pages/ChatHubPage';

function App() {
  return (
    <SmoothScrollProvider>
      <Router>
        <AuthProvider>
          <AppProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/listings" element={<ListingsPage />} />
                <Route path="/listings/:id" element={<ProductDetailPage />} />
                <Route path="/add-listing" element={<AddListingPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/cultural-vault" element={<CulturalVaultPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/chat/:threadId" element={<ChatPage />} />
                <Route path="/chat-hub" element={<ChatHubPage />} />
                <Route path="/booking/:id" element={<BookingPage />} />
                <Route path="/return/:id" element={<ReturnAnalysisPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </Layout>
          </AppProvider>
        </AuthProvider>
      </Router>
    </SmoothScrollProvider>
  );
}

export default App;