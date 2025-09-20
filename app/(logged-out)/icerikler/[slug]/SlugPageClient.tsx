"use client";

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs } from "@/redux/actions/blogActions";
import { getAllHizmetler } from "@/redux/actions/hizmetActions";
import { AppDispatch, RootState } from "@/redux/store";
import Link from "next/link";
import parse from "html-react-parser";
import { notFound } from "next/navigation";
import { Award, Eye } from "lucide-react";

// Import the types and slugify function
interface BlogPost {
  id: number;
  _id?: string;
  title: string;
  description: string;
  image: string;
  content: {
    intro: string;
    readTime: string;
    author: {
      name: string;
      avatar: string;
      date: string;
    };
    mainImage: string;
    fullContent: string;
  };
  category: string[];
  author: string;
  date: string;
  premium?: boolean;
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
  content: {
    intro: string;
    readTime: string;
    author: {
      name: string;
      avatar: string;
      date: string;
    };
    mainImage: string;
    fullContent: string;
  };
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
  content: {
    intro: string;
    readTime: string;
    author: {
      name: string;
      avatar: string;
      date: string;
    };
    mainImage: string;
    fullContent: string;
    bannerSectionTitle?: string;
    bannerSectionDescription?: string;
    bannerSectionImage?: string;
    beforeAfterSectionTitle?: string;
    beforeAfterSectionDescription?: string;
    beforeAfterItems?: {
      title?: string;
      description?: string;
      beforeImage: string;
      afterImage: string;
      order?: number;
    }[];
    leftRightSectionTitle?: string;
    leftRightItems?: {
      title: string;
      description?: string;
      image: string;
      isRightAligned?: boolean;
      order?: number;
    }[];
    gallerySectionTitle?: string;
    gallerySectionDescription?: string;
    galleryImages?: {
      title?: string;
      image: string;
      order?: number;
    }[];
  };
}

// Function to convert title to slug
const slugify = (text: string) => {
  // Turkish character mapping
  const turkishMap: { [key: string]: string } = {
    ç: "c",
    Ç: "C",
    ğ: "g",
    Ğ: "G",
    ı: "i",
    İ: "I",
    ö: "o",
    Ö: "O",
    ş: "s",
    Ş: "S",
    ü: "u",
    Ü: "U",
  };

  // Replace Turkish characters
  let result = text.toString();
  for (const [turkishChar, latinChar] of Object.entries(turkishMap)) {
    result = result.replace(new RegExp(turkishChar, "g"), latinChar);
  }

  return result
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

// Function to get local JSON blog data
const getLocalBlogData = async () => {
  try {
    const response = await fetch("/api/local-blogs");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch local blog data:", error);
    return [];
  }
};

// Function to get local JSON project data
const getLocalProjectData = async () => {
  try {
    const response = await fetch("/api/local-projects");
    const data = await response.json();
    return data.projects || [];
  } catch (error) {
    console.error("Failed to fetch local project data:", error);
    return [];
  }
};

// Function to get local JSON hizmet data
const getLocalHizmetData = async () => {
  try {
    const response = await fetch("/api/local-hizmetler");
    const data = await response.json();
    return data.hizmetler || [];
  } catch (error) {
    console.error("Failed to fetch local hizmet data:", error);
    return [];
  }
};

// Function to check if slug is a category
const findContentByCategory = (
  blogs: BlogPost[],
  services: Project[],
  hizmetler: Hizmet[],
  slug: string
) => {
  const categoryContent: {
    blogs: BlogPost[];
    projects: Project[];
    hizmetler: Hizmet[];
  } = {
    blogs: [],
    projects: [],
    hizmetler: [],
  };

  // Find blogs with this category
  categoryContent.blogs = blogs.filter((blog) => {
    if (Array.isArray(blog.category)) {
      return blog.category.some((cat) => slugify(cat) === slug);
    } else {
      return slugify(blog.category as string) === slug;
    }
  });

  // Find projects with this category
  categoryContent.projects = services.filter((project) => {
    if (Array.isArray(project.categories)) {
      return project.categories.some((cat) => slugify(cat) === slug);
    }
    return false;
  });

  // Find hizmetler with this category
  categoryContent.hizmetler = hizmetler.filter((hizmet) => {
    if (Array.isArray(hizmet.categories)) {
      return hizmet.categories.some((cat) => slugify(cat) === slug);
    }
    return false;
  });

  return categoryContent;
};

interface SlugPageClientProps {
  slug: string;
}

export default function SlugPageClient({ slug }: SlugPageClientProps) {
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const { blogs, loading: blogsLoading } = useSelector(
    (state: RootState) => state.blog
  );
  const { services, loading: servicesLoading } = useSelector(
    (state: RootState) => state.service
  );
  const { hizmetler, loading: hizmetlerLoading } = useSelector(
    (state: RootState) => state.hizmet
  );

  // Local state for content
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [hizmet, setHizmet] = useState<Hizmet | null>(null);
  const [categoryContent, setCategoryContent] = useState<{
    blogs: BlogPost[];
    projects: Project[];
    hizmetler: Hizmet[];
    categoryName: string;
  } | null>(null);
  const [contentType, setContentType] = useState<
    "blog" | "project" | "hizmet" | "category" | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  // For before-after sliders
  const [sliderPositions, setSliderPositions] = useState<number[]>([]);
  const sliderRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isDragging = useRef<number | null>(null);
  const [containerWidths, setContainerWidths] = useState<number[]>([]);

  // For image preview modal
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Fetch data from Redux
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Only dispatch if blogs and services are not already loaded
        if (blogs.length === 0) {
          await dispatch(getAllBlogs());
        }

        if (!hizmetler || hizmetler.length === 0) {
          await dispatch(getAllHizmetler());
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        // If Redux data fetch fails, we'll still continue but will use fallback
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch, blogs.length, services.length, hizmetler]);

  // Find the content by slug once data is loaded
  useEffect(() => {
    if (!isLoading) {
      const findContent = async () => {
        // First try to find in Redux
        const foundBlog = blogs.find((post) => slugify(post.title) === slug);
        const foundProject = services.find(
          (service) => slugify(service.title) === slug
        );
        const foundHizmet = hizmetler?.find(
          (hizmet) => slugify(hizmet.title) === slug
        );

        if (foundBlog) {
          setBlogPost(foundBlog);
          setContentType("blog");
          return;
        }

        if (foundProject) {
          setProject(foundProject);
          setContentType("project");
          return;
        }

        if (foundHizmet) {
          setHizmet(foundHizmet);
          setContentType("hizmet");

          // Initialize slider positions for before-after items
          if (foundHizmet.content?.beforeAfterItems?.length) {
            setSliderPositions(
              new Array(foundHizmet.content.beforeAfterItems.length).fill(50)
            );
            sliderRefs.current = new Array(
              foundHizmet.content.beforeAfterItems.length
            ).fill(null);
            setContainerWidths(
              new Array(foundHizmet.content.beforeAfterItems.length).fill(0)
            );

            // Set a timeout to measure container widths after rendering
            setTimeout(() => {
              const newWidths = sliderRefs.current.map(
                (ref) => ref?.getBoundingClientRect().width || 0
              );
              setContainerWidths(newWidths);
            }, 500);
          }

          return;
        }

        // If no individual content found, check if it's a category
        const categoryData = findContentByCategory(blogs, services, hizmetler || [], slug);
        const totalCategoryItems = categoryData.blogs.length + categoryData.projects.length + categoryData.hizmetler.length;
        
        if (totalCategoryItems > 0) {
          // Find the original category name from the first item
          let categoryName = slug;
          if (categoryData.blogs.length > 0) {
            const firstBlog = categoryData.blogs[0];
            const matchingCategory = Array.isArray(firstBlog.category)
              ? firstBlog.category.find((cat) => slugify(cat) === slug)
              : firstBlog.category;
            if (matchingCategory) categoryName = matchingCategory;
          } else if (categoryData.projects.length > 0) {
            const firstProject = categoryData.projects[0];
            const matchingCategory = firstProject.categories.find((cat) => slugify(cat) === slug);
            if (matchingCategory) categoryName = matchingCategory;
          } else if (categoryData.hizmetler.length > 0) {
            const firstHizmet = categoryData.hizmetler[0];
            const matchingCategory = firstHizmet.categories.find((cat) => slugify(cat) === slug);
            if (matchingCategory) categoryName = matchingCategory;
          }

          setCategoryContent({
            ...categoryData,
            categoryName,
          });
          setContentType("category");
          return;
        }

        // If not found in Redux, try local JSON as fallback
        setUsingFallback(true);

        try {
          // Try to find in local blog data
          const localBlogs = await getLocalBlogData();
          const localBlog = localBlogs.find(
            (post: BlogPost) => slugify(post.title) === slug
          );

          if (localBlog) {
            setBlogPost(localBlog);
            setContentType("blog");
            return;
          }

          // Try to find in local project data
          const localProjects = await getLocalProjectData();
          const localProject = localProjects.find(
            (proj: Project) => slugify(proj.title) === slug
          );

          if (localProject) {
            setProject(localProject);
            setContentType("project");
            return;
          }

          // Try to find in local hizmet data
          const localHizmetler = await getLocalHizmetData();
          const localHizmet = localHizmetler.find(
            (hizm: Hizmet) => slugify(hizm.title) === slug
          );

          if (localHizmet) {
            setHizmet(localHizmet);
            setContentType("hizmet");

            // Initialize slider positions for before-after items
            if (localHizmet.content?.beforeAfterItems?.length) {
              setSliderPositions(
                new Array(localHizmet.content.beforeAfterItems.length).fill(50)
              );
              sliderRefs.current = new Array(
                localHizmet.content.beforeAfterItems.length
              ).fill(null);
              setContainerWidths(
                new Array(localHizmet.content.beforeAfterItems.length).fill(0)
              );

              // Set a timeout to measure container widths after rendering
              setTimeout(() => {
                const newWidths = sliderRefs.current.map(
                  (ref) => ref?.getBoundingClientRect().width || 0
                );
                setContainerWidths(newWidths);
              }, 500);
            }

            return;
          }

          // If no individual content found in fallback, check if it's a category
          const fallbackCategoryData = findContentByCategory(localBlogs, localProjects, localHizmetler, slug);
          const totalFallbackCategoryItems = fallbackCategoryData.blogs.length + fallbackCategoryData.projects.length + fallbackCategoryData.hizmetler.length;
          
          if (totalFallbackCategoryItems > 0) {
            // Find the original category name from the first item
            let categoryName = slug;
            if (fallbackCategoryData.blogs.length > 0) {
              const firstBlog = fallbackCategoryData.blogs[0];
              const matchingCategory = Array.isArray(firstBlog.category)
                ? firstBlog.category.find((cat) => slugify(cat) === slug)
                : firstBlog.category;
              if (matchingCategory) categoryName = matchingCategory;
            } else if (fallbackCategoryData.projects.length > 0) {
              const firstProject = fallbackCategoryData.projects[0];
              const matchingCategory = firstProject.categories.find((cat) => slugify(cat) === slug);
              if (matchingCategory) categoryName = matchingCategory;
            } else if (fallbackCategoryData.hizmetler.length > 0) {
              const firstHizmet = fallbackCategoryData.hizmetler[0];
              const matchingCategory = firstHizmet.categories.find((cat) => slugify(cat) === slug);
              if (matchingCategory) categoryName = matchingCategory;
            }

            setCategoryContent({
              ...fallbackCategoryData,
              categoryName,
            });
            setContentType("category");
            return;
          }

          // If still not found, show 404
          notFound();
        } catch (error) {
          console.error("Error with fallback:", error);
          notFound();
        }
      };

      findContent();
    }
  }, [isLoading, blogs, services, hizmetler, slug]);

  // Update container widths on window resize
  useEffect(() => {
    const handleResize = () => {
      const newWidths = sliderRefs.current.map(
        (ref) => ref?.getBoundingClientRect().width || 0
      );
      setContainerWidths(newWidths);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Before-After slider functions
  const handleSliderChange = (index: number, value: number) => {
    setSliderPositions((prev) => {
      const newPositions = [...prev];
      newPositions[index] = value;
      return newPositions;
    });
  };

  const startDrag = (index: number) => {
    isDragging.current = index;
  };

  const endDrag = () => {
    isDragging.current = null;
  };

  const onDrag = (e: MouseEvent | TouchEvent) => {
    if (isDragging.current === null || !sliderRefs.current[isDragging.current])
      return;

    const container =
      sliderRefs.current[isDragging.current]!.getBoundingClientRect();
    const position =
      "touches" in e
        ? ((e.touches[0].clientX - container.left) / container.width) * 100
        : ((e.clientX - container.left) / container.width) * 100;

    // Constrain the position between 0 and 100
    const constrainedPosition = Math.max(0, Math.min(100, position));
    handleSliderChange(isDragging.current, constrainedPosition);
  };

  // Image preview functions
  const openPreview = (imageSrc: string) => {
    setPreviewImage(imageSrc);
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  // Event listeners for drag
  useEffect(() => {
    window.addEventListener("mouseup", endDrag);
    window.addEventListener("touchend", endDrag);
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("touchmove", onDrag);

    return () => {
      window.removeEventListener("mouseup", endDrag);
      window.removeEventListener("touchend", endDrag);
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("touchmove", onDrag);
    };
  }, []);

  // Show loading state
  if (isLoading || blogsLoading || servicesLoading || hizmetlerLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  // Show 404 if content not found
  if (!contentType) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center flex-col h-[60vh]">
          <h1 className="text-3xl font-bold mb-4">Content Not Found</h1>
          <p className="text-gray-600">
            The requested content could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {contentType === "blog" && blogPost && (
        <section className={blogPost.premium ? "premium-content" : ""}>
          {blogPost.premium && (
            <>
                        <div
              className="position-absolute left-0 w-100"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(245, 158, 11, 1), rgba(245, 158, 11, 0))",
                height: "300px",
              }}
            >
              <div className="container mx-auto relative z-10">
                <div className="flex items-center justify-center gap-2 pt-5">
                  <Award className="w-8 h-8" color="white" />

                  <span className="font-bold text-white text-xl">
                    Premium İçerik
                  </span>
                </div>
              </div>
            </div>
              <div className="w-100 d-flex justify-content-center align-items-center overflow-hidden" style={{ maxHeight: '400px' }}>
              <img 
                src={blogPost.image} 
                alt={blogPost.title}
                style={{ maxWidth: '100%', width: '100%', height: '400px', objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
            </>

          )}

          <div className="container mt-10 mb-10">
            <div className="row">
              <div className="col-md-8 mx-auto">
                <div className="d-flex gap-2">
                  {Array.isArray(blogPost.category) ? (
                    blogPost.category.map((cat, index) => (
                      <Link
                        key={index}
                        href={`/icerikler/${encodeURIComponent(
                          slugify(cat)
                        )}`}
                        className="rounded-pill px-3 fw-bold py-2  tag-spacing fs-7 fw-bold text-uppercase"
                        style={{
                          backgroundColor: blogPost.premium
                            ? "#FFEDD5"
                            : "#f5f5f5",
                          color: blogPost.premium ? "#C2410C" : "#333333",
                        }}
                      >
                        {cat}
                      </Link>
                    ))
                  ) : (
                    <Link
                      href={`/icerikler/${encodeURIComponent(
                        slugify(blogPost.category)
                      )}`}
                      className={`${
                        blogPost.premium
                          ? "bg-amber-100 text-amber-800"
                          : "bg-primary-soft text-primary"
                      } rounded-pill px-3 fw-bold py-2 text-uppercase fs-7`}
                    >
                      {blogPost.category}
                    </Link>
                  )}
                  {blogPost.premium && (
                    <span className="bg-amber-500 text-white rounded-pill px-3 fw-bold py-2 text-uppercase fs-7 ml-2">
                      Premium
                    </span>
                  )}
                </div>
                <h5
                  className={`ds-5 mt-3 mb-4 ${
                    blogPost.premium ? "text-amber-800" : ""
                  }`}
                >
                  {blogPost.title}
                </h5>
                <p className="fs-5 text-900 mb-0">
                  {parse(blogPost.content.intro)}
                </p>
                <div
                  className={`d-flex align-items-center justify-content-between mt-7 py-3 border-top border-bottom ${
                    blogPost.premium ? "border-amber-200" : ""
                  }`}
                >
                  <div className="d-flex align-items-center position-relative z-1">
                    <div
                      className={`icon-shape rounded-circle border border-2 border-white ${
                        blogPost.premium ? "bg-amber-500" : "bg-primary"
                      } d-flex justify-content-center align-items-center`}
                      style={{ width: "40px", height: "40px" }}
                    >
                      <span className="text-white font-weight-bold">
                        {blogPost.content.author.name
                          .substring(0, 2)
                          .toUpperCase()}
                      </span>
                    </div>
                    <div className="ms-3">
                      <h6 className="fs-7 m-0">
                        {blogPost.content.author.name}
                      </h6>
                      <p className="mb-0 fs-8">
                        {blogPost.content.author.date}
                      </p>
                    </div>
                    <Link
                      href="#"
                      className="position-absolute bottom-0 start-0 end-0 top-0 z-0"
                    />
                  </div>
                  <div className="d-flex align-items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 19.25C16.0041 19.25 19.25 16.0041 19.25 12C19.25 7.99594 16.0041 4.75 12 4.75C7.99594 4.75 4.75 7.99594 4.75 12C4.75 16.0041 7.99594 19.25 12 19.25Z"
                        stroke="#111827"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M12 8V12L14 14"
                        stroke="#111827"
                        strokeWidth="1.5"
                      />
                    </svg>
                    <span className="ms-2 fs-7 text-900">
                      {blogPost.content.readTime} okuma süresi
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md-10 mx-auto my-7">
                <div
                  className="d-flex justify-content-center align-items-center overflow-hidden rounded-4"
                  style={{ maxHeight: "450px" }}
                >
                  <img
                    className={`rounded-4 ${
                      blogPost.premium ? "shadow-lg" : ""
                    }`}
                    src={blogPost.content.mainImage}
                    alt={blogPost.title}
                    style={{
                      width: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                </div>
              </div>
              <div className="col-md-8 mx-auto">
                <div
                  className={`blog-content tw-prose tw-prose-lg tw-max-w-none ${
                    blogPost.premium ? "premium-blog-content" : ""
                  }`}
                >
                  {blogPost.content.fullContent &&
                    parse(blogPost.content.fullContent)}
                </div>

                {blogPost.premium && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-8">
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-amber-600"
                      >
                        <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z"></path>
                      </svg>
                      <h5 className=" m-0 text-md">Premium İçerik</h5>
                    </div>
                    <p className="text-amber-700 mb-0">
                      Premium kalitesinde içerik görüntülüyorsunuz. Değerli
                      premium abonemiz olduğunuz için teşekkür ederiz.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Add premium styling */}
          {blogPost.premium && (
            <style jsx global>{`
              .premium-container {
                position: relative;
              }

              .premium-container::before {
                content: "";
                position: absolute;
                top: -60px;
                left: 0;
                right: 0;
                height: 60px;
                background: linear-gradient(
                  to bottom,
                  rgba(251, 191, 36, 0.1),
                  transparent
                );
                pointer-events: none;
              }

              .premium-blog-content {
                font-family: "Georgia", serif;
                line-height: 1.8;
              }

              .premium-blog-content h1,
              .premium-blog-content h2,
              .premium-blog-content h3 {
                color: #92400e;
              }

              .premium-blog-content blockquote {
                border-left-color: #f59e0b;
                background-color: rgba(251, 191, 36, 0.1);
              }

              .premium-blog-content a {
                color: #b45309;
                text-decoration: underline;
              }
            `}</style>
          )}
        </section>
      )}

      {contentType === "hizmet" && hizmet && (
        <div>
          {/* Main Banner Section */}
          <section className="section-cta-8">
            <div className="container-fluid position-relative py-5">
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-lg-5">
                    <h5 className="ds-5 mt-2">
                      {hizmet.content.bannerSectionTitle}
                    </h5>
                    <p>{hizmet.content.bannerSectionDescription}</p>
                  </div>
                  <div className="col-lg-6 offset-lg-1 text-center mt-lg-0 mt-8">
                    <div className="position-relative z-1 d-inline-block mb-lg-0 mb-8">
                      <img
                        className="rounded-4 position-relative z-1"
                        src={
                          hizmet.content.bannerSectionImage ||
                          hizmet.content.mainImage ||
                          hizmet.image
                        }
                        alt={hizmet.content.bannerSectionTitle || hizmet.title}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Before-After Section */}
          {hizmet.content.beforeAfterItems &&
            hizmet.content.beforeAfterItems.length > 0 && (
              <section className="section-before-after py-5 position-relative">
                <div className="container">
                  <div className="row position-relative z-1">
                    <div className="text-center mb-5">
                      <h4
                        className="ds-4 my-3"
                        data-aos="fade-zoom-in"
                        data-aos-delay={200}
                      >
                        {hizmet.content.beforeAfterSectionTitle ||
                          "Before-After Comparison"}
                      </h4>
                      {hizmet.content.beforeAfterSectionDescription && (
                        <p
                          className="fs-5"
                          data-aos="fade-zoom-in"
                          data-aos-delay={300}
                        >
                          {hizmet.content.beforeAfterSectionDescription}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    {hizmet.content.beforeAfterItems.map((item, index) => (
                      <div className="col-lg-4 mb-4" key={index}>
                        <div
                          className="before-after-container position-relative rounded-4 overflow-hidden"
                          ref={(el) => {
                            if (sliderRefs.current.length <= index) {
                              sliderRefs.current = [
                                ...sliderRefs.current,
                                ...Array(
                                  index - sliderRefs.current.length + 1
                                ).fill(null),
                              ];
                            }
                            sliderRefs.current[index] = el;
                          }}
                          style={{ height: "400px" }}
                          onMouseDown={() => startDrag(index)}
                          onTouchStart={() => startDrag(index)}
                        >
                          {/* Title and description if provided */}
                          {(item.title || item.description) && (
                            <div className="position-absolute top-0 start-0 w-100 p-3 z-10 text-white bg-gradient-to-b from-black/70 to-transparent">
                              {item.title && (
                                <h5 className="mb-1">{item.title}</h5>
                              )}
                              {item.description && (
                                <p className="mb-0 small">{item.description}</p>
                              )}
                            </div>
                          )}

                          {/* Before image (full width) */}
                          <div className="before-image position-absolute top-0 start-0 w-100 h-100">
                            <img
                              src={item.beforeImage}
                              alt="Before"
                              className="w-100 h-100"
                              style={{
                                objectFit: "cover",
                                objectPosition: "center",
                              }}
                            />
                          </div>

                          {/* After image (partial width controlled by slider) */}
                          <div
                            className="after-image position-absolute top-0 start-0 h-100 overflow-hidden"
                            style={{
                              width: `${sliderPositions[index] || 50}%`,
                            }}
                          >
                            <div className="position-relative h-100 w-100">
                              <img
                                src={item.afterImage}
                                alt="After"
                                className="position-absolute h-100"
                                style={{
                                  objectFit: "cover",
                                  objectPosition: "center",
                                  top: "0",
                                  left: "0",
                                  width: containerWidths[index]
                                    ? `${containerWidths[index]}px`
                                    : "100%",
                                  maxWidth: "none",
                                }}
                              />
                            </div>
                          </div>

                          {/* Divider line */}
                          <div
                            className="divider-line position-absolute top-0 h-100"
                            style={{
                              left: `${sliderPositions[index] || 50}%`,
                              width: "4px",
                              backgroundColor: "white",
                              boxShadow: "0 0 8px rgba(0,0,0,0.5)",
                              zIndex: 20,
                              transform: "translateX(-50%)",
                            }}
                          ></div>

                          {/* Circular handle */}
                          <div
                            className="handle-circle position-absolute rounded-circle bg-white"
                            style={{
                              width: "40px",
                              height: "40px",
                              top: "50%",
                              left: `${sliderPositions[index] || 50}%`,
                              transform: "translate(-50%, -50%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                              border: "2px solid #fff",
                              zIndex: 30,
                              cursor: "ew-resize",
                            }}
                          >
                            <Eye size={20} color="#333" />
                          </div>

                          {/* Slider input (hidden but used for functionality) */}
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={sliderPositions[index] || 50}
                            onChange={(e) =>
                              handleSliderChange(index, Number(e.target.value))
                            }
                            className="position-absolute opacity-0 w-100"
                            style={{
                              height: "100%",
                              cursor: "ew-resize",
                              zIndex: 40,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

          {/* Left-Right Section */}
          {hizmet.content.leftRightItems &&
            hizmet.content.leftRightItems.length > 0 && (
              <section className="section-feature-5">
                <div className="container-fluid position-relative py-5">
                  <div className="container">
                    {hizmet.content.leftRightSectionTitle && (
                      <div className="row text-center mb-5">
                        <div className="col-12">
                          <h4 className="ds-4">
                            {hizmet.content.leftRightSectionTitle}
                          </h4>
                        </div>
                      </div>
                    )}

                    {hizmet.content.leftRightItems.map((item, index) => (
                      <div
                        key={index}
                        className={`row align-items-center justify-content-between text-center ${
                          index > 0 ? "mt-5" : ""
                        }`}
                      >
                        <div
                          className={`col-lg-5 ${
                            item.isRightAligned ? "order-lg-2" : ""
                          }`}
                        >
                          <div className="position-relative rounded-4 mx-auto">
                            <img
                              className="rounded-4 border border-2 border-white position-relative z-1 img-fluid"
                              src={item.image}
                              alt={item.title}
                            />
                            <div className="box-gradient-1 position-absolute bottom-0 start-50 translate-middle-x bg-linear-1 rounded-4 z-0" />
                          </div>
                        </div>
                        <div
                          className={`col-lg-5 ${
                            item.isRightAligned ? "order-lg-1" : ""
                          } mt-lg-0 mt-5 ${
                            item.isRightAligned ? "" : "ms-auto"
                          }`}
                        >
                          <h4 className="fw-bold">
                            <span
                              className="fw-bold"
                              data-aos="fade-zoom-in"
                              data-aos-delay={200}
                            >
                              {item.title}
                            </span>
                          </h4>
                          {item.description && (
                            <p className="fs-5">{item.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

          {/* Image Gallery Section */}
          {hizmet.content.galleryImages &&
            hizmet.content.galleryImages.length > 0 && (
              <section className="section-team-1 py-5 position-relative overflow-hidden">
                <div className="container">
                  <div className="row position-relative z-1">
                    <div className="text-center">
                      <h4
                        className="ds-4 my-3"
                        data-aos="fade-zoom-in"
                        data-aos-delay={200}
                      >
                        {hizmet.content.gallerySectionTitle || "Gallery"}
                      </h4>
                      {hizmet.content.gallerySectionDescription && (
                        <p
                          className="fs-5"
                          data-aos="fade-zoom-in"
                          data-aos-delay={300}
                        >
                          {hizmet.content.gallerySectionDescription}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="row mt-6">
                    {hizmet.content.galleryImages.map((image, index) => (
                      <div
                        key={index}
                        className="col-lg-4 col-md-6 mb-lg-4 mb-7 text-center"
                        data-aos="fade-zoom-in"
                        data-aos-delay={100 + index * 100}
                      >
                        <div className="position-relative d-inline-block z-1">
                          <div
                            className="zoom-img rounded-3 cursor-pointer"
                            onClick={() => openPreview(image.image)}
                          >
                            <img
                              className="img-fluid w-100"
                              src={image.image}
                              alt={image.title || `Gallery image ${index + 1}`}
                            />
                            {image.title && (
                              <div className="image-caption position-absolute bottom-0 left-0 w-100 p-2 bg-black bg-opacity-50 text-white">
                                <p className="mb-0">{image.title}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

          {/* Content Section */}
          {hizmet.content.fullContent && (
            <div className="container my-7">
              <div className="row">
                <div className="col-md-8 mx-auto">
                  <div className="blog-content tw-prose tw-prose-lg tw-max-w-none">
                    {parse(hizmet.content.fullContent)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {contentType === "category" && categoryContent && (
        <div className="container mt-5 mb-5">
          <div className="row">
            <div className="col-12">
              <div className="text-center mb-5">
                <h2 className="ds-4 mb-3">Kategori: {categoryContent.categoryName}</h2>
                <p className="fs-5 text-muted">
                  Bu kategoriye ait toplam {
                    categoryContent.blogs.length + 
                    categoryContent.projects.length + 
                    categoryContent.hizmetler.length
                  } içerik bulundu
                </p>
              </div>
            </div>
          </div>

          {/* Blog Posts */}
          {categoryContent.blogs.length > 0 && (
            <div className="row mb-5">
              <div className="col-12">
                <h4 className="mb-4">Blog Yazıları ({categoryContent.blogs.length})</h4>
              </div>
              {categoryContent.blogs.map((blog, index) => (
                <div key={index} className="col-lg-4 col-md-6 mb-4">
                  <div className="card border-0 rounded-3 position-relative bg-gray-50">
                    <div
                      className="blog-image-container"
                      style={{
                        height: "220px",
                        width: "100%",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <img
                        className="rounded-top-3"
                        src={blog.image}
                        alt={blog.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                      />
                      {blog.premium && (
                        <>
                          <div className="position-absolute top-0 end-0 m-2">
                            <div className="bg-amber-500 text-white px-2 py-1 rounded-pill fs-8 fw-bold">
                              Premium
                            </div>
                          </div>
                          <div
                            className="position-absolute bottom-0 left-0 w-100"
                            style={{
                              background:
                                "linear-gradient(to top, rgba(245, 158, 11, 1), rgba(245, 158, 11, 0))",
                              height: "100px",
                            }}
                          ></div>
                        </>
                      )}
                    </div>
                    <div className="card-body p-3">
                      <div className="d-flex flex-wrap gap-1 mb-3">
                        {Array.isArray(blog.category) ? (
                          blog.category.map((cat, idx) => (
                            <Link
                              key={idx}
                              href={`/icerikler/${encodeURIComponent(slugify(cat))}`}
                              className="rounded-pill px-3 py-1 fs-8 fw-bold text-uppercase"
                              style={{
                                backgroundColor: blog.premium ? "#FFEDD5" : "#f5f5f5",
                                color: blog.premium ? "#C2410C" : "#333333",
                              }}
                            >
                              {cat}
                            </Link>
                          ))
                        ) : (
                          <Link
                            href={`/icerikler/${encodeURIComponent(slugify(blog.category))}`}
                            className="rounded-pill px-3 py-1 fs-8 fw-bold text-uppercase"
                            style={{
                              backgroundColor: blog.premium ? "#FFEDD5" : "#f5f5f5",
                              color: blog.premium ? "#C2410C" : "#333333",
                            }}
                          >
                            {blog.category}
                          </Link>
                        )}
                      </div>
                      <h6 className={`mb-3 ${blog.premium ? "text-orange-700" : "text-gray-800"}`}>
                        {blog.title}
                      </h6>
                      <p className="text-gray-700 fs-7">{blog.description}</p>
                    </div>
                    <Link
                      href={`/icerikler/${encodeURIComponent(slugify(blog.title))}`}
                      className="position-absolute bottom-0 start-0 end-0 top-0 z-0"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {categoryContent.projects.length > 0 && (
            <div className="row mb-5">
              <div className="col-12">
                <h4 className="mb-4">Projeler ({categoryContent.projects.length})</h4>
              </div>
              {categoryContent.projects.map((project, index) => (
                <div key={index} className="col-lg-4 col-md-6 mb-4">
                  <div className="card border-0 rounded-3 position-relative bg-gray-50">
                    <div
                      className="project-image-container"
                      style={{
                        height: "220px",
                        width: "100%",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <img
                        className="rounded-top-3"
                        src={project.image}
                        alt={project.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                      />
                    </div>
                    <div className="card-body p-3">
                      <div className="d-flex flex-wrap gap-1 mb-3">
                        {project.categories.map((cat, idx) => (
                          <Link
                            key={idx}
                            href={`/icerikler/${encodeURIComponent(slugify(cat))}`}
                            className="rounded-pill px-3 py-1 fs-8 fw-bold text-uppercase bg-primary-soft text-primary"
                          >
                            {cat}
                          </Link>
                        ))}
                      </div>
                      <h6 className="mb-3 text-gray-800">{project.title}</h6>
                      <p className="text-gray-700 fs-7">{project.description}</p>
                    </div>
                    <Link
                      href={`/icerikler/${encodeURIComponent(slugify(project.title))}`}
                      className="position-absolute bottom-0 start-0 end-0 top-0 z-0"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Hizmetler */}
          {categoryContent.hizmetler.length > 0 && (
            <div className="row mb-5">
              <div className="col-12">
                <h4 className="mb-4">Hizmetler ({categoryContent.hizmetler.length})</h4>
              </div>
              {categoryContent.hizmetler.map((hizmet, index) => (
                <div key={index} className="col-lg-4 col-md-6 mb-4">
                  <div className="card border-0 rounded-3 position-relative bg-gray-50">
                    <div
                      className="hizmet-image-container"
                      style={{
                        height: "220px",
                        width: "100%",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <img
                        className="rounded-top-3"
                        src={hizmet.image}
                        alt={hizmet.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                      />
                    </div>
                    <div className="card-body p-3">
                      <div className="d-flex flex-wrap gap-1 mb-3">
                        {hizmet.categories.map((cat, idx) => (
                          <Link
                            key={idx}
                            href={`/icerikler/${encodeURIComponent(slugify(cat))}`}
                            className="rounded-pill px-3 py-1 fs-8 fw-bold text-uppercase bg-secondary-soft text-secondary"
                          >
                            {cat}
                          </Link>
                        ))}
                      </div>
                      <h6 className="mb-3 text-gray-800">{hizmet.title}</h6>
                      <p className="text-gray-700 fs-7">{hizmet.description}</p>
                    </div>
                    <Link
                      href={`/icerikler/${encodeURIComponent(slugify(hizmet.title))}`}
                      className="position-absolute bottom-0 start-0 end-0 top-0 z-0"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="image-preview-modal position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(0,0,0,0.8)", zIndex: 9999 }}
          onClick={closePreview}
        >
          <div
            className="position-relative"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "95vw",
              height: "95vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={previewImage}
              alt="Preview"
              className="img-fluid"
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                objectFit: "contain",
                transform: "scale(1.5)",
                transformOrigin: "center",
              }}
            />
            <button
              className="btn btn-light position-absolute"
              onClick={closePreview}
              style={{
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                top: "10px",
                right: "10px",
                fontSize: "30px",
                fontWeight: "bold",
                padding: "0",
                zIndex: 10000,
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
} 