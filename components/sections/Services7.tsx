'use client'
import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { getAllKalpler } from '@/redux/actions/kalpActions';
import { getOther } from '@/redux/actions/otherActions';
import { AppDispatch, RootState } from '@/redux/store';
import { Loader2 } from 'lucide-react';

interface Services7Props {
	previewData?: any;
	kalpler?: any[];
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

export default function Services7({ previewData }: Services7Props) {
	const [data, setData] = useState<any>(null);
	const dispatch = useDispatch<AppDispatch>();
	const { kalpler, loading: kalpLoading, error } = useSelector((state: RootState) => state.kalp);
	const { other, loading: otherLoading } = useSelector((state: RootState) => state.other);

	useEffect(() => {
		// Fetch kalpler if not provided
		dispatch(getAllKalpler());
		
		// Also fetch other data if not provided in preview
		if (!previewData) {
			dispatch(getOther());
		}
	}, [dispatch, previewData]);

	useEffect(() => {
		// If preview data is provided, use it
		if (previewData && previewData.Services7) {
			setData(previewData.Services7);
		} 
		// Otherwise use Redux data
		else if (other && other.Services7) {
			setData(other.Services7);
		}
	}, [previewData, other]);

	// Set default data if no data is available
	useEffect(() => {
		if (!data && !kalpLoading && !otherLoading) {
			setData({
				subtitle: "Kalp",
				title: "Kalpten Gelen Bilgi",
				description: "Yaraya saygılı dil ve her satırda bir tanıklık ile kalpten gelen bilgiyi paylaşıyoruz.",
				buttonText: "Daha Fazla Bilgi",
				buttonLink: "#",
				linkText: "Tüm Kalpleri Gör",
				linkUrl: "/kalp",
				subtitleVisible: true,
				buttonVisible: true,
				linkVisible: true,
				backgroundColor: "#ffffff",
				titleColor: "#333333",
				subtitleBackgroundColor: "rgba(99, 66, 236, 0.1)",
				subtitleTextColor: "#6342EC",
				descriptionColor: "#6E6E6E",
				buttonColor: "#6342EC",
				buttonTextColor: "#FFFFFF"
			});
		}
	}, [data, kalpLoading, otherLoading]);


	if (kalpLoading || otherLoading || !data) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<div className="text-center">
					<p className="text-red-500 mb-4">Hata: {error}</p>
					<button 
						onClick={() => window.location.reload()} 
						className="btn btn-primary"
					>
						Sayfayı Yenile
					</button>
				</div>
			</div>
		);
	}

	// Create styles for customizable elements
	const sectionStyle = {
		backgroundColor: data?.backgroundColor || "#ffffff"
	};

	const titleStyle = {
		color: data?.titleColor || "#333333"
	};

	const subtitleStyle = {
		backgroundColor: data?.subtitleVisible !== false ? (data?.subtitleBackgroundColor || "rgba(99, 66, 236, 0.1)") : "transparent",
		color: data?.subtitleTextColor || "#6342EC"
	};

	const descriptionStyle = {
		color: data?.descriptionColor || "#6E6E6E"
	};

	const buttonStyle = {
		backgroundColor: data?.buttonColor || "#6342EC",
		color: data?.buttonTextColor || "#FFFFFF"
	};



	return (
		<>
			{/* Services 5 */}
			<section className="section-team-1 position-relative fix py-5" style={sectionStyle}>
				<div className="container position-relative z-2">
					<div className="text-center">
						{data?.subtitleVisible !== false && (
							<div className="d-flex align-items-center justify-content-center border border-2 border-white d-inline-flex rounded-pill px-4 py-2" data-aos="zoom-in" data-aos-delay={100} style={subtitleStyle}>
								<span className="tag-spacing fs-7 fw-bold ms-2 text-uppercase">{data?.subtitle}</span>
							</div>
						)}
						<h3 className="ds-5 my-3" style={titleStyle}>{data?.title}</h3>
						<p className="fs-5" style={descriptionStyle}>
							{data?.description}
						</p>
					</div>
					<div className="text-center mt-6">
						
					</div>
					{data?.buttonVisible !== false && (
						<div className="text-center mt-4">
							<Link href={data?.buttonLink || "#"} className="btn btn-primary" style={buttonStyle}>
								{data?.buttonText}
							</Link>
						</div>
					)}
					{data?.linkVisible !== false && (
						<div className="text-center mt-2">
							<Link href={data?.linkUrl || "#"} className="text-decoration-underline">
								{data?.linkText}
							</Link>
						</div>
					)}
				</div>
				<div className="container mt-6">
					<div className="row">
						{kalpler && kalpler.length > 0 ? (
							kalpler.map((kalp, index) => {
								return (
									<div 
										key={kalp._id || kalp.id} 
										className="col-12 col-md-4 mb-4"
									>
										<div className="card border-0 rounded-3 mt-8 position-relative w-100 bg-gray-50" data-aos="fade-zoom-in" data-aos-delay={(index + 1) * 100}>
											<div className="blog-image-container" style={{ height: '220px', width: '100%', overflow: 'hidden', position: 'relative' }}>
												<img 
													className="rounded-top-3" 
													src={kalp.image} 
													alt={kalp.title || "Kalp image"} 
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
												<h6 className="my-3 text-gray-800">{kalp.title}</h6>
												<p className="text-gray-700">{truncateText(kalp.description)}</p>
											</div>
											<Link href={`/kalp/${slugify(kalp.title)}`} className="position-absolute bottom-0 start-0 end-0 top-0 z-0" aria-label={kalp.title} />
										</div>
									</div>
								);
							})
						) : (
							<div className="col-12 text-center py-5">
								<div className="text-muted">
									<h5>Henüz kalp içeriği bulunmuyor</h5>
									<p>Yakında kalpten gelen bilgiler burada görünecek.</p>
								</div>
							</div>
						)}
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
			`}</style>
		</>
	)
}
