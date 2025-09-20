"use client"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

export default function Contact1() {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSubmitted, setIsSubmitted] = useState(false)

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);
		
		try {
			const formData = new FormData(e.currentTarget);
			const formValues = {
				name: formData.get('name') as string,
				email: formData.get('email') as string,
				phone: formData.get('phone') as string || '',
				subject: formData.get('subject') as string,
				message: formData.get('message') as string
			};

			// Send the form data to our API
			const response = await fetch('/api/contact-form', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formValues),
			});
			
			const responseData = await response.json();
			
			if (!response.ok) {
				throw new Error(responseData.error || 'Form gönderilemedi');
			}
			
			toast.success('Mesajınız başarıyla gönderildi!');
			// Reset the form
			e.currentTarget.reset();
			setIsSubmitted(true);
		} catch (error: any) {
			console.error('Form gönderiminde hata:', error);
			toast.error(error.message || 'Form gönderilemedi. Lütfen tekrar deneyin.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<style jsx global>{`
				/* Contact section specific styles */
				.section-contact-3 {
					width: 100%;
					margin: 0;
					padding: 80px 0;
					box-sizing: border-box;
					position: relative;
					overflow: hidden;
				}
				
				.section-contact-3 .container {
					width: 100%;
					max-width: 1140px;
					margin: 0 auto;
					padding: 0 15px;
				}
				
				.section-contact-3 .row {
					display: flex;
					flex-wrap: wrap;
					margin: 0 -15px;
					width: 100%;
				}
				
				.section-contact-3 .col-lg-6 {
					width: 100%;
					padding: 0 15px;
				}
				
				@media (min-width: 992px) {
					.section-contact-3 .col-lg-6 {
						flex: 0 0 50%;
						max-width: 50%;
					}
					
					.section-contact-3 .col-lg-10 {
						flex: 0 0 83.333333%;
						max-width: 83.333333%;
					}
				}
				
				.section-contact-3 .mt-8 {
					margin-top: 2rem;
				}
				
				@media (min-width: 768px) {
					.section-contact-3 .mt-8 {
						margin-top: 3rem;
					}
				}
				
				.section-contact-3 form {
					width: 100%;
				}
			`}</style>

			{/* Introduction Section */}
			<section className="py-5" style={{ backgroundColor: "#ffffff" }}>
				<div className="container">
					<div className="text-center">
						<div className="d-flex align-items-center justify-content-center border border-2 border-white d-inline-flex rounded-pill px-4 py-2" style={{ backgroundColor: "#f1f0fe" }}>
							<span className="tag-spacing fs-7 fw-bold ms-2 text-uppercase" style={{ color: "#6342EC" }}>İLETİŞİM</span>
						</div>
						<h3 className="ds-3 mt-3 mb-3 fw-bold" style={{ color: "#111827" }}>Bir Adım Yeter...</h3>
						<div className="fs-5 mx-auto" style={{ color: "#6E6E6E", maxWidth: "800px", lineHeight: "1.8" }}>
							<p className="mb-3">Bazen hayat, bir e-posta kadar yakın...</p>
							<p className="mb-3">Bazen bir soru, bir yönlendirme, bir niyet bile yeterli olur.</p>
							<p className="mb-3"><strong>NİLATED</strong> ile temas kurmak, yalnızca bilgi almak değil,</p>
							<p className="mb-0">bir dili, bir duyarlılığı ve bir yaklaşımı hissetmeye davettir.</p>
						</div>
					</div>
				</div>
			</section>

			{/* Contact Information Section */}
			<section className="py-5" style={{ backgroundColor: "#ffffff" }}>
				<div className="container">
					<div className="row d-flex align-items-stretch">
						<div className="col-lg-4 mb-4">
							<div className="h-100 p-4 bg-white rounded-4 shadow-sm border d-flex flex-column">
								<h5 className="fw-bold mb-4" style={{ color: "#111827" }}>🔹 İletişim Bilgileri</h5>
								
								<div className="mb-4">
									<h6 className="fw-bold mb-2">📍 Ofis Adresi:</h6>
									<p className="text-muted mb-1">NİLATED Ana Ofis</p>
									<p className="text-muted">Meşrutiyet Mah. Meşrutiyet Cad. Servet Apt. No:5 Kat:4 Daire:7 Kızılay/ANKARA</p>
								</div>

								<div className="mb-4">
									<h6 className="fw-bold mb-2">📞 Telefon:</h6>
									<p className="text-muted">+90 541 716 81 17</p>
								</div>

								<div className="mb-4">
									<h6 className="fw-bold mb-2">📧 E-Posta:</h6>
									<p className="text-muted mb-1">info@nilated.com</p>
									<p className="text-muted mb-1">egitim@nilated.com</p>
									<p className="text-muted">destek@nilated.com</p>
								</div>

								<div className="mb-4">
									<h6 className="fw-bold mb-2">🌐 Web:</h6>
									<p className="text-muted">www.nilated.com</p>
								</div>

								<div className="flex-grow-1">
									<h6 className="fw-bold mb-2">📱 Sosyal Medya:</h6>
									<p className="text-muted mb-1">Instagram | YouTube | X (eski Twitter)</p>
									<p className="text-muted">→ Hepsi @nilatedresmi hesabında</p>
								</div>
							</div>
						</div>

						<div className="col-lg-8">
							<div className=" p-4 bg-white rounded-4 shadow-sm border d-flex flex-column">
								<h5 className="fw-bold mb-4" style={{ color: "#111827" }}>🔹 Randevu Sistemi</h5>
								
								<div className="mb-4">
									<h6 className="fw-bold mb-2">🎯 Psikiyatrik Görüşmeler</h6>
									<p className="mb-2">Dr. Cemil Çelik yalnızca 15 dakikalık ilaç + terapi görüşmeleri kabul etmektedir.</p>
									<ul className="list-unstyled text-muted">
										<li><strong>Süre:</strong> 15 dakika</li>
										<li><strong>Ücret:</strong> 5500 TL</li>
										<li><strong>Günlük maksimum:</strong> 6 kişi</li>
									</ul>
									<p className="text-muted">Terapi talepleri, kurucu eğitmen tarafından yetiştirilmiş 4 terapiste yönlendirilir.</p>
								</div>

								<div className="mb-4">
									<h6 className="fw-bold mb-2">🎯 Eğitim & Danışmanlık Başvuruları</h6>
									<p className="text-muted">Eğitim satın alımı, kurumsal danışmanlık ve özel içerik üretimi talepleri için satış ekibimizle iletişime geçebilirsiniz.</p>
								</div>

								<div className="flex-grow-1">
									<h6 className="fw-bold mb-2">🎯 İçerik Destek – Yazım & Video Serisi Danışmanlığı</h6>
									<p className="text-muted">İçerik üretimi, metin yazımı veya özel anlatılar için "Yazıcı" birimimizle iletişime geçin.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Contact Form Section */}
			<section className="section-contact-3 position-relative py-5 fix" style={{ backgroundColor: "#ffffff" }}>
				<div className="container position-relative z-1">
					<div className="text-center mb-5">
						<h4 className="fw-bold mb-3" style={{ color: "#111827" }}>🔹 Bizimle Temasa Geçin</h4>
						<p className="fs-5" style={{ color: "#6E6E6E" }}>
							Aşağıdaki form aracılığıyla bize ulaşabilirsiniz.<br />
							Tüm başvurular 1–3 iş günü içerisinde yanıtlanır.
						</p>
					</div>
					<div className="row mt-8">
						<div className="col-lg-10 mx-lg-auto">
							<div className="row">
								<div className="col-lg-8 mx-auto">
									<form onSubmit={handleSubmit} className="px-3 px-lg-0">
										<div className="row mt-5">
											<div className="col-md-6 d-flex justify-content-center justify-content-md-start">
												<div className="input-group d-flex align-items-center" style={{ maxWidth: '100%', width: '100%' }}>
													<div className="icon-input border border-end-0 rounded-2 rounded-end-0 ps-3">
														<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
															<path className="stroke-dark" d="M12 11.25C13.7949 11.25 15.25 9.79493 15.25 8C15.25 6.20507 13.7949 4.75 12 4.75C10.2051 4.75 8.75 6.20507 8.75 8C8.75 9.79493 10.2051 11.25 12 11.25Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
															<path className="stroke-dark" d="M6.84723 19.25H17.1522C18.2941 19.25 19.1737 18.2681 18.6405 17.2584C17.856 15.7731 16.0677 14 11.9997 14C7.93174 14 6.1434 15.7731 5.35897 17.2584C4.8257 18.2681 5.70531 19.25 6.84723 19.25Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
														</svg>
													</div>
													<input type="text" className="form-control ms-0 border rounded-2 rounded-start-0 border-start-0" name="name" placeholder="Adınız *" aria-label="username" required />
												</div>
											</div>
											<div className="col-md-6 d-flex justify-content-center justify-content-md-start">
												<div className="input-group d-flex align-items-center mt-4 mt-md-0" style={{ maxWidth: '100%', width: '100%' }}>
													<div className="icon-input border border-end-0 rounded-2 rounded-end-0 ps-3">
														<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
															<path className="stroke-dark" d="M4.75 7.75C4.75 6.64543 5.64543 5.75 6.75 5.75H17.25C18.3546 5.75 19.25 6.64543 19.25 7.75V16.25C19.25 17.3546 18.3546 18.25 17.25 18.25H6.75C5.64543 18.25 4.75 17.3546 4.75 16.25V7.75Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
															<path className="stroke-dark" d="M5.5 6.5L12 12.25L18.5 6.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
														</svg>
													</div>
													<input type="email" className="form-control ms-0 border rounded-2 rounded-start-0 border-start-0" name="email" placeholder="ornek@email.com" aria-label="email" required />
												</div>
											</div>
											<div className="col-md-6 d-flex justify-content-center justify-content-md-start">
												<div className="input-group d-flex align-items-center mt-4" style={{ maxWidth: '100%', width: '100%' }}>
													<div className="icon-input border border-end-0 rounded-2 rounded-end-0 ps-3">
														<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
															<path className="stroke-dark" d="M8.89286 4.75H6.06818C5.34017 4.75 4.75 5.34017 4.75 6.06818C4.75 13.3483 10.6517 19.25 17.9318 19.25C18.6598 19.25 19.25 18.6598 19.25 17.9318V15.1071L16.1429 13.0357L14.5317 14.6468C14.2519 14.9267 13.8337 15.0137 13.4821 14.8321C12.8858 14.524 11.9181 13.9452 10.9643 13.0357C9.98768 12.1045 9.41548 11.1011 9.12829 10.494C8.96734 10.1537 9.06052 9.76091 9.32669 9.49474L10.9643 7.85714L8.89286 4.75Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
														</svg>
													</div>
													<input type="tel" className="form-control ms-0 border rounded-2 rounded-start-0 border-start-0" name="phone" placeholder="Telefon (isteğe bağlı)" aria-label="phone" />
												</div>
											</div>
											<div className="col-md-6 d-flex justify-content-center justify-content-md-start">
												<div className="input-group d-flex align-items-center mt-4" style={{ maxWidth: '100%', width: '100%' }}>
													<div className="icon-input border border-end-0 rounded-2 rounded-end-0 ps-3">
														<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
															<path className="stroke-dark" d="M6.75 19.25H17.25C18.3546 19.25 19.25 18.3546 19.25 17.25V9.75001L12 4.75L4.75 9.75001V17.25C4.75 18.3546 5.64544 19.25 6.75 19.25Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
															<path className="stroke-dark" d="M9.75 15.749C9.75 14.6444 10.6455 13.749 11.75 13.749H12.25C13.3546 13.749 14.25 14.6444 14.25 15.749V19.249H9.75V15.749Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
														</svg>
													</div>
													<input type="text" className="form-control ms-0 border rounded-2 rounded-start-0 border-start-0" name="subject" placeholder="Konu" aria-label="subject" required />
												</div>
											</div>
											<div className="col-12 d-flex justify-content-center justify-content-md-start">
												<div className="input-group d-flex mt-4" style={{ maxWidth: '100%', width: '100%' }}>
													<div className="icon-input pt-2 ps-3 align-items-start border border-end-0 rounded-1 rounded-end-0">
														<svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 18 18" fill="none">
															<path className="stroke-dark" d="M5.5 2.14844H3C1.89543 2.14844 1 3.04387 1 4.14844V14.6484C1 15.753 1.89543 16.6484 3 16.6484H13.5C14.6046 16.6484 15.5 15.753 15.5 14.6484V12.1484" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
															<path className="stroke-dark" d="M17.3285 1.20344L16.4448 0.319749C16.0185 -0.106583 15.3248 -0.106583 14.8984 0.319749L7.82915 7.38907C7.76373 7.45449 7.71914 7.53782 7.70096 7.62854L7.2591 9.83772C7.22839 9.99137 7.27647 10.1502 7.38729 10.261C7.47605 10.3498 7.59561 10.3983 7.71864 10.3983C7.74923 10.3983 7.77997 10.3953 7.81053 10.3892L10.0197 9.94732C10.1104 9.92917 10.1938 9.88455 10.2592 9.81913L17.3285 2.74984C17.3285 2.74984 17.3286 2.74984 17.3286 2.74981C17.7549 2.32351 17.7549 1.6298 17.3285 1.20344ZM9.69678 9.05607L8.31606 9.33225L8.59224 7.95153L14.3461 2.19754L15.4507 3.30214L9.69678 9.05607ZM16.6658 2.0871L16.1135 2.6394L15.0089 1.53479L15.5612 0.982524C15.6221 0.921601 15.7212 0.92157 15.7821 0.982493L16.6658 1.86618C16.7267 1.92707 16.7267 2.0262 16.6658 2.0871Z" fill="black" />
														</svg>
													</div>
													<textarea className="form-control border border-start-0 ms-0 rounded-start-0 rounded-1 pb-10" name="message" placeholder="Mesajınızı Kısaca Açıklayın" aria-label="With textarea" required></textarea>
												</div>
											</div>
											<div className="col-12 text-center">
												<button 
													type="submit" 
													className="btn text-white hover-up mt-4 d-flex align-items-center justify-content-center mx-auto" 
													style={{ backgroundColor: "#6342EC", maxWidth: '200px' }}
													disabled={isSubmitting || isSubmitted}
												>
													<span>{isSubmitting ? 'Gönderiliyor...' : isSubmitted ? 'Gönderildi' : 'Mesaj Gönder'}</span>
													<svg className="ms-2" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
														<path className="stroke-white" d="M21.1059 12.2562H0.5V11.7443H21.1059H22.313L21.4594 10.8907L17.0558 6.48705L17.4177 6.12508L23.2929 12.0002L17.4177 17.8754L17.0558 17.5134L21.4594 13.1098L22.313 12.2562H21.1059Z" fill="black" stroke="white" />
													</svg>
												</button>
											</div>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="rotate-center ellipse-rotate-success position-absolute z-0" />
				<div className="rotate-center-rev ellipse-rotate-primary position-absolute z-0" />
				<div className="rotate-center-rev ellipse-rotate-info position-absolute z-0" />
			</section>

			{/* Closing Message Section */}
			<section className="py-5" style={{ backgroundColor: "#ffffff" }}>
				<div className="container">
					<div className="text-center">
						<div className="mx-auto" style={{ maxWidth: "600px" }}>
							<h4 className="fw-bold mb-4" style={{ color: "#111827" }}>Ve Unutma…</h4>
							<div style={{ color: "#6E6E6E", lineHeight: "1.8", fontSize: "1.1rem" }}>
								<p className="mb-3">Her mesaj bir çağrıdır.</p>
								<p className="mb-3">Her niyet bir kapı aralar.</p>
								<p className="mb-4">Ve bazen... sadece <strong>"buradayım"</strong> demek bile yeter.</p>
								
								<div className="mt-4">
									<h5 className="fw-bold" style={{ color: "#111827" }}>
										NİLATED – Kalpten Kalbe Bir Yol
									</h5>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
