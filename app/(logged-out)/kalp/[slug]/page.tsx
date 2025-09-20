'use client'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllKalpler, getSingleKalp } from '@/redux/actions/kalpActions';
import { AppDispatch, RootState } from '@/redux/store';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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

				{/* Main Image */}
				<div className="mb-6">
					<div className="relative overflow-hidden rounded-xl shadow-sm">
						<img 
							src={kalp.image} 
							alt={kalp.title}
							className="w-full h-48 md:h-56 object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
					</div>
				</div>

				{/* Title and Description */}
				<div className="text-center">
					<h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
						{kalp.title}
					</h1>
					<p className="text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
						{kalp.description}
					</p>
				</div>


				{/* Content Sections */}
				{kalp.content && (
					<div className="space-y-6">
						{/* Banner Section */}
						{kalp.content.bannerSectionTitle && kalp.content.bannerSectionTitle.trim() && (
							<div className="text-black rounded-lg pb-4">
								<div className="flex  mb-3">
									<div className="w-8 h-8 bg-white/20 rounded-full flex ">
										<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
										</svg>
									</div>
								</div>
								<h3 className="text-lg font-semibold mb-3">{kalp.content.bannerSectionTitle}</h3>
								{kalp.content.bannerSectionDescription && kalp.content.bannerSectionDescription.trim() && (
									<p className="text-sm opacity-90 ">
										{kalp.content.bannerSectionDescription}
									</p>
								)}
							</div>
						)}

						{/* Additional Sections */}
						{kalp.content.additionalSections && kalp.content.additionalSections.length > 0 && (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
								{[...kalp.content.additionalSections]
									.filter((section: any) => section.title && section.title.trim())
									.sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
									.map((section: any, index: number) => (
									<div key={index} className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
										{section.image && (
											<div className="relative h-40 overflow-hidden">
												<img 
													src={section.image} 
													alt={section.title || `Section ${index + 1}`}
													className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
												/>
												<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
												<div className="absolute top-4 right-4">
													<div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
														<svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
														</svg>
													</div>
												</div>
											</div>
										)}
										<div className="p-6">
											{section.title && (
												<h4 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors duration-200">{section.title}</h4>
											)}
											{section.description && section.description.trim() && (
												<p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
													{section.description}
												</p>
											)}
										</div>
									</div>
								))}
							</div>
						)}
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
