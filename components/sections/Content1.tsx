"use client"
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { AppDispatch } from '@/redux/store';
import { getOther } from '@/redux/actions/otherActions';

interface Content1Props {
  previewData?: any;
}

export default function Content1({ previewData }: Content1Props = {}) {
  const [data, setData] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { other, loading } = useSelector((state: RootState) => state.other);

  useEffect(() => {
    // Fetch other data if not provided in preview
    if (!previewData) {
      dispatch(getOther());
    }
  }, [dispatch, previewData]);
    
  useEffect(() => {
    // If preview data is provided, use it
    if (previewData && previewData.content1) {
      setData(previewData.content1);
    } 
    // Otherwise use Redux data
    else if (other && other.content1) {
      setData(other.content1);
    }
  }, [previewData, other]);

  if (!data || loading) {
    return <section>Content Yükleniyor...</section>;
  }

  const sectionStyle = {
    backgroundColor: data.backgroundColor || "#ffffff",
  };

  const titleStyle = {
    color: data.titleColor || "#111827",
  };

  return (
    <>
      <section className="section-content-1 py-5 position-relative" style={sectionStyle}>
        <div className="container position-relative z-1">
          <div className="row">
            <div className="col-lg-12">
              <div className="text-start">
                <h4 
                  className="mb-4" 
                  style={titleStyle}
                >
                  {data.title}
                </h4>
                <div 
                  className="content-html"
                  style={{
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    color: '#333'
                  }}
                  dangerouslySetInnerHTML={{ __html: data.content || "" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>


    </>
  );
} 