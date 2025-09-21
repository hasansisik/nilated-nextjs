'use client'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllKalpler, getSingleKalp } from '@/redux/actions/kalpActions';
import { AppDispatch, RootState } from '@/redux/store';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

// Function to convert title to slug
const slugify = (text: string) => {
	const turkishMap: {[key: string]: string} = {
		'ç': 'c', 'Ç': 'C',
		'ğ': 'g', 'Ğ': 'G',
		'ı': 'i', 'İ': 'I',
		'ö': 'o', 'Ö': 'O',
		'ş': 's', 'Ş': 'S',
		'ü': 'u', 'Ü': 'U'
	};
	
	let result = text.toString();
	for (const [turkishChar, latinChar] of Object.entries(turkishMap)) {
		result = result.replace(new RegExp(turkishChar, 'g'), latinChar);
	}
	
	return result
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^\w\-]+/g, '')
		.replace(/\-\-+/g, '-')
		.replace(/^-+/, '')
		.replace(/-+$/, '');
};

export default function KalpDetailPage() {
	const [kalp, setKalp] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const dispatch = useDispatch<AppDispatch>();
	const { kalpler } = useSelector((state: RootState) => state.kalp);
	const params = useParams();
	const slug = params?.slug as string;
	const router = useRouter();

	// Remove blog loading and filtering logic since we're navigating to blog page

	useEffect(() => {
		// First try to find kalp from existing kalpler
		if (kalpler && kalpler.length > 0) {
			const foundKalp = kalpler.find(k => slugify(k.title) === slug);
			if (foundKalp) {
				setKalp(foundKalp);
				setLoading(false);
				return;
			}
		}

		// If not found, fetch all kalpler
		dispatch(getAllKalpler()).then((result) => {
			if (result.payload) {
				const foundKalp = result.payload.find((k: any) => slugify(k.title) === slug);
				if (foundKalp) {
					setKalp(foundKalp);
				}
			}
			setLoading(false);
		}).catch((error) => {
			console.error('Error fetching kalpler:', error);
			setLoading(false);
		});
	}, [dispatch, slug, kalpler]);

	// Handle category click - navigate to blog category page
	const handleCategoryClick = (category: string) => {
		router.push(`/blog/kategori?category=${encodeURIComponent(category)}`);
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (!kalp) {
		return (
			<div className="container py-5">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">Kalp Bulunamadı</h1>
					<p className="text-gray-600 mb-4">Aradığınız kalp bulunamadı.</p>
					<Link href="/kalp" className="btn btn-primary">
						Kalplere Geri Dön
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white">
			<div className="container mx-auto px-4 py-8 max-w-4xl">
				{/* Breadcrumb */}
				<nav className="mb-8">
					<div className="flex items-center space-x-2 text-sm text-gray-500">
						<Link href="/" className="hover:text-gray-700 transition-colors">Ana Sayfa</Link>
						<span>/</span>
						<Link href="/kalp" className="hover:text-gray-700 transition-colors">Kalp</Link>
						<span>/</span>
						<span className="text-gray-900 font-medium">{kalp.title}</span>
					</div>
				</nav>

				{/* Main Title and Description Section */}
				<div className="mb-6">
					<div className="text-center max-w-3xl mx-auto">
						<h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
							{kalp.title}
						</h1>
						<div 
							className="text-lg text-gray-600 leading-relaxed prose prose-lg max-w-none mx-auto"
							dangerouslySetInnerHTML={{ __html: kalp.description }}
						/>
					</div>
				</div>


				{/* Content Sections */}
				{kalp.content && (
					<div className="space-y-6">
						{/* Additional Sections */}
						{kalp.content.additionalSections && kalp.content.additionalSections.length > 0 && (() => {
							const filteredSections = [...kalp.content.additionalSections]
								.filter((section: any) => section.title && section.title.trim())
								.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
							
							const totalSections = filteredSections.length;
							const isMultipleOf4 = totalSections % 4 === 0;
							const isMultipleOf3 = totalSections % 3 === 0;
							
							// Determine grid layout: 4 if total is 4 or multiple of 4, otherwise 3
							const gridCols = (totalSections === 4 || isMultipleOf4) ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
							
							return (
								<div className={`grid ${gridCols} gap-6`}>
									{filteredSections.map((section: any, index: number) => (
										<div
											key={index}
											onClick={() => section.blogCategory ? handleCategoryClick(section.blogCategory) : null}
											className={`group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 text-left ${
												section.blogCategory 
													? 'cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:ring-2 hover:ring-blue-200' 
													: 'cursor-default'
											}`}
											style={{ cursor: section.blogCategory ? 'pointer' : 'default' }}
										>
											{section.image && (
												<div className="relative h-40 overflow-hidden">
													<img 
														src={section.image} 
														alt={section.title || `Section ${index + 1}`}
														className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
													/>
													<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
												</div>
											)}
											<div className="p-6">
												{section.title && (
													<h4 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors duration-200">{section.title}</h4>
												)}
												{section.description && section.description.trim() && (
													<div 
														className="text-xs text-gray-600 leading-relaxed line-clamp-3 prose prose-xs max-w-none"
														dangerouslySetInnerHTML={{ __html: section.description }}
													/>
												)}
											</div>
										</div>
									))}
								</div>
							);
						})()}
						</div>
					)}

				{/* Back Button */}
				<div className="mt-12 text-center">
					<Link 
						href="/kalp" 
						className="inline-flex items-center px-6 py-3 bg-gray-800 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:bg-gray-900"
					>
						<svg className="w-4 h-4 mr-2 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						<span className="text-sm font-medium text-black">Tüm Kalplere Dön</span>
					</Link>
				</div>
			</div>
		</div>
	);
}
