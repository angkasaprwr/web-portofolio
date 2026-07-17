import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, MapPin, Calendar, FileText } from 'lucide-react';
import SEO from '../../components/common/SEO';
import { FadeUp } from '../../components/common/Motion';
import { PageSkeleton } from '../../components/common/Skeleton';
import { experiencesApi } from '../../services/apiServices';
import { assetUrl } from '../../lib/api';

export default function ExperienceDetailPage() {
  const { id } = useParams();
  const { data: exp, isLoading, error } = useQuery({
    queryKey: ['experience', id],
    queryFn: async () => (await experiencesApi.get(id)).data.data,
    enabled: !!id,
  });

  if (isLoading) return <PageSkeleton />;
  if (error || !exp) {
    return (
      <div className="container-site section-pad text-center">
        <p className="text-muted mb-4">Pengalaman tidak ditemukan.</p>
        <Link to="/pengalaman" className="btn-primary">
          Kembali
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO title={exp.title} description={exp.shortDesc || exp.description} />
      <section className="section-pad !pt-6">
        <div className="container-site max-w-3xl">
          <FadeUp>
            <Link to="/pengalaman" className="inline-flex items-center gap-2 text-sm text-pink font-medium mb-6">
              <ArrowLeft size={14} /> Kembali
            </Link>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs font-semibold text-pink bg-pink-soft/70 px-3 py-1 rounded-full">{exp.category}</span>
              <span className="text-xs font-semibold text-gold bg-gold-soft/50 px-3 py-1 rounded-full">{exp.type}</span>
            </div>
            <h1 className="font-display text-4xl font-semibold mb-3">{exp.title}</h1>
            <p className="text-muted flex items-center gap-1 mb-2">
              <MapPin size={14} /> {exp.company}
              {exp.location ? ` · ${exp.location}` : ''}
            </p>
            <p className="text-sm text-pink flex items-center gap-1 mb-8">
              <Calendar size={14} />
              {new Date(exp.startDate).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
              {' – '}
              {exp.isCurrent
                ? 'Sekarang'
                : exp.endDate
                  ? new Date(exp.endDate).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
                  : ''}
            </p>
          </FadeUp>

          {exp.thumbnail && (
            <FadeUp delay={0.1}>
              <img
                src={assetUrl(exp.thumbnail)}
                alt={exp.title}
                className="rounded-3xl w-full aspect-video object-cover mb-8 shadow-soft"
              />
            </FadeUp>
          )}

          <FadeUp delay={0.15}>
            <h2 className="font-display text-2xl mb-3">Deskripsi</h2>
            <p className="text-muted leading-relaxed whitespace-pre-line mb-8">{exp.description}</p>
          </FadeUp>

          {(exp.skills || []).length > 0 && (
            <FadeUp delay={0.2}>
              <h2 className="font-display text-2xl mb-3">Skill</h2>
              <div className="flex flex-wrap gap-2 mb-8">
                {exp.skills.map((s) => (
                  <span key={s} className="rounded-full bg-pink-soft/70 px-4 py-1.5 text-sm text-pink font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </FadeUp>
          )}

          {exp.documentUrl && (
            <FadeUp>
              <a
                href={assetUrl(exp.documentUrl)}
                target="_blank"
                rel="noreferrer"
                className="btn-outline inline-flex"
              >
                <FileText size={14} /> Lihat Dokumen
              </a>
            </FadeUp>
          )}

          {(exp.images || []).length > 0 && (
            <FadeUp>
              <h2 className="font-display text-2xl mb-4 mt-8">Gallery</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {exp.images.map((img) => (
                  <img
                    key={img.id}
                    src={assetUrl(img.url)}
                    alt={img.caption || exp.title}
                    className="rounded-2xl object-cover aspect-video shadow-card"
                    loading="lazy"
                  />
                ))}
              </div>
            </FadeUp>
          )}
        </div>
      </section>
    </>
  );
}
