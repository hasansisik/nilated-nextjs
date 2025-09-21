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
  getAllKalpler,
  createKalp, 
  updateKalp, 
  deleteKalp 
} from "@/redux/actions/kalpActions";
import { createGlobalCategory, getAllCategories } from "@/redux/actions/blogActions";
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

interface AdditionalSection {
  title?: string;
  description?: string;
  image?: string;
  order?: number;
  blogCategory?: string;
}

interface KalpContent {
  intro?: string;
  readTime?: string;
  author?: Author;
  mainImage?: string;
  fullContent?: string;
  bannerSectionTitle?: string;
  bannerSectionDescription?: string;
  additionalSections?: AdditionalSection[];
}

interface Kalp {
  id: number;
  _id?: string;
  title: string;
  description: string;
  image: string;
  content?: KalpContent;
}

export default function KalpEditor() {
  const dispatch = useDispatch<AppDispatch>();
  const { kalpler, loading, error, success, message } = useSelector(
    (state: RootState) => state.kalp
  );
  const { categories } = useSelector((state: RootState) => state.blog);
  
  const [filteredKalpler, setFilteredKalpler] = useState<Kalp[]>([]);
  const [notification, setNotification] = useState<{ type: string; message: string } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingKalpId, setEditingKalpId] = useState<string | number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const kalplerPerPage = 5;
  
  const thumbnailFileInputRef = useRef<HTMLInputElement>(null);
  const mainImageFileInputRef = useRef<HTMLInputElement>(null);
  
  // State for the current image upload target
  const [currentUploadTarget, setCurrentUploadTarget] = useState<{
    type: 'additionalSection';
    index: number;
    field?: 'image';
  } | null>(null);
  
  // Uploading state for images
  const [isUploading, setIsUploading] = useState({
    thumbnail: false,
    mainImage: false
  });
  
  // Uploading state for additional section images
  const [isUploadingAdditionalImage, setIsUploadingAdditionalImage] = useState(false);

  const initialFormState = {
    title: "",
    description: "",
    image: "",
    content: {
      intro: "",
      readTime: "",
      author: {
        name: "",
        avatar: "",
        date: ""
      },
      mainImage: "",
      fullContent: "",
      bannerSectionTitle: "",
      bannerSectionDescription: "",
      additionalSections: [] as AdditionalSection[]
    }
  };

  const [formData, setFormData] = useState(initialFormState);
  const [activeTab, setActiveTab] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [kalpToDelete, setKalpToDelete] = useState<string | null>(null);
  
  // Current index for editing sub-items
  const [currentAdditionalSectionIndex, setCurrentAdditionalSectionIndex] = useState<number | null>(null);

  // Additional states for modal dialogs
  const [additionalSectionDialogOpen, setAdditionalSectionDialogOpen] = useState(false);
  
  // Temporary state for editing items in modals
  const [additionalSectionItem, setAdditionalSectionItem] = useState<AdditionalSection>({
    title: '',
    description: '',
    image: '',
    order: 0,
    blogCategory: ''
  });

  // Load kalpler from Redux store
  useEffect(() => {
    dispatch(getAllKalpler());
  }, [dispatch]);

  // Load blog categories to keep them in sync
  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  // Check URL parameters for edit/new mode
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    const id = urlParams.get('id');
    
    if (mode === 'edit' && id) {
      const kalpToEdit = kalpler?.find((kalp: any) => 
        kalp._id === id || kalp.id === id
      );
      
      if (kalpToEdit) {
        handleEditKalp(id);
      }
    } else if (mode === 'new') {
      resetForm();
      setIsEditMode(false);
      setEditingKalpId(null);
      setActiveTab("add");
    }
  }, [kalpler]);

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

  // Filter kalpler when search term changes
  useEffect(() => {
    if (!kalpler) return;
    
    if (searchTerm.trim() === "") {
      setFilteredKalpler(kalpler);
    } else {
      const lowercasedFilter = searchTerm.toLowerCase();
      const filtered = kalpler.filter((kalp: any) => 
        kalp.title.toLowerCase().includes(lowercasedFilter) ||
        kalp.description?.toLowerCase().includes(lowercasedFilter)
      );
      setFilteredKalpler(filtered);
    }
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, kalpler]);

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
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(prev => ({ ...prev, mainImage: true }));
      const imageUrl = await uploadImageToCloudinary(file);
      setFormData(prev => ({ 
        ...prev, 
        content: {
          ...prev.content,
          mainImage: imageUrl
        }
      }));
      setIsUploading(prev => ({ ...prev, mainImage: false }));
      
      setNotification({
        type: "success",
        message: "Main image uploaded successfully!"
      });
    } catch (error) {
      console.error("Error uploading main image:", error);
      setIsUploading(prev => ({ ...prev, mainImage: false }));
      setNotification({
        type: "error",
        message: "Failed to upload main image. Please try again."
      });
    }
  };
  
  // Handle additional section image upload
  const handleAdditionalSectionImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploadingAdditionalImage(true);
      const imageUrl = await uploadImageToCloudinary(file);
      setAdditionalSectionItem(prev => ({ ...prev, image: imageUrl }));
      setIsUploadingAdditionalImage(false);
      
      setNotification({
        type: "success",
        message: "Section image uploaded successfully!"
      });
    } catch (error) {
      console.error("Error uploading section image:", error);
      setIsUploadingAdditionalImage(false);
      setNotification({
        type: "error",
        message: "Failed to upload section image. Please try again."
      });
    }
  };
  
  


  // Tab değiştiğinde form durumunu güncelle
  const handleTabChange = (value: string) => {
    if (value === "all" && isEditMode) {
      // All tabına geçerken edit modundan çıkıyorsak, edit durumunu temizle
      setIsEditMode(false);
      setEditingKalpId(null);
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
      mainImage: false
    });
    setCurrentAdditionalSectionIndex(null);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (
      !formData.title ||
      !formData.description ||
      !formData.image
    ) {
      setNotification({
        type: "error",
        message: "Please fill all required fields.",
      });
      return;
    }

    try {
      
      // Extract blog categories from additional sections
      const blogCategories = formData.content?.additionalSections
        ?.filter((section: any) => section.blogCategory && section.blogCategory.trim())
        .map((section: any) => section.blogCategory.trim()) || [];


      if (isEditMode && editingKalpId) {        
        // Update existing kalp
        const kalpData = {
          id: String(editingKalpId),
          title: formData.title,
          description: formData.description,
          image: formData.image,
          content: formData.content
        };

                
        // Dispatch update action
        await dispatch(updateKalp(kalpData)).unwrap();
        
        // Add blog categories if any
        if (blogCategories.length > 0) {
          try {
            await Promise.all(
              blogCategories.map(category => 
                dispatch(createGlobalCategory(category)).unwrap()
              )
            );
          } catch (categoryError) {
            console.warn('Some categories might already exist:', categoryError);
          }
        }
        
        // Reset edit mode
        setIsEditMode(false);
        setEditingKalpId(null);
        
        // Show success notification
        setNotification({
          type: "success",
          message: "Kalp updated successfully!"
        });
      } else {
        // Create new kalp
        const kalpData = {
          title: formData.title,
          description: formData.description,
          image: formData.image,
          content: formData.content
        };
                
        // Dispatch create action
        await dispatch(createKalp(kalpData)).unwrap();
        
        // Add blog categories if any
        if (blogCategories.length > 0) {
          try {
            await Promise.all(
              blogCategories.map(category => 
                dispatch(createGlobalCategory(category)).unwrap()
              )
            );
          } catch (categoryError) {
            console.warn('Some categories might already exist:', categoryError);
          }
        }
        
        // Show success notification
        setNotification({
          type: "success",
          message: "Kalp created successfully!"
        });
      }
      
      // Reset form
      resetForm();
      setActiveTab("all");
    } catch (error: any) {
      console.error('Error saving kalp:', error);
      
      // Özel hata mesajları için kontrol
      let errorMessage = error?.message || "Failed to save kalp. Please try again.";
      
      // Yetki hatası mesajları için daha kullanıcı dostu açıklamalar
      if (errorMessage.includes("yetkiniz yok") || errorMessage.includes("Bu işlemi yapmak için yetkiniz yok")) {
        errorMessage = "You don't have permission to edit this kalp. It may belong to another company or require admin/editor role.";
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
  const generateJsonDownload = (kalplerData: Kalp[]) => {
    const jsonString = JSON.stringify(kalplerData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kalpler_export.json';
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
        const importedKalpler = JSON.parse(event.target?.result as string) as Kalp[];
        
        // Save to server using our API
        const response = await fetch('/api/kalp/import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(importedKalpler),
        });
        
        if (!response.ok) {
          throw new Error('Failed to import kalp posts');
        }
        
        // Fetch kalpler again instead of trying to pass data to action
        dispatch(getAllKalpler());
        setFilteredKalpler(importedKalpler);
        setNotification({
          type: "success",
          message: "Kalp posts imported successfully!",
        });
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Error importing kalp posts:', error);
      setNotification({
        type: "error",
        message: "Failed to import kalp posts. Invalid JSON format.",
      });
    }
  };

  // Delete kalp handler
  const handleDeleteKalp = async (kalpId: string | number) => {
    // Ensure we're using the MongoDB _id if available
    const idToDelete = typeof kalpId === 'object' && kalpId !== null ? 
      (kalpId as any)._id || kalpId : 
      kalpId;
    
    setKalpToDelete(String(idToDelete));
    setDeleteDialogOpen(true);
  };

  // Confirm delete kalp
  const confirmDelete = async () => {
    if (!kalpToDelete) return;
    
    try {
      await dispatch(deleteKalp(kalpToDelete)).unwrap();
      setDeleteDialogOpen(false);
      setKalpToDelete(null);
    } catch (error: any) {
      console.error('Error deleting kalp:', error);
      setNotification({
        type: "error",
        message: error?.message || "Failed to delete kalp. Please try again.",
      });
    }
  };

  // Edit kalp handler
  const handleEditKalp = (kalpId: string | number) => {    
    // kalpId'yi string'e çevirelim
    const kalpIdStr = String(kalpId);
    
    const kalpToEdit = kalpler?.find((kalp: any) => {
      // _id veya id eşleşmesini kontrol edelim
      const idMatch = kalp._id === kalpIdStr || kalp._id === kalpId || kalp.id === kalpId;
      return idMatch;
    });
    
    if (!kalpToEdit) {
      console.error(`ID: ${kalpIdStr} ile eşleşen kalp bulunamadı`);
      setNotification({
        type: "error",
        message: `Kalp with ID ${kalpIdStr} not found`
      });
      return;
    }

    // Set form data
    setFormData({
      title: kalpToEdit.title || "",
      description: kalpToEdit.description || "",
      image: kalpToEdit.image || "",
      content: {
        intro: kalpToEdit.content?.intro || "",
        readTime: kalpToEdit.content?.readTime || "",
        author: {
          name: kalpToEdit.content?.author?.name || "",
          avatar: kalpToEdit.content?.author?.avatar || "",
          date: kalpToEdit.content?.author?.date || ""
        },
        mainImage: kalpToEdit.content?.mainImage || "",
        fullContent: kalpToEdit.content?.fullContent || "",
        bannerSectionTitle: kalpToEdit.content?.bannerSectionTitle || "",
        bannerSectionDescription: kalpToEdit.content?.bannerSectionDescription || "",
        additionalSections: kalpToEdit.content?.additionalSections?.map((section: any) => ({
          title: section.title || '',
          description: section.description || '',
          image: section.image || '',
          order: section.order || 0,
          blogCategory: section.blogCategory || ''
        })) || []
      }
    });
    
    // MongoDB ObjectId değerini öncelikli olarak kullan
    const editId = kalpToEdit._id || kalpId;
    
    // Set edit mode
    setIsEditMode(true);
    setEditingKalpId(editId);
    setActiveTab("add");
    
    // URL'yi güncelle - URL için sayısal ID kullanmaya devam ediyoruz
    const urlId = typeof kalpId === "number" ? kalpId :
                 !isNaN(parseInt(String(kalpId))) ? parseInt(String(kalpId)) : 0;
    updateURL('edit', urlId);
    
    // Reset uploading states
    setIsUploading({
      thumbnail: false,
      mainImage: false
    });
  };

  // New kalp handler
  const handleNewKalp = () => {
    resetForm();
    setIsEditMode(false);
    setEditingKalpId(null);
    setActiveTab("add");
    
    // URL'yi güncelle
    updateURL('new');
  };

  // Pagination logic
  const indexOfLastKalp = currentPage * kalplerPerPage;
  const indexOfFirstKalp = indexOfLastKalp - kalplerPerPage;
  const currentKalpler = filteredKalpler.slice(indexOfFirstKalp, indexOfLastKalp);
  const totalPages = Math.ceil(filteredKalpler.length / kalplerPerPage);

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

  // Modal functions for additional sections
  const openAdditionalSectionDialog = (index?: number) => {
    if (index !== undefined) {
      setCurrentAdditionalSectionIndex(index);
      const existingSection = formData.content?.additionalSections?.[index];

      
      setAdditionalSectionItem({
        title: existingSection?.title || '',
        description: existingSection?.description || '',
        image: existingSection?.image || '',
        order: existingSection?.order || 0,
        blogCategory: existingSection?.blogCategory || ''
      });
    } else {
      setCurrentAdditionalSectionIndex(null);
      setAdditionalSectionItem({
        title: '',
        description: '',
        image: '',
        order: formData.content?.additionalSections?.length || 0,
        blogCategory: ''
      });
    }
    setAdditionalSectionDialogOpen(true);
  };

  const saveAdditionalSectionItem = () => {
    // Validate required fields
    if (!additionalSectionItem.title) {
      setNotification({
        type: "error",
        message: "Title is required."
      });
      return;
    }
    
    if (currentAdditionalSectionIndex !== null) {
      // Update existing item
      const updatedItems = [...(formData.content?.additionalSections || [])];
      updatedItems[currentAdditionalSectionIndex] = additionalSectionItem;
      
      setFormData(prev => ({ 
        ...prev, 
        content: {
          ...prev.content,
          additionalSections: updatedItems
        }
      }));
    } else {
      // Add new item
      setFormData(prev => ({
        ...prev,
        content: {
          ...prev.content,
          additionalSections: [...(prev.content?.additionalSections || []), additionalSectionItem]
        }
      }));
    }
    
    setAdditionalSectionDialogOpen(false);
  };

  const deleteAdditionalSectionItem = (index: number) => {
    const updatedItems = [...(formData.content?.additionalSections || [])];
    updatedItems.splice(index, 1);
    
    // Update order values
    const reorderedItems = updatedItems.map((item, idx) => ({
      ...item,
      order: idx
    }));
    
    setFormData(prev => ({ 
      ...prev, 
      content: {
        ...prev.content,
        additionalSections: reorderedItems
      }
    }));
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
                <BreadcrumbPage>Kalp Management</BreadcrumbPage>
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
              <h2 className="text-xl font-bold">All Kalpler</h2>
              
              <div className="flex gap-2 items-center">
                <div className="w-full md:w-auto">
                  <Input
                    placeholder="Search kalpler by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => generateJsonDownload(kalpler)} 
                  title="Export current kalpler"
                >
                  Export
                </Button>
                
                <Button 
                  variant="default" 
                  onClick={handleNewKalp} 
                  title="Create a new kalp"
                >
                  New Kalp
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              {!loading ? (
                <Table>
                  <TableCaption>A list of your kalpler.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredKalpler.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4">
                          No kalpler found. {searchTerm && "Try a different search term."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentKalpler.map((kalp) => (
                        <TableRow key={kalp._id || kalp.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {kalp.image && (
                                <div className="relative w-10 h-10 rounded-md overflow-hidden">
                                  <img 
                                    src={kalp.image} 
                                    alt={kalp.title}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                              )}
                              <span className="line-clamp-1">{kalp.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="line-clamp-2 text-sm text-gray-600">
                              {kalp.description}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/kalp/${slugify(kalp.title)}`} target="_blank">
                                <Button variant="outline" size="icon" title="View Kalp">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => handleEditKalp(kalp._id || kalp.id)}
                                title="Edit Kalp"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="icon"
                                onClick={() => handleDeleteKalp(kalp._id || kalp.id)}
                                disabled={loading}
                                title="Delete Kalp"
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
                {isEditMode ? `Edit Kalp: ${formData.title}` : "Create New Kalp"}
              </h2>
              <Button 
                variant="outline" 
                onClick={() => {
                  if (isEditMode) {
                    setIsEditMode(false);
                    setEditingKalpId(null);
                    // URL'yi temizle
                    window.history.pushState({}, '', window.location.pathname);
                  }
                  resetForm();
                  setActiveTab("all");
                }}
                disabled={loading}
              >
                Back to Kalpler
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
                          Editing kalp ID: {editingKalpId}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-2 ">
                      <div className="space-y-1">
                        <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                        <Input 
                          id="title" 
                          placeholder="Enter kalp title" 
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          className="h-9"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                        <RichTextEditor
                          content={formData.description}
                          onChange={(html) => setFormData({...formData, description: html})}
                          placeholder="Brief description of the kalp"
                          className="min-h-[200px]"
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
                      <CardTitle className="text-base font-medium">Additional Content Sections</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Add flexible content sections with images and descriptions
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-sm font-medium">Additional Sections</Label>
                          <Button 
                            type="button" 
                            size="sm" 
                            onClick={() => openAdditionalSectionDialog()}
                            variant="outline"
                          >
                            <Plus className="h-4 w-4 mr-1" /> Add Section
                          </Button>
                        </div>
                        
                        {(!formData.content?.additionalSections || formData.content.additionalSections.length === 0) ? (
                          <div className="text-center p-4 border border-dashed rounded-md text-muted-foreground">
                            No additional sections added yet. Click "Add Section" to create one.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {formData.content.additionalSections.map((section, index) => (
                              <div 
                                key={index} 
                                className="flex items-center justify-between p-3 border rounded-md"
                              >
                                <div className="flex items-center gap-3">
                                  {section.image && (
                                    <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                                      <img 
                                        src={section.image} 
                                        alt={section.title || `Section ${index + 1}`}
                                        className="object-cover w-full h-full"
                                      />
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-medium">{section.title || `Section ${index + 1}`}</p>
                                    {section.description && (
                                      <p className="text-sm text-muted-foreground line-clamp-1">{section.description}</p>
                                    )}
                                    {section.blogCategory && (
                                      <p className="text-xs text-blue-600 font-medium mt-1">
                                        Category: {section.blogCategory}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <Button 
                                    type="button" 
                                    size="icon" 
                                    variant="ghost" 
                                    onClick={() => openAdditionalSectionDialog(index)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    type="button" 
                                    size="icon" 
                                    variant="ghost" 
                                    onClick={() => deleteAdditionalSectionItem(index)}
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
                            setEditingKalpId(null);
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
                            isEditMode ? "Update Kalp" : "Create Kalp"
                          )}
                        </Button>
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
              Are you sure you want to delete this kalp? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setKalpToDelete(null);
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
      
      {/* Dialog for Additional Section */}
      <Dialog open={additionalSectionDialogOpen} onOpenChange={setAdditionalSectionDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentAdditionalSectionIndex !== null ? "Edit Additional Section" : "Add Additional Section"}
            </DialogTitle>
            <DialogDescription>
              Add a content section with title, description, and optional image.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="additionalSectionTitle">Title</Label>
              <Input
                id="additionalSectionTitle"
                value={additionalSectionItem.title || ""}
                onChange={(e) => setAdditionalSectionItem({...additionalSectionItem, title: e.target.value})}
                placeholder="e.g. Our Process"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="additionalSectionDescription">Description (Optional)</Label>
              <Textarea
                id="additionalSectionDescription"
                value={additionalSectionItem.description || ""}
                onChange={(e) => setAdditionalSectionItem({...additionalSectionItem, description: e.target.value})}
                placeholder="Description for this section"
                className="h-20"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="additionalSectionImage">Image (Optional)</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    id="additionalSectionImage"
                    value={additionalSectionItem.image || ""}
                    onChange={(e) => setAdditionalSectionItem({...additionalSectionItem, image: e.target.value})}
                    placeholder="URL for section image"
                  />
                </div>
                <div>
                  <input
                    type="file"
                    onChange={handleAdditionalSectionImageUpload}
                    className="hidden"
                    accept="image/*"
                    id="additionalSectionImageFile"
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => document.getElementById('additionalSectionImageFile')?.click()}
                    disabled={isUploadingAdditionalImage}
                    size="sm"
                  >
                    {isUploadingAdditionalImage ? "Uploading..." : "Upload"}
                  </Button>
                </div>
              </div>
              {additionalSectionItem.image && (
                <div className="mt-3 relative w-1/2 mx-auto aspect-video rounded-md overflow-hidden border">
                  <img 
                    src={additionalSectionItem.image} 
                    alt="Section preview" 
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="additionalSectionBlogCategory">Blog Category (Optional)</Label>
              <div className="space-y-2">
                <Input
                  id="additionalSectionBlogCategory"
                  value={additionalSectionItem.blogCategory || ""}
                  onChange={(e) => setAdditionalSectionItem({...additionalSectionItem, blogCategory: e.target.value})}
                  placeholder="e.g. Technology, Health, Business"
                />
                
                {/* Debug info - remove in production */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                    Debug: Current blogCategory = "{additionalSectionItem.blogCategory}"
                  </div>
                )}
                
                {/* Available categories */}
                {categories && categories.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-600">Available Categories:</p>
                    <div className="flex flex-wrap gap-1">
                      {categories.map((category: string, index: number) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setAdditionalSectionItem({...additionalSectionItem, blogCategory: category})}
                          className={`px-2 py-1 text-xs rounded border ${
                            additionalSectionItem.blogCategory === category 
                              ? 'bg-blue-100 border-blue-300 text-blue-700' 
                              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">
                This will be used to filter related blog posts when users click on this section.
              </p>
            </div>
            
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAdditionalSectionDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={saveAdditionalSectionItem}
              disabled={!additionalSectionItem.title}
            >
              {currentAdditionalSectionIndex !== null ? "Update Section" : "Add Section"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
  
  