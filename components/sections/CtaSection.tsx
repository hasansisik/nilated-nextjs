"use client";

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getCta } from '@/redux/actions/ctaActions';
import { AppDispatch } from '@/redux/store';
import Cta1 from './Cta1';
import Cta4 from './Cta4';
import Cta9 from './Cta9';

interface CtaSectionProps {
  ctaType?: string;
}

export default function CtaSection({ ctaType }: CtaSectionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { cta, loading } = useSelector((state: RootState) => state.cta);

  useEffect(() => {
    dispatch(getCta());
  }, [dispatch]);

  if (loading || !cta) {
    return (
      <section className="py-5">
        <div className="container text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
        </div>
      </section>
    );
  }

  // Use provided ctaType or fall back to activeCta from the data
  const activeCtaType = ctaType || cta.activeCta || 'cta4';

  return (
    <>
      {activeCtaType === 'cta1' ? (
        <Cta1 previewData={cta} />
      ) : activeCtaType === 'cta4' ? (
        <Cta4 previewData={cta} />
      ) : (
        <Cta9 previewData={cta} />
      )}
    </>
  );
} 