import axios from "axios";
import { server } from "@/config";

// Cache settings for a short period
let cachedGeneral: any = null;
let cacheTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getGeneral = async () => {
  try {
    // Return cached settings if they're recent
    const now = Date.now();
    if (cachedGeneral && now - cacheTime < CACHE_DURATION) {
      return cachedGeneral;
    }
    
    // Fetch fresh settings
    const { data } = await axios.get(`${server}/general`);
    
    // Update cache
    cachedGeneral = data.general;
    cacheTime = now;
    
    return data.general;
  } catch (error) {
    console.error("Error fetching general settings:", error);
    // Return null on error, the caller should handle this case
    return null;
  }
};

export const clearGeneralCache = () => {
  cachedGeneral = null;
  cacheTime = 0;
}; 