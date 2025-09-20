"use client";
import dynamic from "next/dynamic";

const Services5 = dynamic(() => import("@/components/sections/Services5"), {
  ssr: false,
});

export default function SectionProjects() {
  const teamMembers = [
    {
      name: "Feyza Nur Altındal",
      title: "Klinik Psikolog",
      image: "https://res.cloudinary.com/ddmwgv3av/image/upload/v1750159490/feyza_vujk3u.jpg"
    },
    {
      name: "Ceren Başol",
      title: "Klinik Psikolog", 
      image: "https://res.cloudinary.com/ddmwgv3av/image/upload/v1750159489/WhatsApp-Image-2025-06-16-at-3.26.25-PM_cm7bpb.jpg"
    },
    {
      name: "Zeynep E. Öztürk",
      title: "Klinik Psikolog",
      image: "https://res.cloudinary.com/ddmwgv3av/image/upload/v1750159489/zeynep-1024x694_wofp5k.jpg"
    }
  ];

  return (
    <>
      {/* Services 5 */}
      <Services5 />
      
      {/* Team Section */}
      <section className="section-team-1 py-5 position-relative overflow-hidden" style={{ backgroundColor: "#ffffff" }}>
        <div className="container">
          <div className="row position-relative z-1">
            <div className="text-center">
              <div
                className="d-flex align-items-center justify-content-center border border-2 border-white d-inline-flex rounded-pill px-4 py-2"
                data-aos="zoom-in"
                data-aos-delay={100}
                style={{ backgroundColor: "#f1f0fe" }}
              >
                <span 
                  className="tag-spacing fs-7 fw-bold ms-2 text-uppercase"
                  style={{ color: "#6342EC" }}
                >
                  UZMANLARIMIZ
                </span>
              </div>
              <h3
                className="ds-3 my-3 fw-bold"
                data-aos="fade-zoom-in"
                data-aos-delay={200}
                style={{ color: "#111827" }}
              >
                Profesyonel Ekibimiz
              </h3>
            </div>
          </div>
          
          <div className="row mt-6 justify-content-center">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="col-lg-4 col-md-6 mb-lg-4 mb-7"
                data-aos="fade-zoom-in"
                data-aos-delay={100 + index * 100}
              >
                <div className="position-relative d-inline-block z-1 w-100 text-center">
                  <div className="zoom-img rounded-3">
                    <img
                      className="img-fluid w-100"
                      src={member.image}
                      alt={member.name}
                      style={{ borderRadius: '8px', aspectRatio: '1/1', objectFit: 'cover' }}
                    />
                  </div>
                </div>
                <div className="mt-4 text-start">
                  <h6 className="fw-bold mb-2" style={{ color: "#111827" }}>
                     {member.name}
                  </h6>
                  <p className="text-muted mb-1">
                    <strong>{member.title}</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="rotate-center ellipse-rotate-success position-absolute z-0" />
        <div className="rotate-center-rev ellipse-rotate-primary position-absolute z-0" />
      </section>
    </>
  );
}
