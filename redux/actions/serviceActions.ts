import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface ServiceContent {
  intro?: string;
  readTime?: string;
  author?: {
    name?: string;
    avatar?: string;
    date?: string;
  };
  mainImage?: string;
  fullContent?: string;
}

export interface ServicePayload {
  title: string;
  description: string;
  image: string;
  categories: string[];
  company: string;
  subtitle?: string;
  fullDescription?: string;
  tag?: string;
  content: ServiceContent;
  companyId?: string;
}

export interface UpdateServicePayload extends Partial<ServicePayload> {
  id: string;
}

export interface CategoryPayload {
  id: string;
  name: string;
  companyId?: string;
}

export interface UpdateCategoryPayload extends CategoryPayload {
  categoryId: string;
}

// ==================== SERVICE ACTIONS ====================

// Get all services
export const getAllServices = createAsyncThunk(
  "service/getAllServices",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${server}/services`);
      return data.services;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Servisler alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get company services
export const getCompanyServices = createAsyncThunk(
  "service/getCompanyServices",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.get(`${server}/services/company`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.services;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Şirket servisleri alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get services by company ID
export const getServicesByCompany = createAsyncThunk(
  "service/getServicesByCompany",
  async (companyId: string, thunkAPI) => {
    try {
      const { data } = await axios.get(`${server}/services?companyId=${companyId}`);
      return data.services;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Şirket servisleri alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single service
export const getSingleService = createAsyncThunk(
  "service/getSingleService",
  async (id: string, thunkAPI) => {
    try {
      const { data } = await axios.get(`${server}/services/${id}`);
      return data.service;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Servis alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create service
export const createService = createAsyncThunk(
  "service/createService",
  async (serviceData: ServicePayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.post(`${server}/services`, serviceData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.service;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Servis oluşturulamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update service
export const updateService = createAsyncThunk(
  "service/updateService",
  async ({ id, ...serviceData }: UpdateServicePayload, thunkAPI) => {
    try {
      // ID kontrolü yapılıyor
      if (!id) {
        return thunkAPI.rejectWithValue("Servis ID'si geçersiz");
      }
      
      // MongoDB ObjectId formatı için kontrol (24 karakter hexadecimal)
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
      if (!isValidObjectId) {
        console.warn(`Geçersiz MongoDB ObjectId formatı: ${id}`);
      }
      
      
      // Token kontrolü
      let token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("Token bulunamadı, kullanıcı oturumu geçersiz olabilir");
        return thunkAPI.rejectWithValue("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.");
      }
      
      try {
        const { data } = await axios.put(`${server}/services/${id}`, serviceData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        return data.service;
      } catch (error: any) {
        // 403 Forbidden hatası için özel mesaj
        if (error.response?.status === 403) {
          console.error("Yetki hatası:", error.response.data);
          return thunkAPI.rejectWithValue("Bu işlemi yapmak için yetkiniz yok. Servis başka bir şirkete ait olabilir veya yeterli yetkiniz olmayabilir.");
        }
        
        // 401 Unauthorized hatası için token yenileme denemesi yapılabilir
        if (error.response?.status === 401) {
          console.error("Oturum hatası:", error.response.data);
          return thunkAPI.rejectWithValue("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.");
        }
        
        throw error; // Diğer hataları yukarı taşı
      }
    } catch (error: any) {
      console.error("Servis güncelleme hatası:", error.response?.data || error.message);
      const message = error.response?.data?.message || 'Servis güncellenemedi';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete service
export const deleteService = createAsyncThunk(
  "service/deleteService",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${server}/services/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Servis silinemedi';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ==================== CATEGORY ACTIONS ====================

// Get all categories
export const getAllCategories = createAsyncThunk(
  "service/getAllCategories",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${server}/services/categories`);
      return data.categories;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Kategoriler alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get company categories
export const getCompanyCategories = createAsyncThunk(
  "service/getCompanyCategories",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.get(`${server}/services/categories/company`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.categories;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Şirket kategorileri alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get categories by company ID
export const getCategoriesByCompany = createAsyncThunk(
  "service/getCategoriesByCompany",
  async (companyId: string, thunkAPI) => {
    try {
      const { data } = await axios.get(`${server}/services/categories?companyId=${companyId}`);
      return data.categories;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Şirket kategorileri alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create category
export const createCategory = createAsyncThunk(
  "service/createCategory",
  async (categoryData: CategoryPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.post(`${server}/services/categories`, categoryData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.category;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Kategori oluşturulamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update category
export const updateCategory = createAsyncThunk(
  "service/updateCategory",
  async ({ categoryId, ...categoryData }: UpdateCategoryPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.put(`${server}/services/categories/${categoryId}`, categoryData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.category;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Kategori güncellenemedi';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete category
export const deleteCategory = createAsyncThunk(
  "service/deleteCategory",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${server}/services/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Kategori silinemedi';
      return thunkAPI.rejectWithValue(message);
    }
  }
); 