'use client'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllKalpler } from '@/redux/actions/kalpActions';
import { AppDispatch, RootState } from '@/redux/store';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import RichTextEditor from '@/components/RichTextEditor';

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

// Function to convert slug back to title
const unslugify = (slug: string) => {
	return slug
		.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};

export default function KalpSectionDetailPage() {
	const [kalp, setKalp] = useState<any>(null);
	const [section, setSection] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [content, setContent] = useState<string>("");
	const [detailContent, setDetailContent] = useState<string>("");
	const dispatch = useDispatch<AppDispatch>();
	const { kalpler } = useSelector((state: RootState) => state.kalp);
	const params = useParams();
	const router = useRouter();
	
	const slug = params?.slug as string;
	const sectionSlug = params?.sectionSlug as string;

	useEffect(() => {
		// First try to find kalp from existing kalpler
		if (kalpler && kalpler.length > 0) {
			const foundKalp = kalpler.find(k => slugify(k.title) === slug);
			if (foundKalp) {
				setKalp(foundKalp);
				// Find the section
				const foundSection = foundKalp.content?.additionalSections?.find((s: any) => 
					slugify(s.title || '') === sectionSlug
				);
					if (foundSection) {
						setSection(foundSection);
						setContent(foundSection.description || "");
						setDetailContent(foundSection.detailContent || "");
					}
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
					// Find the section
					const foundSection = foundKalp.content?.additionalSections?.find((s: any) => 
						slugify(s.title || '') === sectionSlug
					);
					if (foundSection) {
						setSection(foundSection);
						setContent(foundSection.description || "");
						setDetailContent(foundSection.detailContent || "");
					}
				}
			}
			setLoading(false);
		}).catch((error) => {
			console.error('Error fetching kalpler:', error);
			setLoading(false);
		});
	}, [dispatch, slug, sectionSlug, kalpler]);

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (!kalp || !section) {
		return (
			<div className="container py-5">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">Section Bulunamadı</h1>
					<p className="text-gray-600 mb-4">Aradığınız section bulunamadı.</p>
					<Link href={`/kalp/${slug}`} className="btn btn-primary">
						Kalpe Geri Dön
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white">
			<div className="container mx-auto px-4 py-8 max-w-4xl">
				{/* Breadcrumb */}
				<nav className="mb-4">
					<div className="flex items-center space-x-2 text-sm text-gray-500">
						<Link href="/" className="hover:text-gray-700 transition-colors">Ana Sayfa</Link>
						<span>/</span>
						<Link href="/kalp" className="hover:text-gray-700 transition-colors">Kalp</Link>
						<span>/</span>
						<Link href={`/kalp/${slug}`} className="hover:text-gray-700 transition-colors">{kalp.title}</Link>
						<span>/</span>
						<span className="text-gray-900 font-medium">{section.title}</span>
					</div>
				</nav>

				{/* Header */}
				<div className="mb-4">
					<div className="flex items-center gap-4 mb-6">
						<div>
							<h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2">
								{section.title}
							</h1>
							<p className="text-lg text-gray-600">{kalp.title}</p>
						</div>
					</div>

					{/* Section Image */}
					{section.image && (
						<div className="relative h-84 md:h-100 rounded-2xl overflow-hidden mb-8">
							<img 
								src={section.image} 
								alt={section.title || 'Section image'}
								className="w-full h-full object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
						</div>
					)}
				</div>

				{/* Section Description */}
				<div className="bg-white rounded-2xl ">
					<div 
						className="prose prose-lg max-w-none"
						dangerouslySetInnerHTML={{ __html: content }}
					/>
				</div>

				{/* Detail Content */}
				{detailContent && (
					<div className="bg-white">
						<div 
							className="prose prose-lg max-w-none"
							dangerouslySetInnerHTML={{ __html: detailContent }}
						/>
					</div>
				)}

				
				{/* Back Button */}
				<div className="mt-8 text-center">
					<Link 
						href={`/kalp/${slug}`} 
						className="inline-flex items-center px-6 py-3 bg-gray-800 text-black rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:bg-gray-900"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						<span className="text-sm font-medium">Kalpe Geri Dön</span>
					</Link>
				</div>
			</div>
		</div>
	);
}
