"use client"

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPage } from "@/redux/actions/pageActions";
import { RootState } from "@/redux/store";
import { AppDispatch } from "@/redux/store";

export default function PrivacyPolicyPage() {
	const dispatch = useDispatch<AppDispatch>();
	const { pages, loading } = useSelector((state: RootState) => state.page);
	const [isLoading, setIsLoading] = useState(true);
	
	useEffect(() => {
		const fetchData = async () => {
			try {
				await dispatch(getPage('privacy'));
				setIsLoading(false);
			} catch (error) {
				console.error('Error fetching privacy policy:', error);
				setIsLoading(false);
			}
		};
		
		fetchData();
	}, [dispatch]);
	
	if (isLoading || loading || !pages.privacy) {
		return;
	}
	
	const { hero, content } = pages.privacy;

	return (
		<div className="container mx-auto px-4 py-16 md:py-24">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl md:text-4xl font-bold mb-4">{hero.title}</h1>
				<p className="text-gray-600 mb-12">{hero.description}</p>
				
				<div className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
			</div>
		</div>
	);
}