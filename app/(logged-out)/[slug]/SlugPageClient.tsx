"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs } from "@/redux/actions/blogActions";
import { getAllHizmetler } from "@/redux/actions/hizmetActions";
import { AppDispatch, RootState } from "@/redux/store";
import Link from "next/link";
import parse from "html-react-parser";
import { notFound } from "next/navigation";
import { Award, Eye, List, Hash, Minus, Circle, Square, Triangle, Star } from "lucide-react";

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
  const [contentType, setContentType] = useState<
    "blog" | "project" | "hizmet" | null
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

  // For Table of Contents
  const [tocItems, setTocItems] = useState<{id: string, text: string, level: number}[]>([]);
  const [activeHeading, setActiveHeading] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

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

  // Table of Contents functions
  const generateTOC = useCallback(() => {
    if (!contentRef.current) return;

    const headings = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const items: {id: string, text: string, level: number}[] = [];

    headings.forEach((heading, index) => {
      const text = heading.textContent || '';
      const level = parseInt(heading.tagName.charAt(1));
      const id = `heading-${index}`;
      
      // Add ID to heading if it doesn't have one
      if (!heading.id) {
        heading.id = id;
      }

      items.push({
        id: heading.id,
        text,
        level
      });
    });

    setTocItems(items);
  }, []);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = useCallback(() => {
    if (!contentRef.current) return;

    const headings = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let activeId = '';

    for (let i = headings.length - 1; i >= 0; i--) {
      const heading = headings[i] as HTMLElement;
      const rect = heading.getBoundingClientRect();
      
      if (rect.top <= 150) {
        activeId = heading.id;
        break;
      }
    }

    setActiveHeading(activeId);
  }, []);

  // Check if desktop
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1200);
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Generate TOC when content loads
  useEffect(() => {
    if (contentType && (blogPost || hizmet)) {
      // Delay to ensure content is rendered
      setTimeout(generateTOC, 500);
    }
  }, [contentType, blogPost, hizmet, generateTOC]);

  // Add scroll listener
  useEffect(() => {
    if (tocItems.length > 0 && isDesktop) {
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
      
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [tocItems, isDesktop, handleScroll]);

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
          <h1 className="text-3xl font-bold mb-4">Sayfa Bulunamadı</h1>
          <p className="text-gray-600">
            İstenen içerik bulunamadı.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="position-relative">
      {/* Table of Contents - Only for desktop */}
      {isDesktop && tocItems.length > 0 && (
        <div 
          className="position-fixed bg-white rounded-3 shadow-lg p-4"
          style={{
            top: '20%',
            right: '2rem',
            width: '280px',
            maxHeight: '60vh',
            overflowY: 'auto',
            zIndex: 1000,
            border: '1px solid #e5e7eb'
          }}
        >
          <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
            <h6 className="mb-0 fw-bold text-dark">İçindekiler</h6>
          </div>
          
          <nav>
            <ul className="list-unstyled mb-0">
              {tocItems.map((item, index) => (
                <li key={index} className="mb-1">
                  <button
                    onClick={() => scrollToHeading(item.id)}
                    className={`btn btn-link text-start p-2 w-100 text-decoration-none d-block ${
                      activeHeading === item.id
                        ? 'bg-light text-dark fw-bold'
                        : 'text-muted'
                    }`}
                                          style={{
                        paddingLeft: `${(item.level - 1) * 12 + 8}px`,
                        fontSize: item.level === 1 ? '14px' : '13px',
                        lineHeight: '1.4',
                        border: 'none',
                        borderRadius: '6px',
                        transition: 'all 0.2s ease'
                      }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      {activeHeading === item.id && (
                        <span className="flex-shrink-0">
                          {item.level === 1 && <Hash size={14} className="text-dark" />}
                          {item.level === 2 && <Minus size={14} className="text-dark" />}
                          {item.level === 3 && <Circle size={12} className="text-dark" />}
                          {item.level === 4 && <Square size={12} className="text-dark" />}
                          {item.level === 5 && <Triangle size={12} className="text-dark" />}
                          {item.level === 6 && <Star size={12} className="text-dark" />}
                        </span>
                      )}
                      <span className="flex-grow-1">{item.text}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

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
                  ref={contentRef}
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
                  <div 
                    ref={contentRef}
                    className="blog-content tw-prose tw-prose-lg tw-max-w-none"
                  >
                    {parse(hizmet.content.fullContent)}
                  </div>
                </div>
              </div>
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
            style={{
              width: "80%",
              height: "80%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={previewImage}
              alt="Preview"
              className="img-fluid"
              onClick={(e) => e.stopPropagation()}
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
            <button
              className="position-absolute"
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
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
