// src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      // Add auth token if available
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return { success: true, data };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async verifyAadhaar(aadhaarData: { aadhaarNumber: string; otp: string }) {
    return this.request('/auth/verify-aadhaar', {
      method: 'POST',
      body: JSON.stringify(aadhaarData),
    });
  }

  // Items/Listings endpoints
  async getListings(params?: {
    category?: string;
    search?: string;
    location?: string;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }
    
    return this.request(`/items?${queryParams.toString()}`);
  }

  async getListing(id: string) {
    return this.request(`/items/${id}`);
  }

  async createListing(listingData: FormData) {
    return this.request('/items', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: listingData,
    });
  }

  async updateListing(id: string, listingData: FormData) {
    return this.request(`/items/${id}`, {
      method: 'PUT',
      headers: {},
      body: listingData,
    });
  }

  async deleteListing(id: string) {
    return this.request(`/items/${id}`, {
      method: 'DELETE',
    });
  }

  // Bookings endpoints
  async createBooking(bookingData: {
    itemId: string;
    startDate: string;
    endDate: string;
    totalAmount: number;
  }) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getBookings(userId?: string) {
    const endpoint = userId ? `/bookings?userId=${userId}` : '/bookings';
    return this.request(endpoint);
  }

  async updateBooking(id: string, status: 'confirmed' | 'cancelled' | 'completed') {
    return this.request(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Reviews endpoints
  async createReview(reviewData: {
    itemId: string;
    rating: number;
    comment: string;
  }) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async getReviews(itemId: string) {
    return this.request(`/reviews?itemId=${itemId}`);
  }

  // Chat endpoints
  async getChats(userId: string) {
    return this.request(`/chats?userId=${userId}`);
  }

  async getChatMessages(chatId: string) {
    return this.request(`/chats/${chatId}/messages`);
  }

  async sendMessage(chatId: string, message: string) {
    return this.request(`/chats/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // User endpoints
  async getUserProfile(userId: string) {
    return this.request(`/users/${userId}`);
  }

  async updateUserProfile(userId: string, userData: any) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async getUserKarma(userId: string) {
    return this.request(`/users/${userId}/karma`);
  }

  // Cultural Vault endpoints
  async getVaultItems() {
    return this.request('/vault/items');
  }

  async createVaultItem(itemData: FormData) {
    return this.request('/vault/items', {
      method: 'POST',
      headers: {},
      body: itemData,
    });
  }

  // Admin endpoints
  async getAdminStats() {
    return this.request('/admin/stats');
  }

  async getAdminUsers() {
    return this.request('/admin/users');
  }

  async updateUserStatus(userId: string, status: 'active' | 'suspended') {
    return this.request(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Database test
  async testDatabase() {
    return this.request('/test-hana');
  }
}

export const apiService = new ApiService();
export default apiService; 