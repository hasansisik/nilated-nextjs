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
    getAllServices, 
    getAllCategories,
    createService, 
    updateService, 
    deleteService 
  } from "@/redux/actions/serviceActions";
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
  intro: string;
  readTime: string;
  author: Author;
  mainImage: string;
  fullContent: string;
}

interface Project {
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

export default function ProjectEditor() {
  const dispatch = useDispatch<AppDispatch>();
  const { services, categories, loading, error, success, message } = useSelector(
    (state: RootState) => state.service
  );
  
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [notification, setNotification] = useState<{ type: string; message: string } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 5;
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mainImageFileInputRef = useRef<HTMLInputElement>(null);
  const jsonFileInputRef = useRef<HTMLInputElement>(null);
  
  // Uploading state for images
  const [isUploading, setIsUploading] = useState({
    thumbnail: false,
    mainImage: false
  });

  const initialFormState = {
    title: "",
    description: "",
    image: "",
    company: "",
    subtitle: "",
    fullDescription: "",
    tag: "",
    categories: [] as string[],
    category: "",
    intro: "",
    fullContent: "",
    mainImage: "",
    author: "",
    authorAvatar: "/assets/imgs/blog-4/avatar.png",
    readTime: "3 dakika",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [activeTab, setActiveTab] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  // Load projects from Redux store
  useEffect(() => {
    dispatch(getAllServices());
    dispatch(getAllCategories());
  }, [dispatch]);

  // Başlangıçta URL parametrelerine göre edit/new mod seçimi
  useEffect(() => {
    // URL'den mode ve id değerlerini al
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    const id = urlParams.get('id');
    
    if (mode === 'edit' && id) {
      // Edit modu ve ID varsa, projeyi düzenleme moduna geç
      const projectId = parseInt(id);
      const projectToEdit = services.find((project: any) => 
        project._id === id || project.id === projectId
      );
      
      if (projectToEdit) {
        handleEditProject(projectId);
      }
    } else if (mode === 'new') {
      // Yeni oluşturma modu ise, formu sıfırla ve add tabına geç
      resetForm();
      setIsEditMode(false);
      setEditingProjectId(null);
      setActiveTab("add");
    }
  }, [services]); // services değiştiğinde tekrar kontrol et

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

  // Filter projects when search term changes
  useEffect(() => {
    if (!services) return;
    
    if (searchTerm.trim() === "") {
      setFilteredProjects(services);
    } else {
      const lowercasedFilter = searchTerm.toLowerCase();
      const filtered = services.filter((project: any) => 
        project.title.toLowerCase().includes(lowercasedFilter) ||
        project.categories?.some((cat: string) => cat.toLowerCase().includes(lowercasedFilter)) ||
        project.company?.toLowerCase().includes(lowercasedFilter) ||
        project.tag?.toLowerCase().includes(lowercasedFilter)
      );
      setFilteredProjects(filtered);
    }
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, services]);

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
      setFormData(prev => ({ ...prev, mainImage: imageUrl }));
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
      setEditingProjectId(null);
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
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (
      !formData.title ||
      !formData.description ||
      !formData.image ||
      formData.categories.length === 0 ||
      !formData.company
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
        intro: formData.intro || "",
        readTime: formData.readTime || "5 mins",
        author: {
          name: formData.author || "Admin",
          avatar: formData.authorAvatar || "/assets/imgs/blog-4/avatar.png",
          date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
        },
        mainImage: formData.mainImage || formData.image,
        fullContent: formData.fullContent || ""
      };

      if (isEditMode && editingProjectId) {        
        // İd'nin string olduğundan emin olalım
        const idString = String(editingProjectId);
        
        // MongoDB Object ID formatını kontrol edelim (24 karakter hexadecimal)
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(idString);
        
        // Update existing project
        const serviceData = {
          id: idString,
          title: formData.title,
          description: formData.description,
          image: formData.image,
          categories: formData.categories,
          company: formData.company,
          subtitle: formData.subtitle || "",
          fullDescription: formData.fullDescription || "",
          tag: formData.tag || "",
          content: contentObject
        };
                
        // Dispatch update action
        await dispatch(updateService(serviceData)).unwrap();
        
        // Reset edit mode
        setIsEditMode(false);
        setEditingProjectId(null);
        
        // Show success notification
        setNotification({
          type: "success",
          message: "Project updated successfully!"
        });
      } else {
        
        // Create new project
        const serviceData = {
          title: formData.title,
          description: formData.description,
          image: formData.image,
          categories: formData.categories,
          company: formData.company,
          subtitle: formData.subtitle || "",
          fullDescription: formData.fullDescription || "",
          tag: formData.tag || "",
          content: contentObject
        };
                
        // Dispatch create action
        await dispatch(createService(serviceData)).unwrap();
        
        // Show success notification
        setNotification({
          type: "success",
          message: "Project created successfully!"
        });
      }
      
      // Reset form
      resetForm();
      setActiveTab("all");
    } catch (error: any) {
      console.error('Error saving project:', error);
      
      // Özel hata mesajları için kontrol
      let errorMessage = error?.message || "Failed to save project. Please try again.";
      
      // Yetki hatası mesajları için daha kullanıcı dostu açıklamalar
      if (errorMessage.includes("yetkiniz yok") || errorMessage.includes("Bu işlemi yapmak için yetkiniz yok")) {
        errorMessage = "You don't have permission to edit this project. It may belong to another company or require admin/editor role.";
      } else if (errorMessage.includes("Oturum süresi dolmuş") || errorMessage.includes("token")) {
        errorMessage = "Your session has expired. Please log out and log in again.";
      }
      
      setNotification({
        type: "error",
        message: errorMessage
      });
    }
  };

  // Add function to generate and trigger download of JSON file
  const generateJsonDownload = (updatedProjects: Project[]) => {
    // Create a full projects object including categories
    const fullProjectsData = {
      categories: categories,
      projects: updatedProjects
    };
    
    const jsonString = JSON.stringify(fullProjectsData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'updated_projects.json';
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
        const importedProjects = JSON.parse(event.target?.result as string) as Project[];
        
        // Save to server using our API
        const response = await fetch('/api/projects/import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(importedProjects),
        });
        
        if (!response.ok) {
          throw new Error('Failed to import project posts');
        }
        
        // Fetch services again instead of trying to pass data to action
        dispatch(getAllServices());
        setFilteredProjects(importedProjects);
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

  // Delete project handler
  const handleDeleteProject = async (projectId: string | number) => {
    // Ensure we're using the MongoDB _id if available
    const idToDelete = typeof projectId === 'object' && projectId !== null ? 
      (projectId as any)._id || projectId : 
      projectId;
    
    setProjectToDelete(String(idToDelete));
    setDeleteDialogOpen(true);
  };

  // Confirm delete project
  const confirmDelete = async () => {
    if (!projectToDelete) return;
    
    try {
      await dispatch(deleteService(projectToDelete)).unwrap();
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    } catch (error: any) {
      console.error('Error deleting project:', error);
      setNotification({
        type: "error",
        message: error?.message || "Failed to delete project. Please try again.",
      });
    }
  };

  // Edit project handler
  const handleEditProject = (projectId: string | number) => {    
    // projectId'yi string'e çevirelim ve konsola yazdıralım
    const projectIdStr = String(projectId);
    
    const projectToEdit = services.find((project: any) => {
      // _id veya id eşleşmesini kontrol edelim ve konsola yazdıralım
      const idMatch = project._id === projectIdStr || project._id === projectId || project.id === projectId;
      return idMatch;
    });
    
    if (!projectToEdit) {
      console.error(`ID: ${projectIdStr} ile eşleşen proje bulunamadı`);
      setNotification({
        type: "error",
        message: `Project with ID ${projectIdStr} not found`
      });
      return;
    }
    
    // Set form data
    setFormData({
      title: projectToEdit.title || "",
      description: projectToEdit.description || "",
      image: projectToEdit.image || "",
      categories: Array.isArray(projectToEdit.categories) ? projectToEdit.categories : [],
      category: "",
      company: projectToEdit.company || "",
      subtitle: projectToEdit.subtitle || "",
      fullDescription: projectToEdit.fullDescription || "",
      tag: projectToEdit.tag || "",
      intro: projectToEdit.content?.intro || "",
      fullContent: projectToEdit.content?.fullContent || "",
      mainImage: projectToEdit.content?.mainImage || "",
      author: projectToEdit.content?.author?.name || "",
      authorAvatar: projectToEdit.content?.author?.avatar || "/assets/imgs/blog-4/avatar.png",
      readTime: projectToEdit.content?.readTime || "3 dakika",
    });
    
    // MongoDB ObjectId değerini öncelikli olarak kullan
    const editId = projectToEdit._id || projectId;
    
    // Set edit mode
    setIsEditMode(true);
    setEditingProjectId(editId);
    setActiveTab("add");
    
    // URL'yi güncelle - URL için sayısal ID kullanmaya devam ediyoruz
    const urlId = typeof projectId === "number" ? projectId : 
                 !isNaN(parseInt(String(projectId))) ? parseInt(String(projectId)) : 0;
    updateURL('edit', urlId);
    
    // Reset uploading states
    setIsUploading({
      thumbnail: false,
      mainImage: false
    });
  };

  // New project handler
  const handleNewProject = () => {
    resetForm();
    setIsEditMode(false);
    setEditingProjectId(null);
    setActiveTab("add");
    
    // URL'yi güncelle
    updateURL('new');
  };

  // Pagination logic
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

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
                <BreadcrumbPage>Project Management</BreadcrumbPage>
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
              <h2 className="text-xl font-bold">All Projects</h2>
              
              <div className="flex gap-2 items-center">
                <div className="w-full md:w-auto">
                  <Input
                    placeholder="Search projects by title, category, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => generateJsonDownload(services)} 
                  title="Export current projects"
                >
                  Export
                </Button>
                
                <Button 
                  variant="default" 
                  onClick={handleNewProject} 
                  title="Create a new project"
                >
                  New Project
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              {!loading ? (
                <Table>
                  <TableCaption>A list of your projects.</TableCaption>
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
                    {filteredProjects.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          No projects found. {searchTerm && "Try a different search term."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentProjects.map((project) => (
                        <TableRow key={project._id || project.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {project.image && (
                                <div className="relative w-10 h-10 rounded-md overflow-hidden">
                                  <img 
                                    src={project.image} 
                                    alt={project.title}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                              )}
                              <span className="line-clamp-1">{project.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {Array.isArray(project.categories) && project.categories.map((cat: string, i: number) => (
                                <Badge key={i} variant="outline">{cat}</Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{project.company}</TableCell>
                          <TableCell>
                            <Badge>{project.tag || 'Project'}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/${slugify(project.title)}`} target="_blank">
                                <Button variant="outline" size="icon" title="View Project">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => handleEditProject(project._id || project.id)}
                                title="Edit Project"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="icon"
                                onClick={() => handleDeleteProject(project._id || project.id)}
                                disabled={loading}
                                title="Delete Project"
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
                {isEditMode ? `Edit Project: ${formData.title}` : "Create New Project"}
              </h2>
              <Button 
                variant="outline" 
                onClick={() => {
                  if (isEditMode) {
                    setIsEditMode(false);
                    setEditingProjectId(null);
                    // URL'yi temizle
                    window.history.pushState({}, '', window.location.pathname);
                  }
                  resetForm();
                  setActiveTab("all");
                }}
                disabled={loading}
              >
                Back to Projects
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
                          Editing project ID: {editingProjectId}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-2 ">
                      <div className="space-y-1">
                        <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                        <Input 
                          id="title" 
                          placeholder="Enter project title" 
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          className="h-9"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="description" className="text-sm font-medium">Short Description</Label>
                        <Textarea 
                          id="description" 
                          placeholder="Brief description of the project"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          className="min-h-[70px]"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="company" className="text-sm font-medium">Company</Label>
                          <Input 
                            id="company" 
                            placeholder="Company name" 
                            value={formData.company}
                            onChange={(e) => setFormData({...formData, company: e.target.value})}
                            className="h-9"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="tag" className="text-sm font-medium">Tag</Label>
                          <Input 
                            id="tag" 
                            placeholder="e.g. Software Development" 
                            value={formData.tag}
                            onChange={(e) => setFormData({...formData, tag: e.target.value})}
                            className="h-9"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="subtitle" className="text-sm font-medium">Subtitle</Label>
                          <Input 
                            id="subtitle" 
                            placeholder="Project subtitle" 
                            value={formData.subtitle}
                            onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                            className="h-9"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="fullDescription" className="text-sm font-medium">Full Description</Label>
                          <Textarea 
                            id="fullDescription" 
                            placeholder="Detailed description" 
                            value={formData.fullDescription}
                            onChange={(e) => setFormData({...formData, fullDescription: e.target.value})}
                            className="min-h-[70px]"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-sm">
                    <CardHeader className="">
                      <CardTitle className="text-base font-medium">Additional Content (Optional)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 ">
                      <div className="space-y-1">
                        <Label htmlFor="intro" className="text-sm font-medium">Introduction</Label>
                        <RichTextEditor
                          content={formData.intro}
                          onChange={(html) => setFormData({ ...formData, intro: html })}
                          className="min-h-[150px]"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="fullContent" className="text-sm font-medium">Main Content</Label>
                        <RichTextEditor
                          content={formData.fullContent}
                          onChange={(html) => setFormData({ ...formData, fullContent: html })}
                          className="min-h-[350px]"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="author" className="text-sm font-medium">Author (Optional)</Label>
                          <Input 
                            id="author" 
                            placeholder="Author name" 
                            value={formData.author}
                            onChange={(e) => setFormData({...formData, author: e.target.value})}
                            className="h-9"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="readTime" className="text-sm font-medium">Read Time</Label>
                          <Input 
                            id="readTime" 
                            placeholder="3 dakika" 
                            value={formData.readTime}
                            onChange={(e) => setFormData({...formData, readTime: e.target.value})}
                            className="h-9"
                          />
                        </div>
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
                            setEditingProjectId(null);
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
                            isEditMode ? "Update Project" : "Create Project"
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-sm">
                    <CardHeader className="pb-2 pt-3">
                      <CardTitle className="text-base font-medium">Thumbnail Image</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-1">
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Input 
                              id="image" 
                              placeholder="/assets/imgs/project-2/img-1.png" 
                              value={formData.image}
                              onChange={(e) => setFormData({...formData, image: e.target.value})}
                              className="h-9"
                            />
                          </div>
                          <div>
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleThumbnailUpload}
                              className="hidden"
                              accept="image/*"
                            />
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={isUploading.thumbnail}
                              size="sm"
                              className="h-9"
                            >
                              {isUploading.thumbnail ? "Uploading..." : "Upload"}
                            </Button>
                          </div>
                        </div>
                        {formData.image && (
                          <div className="mt-3 relative w-full aspect-video rounded-md overflow-hidden border">
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
                    <CardHeader className="">
                      <CardTitle className="text-base font-medium">Main Banner Image (Optional)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-0 ">
                      <div className="space-y-1">
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Input 
                              id="mainImage" 
                              placeholder="/assets/imgs/blog-details/img-1.png" 
                              value={formData.mainImage}
                              onChange={(e) => setFormData({...formData, mainImage: e.target.value})}
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
                        {formData.mainImage && (
                          <div className="mt-3 relative w-full aspect-video rounded-md overflow-hidden border">
                            <img 
                              src={formData.mainImage} 
                              alt="Main image preview" 
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}
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
              Are you sure you want to delete this project? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setProjectToDelete(null);
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
    </>
  );
}
  