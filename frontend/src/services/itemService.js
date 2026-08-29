import api from './api';
import { MOCK_ITEMS, MOCK_CLAIMS } from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace('/api', '')
  : 'http://127.0.0.1:8000';

// Helper to format full image URL if relative path returned by backend
const formatItemImageUrl = (item) => {
  if (!item) return item;
  if (item.image_url && item.image_url.startsWith('/static/')) {
    return {
      ...item,
      image_url: `${API_BASE_URL}${item.image_url}`
    };
  }
  return item;
};

export const itemService = {
  // Upload image file to backend
  async uploadImage(file) {
    if (!file) return null;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/items/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.image_url;
    } catch (err) {
      console.warn('Image upload failed, proceeding without uploaded file URL:', err);
      return null;
    }
  },

  // Fetch items with optional filter parameters
  async getItems(params = {}) {
    try {
      const response = await api.get('/items', { params });
      if (Array.isArray(response.data)) {
        return response.data.map(formatItemImageUrl);
      }
      return response.data;
    } catch (err) {
      console.warn('Backend API GET /items unreachable, returning mock fallback:', err);
      let filtered = [...MOCK_ITEMS];
      if (params.status) {
        filtered = filtered.filter((i) => i.status === params.status);
      }
      if (params.category) {
        filtered = filtered.filter((i) => i.category === params.category);
      }
      if (params.location) {
        filtered = filtered.filter((i) => i.location === params.location);
      }
      if (params.query) {
        const q = params.query.toLowerCase();
        filtered = filtered.filter(
          (i) =>
            i.item_name.toLowerCase().includes(q) ||
            i.description.toLowerCase().includes(q) ||
            i.location.toLowerCase().includes(q)
        );
      }
      return filtered;
    }
  },

  // Fetch single item by ID
  async getItemById(id) {
    try {
      const response = await api.get(`/items/${id}`);
      return formatItemImageUrl(response.data);
    } catch (err) {
      console.warn(`Backend API GET /items/${id} failed, returning mock fallback:`, err);
      const mock = MOCK_ITEMS.find((i) => i.id === parseInt(id));
      return mock ? formatItemImageUrl(mock) : null;
    }
  },

  // Create Lost Item report (POST /api/items/lost)
  async createLostItem(data, imageFile = null) {
    let uploadedImageUrl = data.image_url || null;
    if (imageFile) {
      const url = await this.uploadImage(imageFile);
      if (url) uploadedImageUrl = url;
    }

    const payload = {
      item_name: data.item_name,
      description: data.description,
      category: data.category,
      location: data.location,
      date: data.date,
      time: data.time || null,
      contact_info: data.contact_info || null,
      reward: data.reward || null,
      image_url: uploadedImageUrl,
    };

    try {
      const response = await api.post('/items/lost', payload);
      return formatItemImageUrl(response.data);
    } catch (err) {
      console.error('Backend POST /items/lost failed:', err);
      throw err;
    }
  },

  // Create Found Item report (POST /api/items/found)
  async createFoundItem(data, imageFile = null) {
    let uploadedImageUrl = data.image_url || null;
    if (imageFile) {
      const url = await this.uploadImage(imageFile);
      if (url) uploadedImageUrl = url;
    }

    const payload = {
      item_name: data.item_name,
      description: data.description,
      category: data.category,
      location: data.location,
      date: data.date,
      time: data.time || null,
      storage_location: data.storage_location || null,
      verification_question: data.verification_question || null,
      image_url: uploadedImageUrl,
    };

    try {
      const response = await api.post('/items/found', payload);
      return formatItemImageUrl(response.data);
    } catch (err) {
      console.error('Backend POST /items/found failed:', err);
      throw err;
    }
  },

  // Submit claim for item (POST /api/items/{id}/claims)
  async submitClaim(itemId, claimData) {
    try {
      const response = await api.post(`/items/${itemId}/claims`, claimData);
      return response.data;
    } catch (err) {
      console.error(`Backend POST /items/${itemId}/claims failed:`, err);
      throw err;
    }
  },

  // Fetch claims (GET /api/claims)
  async getClaims() {
    try {
      const response = await api.get('/claims');
      return response.data;
    } catch (err) {
      console.warn('Backend GET /claims failed, returning mock claims:', err);
      return MOCK_CLAIMS;
    }
  },

  // Update claim status (PUT /api/claims/{id})
  async updateClaimStatus(claimId, status) {
    try {
      const response = await api.put(`/claims/${claimId}`, { status });
      return response.data;
    } catch (err) {
      console.error(`Backend PUT /claims/${claimId} failed:`, err);
      throw err;
    }
  },

  // Update item details/status (PUT /api/items/{id})
  async updateItem(itemId, updateData) {
    try {
      const response = await api.put(`/items/${itemId}`, updateData);
      return formatItemImageUrl(response.data);
    } catch (err) {
      console.error(`Backend PUT /items/${itemId} failed:`, err);
      throw err;
    }
  },

  // Delete item (DELETE /api/items/{id})
  async deleteItem(itemId) {
    try {
      const response = await api.delete(`/items/${itemId}`);
      return response.data;
    } catch (err) {
      console.error(`Backend DELETE /items/${itemId} failed:`, err);
      throw err;
    }
  }
};
