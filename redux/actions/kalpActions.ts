import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface AdditionalSection {
  title?: string;
  description?: string;
  image?: string;
  order?: number;
  blogCategory?: string;
}

export interface KalpContent {
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
  additionalSections?: AdditionalSection[];
}

export interface KalpPayload {
  title: string;
  description: string;
  image: string;
  content: KalpContent;
  companyId?: string;
}

export interface UpdateKalpPayload extends Partial<KalpPayload> {
  id: string;
}

// ==================== KALP ACTIONS ====================

// Get all kalpler
export const getAllKalpler = createAsyncThunk(
  "kalp/getAllKalpler",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${server}/kalp`);
      return data.kalpler;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Kalpler alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get company kalpler
export const getCompanyKalpler = createAsyncThunk(
  "kalp/getCompanyKalpler",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.get(`${server}/kalp/company`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.kalpler;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Şirket kalpleri alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get kalpler by company ID
export const getKalplerByCompany = createAsyncThunk(
  "kalp/getKalplerByCompany",
  async (companyId: string, thunkAPI) => {
    try {
      const { data } = await axios.get(`${server}/kalp?companyId=${companyId}`);
      return data.kalpler;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Şirket kalpleri alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single kalp
export const getSingleKalp = createAsyncThunk(
  "kalp/getSingleKalp",
  async (id: string, thunkAPI) => {
    try {
      const { data } = await axios.get(`${server}/kalp/${id}`);
      return data.kalp;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Kalp alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create kalp
export const createKalp = createAsyncThunk(
  "kalp/createKalp",
  async (kalpData: KalpPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.post(`${server}/kalp`, kalpData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.kalp;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Kalp oluşturulamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update kalp
export const updateKalp = createAsyncThunk(
  "kalp/updateKalp",
  async ({ id, ...kalpData }: UpdateKalpPayload, thunkAPI) => {
    try {
      // ID kontrolü yapılıyor
      if (!id) {
        return thunkAPI.rejectWithValue("Kalp ID'si geçersiz");
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
        const { data } = await axios.put(`${server}/kalp/${id}`, kalpData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        return data.kalp;
      } catch (error: any) {
        // 403 Forbidden hatası için özel mesaj
        if (error.response?.status === 403) {
          console.error("Yetki hatası:", error.response.data);
          return thunkAPI.rejectWithValue("Bu işlemi yapmak için yetkiniz yok. Kalp başka bir şirkete ait olabilir veya yeterli yetkiniz olmayabilir.");
        }
        
        // 401 Unauthorized hatası için token yenileme denemesi yapılabilir
        if (error.response?.status === 401) {
          console.error("Oturum hatası:", error.response.data);
          return thunkAPI.rejectWithValue("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.");
        }
        
        throw error; // Diğer hataları yukarı taşı
      }
    } catch (error: any) {
      console.error("Kalp güncelleme hatası:", error.response?.data || error.message);
      const message = error.response?.data?.message || 'Kalp güncellenemedi';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete kalp
export const deleteKalp = createAsyncThunk(
  "kalp/deleteKalp",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${server}/kalp/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Kalp silinemedi';
      return thunkAPI.rejectWithValue(message);
    }
  }
);
