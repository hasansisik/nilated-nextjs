'use client'
import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { getAllHizmetler } from '@/redux/actions/hizmetActions';
import { getOther } from '@/redux/actions/otherActions';
import { AppDispatch, RootState } from '@/redux/store';
import { Loader2 } from 'lucide-react';

interface Services5Props {
	previewData?: any;
	hizmetler?: any[];
	categories?: { id: string; name: string }[];
}

// Function to convert title to slug
const slugify = (text: string) => {
	// Turkish character mapping
	const turkishMap: {[key: string]: string} = {
		'ç': 'c', 'Ç': 'C',
		'ğ': 'g', 'Ğ': 'G',
		'ı': 'i', 'İ': 'I',
		'ö': 'o', 'Ö': 'O',
		'ş': 's', 'Ş': 'S',
		'ü': 'u', 'Ü': 'U'
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
	if (!text) return '';
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength) + '...';
};

export default function Services5({ previewData }: Services5Props) {
	const [filterKey, setFilterKey] = useState<string>('*');
	const [data, setData] = useState<any>(null);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dispatch = useDispatch<AppDispatch>();
	const { hizmetler, loading: hizmetlerLoading, error } = useSelector((state: RootState) => state.hizmet);
	const { other, loading: otherLoading } = useSelector((state: RootState) => state.other);

	// Extract unique categories from hizmetler and standardize their IDs
	const categories = hizmetler ? 
		[...new Set(hizmetler.flatMap(hizmet => hizmet.categories || []))]
			.filter(category => category)
			.map(category => ({ 
				id: typeof category === 'string' ? slugify(category) : '', 
				name: category 
			})) 
		: [];

	useEffect(() => {
		// Fetch hizmetler if not provided
		dispatch(getAllHizmetler());
		
		// Also fetch other data if not provided in preview
		if (!previewData) {
			dispatch(getOther());
		}
	}, [dispatch, previewData]);

	useEffect(() => {
		// If preview data is provided, use it
		if (previewData && previewData.services5) {
			setData(previewData.services5);
		} 
		// Otherwise use Redux data
		else if (other && other.services5) {
			setData(other.services5);
		}
	}, [previewData, other]);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const dropdown = document.querySelector('.dropdown');
			if (dropdown && !dropdown.contains(event.target as Node)) {
				setIsDropdownOpen(false);
			}
		};

		if (isDropdownOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isDropdownOpen]);

	// Filter hizmetler based on selected category
	const filteredHizmetler = hizmetler ? hizmetler.filter(hizmet => {
		if (filterKey === '*') return true;
		
		if (Array.isArray(hizmet.categories)) {
			return hizmet.categories.some((cat: string) => 
				typeof cat === 'string' ? slugify(cat) === filterKey : false
			);
		}
		return false;
	}) : [];

	const handleFilterKeyChange = (key: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setFilterKey(key);
		setIsDropdownOpen(false); // Close dropdown when category is selected
	};

	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen);
	};

	// Get current filter display name
	const getCurrentFilterName = () => {
		if (filterKey === '*') return data?.filterAllText || "Hepsi";
		const currentCategory = categories.find(cat => cat.id === filterKey);
		return currentCategory ? currentCategory.name : data?.filterAllText || "Hepsi";
	};

	const activeBtn = (value: string) => {
		return "btn btn-md btn-filter mb-2 me-2";
	};

	const getButtonStyle = (value: string) => {
		if (value === filterKey) {
			return {
				backgroundColor: data?.filterButtonColor || "#6342EC",
				color: data?.filterButtonTextColor || "#FFFFFF",
				transition: "none !important"
			};
		}
		return {
			backgroundColor: "transparent",
			color: "#333333",
			border: "1px solid #ddd",
			transition: "none !important"
		};
	};

	if (hizmetlerLoading || otherLoading || !data) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<p className="text-red-500">Error: {error}</p>
			</div>
		);
	}

	// Create styles for customizable elements
	const sectionStyle = {
		backgroundColor: data.backgroundColor || "#ffffff"
	};

	const titleStyle = {
		color: data.titleColor || "#333333"
	};

	const subtitleStyle = {
		backgroundColor: data.subtitleVisible !== false ? (data.subtitleBackgroundColor || "rgba(99, 66, 236, 0.1)") : "transparent",
		color: data.subtitleTextColor || "#6342EC"
	};

	const descriptionStyle = {
		color: data.descriptionColor || "#6E6E6E"
	};

	const buttonStyle = {
		backgroundColor: data.buttonColor || "#6342EC",
		color: data.buttonTextColor || "#FFFFFF"
	};



	return (
		<>
			{/* Services 5 */}
			<section className="section-team-1 position-relative fix py-5" style={sectionStyle}>
				<div className="container position-relative z-2">
					<div className="text-center">
						{data.subtitleVisible !== false && (
							<div className="d-flex align-items-center justify-content-center border border-2 border-white d-inline-flex rounded-pill px-4 py-2" data-aos="zoom-in" data-aos-delay={100} style={subtitleStyle}>
								<span className="tag-spacing fs-7 fw-bold ms-2 text-uppercase">{data.subtitle}</span>
							</div>
						)}
						<h3 className="ds-5 my-3" style={titleStyle}>{data.title}</h3>
						<p className="fs-5" style={descriptionStyle}>
							{data.description}
						</p>
					</div>
					<div className="text-center mt-6">
						
					</div>
					{data.buttonVisible !== false && (
						<div className="text-center mt-4">
							<Link href={data.buttonLink || "#"} className="btn btn-primary" style={buttonStyle}>
								{data.buttonText}
							</Link>
						</div>
					)}
					{data.linkVisible !== false && (
						<div className="text-center mt-2">
							<Link href={data.linkUrl || "#"} className="text-decoration-underline">
								{data.linkText}
							</Link>
						</div>
					)}
				</div>
				<div className="container mt-6">
					<div className="row">
						{filteredHizmetler && filteredHizmetler.map((hizmet, index) => {
							// Process categories to ensure consistent slugification
							const categoryClasses = Array.isArray(hizmet.categories) 
								? hizmet.categories.map((cat: string) => 
									typeof cat === 'string' ? slugify(cat) : ''
								).filter(Boolean).join(' ') 
								: '';
								
							return (
								<div 
									key={hizmet._id || hizmet.id} 
									className="col-12 col-md-4 mb-4"
								>
									<div className="card border-0 rounded-3 mt-8 position-relative w-100 bg-gray-50" data-aos="fade-zoom-in" data-aos-delay={(index + 1) * 100}>
										<div className="blog-image-container" style={{ height: '220px', width: '100%', overflow: 'hidden', position: 'relative' }}>
											<img 
												className="rounded-top-3" 
												src={hizmet.image} 
												alt={hizmet.title || "Hizmet image"} 
												style={{ 
													width: '100%', 
													height: '100%', 
													objectFit: 'cover',
													objectPosition: 'center'
												}} 
											/>
											<div className="position-absolute bottom-0 left-0 w-100" style={{
												background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0))',
												height: '100px'
											}}></div>
										</div>
										<div className="card-body p-0">
											{hizmet.categories && hizmet.categories.length > 0 && (
												<Link 
													href={`/hizmetler?category=${encodeURIComponent(hizmet.categories[0])}`} 
													className="position-relative z-1 d-inline-flex rounded-pill px-3 py-2 mt-3"
													style={{ backgroundColor: '#f5f5f5', color: '#333333' }}
												>
													<span className="tag-spacing fs-7 fw-bold text-uppercase">{hizmet.categories[0]}</span>
												</Link>
											)}
											<h6 className="my-3 text-gray-800">{hizmet.title}</h6>
											<p className="text-gray-700">{truncateText(hizmet.description)}</p>
										</div>
										<Link href={`/${slugify(hizmet.title)}`} className="position-absolute bottom-0 start-0 end-0 top-0 z-0" aria-label={hizmet.title} />
									</div>
								</div>
							);
						})}
					</div>
				</div>

			</section>

			{/* Bottom Message Section */}
			<section className="py-5" style={{ backgroundColor: "#fff" }}>
				<div className="container">
					<div className="row">
						<div className="col-12 text-center">
							<div className="mx-auto" style={{ maxWidth: "600px" }}>
								<h4 className="fw-bold mb-4" style={{ color: "#111827", lineHeight: "1.6" }}>
									Biz Sadece Hizmet Sunmuyoruz.
								</h4>
								<div style={{ color: "#6E6E6E", lineHeight: "1.8", fontSize: "1.1rem" }}>
									<p className="mb-3">Bazıları bir danışanla,</p>
									<p className="mb-3">Bazıları bir kelimeyle,</p>
									<p className="mb-4">Bazıları bir mühürle buluşur.</p>
									
									<div className="mt-4">
										<h5 className="fw-bold mb-3" style={{ color: "#111827" }}>
											NİLATED
										</h5>
										<p className="mb-2"><strong>Kalpten Gelen Bilgi.</strong></p>
										<p className="mb-2"><strong>Yaraya Saygılı Dil.</strong></p>
										<p className="mb-0"><strong>Ve Her Satırda Bir Tanıklık.</strong></p>
									</div>
								</div>
							</div>
						</div>
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
				.dropdown {
					position: relative;
				}
				.dropdown-toggle {
					user-select: none;
					-webkit-tap-highlight-color: transparent;
				}
				.dropdown-toggle:focus {
					outline: none !important;
					box-shadow: none !important;
				}
				.dropdown-menu {
					display: block !important;
					animation: fadeIn 0.2s ease-in-out;
				}
				.dropdown-item {
					transition: background-color 0.2s ease;
				}
				.dropdown-item:hover {
					background-color: #f8f9fa !important;
				}
				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: translateX(-50%) translateY(-10px);
					}
					to {
						opacity: 1;
						transform: translateX(-50%) translateY(0);
					}
				}
			`}</style>
		</>
	)
}
