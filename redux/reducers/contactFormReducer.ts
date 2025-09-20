import { createReducer } from "@reduxjs/toolkit";
import { 
  createContactForm, 
  getAllContactForms, 
  deleteContactForm 
} from "../actions/contactFormActions";

interface ContactFormState {
  forms: any[];
  loading: boolean;
  error: string | null;
  success?: boolean;
  message?: string;
}

const initialState: ContactFormState = {
  forms: [],
  loading: false,
  error: null,
};

export const contactFormReducer = createReducer(initialState, (builder) => {
  builder
    // Create Contact Form
    .addCase(createContactForm.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(createContactForm.fulfilled, (state, action) => {
      state.loading = false;
      state.forms.push(action.payload);
      state.success = true;
      state.message = "Form başarıyla gönderildi";
      state.error = null;
    })
    .addCase(createContactForm.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    })
    
    // Get All Contact Forms
    .addCase(getAllContactForms.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getAllContactForms.fulfilled, (state, action) => {
      state.loading = false;
      state.forms = action.payload;
      state.error = null;
    })
    .addCase(getAllContactForms.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Delete Contact Form
    .addCase(deleteContactForm.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteContactForm.fulfilled, (state, action) => {
      state.loading = false;
      state.forms = state.forms.filter(form => form._id !== action.payload);
      state.success = true;
      state.message = "Form başarıyla silindi";
      state.error = null;
    })
    .addCase(deleteContactForm.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });
});

export default contactFormReducer; 