import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Search, Bookmark, ExternalLink, ChevronDown, Send, Layout, Globe, BarChart3, MoreHorizontal } from 'lucide-react';
import SEO from '../../components/common/SEO';
import { FadeUp, ScaleIn } from '../../components/common/Motion';
import { PortraitPlaceholder, Sparkle, Blob } from '../../components/common/Decorations';
import { CardSkeleton, PageSkeleton } from '../../components/common/Skeleton';
import { useAbout, useProjects, useProjectCategories } from '../../hooks/usePortfolio';
import { assetUrl } from '../../lib/api';

const categoryMeta = {
  'UI Design': { icon: Layout, desc: 'Desain antarmuka yang elegan dan intuitif' },
  Website: { icon: Globe, desc: 'Website modern, responsif, dan menarik' },
  'Data Analysis': { icon: BarChart3, desc: 'Analisis data & visualisasi insight' },
  Lainnya: { icon: MoreHorizontal, desc: 'Proyek kreatif lainnya' },
};

export default function ProjectsPage() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || 'Semua';
  const [search, setSearch] = useState(params.get('q') || '');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  const query = useMemo(
    () => ({
      category: category === 'Semua' ? undefined : category,
      search: search || undefined,
      sort,
      page,
      limit: 9,
    }),
    [category, search, sort, page]
  );

  const { data: about } = useAbout();
  const { data: catStats } = useProjectCategories();
  const { data: projectsRes, isLoading, isFetching } = useProjects(query);

  const projects = projectsRes?.data || [];
  const meta = projectsRes?.meta;

  const setCategory = (cat) => {
    setPage(1);
    const next = new URLSearchParams(params);
    if (cat === 'Semua') next.delete('category');
    else next.set('category', cat);
    setParams(next);
  };

  const onSearch = (e) => {
    e.preventDefault();
    setPage(1);
    const next = new URLSearchParams(params);
    if (search) next.set('q', search);
    else next.delete('q');
    setParams(next);
  };

  const filters = ['Semua', 'UI Design', 'Website', 'Data Analysis', 'Lainnya'];

  return (
    <>
      <SEO title="Proyek" description="Karya nyata dan solusi bermakna dari proyek UI/UX, website, dan data analysis." />

      <section className="relative overflow-hidden section-pad !pt-6 !pb-10">
        <Blob className="bg-pink-soft w-72 h-72 top-0 right-10" />
        <div className="container-site grid gap-10 lg:grid-cols-2 items-center">
          <FadeUp>
            <p className="label-gold mb-3 flex items-center gap-2">
              PROYEK SAYA <Sparkle size={12} />
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-4 leading-tight">
              Karya Nyata, <span className="text-pink">Solusi Bermakna.</span>
            </h1>
            <p className="text-muted leading-relaxed mb-6 max-w-lg">
              Setiap proyek adalah kesempatan untuk menciptakan pengalaman yang indah dan fungsional —
              dari riset hingga prototipe yang siap dikembangkan.
            </p>
            <a href="#semua-proyek" className="btn-outline">
              Lihat Semua Proyek <ArrowRight size={14} />
            </a>
          </FadeUp>
          <ScaleIn className="flex justify-center">
            {about?.photo ? (
              <img src={assetUrl(about.photo)} alt="" className="rounded-full h-72 w-72 object-cover border-4 border-gold/40" />
            ) : (
              <PortraitPlaceholder name={about?.shortName || 'Sukma'} size={300} />
            )}
          </ScaleIn>
        </div>
      </section>

      <section className="px-4 sm:px-6 mb-10">
        <div className="container-site grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(catStats || Object.keys(categoryMeta).map((c) => ({ category: c, count: 0 }))).map((item) => {
            const metaInfo = categoryMeta[item.category] || categoryMeta.Lainnya;
            const Icon = metaInfo.icon;
            const active = category === item.category;
            return (
              <button
                key={item.category}
                type="button"
                onClick={() => setCategory(item.category)}
                className={`text-left card-premium p-5 border-2 ${
                  active ? 'border-pink shadow-glow' : 'border-transparent'
                }`}
              >
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-pink/10 text-pink mb-3">
                  <Icon size={20} />
                </div>
                <h3 className="font-semibold">{item.category}</h3>
                <p className="text-xs text-pink font-medium mt-1">{item.count} Proyek</p>
                <p className="text-xs text-muted mt-2 line-clamp-2">{metaInfo.desc}</p>
                <span className="inline-flex mt-3 text-sm font-semibold text-pink items-center gap-1">
                  Lihat Proyek <ArrowRight size={12} />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section id="semua-proyek" className="section-pad !pt-4">
        <div className="container-site">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="font-display text-3xl font-semibold flex items-center gap-2">
              Semua Proyek <Sparkle size={16} />
            </h2>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none rounded-full border border-pink-soft bg-white px-4 py-2 pr-8 text-sm"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="title">Nama A-Z</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex flex-wrap gap-2 flex-1">
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setCategory(f)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    category === f ? 'bg-pink text-white shadow-glow' : 'bg-white text-ink border border-pink-soft hover:border-pink'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <form onSubmit={onSearch} className="relative w-full lg:w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari proyek..."
                className="w-full rounded-full border border-pink-soft bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-pink"
              />
            </form>
          </div>

          {isLoading ? (
            <CardSkeleton count={6} />
          ) : projects.length === 0 ? (
            <p className="text-center text-muted py-16">Tidak ada proyek ditemukan.</p>
          ) : (
            <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? 'opacity-70' : ''}`}>
              {projects.map((project, i) => (
                <FadeUp key={project.id} delay={i * 0.04}>
                  <article className="card-premium overflow-hidden h-full flex flex-col">
                    <div className="relative h-44 bg-gradient-to-br from-pink-soft to-gold-soft/30">
                      {project.thumbnail ? (
                        <img src={assetUrl(project.thumbnail)} alt={project.title} className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <div className="h-full grid place-items-center font-display text-pink/40 text-lg">{project.category}</div>
                      )}
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-pink"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <span className="text-xs font-semibold text-pink bg-pink-soft/70 w-fit px-3 py-1 rounded-full">
                        {project.category}
                      </span>
                      <h3 className="font-display text-xl mt-3 mb-2">{project.title}</h3>
                      <p className="text-sm text-muted line-clamp-2 mb-3 flex-1">
                        {project.shortDesc || project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {(project.techStack || []).slice(0, 4).map((t) => (
                          <span key={t} className="text-[10px] rounded-full bg-pink-light px-2 py-1 text-muted">
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <Link to={`/proyek/${project.slug}`} className="text-sm font-semibold text-pink inline-flex items-center gap-1">
                          Lihat Detail <ArrowRight size={14} />
                        </Link>
                        <Bookmark size={16} className="text-muted" />
                      </div>
                    </div>
                  </article>
                </FadeUp>
              ))}
            </div>
          )}

          {meta?.hasNext && (
            <div className="flex justify-center mt-10">
              <button type="button" onClick={() => setPage((p) => p + 1)} className="btn-outline">
                Muat Lebih Banyak <ChevronDown size={14} />
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="section-pad !pt-0">
        <div className="container-site">
          <div className="rounded-3xl bg-gradient-to-r from-pink to-pink-deep p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-white/20">✉</div>
              <p className="font-display text-xl sm:text-2xl">Punya ide proyek menarik? Mari berkolaborasi...</p>
            </div>
            <Link to="/kontak" className="btn-primary !bg-white !text-pink">
              Hubungi Saya <Send size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
