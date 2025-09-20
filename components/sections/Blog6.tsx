"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs, getAllCategories } from "@/redux/actions/blogActions";
import { getOther } from "@/redux/actions/otherActions";
import { getMyProfile } from "@/redux/actions/userActions";
import { AppDispatch, RootState } from "@/redux/store";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import PremiumContentDialog from "@/components/PremiumContentDialog";

interface Blog6Props {
  previewData?: any;
  selectedCategory?: string | null;
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

export default function Blog6({ previewData, selectedCategory }: Blog6Props) {
  const [data, setData] = useState<any>(null);
  const [filteredBlogs, setFilteredBlogs] = useState<any[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const {
    blogs,
    categories,
    loading: blogLoading,
    error,
  } = useSelector((state: RootState) => state.blog);
  const { other, loading: otherLoading } = useSelector(
    (state: RootState) => state.other
  );
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );
  const router = useRouter();
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [currentPremiumPost, setCurrentPremiumPost] = useState<any>(null);

  // Premium kontrolü - === true ile kesin kontrol
  const isPremiumUser = isAuthenticated && user?.isPremium === true;

  // Kullanıcı profil bilgilerini güncelle
  useEffect(() => {
    dispatch(getMyProfile());
  }, [dispatch]);

  useEffect(() => {
    // Fetch blogs with category filter if provided
    if (selectedCategory) {
      dispatch(getAllBlogs({ category: selectedCategory }));
    } else {
      dispatch(getAllBlogs());
    }

    // Also fetch other data if not provided in preview
    if (!previewData) {
      dispatch(getOther());
    }
  }, [dispatch, previewData, selectedCategory]);

  useEffect(() => {
    // If preview data is provided, use it
    if (previewData && previewData.blog1) {
      setData(previewData.blog1);
    }
    // Otherwise use Redux data
    else if (other && other.blog1) {
      setData(other.blog1);
    }
  }, [previewData, other]);

  // Filter blogs based on selected category
  useEffect(() => {
    if (!blogs || blogs.length === 0) return;

    // If selected category is provided, blogs should already be filtered from the API
    // But we keep this for client-side filtering fallback
    if (selectedCategory) {
      const filtered = blogs.filter((blog) => {
        if (Array.isArray(blog.category)) {
          return blog.category.some(
            (cat: string) =>
              cat.toLowerCase() === selectedCategory.toLowerCase()
          );
        } else if (typeof blog.category === "string") {
          return blog.category.toLowerCase() === selectedCategory.toLowerCase();
        }
        return false;
      });
      setFilteredBlogs(filtered);
    } else {
      setFilteredBlogs(blogs);
    }
  }, [blogs, selectedCategory]);

  // Handle blog post click with premium check
  const handlePostClick = (e: React.MouseEvent, post: any) => {
    if (post.premium && !isPremiumUser) {
      e.preventDefault();
      setCurrentPremiumPost(post);
      setShowPremiumDialog(true);
    } else if (post.premium && isPremiumUser) {
      // Premium içerik ve kullanıcı premium, normal link davranışı devam eder
    }
  };

  // Handle category click
  const handleCategoryClick = (category: string) => {
    router.push(`/icerikler/${encodeURIComponent(slugify(category))}`);
  };

  const handleDialogClose = () => {
    setShowPremiumDialog(false);
    setCurrentPremiumPost(null);
  };

  if (blogLoading || otherLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!data || !blogs || blogs.length === 0) {
    return null;
  }

  // Use filtered blogs if we have a selectedCategory, otherwise show all
  const blogPosts = filteredBlogs.slice(0, 6);

  // Create styles for customizable elements
  const sectionStyle = {
    backgroundColor: data.backgroundColor || "#ffffff",
  };

  const titleStyle = {
    color: data.titleColor || "#111827",
  };

  const subtitleStyle = {
    color: data.subtitleColor || "#6E6E6E",
  };

  const badgeStyle = {
    backgroundColor: `${data.badgeBackgroundColor || "#f1f0fe"} !important`,
    color: data.badgeTextColor || "#6342EC",
  };

  return (
    <>
      {/* Premium Dialog */}
      <PremiumContentDialog
        isOpen={showPremiumDialog}
        onClose={handleDialogClose}
        title={
          currentPremiumPost?.title
            ? `Premium İçerik: ${currentPremiumPost.title}`
            : "Premium İçerik"
        }
      />

      <section className="section-blog-1 @@padding py-4" style={sectionStyle}>
        <div className="container">
          <div className="row align-items-end ">
            <div className="col-12">
              <h4
                className="ds-5 mt-3 mb-3"
                data-aos="fade-zoom-in"
                data-aos-delay={100}
                style={titleStyle}
              >
                {selectedCategory
                  ? `Kategori: ${selectedCategory}`
                  : "Tüm Blog Yazıları"}
              </h4>
              <span
                className="fs-5 fw-medium"
                data-aos="fade-zoom-in"
                data-aos-delay={200}
                style={subtitleStyle}
              >
                {selectedCategory
                  ? `${blogPosts.length} yazı bulundu`
                  : "Bloglar"}
              </span>
            </div>
          </div>
          <div className="row">
            {blogPosts.length === 0 ? (
              <div className="col-12 text-center py-5">
                <p className="text-muted">
                  Bu kategoride henüz blog yazısı bulunmamaktadır.
                </p>
              </div>
            ) : (
              blogPosts.map((post, index) => (
                <div key={index} className="col-lg-4 text-start">
                  <div
                    className="card border-0 rounded-3 mt-8 position-relative w-100 bg-gray-50"
                    data-aos="fade-zoom-in"
                    data-aos-delay={(index + 1) * 100}
                  >
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
                        src={post.image}
                        alt={post.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                      />
                      {post.premium && (
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
                    <div className="card-body p-0">
                      <div className="d-flex flex-wrap gap-1 mt-3">
                        {Array.isArray(post.category) ? (
                          post.category.map((cat: string, idx: number) => (
                            <button
                              key={idx}
                              onClick={(e) => {
                                e.preventDefault();
                                handleCategoryClick(cat);
                              }}
                              className="position-relative z-1 d-inline-flex rounded-pill px-3 py-2"
                              style={
                                post.premium
                                  ? {
                                      backgroundColor: "#FFEDD5",
                                      color: "#C2410C",
                                    }
                                  : {
                                      backgroundColor: "#f5f5f5",
                                      color: "#333333",
                                    }
                              }
                            >
                              <span className="tag-spacing fs-7 fw-bold text-uppercase">
                                {cat}
                              </span>
                            </button>
                          ))
                        ) : (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleCategoryClick(post.category);
                            }}
                            className="position-relative z-1 d-inline-flex rounded-pill px-3 py-2"
                            style={
                              post.premium
                                ? {
                                    backgroundColor: "#FFEDD5",
                                    color: "#C2410C",
                                  }
                                : {
                                    backgroundColor: "#f5f5f5",
                                    color: "#333333",
                                  }
                            }
                          >
                            <span className="tag-spacing fs-7 fw-bold text-uppercase">
                              {post.category}
                            </span>
                          </button>
                        )}
                      </div>
                      <h6
                        className={`my-3 ${
                          post.premium ? "text-orange-700" : "text-gray-800"
                        }`}
                      >
                        {post.title}
                      </h6>
                      <p className="text-gray-700">{post.description}</p>
                    </div>
                    <Link
                      href={`/${slugify(post.title)}`}
                      className="position-absolute bottom-0 start-0 end-0 top-0 z-0"
                      onClick={(e) => handlePostClick(e, post)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      <style jsx>{`
        .card {
          display: block;
          width: 100%;
        }
        .blog-image-container {
          width: 100%;
        }
        .btn-sm {
          padding: 0.25rem 0.5rem;
          font-size: 0.875rem;
          border-radius: 0.25rem;
        }
        .btn-primary {
          background-color: #6342ec;
          color: white;
          border: 1px solid #6342ec;
        }
        .btn-outline-primary {
          background-color: transparent;
          color: #6342ec;
          border: 1px solid #6342ec;
        }
        .btn-outline-primary:hover {
          background-color: #6342ec;
          color: white;
        }
      `}</style>
    </>
  );
}
