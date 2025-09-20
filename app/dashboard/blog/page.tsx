"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getAllCategories,
  createGlobalCategory,
  deleteGlobalCategory,
  getAllAuthors,
  createGlobalAuthor,
  updateGlobalAuthor,
  deleteGlobalAuthor
} from "@/redux/actions/blogActions";
import {
  Loader2,
  Trash2,
  Pencil,
  Eye,
  Plus,
  FileJson,
  Download,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Section {
  title: string;
  content: string;
}

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

interface Post {
  id: number;
  _id?: string;
  title: string;
  image: string;
  category: string[] | string;
  description: string;
  content: Content;
  link: string;
  author: string;
  date: string;
  premium?: boolean;
}

// Function to convert title to slug
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

export default function BlogEditor() {
  const dispatch = useDispatch<AppDispatch>();
  const { blogs, categories, authors, loading, categoryLoading, authorLoading, error, success, message } = useSelector(
    (state: RootState) => state.blog
  );

  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [notification, setNotification] = useState<{
    type: string;
    message: string;
  } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mainImageFileInputRef = useRef<HTMLInputElement>(null);
  const jsonFileInputRef = useRef<HTMLInputElement>(null);

  // Uploading state for images
  const [isUploading, setIsUploading] = useState({
    thumbnail: false,
    mainImage: false,
  });

  const initialFormState = {
    title: "",
    description: "",
    image: "",
    category: "",
    categories: [] as string[],
    author: "",
    authorAvatar: "/assets/imgs/blog-4/avatar.png",
    readTime: "3 dakika",
    intro: "",
    fullContent: "",
    mainImage: "",
    premium: false,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [activeTab, setActiveTab] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [authorDialogOpen, setAuthorDialogOpen] = useState(false);
  const [newAuthorData, setNewAuthorData] = useState({ name: "", avatar: "", bio: "" });
  const [editingAuthor, setEditingAuthor] = useState<any>(null);

  // Load blogs from Redux store
  useEffect(() => {
    dispatch(getAllBlogs());
  }, [dispatch]);

  // Load categories from Redux store
  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  // Load authors from Redux store
  useEffect(() => {
    dispatch(getAllAuthors());
  }, [dispatch]);

  // Update filtered posts when blogs or search term changes
  useEffect(() => {
    if (!blogs) return;

    if (searchTerm.trim() === "") {
      setFilteredPosts(blogs);
    } else {
      const lowercasedFilter = searchTerm.toLowerCase();
      const filtered = blogs.filter(
        (post: any) =>
          post.title.toLowerCase().includes(lowercasedFilter) ||
          (typeof post.category === "string"
            ? post.category.toLowerCase().includes(lowercasedFilter)
            : post.category.some((cat: string) =>
                cat.toLowerCase().includes(lowercasedFilter)
              )) ||
          post.author.toLowerCase().includes(lowercasedFilter)
      );
      setFilteredPosts(filtered);
    }
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, blogs]);

  // Show notifications when Redux state changes
  useEffect(() => {
    if (success && message) {
      setNotification({
        type: "success",
        message: message,
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
        message: error,
      });
    }
  }, [success, message, error]);

  // Handle image uploads
  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading((prev) => ({ ...prev, thumbnail: true }));
      const imageUrl = await uploadImageToCloudinary(file);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
      setIsUploading((prev) => ({ ...prev, thumbnail: false }));

      setNotification({
        type: "success",
        message: "Thumbnail image uploaded successfully!",
      });
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      setIsUploading((prev) => ({ ...prev, thumbnail: false }));
      setNotification({
        type: "error",
        message: "Failed to upload thumbnail image. Please try again.",
      });
    }
  };

  const handleMainImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading((prev) => ({ ...prev, mainImage: true }));
      const imageUrl = await uploadImageToCloudinary(file);
      setFormData((prev) => ({ ...prev, mainImage: imageUrl }));
      setIsUploading((prev) => ({ ...prev, mainImage: false }));

      setNotification({
        type: "success",
        message: "Main image uploaded successfully!",
      });
    } catch (error) {
      console.error("Error uploading main image:", error);
      setIsUploading((prev) => ({ ...prev, mainImage: false }));
      setNotification({
        type: "error",
        message: "Failed to upload main image. Please try again.",
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

  // Reset form to initial state
  const resetForm = () => {
    // Don't reset edit mode state here - let the caller handle it
    setFormData(initialFormState);
    setIsUploading({
      thumbnail: false,
      mainImage: false,
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
      !formData.author ||
      !formData.intro ||
      !formData.mainImage
    ) {
      setNotification({
        type: "error",
        message: "Please fill all required fields and select an author.",
      });
      return;
    }

    try {
      if (isEditMode && editingPostId) {
        // Update existing post
        const updatedPost = {
          title: formData.title,
          image: formData.image,
          description: formData.description,
          category: formData.categories,
          author: formData.author,
          premium: formData.premium,
          content: {
            intro: formData.intro,
            readTime: formData.readTime,
            author: {
              name: formData.author,
              avatar: formData.authorAvatar,
              date: new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
            },
            mainImage: formData.mainImage,
            fullContent: formData.fullContent || "",
          },
        };

        // Log the ID being used for update to debug

        // Ensure we're using a string ID for MongoDB
        const mongoId = String(editingPostId);

        // Dispatch update action with the correct ID format
        await dispatch(
          updateBlog({
            id: mongoId,
            ...updatedPost,
          })
        ).unwrap();

        // Reset edit mode
        setIsEditMode(false);
        setEditingPostId(null);

        // Show success notification
        setNotification({
          type: "success",
          message: "Blog post updated successfully!",
        });
      } else {
        // Create new post
        const newPostData = {
          title: formData.title,
          image: formData.image,
          description: formData.description,
          category: formData.categories,
          author: formData.author,
          premium: formData.premium,
          content: {
            intro: formData.intro,
            readTime: formData.readTime,
            author: {
              name: formData.author,
              avatar: formData.authorAvatar,
              date: new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
            },
            mainImage: formData.mainImage,
            fullContent: formData.fullContent || "",
          },
        };

        // Dispatch create action
        await dispatch(createBlog(newPostData)).unwrap();

        // Show success notification
        setNotification({
          type: "success",
          message: "Blog post created successfully!",
        });
      }

      // Reset form
      resetForm();

      // Explicitly set the active tab to "all" to return to the list view
      setActiveTab("all");
    } catch (error: any) {
      console.error("Error saving blog post:", error);
      setNotification({
        type: "error",
        message:
          error?.message || "Failed to save blog post. Please try again.",
      });
    }
  };

  // Add function to generate and trigger download of JSON file
  const generateJsonDownload = (updatedPosts: Post[]) => {
    const jsonString = JSON.stringify(updatedPosts, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "updated_blog.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // Add function to handle blog.json import
  const handleImportJson = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const importedPosts = JSON.parse(
          event.target?.result as string
        ) as Post[];

        // Save to server using our API
        const response = await fetch("/api/blog/import", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(importedPosts),
        });

        if (!response.ok) {
          throw new Error("Failed to import blog posts");
        }

        // Fetch blogs again
        dispatch(getAllBlogs());
        setFilteredPosts(importedPosts);
        setNotification({
          type: "success",
          message: "Blog posts imported successfully!",
        });
      };
      reader.readAsText(file);
    } catch (error) {
      console.error("Error importing blog posts:", error);
      setNotification({
        type: "error",
        message: "Failed to import blog posts. Invalid JSON format.",
      });
    }
  };

  // Edit post handler
  const handleEditPost = (postId: number | string) => {
    const postToEdit = blogs.find(
      (post: any) => post._id === postId || post.id === postId
    );
    if (!postToEdit) {
      console.error("Post not found with ID:", postId);
      return;
    }

    // Set form data
    setFormData({
      title: postToEdit.title,
      description: postToEdit.description,
      image: postToEdit.image,
      category: "",
      categories: Array.isArray(postToEdit.category)
        ? postToEdit.category
        : [postToEdit.category],
      author: postToEdit.author,
      authorAvatar: postToEdit.content.author.avatar || "/assets/imgs/blog-4/avatar.png",
      readTime: postToEdit.content.readTime,
      intro: postToEdit.content.intro,
      fullContent: postToEdit.content.fullContent || "",
      mainImage: postToEdit.content.mainImage,
      premium: postToEdit.premium || false,
    });

    // Set edit mode with the correct MongoDB ID
    setIsEditMode(true);
    // Always use _id for MongoDB operations if available
    const idToEdit = postToEdit._id || postId;
    setEditingPostId(idToEdit);
    setActiveTab("add");

    // Reset uploading states
    setIsUploading({
      thumbnail: false,
      mainImage: false,
    });
  };

  // Delete post handler
  const handleDeletePost = async (postId: number | string) => {
    // Ensure we're using the MongoDB _id if available
    const idToDelete =
      typeof postId === "object" && postId !== null
        ? (postId as any)._id || postId
        : postId;

    setPostToDelete(String(idToDelete));
    setDeleteDialogOpen(true);
  };

  // Confirm delete post
  const confirmDelete = async () => {
    if (!postToDelete) return;

    try {
      await dispatch(deleteBlog(postToDelete)).unwrap();
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    } catch (error: any) {
      setNotification({
        type: "error",
        message:
          error?.message || "Failed to delete blog post. Please try again.",
      });
    }
  };

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

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
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
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
              return (
                <PaginationItem key="ellipsis-start">
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            if (page === totalPages - 1 && currentPage < totalPages - 2) {
              return (
                <PaginationItem key="ellipsis-end">
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            return null;
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  // New blog handler ekleyelim
  const handleNewBlog = () => {
    resetForm();
    setIsEditMode(false);
    setEditingPostId(null);
    setActiveTab("add");

    // URL'yi güncelle (URL parametreleri kullanılıyorsa)
    const url = new URL(window.location.href);
    url.searchParams.set("mode", "new");
    url.searchParams.delete("id");
    window.history.pushState({}, "", url);
  };

  // Handle adding a global category
  const handleAddGlobalCategory = async () => {
    if (!newCategoryName.trim()) {
      setNotification({
        type: "error",
        message: "Kategori adı boş olamaz.",
      });
      return;
    }
    
    try {
      await dispatch(createGlobalCategory(newCategoryName.trim())).unwrap();
      setNewCategoryName("");
      
      setNotification({
        type: "success",
        message: "Kategori başarıyla eklendi.",
      });
    } catch (error: any) {
      setNotification({
        type: "error",
        message: error.message || "Kategori eklenirken bir hata oluştu.",
      });
    }
  };
  
  // Handle deleting a global category
  const handleDeleteGlobalCategory = async (category: string) => {
    try {
      await dispatch(deleteGlobalCategory(category)).unwrap();
      
      setNotification({
        type: "success",
        message: "Kategori başarıyla silindi.",
      });
    } catch (error: any) {
      setNotification({
        type: "error",
        message: error.message || "Kategori silinirken bir hata oluştu.",
      });
    }
  };

  // Handle adding a global author
  const handleAddGlobalAuthor = async () => {
    if (!newAuthorData.name.trim()) {
      setNotification({
        type: "error",
        message: "Yazar adı boş olamaz.",
      });
      return;
    }
    
    try {
      if (editingAuthor) {
        // Update existing author
        await dispatch(updateGlobalAuthor({
          id: editingAuthor._id,
          ...newAuthorData
        })).unwrap();
        setEditingAuthor(null);
      } else {
        // Create new author
        await dispatch(createGlobalAuthor(newAuthorData)).unwrap();
      }
      
      setNewAuthorData({ name: "", avatar: "", bio: "" });
      
      setNotification({
        type: "success",
        message: editingAuthor ? "Yazar başarıyla güncellendi." : "Yazar başarıyla eklendi.",
      });
    } catch (error: any) {
      setNotification({
        type: "error",
        message: error.message || "Yazar işlemi sırasında bir hata oluştu.",
      });
    }
  };
  
  // Handle editing a global author
  const handleEditGlobalAuthor = (author: any) => {
    setEditingAuthor(author);
    setNewAuthorData({
      name: author.name,
      avatar: author.avatar || "",
      bio: author.bio || ""
    });
    setAuthorDialogOpen(true);
  };
  
  // Handle deleting a global author
  const handleDeleteGlobalAuthor = async (authorId: string) => {
    try {
      await dispatch(deleteGlobalAuthor(authorId)).unwrap();
      
      setNotification({
        type: "success",
        message: "Yazar başarıyla silindi.",
      });
    } catch (error: any) {
      setNotification({
        type: "error",
        message: error.message || "Yazar silinirken bir hata oluştu.",
      });
    }
  };

  // Reset author dialog
  const resetAuthorDialog = () => {
    setNewAuthorData({ name: "", avatar: "", bio: "" });
    setEditingAuthor(null);
    setAuthorDialogOpen(false);
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
                <BreadcrumbPage>Blog Management</BreadcrumbPage>
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
          <div
            className={`p-4 mb-4 rounded-lg ${
              notification.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <div className="flex items-center">
              <span className="font-medium">
                {notification.type === "success" ? "Success!" : "Error!"}
              </span>
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
              <h2 className="text-xl font-bold">All Blogs</h2>

              <div className="flex gap-2 items-center">
                <div className="w-full md:w-auto">
                  <Input
                    placeholder="Search blogs by title, category, or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                <input
                  type="file"
                  id="import-json"
                  className="hidden"
                  accept=".json"
                  onChange={handleImportJson}
                  ref={jsonFileInputRef}
                />
                <Button
                  variant="outline"
                  onClick={() => jsonFileInputRef.current?.click()}
                  title="Import blog.json"
                  size="sm"
                >
                  <FileJson className="h-4 w-4 mr-1" />
                  Import
                </Button>

                <Button
                  variant="outline"
                  onClick={() => generateJsonDownload(blogs)}
                  title="Export current blog posts"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setCategoryDialogOpen(true)}
                  title="Manage categories"
                  size="sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
                    <path d="M8 2h8"></path>
                    <path d="M16 2v4"></path>
                    <path d="M8 2v4"></path>
                    <path d="M2 6h20v4H2z"></path>
                    <path d="M4 10v10h16V10"></path>
                    <path d="M10 14h4"></path>
                  </svg>
                  Categories
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setAuthorDialogOpen(true)}
                  title="Manage authors"
                  size="sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Authors
                </Button>

                <Button
                  variant="default"
                  onClick={handleNewBlog}
                  title="Create a new blog post"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  New Blog
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {!loading && (
                <Table>
                  <TableCaption>A list of your blogs.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Categories</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Premium</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPosts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No blog posts found.{" "}
                          {searchTerm && "Try a different search term."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentPosts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {post.image && (
                                <div className="relative w-10 h-10 rounded-md overflow-hidden">
                                  <img
                                    src={post.image}
                                    alt={post.title}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                              )}
                              <span className="line-clamp-1">{post.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {Array.isArray(post.category) ? (
                                post.category.map((cat, i) => (
                                  <Badge key={i} variant="outline">
                                    {cat}
                                  </Badge>
                                ))
                              ) : (
                                <Badge variant="outline">{post.category}</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{post.author}</TableCell>
                          <TableCell>{post.date}</TableCell>
                          <TableCell>
                            {post.premium ? (
                              <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Premium</Badge>
                            ) : (
                              <Badge variant="outline">Free</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link
                                href={`/${slugify(post.title)}`}
                                target="_blank"
                              >
                                <Button
                                  variant="outline"
                                  size="icon"
                                  title="View Blog"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  handleEditPost(post._id || post.id)
                                }
                                title="Edit Blog"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() =>
                                  handleDeletePost(post._id || post.id)
                                }
                                disabled={loading}
                                title="Delete Blog"
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
              )}
              {!loading && renderPagination()}
            </div>
          </>
        ) : (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {isEditMode
                  ? `Edit Blog: ${formData.title}`
                  : "Create New Blog"}
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCategoryDialogOpen(true)}
                  title="Manage categories"
                  size="sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
                    <path d="M8 2h8"></path>
                    <path d="M16 2v4"></path>
                    <path d="M8 2v4"></path>
                    <path d="M2 6h20v4H2z"></path>
                    <path d="M4 10v10h16V10"></path>
                    <path d="M10 14h4"></path>
                  </svg>
                  Categories
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setAuthorDialogOpen(true)}
                  title="Manage authors"
                  size="sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Authors
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Reset form first
                    resetForm();

                    // Then explicitly reset edit mode
                    setIsEditMode(false);
                    setEditingPostId(null);

                    // Go back to list view
                    setActiveTab("all");
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4">
                  <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium">
                        Basic Information
                      </CardTitle>
                      {isEditMode && editingPostId && (
                        <p className="text-sm text-muted-foreground">
                          Editing blog ID: {editingPostId}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-2 ">
                      <div className="space-y-1">
                        <Label htmlFor="title" className="text-sm font-medium">
                          Title
                        </Label>
                        <Input
                          id="title"
                          placeholder="Enter blog title"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          className="h-9"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label
                          htmlFor="description"
                          className="text-sm font-medium"
                        >
                          Short Description
                        </Label>
                        <Textarea
                          id="description"
                          placeholder="Brief description of the blog post"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          className="min-h-[70px]"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label
                          htmlFor="readTime"
                          className="text-sm font-medium"
                        >
                          Read Time
                        </Label>
                        <Input
                          id="readTime"
                          placeholder="3 dakika"
                          value={formData.readTime}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              readTime: e.target.value,
                            })
                          }
                          className="h-9"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm">
                    <CardHeader className="">
                      <CardTitle className="text-base font-medium">
                        Blog Content
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 ">
                      <div className="space-y-1">
                        <Label htmlFor="intro" className="text-sm font-medium">
                          Introduction
                        </Label>
                        <RichTextEditor
                          content={formData.intro}
                          onChange={(html) =>
                            setFormData({ ...formData, intro: html })
                          }
                          className="min-h-[150px]"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label
                          htmlFor="fullContent"
                          className="text-sm font-medium"
                        >
                          Main Content
                        </Label>
                        <RichTextEditor
                          content={formData.fullContent}
                          onChange={(html) =>
                            setFormData({ ...formData, fullContent: html })
                          }
                          className="min-h-[350px]"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          <strong>Tip:</strong> Use the editor's formatting
                          tools to structure your content. Click "HTML" to edit
                          the raw HTML directly.
                        </p>
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
                            setEditingPostId(null);
                            setActiveTab("all");
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
                          ) : isEditMode ? (
                            "Update Blog"
                          ) : (
                            "Create Blog"
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm">
                    <CardHeader className="pb-2 pt-3">
                      <CardTitle className="text-base font-medium">
                        Thumbnail Image
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-1">
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Input
                              id="image"
                              placeholder="/assets/imgs/blog-1/card-img-1.png"
                              value={formData.image}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  image: e.target.value,
                                })
                              }
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
                              {isUploading.thumbnail
                                ? "Uploading..."
                                : "Upload"}
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
                      <CardTitle className="text-base font-medium">
                        Main Banner Image
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-0 ">
                      <div className="space-y-1">
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Input
                              id="mainImage"
                              placeholder="/assets/imgs/blog-details/img-1.png"
                              value={formData.mainImage}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  mainImage: e.target.value,
                                })
                              }
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
                              onClick={() =>
                                mainImageFileInputRef.current?.click()
                              }
                              disabled={isUploading.mainImage}
                              size="sm"
                              className="h-9"
                            >
                              {isUploading.mainImage
                                ? "Uploading..."
                                : "Upload"}
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
                      <CardTitle className="text-base font-medium">
                        Categories
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 ">
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1 min-h-[36px]">
                          {formData.categories.map((cat, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="px-2 py-1 text-xs"
                            >
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
                        
                        
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Available Categories</p>
                          <div className="flex flex-wrap gap-1">
                            {categoryLoading ? (
                              <div className="flex items-center justify-center w-full py-2">
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                              </div>
                            ) : (
                              categories.map((category, index) => (
                                <Badge
                                  key={index}
                                  variant={formData.categories.includes(category) ? "default" : "outline"}
                                  className="px-3 py-2 text-xs cursor-pointer hover:bg-primary-50"
                                  onClick={() => {
                                    if (!formData.categories.includes(category)) {
                                      setFormData({
                                        ...formData,
                                        categories: [...formData.categories, category],
                                      });
                                    } else {
                                      removeCategory(category);
                                    }
                                  }}
                                >
                                  {category}
                                  {formData.categories.includes(category) && (
                                    <span className="ml-1 text-xs">✓</span>
                                  )}
                                </Badge>
                              ))
                            )}
                            
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setCategoryDialogOpen(true)}
                              className="h-6 text-xs mt-2"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add New
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground">
                          Click a category to select/deselect or enter a custom category above
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm">
                    <CardHeader className="">
                      <CardTitle className="text-base font-medium">
                        Author
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1 min-h-[36px]">
                          {formData.author && (
                            <Badge
                              variant="secondary"
                              className="px-2 py-1 text-xs"
                            >
                              {formData.author}
                              <button
                                type="button"
                                className="ml-1 text-xs hover:text-destructive"
                                onClick={() => setFormData({ ...formData, author: "" })}
                              >
                                ✕
                              </button>
                            </Badge>
                          )}
                        </div>
                        
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Available Authors</p>
                          <div className="flex flex-wrap gap-1">
                            {authorLoading ? (
                              <div className="flex items-center justify-center w-full py-2">
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                              </div>
                            ) : (
                              authors.map((author: any, index: number) => (
                                <Badge
                                  key={index}
                                  variant={formData.author === author.name ? "default" : "outline"}
                                  className="px-3 py-2 text-xs cursor-pointer hover:bg-primary-50"
                                  onClick={() => {
                                    setFormData({
                                      ...formData,
                                      author: author.name,
                                      authorAvatar: author.avatar,
                                    });
                                  }}
                                >
                                  <div className="flex items-center gap-1">
                                    {author.avatar && (
                                      <img 
                                        src={author.avatar} 
                                        alt={author.name}
                                        className="w-4 h-4 rounded-full"
                                      />
                                    )}
                                    {author.name}
                                    {formData.author === author.name && (
                                      <span className="ml-1 text-xs">✓</span>
                                    )}
                                  </div>
                                </Badge>
                              ))
                            )}
                            
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setAuthorDialogOpen(true)}
                              className="h-6 text-xs mt-2"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add New
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground">
                          Click an author to select or add a new author
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm">
                    <CardHeader className="">
                      <CardTitle className="text-base font-medium">
                        Premium Content
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="premium-toggle" className="text-sm font-medium">
                            Mark as Premium Content
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Premium content is specially styled and may be restricted based on subscription.
                          </p>
                        </div>
                        <Switch
                          id="premium-toggle"
                          checked={formData.premium}
                          onCheckedChange={(checked) =>
                            setFormData({
                              ...formData,
                              premium: checked,
                            })
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>

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
              Are you sure you want to delete this blog post? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setPostToDelete(null);
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

      {/* Categories Management Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Manage Categories</DialogTitle>
            <DialogDescription>
              Add, edit, or delete categories for your blog posts.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 my-4">
            <div className="flex gap-2">
              <Input
                placeholder="New category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newCategoryName.trim()) {
                    e.preventDefault();
                    handleAddGlobalCategory();
                  }
                }}
              />
              <Button 
                type="button" 
                onClick={handleAddGlobalCategory}
                disabled={categoryLoading || !newCategoryName.trim()}
              >
                {categoryLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add'}
              </Button>
            </div>
            
            <div className="border rounded-md">

              {categoryLoading ? (
                <div className="flex justify-center items-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
              ) : categories.length === 0 ? (
                <div className="py-3 px-4 text-center text-muted-foreground">
                  No categories found. Add your first category above.
                </div>
              ) : (
                <div className="max-h-[250px] overflow-y-auto">
                  {categories.map((category, index) => (
                    <div 
                      key={index}
                      className="py-2 px-4 border-b last:border-b-0 flex justify-between items-center"
                    >
                      <span>{category}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteGlobalCategory(category)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Authors Management Dialog */}
      <Dialog open={authorDialogOpen} onOpenChange={setAuthorDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Manage Authors</DialogTitle>
            <DialogDescription>
              Add, edit, or delete authors for your blog posts.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 my-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Author Name</label>
                <Input
                  placeholder="Author name"
                  value={newAuthorData.name}
                  onChange={(e) => setNewAuthorData({ ...newAuthorData, name: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newAuthorData.name.trim()) {
                      e.preventDefault();
                      handleAddGlobalAuthor();
                    }
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Avatar URL</label>
                <Input
                  placeholder="https://example.com/avatar.jpg"
                  value={newAuthorData.avatar}
                  onChange={(e) => setNewAuthorData({ ...newAuthorData, avatar: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Bio (Optional)</label>
              <Textarea
                placeholder="Author bio or description"
                value={newAuthorData.bio}
                onChange={(e) => setNewAuthorData({ ...newAuthorData, bio: e.target.value })}
                className="min-h-[80px]"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                type="button" 
                onClick={handleAddGlobalAuthor}
                disabled={authorLoading || !newAuthorData.name.trim()}
                className="flex-1"
              >
                {authorLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : editingAuthor ? (
                  'Update Author'
                ) : (
                  'Add Author'
                )}
              </Button>
              
              {editingAuthor && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={resetAuthorDialog}
                >
                  Cancel Edit
                </Button>
              )}
            </div>
            
            <div className="border rounded-md">
              {authorLoading ? (
                <div className="flex justify-center items-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
              ) : authors.length === 0 ? (
                <div className="py-3 px-4 text-center text-muted-foreground">
                  No authors found. Add your first author above.
                </div>
              ) : (
                <div className="max-h-[250px] overflow-y-auto">
                  {authors.map((author: any, index: number) => (
                    <div 
                      key={index}
                      className="py-3 px-4 border-b last:border-b-0 flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3">
                        {author.avatar && (
                          <img 
                            src={author.avatar} 
                            alt={author.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium">{author.name}</p>
                          {author.bio && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {author.bio}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditGlobalAuthor(author)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4 text-blue-500" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteGlobalAuthor(author._id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={resetAuthorDialog}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
