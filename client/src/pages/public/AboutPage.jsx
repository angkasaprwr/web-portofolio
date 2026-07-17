import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Download,
  Send,
  Cake,
  User,
  GraduationCap,
  Mail,
  Heart,
  Star,
  Trophy,
  Target,
  Palette,
  Camera,
  Music,
  Plane,
  Code,
  BookOpen,
} from 'lucide-react';
import SEO from '../../components/common/SEO';
import { FadeUp, ScaleIn } from '../../components/common/Motion';
import { PortraitPlaceholder, Sparkle, Blob } from '../../components/common/Decorations';
import { PageSkeleton } from '../../components/common/Skeleton';
import { useAbout, useSkills, useCv } from '../../hooks/usePortfolio';
import { assetUrl } from '../../lib/api';
import { cvApi } from '../../services/apiServices';
import toast from 'react-hot-toast';

const hobbyIcons = {
  palette: Palette,
  camera: Camera,
  music: Music,
  plane: Plane,
  code: Code,
  book: BookOpen,
};

export default function AboutPage() {
  const { data: about, isLoading } = useAbout();
  const { data: skillsRes } = useSkills({ category: 'Proficiency' });
  const { data: allSkills } = useSkills({});
  const { data: cv } = useCv();

  if (isLoading || !about) return <PageSkeleton />;

  const progressSkills =
    (skillsRes?.data?.length ? skillsRes.data : allSkills?.data?.filter((s) => s.category === 'UI Design' || s.category === 'Proficiency'))?.slice(0, 5) ||
    [];

  const timeline = about.educationTimeline || [];
  const hobbies = about.hobbies || [];

  const handleDownload = async () => {
    if (!cv?.fileUrl) return toast.error('CV belum tersedia');
    try {
      await cvApi.trackDownload(cv.id);
    } catch {
      /* ignore */
    }
    window.open(assetUrl(cv.fileUrl), '_blank');
  };

  const bioItems = [
    { icon: Cake, label: 'Tanggal Lahir', value: about.birthDate ? new Date(about.birthDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-' },
    { icon: User, label: 'Nama Lengkap', value: about.fullName },
    { icon: GraduationCap, label: 'Pendidikan', value: about.education },
    { icon: Mail, label: 'Email', value: 'Via Kontak' },
  ];

  const stats = [
    { icon: Heart, label: '100% Dedikasi' },
    { icon: Star, label: `${about.projectsCount}+ Proyek Selesai` },
    { icon: Trophy, label: `${about.yearsExperience}+ Tahun Belajar` },
    { icon: Target, label: 'Berorientasi Solusi' },
  ];

  return (
    <>
      <SEO title="Tentang Saya" description={about.shortBio || about.bio} />

      <section className="relative overflow-hidden section-pad !pt-6">
        <Blob className="bg-pink-soft w-80 h-80 -top-20 right-0" />
        <div className="container-site grid gap-10 lg:grid-cols-2 items-center">
          <FadeUp>
            <p className="label-gold mb-3 flex items-center gap-2">
              <Sparkle size={12} /> TENTANG SAYA
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-4">
              Tentang <span className="text-pink">{about.shortName || 'Sukma Ayu'}</span>
            </h1>
            <p className="text-muted leading-relaxed mb-8 max-w-lg">{about.shortBio || about.bio}</p>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/kontak" className="btn-primary">
                Hubungi Saya <Send size={14} />
              </Link>
              <button
                type="button"
                onClick={handleDownload}
                className="grid h-12 w-12 place-items-center rounded-full border-2 border-gold text-gold hover:bg-gold hover:text-white transition"
                aria-label="Download CV"
              >
                <Download size={18} />
              </button>
            </div>
          </FadeUp>
          <ScaleIn className="flex justify-center">
            {about.photo ? (
              <img src={assetUrl(about.photo)} alt={about.fullName} className="rounded-full h-80 w-80 object-cover border-4 border-gold/40" />
            ) : (
              <PortraitPlaceholder name={about.shortName || 'Sukma'} size={340} />
            )}
          </ScaleIn>
        </div>
      </section>

      <section className="section-pad !pt-4">
        <div className="container-site">
          <FadeUp>
            <div className="card-premium !hover:translate-y-0 p-6 sm:p-10">
              <div className="grid gap-10 lg:grid-cols-2">
                <div>
                  <h2 className="font-display text-2xl mb-4">Cerita Singkat</h2>
                  {(about.story || about.bio).split('\n\n').map((para, i) => (
                    <p key={i} className="text-muted leading-relaxed mb-4">
                      {para}
                    </p>
                  ))}
                  {about.quote && (
                    <blockquote className="mt-4 rounded-2xl bg-pink-soft/50 px-5 py-4 text-pink italic text-sm leading-relaxed">
                      “{about.quote}”
                    </blockquote>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
                  {bioItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="rounded-2xl border border-pink-soft/70 bg-pink-light/50 p-4">
                        <div className="flex items-center gap-2 text-pink mb-2">
                          <Icon size={16} />
                          <span className="text-xs font-semibold uppercase tracking-wide">{item.label}</span>
                        </div>
                        <p className="text-sm font-medium text-ink">{item.value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-8 flex justify-center">
                <button type="button" onClick={handleDownload} className="btn-outline">
                  Unduh CV Saya <Download size={14} />
                </button>
              </div>
            </div>
          </FadeUp>

          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <FadeUp key={s.label} delay={i * 0.05}>
                  <div className="glass rounded-2xl p-4 text-center">
                    <Icon className="mx-auto text-pink mb-2" size={18} />
                    <p className="text-sm font-medium">{s.label}</p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-pad !pt-4">
        <div className="container-site grid gap-6 lg:grid-cols-3">
          <FadeUp>
            <div className="card-premium !hover:translate-y-0 p-6 h-full flex flex-col">
              <h3 className="font-display text-xl mb-5">Keahlian Utama</h3>
              <div className="space-y-4 flex-1">
                {progressSkills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-pink font-semibold">{skill.level}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-pink-soft overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-pink to-pink-deep transition-all duration-1000"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/keahlian" className="btn-outline mt-6 w-full text-sm">
                Lihat Semua Keahlian <ArrowRight size={14} />
              </Link>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="card-premium !hover:translate-y-0 p-6 h-full flex flex-col">
              <h3 className="font-display text-xl mb-5">Pendidikan</h3>
              <div className="relative flex-1 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-pink-soft">
                {timeline.map((item, i) => (
                  <div key={i} className="pl-8 relative">
                    <span className="absolute left-0 top-1 h-4 w-4 rounded-full bg-pink border-4 border-pink-soft" />
                    <p className="text-xs text-pink font-semibold">{item.period}</p>
                    <p className="font-semibold text-sm mt-0.5">{item.institution}</p>
                    <p className="text-sm text-muted">{item.degree}</p>
                    {item.detail && <p className="text-xs text-muted mt-1">{item.detail}</p>}
                  </div>
                ))}
              </div>
              <button type="button" className="btn-outline mt-6 w-full text-sm opacity-70 cursor-default">
                Selengkapnya <ArrowRight size={14} />
              </button>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="card-premium !hover:translate-y-0 p-6 h-full flex flex-col">
              <h3 className="font-display text-xl mb-5">Yang Saya Sukai</h3>
              <div className="grid grid-cols-3 gap-3 flex-1">
                {hobbies.map((hobby) => {
                  const Icon = hobbyIcons[hobby.icon] || Heart;
                  return (
                    <div
                      key={hobby.name}
                      className="aspect-square rounded-2xl bg-pink-soft/60 flex flex-col items-center justify-center gap-1 text-pink hover:bg-pink hover:text-white transition"
                    >
                      <Icon size={20} />
                      <span className="text-[10px] font-medium text-center px-1">{hobby.name}</span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-6 text-sm text-pink italic text-center flex items-center justify-center gap-2">
                Hidup untuk berkarya dengan hati <span className="text-gold">♥</span>
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="section-pad !pt-0">
        <div className="container-site">
          <div className="rounded-3xl bg-gradient-to-r from-pink to-pink-deep p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-glow">
            <p className="font-display text-xl sm:text-2xl max-w-xl leading-snug">
              Punya proyek menarik? Mari berkolaborasi dan wujudkan ide Anda menjadi solusi terbaik.
            </p>
            <Link to="/kontak" className="btn-primary !bg-white !text-pink shrink-0">
              Hubungi Saya <Send size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
