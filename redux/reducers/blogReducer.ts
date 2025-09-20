import { createReducer } from "@reduxjs/toolkit";
import {
  getAllBlogs,
  getSingleBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getAllCategories,
  createGlobalCategory,
  deleteGlobalCategory,
  addCategory,
  deleteCategory,
  getAllAuthors,
  createGlobalAuthor,
  updateGlobalAuthor,
  deleteGlobalAuthor
} from "../actions/blogActions";

interface BlogState {
  blogs: any[];
  blog: any;
  categories: string[];
  authors: any[];
  loading: boolean;
  categoryLoading: boolean;
  authorLoading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
}

const initialState: BlogState = {
  blogs: [],
  blog: {},
  categories: [],
  authors: [],
  loading: false,
  categoryLoading: false,
  authorLoading: false,
  error: null,
  success: false,
  message: null
};

export const blogReducer = createReducer(initialState, (builder) => {
  builder
    // Get All Blogs
    .addCase(getAllBlogs.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getAllBlogs.fulfilled, (state, action) => {
      state.loading = false;
      state.blogs = action.payload;
      state.error = null;
    })
    .addCase(getAllBlogs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Get All Categories
    .addCase(getAllCategories.pending, (state) => {
      state.categoryLoading = true;
      state.error = null;
    })
    .addCase(getAllCategories.fulfilled, (state, action) => {
      state.categoryLoading = false;
      state.categories = action.payload;
      state.error = null;
    })
    .addCase(getAllCategories.rejected, (state, action) => {
      state.categoryLoading = false;
      state.error = action.payload as string;
    })
    
    // Get All Authors
    .addCase(getAllAuthors.pending, (state) => {
      state.authorLoading = true;
      state.error = null;
    })
    .addCase(getAllAuthors.fulfilled, (state, action) => {
      state.authorLoading = false;
      state.authors = action.payload;
      state.error = null;
    })
    .addCase(getAllAuthors.rejected, (state, action) => {
      state.authorLoading = false;
      state.error = action.payload as string;
    })
    
    // Create Global Category
    .addCase(createGlobalCategory.pending, (state) => {
      state.categoryLoading = true;
      state.error = null;
    })
    .addCase(createGlobalCategory.fulfilled, (state, action) => {
      state.categoryLoading = false;
      state.categories = [...state.categories, action.payload];
      state.success = true;
      state.message = "Kategori başarıyla oluşturuldu";
      state.error = null;
    })
    .addCase(createGlobalCategory.rejected, (state, action) => {
      state.categoryLoading = false;
      state.error = action.payload as string;
      state.success = false;
    })
    
    // Create Global Author
    .addCase(createGlobalAuthor.pending, (state) => {
      state.authorLoading = true;
      state.error = null;
    })
    .addCase(createGlobalAuthor.fulfilled, (state, action) => {
      state.authorLoading = false;
      state.authors = [...state.authors, action.payload];
      state.success = true;
      state.message = "Yazar başarıyla oluşturuldu";
      state.error = null;
    })
    .addCase(createGlobalAuthor.rejected, (state, action) => {
      state.authorLoading = false;
      state.error = action.payload as string;
      state.success = false;
    })
    
    // Update Global Author
    .addCase(updateGlobalAuthor.pending, (state) => {
      state.authorLoading = true;
      state.error = null;
    })
    .addCase(updateGlobalAuthor.fulfilled, (state, action) => {
      state.authorLoading = false;
      state.authors = state.authors.map(author => 
        author._id === action.payload._id ? action.payload : author
      );
      state.success = true;
      state.message = "Yazar başarıyla güncellendi";
      state.error = null;
    })
    .addCase(updateGlobalAuthor.rejected, (state, action) => {
      state.authorLoading = false;
      state.error = action.payload as string;
      state.success = false;
    })
    
    // Delete Global Category
    .addCase(deleteGlobalCategory.pending, (state) => {
      state.categoryLoading = true;
      state.error = null;
    })
    .addCase(deleteGlobalCategory.fulfilled, (state, action) => {
      state.categoryLoading = false;
      state.categories = state.categories.filter(cat => cat !== action.payload);
      state.success = true;
      state.message = "Kategori başarıyla silindi";
      state.error = null;
    })
    .addCase(deleteGlobalCategory.rejected, (state, action) => {
      state.categoryLoading = false;
      state.error = action.payload as string;
      state.success = false;
    })
    
    // Delete Global Author
    .addCase(deleteGlobalAuthor.pending, (state) => {
      state.authorLoading = true;
      state.error = null;
    })
    .addCase(deleteGlobalAuthor.fulfilled, (state, action) => {
      state.authorLoading = false;
      state.authors = state.authors.filter(author => author._id !== action.payload);
      state.success = true;
      state.message = "Yazar başarıyla silindi";
      state.error = null;
    })
    .addCase(deleteGlobalAuthor.rejected, (state, action) => {
      state.authorLoading = false;
      state.error = action.payload as string;
      state.success = false;
    })
    
    // Add Category to Blog
    .addCase(addCategory.pending, (state) => {
      state.categoryLoading = true;
      state.error = null;
    })
    .addCase(addCategory.fulfilled, (state, action) => {
      state.categoryLoading = false;
      
      // Update the blog in the blogs array
      state.blogs = state.blogs.map(blog => 
        blog._id === action.payload._id ? action.payload : blog
      );
      
      // Update the current blog if it's the one being edited
      if (state.blog._id === action.payload._id) {
        state.blog = action.payload;
      }
      
      state.success = true;
      state.message = "Kategori başarıyla eklendi";
      state.error = null;
    })
    .addCase(addCategory.rejected, (state, action) => {
      state.categoryLoading = false;
      state.error = action.payload as string;
      state.success = false;
    })
    
    // Delete Category from Blog
    .addCase(deleteCategory.pending, (state) => {
      state.categoryLoading = true;
      state.error = null;
    })
    .addCase(deleteCategory.fulfilled, (state, action) => {
      state.categoryLoading = false;
      
      // Update the blog in the blogs array
      state.blogs = state.blogs.map(blog => 
        blog._id === action.payload._id ? action.payload : blog
      );
      
      // Update the current blog if it's the one being edited
      if (state.blog._id === action.payload._id) {
        state.blog = action.payload;
      }
      
      state.success = true;
      state.message = "Kategori başarıyla silindi";
      state.error = null;
    })
    .addCase(deleteCategory.rejected, (state, action) => {
      state.categoryLoading = false;
      state.error = action.payload as string;
      state.success = false;
    })
    
    // Get Single Blog
    .addCase(getSingleBlog.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getSingleBlog.fulfilled, (state, action) => {
      state.loading = false;
      state.blog = action.payload;
      state.error = null;
    })
    .addCase(getSingleBlog.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Create Blog
    .addCase(createBlog.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    })
    .addCase(createBlog.fulfilled, (state, action) => {
      state.loading = false;
      state.blogs = [action.payload, ...state.blogs];
      state.success = true;
      state.message = "Blog başarıyla oluşturuldu";
      state.error = null;
    })
    .addCase(createBlog.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    })
    
    // Update Blog
    .addCase(updateBlog.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    })
    .addCase(updateBlog.fulfilled, (state, action) => {
      state.loading = false;
      state.blogs = state.blogs.map(blog => 
        blog._id === action.payload._id ? action.payload : blog
      );
      if (state.blog._id === action.payload._id) {
        state.blog = action.payload;
      }
      state.success = true;
      state.message = "Blog başarıyla güncellendi";
      state.error = null;
    })
    .addCase(updateBlog.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    })
    
    // Delete Blog
    .addCase(deleteBlog.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    })
    .addCase(deleteBlog.fulfilled, (state, action) => {
      state.loading = false;
      state.blogs = state.blogs.filter(blog => blog._id !== action.payload);
      state.success = true;
      state.message = "Blog başarıyla silindi";
      state.error = null;
    })
    .addCase(deleteBlog.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });
});

export default blogReducer; 