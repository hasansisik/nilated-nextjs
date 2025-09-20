'use client'
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { getCta } from "@/redux/actions/ctaActions"
import { AppDispatch } from "@/redux/store"

interface Cta9Props {
	previewData?: any;
}

export default function Cta9({ previewData }: Cta9Props = {}) {
	const [data, setData] = useState<any>(null)
	const dispatch = useDispatch<AppDispatch>()
	const { cta, loading } = useSelector((state: RootState) => state.cta)

	useEffect(() => {
		// Always trigger getCta() on component mount
		dispatch(getCta())
	}, [dispatch])

	useEffect(() => {
		// If preview data is provided, use it
		if (previewData && previewData.cta9) {
			setData(previewData.cta9)
		} 
		// Otherwise use Redux data
		else if (cta && cta.cta9) {
			setData(cta.cta9)
		}
	}, [previewData, cta])

	// If data is still loading, show a loading indicator
	if (!data) {
		return (
			<section className="py-5">
				<div className="container text-center">
					<div className="spinner-border" role="status">
						<span className="visually-hidden">Yükleniyor...</span>
					</div>
				</div>
			</section>
		)
	}

	return (
		<>
			<section className="section-testimonial-9 position-relative py-110">
				<div className="container">
					<div className="row">
						<div className="col-lg-6 col-md-12 mb-lg-0 mb-8 position-relative">
							<div className="d-flex flex-column align-items-start position-relative">
								<div className="d-flex align-items-center position-relative z-2 bg-linear-2 d-inline-flex rounded-pill px-2 py-1 mb-3">
									<span className="bg-primary fs-9 fw-bold rounded-pill px-2 py-1 text-white">
										{data?.badge?.prefix || ""}
									</span>
									<span className="fs-9 fw-bold text-primary mx-2">
										{data?.badge?.text || ""}
									</span>
								</div>
								<h3 className="mb-5" dangerouslySetInnerHTML={{ __html: data?.title || "Feedback from <span class='text-primary'>our users</span>" }}></h3>
								<p className="mb-8">{data?.description || ""}</p>
								<Link href={data?.button?.link || "#"} className="btn btn-gradient">
									{data?.button?.text || ""}
								</Link>
							</div>
						</div>
						<div className="col-lg-6 col-md-12 testimonial-card-right">
							<div className="testimonial-card-wrapper d-flex flex-wrap justify-content-center justify-content-md-end position-relative z-2">
								{data.reviews && data.reviews.map((item: any, index: number) => (
									<div 
										key={index} 
										className={`testimonial-card rounded-4 backdrop-filter ${index === 1 ? 'ms-0 ms-md-8 mt-0 mt-md-8' : ''}`}
									>
										<div className="testimonial-card-body">
											<div className="d-flex align-items-center mb-5">
												<img className="icon-shape icon-md rounded-circle" src={item.avatar} alt="infinia" />
												<div className="ms-3">
													<h6 className="mb-0">{item.name}</h6>
													<p className="mb-0 text-600 fs-7">{item.role}</p>
												</div>
											</div>
											<div className="mb-4">
												<p className="text-dark fs-6">{item.comment}</p>
											</div>
											<div className="d-flex align-items-center">
												<svg xmlns="http://www.w3.org/2000/svg" width={76} height={12} viewBox="0 0 76 12" fill="none">
													<path d="M5.41071 0L7.13914 3.20469L10.8214 3.90446L8.28495 6.55937L8.86756 10.0954L5.41071 8.55L1.95386 10.0954L2.53647 6.55937L0 3.90446L3.68229 3.20469L5.41071 0Z" fill="#FFAD0F" />
													<path d="M21.4107 0L23.1391 3.20469L26.8214 3.90446L24.285 6.55937L24.8676 10.0954L21.4107 8.55L17.9539 10.0954L18.5365 6.55937L16 3.90446L19.6823 3.20469L21.4107 0Z" fill="#FFAD0F" />
													<path d="M37.4107 0L39.1391 3.20469L42.8214 3.90446L40.285 6.55937L40.8676 10.0954L37.4107 8.55L33.9539 10.0954L34.5365 6.55937L32 3.90446L35.6823 3.20469L37.4107 0Z" fill="#FFAD0F" />
													<path d="M53.4107 0L55.1391 3.20469L58.8214 3.90446L56.285 6.55937L56.8676 10.0954L53.4107 8.55L49.9539 10.0954L50.5365 6.55937L48 3.90446L51.6823 3.20469L53.4107 0Z" fill="#FFAD0F" />
													<path d="M69.4107 0L71.1391 3.20469L74.8214 3.90446L72.285 6.55937L72.8676 10.0954L69.4107 8.55L65.9539 10.0954L66.5365 6.55937L64 3.90446L67.6823 3.20469L69.4107 0Z" fill="#FFAD0F" />
												</svg>
												<span className="text-primary ms-2 fw-medium">{item.rating}</span>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
				<div className="ellipse-rotate-primary-2 position-absolute z-0" />
				<div className="ellipse-rotate-success-2 position-absolute z-0" />
			</section>
		</>
	)
}
