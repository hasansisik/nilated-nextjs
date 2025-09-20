"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GripVertical,
  Plus,
  Trash2,
  Settings,
  Layout,
  Eye,
  Save,
  Code,
  CheckCircle2,
  Layers,
  MoveVertical,
  Home,
  Film,
  Users,
  Sparkles,
  HelpCircle,
  MessageCircle,
  BookOpen,
  Share2,
  Briefcase,
} from "lucide-react";
import { Toaster, toast } from "sonner";
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
import { useDispatch, useSelector } from "react-redux";
import { getPage, updatePage } from "@/redux/actions/pageActions";
import { getAllCategories, getAllAuthors } from "@/redux/actions/blogActions";
import { RootState } from "@/redux/store";
import { AppDispatch } from "@/redux/store";

// Define Section Type
interface Section {
  id: string;
  name: string;
  type: string;
  description?: string;
  config?: {
    selectedCategory?: string;
    selectedAuthor?: string;
    title?: string;
    subtitle?: string;
    isPremiumOnly?: boolean;
  };
}

// Component selector for the available sections with icons
const availableSections = [
  {
    id: "hero1",
    name: "Hero 1",
    type: "Hero1",
    description: "Main hero with floating card and shapes",
    icon: Home,
  },
  {
    id: "hero2",
    name: "Hero 2",
    type: "Hero2",
    description: "Main hero with floating card and shapes",
    icon: Home,
  },
  {
    id: "hero3",
    name: "Hero 3",
    type: "Hero3",
    description: "Hero with overlapping images",
    icon: Home,
  },
  {
    id: "cta1",
    name: "CTA 1",
    type: "Cta1",
    description: "Team showcase with social links",
    icon: Users,
  },
  {
    id: "cta4",
    name: "CTA 4",
    type: "Cta4",
    description: "Feature showcase with video",
    icon: Film,
  },
  {
    id: "cta3",
    name: "CTA 3",
    type: "Cta3",
    description: "Video showcase with background",
    icon: Film,
  },
  {
    id: "services2",
    name: "Services 2",
    type: "Services2",
    description: "Services grid with icons",
    icon: Briefcase,
  },
  {
    id: "services3",
    name: "Services 3",
    type: "Services3",
    description: "Services grid with icons",
    icon: Briefcase,
  },
  {
    id: "services5",
    name: "Services 5",
    type: "Services5",
    description: "Services grid with icons",
    icon: Briefcase,
  },
  {
    id: "faqs1",
    name: "FAQs 1",
    type: "Faqs1",
    description: "Two-column FAQ accordion",
    icon: HelpCircle,
  },
  {
    id: "faqs2",
    name: "FAQs 2",
    type: "Faqs2",
    description: "Two-column FAQ accordion",
    icon: HelpCircle,
  },
  {
    id: "faqs3",
    name: "FAQs 3",
    type: "Faqs3",
    description: "FAQ with side content",
    icon: MessageCircle,
  },
  {
    id: "contact1",
    name: "Contact 1",
    type: "Contact1",
    description: "Contact form with background",
    icon: MessageCircle,
  },
  {
    id: "project2",
    name: "Project 2",
    type: "Project2",
    description: "Project grid with images",
    icon: Layout,
  },
  {
    id: "blog1",
    name: "Blog 1",
    type: "Blog1",
    description: "Blog grid with images",
    icon: Layout,
  },
  {
    id: "blog1-category",
    name: "Blog 1 (Category)",
    type: "Blog1Category",
    description: "Blog grid filtered by category",
    icon: Layout,
  },
  {
    id: "blog1-author",
    name: "Blog 1 (Author)",
    type: "Blog1Author",
    description: "Blog grid filtered by author",
    icon: Layout,
  },
  {
    id: "blog2",
    name: "Blog 2",
    type: "Blog2",
    description: "Blog grid with images",
    icon: Layout,
  },
  {
    id: "blog2-category",
    name: "Blog 2 (Category)",
    type: "Blog2Category",
    description: "Blog grid filtered by category",
    icon: Layout,
  },
  {
    id: "blog2-author",
    name: "Blog 2 (Author)",
    type: "Blog2Author",
    description: "Blog grid filtered by author",
    icon: Layout,
  },
  {
    id: "blog3",
    name: "Blog 3",
    type: "Blog3",
    description: "Blog grid with images",
    icon: Layout,
  },
  {
    id: "blog3-category",
    name: "Blog 3 (Category)",
    type: "Blog3Category",
    description: "Blog grid filtered by category",
    icon: Layout,
  },
  {
    id: "blog3-author",
    name: "Blog 3 (Author)",
    type: "Blog3Author",
    description: "Blog grid filtered by author",
    icon: Layout,
  },
  {
    id: "blog5",
    name: "Blog 5",
    type: "Blog5",
    description: "Blog grid with images",
    icon: Layout,
  },
  {
    id: "blog5-category",
    name: "Blog 5 (Category)",
    type: "Blog5Category",
    description: "Blog grid filtered by category",
    icon: Layout,
  },
  {
    id: "blog5-author",
    name: "Blog 5 (Author)",
    type: "Blog5Author",
    description: "Blog grid filtered by author",
    icon: Layout,
  },
  {
    id: "team",
    name: "Team",
    type: "Team",
    description: "Team grid with images",
    icon: Layout,
  },
  {
    id: "team1",
    name: "Team 1",
    type: "Team1",
    description: "Team grid with images",
    icon: Layout,
  },
  {
    id: "features1",
    name: "Features 1",
    type: "Features1",
    description: "Features grid with images",
    icon: Layout,
  },
  {
    id: "features4",
    name: "Features 4",
    type: "Features4",
    description: "Features grid with images",
    icon: Layout,
  },
  {
    id: "features5",
    name: "Features 5",
    type: "Features5",
    description: "Features grid with images",
    icon: Layout,
  },
  {
    id: "features8",
    name: "Features 8",
    type: "Features8",
    description: "Features grid with images",
    icon: Layout,
  },
  {
    id: "features10",
    name: "Features 10",
    type: "Features10",
    description: "Features grid with images",
    icon: Layout,
  },
  {
    id: "content1",
    name: "Content 1",
    type: "Content1",
    description: "Content grid with images",
    icon: Layout,
  },
  {
    id: "content2",
    name: "Content 2",
    type: "Content2",
    description: "Content grid with images",
    icon: Layout,
  },
  {
    id: "content3",
    name: "Content 3",
    type: "Content3",
    description: "Content grid with images",
    icon: Layout,
  },
];

// Component to show section thumbnails
function SectionThumbnail({
  section,
  onClick,
}: {
  section: Section & { icon: any };
  onClick: () => void;
}) {
  const Icon = section.icon;

  return (
    <div
      className="border rounded-md hover:shadow-md cursor-pointer transition-all duration-200 overflow-hidden group"
      onClick={onClick}
    >
      <div className="p-3">
        <div className="bg-gray-50 rounded-md p-4 flex items-center justify-center h-24 mb-3">
          <Icon className="h-12 w-12 text-gray-400 group-hover:text-primary transition-colors" />
        </div>
        <h3 className="font-medium text-sm">{section.name}</h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {section.description}
        </p>
        <div className="mt-3">
          <Button
            size="sm"
            variant="outline"
            className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}

// Sortable section item with improved styling
function SortableSectionItem({
  id,
  section,
  handleRemove,
  onEditConfig,
}: {
  id: string;
  section: Section;
  handleRemove: () => void;
  onEditConfig?: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const sectionInfo = availableSections.find(
    (s) => s.type === section.type
  ) || {
    icon: Layout,
    description: `${section.type} Component`,
  };

  const Icon = sectionInfo.icon || Layout;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-card rounded-lg border shadow-sm mb-4 transition-all duration-200 
        ${
          isDragging
            ? "shadow-lg ring-2 ring-primary/20 border-primary/30"
            : "hover:border-border/80 hover:shadow"
        }`}
    >
      <div className="flex items-center p-3 border-b">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab hover:bg-muted p-2 rounded mr-2"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground/70" />
        </div>

        <div className="bg-muted w-10 h-10 flex items-center justify-center rounded mr-3">
          <Icon className="h-5 w-5 text-foreground/70" />
        </div>

        <div className="flex-1">
          <div className="font-medium text-foreground">{section.name}</div>
          <div className="text-xs text-muted-foreground">
            {sectionInfo.description || `${section.type} Component`}
          </div>
          {section.type.includes('Blog') && (
            <div className="text-xs mt-1 space-y-1">
              {/* Title and Subtitle */}
              <div>
                <span className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded mr-2">
                  Başlık: {section.config?.title || 'Varsayılan başlık'}
                </span>
                <span className="inline-block bg-pink-100 text-pink-700 px-2 py-1 rounded mr-2">
                  Alt başlık: {section.config?.subtitle || 'Varsayılan alt başlık'}
                </span>
                {section.config?.isPremiumOnly && (
                  <span className="inline-block bg-amber-100 text-amber-700 px-2 py-1 rounded">
                    Sadece Premium
                  </span>
                )}
              </div>
              
              {/* Category and Author filters */}
              {section.type.includes('Category') && (
                <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded mr-2">
                  Kategori: {section.config?.selectedCategory || 'Genel (Genel hariç tüm kategoriler)'}
                </span>
              )}
              {section.type.includes('Author') && (
                <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded">
                  Yazar: {section.config?.selectedAuthor || 'Tüm yazarlar'}
                </span>
              )}
            </div>
          )}
          {(section.type.includes('Category') || section.type.includes('Author')) && !section.type.includes('Blog') && (
            <div className="text-xs mt-1">
              {section.type.includes('Category') && (
                <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded mr-2">
                  Kategori: {section.config?.selectedCategory || 'Genel (Genel hariç tüm kategoriler)'}
                </span>
              )}
              {section.type.includes('Author') && (
                <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded">
                  Yazar: {section.config?.selectedAuthor || 'Tüm yazarlar'}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {section.type.includes('Blog') && onEditConfig && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={onEditConfig}
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-destructive hover:text-destructive/90 hover:bg-destructive/10"
            onClick={handleRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function HomePageEditor() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { pages, loading } = useSelector((state: RootState) => state.page);
  const { categories, authors, categoryLoading, authorLoading } = useSelector((state: RootState) => state.blog);

  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("layout");
  
  // Configuration modal states
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [currentSectionType, setCurrentSectionType] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sectionTitle, setSectionTitle] = useState<string>("");
  const [sectionSubtitle, setSectionSubtitle] = useState<string>("");
  const [isPremiumOnly, setIsPremiumOnly] = useState<boolean>(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Get the homepage data from Redux store
  useEffect(() => {
    if (pages && pages.home) {
      setSections(pages.home.sections || []);
    }
  }, [pages]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Use Redux to fetch page data
        await dispatch(getPage("home"));
        // Fetch categories and authors for configuration
        await dispatch(getAllCategories());
        await dispatch(getAllAuthors());
      } catch (error) {
        console.error("Error fetching home page data:", error);
        toast.error("Failed to load page data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  // Add a section to the page
  const addSection = (sectionType: string) => {
    const section = availableSections.find((s) => s.id === sectionType);
    if (!section) return;

    // Check if this is a blog section (requires configuration)
    const isBlogSection = sectionType.includes('blog');
    
    if (isBlogSection) {
      setCurrentSectionType(sectionType);
      setSelectedCategory("");
      setSelectedAuthor("");
      setSectionTitle("");
      setSectionSubtitle("");
      setIsPremiumOnly(false);
      setShowConfigModal(true);
    } else {
      // Add section without configuration
      const newSection: Section = {
        id: `${sectionType}-${Date.now()}`,
        name: section.name,
        type: section.type,
        description: section.description,
      };

      setSections([...sections, newSection]);
      setIsSaved(false);
    }
  };

  // Add section with configuration
  const addSectionWithConfig = () => {
    const section = availableSections.find((s) => s.id === currentSectionType);
    if (!section) return;

    const newSection: Section = {
      id: `${currentSectionType}-${Date.now()}`,
      name: section.name,
      type: section.type,
      description: section.description,
      config: {
        selectedCategory: selectedCategory.trim() !== "" ? selectedCategory : undefined,
        selectedAuthor: selectedAuthor.trim() !== "" ? selectedAuthor : undefined,
        title: sectionTitle.trim() !== "" ? sectionTitle : undefined,
        subtitle: sectionSubtitle.trim() !== "" ? sectionSubtitle : undefined,
        isPremiumOnly: isPremiumOnly,
      }
    };

    setSections([...sections, newSection]);
    setIsSaved(false);
    setShowConfigModal(false);
    setCurrentSectionType("");
    setSelectedCategory("");
    setSelectedAuthor("");
    setSectionTitle("");
    setSectionSubtitle("");
    setIsPremiumOnly(false);
  };

  // Remove a section from the page
  const removeSection = (sectionId: string) => {
    setSections(sections.filter((section) => section.id !== sectionId));
    setIsSaved(false);
  };

  // Edit section configuration
  const editSectionConfig = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    // Find the original section type
    const originalSectionId = Object.keys(availableSections).find(key => 
      availableSections.find(s => s.type === section.type)?.id
    );

    if (originalSectionId) {
      setCurrentSectionType(originalSectionId);
      setSelectedCategory(section.config?.selectedCategory || "");
      setSelectedAuthor(section.config?.selectedAuthor || "");
      setSectionTitle(section.config?.title || "");
      setSectionSubtitle(section.config?.subtitle || "");
      setIsPremiumOnly(section.config?.isPremiumOnly || false);
      setShowConfigModal(true);
      
      // Store the section ID for updating
      setEditingSectionId(sectionId);
    }
  };

  // Update section configuration
  const updateSectionConfig = () => {
    if (!editingSectionId) return;

    setSections(sections.map(section => {
      if (section.id === editingSectionId) {
        return {
          ...section,
          config: {
            selectedCategory: selectedCategory.trim() !== "" ? selectedCategory : undefined,
            selectedAuthor: selectedAuthor.trim() !== "" ? selectedAuthor : undefined,
            title: sectionTitle.trim() !== "" ? sectionTitle : undefined,
            subtitle: sectionSubtitle.trim() !== "" ? sectionSubtitle : undefined,
            isPremiumOnly: isPremiumOnly,
          }
        };
      }
      return section;
    }));

    setIsSaved(false);
    setShowConfigModal(false);
    setCurrentSectionType("");
    setSelectedCategory("");
    setSelectedAuthor("");
    setSectionTitle("");
    setSectionSubtitle("");
    setIsPremiumOnly(false);
    setEditingSectionId(null);
  };

  // Handle the drag end event for sorting sections
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sections.findIndex(
        (section) => section.id === active.id
      );
      const newIndex = sections.findIndex((section) => section.id === over?.id);

      const newSections = arrayMove(sections, oldIndex, newIndex);
      setSections(newSections);
      setIsSaved(false);
    }
  };

  // Save the page data
  const savePageData = async () => {
    try {
      setIsSaving(true);

      // Use Redux to update page data
      await dispatch(
        updatePage({
          pageType: "home",
          pageData: { sections },
        })
      );

      toast.success("Page saved successfully", {
        description: "Your changes will be reflected on the site",
      });
      setIsSaved(true);
    } catch (error) {
      console.error("Error saving page data:", error);
      toast.error("Failed to save page data");
    } finally {
      setIsSaving(false);
    }
  };

  // Generate the page code
  const generatePageCode = () => {
    let imports = ``;

    // Add imports for sections
    const usedSections = new Set<string>();
    sections.forEach((section: Section) => {
      usedSections.add(section.type);
    });

    // Add each import only once
    Array.from(usedSections).forEach((type: string) => {
      imports += `import ${type} from "@/components/sections/${type}"\n`;
    });

    let sectionsJSX = sections
      .map((section: any) => {
        let props = "";
        if (section.config) {
          const configProps = [];
          if (section.config.selectedCategory && section.config.selectedCategory.trim() !== "") {
            configProps.push(`selectedCategory="${section.config.selectedCategory}"`);
          }
          if (section.config.selectedAuthor && section.config.selectedAuthor.trim() !== "") {
            configProps.push(`selectedAuthor="${section.config.selectedAuthor}"`);
          }
          if (section.config.title && section.config.title.trim() !== "") {
            configProps.push(`title="${section.config.title}"`);
          }
          if (section.config.subtitle && section.config.subtitle.trim() !== "") {
            configProps.push(`subtitle="${section.config.subtitle}"`);
          }
          if (section.config.isPremiumOnly) {
            configProps.push(`isPremiumOnly={true}`);
          }
          if (configProps.length > 0) {
            props = ` ${configProps.join(" ")}`;
          }
        }
        return `\t\t<${section.type}${props} />`;
      })
      .join("\n");

    return `${imports}
export default function Home() {
\treturn (
\t\t<>
${sectionsJSX}
\t\t</>
\t)
}`;
  };

  // If data is still loading, show loading spinner
  if (isLoading || loading) {
    return;
  }

  const PageContent = (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            Page Builder
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Drag and drop sections to build your custom home page
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-xs h-8"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Preview</span>
          </Button>
          <Button
            onClick={savePageData}
            disabled={isSaving}
            className={`${
              isSaved ? "bg-green-600 hover:bg-green-700" : ""
            } flex items-center gap-2 text-xs h-8`}
          >
            {isSaving ? (
              <>
                <span className="animate-spin h-3.5 w-3.5 border-2 border-t-transparent rounded-full mr-1" />
                <span>Saving...</span>
              </>
            ) : isSaved ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tabs moved to the top */}
      <Tabs defaultValue="layout" className="w-full mb-4">
        <TabsList className="w-full mb-4 grid grid-cols-2">
          <TabsTrigger
            value="layout"
            className="flex items-center gap-2 h-9 text-xs"
          >
            <Layout className="h-3.5 w-3.5" />
            Sections
          </TabsTrigger>
          <TabsTrigger
            value="code"
            className="flex items-center gap-2 h-9 text-xs"
          >
            <Code className="h-3.5 w-3.5" />
            Code Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="border-none p-0 mt-0">
          <div className="bg-card rounded-lg border shadow-sm p-4">
            <h3 className="text-sm font-medium mb-3 flex items-center">
              <Code className="h-3.5 w-3.5 mr-2 text-primary" />
              Generated Code
            </h3>

            <div className="flex justify-between items-center mb-3">
              <div className="text-xs text-muted-foreground">
                This code will be automatically applied when you save changes
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => {
                  const code = generatePageCode();
                  navigator.clipboard.writeText(code);
                  toast.success("Code copied to clipboard");
                }}
              >
                Copy Code
              </Button>
            </div>

            <pre className="bg-muted p-4 rounded-md overflow-auto text-xs max-h-[500px] border">
              <code className="text-foreground">{generatePageCode()}</code>
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="layout" className="border-none p-0 mt-0">
          {/* Available Sections - Grid with equal heights */}
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-3 flex items-center">
              <Plus className="h-3.5 w-3.5 mr-2 text-primary" />
              Available Sections
              <span className="ml-2 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
                Drag to add
              </span>
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
              {availableSections.map((section) => (
                <div
                  key={section.id}
                  className="border rounded-lg shadow-sm hover:shadow cursor-pointer transition-all duration-200 overflow-hidden group flex flex-col h-full"
                  onClick={() => addSection(section.id)}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", section.id);
                    e.dataTransfer.effectAllowed = "copy";
                  }}
                >
                  <div className="p-2 border-b bg-muted/30 flex-grow-0">
                    <div className="bg-white rounded-md p-2 flex items-center justify-center h-12 shadow-sm">
                      <section.icon className="h-5 w-5 text-primary/70 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                  <div className="p-2 bg-white flex flex-col flex-grow">
                    <h3 className="font-medium text-xs mb-1 line-clamp-1">
                      {section.name}
                    </h3>
                    <p className="text-[10px] text-muted-foreground mb-2 line-clamp-2 flex-grow">
                      {section.description}
                    </p>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full h-6 text-[10px]"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-card rounded-lg border shadow-sm p-4">
              <div className="mb-3">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Layers className="h-3.5 w-3.5 mr-2 text-primary" />
                  Page Sections
                  <span className="ml-2 text-xs bg-muted rounded-full px-2 py-0.5">
                    {sections.length}{" "}
                    {sections.length === 1 ? "section" : "sections"}
                  </span>
                </h3>
                <div
                  className="bg-muted/40 p-4 rounded-lg border-2 border-dashed border-border min-h-[300px]"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "copy";
                    e.currentTarget.classList.add(
                      "bg-primary/5",
                      "border-primary/30"
                    );
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove(
                      "bg-primary/5",
                      "border-primary/30"
                    );
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove(
                      "bg-primary/5",
                      "border-primary/30"
                    );
                    const sectionId = e.dataTransfer.getData("text/plain");
                    if (sectionId) {
                      addSection(sectionId);
                    }
                  }}
                >
                  {sections.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                      <Layers className="h-12 w-12 mb-3 text-muted" />
                      <p className="mb-1 text-sm font-medium">
                        No sections added yet
                      </p>
                      <p className="text-xs text-center max-w-md">
                        Drag sections from above or click on them to add to your
                        page
                      </p>
                    </div>
                  ) : (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={sections.map((s: any) => s.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {sections.map((section: any) => (
                          <SortableSectionItem
                            key={section.id}
                            id={section.id}
                            section={section}
                            handleRemove={() => removeSection(section.id)}
                            onEditConfig={() => editSectionConfig(section.id)}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                  )}
                </div>
              </div>

              <div className="mt-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <svg
                    className="h-4 w-4 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-2 flex-1 text-xs text-blue-700">
                  <p>
                    Drag and drop sections to reorder them. Click the save
                    button to apply changes to your live site.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

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
                <BreadcrumbPage>Page Builder</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <Toaster richColors position="top-right" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{PageContent}</div>
      
      {/* Configuration Modal */}
      <Dialog open={showConfigModal} onOpenChange={setShowConfigModal}>
        <DialogContent className="sm:max-w-[425px]">
                     <DialogHeader>
             <DialogTitle>Blog Section Konfigürasyonu</DialogTitle>
             <DialogDescription>
               Bu blog section için başlık, alt başlık ve filtreleme seçeneklerini belirleyin.
             </DialogDescription>
           </DialogHeader>
           <div className="grid gap-4 py-4">
             {/* Title and Subtitle fields for all blog sections */}
             <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="title" className="text-right font-medium">
                 Başlık
               </Label>
               <div className="col-span-3">
                 <Input
                   id="title"
                   value={sectionTitle}
                   onChange={(e) => setSectionTitle(e.target.value)}
                   placeholder="Blog section başlığı (opsiyonel)"
                   className="w-full"
                 />
                 <p className="text-xs text-muted-foreground mt-1">
                   Boş bırakırsanız varsayılan başlık kullanılır
                 </p>
               </div>
             </div>
             
             <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="subtitle" className="text-right font-medium">
                 Alt Başlık
               </Label>
               <div className="col-span-3">
                 <Input
                   id="subtitle"
                   value={sectionSubtitle}
                   onChange={(e) => setSectionSubtitle(e.target.value)}
                   placeholder="Blog section alt başlığı (opsiyonel)"
                   className="w-full"
                 />
                 <p className="text-xs text-muted-foreground mt-1">
                   Boş bırakırsanız varsayılan alt başlık kullanılır
                 </p>
               </div>
             </div>
             
             <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="premium" className="text-right font-medium">
                 Premium İçerik
               </Label>
               <div className="col-span-3 flex items-center space-x-2">
                 <input
                   type="checkbox"
                   id="premium"
                   checked={isPremiumOnly}
                   onChange={(e) => setIsPremiumOnly(e.target.checked)}
                   className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                 />
                 <label htmlFor="premium" className="text-sm">
                   Sadece premium içerikleri göster
                 </label>
               </div>
               <div className="col-span-4 text-xs text-muted-foreground ml-[25%]">
                 Bu seçenek işaretlenirse sadece premium olarak işaretlenmiş bloglar gösterilir
               </div>
             </div>
            {currentSectionType.includes('-category') && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="category" className="text-right font-medium">
                  Kategori
                </label>
                <div className="col-span-3">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Kategori seçin (opsiyonel)" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category: string) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedCategory && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-1 h-6 text-xs"
                      onClick={() => setSelectedCategory("")}
                    >
                      Seçimi Temizle
                    </Button>
                  )}
                  {categoryLoading && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Kategoriler yükleniyor...
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Seçim yapmazsanız "Genel" kategorisi hariç tüm bloglar gösterilir
                  </p>
                </div>
              </div>
            )}
            
            {currentSectionType.includes('-author') && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="author" className="text-right font-medium">
                  Yazar
                </label>
                <div className="col-span-3">
                  <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Yazar seçin (opsiyonel)" />
                    </SelectTrigger>
                    <SelectContent>
                      {authors.map((author: any) => (
                        <SelectItem key={author._id} value={author.name}>
                          {author.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedAuthor && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-1 h-6 text-xs"
                      onClick={() => setSelectedAuthor("")}
                    >
                      Seçimi Temizle
                    </Button>
                  )}
                  {authorLoading && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Yazarlar yükleniyor...
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Seçim yapmazsanız tüm yazarların blogları gösterilir
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfigModal(false)}>
              İptal
            </Button>
            <Button onClick={editingSectionId ? updateSectionConfig : addSectionWithConfig}>
              {editingSectionId ? 'Güncelle' : 'Ekle'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
