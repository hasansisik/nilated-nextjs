import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface BlogContent {
  intro: string;
  readTime?: string;
  author: {
    name: string;
    avatar?: string;
    date?: string;
  };
  mainImage?: string;
  fullContent: string;
}

export interface BlogPayload {
  title: string;
  image: string;
  description: string;
  category: string[];
  author: string;
  date?: string;
  content: BlogContent;
  link?: string;
  premium?: boolean;
  companyId?: string;
}

export interface UpdateBlogPayload extends Partial<BlogPayload> {
  id: string;
}

export interface BlogFilterParams {
  category?: string;
  author?: string;
  companyId?: string;
}

export interface Author {
  _id: string;
  name: string;
  avatar: string;
  bio?: string;
  companyId: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAuthorPayload {
  name: string;
  avatar?: string;
  bio?: string;
}

export interface UpdateAuthorPayload extends Partial<CreateAuthorPayload> {
  id: string;
}

// Get all blogs
export const getAllBlogs = createAsyncThunk(
  "blog/getAllBlogs",
  async (params?: BlogFilterParams, thunkAPI) => {
    try {
      // Build query string based on filter params
      let queryString = '';
      
      if (params) {
        const queryParams = new URLSearchParams();
        if (params.category) queryParams.append('category', params.category);
        if (params.author) queryParams.append('author', params.author);
        if (params.companyId) queryParams.append('companyId', params.companyId);
        
        queryString = queryParams.toString();
        if (queryString) queryString = `?${queryString}`;
      }
      
      const { data } = await axios.get(`${server}/blogs${queryString}`);
      return data.blogs;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Bloglar alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get company blogs
export const getCompanyBlogs = createAsyncThunk(
  "blog/getCompanyBlogs",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.get(`${server}/blogs/company/blogs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.blogs;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Şirket blogları alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get blogs by company ID
export const getBlogsByCompany = createAsyncThunk(
  "blog/getBlogsByCompany",
  async (companyId: string, thunkAPI) => {
    try {
      const { data } = await axios.get(`${server}/blogs?companyId=${companyId}`);
      return data.blogs;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Şirket blogları alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single blog
export const getSingleBlog = createAsyncThunk(
  "blog/getSingleBlog",
  async (id: string, thunkAPI) => {
    try {
      const { data } = await axios.get(`${server}/blogs/${id}`);
      return data.blog;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Blog alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create blog
export const createBlog = createAsyncThunk(
  "blog/createBlog",
  async (blogData: BlogPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.post(`${server}/blogs`, blogData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.blog;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Blog oluşturulamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update blog
export const updateBlog = createAsyncThunk(
  "blog/updateBlog",
  async ({ id, ...blogData }: UpdateBlogPayload, thunkAPI) => {
    try {
      
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.put(`${server}/blogs/${id}`, blogData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.blog;
    } catch (error: any) {
      console.error('updateBlog thunk - Error:', error.response?.data || error.message);
      const message = error.response?.data?.message || 'Blog güncellenemedi';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete blog
export const deleteBlog = createAsyncThunk(
  "blog/deleteBlog",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${server}/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Blog silinemedi';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all categories
export const getAllCategories = createAsyncThunk(
  "blog/getAllCategories",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${server}/blogs/categories`);
      return data.categories;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Kategoriler alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create a global category
export const createGlobalCategory = createAsyncThunk(
  "blog/createGlobalCategory",
  async (name: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.post(
        `${server}/blogs/categories`, 
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data.category;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Kategori oluşturulamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete a global category
export const deleteGlobalCategory = createAsyncThunk(
  "blog/deleteGlobalCategory",
  async (category: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${server}/blogs/categories/${encodeURIComponent(category)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return category;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Kategori silinemedi';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add a category to a blog post
export const addCategory = createAsyncThunk(
  "blog/addCategory",
  async ({ blogId, category }: { blogId: string, category: string }, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.post(
        `${server}/blogs/${blogId}/categories`, 
        { category },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data.blog;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Kategori eklenemedi';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete a category from a blog post
export const deleteCategory = createAsyncThunk(
  "blog/deleteCategory",
  async ({ blogId, category }: { blogId: string, category: string }, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.delete(
        `${server}/blogs/${blogId}/categories/${encodeURIComponent(category)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data.blog;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Kategori silinemedi';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all authors
export const getAllAuthors = createAsyncThunk(
  "blog/getAllAuthors",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.get(`${server}/blogs/authors`, {
        headers: token ? {
          Authorization: `Bearer ${token}`,
        } : {},
      });
      return data.authors;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Yazarlar alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create a global author
export const createGlobalAuthor = createAsyncThunk(
  "blog/createGlobalAuthor",
  async (authorData: CreateAuthorPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.post(
        `${server}/blogs/authors`, 
        authorData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data.author;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Yazar oluşturulamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update a global author
export const updateGlobalAuthor = createAsyncThunk(
  "blog/updateGlobalAuthor",
  async ({ id, ...authorData }: UpdateAuthorPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.put(
        `${server}/blogs/authors/${id}`, 
        authorData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data.author;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Yazar güncellenemedi';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete a global author
export const deleteGlobalAuthor = createAsyncThunk(
  "blog/deleteGlobalAuthor",
  async (authorId: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${server}/blogs/authors/${authorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return authorId;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Yazar silinemedi';
      return thunkAPI.rejectWithValue(message);
    }
  }
); 