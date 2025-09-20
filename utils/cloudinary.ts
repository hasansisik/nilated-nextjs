import crypto from 'crypto';
import { store } from '@/redux/store';
import { getGeneral } from '@/redux/actions/generalActions';

// Default values
let CLOUD_NAME = '';
let API_KEY = '';
let API_SECRET = '';

// Function to get Cloudinary settings from Redux store
export const getCloudinarySettings = async (): Promise<void> => {
  try {
    // Dispatch getGeneral action to make sure we have the latest data
    await store.dispatch(getGeneral());
    
    // Get the general state from the Redux store
    const state = store.getState();
    const { general } = state.general;
    
    if (general?.cloudinary) {
      CLOUD_NAME = general.cloudinary.cloudName || '';
      API_KEY = general.cloudinary.apiKey || '';
      API_SECRET = general.cloudinary.apiSecret || '';
    }
  } catch (error) {
    console.error('Error getting Cloudinary settings from Redux store:', error);
    // If there's an error, keep the current values
  }
};

function generateSignature(timestamp: number): string {
  const str = `timestamp=${timestamp}${API_SECRET}`;
  return crypto.createHash('sha1').update(str).digest('hex');
}


export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  // Refresh settings before upload to ensure we have the latest
  await getCloudinarySettings();
  
  // Check if we have the required Cloudinary credentials
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    throw new Error('Cloudinary credentials not found or invalid. Please check your settings.');
  }
  
  return new Promise((resolve, reject) => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = generateSignature(timestamp);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', API_KEY);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);

    fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          reject(new Error(data.error.message));
        } else {
          resolve(data.secure_url);
        }
      })
      .catch(error => {
        console.error('Upload error:', error);
        reject(error);
      });
  });
};