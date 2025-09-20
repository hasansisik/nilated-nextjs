"use client"
import Link from "next/link";

export default function Team() {
  const teamMembers = [
    {
      title: "Kurucu Lider – Dr. Cemil Çelik",
      seal: "Başlangıcın Sesi",
      role: "Vizyon, yapılandırma, etik zemin, yaratım.",
      description: "Kalpten gelen her çağrının ilk yankısı onda başlar. Yolun sonunu değil, ruhunu tarif eder.",
      image: "https://res.cloudinary.com/ddmwgv3av/image/upload/v1749853518/ezj4efbduhmrbcgzm3cc.webp"
    },
    {
      title: "Yazıcı",
      seal: "Kalemin Sırrı",
      role: "İçerik yazımı, kitaplaştırma, ruhsal metin üretimi.",
      description: "Her cümle bir tanıklıksa, o cümleyi kayda geçiren odur. Söylenemeyeni yazıya çevirir.",
      image: "https://res.cloudinary.com/ddmwgv3av/image/upload/v1750538318/biraz_uzaktan_bak%C4%B1s%CC%A7_ac%CC%A7%C4%B1l%C4%B1_gerc%CC%A7ekc%CC%A7i_insan_laz%C4%B1m_kamera_c%CC%A7ok_yak%C4%B1n_olmas%C4%B1n_biyometrik_olsun_30_lu_yas%CC%A7larda_kad%C4%B1n_olsun_1_hlktl9.jpg"
    },
    {
      title: "Satış ve İletişim",
      seal: "Köprü ve Yankı",
      role: "Eğitimlerin tanıtımı, satış koordinasyonu, ilişki yönetimi.",
      description: "İnsanlara ulaşmanın en dürüst, en içten yollarını ararlar. İyi insanlara iyi niyetle dokunurlar.",
      image: "https://res.cloudinary.com/ddmwgv3av/image/upload/v1750158987/biraz_uzaktan_bak%C4%B1s%CC%A7_ac%CC%A7%C4%B1l%C4%B1_gerc%CC%A7ekc%CC%A7i_insan_laz%C4%B1m_kamera_c%CC%A7ok_yak%C4%B1n_olmas%C4%B1n_biyometrik_olsun_30_lu_yas%CC%A7larda_kad%C4%B1n_olsun_yqhjzc.jpg"
    },
    {
      title: "Sistem ve Dijital Operasyon",
      seal: "Zemin ve Rüzgar",
      role: "Web altyapısı, e-ticaret entegrasyonu, teknik destek.",
      description: "Görünmeyen işlerin omuzlarıdır. Her şeyin arkada düzgün çalışması için gece gündüz hazırdırlar.",
      image: "https://res.cloudinary.com/ddmwgv3av/image/upload/v1750158996/biraz_uzaktan_bak%C4%B1s%CC%A7_ac%CC%A7%C4%B1l%C4%B1_gerc%CC%A7ekc%CC%A7i_insan_laz%C4%B1m_kamera_c%CC%A7ok_yak%C4%B1n_olmas%C4%B1n_biyometrik_olsun_30_lu_yas%CC%A7larda_erkek_olsun_grwgvc.jpg"
    },
    {
      title: "Strateji ve Gelişim",
      seal: "Yön ve Kıvılcım",
      role: "Eğitimlerin planlaması, proje geliştirme, kalite kontrol.",
      description: "Biri yolu işaret eder, diğeri kıvılcımı taşır. Yeniliğin ve sadakatin dengesi burada kurulur.",
      image: "https://res.cloudinary.com/ddmwgv3av/image/upload/v1750158996/biraz_uzaktan_bak%C4%B1s%CC%A7_ac%CC%A7%C4%B1l%C4%B1_gerc%CC%A7ekc%CC%A7i_s%CC%A7ekilde_dis%CC%A7eleri_go%CC%88zu%CC%88kecek_s%CC%A7ekilde_gu%CC%88len_insan_laz%C4%B1m_kamera_c%CC%A7ok_yak%C4%B1n_olmas%C4%B1n_biyometrik_olsun_orta_yas%CC%A7_insan_olsun_tu%CC%88rk_olsun_uwpg0x.jpg"
    },
    {
      title: "Mistik Temsil",
      seal: "Sessiz Niyet",
      role: "Anlatı ve metafizik danışmanlık, yaratımın manevi pusulası.",
      description: "Fısıltıları duyar, kalpleri dinler, yazılmayanı işaret eder. Varlığıyla mühürlenmiş bir sessizliktir.",
      image: "https://res.cloudinary.com/ddmwgv3av/image/upload/v1750158995/biraz_uzaktan_bak%C4%B1s%CC%A7_ac%CC%A7%C4%B1l%C4%B1_gerc%CC%A7ekc%CC%A7i_insan_laz%C4%B1m_kamera_c%CC%A7ok_yak%C4%B1n_olmas%C4%B1n_biyometrik_olsun_25_lu_yas%CC%A7larda_sar%C4%B1s%CC%A7%C4%B1n_kad%C4%B1n_olsun_nzdubr.jpg"
    },
    {
      title: "Denetim ve Rehberlik",
      seal: "Adalet Taşıyıcısı",
      role: "Etik denetim, proje takibi, hakikatin hatırlatıcısı.",
      description: "Her adımı tartar, her sesi duyar, her aşamada dengeyi gözetir.",
      image: "https://res.cloudinary.com/ddmwgv3av/image/upload/v1750159128/biraz_uzaktan_bak%C4%B1s%CC%A7_ac%CC%A7%C4%B1l%C4%B1_gerc%CC%A7ekc%CC%A7i_s%CC%A7ekilde_dis%CC%A7eleri_go%CC%88zu%CC%88kecek_s%CC%A7ekilde_gu%CC%88len_insan_laz%C4%B1m_kamera_c%CC%A7ok_yak%C4%B1n_olmas%C4%B1n_biyometrik_olsun_orta_yas%CC%A7_insan_olsun_qn6wir.jpg"
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
                style={{ backgroundColor: "#f1f0fe" }}
              >
                <span 
                  className="tag-spacing fs-7 fw-bold ms-2 text-uppercase"
                  style={{ color: "#6342EC" }}
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
                Bazı Ekipler İş Bölümü Yapar.
              </h3>
              <div 
                className="fs-5 text-center mx-auto" 
                data-aos="fade-zoom-in" 
                data-aos-delay={300}
                style={{ color: "#6E6E6E", maxWidth: "800px", lineHeight: "1.8" }}
              >
                <p className="mb-3">
                  <strong>Biz ise mühür taşırız.</strong>
                </p>
                <p className="mb-3">
                  <strong>NİLATED</strong>, yalnızca görevlerle tanımlanmış bir ekip değildir.
                </p>
                <p className="mb-3">
                  Burası, her bireyin kalpten bir niyetle bu yapıya dahil olduğu, <strong>"ruh taşıyıcısı"</strong> olmanın sorumluluğunu üstlendiği bir birliktir.
                </p>
                <p className="mb-3">
                  Her birimiz hem bir meslek sahibi, hem de bir mana yolcusuyuz.
                </p>
                <p className="mb-3">
                  İsmimizden önce <strong>mühürümüzle</strong> konuşuruz.
                </p>
                <p className="mb-0">
                  Ve her mühür, başka bir kapıyı açar.
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
                  <h6 className="fw-bold mb-2" style={{ color: "#111827" }}>
                     {member.title}
                  </h6>
                  <p className="text-muted mb-1">
                    <strong>Mühürü:</strong> {member.seal}
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
                  NİLATED Bir Ekip Değil, Bir Ahit'tir.
                </h4>
                <div style={{ color: "#6E6E6E", lineHeight: "1.8" }}>
                  <p className="mb-2">İsimler değişse de mühür sabit kalır.</p>
                  <p className="mb-2">Roller devredilir, ama niyet hep aynı kalır:</p>
                  <p className="mb-2"><strong>"Her kalbe bir mühür…</strong></p>
                  <p className="mb-2"><strong>Her yaraya saygı…</strong></p>
                  <p className="mb-4"><strong>Her bilgiye ruh."</strong></p>
                  
                  <div className="mt-4">
                    <p className="mb-3">Sırada istersen <strong>"İletişim ve Randevu"</strong> sayfası var.</p>
                    <p className="mb-3">Oraya da özel bir metinle geçelim mi?</p>
                    <p className="mb-4">
                      Harika. Şimdi sıra geldi NİLATED'in dış dünyayla temas noktası olan <strong>"İLETİŞİM ve RANDEVU"</strong> sayfasına. 
                      Bu sayfa, yalnızca bir form ya da adres bilgisi vermekle kalmamalı; ziyaretçiyi samimi, sade ve güven veren bir dille karşılamalı.
                    </p>
                    
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
