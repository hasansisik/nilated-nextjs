import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface FeaturesPayload {
  activeFeature?: string;
  features1?: {
    badge?: {
      visible?: boolean;
      label?: string;
      text?: string;
      backgroundColor?: string;
      labelTextColor?: string;
    };
    title?: {
      part1?: string;
      part2?: string;
      part3?: string;
      part3TextColor?: string;
    };
    images?: {
      img1?: string;
      img2?: string;
      img3?: string;
      bgEllipse?: string;
      starLg?: string;
      starMd?: string;
      dots?: string;
    };
    features?: Array<{
      icon?: string;
      title?: string;
      description?: string;
      backgroundColor?: string;
      titleColor?: string;
      descriptionColor?: string;
      iconBackgroundColor?: string;
    }>;
    videoId?: string;
  };
  features4?: {
    badge?: {
      visible?: boolean;
      label?: string;
      backgroundColor?: string;
      labelTextColor?: string;
      icon?: string;
    };
    title?: {
      part1?: string;
      part2?: string;
      part3?: string;
      part2TextColor?: string;
    };
    features?: Array<{
      icon?: string;
      title?: string;
      description?: string;
      backgroundColor?: string;
      titleColor?: string;
      descriptionColor?: string;
      iconColor?: string;
    }>;
    buttons?: {
      primary?: {
        visible?: boolean;
        text?: string;
        link?: string;
        backgroundColor?: string;
        textColor?: string;
        iconColor?: string;
      };
      secondary?: {
        visible?: boolean;
        text?: string;
        link?: string;
        textColor?: string;
      };
    };
    backgroundColor?: string;
  };
  features5?: {
    title?: string;
    titleColor?: string;
    description?: string;
    descriptionColor?: string;
    backgroundColor?: string;
    sections?: Array<{
      id: string;
      visible?: boolean;
      position?: number;
      image?: string;
      imagePosition?: 'left' | 'right';
      backgroundColor?: string;
      title?: {
        part1?: string;
        part2?: string;
        part3?: string;
        part2Color?: string;
        part3Color?: string;
      };
      description?: string;
      descriptionColor?: string;
    }> | {
      operation: 'add' | 'remove' | 'update' | 'reorder';
      section?: {
        id?: string;
        visible?: boolean;
        image?: string;
        imagePosition?: 'left' | 'right';
        backgroundColor?: string;
        title?: {
          part1?: string;
          part2?: string;
          part3?: string;
          part2Color?: string;
          part3Color?: string;
        };
        description?: string;
        descriptionColor?: string;
      };
      sectionId?: string;
      order?: string[];
    };
  };
  features8?: {
    title?: string;
    description?: string;
    values?: Array<{
      title?: string;
      description?: string;
      icon?: string;
    }>;
    starIcon?: string;
    backgroundColor?: string;
    titleColor?: string;
    descriptionColor?: string;
    valuesTitleColor?: string;
    valuesDescriptionColor?: string;
  };
  features10?: {
    backgroundColor?: string;
    backgroundImage?: string;
    features?: Array<{
      icon?: string;
      title?: string;
      description?: string;
      backgroundColor?: string;
      titleColor?: string;
      descriptionColor?: string;
      iconBackgroundColor?: string;
    }>;
  };
}

// Helper functions for features5 sections
export const addFeature5Section = (section: any) => {
  return {
    sections: {
      operation: 'add',
      section
    }
  };
};

export const updateFeature5Section = (section: any) => {
  return {
    sections: {
      operation: 'update',
      section
    }
  };
};

export const removeFeature5Section = (sectionId: string) => {
  return {
    sections: {
      operation: 'remove',
      sectionId
    }
  };
};

export const reorderFeature5Sections = (order: string[]) => {
  return {
    sections: {
      operation: 'reorder',
      order
    }
  };
};

// Get features data
export const getFeatures = createAsyncThunk(
  "features/getFeatures",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${server}/features`);
      return data.features;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Features bilgileri alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update features data
export const updateFeatures = createAsyncThunk(
  "features/updateFeatures",
  async (payload: FeaturesPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.put(`${server}/features`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.features;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Features güncellenemedi';
      return thunkAPI.rejectWithValue(message);
    }
  }
); 