import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface BeforeAfterItem {
  title?: string;
  description?: string;
  beforeImage: string;
  afterImage: string;
  order?: number;
}

export interface LeftRightItem {
  title: string;
  description?: string;
  image: string;
  isRightAligned?: boolean;
  order?: number;
}

export interface GalleryImage {
  title?: string;
  image: string;
  order?: number;
}

export interface HizmetContent {
  intro?: string;
  readTime?: string;
  author?: {
    name?: string;
    avatar?: string;
    date?: string;
  };
  mainImage?: string;
  fullContent?: string;
  bannerSectionTitle?: string;
  bannerSectionDescription?: string;
  bannerSectionImage?: string;
  beforeAfterSectionTitle?: string;
  beforeAfterSectionDescription?: string;
  beforeAfterItems?: BeforeAfterItem[];
  leftRightSectionTitle?: string;
  leftRightItems?: LeftRightItem[];
  gallerySectionTitle?: string;
  gallerySectionDescription?: string;
  galleryImages?: GalleryImage[];
}

export interface HizmetPayload {
  title: string;
  description: string;
  image: string;
  categories: string[];
  company: string;
  subtitle?: string;
  fullDescription?: string;
  tag?: string;
  content: HizmetContent;
  companyId?: string;
}

export interface UpdateHizmetPayload extends Partial<HizmetPayload> {
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

// ==================== HIZMET ACTIONS ====================

// Get all hizmetler
export const getAllHizmetler = createAsyncThunk(
  "hizmet/getAllHizmetler",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${server}/hizmetler`);
      return data.hizmetler;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Hizmetler alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get company hizmetler
export const getCompanyHizmetler = createAsyncThunk(
  "hizmet/getCompanyHizmetler",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.get(`${server}/hizmetler/company`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.hizmetler;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Şirket hizmetleri alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get hizmetler by company ID
export const getHizmetlerByCompany = createAsyncThunk(
  "hizmet/getHizmetlerByCompany",
  async (companyId: string, thunkAPI) => {
    try {
      const { data } = await axios.get(`${server}/hizmetler?companyId=${companyId}`);
      return data.hizmetler;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Şirket hizmetleri alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single hizmet
export const getSingleHizmet = createAsyncThunk(
  "hizmet/getSingleHizmet",
  async (id: string, thunkAPI) => {
    try {
      const { data } = await axios.get(`${server}/hizmetler/${id}`);
      return data.hizmet;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Hizmet alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create hizmet
export const createHizmet = createAsyncThunk(
  "hizmet/createHizmet",
  async (hizmetData: HizmetPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.post(`${server}/hizmetler`, hizmetData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.hizmet;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Hizmet oluşturulamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update hizmet
export const updateHizmet = createAsyncThunk(
  "hizmet/updateHizmet",
  async ({ id, ...hizmetData }: UpdateHizmetPayload, thunkAPI) => {
    try {
      // ID kontrolü yapılıyor
      if (!id) {
        return thunkAPI.rejectWithValue("Hizmet ID'si geçersiz");
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
        const { data } = await axios.put(`${server}/hizmetler/${id}`, hizmetData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        return data.hizmet;
      } catch (error: any) {
        // 403 Forbidden hatası için özel mesaj
        if (error.response?.status === 403) {
          console.error("Yetki hatası:", error.response.data);
          return thunkAPI.rejectWithValue("Bu işlemi yapmak için yetkiniz yok. Hizmet başka bir şirkete ait olabilir veya yeterli yetkiniz olmayabilir.");
        }
        
        // 401 Unauthorized hatası için token yenileme denemesi yapılabilir
        if (error.response?.status === 401) {
          console.error("Oturum hatası:", error.response.data);
          return thunkAPI.rejectWithValue("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.");
        }
        
        throw error; // Diğer hataları yukarı taşı
      }
    } catch (error: any) {
      console.error("Hizmet güncelleme hatası:", error.response?.data || error.message);
      const message = error.response?.data?.message || 'Hizmet güncellenemedi';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete hizmet
export const deleteHizmet = createAsyncThunk(
  "hizmet/deleteHizmet",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${server}/hizmetler/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Hizmet silinemedi';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ==================== CATEGORY ACTIONS ====================

// Get all categories
export const getAllCategories = createAsyncThunk(
  "hizmet/getAllCategories",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${server}/hizmetler/categories`);
      return data.categories;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Kategoriler alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get company categories
export const getCompanyCategories = createAsyncThunk(
  "hizmet/getCompanyCategories",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.get(`${server}/hizmetler/categories/company`, {
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
  "hizmet/getCategoriesByCompany",
  async (companyId: string, thunkAPI) => {
    try {
      const { data } = await axios.get(`${server}/hizmetler/categories?companyId=${companyId}`);
      return data.categories;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Şirket kategorileri alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create category
export const createCategory = createAsyncThunk(
  "hizmet/createCategory",
  async (categoryData: CategoryPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.post(`${server}/hizmetler/categories`, categoryData, {
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
  "hizmet/updateCategory",
  async ({ categoryId, ...categoryData }: UpdateCategoryPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.put(`${server}/hizmetler/categories/${categoryId}`, categoryData, {
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
  "hizmet/deleteCategory",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${server}/hizmetler/categories/${id}`, {
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