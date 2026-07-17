import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { FaStar, FaUser, FaMedal, FaHeart } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import SEO from '../../components/common/SEO';
import { FadeUp, ScaleIn } from '../../components/common/Motion';
import { PortraitPlaceholder, Sparkle, WaveLines, Blob } from '../../components/common/Decorations';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import { PageSkeleton, CardSkeleton } from '../../components/common/Skeleton';
import { useAbout, useProjects, useSkills, useSettings } from '../../hooks/usePortfolio';
import { assetUrl } from '../../lib/api';
import {
  SiFigma,
} from 'react-icons/si';
import {
  TbBrandAdobeXd,
  TbBrandAdobePhotoshop,
  TbBrandAdobeIllustrator,
  TbTopologyStar3,
} from 'react-icons/tb';

const statsIcons = [FaStar, FaUser, FaMedal, FaHeart];

export default function HomePage() {
  const { data: about, isLoading: aboutLoading } = useAbout();
  const { data: projectsRes, isLoading: projectsLoading } = useProjects({ featured: true, limit: 6 });
  const { data: skillsRes } = useSkills({ featured: true });
  const { data: settings } = useSettings();

  if (aboutLoading) return <PageSkeleton />;

  const stats = settings?.stats || {
    projectsCompleted: `${about?.projectsCount || 10}+`,
    happyClients: `${about?.clientsCount || 5}+`,
    yearsExperience: `${about?.yearsExperience || 2}+`,
    commitment: about?.commitment || '100%',
  };

  const statItems = [
    { value: stats.projectsCompleted, label: 'Proyek Selesai' },
    { value: stats.happyClients, label: 'Klien Puas' },
    { value: stats.yearsExperience, label: 'Tahun Pengalaman' },
    { value: stats.commitment, label: 'Komitmen' },
  ];

  const featuredTools = [
    { name: 'Figma', icon: SiFigma, color: '#F24E1E' },
    { name: 'Adobe XD', icon: TbBrandAdobeXd, color: '#FF61F6' },
    { name: 'Photoshop', icon: TbBrandAdobePhotoshop, color: '#31A8FF' },
    { name: 'Illustrator', icon: TbBrandAdobeIllustrator, color: '#FF9A00' },
    { name: 'Prototyping', icon: TbTopologyStar3, color: '#F857A6' },
  ];

  const projects = projectsRes?.data || [];

  return (
    <>
      <SEO title="Beranda | Sukma." />

      {/* Hero */}
      <section className="relative overflow-hidden section-pad !pt-8 !pb-10">
        <WaveLines />
        <Blob className="bg-pink-soft w-72 h-72 -top-10 -left-10" />
        <Blob className="bg-gold-soft w-64 h-64 top-20 right-0" />

        <div className="container-site relative grid items-center gap-10 lg:grid-cols-2">
          <div>
            <FadeUp>
              <p className="text-muted mb-2 flex items-center gap-2">
                Halo, saya <Sparkle size={14} />
              </p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-ink mb-4">
                {about?.fullName || 'Rr Sukma Ayu Dwi Wulandari'}
              </h1>
            </FadeUp>
            <FadeUp delay={0.15}>
              <span className="inline-flex items-center gap-2 rounded-full bg-pink-soft/80 px-4 py-1.5 text-sm font-medium text-pink mb-5">
                {about?.profession || 'UI/UX Designer'} 🧡
              </span>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="text-muted max-w-lg leading-relaxed mb-8">
                {about?.shortBio || about?.bio}
              </p>
            </FadeUp>
            <FadeUp delay={0.25}>
              <div className="flex flex-wrap gap-3">
                <Link to="/proyek" className="btn-primary">
                  Lihat Proyek Saya <ArrowRight size={16} />
                </Link>
                <Link to="/kontak" className="btn-outline">
                  Hubungi Saya <MessageCircle size={16} />
                </Link>
              </div>
            </FadeUp>
          </div>

          <ScaleIn delay={0.2} className="relative flex justify-center">
            {about?.photo || about?.heroPhoto ? (
              <div className="relative">
                <img
                  src={assetUrl(about.photo || about.heroPhoto)}
                  alt={about.fullName}
                  className="h-72 w-72 sm:h-80 sm:w-80 rounded-full object-cover border-4 border-gold/40 shadow-soft"
                />
                <Sparkle className="absolute top-4 right-8" />
              </div>
            ) : (
              <PortraitPlaceholder name={about?.shortName || 'Sukma'} size={340} />
            )}
          </ScaleIn>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 px-4 sm:px-6 -mt-2 mb-8">
        <FadeUp>
          <div className="container-site glass-strong rounded-3xl shadow-soft p-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {statItems.map((item, i) => {
              const Icon = statsIcons[i];
              return (
                <div key={item.label} className="text-center">
                  <div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-full bg-pink/10 text-pink">
                    <Icon size={16} />
                  </div>
                  <p className="font-display text-2xl sm:text-3xl font-semibold text-ink">
                    <AnimatedCounter value={item.value} />
                  </p>
                  <p className="text-xs sm:text-sm text-muted mt-1">{item.label}</p>
                </div>
              );
            })}
          </div>
        </FadeUp>
      </section>

      {/* About preview */}
      <section className="section-pad !pt-10">
        <div className="container-site grid gap-10 lg:grid-cols-2 items-center">
          <FadeUp>
            <div className="relative rounded-3xl overflow-hidden shadow-soft bg-gradient-to-br from-pink-soft to-white aspect-[4/3] flex items-center justify-center">
              <div className="text-center p-8">
                <p className="font-display text-2xl text-pink mb-2">Create Meaningful</p>
                <p className="font-display text-3xl text-ink">Experiences</p>
              </div>
              <span className="absolute bottom-4 left-4 grid h-10 w-10 place-items-center rounded-full bg-pink text-white shadow-glow">
                ♥
              </span>
            </div>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="label-gold mb-2 flex items-center gap-2">
              Tentang Saya <Sparkle size={12} />
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4 leading-snug">
              Desain yang <span className="text-pink">Indah</span>, Pengalaman yang{' '}
              <span className="text-pink">Berkesan</span>
            </h2>
            <p className="text-muted leading-relaxed mb-4">{about?.bio}</p>
            {about?.quote && (
              <p className="text-pink italic text-sm mb-6 border-l-2 border-pink pl-4">{about.quote}</p>
            )}
            <Link to="/tentang" className="btn-outline">
              Selengkapnya Tentang Saya <ArrowRight size={16} />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* Projects preview */}
      <section className="section-pad !pt-6 bg-white/40">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <FadeUp>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold">
                Beberapa <span className="text-pink">Karya Pilihan Saya</span>
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <Link to="/proyek" className="btn-ghost">
                Lihat Semua Proyek ⊞
              </Link>
            </FadeUp>
          </div>

          {projectsLoading ? (
            <CardSkeleton />
          ) : (
            <FadeUp>
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 4500, disableOnInteraction: false }}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                className="!pb-12"
              >
                {projects.map((project) => (
                  <SwiperSlide key={project.id}>
                    <article className="card-premium overflow-hidden h-full">
                      <div className="h-44 bg-gradient-to-br from-pink-soft to-gold-soft/40 relative">
                        {project.thumbnail ? (
                          <img
                            src={assetUrl(project.thumbnail)}
                            alt={project.title}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-full w-full grid place-items-center text-pink/40 font-display text-xl">
                            {project.category}
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <span className="text-xs font-semibold text-pink bg-pink-soft/70 px-3 py-1 rounded-full">
                          {project.category}
                        </span>
                        <h3 className="font-display text-xl mt-3 mb-2">{project.title}</h3>
                        <p className="text-sm text-muted line-clamp-2 mb-4">
                          {project.shortDesc || project.description}
                        </p>
                        <Link
                          to={`/proyek/${project.slug}`}
                          className="text-sm font-semibold text-pink inline-flex items-center gap-1 hover:gap-2 transition-all"
                        >
                          Lihat Detail <ArrowRight size={14} />
                        </Link>
                      </div>
                    </article>
                  </SwiperSlide>
                ))}
              </Swiper>
            </FadeUp>
          )}
        </div>
      </section>

      {/* Skills + CTA */}
      <section className="section-pad">
        <div className="container-site grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <FadeUp>
            <p className="label-gold mb-2 flex items-center gap-2">
              Keahlian Saya <Sparkle size={12} />
            </p>
            <div className="flex flex-wrap gap-6 mt-6">
              {featuredTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <div key={tool.name} className="flex flex-col items-center gap-2">
                    <div className="grid h-16 w-16 place-items-center rounded-full bg-white shadow-card border border-pink-soft/50">
                      <Icon size={28} color={tool.color} />
                    </div>
                    <span className="text-xs font-medium text-muted">{tool.name}</span>
                  </div>
                );
              })}
            </div>
            <Link to="/keahlian" className="inline-block mt-6 text-sm font-semibold text-pink">
              Lihat Semua Keahlian →
            </Link>
          </FadeUp>

          <ScaleIn>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink to-pink-deep p-8 text-white shadow-glow min-h-[220px] flex flex-col justify-center">
              <Sparkle className="absolute top-4 right-6" color="#D4AF37" size={22} />
              <h3 className="font-display text-2xl sm:text-3xl font-semibold mb-4 leading-snug">
                {settings?.contact?.ctaTitle || 'Punya proyek menarik? Mari wujudkan bersama!'}
              </h3>
              <Link
                to="/kontak"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-pink hover:-translate-y-0.5 transition"
              >
                Hubungi Saya ↗
              </Link>
            </div>
          </ScaleIn>
        </div>
      </section>
    </>
  );
}
