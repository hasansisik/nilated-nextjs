"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { server } from "@/config";

interface TeamMember {
  image: string;
  link?: string;
}

export default function Team1({ previewData }: { previewData?: any }) {
  const [teamData, setTeamData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Fetch team data from server if not provided as props
  useEffect(() => {
    const fetchTeamData = async () => {
      if (previewData) {
        setTeamData(previewData);
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(`${server}/other`);
        setTeamData(data.other);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching team data:", error);
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [previewData]);

  const openImagePreview = (image: string) => {
    setPreviewImage(image);
  };

  const closeImagePreview = () => {
    setPreviewImage(null);
  };

  if (loading) {
    return <div className="py-5 text-center">Yükleniyor...am information...</div>;
  }

  // Get team1 data with fallback to default values if not provided
  const data = teamData?.team1 || {};
  
  // Destructure properties with fallbacks
  const {
    badge = "OUR TEAM MEMBERS",
    badgeVisible = true,
    badgeBackgroundColor = "#f1f0fe",
    badgeTextColor = "#6342EC",
    title = "Meet Our Team",
    titleColor = "#111827",
    description = "Meet the talented and passionate team members who drive our company forward every day. <br class=\"d-none d-lg-block\" /> company forward every day.",
    descriptionColor = "#6E6E6E",
    backgroundColor = "#ffffff",
    bgLine = "/assets/imgs/team-1/bg-line.png",
    showBgLine = true,
    teamMembers = [
      { 
        image: "/assets/imgs/team-1/avatar-1.png",
        link: "#"
      },
    ],
    showRotatingElements = true
  } = data;

  // Create styles for dynamic theming
  const sectionStyle = {
    backgroundColor: backgroundColor,
  };

  const badgeStyle = {
    backgroundColor: badgeBackgroundColor,
  };

  const badgeTextStyle = {
    color: badgeTextColor,
  };

  const titleStyle = {
    color: titleColor,
  };

  const descriptionStyle = {
    color: descriptionColor,
  };
  
  return (
    <>
      <section className="section-team-1 py-5 position-relative overflow-hidden" style={sectionStyle}>
        <div className="container">
          <div className="row position-relative z-1">
            <div className="text-center">
              {badgeVisible && (
                <div
                  className="d-flex align-items-center justify-content-center border border-2 border-white d-inline-flex rounded-pill px-4 py-2"
                  data-aos="zoom-in"
                  data-aos-delay={100}
                  style={badgeStyle}
                >
                  <span 
                    className="tag-spacing fs-7 fw-bold text-linear-2 ms-2 text-uppercase"
                    style={badgeTextStyle}
                  >
                    {badge}
                  </span>
                </div>
              )}
              <h3
                className="ds-3 my-3"
                data-aos="fade-zoom-in"
                data-aos-delay={200}
                style={titleStyle}
                dangerouslySetInnerHTML={{ __html: title }}
              />
              <p 
                className="fs-5" 
                data-aos="fade-zoom-in" 
                data-aos-delay={300}
                style={descriptionStyle}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
          </div>
          <div className="row mt-6">
            {/* Map through team members */}
            {teamMembers.map((member: TeamMember, index: number) => (
              <div
                key={index}
                className="col-lg-3 col-md-6 mb-lg-4 mb-7 text-center"
                data-aos="fade-zoom-in"
                data-aos-delay={100 + (index % 4) * 100}
              >
                <div className="position-relative d-inline-block z-1">
                  {member.link ? (
                    <Link href={member.link || "#"}>
                      <div className="zoom-img rounded-3">
                        <img
                          className="img-fluid w-100"
                          src={member.image}
                          alt={`Team Member ${index + 1}`}
                          style={{ borderRadius: '8px' }}
                        />
                      </div>
                    </Link>
                  ) : (
                    <div 
                      className="zoom-img rounded-3 cursor-pointer" 
                      onClick={() => openImagePreview(member.image)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        className="img-fluid w-100"
                        src={member.image}
                        alt={`Team Member ${index + 1}`}
                        style={{ borderRadius: '8px' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {showBgLine && (
          <div className="position-absolute top-0 start-50 translate-middle-x z-0">
            <img src={bgLine} alt="background line" />
          </div>
        )}
        {showRotatingElements && (
          <>
            <div className="rotate-center ellipse-rotate-success position-absolute z-0" />
            <div className="rotate-center-rev ellipse-rotate-primary position-absolute z-0" />
          </>
        )}
      </section>

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
            zIndex: 9999 
          }}
          onClick={closeImagePreview}
        >
          <div className="position-relative" style={{ maxWidth: '90%', maxHeight: '90%' }}>
            <img 
              src={previewImage} 
              alt="Preview" 
              className="img-fluid" 
              style={{ 
                maxHeight: '90vh', 
                objectFit: 'contain',
                transform: 'scale(1.5)',
                borderRadius: '12px'
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
