'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "@/redux/actions/userActions";
import { AppDispatch } from "@/redux/store";

export default function PageLogin() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const redirect = searchParams.get('redirect') || '/dashboard';
	const dispatch = useDispatch<AppDispatch>();
	const [formData, setFormData] = useState({
		email: '',
		password: ''
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		setError(null);
		
		try {
			const resultAction = await dispatch(login(formData));
			if (login.fulfilled.match(resultAction)) {
				router.push(redirect);
			} else if (login.rejected.match(resultAction)) {
				console.error("Login failed:", resultAction.payload);
				setError(resultAction.payload as string);
			}
		} catch (error) {
			console.error("Login error:", error);
			setError("An unexpected error occurred");
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			{/* Section Login */}
			<section className="position-relative border-bottom">
				<div className="container">
					<div className="row pt-7 pb-120">
						<div className="col-lg-5 ms-auto ps-lg-10 text-center">
							<h3>Login to WordPress Clone</h3>
							<p className="text-500">Log in to access your dashboard</p>
							
							<div className="border-top mt-3 mb-2 position-relative">
								<p className="text-500 position-absolute top-50 start-50 translate-middle bg-white px-2">Enter your credentials</p>
							</div>

							{error && (
								<div className="alert alert-danger" role="alert">
									{error}
								</div>
							)}

							<form onSubmit={handleSubmit} id="loginForm">
								<div className="col text-start">
									<label htmlFor="email" className="form-label mt-2 text-900">Email *</label>
									<div className="input-group d-flex align-items-center">
										<div className="icon-input border border-end-0 rounded-3 rounded-end-0 ps-3">
											<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
												<path className="stroke-dark" d="M12 11.25C13.7949 11.25 15.25 9.79493 15.25 8C15.25 6.20507 13.7949 4.75 12 4.75C10.2051 4.75 8.75 6.20507 8.75 8C8.75 9.79493 10.2051 11.25 12 11.25Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												<path className="stroke-dark" d="M6.84723 19.25H17.1522C18.2941 19.25 19.1737 18.2681 18.6405 17.2584C17.856 15.7731 16.0677 14 11.9997 14C7.93174 14 6.1434 15.7731 5.35897 17.2584C4.8257 18.2681 5.70531 19.25 6.84723 19.25Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</div>
										<input 
											type="email" 
											className="form-control ms-0 border rounded-3 rounded-start-0 border-start-0" 
											name="email" 
											placeholder="Enter your email" 
											id="email" 
											aria-label="email" 
											required 
											value={formData.email}
											onChange={handleChange}
										/>
									</div>
								</div>
								<div className="col text-start">
									<label htmlFor="password" className="form-label mt-2 text-900">Password *</label>
									<div className="input-group d-flex align-items-center">
										<div className="icon-input border border-end-0 rounded-3 rounded-end-0 ps-3">
											<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
												<path className="stroke-dark" d="M4.75 5.75C4.75 5.19772 5.19772 4.75 5.75 4.75H9.25C9.80228 4.75 10.25 5.19772 10.25 5.75V9.25C10.25 9.80228 9.80228 10.25 9.25 10.25H5.75C5.19772 10.25 4.75 9.80228 4.75 9.25V5.75Z" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												<path className="stroke-dark" d="M4.75 14.75C4.75 14.1977 5.19772 13.75 5.75 13.75H9.25C9.80228 13.75 10.25 14.1977 10.25 14.75V18.25C10.25 18.8023 9.80228 19.25 9.25 19.25H5.75C5.19772 19.25 4.75 18.8023 4.75 18.25V14.75Z" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												<path className="stroke-dark" d="M13.75 5.75C13.75 5.19772 14.1977 4.75 14.75 4.75H18.25C18.8023 4.75 19.25 5.19772 19.25 5.75V9.25C19.25 9.80228 18.8023 10.25 18.25 10.25H14.75C14.1977 10.25 13.75 9.80228 13.75 9.25V5.75Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												<path className="stroke-dark" d="M13.75 14.75C13.75 14.1977 14.1977 13.75 14.75 13.75H18.25C18.8023 13.75 19.25 14.1977 19.25 14.75V18.25C19.25 18.8023 18.8023 19.25 18.25 19.25H14.75C14.1977 19.25 13.75 18.8023 13.75 18.25V14.75Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</div>
										<input 
											type="password" 
											className="form-control ms-0 border rounded-3 rounded-start-0 border-start-0" 
											name="password" 
											placeholder="Enter your password" 
											id="password" 
											aria-label="password" 
											required 
											value={formData.password}
											onChange={handleChange}
										/>
									</div>
								</div>
								<div className="col-12 mt-2 d-flex justify-content-end">
									<div className="form-check text-start">
										<input className="form-check-input" type="checkbox" id="remember" name="remember" />
										<label className="form-check-label text-500 fs-7" htmlFor="remember"> Remember me </label>
									</div>
								</div>
								<div className="col-12 mt-5">
									<button 
										type="submit" 
										className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
										disabled={loading}
									>
										{loading ? 'Logging in...' : 'Login'}
										{!loading && (
											<svg className="ms-2" xmlns="http://www.w3.org/2000/svg" width={25} height={24} viewBox="0 0 25 24" fill="none">
												<g clipPath="url(#clip0_741_28206)">
													<path d="M21.6059 12.256H1V11.744H21.6059H22.813L21.9594 10.8905L17.5558 6.4868L17.9177 6.12484L23.7929 12L17.9177 17.8751L17.5558 17.5132L21.9594 13.1095L22.813 12.256H21.6059Z" stroke="white" />
												</g>
												<defs>
													<clipPath>
														<rect width={24} height={24} fill="white" transform="translate(0.5)" />
													</clipPath>
												</defs>
											</svg>
										)}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
				<div className="position-lg-absolute start-0 bottom-0 top-0">
					<img className="h-100 w-100 object-fit-cover" src="/assets/imgs/other/img-8.png" alt="wordpress clone" />
				</div>
			</section>
		</>
	)
}