import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  Building2,
  Users,
  FolderKanban,
  Award,
  MapPin,
  Bookmark,
  ChevronDown,
  Send,
  Search,
  Pencil,
} from 'lucide-react';
import SEO from '../../components/common/SEO';
import { FadeUp, ScaleIn } from '../../components/common/Motion';
import { Sparkle, Blob } from '../../components/common/Decorations';
import { CardSkeleton, PageSkeleton } from '../../components/common/Skeleton';
import { useAbout, useExperiences, useExperienceCategories } from '../../hooks/usePortfolio';
import { assetUrl } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import ExperienceCategoryModal from '../../components/experience/ExperienceCategoryModal';

const categoryIcons = {
  Magang: Briefcase,
  Jobdesk: Building2,
  Organisasi: Users,
  'Proyek Kelompok': FolderKanban,
  'Sertifikat & Kursus': Award,
};

const formatDate = (date) => {
  if (!date) return 'Sekarang';
  return new Date(date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
};

export default function ExperiencePage() {
  const { isAuthenticated } = useAuth();
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || 'Semua';
  const type = params.get('type') || '';
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [expModalCategory, setExpModalCategory] = useState(null);

  const openCategoryModal = (cat, expType) => {
    setPage(1);
    const next = new URLSearchParams(params);
    if (expType) next.set('type', expType);
    else next.delete('type');
    if (cat && cat !== 'Semua') next.set('category', cat);
    else next.delete('category');
    setParams(next);
    setExpModalCategory(cat);
  };

  const query = useMemo(
    () => ({
      category: category === 'Semua' ? undefined : category,
      type: type || undefined,
      search: search || undefined,
      sort,
      page,
      limit: 6,
    }),
    [category, type, search, sort, page]
  );

  const { data: about } = useAbout();
  const { data: catStats, isLoading: catLoading } = useExperienceCategories();
  const { data: expRes, isLoading } = useExperiences(query);

  const experiences = expRes?.data || [];
  const meta = expRes?.meta;

  const formal = (catStats || []).filter((c) => c.type === 'Formal');
  const informal = (catStats || []).filter((c) => c.type === 'Informal');

  const setFilter = (key, value) => {
    setPage(1);
    const next = new URLSearchParams(params);
    if (!value || value === 'Semua') next.delete(key);
    else next.set(key, value);
    setParams(next);
  };

  const chips = ['Semua', 'Magang', 'Jobdesk', 'Organisasi', 'Proyek Kelompok', 'Sertifikat & Kursus'];

  if (catLoading && !about) return <PageSkeleton />;

  return (
    <>
      <SEO title="Pengalaman" description="Setiap pengalaman membentuk saya hari ini." />

      <section className="relative overflow-hidden section-pad !pt-6">
        <Blob className="bg-pink-soft w-80 h-80 -top-10 right-0" />
        <div className="container-site grid gap-10 lg:grid-cols-2 items-center">
          <FadeUp>
            <p className="label-gold mb-3 flex items-center gap-2">
              PENGALAMAN SAYA <Sparkle size={12} />
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-4 leading-tight">
              Setiap Pengalaman, Membentuk Saya Hari Ini.
            </h1>
            <p className="text-muted leading-relaxed mb-6 max-w-lg">
              Dari magang hingga organisasi, setiap langkah menambah wawasan, keterampilan, dan
              kepercayaan diri dalam berkarya.
            </p>
            <a href="#pengalaman-terbaru" className="text-pink font-semibold inline-flex items-center gap-1">
              Lihat Semua Pengalaman <ArrowRight size={14} />
            </a>
          </FadeUp>
          <ScaleIn>
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-pink-soft to-white shadow-soft">
              {about?.heroPhoto || about?.photo ? (
                <img
                  src={assetUrl(about.heroPhoto || about.photo)}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full grid place-items-center p-8 text-center">
                  <div>
                    <p className="font-display text-3xl text-pink mb-2">Grow Through</p>
                    <p className="font-display text-2xl text-ink">Every Experience</p>
                  </div>
                </div>
              )}
            </div>
          </ScaleIn>
        </div>
      </section>

      <section className="section-pad !pt-4">
        <div className="container-site">
          <FadeUp>
            <h2 className="font-display text-2xl text-center mb-8 flex items-center justify-center gap-3">
              <Sparkle size={14} /> Kategori Pengalaman <Sparkle size={14} />
            </h2>
          </FadeUp>

          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-pink mb-3">Formal</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
              {formal.map((item) => {
                const Icon = categoryIcons[item.category] || Briefcase;
                return (
                  <button
                    key={item.category}
                    type="button"
                    onClick={() => openCategoryModal(item.category, 'Formal')}
                    className="card-premium p-5 text-left border border-pink-soft/60 relative group"
                  >
                    {isAuthenticated && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          openCategoryModal(item.category, 'Formal');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.stopPropagation();
                            openCategoryModal(item.category, 'Formal');
                          }
                        }}
                        className="absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-lg bg-pink/10 text-pink opacity-0 group-hover:opacity-100 transition"
                        aria-label={`Kelola ${item.category}`}
                      >
                        <Pencil size={14} />
                      </span>
                    )}
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-pink/10 text-pink mb-3">
                      <Icon size={18} />
                    </div>
                    <h3 className="font-semibold">{item.category}</h3>
                    <p className="text-xs text-pink mt-1">{item.count} Pengalaman</p>
                    <p className="text-xs text-muted mt-2">Pengalaman formal di bidang {item.category.toLowerCase()}</p>
                    <span className="inline-flex mt-3 text-sm font-semibold text-pink gap-1 items-center">
                      Lihat Selengkapnya <ArrowRight size={12} />
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="text-xs font-semibold uppercase tracking-wider text-pink mb-3">Informal</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {informal.map((item) => {
                const Icon = categoryIcons[item.category] || Users;
                return (
                  <button
                    key={item.category}
                    type="button"
                    onClick={() => openCategoryModal(item.category, 'Informal')}
                    className="card-premium p-5 text-left border border-pink-soft/60 relative group"
                  >
                    {isAuthenticated && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          openCategoryModal(item.category, 'Informal');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.stopPropagation();
                            openCategoryModal(item.category, 'Informal');
                          }
                        }}
                        className="absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-lg bg-pink/10 text-pink opacity-0 group-hover:opacity-100 transition"
                        aria-label={`Kelola ${item.category}`}
                      >
                        <Pencil size={14} />
                      </span>
                    )}
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gold/10 text-gold mb-3">
                      <Icon size={18} />
                    </div>
                    <h3 className="font-semibold">{item.category}</h3>
                    <p className="text-xs text-pink mt-1">{item.count} Pengalaman</p>
                    <p className="text-xs text-muted mt-2">Pengalaman informal & pengembangan diri</p>
                    <span className="inline-flex mt-3 text-sm font-semibold text-pink gap-1 items-center">
                      Lihat Selengkapnya <ArrowRight size={12} />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="pengalaman-terbaru" className="section-pad !pt-4 bg-white/40">
        <div className="container-site">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="font-display text-3xl font-semibold flex items-center gap-2">
              Pengalaman Terbaru <Sparkle size={16} />
            </h2>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none rounded-full border border-pink-soft bg-white px-4 py-2 pr-8 text-sm"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex flex-wrap gap-2 flex-1">
              {chips.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setFilter('type', '');
                    setFilter('category', c);
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    category === c ? 'bg-pink text-white' : 'bg-white border border-pink-soft text-ink hover:border-pink'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="relative w-full lg:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Cari pengalaman..."
                className="w-full rounded-full border border-pink-soft bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-pink"
              />
            </div>
          </div>

          {isLoading ? (
            <CardSkeleton count={4} />
          ) : experiences.length === 0 ? (
            <p className="text-center text-muted py-16">Tidak ada pengalaman ditemukan.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {experiences.map((exp, i) => (
                <FadeUp key={exp.id} delay={i * 0.05}>
                  <article className="card-premium p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="text-xs font-semibold text-pink bg-pink-soft/70 px-3 py-1 rounded-full">
                        {exp.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setExpModalCategory(exp.category)}
                          className="text-xs font-semibold text-pink hover:underline"
                        >
                          Lihat Selengkapnya
                        </button>
                        <span className="text-xs text-pink font-medium">
                          {formatDate(exp.startDate)} - {exp.isCurrent ? 'Sekarang' : formatDate(exp.endDate)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-pink/10 text-pink font-semibold">
                        {exp.category === 'Jobdesk' || exp.category === 'Proyek Kelompok' ? '</>' : '✦'}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-xl mb-1">{exp.title}</h3>
                        <p className="text-sm text-muted flex items-center gap-1 mb-3">
                          <MapPin size={12} /> {exp.company}
                          {exp.location ? ` · ${exp.location}` : ''}
                        </p>
                        <p className="text-sm text-muted line-clamp-3 mb-4">
                          {exp.shortDesc || exp.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {(exp.skills || []).slice(0, 4).map((s) => (
                            <span key={s} className="text-[10px] rounded-full bg-pink-light px-2 py-1 text-muted">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <button
                        type="button"
                        onClick={() => setExpModalCategory(exp.category)}
                        className="text-sm font-semibold text-pink inline-flex items-center gap-1 hover:underline"
                      >
                        Lihat Selengkapnya <ArrowRight size={14} />
                      </button>
                      <Bookmark size={16} className="text-muted" />
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
          <div className="rounded-3xl bg-gradient-to-r from-pink to-pink-deep p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-3xl">🏆</span>
              <p className="font-display text-xl">Setiap langkah adalah investasi untuk masa depan.</p>
            </div>
            <Link to="/kontak" className="btn-primary !bg-white !text-pink">
              Mari Berkolaborasi <Send size={14} />
            </Link>
          </div>
        </div>
      </section>

      <ExperienceCategoryModal
        open={!!expModalCategory}
        category={expModalCategory || 'Jobdesk'}
        onClose={() => setExpModalCategory(null)}
      />
    </>
  );
}
