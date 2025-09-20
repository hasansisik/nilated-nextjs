"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllBlogs } from "@/redux/actions/blogActions"
import { getOther } from "@/redux/actions/otherActions"
import { getMyProfile } from "@/redux/actions/userActions"
import { AppDispatch, RootState } from "@/redux/store"
import { Loader2, Video } from "lucide-react"
import Image from "next/image"
import PremiumContentDialog from "@/components/PremiumContentDialog"
import { useRouter } from "next/navigation"

interface Blog5Props {
	previewData?: any;
	selectedCategory?: string;
	selectedAuthor?: string;
	title?: string;
	subtitle?: string;
	isPremiumOnly?: boolean;
}

// Function to convert title to slug
const slugify = (text: string) => {
	// Turkish character mapping
	const turkishMap: {[key: string]: string} = {
		'ç': 'c', 'Ç': 'c',
		'ğ': 'g', 'Ğ': 'g',
		'ı': 'i', 'İ': 'i',
		'ö': 'o', 'Ö': 'o',
		'ş': 's', 'Ş': 's',
		'ü': 'u', 'Ü': 'u'
	};
	
	// Replace Turkish characters
	let result = text.toString();
	for (const [turkishChar, latinChar] of Object.entries(turkishMap)) {
		result = result.replace(new RegExp(turkishChar, 'g'), latinChar);
	}
	
	return result
		.toLowerCase()
		.replace(/\s+/g, '-')        // Replace spaces with -
		.replace(/[^\w\-]+/g, '')    // Remove all non-word chars
		.replace(/\-\-+/g, '-')      // Replace multiple - with single -
		.replace(/^-+/, '')          // Trim - from start of text
		.replace(/-+$/, '');         // Trim - from end of text
};

// Function to truncate text
const truncateText = (text: string, maxLength: number = 120) => {
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength) + '...';
};

export default function Blog5({ previewData, selectedCategory, selectedAuthor, title, subtitle, isPremiumOnly }: Blog5Props = {}) {
	const [data, setData] = useState<any>(null)
	const [posts, setPosts] = useState<any[]>([])
	const [currentPage, setCurrentPage] = useState(1)
	const [postsPerPage] = useState(12) // 3 columns × 4 rows = 12 posts per page
	const dispatch = useDispatch<AppDispatch>()
	const { blogs, loading: blogLoading, error } = useSelector((state: RootState) => state.blog)
	const { other, loading: otherLoading } = useSelector((state: RootState) => state.other)
	const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
	const router = useRouter()
	const [showPremiumDialog, setShowPremiumDialog] = useState(false)
	const [currentPremiumPost, setCurrentPremiumPost] = useState<any>(null)
	
	// Premium kontrolü - === true ile kesin kontrol
	const isPremiumUser = isAuthenticated && user?.isPremium === true;

	// Only dispatch actions if data is missing
	useEffect(() => {
		if (!user?._id) {
			dispatch(getMyProfile());
		}
		
		if (!other?.blog5 && !previewData) {
			dispatch(getOther());
		}
	}, [dispatch, other, user, previewData]);

	// Separate effect for blog fetching with filters
	useEffect(() => {
		const filterParams: any = {};
		if (selectedCategory) filterParams.category = selectedCategory;
		if (selectedAuthor) filterParams.author = selectedAuthor;
		if (isPremiumOnly) filterParams.premium = true;
		
		dispatch(getAllBlogs(filterParams));
	}, [dispatch, selectedCategory, selectedAuthor, isPremiumOnly]);

	useEffect(() => {
		// If preview data is provided, use it
		if (previewData && previewData.blog5) {
			setData(previewData.blog5);
		} 
		// Otherwise use Redux data
		else if (other && other.blog5) {
			// If title/subtitle props are provided, override them
			if (title || subtitle) {
				setData({
					...other.blog5,
					title: title || other.blog5.title,
					subtitle: subtitle || other.blog5.subtitle
				});
			} else {
				setData(other.blog5);
			}
		}
	}, [previewData, other, title, subtitle])

	// Update posts when blogs change
	useEffect(() => {
		if (blogs.length > 0) {
			setPosts(blogs);
		}
	}, [blogs]);
	
	// Handle blog post click with premium check
	const handlePostClick = (e: React.MouseEvent, post: any) => {
		if (post.premium) {
			e.preventDefault();
			if (!isAuthenticated) {
				// Kullanıcı giriş yapmamış, giriş sayfasına yönlendir
				window.location.href = '/giris';
			} else if (!isPremiumUser) {
				// Kullanıcı giriş yapmış ama premium değil, ödeme sayfasına yönlendir
				setCurrentPremiumPost(post);
				setShowPremiumDialog(true);
			}
			// Premium kullanıcı için normal davranış devam eder
		}
	}

	const handleDialogClose = () => {
		setShowPremiumDialog(false);
		setCurrentPremiumPost(null);
	}

	if (blogLoading || otherLoading) {
		return (
			<div className="flex justify-center items-center min-h-[200px]">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		)
	}

	if (error) {
		return (
			<div className="flex justify-center items-center min-h-[200px]">
				<p className="text-red-500">Error: {error}</p>
			</div>
		)
	}

	if (!data) {
		return null
	}

	// Get current posts
	const indexOfLastPost = currentPage * postsPerPage
	const indexOfFirstPost = indexOfLastPost - postsPerPage
	const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)
	
	// Calculate total pages
	const totalPages = Math.ceil(posts.length / postsPerPage)

	// Create page numbers array
	const pageNumbers = []
	for (let i = 1; i <= totalPages; i++) {
		pageNumbers.push(i)
	}

	// Create styles for customizable elements
	const sectionStyle = {
		backgroundColor: data.backgroundColor || "#ffffff"
	};

	const titleStyle = {
		color: data.titleColor || "#111827"
	};

	const subtitleStyle = {
		color: data.subtitleColor || "#6E6E6E"
	};

	return (
		<>
			{/* Premium Dialog */}
			<PremiumContentDialog 
				isOpen={showPremiumDialog} 
				onClose={handleDialogClose}
				title={currentPremiumPost?.title ? `Premium İçerik: ${currentPremiumPost.title}` : 'Premium İçerik'}
			/>
			
			<section className="section-blog-6 py-5 border-bottom" style={sectionStyle}>
				<div className="container">
					<div className="row align-items-end">
						<div className="col">
							<h4 className="ds-4 mt-3 mb-1" style={titleStyle}>{data.title}</h4>
							<span className="fs-5 fw-medium" style={subtitleStyle}>{data.subtitle}</span>
						</div>
					</div>
					<div className="row mt-2">
						{currentPosts.map((post, index) => (
							<div key={index} className="col-lg-4 col-md-6 text-start">
								<div className="card border-0 rounded-3 mt-3 position-relative w-100 bg-gray-50">
									<div className="blog-image-container w-100" style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
										<img 
											className="rounded-top-3" 
											src={post.image} 
											alt={post.title} 
											style={{ 
												width: '100%', 
												height: '100%', 
												objectFit: 'cover',
												objectPosition: 'center'
											}} 
										/>
										{post.premium && (
											<>
												<div className="position-absolute top-0 end-0 m-2 d-flex gap-2">
													<div className="bg-blue-500 text-white px-2 py-1 rounded-pill fs-8 fw-bold d-flex align-items-center">
														<Video size={14} className="me-1" /> Video
													</div>
													<div className="bg-amber-500 text-white px-2 py-1 rounded-pill fs-8 fw-bold">
														Premium
													</div>
												</div>
												<div className="position-absolute bottom-0 left-0 w-100" style={{
													background: 'linear-gradient(to top, rgba(245, 158, 11, 1), rgba(245, 158, 11, 0))',
													height: '100px'
												}}></div>
											</>
										)}
									</div>
									<div className="card-body p-0">
										<Link 
											href={`/icerikler/${encodeURIComponent(slugify(post.category[0]))}`} 
											className="position-relative z-1 d-inline-flex rounded-pill px-3 py-2 mt-3"
											style={post.premium ? 
												{ backgroundColor: '#FFEDD5', color: '#C2410C' } : 
												{ backgroundColor: '#f5f5f5', color: '#333333' }
											}
										>
											<span className="tag-spacing fs-7 fw-bold">
												{post.category[0]}
											</span>
										</Link>
										<h6 className={`my-3 ${post.premium ? 'text-orange-700' : 'text-gray-800'}`}>{post.title}</h6>
										<p className="text-gray-700">{truncateText(post.description)}</p>
									</div>
									<Link 
										href={`/${slugify(post.title)}`} 
										className="position-absolute bottom-0 start-0 end-0 top-0 z-0"
										onClick={(e) => handlePostClick(e, post)}
									/>
								</div>
							</div>
						))}
					</div>
				</div>
				{totalPages > 1 && (
					<div className="container">
						<div className="row pt-5 text-start">
							<div className="d-flex justify-content-start align-items-center">
								<nav aria-label="Page navigation example">
									<ul className="pagination gap-2">
										<li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
											<Link 
												className="icon-xl fs-5 page-link pagination_item border-0 rounded-circle icon-shape fw-bold bg-neutral-100 text-900" 
												href="#" 
												aria-label="Previous"
												onClick={(e) => {
													e.preventDefault();
													if (currentPage > 1) setCurrentPage(currentPage - 1);
												}}
											>
												<svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 22 22" fill="none">
													<path className="stroke-dark" d="M9.49554 6.5L4.78125 11L9.49554 15.5" stroke="#111827" strokeWidth="1.28571" strokeLinecap="round" strokeLinejoin="round" />
													<path className="stroke-dark" d="M17.2143 11H5" stroke="#111827" strokeWidth="1.28571" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</Link>
										</li>
										{pageNumbers.map(number => (
											<li key={number} className="page-item">
												<Link 
													className={`icon-xl fs-5 page-link pagination_item border-0 rounded-circle icon-shape fw-bold bg-neutral-100 text-900 ${currentPage === number ? 'active' : ''}`} 
													href="#"
													onClick={(e) => {
														e.preventDefault();
														setCurrentPage(number);
													}}
												>
													{number}
												</Link>
											</li>
										))}
										<li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
											<Link 
												className="icon-xl fs-5 page-link pagination_item border-0 rounded-circle icon-shape fw-bold bg-neutral-100 text-900" 
												href="#" 
												aria-label="Next"
												onClick={(e) => {
													e.preventDefault();
													if (currentPage < totalPages) setCurrentPage(currentPage + 1);
												}}
											>
												<svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 22 22" fill="none">
													<path className="stroke-dark" d="M12.5 6.5L17.2143 11L12.5 15.5" stroke="#111827" strokeWidth="1.28571" strokeLinecap="round" strokeLinejoin="round" />
													<path className="stroke-dark" d="M16.9955 11H4.78125" stroke="#111827" strokeWidth="1.28571" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</Link>
										</li>
									</ul>
								</nav>
							</div>
						</div>
					</div>
				)}
			</section>
			<style jsx>{`
				.card {
					display: block;
					width: 100%;
				}
			`}</style>
		</>
	)
}
