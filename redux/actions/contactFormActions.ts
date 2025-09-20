import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface ContactFormData {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt?: string;
}

// Create a new contact form submission
export const createContactForm = createAsyncThunk(
  "contactForm/createContactForm",
  async (formData: ContactFormData, thunkAPI) => {
    try {
      const { data } = await axios.post(`${server}/contact-form`, formData);
      return data.contactForm;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Form gönderilemedi';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all contact form submissions
export const getAllContactForms = createAsyncThunk(
  "contactForm/getAllContactForms",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.get(`${server}/contact-form`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Form verileri alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete a contact form submission
export const deleteContactForm = createAsyncThunk(
  "contactForm/deleteContactForm",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${server}/contact-form?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Form silinemedi';
      return thunkAPI.rejectWithValue(message);
    }
  }
); 