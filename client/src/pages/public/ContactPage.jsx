import { Link } from 'react-router-dom';
import { FaWhatsapp, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { ArrowRight, Sparkles } from 'lucide-react';
import SEO from '../../components/common/SEO';
import { FadeUp, ScaleIn } from '../../components/common/Motion';
import { PortraitPlaceholder, Sparkle, Blob, WaveLines } from '../../components/common/Decorations';
import { PageSkeleton } from '../../components/common/Skeleton';
import { useAbout, useSocialLinks, useSettings } from '../../hooks/usePortfolio';
import { assetUrl } from '../../lib/api';

const platformConfig = {
  whatsapp: {
    icon: FaWhatsapp,
    color: '#25D366',
    title: 'WhatsApp',
    desc: 'Chat langsung untuk diskusi cepat seputar proyek dan kolaborasi.',
    cta: 'Chat via WhatsApp',
  },
  email: {
    icon: MdEmail,
    color: '#EA4335',
    title: 'Email',
    desc: 'Kirim detail proyek atau proposal melalui email profesional.',
    cta: 'Kirim Email',
  },
  github: {
    icon: FaGithub,
    color: '#181717',
    title: 'GitHub',
    desc: 'Jelajahi repositori dan karya pengembangan saya.',
    cta: 'Kunjungi GitHub',
  },
  linkedin: {
    icon: FaLinkedinIn,
    color: '#0A66C2',
    title: 'LinkedIn',
    desc: 'Terhubung secara profesional dan lihat perjalanan karier saya.',
    cta: 'Kunjungi LinkedIn',
  },
};

export default function ContactPage() {
  const { data: about, isLoading } = useAbout();
  const { data: socials = [] } = useSocialLinks();
  const { data: settings } = useSettings();

  if (isLoading) return <PageSkeleton />;

  const contactPlatforms = ['whatsapp', 'email', 'github', 'linkedin']
    .map((platform) => {
      const link = socials.find((s) => s.platform === platform);
      if (!link) return null;
      return { ...platformConfig[platform], ...link };
    })
    .filter(Boolean);

  const primaryCta = socials.find((s) => s.platform === 'whatsapp')?.url || '/kontak';

  return (
    <>
      <SEO
        title="Kontak"
        description="Mari terhubung dan berdiskusi tentang proyek menarik. Hubungi melalui WhatsApp, Email, GitHub, atau LinkedIn."
      />

      <section className="relative overflow-hidden section-pad !pt-6">
        <WaveLines />
        <Blob className="bg-pink-soft w-72 h-72 -top-10 left-0" />
        <Sparkle className="absolute top-24 right-1/4" size={14} />
        <Sparkle className="absolute bottom-20 left-1/3" size={10} />

        <div className="container-site relative grid gap-10 lg:grid-cols-2 items-center">
          <FadeUp>
            <p className="label-gold mb-3 flex items-center gap-2">
              KONTAK SAYA <Sparkle size={12} />
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-4 leading-tight">
              Mari Terhubung,{' '}
              <span className="text-pink">Saya Senang Berdiskusi!</span>
            </h1>
            <p className="text-muted leading-relaxed mb-8 max-w-lg">
              Saya terbuka untuk kolaborasi, freelance project, maupun sekadar berbagi ide seputar
              desain dan teknologi. Silakan hubungi melalui platform di bawah.
            </p>
            <a
              href={primaryCta}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost inline-flex"
            >
              <Sparkles size={14} className="text-gold" />
              Mari Berkolaborasi
            </a>
          </FadeUp>

          <ScaleIn className="flex justify-center">
            {about?.photo ? (
              <div className="relative">
                <img
                  src={assetUrl(about.photo)}
                  alt={about.fullName}
                  className="rounded-full h-80 w-80 object-cover border-4 border-gold/40 shadow-soft"
                />
                <span className="absolute -bottom-2 right-4 font-display text-3xl italic text-pink">
                  {about.shortName || 'Sukma'}
                </span>
              </div>
            ) : (
              <PortraitPlaceholder name={about?.shortName || 'Sukma'} size={340} />
            )}
          </ScaleIn>
        </div>
      </section>

      <section className="section-pad !pt-4">
        <div className="container-site">
          <FadeUp>
            <h2 className="font-display text-3xl text-center mb-2 flex items-center justify-center gap-3">
              Terhubung Dengan Saya
            </h2>
            <div className="flex items-center justify-center gap-3 mb-10">
              <span className="h-px w-12 bg-pink-soft" />
              <span className="text-pink">♥</span>
              <span className="h-px w-12 bg-pink-soft" />
            </div>
          </FadeUp>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {contactPlatforms.map((item, i) => {
              const Icon = item.icon;
              return (
                <FadeUp key={item.id} delay={i * 0.08}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="card-premium p-6 h-full flex flex-col group"
                  >
                    <div
                      className="grid h-14 w-14 place-items-center rounded-2xl mb-4 transition group-hover:scale-110"
                      style={{ backgroundColor: `${item.color}18`, color: item.color }}
                    >
                      <Icon size={28} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted flex-1 mb-5">{item.desc}</p>
                    <span className="btn-ghost !px-4 !py-2 text-xs w-fit">
                      {item.cta} <ArrowRight size={12} />
                    </span>
                  </a>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-pad !pt-4">
        <div className="container-site">
          <FadeUp>
            <div className="rounded-3xl border border-pink-soft/70 bg-white/80 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-card relative overflow-hidden">
              <Sparkle className="absolute top-4 left-6" size={14} />
              <Sparkle className="absolute bottom-6 right-10" size={12} />
              <div className="flex items-center gap-6">
                <div className="hidden sm:grid h-28 w-36 place-items-center rounded-2xl bg-gradient-to-br from-pink-soft to-white">
                  <div className="text-center">
                    <div className="text-4xl mb-1">💻</div>
                    <div className="text-pink text-xl">🌷</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold mb-2">
                    {settings?.contact?.ctaSubtitle || 'Tertarik untuk bekerja sama?'}
                  </h3>
                  <p className="text-muted text-sm">Mari wujudkan ide menjadi pengalaman yang bermakna.</p>
                </div>
              </div>
              <a
                href={primaryCta}
                target="_blank"
                rel="noreferrer"
                className="btn-primary shrink-0"
              >
                Mari Berkolaborasi <ArrowRight size={14} />
              </a>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
