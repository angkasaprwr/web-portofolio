import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, BookOpen, Target } from 'lucide-react';
import {
  SiFigma,
  SiReact,
  SiTailwindcss,
  SiJavascript,
  SiNodedotjs,
  SiExpress,
  SiPostgresql,
  SiPrisma,
  SiGithub,
  SiPython,
} from 'react-icons/si';
import {
  TbBrandAdobeXd,
  TbBrandAdobePhotoshop,
  TbBrandAdobeIllustrator,
} from 'react-icons/tb';
import { FaFileExcel, FaChartPie, FaLaptopCode, FaPalette, FaChartBar } from 'react-icons/fa';
import SEO from '../../components/common/SEO';
import { FadeUp, ScaleIn } from '../../components/common/Motion';
import { PortraitPlaceholder, Sparkle, Blob } from '../../components/common/Decorations';
import { PageSkeleton } from '../../components/common/Skeleton';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import { useAbout, useSkills, useCertificates } from '../../hooks/usePortfolio';
import { assetUrl } from '../../lib/api';
import SkillModal from '../../components/about/SkillModal';

const coreCategories = [
  {
    key: 'UI Design',
    title: 'UI Design',
    icon: FaPalette,
    items: ['User Interface Design', 'Wireframing & Prototyping', 'Design System', 'Responsive Design'],
  },
  {
    key: 'Website Development',
    title: 'Website Development',
    icon: FaLaptopCode,
    items: ['HTML, CSS, JavaScript', 'React.js', 'Tailwind CSS', 'Responsive & Cross Browser'],
  },
  {
    key: 'Data Analysis',
    title: 'Data Analysis',
    icon: FaChartPie,
    items: ['Data Cleaning', 'Exploratory Data Analysis', 'Data Visualization', 'Insight & Reporting'],
  },
];

const toolGroups = [
  {
    title: 'Desain',
    tools: [
      { name: 'Figma', icon: SiFigma, color: '#F24E1E' },
      { name: 'Adobe XD', icon: TbBrandAdobeXd, color: '#FF61F6' },
      { name: 'Photoshop', icon: TbBrandAdobePhotoshop, color: '#31A8FF' },
      { name: 'Illustrator', icon: TbBrandAdobeIllustrator, color: '#FF9A00' },
    ],
  },
  {
    title: 'Pengembangan',
    tools: [
      { name: 'React', icon: SiReact, color: '#61DAFB' },
      { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
      { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
      { name: 'Git & GitHub', icon: SiGithub, color: '#181717' },
      { name: 'NodeJS', icon: SiNodedotjs, color: '#339933' },
      { name: 'Express', icon: SiExpress, color: '#000000' },
      { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
      { name: 'Prisma', icon: SiPrisma, color: '#2D3748' },
    ],
  },
  {
    title: 'Analisis Data',
    tools: [
      { name: 'Excel', icon: FaFileExcel, color: '#217346' },
      { name: 'Python', icon: SiPython, color: '#3776AB' },
      { name: 'Tableau', icon: FaChartBar, color: '#E97627' },
      { name: 'Power BI', icon: FaChartPie, color: '#F2C811' },
    ],
  },
];

export default function SkillsPage() {
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const { data: about, isLoading } = useAbout();
  const { data: skillsRes } = useSkills({});
  const { data: certsRes } = useCertificates();

  if (isLoading) return <PageSkeleton />;

  const skills = skillsRes?.data || [];
  const proficiency = skills.filter((s) => s.category === 'Proficiency');
  const certCount = certsRes?.data?.length || 50;

  return (
    <>
      <SEO title="Keahlian" description="Keahlian UI Design, Website Development, dan Data Analysis." />

      <section className="relative overflow-hidden section-pad !pt-6">
        <Blob className="bg-gold-soft/50 w-64 h-64 top-10 right-0" />
        <div className="container-site grid gap-10 lg:grid-cols-2 items-center">
          <FadeUp>
            <p className="label-gold mb-3 flex items-center gap-2">
              <Sparkle size={12} /> KEAHLIAN SAYA
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-4 leading-tight">
              Keahlian yang Saya Miliki, Nilai yang Saya Ciptakan.
            </h1>
            <p className="text-muted leading-relaxed mb-6 max-w-lg">
              Menggabungkan kreativitas desain, teknologi web modern, dan analisis data untuk
              menciptakan solusi yang holistik dan berdampak.
            </p>
            <Link to="/proyek" className="btn-outline">
              Lihat Proyek Saya <ArrowRight size={14} />
            </Link>
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

      <section className="section-pad !pt-4">
        <div className="container-site">
          <FadeUp>
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl font-semibold flex items-center justify-center gap-3">
                <Sparkle size={16} /> Keahlian Inti Saya <Sparkle size={16} />
              </h2>
              <p className="text-muted text-sm mt-2">Fondasi yang membentuk setiap karya saya</p>
              <span className="inline-block mt-2 text-gold">♥</span>
            </div>
          </FadeUp>

          <div className="grid gap-6 md:grid-cols-3">
            {coreCategories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <FadeUp key={cat.key} delay={i * 0.08}>
                  <div className="card-premium p-6 h-full flex flex-col">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pink/10 text-pink mb-4">
                      <Icon size={22} />
                    </div>
                    <h3 className="font-display text-xl mb-4">{cat.title}</h3>
                    <ul className="space-y-3 flex-1">
                      {cat.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-muted">
                          <Check size={14} className="text-pink mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() => setSkillModalOpen(true)}
                      className="mt-5 text-sm font-semibold text-pink text-left hover:underline"
                    >
                      Selengkapnya →
                    </button>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-pad !pt-4 bg-white/40">
        <div className="container-site grid gap-10 lg:grid-cols-2">
          <FadeUp>
            <h2 className="font-display text-2xl mb-6">Tool yang Saya Kuasai</h2>
            <div className="space-y-6">
              {toolGroups.map((group) => (
                <div key={group.title}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-pink mb-3">{group.title}</p>
                  <div className="flex flex-wrap gap-4">
                    {group.tools.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <div key={tool.name} className="flex flex-col items-center gap-1.5 w-16">
                          <div className="grid h-12 w-12 place-items-center rounded-full bg-white shadow-card border border-pink-soft/40">
                            <Icon size={22} color={tool.color} />
                          </div>
                          <span className="text-[10px] text-center text-muted leading-tight">{tool.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h2 className="font-display text-2xl mb-6">Kemampuan Saya</h2>
            <div className="space-y-5">
              {(proficiency.length
                ? proficiency
                : [
                    { id: 1, name: 'UI/UX Design', level: 95 },
                    { id: 2, name: 'Frontend Development', level: 85 },
                    { id: 3, name: 'Problem Solving', level: 90 },
                    { id: 4, name: 'Data Analysis', level: 78 },
                  ]
              ).map((skill) => (
                <div key={skill.id}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-pink font-semibold">{skill.level}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-pink-soft overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-pink to-gold transition-all duration-1000"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="section-pad !pt-6">
        <div className="container-site">
          <div className="rounded-3xl bg-gradient-to-r from-pink via-pink-deep to-gold p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-start gap-4 max-w-md">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-white/20 shrink-0">
                <Sparkle size={24} color="#fff" />
              </div>
              <p className="font-display text-xl leading-snug">
                Setiap skill dipelajari dengan dedikasi untuk menciptakan karya terbaik.
              </p>
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <BookOpen className="mx-auto mb-2" size={20} />
                <p className="font-display text-2xl font-semibold">
                  <AnimatedCounter value={`${certCount}+`} />
                </p>
                <p className="text-xs text-white/80">Sertifikat & Kursus</p>
              </div>
              <div className="text-center">
                <Target className="mx-auto mb-2" size={20} />
                <p className="font-display text-2xl font-semibold">100%</p>
                <p className="text-xs text-white/80">Dedikasi untuk Hasil Terbaik</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SkillModal open={skillModalOpen} onClose={() => setSkillModalOpen(false)} category="Proficiency" />
    </>
  );
}
