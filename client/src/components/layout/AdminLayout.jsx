import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Sparkles,
  FolderKanban,
  Briefcase,
  Award,
  FileText,
  Share2,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const nav = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/tentang', label: 'Tentang Saya', icon: User },
  { to: '/admin/skill', label: 'Skill', icon: Sparkles },
  { to: '/admin/proyek', label: 'Project', icon: FolderKanban },
  { to: '/admin/pengalaman', label: 'Pengalaman', icon: Briefcase },
  { to: '/admin/sertifikat', label: 'Sertifikat', icon: Award },
  { to: '/admin/cv', label: 'CV', icon: FileText },
  { to: '/admin/social', label: 'Social Media', icon: Share2 },
  { to: '/admin/pengaturan', label: 'Pengaturan', icon: Settings },
];

export default function AdminLayout() {
  const { admin, loading, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-pink-light">
        <div className="skeleton h-12 w-12 rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/admin/login" replace state={{ from: location }} />;

  const Sidebar = () => (
    <aside className="w-64 shrink-0 bg-white border-r border-pink-soft/50 flex flex-col h-full">
      <div className="p-5 border-b border-pink-soft/50">
        <Link to="/" className="font-display text-xl text-pink font-semibold">
          Sukma.
        </Link>
        <p className="text-xs text-muted mt-1">Admin Dashboard</p>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = item.end
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active ? 'bg-pink text-white' : 'text-ink/70 hover:bg-pink-soft/40'
              }`}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-pink-soft/50">
        <p className="text-xs text-muted mb-2 truncate">{admin?.email}</p>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-pink hover:bg-pink-soft/40"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-pink-light flex">
      <div className="hidden lg:block sticky top-0 h-screen">
        <Sidebar />
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} aria-label="Close" />
          <div className="absolute left-0 top-0 h-full shadow-xl">
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-pink-soft/50 px-4 py-3 flex items-center gap-3">
          <button type="button" className="lg:hidden p-2 rounded-lg hover:bg-pink-soft/40" onClick={() => setOpen(true)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div>
            <p className="text-sm font-semibold">Halo, {admin?.name}</p>
            <p className="text-xs text-muted">Kelola konten portfolio Anda</p>
          </div>
          <Link to="/" className="ml-auto text-xs font-medium text-pink hover:underline">
            Lihat Website →
          </Link>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
