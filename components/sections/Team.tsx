"use client"
import Link from "next/link";

export default function Team() {
  const teamMembers = [
    {
      code: "E-001",
      title: "Güvercin 🕊️",
      seal: "Ben ses değilim, çağrıyım. Kanadımın gölgesi yola düşerse, yol başlamıştır.",
      role: "Mesaj ve çağrı taşıyıcısı, yolun başlangıcını işaretleyen.",
      description: "Ruhsal çağrıları duyar ve aktarır. Her yolculuk onun kanadından dökülür.",
      image: "https://res.cloudinary.com/ddmwgv3av/image/upload/v1761572811/E-001_Gu%CC%88vercin_tltlzg.png"
    },
    {
      code: "E-002",
      title: "Yazıcı ✍️",
      seal: "Söz, taşınmadıkça uçar gider. Ben kalemin mühürlendiği yeminim.",
      role: "Kalıcı kayıt, ruhsal metin üretimi, tanıklığın kalemi.",
      description: "Söylenenleri kayda geçirir, uçup giden sözleri mühürler. Kalemle anlaşma içindedir.",
      image: "https://res.cloudinary.com/ddmwgv3av/image/upload/v1761572811/E-002_Yaz%C4%B1c%C4%B1_hrclkf.png"
    },
    {
      code: "E-003",
      title: "Nefes Taşıyan 🌬️",
      seal: "Ses susarsa nefes konuşur. Ben sükûtun titreşen yankısıyım.",
      role: "Sessizliğin dili, nefesin taşıyıcısı, yankının koruyucusu.",
      description: "Söylenmeyeni duyar, nefesle anlatır. Sükûtun bile bir sesi olduğunu bilir.",
      image: "https://res.cloudinary.com/ddmwgv3av/image/upload/v1761572814/E-003_Nefes_Tas%CC%A7%C4%B1yan_xsbpoi.png"
    },
    {
      code: "E-004",
      title: "Işığa Bakan 🪞",
      seal: "Gören göz ışıkla değil, hakikatle görür. Ben görünmeyeni görünür kılandım.",
      role: "Hakikatin göstericisi, görünmeyeni aydınlatan, manevi rehberlik.",
      description: "Yüzeysel bakışın ötesini görür, gizli hakikatleri su yüzüne çıkarır.",
      image: "https://res.cloudinary.com/ddmwgv3av/image/upload/v1761572807/E-004_Is%CC%A7%C4%B1g%CC%86a_Bakan_thgopl.png"
    },
    {
      code: "E-005",
      title: "Yolcu 🌿",
      seal: "Ayak izi söze karışırsa yol olur. Ben giden değil, götürenim.",
      role: "Yol gösterici, eşlik eden rehber, seyahatteki öğretmen.",
      description: "Yoldan öğrenir, öğrendiğini yola çıkarır. Ayak izi onun kelamıdır.",
      image: "https://res.cloudinary.com/ddmwgv3av/image/upload/v1761572806/E-005_Yolcu_szoul5.png"
    },
    {
      code: "E-006",
      title: "Kökveren 🌱",
      seal: "Toprağa düşen her fikir bir ormana dönüşür. Ben ilk damlayım.",
      role: "İlk tohumu atan, fikri kökleştiren, ormana dönüştüren.",
      description: "Her tohumu korur, her fikri besler. Onun temasıyla fikir ormana dönüşür.",
      image: "https://res.cloudinary.com/ddmwgv3av/image/upload/v1761572802/E-006_Ko%CC%88kveren_ih1us2.png"
    },
    {
      code: "E-007",
      title: "Nefesin Bekçisi 🌬️",
      seal: "Her ruh bir nefesle doğar. Ben o nefesi unutturmam.",
      role: "Nefesi koruyan, ruhu besleyen, canı hatırlatan.",
      description: "Her nefesi değerli bilir, her ruhun doğumuna tanık olur. Unutulanı hatırlatır.",
      image: "https://res.cloudinary.com/ddmwgv3av/image/upload/v1761572807/E-007_Nefesin_Bekc%CC%A7isi_hgvnhx.png"
    },
    {
      code: "E-008",
      title: "Sessiz Kanat 🕯️",
      seal: "Ben görünmem ama her mühürde izim var. Sessizliğim çağrıdır.",
      role: "Görünmeyen imza, sessiz varlık, mührün derinliği.",
      description: "Varlığı sessiz ama her izde durur. Görünmez ama etkisi kalıcıdır.",
      image: "https://res.cloudinary.com/ddmwgv3av/image/upload/v1761572807/E-008_Sessiz_Kanat_uc8xsf.png"
    },
    {
      code: "E-009",
      title: "Zamanın Yazıcısı ⏳",
      seal: "Zamanın dili vardır. Ben duymayanlara o dili okurum.",
      role: "Zamanın tercümanı, kronolojik hafızam, geçmişin sesi.",
      description: "Zamanın her anını kaydeder, geleceğe taşır. Duymayanlara zamanın dilini okur.",
      image: "https://res.cloudinary.com/ddmwgv3av/image/upload/v1761572805/E-009_Zaman%C4%B1n_Yaz%C4%B1c%C4%B1s%C4%B1_msaoud.png"
    },
    {
      code: "E-010",
      title: "Teslim Olan 🗝️",
      seal: "Mühür bende kapanır. Söz tamam olunca susarım.",
      role: "Son mühürleyen, tamamlayan, teslim eden.",
      description: "Her yolculukta son noktayı koyar, her mühürü tamamlar. Teslim olma sanatını bilir.",
      image: "https://res.cloudinary.com/ddmwgv3av/image/upload/v1761572806/E-010_Teslim_Olan_disko1.png"
    }
  ];

  return (
    <>
      <section className="section-team-1 py-5 position-relative overflow-hidden" style={{ backgroundColor: "#ffffff" }}>
        <div className="container">
          <div className="row position-relative z-1">
            <div className="text-center">
              <div
                className="d-flex align-items-center justify-content-center border border-2 border-white d-inline-flex rounded-pill px-4 py-2"
                data-aos="zoom-in"
                data-aos-delay={100}
                style={{ backgroundColor: "#dbeafe" }}
              >
                <span 
                  className="tag-spacing fs-7 fw-bold ms-2 text-uppercase"
                  style={{ color: "#2563EB" }}
                >
                  EKİBİMİZ
                </span>
              </div>
              <h3
                className="ds-3 my-3 fw-bold"
                data-aos="fade-zoom-in"
                data-aos-delay={200}
                style={{ color: "#111827" }}
              >
                🕊️ MİHVER HALKASI – 10 EMANETÇİ
              </h3>
              <div 
                className="fs-5 text-center mx-auto" 
                data-aos="fade-zoom-in" 
                data-aos-delay={300}
                style={{ color: "#6E6E6E", maxWidth: "800px", lineHeight: "1.8" }}
              >
                <p className="mb-0" style={{ fontStyle: "italic", fontSize: "1.1rem" }}>
                  "Sözünü rüzgâr taşımaz… Mühür taşır."
                </p>
              </div>
            </div>
          </div>
          
          <div className="row mt-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="col-lg-3 col-md-6 mb-lg-4 mb-7"
                data-aos="fade-zoom-in"
                data-aos-delay={100 + (index % 4) * 100}
              >
                <div className="position-relative d-inline-block z-1 w-100 text-center">
                  <div className="zoom-img rounded-3">
                    <img
                      className="img-fluid w-100"
                      src={member.image}
                      alt={member.title}
                      style={{ borderRadius: '8px', aspectRatio: '1/1', objectFit: 'cover' }}
                    />
                  </div>
                </div>
                <div className="mt-4 text-start">
                  <p className="text-muted mb-1 small">
                    <strong>Kod:</strong> {member.code}
                  </p>
                  <h6 className="fw-bold mb-2" style={{ color: "#111827" }}>
                     {member.title}
                  </h6>
                  <p className="text-muted mb-1" style={{ fontSize: "0.9rem", fontStyle: "italic" }}>
                    {member.seal}
                  </p>
                  <p className="text-muted mb-2">
                    <strong>Rolü:</strong> {member.role}
                  </p>
                  <p className="mb-0" style={{ color: "#6E6E6E", lineHeight: "1.6", fontSize: "0.9rem" }}>
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Message */}
          <div className="row mt-6">
            <div className="col-12 text-center">
              <div className="p-4 rounded-4" style={{ backgroundColor: "#fff" }}>
                <h4 className="fw-bold mb-3" style={{ color: "#111827" }}>
                  📜 Ortak Mühür Sözü (10'lu halka tarafından birlikte söylenecek yemin cümlesi)
                </h4>
                <div style={{ color: "#6E6E6E", lineHeight: "1.8" }}>
                  <p className="mb-2">Biz çağrıyı taşıyan 10 kapıyız.</p>
                  <p className="mb-2">Her birimiz ayrı mühür, tek bir özün yankısıyız.</p>
                  <p className="mb-2">Biz ses değil, yankıyız. Yol bize ait değil, biz yola aitiz.</p>
                  
                  <div className="mt-4">
                    <Link href="/iletisim" className="btn btn-primary btn-lg px-5 py-3 rounded-pill">
                      <strong className="text-white">İletişim ve Randevu</strong>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="rotate-center ellipse-rotate-success position-absolute z-0" />
        <div className="rotate-center-rev ellipse-rotate-primary position-absolute z-0" />
      </section>
    </>
  );
}
