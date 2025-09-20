"use client";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
  import { Separator } from "@/components/ui/separator"
  import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
  } from "@/components/ui/sidebar"
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { Textarea } from "@/components/ui/textarea";
  import { useState, useEffect, useRef } from "react";
  import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
  import { Badge } from "@/components/ui/badge";
  import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";
  import Link from "next/link";
  import { uploadImageToCloudinary } from "@/utils/cloudinary";
  import Image from "next/image";
  import RichTextEditor from "@/components/RichTextEditor";
  import { useDispatch, useSelector } from "react-redux";
  import { AppDispatch, RootState } from "@/redux/store";
  import { 
    getAllHizmetler, 
    getAllCategories,
    createHizmet, 
    updateHizmet, 
    deleteHizmet 
  } from "@/redux/actions/hizmetActions";
  import { Loader2, Trash2, Pencil, Eye, Plus, FileJson, Download } from "lucide-react";
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { AlertCircle } from "lucide-react";
  import { Checkbox } from "@/components/ui/checkbox";

// Function to convert title to slug
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
};

interface Author {
  name: string;
  avatar: string;
  date: string;
}

interface Content {
  intro?: string;
  readTime?: string;
  author?: Author;
  mainImage?: string; // Keep for backward compatibility
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

interface BeforeAfterItem {
  title?: string;
  description?: string;
  beforeImage: string;
  afterImage: string;
  order?: number;
}

interface LeftRightItem {
  title: string;
  description?: string;
  image: string;
  isRightAligned?: boolean;
  order?: number;
}

interface GalleryImage {
  title?: string;
  image: string;
  order?: number;
}

interface Hizmet {
  id: number;
  _id?: string;
  title: string;
  description: string;
  image: string;
  categories: string[];
  company: string;
  subtitle: string;
  fullDescription: string;
  tag: string;
  content?: Content;
}

export default function HizmetEditor() {
  const dispatch = useDispatch<AppDispatch>();
  const { hizmetler, categories, loading, error, success, message } = useSelector(
    (state: RootState) => state.hizmet
  );
  
  const [filteredHizmetler, setFilteredHizmetler] = useState<Hizmet[]>([]);
  const [notification, setNotification] = useState<{ type: string; message: string } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingHizmetId, setEditingHizmetId] = useState<string | number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const hizmetlerPerPage = 5;
  
  const thumbnailFileInputRef = useRef<HTMLInputElement>(null);
  const mainImageFileInputRef = useRef<HTMLInputElement>(null);
  const beforeImageFileInputRef = useRef<HTMLInputElement>(null);
  const afterImageFileInputRef = useRef<HTMLInputElement>(null);
  const leftRightImageFileInputRef = useRef<HTMLInputElement>(null);
  const galleryImageFileInputRef = useRef<HTMLInputElement>(null);
  
  // State for the current image upload target
  const [currentUploadTarget, setCurrentUploadTarget] = useState<{
    type: 'beforeAfterItem' | 'leftRightItem' | 'galleryImage';
    index: number;
    field?: 'beforeImage' | 'afterImage' | 'image';
  } | null>(null);
  
  // Uploading state for images
  const [isUploading, setIsUploading] = useState({
    thumbnail: false,
    mainImage: false,
    beforeImage: false,
    afterImage: false,
    leftRightImage: false,
    galleryImage: false
  });

  const initialFormState = {
    title: "",
    description: "",
    image: "",
    categories: [] as string[],
    category: "",
    bannerSectionTitle: "",
    bannerSectionDescription: "",
    bannerSectionImage: "",
    beforeAfterSectionTitle: "Before-After: Transformation",
    beforeAfterSectionDescription: "",
    beforeAfterItems: [] as BeforeAfterItem[],
    leftRightSectionTitle: "Features",
    leftRightItems: [] as LeftRightItem[],
    gallerySectionTitle: "Gallery",
    gallerySectionDescription: "",
    galleryImages: [] as GalleryImage[]
  };

  const [formData, setFormData] = useState(initialFormState);
  const [activeTab, setActiveTab] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [hizmetToDelete, setHizmetToDelete] = useState<string | null>(null);
  
  // Current index for editing sub-items
  const [currentBeforeAfterIndex, setCurrentBeforeAfterIndex] = useState<number | null>(null);
  const [currentLeftRightIndex, setCurrentLeftRightIndex] = useState<number | null>(null);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState<number | null>(null);

  // Additional states for modal dialogs
  const [beforeAfterDialogOpen, setBeforeAfterDialogOpen] = useState(false);
  const [leftRightDialogOpen, setLeftRightDialogOpen] = useState(false);
  const [galleryDialogOpen, setGalleryDialogOpen] = useState(false);
  
  // Temporary state for editing items in modals
  const [beforeAfterItem, setBeforeAfterItem] = useState<BeforeAfterItem>({
    title: '',
    description: '',
    beforeImage: '',
    afterImage: '',
    order: 0
  });
  
  const [leftRightItem, setLeftRightItem] = useState<LeftRightItem>({
    title: '',
    description: '',
    image: '',
    isRightAligned: false,
    order: 0
  });
  
  const [galleryItem, setGalleryItem] = useState<GalleryImage>({
    title: '',
    image: '',
    order: 0
  });

  // Load hizmetler from Redux store
  useEffect(() => {
    dispatch(getAllHizmetler());
    dispatch(getAllCategories());
  }, [dispatch]);

  // Check URL parameters for edit/new mode
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    const id = urlParams.get('id');
    
    if (mode === 'edit' && id) {
      const hizmetId = parseInt(id);
      const hizmetToEdit = hizmetler?.find((hizmet: any) => 
        hizmet._id === id || hizmet.id === hizmetId
      );
      
      if (hizmetToEdit) {
        handleEditHizmet(hizmetId);
      }
    } else if (mode === 'new') {
      resetForm();
      setIsEditMode(false);
      setEditingHizmetId(null);
      setActiveTab("add");
    }
  }, [hizmetler]);

  // Show notifications when Redux state changes
  useEffect(() => {
    if (success && message) {
      setNotification({
        type: "success",
        message: message
      });
      
      // Auto-hide notification after 5 seconds
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
    
    if (error) {
      setNotification({
        type: "error",
        message: error
      });
    }
  }, [success, message, error]);

  // Filter hizmetler when search term changes
  useEffect(() => {
    if (!hizmetler) return;
    
    if (searchTerm.trim() === "") {
      setFilteredHizmetler(hizmetler);
    } else {
      const lowercasedFilter = searchTerm.toLowerCase();
      const filtered = hizmetler.filter((hizmet: any) => 
        hizmet.title.toLowerCase().includes(lowercasedFilter) ||
        hizmet.categories?.some((cat: string) => cat.toLowerCase().includes(lowercasedFilter)) ||
        hizmet.company?.toLowerCase().includes(lowercasedFilter) ||
        hizmet.tag?.toLowerCase().includes(lowercasedFilter)
      );
      setFilteredHizmetler(filtered);
    }
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, hizmetler]);

  // Handle image uploads
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(prev => ({ ...prev, thumbnail: true }));
      const imageUrl = await uploadImageToCloudinary(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
      setIsUploading(prev => ({ ...prev, thumbnail: false }));
      
      setNotification({
        type: "success",
        message: "Thumbnail image uploaded successfully!"
      });
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      setIsUploading(prev => ({ ...prev, thumbnail: false }));
      setNotification({
        type: "error",
        message: "Failed to upload thumbnail image. Please try again."
      });
    }
  };
  
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.warn("handleMainImageUpload is deprecated - use inline banner section image upload instead");
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(prev => ({ ...prev, mainImage: true }));
      const imageUrl = await uploadImageToCloudinary(file);
      setFormData(prev => ({ 
        ...prev, 
        bannerSectionImage: imageUrl // Update bannerSectionImage instead of mainImage
      }));
      setIsUploading(prev => ({ ...prev, mainImage: false }));
      
      setNotification({
        type: "success",
        message: "Banner image uploaded successfully!"
      });
    } catch (error) {
      console.error("Error uploading banner image:", error);
      setIsUploading(prev => ({ ...prev, mainImage: false }));
      setNotification({
        type: "error",
        message: "Failed to upload banner image. Please try again."
      });
    }
  };
  
  const handleBeforeImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(prev => ({ ...prev, beforeImage: true }));
      const imageUrl = await uploadImageToCloudinary(file);
      
      if (currentBeforeAfterIndex !== null) {
        // Update existing item
        const updatedItems = [...formData.beforeAfterItems];
        updatedItems[currentBeforeAfterIndex] = {
          ...updatedItems[currentBeforeAfterIndex],
          beforeImage: imageUrl
        };
        setFormData(prev => ({ ...prev, beforeAfterItems: updatedItems }));
      } else {
        // Update the temporary state
        setBeforeAfterItem(prev => ({ ...prev, beforeImage: imageUrl }));
      }
      
      setIsUploading(prev => ({ ...prev, beforeImage: false }));
      
      setNotification({
        type: "success",
        message: "Before image uploaded successfully!"
      });
    } catch (error) {
      console.error("Error uploading before image:", error);
      setIsUploading(prev => ({ ...prev, beforeImage: false }));
      setNotification({
        type: "error",
        message: "Failed to upload before image. Please try again."
      });
    }
  };
  
  const handleAfterImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(prev => ({ ...prev, afterImage: true }));
      const imageUrl = await uploadImageToCloudinary(file);
      
      if (currentBeforeAfterIndex !== null) {
        // Update existing item
        const updatedItems = [...formData.beforeAfterItems];
        updatedItems[currentBeforeAfterIndex] = {
          ...updatedItems[currentBeforeAfterIndex],
          afterImage: imageUrl
        };
        setFormData(prev => ({ ...prev, beforeAfterItems: updatedItems }));
      } else {
        // Update the temporary state
        setBeforeAfterItem(prev => ({ ...prev, afterImage: imageUrl }));
      }
      
      setIsUploading(prev => ({ ...prev, afterImage: false }));
      
      setNotification({
        type: "success",
        message: "After image uploaded successfully!"
      });
    } catch (error) {
      console.error("Error uploading after image:", error);
      setIsUploading(prev => ({ ...prev, afterImage: false }));
      setNotification({
        type: "error",
        message: "Failed to upload after image. Please try again."
      });
    }
  };
  
  const handleLeftRightImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(prev => ({ ...prev, leftRightImage: true }));
      const imageUrl = await uploadImageToCloudinary(file);
      
      if (currentLeftRightIndex !== null) {
        // Update existing item
        const updatedItems = [...formData.leftRightItems];
        updatedItems[currentLeftRightIndex] = {
          ...updatedItems[currentLeftRightIndex],
          image: imageUrl
        };
        setFormData(prev => ({ ...prev, leftRightItems: updatedItems }));
      } else {
        // Update the temporary state
        setLeftRightItem(prev => ({ ...prev, image: imageUrl }));
      }
      
      setIsUploading(prev => ({ ...prev, leftRightImage: false }));
      
      setNotification({
        type: "success",
        message: "Left-right section image uploaded successfully!"
      });
    } catch (error) {
      console.error("Error uploading left-right image:", error);
      setIsUploading(prev => ({ ...prev, leftRightImage: false }));
      setNotification({
        type: "error",
        message: "Failed to upload left-right image. Please try again."
      });
    }
  };
  
  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(prev => ({ ...prev, galleryImage: true }));
      const imageUrl = await uploadImageToCloudinary(file);
      
      if (currentGalleryIndex !== null) {
        // Update existing item
        const updatedItems = [...formData.galleryImages];
        updatedItems[currentGalleryIndex] = {
          ...updatedItems[currentGalleryIndex],
          image: imageUrl
        };
        setFormData(prev => ({ ...prev, galleryImages: updatedItems }));
      } else {
        // Update the temporary state
        setGalleryItem(prev => ({ ...prev, image: imageUrl }));
      }
      
      setIsUploading(prev => ({ ...prev, galleryImage: false }));
      
      setNotification({
        type: "success",
        message: "Gallery image uploaded successfully!"
      });
    } catch (error) {
      console.error("Error uploading gallery image:", error);
      setIsUploading(prev => ({ ...prev, galleryImage: false }));
      setNotification({
        type: "error",
        message: "Failed to upload gallery image. Please try again."
      });
    }
  };

  // Remove a category from the list
  const removeCategory = (category: string) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter((cat) => cat !== category),
    });
  };

  // Tab değiştiğinde form durumunu güncelle
  const handleTabChange = (value: string) => {
    if (value === "all" && isEditMode) {
      // All tabına geçerken edit modundan çıkıyorsak, edit durumunu temizle
      setIsEditMode(false);
      setEditingHizmetId(null);
      // URL'yi temizle
      window.history.pushState({}, '', window.location.pathname);
    }
    
    setActiveTab(value);
  };
  
  // URL'yi güncelle
  const updateURL = (mode: string, id?: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('mode', mode);
    
    if (id) {
      url.searchParams.set('id', id.toString());
    } else {
      url.searchParams.delete('id');
    }
    
    window.history.pushState({}, '', url);
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData(initialFormState);
    setIsUploading({
      thumbnail: false,
      mainImage: false,
      beforeImage: false,
      afterImage: false,
      leftRightImage: false,
      galleryImage: false
    });
    setCurrentBeforeAfterIndex(null);
    setCurrentLeftRightIndex(null);
    setCurrentGalleryIndex(null);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (
      !formData.title ||
      !formData.description ||
      !formData.image ||
      formData.categories.length === 0
    ) {
      setNotification({
        type: "error",
        message: "Please fill all required fields.",
      });
      return;
    }

    try {
      // Prepare content object
      const contentObject = {
        mainImage: formData.bannerSectionImage || formData.image,
        bannerSectionTitle: formData.bannerSectionTitle || formData.title,
        bannerSectionDescription: formData.bannerSectionDescription || formData.description,
        bannerSectionImage: formData.bannerSectionImage || formData.image,
        beforeAfterSectionTitle: formData.beforeAfterSectionTitle || "Before-After: Transformation",
        beforeAfterSectionDescription: formData.beforeAfterSectionDescription || "",
        beforeAfterItems: formData.beforeAfterItems,
        leftRightSectionTitle: formData.leftRightSectionTitle || "Features",
        leftRightItems: formData.leftRightItems,
        gallerySectionTitle: formData.gallerySectionTitle || "Gallery",
        gallerySectionDescription: formData.gallerySectionDescription || "",
        galleryImages: formData.galleryImages
      };

      if (isEditMode && editingHizmetId) {        
        // İd'nin string olduğundan emin olalım
        const idString = String(editingHizmetId);
        
        // MongoDB Object ID formatını kontrol edelim (24 karakter hexadecimal)
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(idString);
        
        // Update existing hizmet
        const hizmetData = {
          id: idString,
          title: formData.title,
          description: formData.description,
          image: formData.image,
          categories: formData.categories,
          company: "Default Company", // Set a default value since it's required in the model
          content: contentObject
        };
                
        // Dispatch update action
        await dispatch(updateHizmet(hizmetData)).unwrap();
        
        // Reset edit mode
        setIsEditMode(false);
        setEditingHizmetId(null);
        
        // Show success notification
        setNotification({
          type: "success",
          message: "Hizmet updated successfully!"
        });
      } else {
        
        // Create new hizmet
        const hizmetData = {
          title: formData.title,
          description: formData.description,
          image: formData.image,
          categories: formData.categories,
          company: "Default Company", // Set a default value since it's required in the model
          content: contentObject
        };
                
        // Dispatch create action
        await dispatch(createHizmet(hizmetData)).unwrap();
        
        // Show success notification
        setNotification({
          type: "success",
          message: "Hizmet created successfully!"
        });
      }
      
      // Reset form
      resetForm();
      setActiveTab("all");
    } catch (error: any) {
      console.error('Error saving hizmet:', error);
      
      // Özel hata mesajları için kontrol
      let errorMessage = error?.message || "Failed to save hizmet. Please try again.";
      
      // Yetki hatası mesajları için daha kullanıcı dostu açıklamalar
      if (errorMessage.includes("yetkiniz yok") || errorMessage.includes("Bu işlemi yapmak için yetkiniz yok")) {
        errorMessage = "You don't have permission to edit this hizmet. It may belong to another company or require admin/editor role.";
      } else if (errorMessage.includes("Oturum süresi dolmuş") || errorMessage.includes("token")) {
        errorMessage = "Your session has expired. Please log out and log in again.";
      }
      
      setNotification({
        type: "error",
        message: errorMessage
      });
    }
  };

  // Generate JSON download
  const generateJsonDownload = (hizmetlerData: Hizmet[]) => {
    // Create a full hizmetler object including categories
    const fullHizmetlerData = {
      categories: categories,
      hizmetler: hizmetlerData
    };
    
    const jsonString = JSON.stringify(fullHizmetlerData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hizmetler_export.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };

  // Add function to handle project.json import
  const handleImportJson = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const importedHizmetler = JSON.parse(event.target?.result as string) as Hizmet[];
        
        // Save to server using our API
        const response = await fetch('/api/hizmetler/import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(importedHizmetler),
        });
        
        if (!response.ok) {
          throw new Error('Failed to import project posts');
        }
        
        // Fetch services again instead of trying to pass data to action
        dispatch(getAllHizmetler());
        setFilteredHizmetler(importedHizmetler);
        setNotification({
          type: "success",
          message: "Project posts imported successfully!",
        });
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Error importing project posts:', error);
      setNotification({
        type: "error",
        message: "Failed to import project posts. Invalid JSON format.",
      });
    }
  };

  // Delete hizmet handler
  const handleDeleteHizmet = async (hizmetId: string | number) => {
    // Ensure we're using the MongoDB _id if available
    const idToDelete = typeof hizmetId === 'object' && hizmetId !== null ? 
      (hizmetId as any)._id || hizmetId : 
      hizmetId;
    
    setHizmetToDelete(String(idToDelete));
    setDeleteDialogOpen(true);
  };

  // Confirm delete hizmet
  const confirmDelete = async () => {
    if (!hizmetToDelete) return;
    
    try {
      await dispatch(deleteHizmet(hizmetToDelete)).unwrap();
      setDeleteDialogOpen(false);
      setHizmetToDelete(null);
    } catch (error: any) {
      console.error('Error deleting hizmet:', error);
      setNotification({
        type: "error",
        message: error?.message || "Failed to delete hizmet. Please try again.",
      });
    }
  };

  // Edit hizmet handler
  const handleEditHizmet = (hizmetId: string | number) => {    
    // hizmetId'yi string'e çevirelim
    const hizmetIdStr = String(hizmetId);
    
    const hizmetToEdit = hizmetler?.find((hizmet: any) => {
      // _id veya id eşleşmesini kontrol edelim
      const idMatch = hizmet._id === hizmetIdStr || hizmet._id === hizmetId || hizmet.id === hizmetId;
      return idMatch;
    });
    
    if (!hizmetToEdit) {
      console.error(`ID: ${hizmetIdStr} ile eşleşen hizmet bulunamadı`);
      setNotification({
        type: "error",
        message: `Hizmet with ID ${hizmetIdStr} not found`
      });
      return;
    }
    
    // Set form data
    setFormData({
      title: hizmetToEdit.title || "",
      description: hizmetToEdit.description || "",
      image: hizmetToEdit.image || "",
      categories: Array.isArray(hizmetToEdit.categories) ? hizmetToEdit.categories : [],
      category: "",
      bannerSectionTitle: hizmetToEdit.content?.bannerSectionTitle || "",
      bannerSectionDescription: hizmetToEdit.content?.bannerSectionDescription || "",
      bannerSectionImage: hizmetToEdit.content?.bannerSectionImage || hizmetToEdit.content?.mainImage || "",
      beforeAfterSectionTitle: hizmetToEdit.content?.beforeAfterSectionTitle || "Before-After: Transformation",
      beforeAfterSectionDescription: hizmetToEdit.content?.beforeAfterSectionDescription || "",
      beforeAfterItems: hizmetToEdit.content?.beforeAfterItems || [],
      leftRightSectionTitle: hizmetToEdit.content?.leftRightSectionTitle || "Features",
      leftRightItems: hizmetToEdit.content?.leftRightItems || [],
      gallerySectionTitle: hizmetToEdit.content?.gallerySectionTitle || "Gallery",
      gallerySectionDescription: hizmetToEdit.content?.gallerySectionDescription || "",
      galleryImages: hizmetToEdit.content?.galleryImages || []
    });
    
    // MongoDB ObjectId değerini öncelikli olarak kullan
    const editId = hizmetToEdit._id || hizmetId;
    
    // Set edit mode
    setIsEditMode(true);
    setEditingHizmetId(editId);
    setActiveTab("add");
    
    // URL'yi güncelle - URL için sayısal ID kullanmaya devam ediyoruz
    const urlId = typeof hizmetId === "number" ? hizmetId : 
                 !isNaN(parseInt(String(hizmetId))) ? parseInt(String(hizmetId)) : 0;
    updateURL('edit', urlId);
    
    // Reset uploading states
    setIsUploading({
      thumbnail: false,
      mainImage: false,
      beforeImage: false,
      afterImage: false,
      leftRightImage: false,
      galleryImage: false
    });
  };

  // New hizmet handler
  const handleNewHizmet = () => {
    resetForm();
    setIsEditMode(false);
    setEditingHizmetId(null);
    setActiveTab("add");
    
    // URL'yi güncelle
    updateURL('new');
  };

  // Pagination logic
  const indexOfLastHizmet = currentPage * hizmetlerPerPage;
  const indexOfFirstHizmet = indexOfLastHizmet - hizmetlerPerPage;
  const currentHizmetler = filteredHizmetler.slice(indexOfFirstHizmet, indexOfLastHizmet);
  const totalPages = Math.ceil(filteredHizmetler.length / hizmetlerPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Pagination component
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
            // Show first page, last page, and pages around current page
            if (
              page === 1 || 
              page === totalPages || 
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <PaginationItem key={page}>
                  <PaginationLink 
                    isActive={page === currentPage}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            }
            
            // Add ellipsis for skipped pages
            if (page === 2 && currentPage > 3) {
              return <PaginationItem key="ellipsis-start"><PaginationEllipsis /></PaginationItem>;
            }
            
            if (page === totalPages - 1 && currentPage < totalPages - 2) {
              return <PaginationItem key="ellipsis-end"><PaginationEllipsis /></PaginationItem>;
            }
            
            return null;
          })}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  // Modal functions for before-after items
  const openBeforeAfterDialog = (index?: number) => {
    if (index !== undefined) {
      setCurrentBeforeAfterIndex(index);
      setBeforeAfterItem(formData.beforeAfterItems[index]);
    } else {
      setCurrentBeforeAfterIndex(null);
      setBeforeAfterItem({
        title: '',
        description: '',
        beforeImage: '',
        afterImage: '',
        order: formData.beforeAfterItems.length
      });
    }
    setBeforeAfterDialogOpen(true);
  };

  const saveBeforeAfterItem = () => {
    // Validate required fields
    if (!beforeAfterItem.beforeImage || !beforeAfterItem.afterImage) {
      setNotification({
        type: "error",
        message: "Both before and after images are required."
      });
      return;
    }
    
    if (currentBeforeAfterIndex !== null) {
      // Update existing item
      const updatedItems = [...formData.beforeAfterItems];
      updatedItems[currentBeforeAfterIndex] = beforeAfterItem;
      setFormData(prev => ({ ...prev, beforeAfterItems: updatedItems }));
    } else {
      // Add new item
      setFormData(prev => ({
        ...prev,
        beforeAfterItems: [...prev.beforeAfterItems, beforeAfterItem]
      }));
    }
    
    setBeforeAfterDialogOpen(false);
  };

  const deleteBeforeAfterItem = (index: number) => {
    const updatedItems = [...formData.beforeAfterItems];
    updatedItems.splice(index, 1);
    
    // Update order values
    const reorderedItems = updatedItems.map((item, idx) => ({
      ...item,
      order: idx
    }));
    
    setFormData(prev => ({ ...prev, beforeAfterItems: reorderedItems }));
  };

  // Modal functions for left-right items
  const openLeftRightDialog = (index?: number) => {
    if (index !== undefined) {
      setCurrentLeftRightIndex(index);
      setLeftRightItem(formData.leftRightItems[index]);
    } else {
      setCurrentLeftRightIndex(null);
      setLeftRightItem({
        title: '',
        description: '',
        image: '',
        isRightAligned: index !== undefined ? index % 2 === 1 : false,
        order: formData.leftRightItems.length
      });
    }
    setLeftRightDialogOpen(true);
  };

  const saveLeftRightItem = () => {
    // Validate required fields
    if (!leftRightItem.title || !leftRightItem.image) {
      setNotification({
        type: "error",
        message: "Title and image are required."
      });
      return;
    }
    
    if (currentLeftRightIndex !== null) {
      // Update existing item
      const updatedItems = [...formData.leftRightItems];
      updatedItems[currentLeftRightIndex] = leftRightItem;
      setFormData(prev => ({ ...prev, leftRightItems: updatedItems }));
    } else {
      // Add new item
      setFormData(prev => ({
        ...prev,
        leftRightItems: [...prev.leftRightItems, leftRightItem]
      }));
    }
    
    setLeftRightDialogOpen(false);
  };

  const deleteLeftRightItem = (index: number) => {
    const updatedItems = [...formData.leftRightItems];
    updatedItems.splice(index, 1);
    
    // Update order values
    const reorderedItems = updatedItems.map((item, idx) => ({
      ...item,
      order: idx
    }));
    
    setFormData(prev => ({ ...prev, leftRightItems: reorderedItems }));
  };

  // Modal functions for gallery items
  const openGalleryDialog = (index?: number) => {
    if (index !== undefined) {
      setCurrentGalleryIndex(index);
      setGalleryItem(formData.galleryImages[index]);
    } else {
      setCurrentGalleryIndex(null);
      setGalleryItem({
        title: '',
        image: '',
        order: formData.galleryImages.length
      });
    }
    setGalleryDialogOpen(true);
  };

  const saveGalleryItem = () => {
    // Validate required fields
    if (!galleryItem.image) {
      setNotification({
        type: "error",
        message: "Image is required."
      });
      return;
    }
    
    if (currentGalleryIndex !== null) {
      // Update existing item
      const updatedItems = [...formData.galleryImages];
      updatedItems[currentGalleryIndex] = galleryItem;
      setFormData(prev => ({ ...prev, galleryImages: updatedItems }));
    } else {
      // Add new item
      setFormData(prev => ({
        ...prev,
        galleryImages: [...prev.galleryImages, galleryItem]
      }));
    }
    
    setGalleryDialogOpen(false);
  };

  const deleteGalleryItem = (index: number) => {
    const updatedItems = [...formData.galleryImages];
    updatedItems.splice(index, 1);
    
    // Update order values
    const reorderedItems = updatedItems.map((item, idx) => ({
      ...item,
      order: idx
    }));
    
    setFormData(prev => ({ ...prev, galleryImages: reorderedItems }));
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Hizmet Management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {loading && activeTab === "all" && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        
        {notification && (
          <div className={`p-4 mb-4 rounded-lg ${notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            <div className="flex items-center">
              <span className="font-medium">{notification.type === "success" ? "Success!" : "Error!"}</span>
              <span className="ml-2">{notification.message}</span>
              <button 
                className="ml-auto" 
                onClick={() => setNotification(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>
        )}
        
        {activeTab === "all" ? (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <h2 className="text-xl font-bold">All Hizmetler</h2>
              
              <div className="flex gap-2 items-center">
                <div className="w-full md:w-auto">
                  <Input
                    placeholder="Search hizmetler by title, category, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => generateJsonDownload(hizmetler)} 
                  title="Export current hizmetler"
                >
                  Export
                </Button>
                
                <Button 
                  variant="default" 
                  onClick={handleNewHizmet} 
                  title="Create a new hizmet"
                >
                  New Hizmet
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              {!loading ? (
                <Table>
                  <TableCaption>A list of your hizmetler.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Categories</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Tag</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHizmetler.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          No hizmetler found. {searchTerm && "Try a different search term."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentHizmetler.map((hizmet) => (
                        <TableRow key={hizmet._id || hizmet.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {hizmet.image && (
                                <div className="relative w-10 h-10 rounded-md overflow-hidden">
                                  <img 
                                    src={hizmet.image} 
                                    alt={hizmet.title}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                              )}
                              <span className="line-clamp-1">{hizmet.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {Array.isArray(hizmet.categories) && hizmet.categories.map((cat: string, i: number) => (
                                <Badge key={i} variant="outline">{cat}</Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{hizmet.company}</TableCell>
                          <TableCell>
                            <Badge>{hizmet.tag || 'Hizmet'}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/${slugify(hizmet.title)}`} target="_blank">
                                <Button variant="outline" size="icon" title="View Hizmet">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => handleEditHizmet(hizmet._id || hizmet.id)}
                                title="Edit Hizmet"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="icon"
                                onClick={() => handleDeleteHizmet(hizmet._id || hizmet.id)}
                                disabled={loading}
                                title="Delete Hizmet"
                              >
                                {loading ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              ) : null}
              {!loading && renderPagination()}
            </div>
          </>
        ) : (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {isEditMode ? `Edit Hizmet: ${formData.title}` : "Create New Hizmet"}
              </h2>
              <Button 
                variant="outline" 
                onClick={() => {
                  if (isEditMode) {
                    setIsEditMode(false);
                    setEditingHizmetId(null);
                    // URL'yi temizle
                    window.history.pushState({}, '', window.location.pathname);
                  }
                  resetForm();
                  setActiveTab("all");
                }}
                disabled={loading}
              >
                Back to Hizmetler
              </Button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4">
                  <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium">
                        Basic Information
                      </CardTitle>
                      {isEditMode && (
                        <p className="text-sm text-muted-foreground">
                          Editing hizmet ID: {editingHizmetId}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-2 ">
                      <div className="space-y-1">
                        <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                        <Input 
                          id="title" 
                          placeholder="Enter hizmet title" 
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          className="h-9"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                        <Textarea 
                          id="description" 
                          placeholder="Brief description of the hizmet"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          className="min-h-[70px]"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="image" className="text-sm font-medium">Thumbnail Image</Label>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Input 
                              id="image" 
                              placeholder="URL for thumbnail image" 
                              value={formData.image}
                              onChange={(e) => setFormData({...formData, image: e.target.value})}
                              className="h-9"
                            />
                          </div>
                          <div>
                            <input
                              type="file"
                              ref={thumbnailFileInputRef}
                              onChange={handleThumbnailUpload}
                              className="hidden"
                              accept="image/*"
                            />
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => thumbnailFileInputRef.current?.click()}
                              disabled={isUploading.thumbnail}
                              size="sm"
                              className="h-9"
                            >
                              {isUploading.thumbnail ? "Uploading..." : "Upload"}
                            </Button>
                          </div>
                        </div>
                        {formData.image && (
                          <div className="mt-3 relative w-1/2 mx-auto aspect-video rounded-md overflow-hidden border">
                            <img 
                              src={formData.image} 
                              alt="Thumbnail preview" 
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base font-medium">Main Banner Section</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        This content appears in the main banner section
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor="bannerSectionTitle" className="text-sm font-medium">Section Title</Label>
                        <Input 
                          id="bannerSectionTitle" 
                          placeholder="Enter banner section title (defaults to main title if empty)" 
                          value={formData.bannerSectionTitle}
                          onChange={(e) => setFormData({...formData, bannerSectionTitle: e.target.value})}
                          className="h-9"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="bannerSectionDescription" className="text-sm font-medium">Section Description</Label>
                        <Textarea 
                          id="bannerSectionDescription" 
                          placeholder="Enter banner section description (defaults to main description if empty)"
                          value={formData.bannerSectionDescription}
                          onChange={(e) => setFormData({...formData, bannerSectionDescription: e.target.value})}
                          className="min-h-[70px]"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="bannerSectionImage" className="text-sm font-medium">Section Image</Label>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Input 
                              id="bannerSectionImage" 
                              placeholder="URL for banner section image" 
                              value={formData.bannerSectionImage}
                              onChange={(e) => setFormData({...formData, bannerSectionImage: e.target.value})}
                              className="h-9"
                            />
                          </div>
                          <div>
                            <input
                              type="file"
                              ref={mainImageFileInputRef}
                              onChange={handleMainImageUpload}
                              className="hidden"
                              accept="image/*"
                            />
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => mainImageFileInputRef.current?.click()}
                              disabled={isUploading.mainImage}
                              size="sm"
                              className="h-9"
                            >
                              {isUploading.mainImage ? "Uploading..." : "Upload"}
                            </Button>
                          </div>
                        </div>
                        {formData.bannerSectionImage && (
                          <div className="mt-3 relative w-1/3 mx-auto aspect-video rounded-md overflow-hidden border">
                            <img 
                              src={formData.bannerSectionImage} 
                              alt="Banner section image preview" 
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 p-3 bg-muted/50 rounded-md">
                        <h4 className="text-sm font-medium mb-2">Preview</h4>
                        <div className="border rounded-md p-4 bg-white">
                          <div className="flex flex-col md:flex-row items-start gap-4">
                            <div className="md:w-1/2">
                              <h5 className="text-lg font-semibold">
                                {formData.bannerSectionTitle || formData.title || "Section Title"}
                              </h5>
                              <p className="text-sm text-muted-foreground mt-1">
                                {formData.bannerSectionDescription || formData.description || "Section description will appear here"}
                              </p>
                            </div>
                            <div className="md:w-1/2 flex justify-center">
                              {(formData.bannerSectionImage || formData.image) ? (
                                <img 
                                  src={formData.bannerSectionImage || formData.image} 
                                  alt="Banner preview" 
                                  className="rounded-md object-cover w-full max-w-[200px] aspect-video"
                                />
                              ) : (
                                <div className="bg-muted rounded-md flex items-center justify-center w-full max-w-[200px] aspect-video">
                                  <span className="text-xs text-muted-foreground">Image preview</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base font-medium">Before-After Section</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor="beforeAfterSectionTitle" className="text-sm font-medium">Section Title</Label>
                        <Input 
                          id="beforeAfterSectionTitle" 
                          placeholder="Before-After: Transformation" 
                          value={formData.beforeAfterSectionTitle}
                          onChange={(e) => setFormData({...formData, beforeAfterSectionTitle: e.target.value})}
                          className="h-9"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="beforeAfterSectionDescription" className="text-sm font-medium">Section Description</Label>
                        <Textarea 
                          id="beforeAfterSectionDescription" 
                          placeholder="Description for the before-after section" 
                          value={formData.beforeAfterSectionDescription}
                          onChange={(e) => setFormData({...formData, beforeAfterSectionDescription: e.target.value})}
                          className="min-h-[70px]"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-sm font-medium">Before-After Items</Label>
                          <Button 
                            type="button" 
                            size="sm" 
                            onClick={() => openBeforeAfterDialog()}
                            variant="outline"
                          >
                            <Plus className="h-4 w-4 mr-1" /> Add Item
                          </Button>
                        </div>
                        
                        {formData.beforeAfterItems.length === 0 ? (
                          <div className="text-center p-4 border border-dashed rounded-md text-muted-foreground">
                            No before-after items added yet. Click "Add Item" to create one.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {formData.beforeAfterItems.map((item, index) => (
                              <div 
                                key={index} 
                                className="flex items-center justify-between p-3 border rounded-md"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="flex flex-col gap-1 w-16 h-16">
                                    <div className="w-full h-8 bg-gray-100 rounded-sm overflow-hidden">
                                      {item.beforeImage && (
                                        <img 
                                          src={item.beforeImage} 
                                          alt="Before" 
                                          className="w-full h-full object-cover"
                                        />
                                      )}
                                    </div>
                                    <div className="w-full h-8 bg-gray-100 rounded-sm overflow-hidden">
                                      {item.afterImage && (
                                        <img 
                                          src={item.afterImage} 
                                          alt="After" 
                                          className="w-full h-full object-cover"
                                        />
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <p className="font-medium">{item.title || `Item ${index + 1}`}</p>
                                    {item.description && (
                                      <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <Button 
                                    type="button" 
                                    size="icon" 
                                    variant="ghost" 
                                    onClick={() => openBeforeAfterDialog(index)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    type="button" 
                                    size="icon" 
                                    variant="ghost" 
                                    onClick={() => deleteBeforeAfterItem(index)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base font-medium">Left-Right Section</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor="leftRightSectionTitle" className="text-sm font-medium">Section Title</Label>
                        <Input 
                          id="leftRightSectionTitle" 
                          placeholder="Features" 
                          value={formData.leftRightSectionTitle}
                          onChange={(e) => setFormData({...formData, leftRightSectionTitle: e.target.value})}
                          className="h-9"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-sm font-medium">Left-Right Items</Label>
                          <Button 
                            type="button" 
                            size="sm" 
                            onClick={() => openLeftRightDialog()}
                            variant="outline"
                          >
                            <Plus className="h-4 w-4 mr-1" /> Add Item
                          </Button>
                        </div>
                        
                        {formData.leftRightItems.length === 0 ? (
                          <div className="text-center p-4 border border-dashed rounded-md text-muted-foreground">
                            No left-right items added yet. Click "Add Item" to create one.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {formData.leftRightItems.map((item, index) => (
                              <div 
                                key={index} 
                                className="flex items-center justify-between p-3 border rounded-md"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-16 h-16 bg-gray-100 rounded-sm overflow-hidden">
                                    {item.image && (
                                      <img 
                                        src={item.image} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover"
                                      />
                                    )}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium">{item.title}</p>
                                      {item.isRightAligned && (
                                        <Badge variant="outline" className="text-xs">Right Aligned</Badge>
                                      )}
                                    </div>
                                    {item.description && (
                                      <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <Button 
                                    type="button" 
                                    size="icon" 
                                    variant="ghost" 
                                    onClick={() => openLeftRightDialog(index)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    type="button" 
                                    size="icon" 
                                    variant="ghost" 
                                    onClick={() => deleteLeftRightItem(index)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base font-medium">Gallery Section</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor="gallerySectionTitle" className="text-sm font-medium">Section Title</Label>
                        <Input 
                          id="gallerySectionTitle" 
                          placeholder="Gallery" 
                          value={formData.gallerySectionTitle}
                          onChange={(e) => setFormData({...formData, gallerySectionTitle: e.target.value})}
                          className="h-9"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="gallerySectionDescription" className="text-sm font-medium">Section Description</Label>
                        <Textarea 
                          id="gallerySectionDescription" 
                          placeholder="Description for the gallery section" 
                          value={formData.gallerySectionDescription}
                          onChange={(e) => setFormData({...formData, gallerySectionDescription: e.target.value})}
                          className="min-h-[70px]"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-sm font-medium">Gallery Images</Label>
                          <Button 
                            type="button" 
                            size="sm" 
                            onClick={() => openGalleryDialog()}
                            variant="outline"
                          >
                            <Plus className="h-4 w-4 mr-1" /> Add Image
                          </Button>
                        </div>
                        
                        {formData.galleryImages.length === 0 ? (
                          <div className="text-center p-4 border border-dashed rounded-md text-muted-foreground">
                            No gallery images added yet. Click "Add Image" to upload one.
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {formData.galleryImages.map((image, index) => (
                              <div 
                                key={index} 
                                className="relative group rounded-md overflow-hidden"
                              >
                                <div className="aspect-square bg-gray-100">
                                  {image.image && (
                                    <img 
                                      src={image.image} 
                                      alt={image.title || `Image ${index + 1}`} 
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                </div>
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <Button 
                                    type="button" 
                                    size="icon" 
                                    variant="ghost" 
                                    className="text-white" 
                                    onClick={() => openGalleryDialog(index)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    type="button" 
                                    size="icon" 
                                    variant="ghost" 
                                    className="text-white" 
                                    onClick={() => deleteGalleryItem(index)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                {image.title && (
                                  <div className="absolute bottom-0 left-0 right-0 p-1 text-xs bg-black/70 text-white truncate">
                                    {image.title}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-4">
                  <Card className="shadow-sm">
                    <CardContent className="">
                      <div className="flex justify-between gap-3">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            resetForm();
                            setIsEditMode(false);
                            setEditingHizmetId(null);
                            setActiveTab("all");
                            // URL'yi temizle
                            window.history.pushState({}, '', window.location.pathname);
                          }}
                          className="w-1/2 h-9"
                          disabled={loading}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          className="w-1/2 h-9"
                          disabled={loading}
                        >
                          {loading ? (
                            <span className="flex items-center">
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              {isEditMode ? "Updating..." : "Creating..."}
                            </span>
                          ) : (
                            isEditMode ? "Update Hizmet" : "Create Hizmet"
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-sm">
                    <CardHeader className="">
                      <CardTitle className="text-base font-medium">Categories</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 ">
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1 min-h-[36px]">
                          {formData.categories.map((cat, index) => (
                            <Badge key={index} variant="secondary" className="px-2 py-1 text-xs">
                              {cat}
                              <button 
                                type="button"
                                className="ml-1 text-xs hover:text-destructive"
                                onClick={() => removeCategory(cat)}
                              >
                                ✕
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add category"
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="h-9"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && formData.category.trim()) {
                                e.preventDefault();
                                if (!formData.categories.includes(formData.category.trim())) {
                                  setFormData({
                                    ...formData,
                                    categories: [...formData.categories, formData.category.trim()],
                                    category: ''
                                  });
                                }
                              }
                            }}
                          />
                          <Button 
                            type="button" 
                            size="sm"
                            className="h-9"
                            onClick={() => {
                              if (formData.category.trim() && !formData.categories.includes(formData.category.trim())) {
                                setFormData({
                                  ...formData,
                                  categories: [...formData.categories, formData.category.trim()],
                                  category: ''
                                });
                              }
                            }}
                          >
                            Add
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Press Enter or click Add to add a category</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
      
      {/* Add Dialog for delete confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2 text-red-500">
                <AlertCircle className="h-5 w-5" />
                Confirm Deletion
              </div>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this hizmet? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setHizmetToDelete(null);
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog for Before-After Item */}
      <Dialog open={beforeAfterDialogOpen} onOpenChange={setBeforeAfterDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentBeforeAfterIndex !== null ? "Edit Before-After Item" : "Add Before-After Item"}
            </DialogTitle>
            <DialogDescription>
              Add before and after images with an optional title and description.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="beforeAfterTitle">Title (Optional)</Label>
              <Input
                id="beforeAfterTitle"
                value={beforeAfterItem.title || ""}
                onChange={(e) => setBeforeAfterItem({...beforeAfterItem, title: e.target.value})}
                placeholder="e.g. Kitchen Renovation"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="beforeAfterDescription">Description (Optional)</Label>
              <Textarea
                id="beforeAfterDescription"
                value={beforeAfterItem.description || ""}
                onChange={(e) => setBeforeAfterItem({...beforeAfterItem, description: e.target.value})}
                placeholder="Brief description about the transformation"
                className="h-20"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Before Image</Label>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Input 
                      value={beforeAfterItem.beforeImage || ""}
                      onChange={(e) => setBeforeAfterItem({...beforeAfterItem, beforeImage: e.target.value})}
                      placeholder="Image URL"
                    />
                    <div>
                      <input
                        type="file"
                        ref={beforeImageFileInputRef}
                        onChange={handleBeforeImageUpload}
                        className="hidden"
                        accept="image/*"
                      />
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => beforeImageFileInputRef.current?.click()}
                        disabled={isUploading.beforeImage}
                        size="sm"
                      >
                        {isUploading.beforeImage ? "..." : "Upload"}
                      </Button>
                    </div>
                  </div>
                  {beforeAfterItem.beforeImage && (
                    <div className="aspect-square border rounded overflow-hidden">
                      <img 
                        src={beforeAfterItem.beforeImage} 
                        alt="Before" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>After Image</Label>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Input 
                      value={beforeAfterItem.afterImage || ""}
                      onChange={(e) => setBeforeAfterItem({...beforeAfterItem, afterImage: e.target.value})}
                      placeholder="Image URL"
                    />
                    <div>
                      <input
                        type="file"
                        ref={afterImageFileInputRef}
                        onChange={handleAfterImageUpload}
                        className="hidden"
                        accept="image/*"
                      />
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => afterImageFileInputRef.current?.click()}
                        disabled={isUploading.afterImage}
                        size="sm"
                      >
                        {isUploading.afterImage ? "..." : "Upload"}
                      </Button>
                    </div>
                  </div>
                  {beforeAfterItem.afterImage && (
                    <div className="aspect-square border rounded overflow-hidden">
                      <img 
                        src={beforeAfterItem.afterImage} 
                        alt="After" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBeforeAfterDialogOpen(false)}
              disabled={isUploading.beforeImage || isUploading.afterImage}
            >
              Cancel
            </Button>
            <Button
              onClick={saveBeforeAfterItem}
              disabled={!beforeAfterItem.beforeImage || !beforeAfterItem.afterImage || isUploading.beforeImage || isUploading.afterImage}
            >
              {currentBeforeAfterIndex !== null ? "Update Item" : "Add Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog for Left-Right Item */}
      <Dialog open={leftRightDialogOpen} onOpenChange={setLeftRightDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentLeftRightIndex !== null ? "Edit Left-Right Item" : "Add Left-Right Item"}
            </DialogTitle>
            <DialogDescription>
              Add content with image that alternates between left and right alignment.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="leftRightTitle">Title</Label>
              <Input
                id="leftRightTitle"
                value={leftRightItem.title || ""}
                onChange={(e) => setLeftRightItem({...leftRightItem, title: e.target.value})}
                placeholder="e.g. Professional Team"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="leftRightDescription">Description (Optional)</Label>
              <Textarea
                id="leftRightDescription"
                value={leftRightItem.description || ""}
                onChange={(e) => setLeftRightItem({...leftRightItem, description: e.target.value})}
                placeholder="Description for this feature"
                className="h-20"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label>Image</Label>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Input 
                    value={leftRightItem.image || ""}
                    onChange={(e) => setLeftRightItem({...leftRightItem, image: e.target.value})}
                    placeholder="Image URL"
                  />
                  <div>
                    <input
                      type="file"
                      ref={leftRightImageFileInputRef}
                      onChange={handleLeftRightImageUpload}
                      className="hidden"
                      accept="image/*"
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => leftRightImageFileInputRef.current?.click()}
                      disabled={isUploading.leftRightImage}
                      size="sm"
                    >
                      {isUploading.leftRightImage ? "..." : "Upload"}
                    </Button>
                  </div>
                </div>
                {leftRightItem.image && (
                  <div className="aspect-video border rounded overflow-hidden">
                    <img 
                      src={leftRightItem.image} 
                      alt="Feature" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isRightAligned" 
                checked={leftRightItem.isRightAligned}
                onCheckedChange={(checked) => 
                  setLeftRightItem({...leftRightItem, isRightAligned: checked === true})
                }
              />
              <Label htmlFor="isRightAligned">Right-aligned (image appears on right)</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setLeftRightDialogOpen(false)}
              disabled={isUploading.leftRightImage}
            >
              Cancel
            </Button>
            <Button
              onClick={saveLeftRightItem}
              disabled={!leftRightItem.title || !leftRightItem.image || isUploading.leftRightImage}
            >
              {currentLeftRightIndex !== null ? "Update Item" : "Add Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog for Gallery Image */}
      <Dialog open={galleryDialogOpen} onOpenChange={setGalleryDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentGalleryIndex !== null ? "Edit Gallery Image" : "Add Gallery Image"}
            </DialogTitle>
            <DialogDescription>
              Add an image to the gallery with an optional title.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="galleryTitle">Title (Optional)</Label>
              <Input
                id="galleryTitle"
                value={galleryItem.title || ""}
                onChange={(e) => setGalleryItem({...galleryItem, title: e.target.value})}
                placeholder="e.g. Modern Design"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label>Image</Label>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Input 
                    value={galleryItem.image || ""}
                    onChange={(e) => setGalleryItem({...galleryItem, image: e.target.value})}
                    placeholder="Image URL"
                  />
                  <div>
                    <input
                      type="file"
                      ref={galleryImageFileInputRef}
                      onChange={handleGalleryImageUpload}
                      className="hidden"
                      accept="image/*"
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => galleryImageFileInputRef.current?.click()}
                      disabled={isUploading.galleryImage}
                      size="sm"
                    >
                      {isUploading.galleryImage ? "..." : "Upload"}
                    </Button>
                  </div>
                </div>
                {galleryItem.image && (
                  <div className="aspect-square border rounded overflow-hidden">
                    <img 
                      src={galleryItem.image} 
                      alt="Gallery" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setGalleryDialogOpen(false)}
              disabled={isUploading.galleryImage}
            >
              Cancel
            </Button>
            <Button
              onClick={saveGalleryItem}
              disabled={!galleryItem.image || isUploading.galleryImage}
            >
              {currentGalleryIndex !== null ? "Update Image" : "Add Image"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
  