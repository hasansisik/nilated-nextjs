import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getHero } from '@/redux/actions/heroActions';
import Hero1 from '@/components/sections/Hero1';
import Hero3 from '@/components/sections/Hero3';

interface HeroSectionProps {
  // Optional props to override Redux data
  previewData?: any;
}

export default function HeroSection({ previewData }: HeroSectionProps) {
  const dispatch = useDispatch();
  const { hero, loading } = useSelector((state: RootState) => state.hero);
  const [data, setData] = useState<any>(null);

  // Fetch hero data if not provided
  useEffect(() => {
    if (!previewData) {
      dispatch(getHero() as any);
    }
  }, [dispatch, previewData]);

  // Update local state when hero data changes
  useEffect(() => {
    if (previewData) {
      setData(previewData);
    } else if (hero) {
      setData(hero);
    }
  }, [hero, previewData]);

  if (loading || !data) {
    return <div className="py-5 text-center">Yükleniyor...ro section...</div>;
  }

  // Render the selected hero component
  const activeHero = data.activeHero || 'hero1';

  if (activeHero === 'hero1') {
    return <Hero1 previewData={data} />;
  } else if (activeHero === 'hero3') {
    return <Hero3 previewData={data} />;
  }

  // Fallback
  return <div className="py-5 text-center">Hero section not available</div>;
} 