import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Calendar, User } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import SEO from '../../components/common/SEO';
import { FadeUp } from '../../components/common/Motion';
import { PageSkeleton } from '../../components/common/Skeleton';
import { useProject } from '../../hooks/usePortfolio';
import { assetUrl } from '../../lib/api';

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const { data: project, isLoading, error } = useProject(slug);

  if (isLoading) return <PageSkeleton />;
  if (error || !project) {
    return (
      <div className="container-site section-pad text-center">
        <p className="text-muted mb-4">Project tidak ditemukan.</p>
        <Link to="/proyek" className="btn-primary">
          Kembali ke Proyek
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO title={project.title} description={project.shortDesc || project.description} />
      <section className="section-pad !pt-6">
        <div className="container-site max-w-4xl">
          <FadeUp>
            <Link to="/proyek" className="inline-flex items-center gap-2 text-sm text-pink font-medium mb-6">
              <ArrowLeft size={14} /> Kembali
            </Link>
            <span className="text-xs font-semibold text-pink bg-pink-soft/70 px-3 py-1 rounded-full">
              {project.category}
            </span>
            <h1 className="font-display text-4xl font-semibold mt-4 mb-4">{project.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-muted mb-8">
              {project.role && (
                <span className="inline-flex items-center gap-1">
                  <User size={14} /> {project.role}
                </span>
              )}
              {project.startDate && (
                <span className="inline-flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(project.startDate).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                  {project.endDate
                    ? ` – ${new Date(project.endDate).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}`
                    : ''}
                </span>
              )}
              <span className="capitalize">{project.status}</span>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="rounded-3xl overflow-hidden aspect-video bg-gradient-to-br from-pink-soft to-gold-soft/40 mb-8 shadow-soft">
              {project.thumbnail ? (
                <img src={assetUrl(project.thumbnail)} alt={project.title} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full grid place-items-center font-display text-2xl text-pink/40">{project.category}</div>
              )}
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div className="prose max-w-none mb-8">
              <h2 className="font-display text-2xl mb-3">Deskripsi</h2>
              <p className="text-muted leading-relaxed whitespace-pre-line">{project.description}</p>
            </div>
          </FadeUp>

          {(project.techStack || []).length > 0 && (
            <FadeUp delay={0.2}>
              <h2 className="font-display text-2xl mb-3">Tech Stack</h2>
              <div className="flex flex-wrap gap-2 mb-8">
                {project.techStack.map((t) => (
                  <span key={t} className="rounded-full bg-pink-soft/70 px-4 py-1.5 text-sm font-medium text-pink">
                    {t}
                  </span>
                ))}
              </div>
            </FadeUp>
          )}

          <FadeUp delay={0.25}>
            <div className="flex flex-wrap gap-3 mb-10">
              {project.demoUrl && (
                <a href={project.demoUrl} target="_blank" rel="noreferrer" className="btn-primary">
                  Live Demo <ExternalLink size={14} />
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn-outline">
                  GitHub <FaGithub size={14} />
                </a>
              )}
            </div>
          </FadeUp>

          {(project.images || []).length > 0 && (
            <FadeUp>
              <h2 className="font-display text-2xl mb-4">Gallery</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {project.images.map((img) => (
                  <img
                    key={img.id}
                    src={assetUrl(img.url)}
                    alt={img.caption || project.title}
                    className="rounded-2xl shadow-card object-cover aspect-video"
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
