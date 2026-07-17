import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';
import { PageSkeleton } from './components/common/Skeleton';

const HomePage = lazy(() => import('./pages/public/HomePage'));
const AboutPage = lazy(() => import('./pages/public/AboutPage'));
const ProjectsPage = lazy(() => import('./pages/public/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./pages/public/ProjectDetailPage'));
const SkillsPage = lazy(() => import('./pages/public/SkillsPage'));
const ExperiencePage = lazy(() => import('./pages/public/ExperiencePage'));
const ExperienceDetailPage = lazy(() => import('./pages/public/ExperienceDetailPage'));
const ContactPage = lazy(() => import('./pages/public/ContactPage'));

const AdminLoginPage = lazy(() => import('./pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const AdminAboutPage = lazy(() => import('./pages/admin/AboutPage'));
const AdminSkillsPage = lazy(() => import('./pages/admin/SkillsPage'));
const AdminProjectsPage = lazy(() => import('./pages/admin/ProjectsPage'));
const AdminExperiencesPage = lazy(() => import('./pages/admin/ExperiencesPage'));
const AdminCertificatesPage = lazy(() => import('./pages/admin/CertificatesPage'));
const AdminCvPage = lazy(() => import('./pages/admin/CvPage'));
const AdminSocialPage = lazy(() => import('./pages/admin/SocialPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/SettingsPage'));

function NotFound() {
  return (
    <div className="min-h-[60vh] grid place-items-center text-center px-4">
      <div>
        <h1 className="font-display text-6xl text-pink mb-2">404</h1>
        <p className="text-muted mb-6">Halaman tidak ditemukan</p>
        <a href="/" className="btn-primary">
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="tentang" element={<AboutPage />} />
          <Route path="proyek" element={<ProjectsPage />} />
          <Route path="proyek/:slug" element={<ProjectDetailPage />} />
          <Route path="keahlian" element={<SkillsPage />} />
          <Route path="pengalaman" element={<ExperiencePage />} />
          <Route path="pengalaman/:id" element={<ExperienceDetailPage />} />
          <Route path="kontak" element={<ContactPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="tentang" element={<AdminAboutPage />} />
          <Route path="skill" element={<AdminSkillsPage />} />
          <Route path="proyek" element={<AdminProjectsPage />} />
          <Route path="pengalaman" element={<AdminExperiencesPage />} />
          <Route path="sertifikat" element={<AdminCertificatesPage />} />
          <Route path="cv" element={<AdminCvPage />} />
          <Route path="social" element={<AdminSocialPage />} />
          <Route path="pengaturan" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
