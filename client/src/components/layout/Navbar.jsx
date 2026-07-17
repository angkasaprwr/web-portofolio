import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCv } from '../../hooks/usePortfolio';
import { assetUrl } from '../../lib/api';
import { cvApi } from '../../services/apiServices';
import { Sparkle } from '../common/Decorations';
import toast from 'react-hot-toast';

const links = [
  { to: '/', label: 'Beranda' },
  { to: '/tentang', label: 'Tentang Saya' },
  { to: '/proyek', label: 'Proyek' },
  { to: '/keahlian', label: 'Keahlian' },
  { to: '/pengalaman', label: 'Pengalaman' },
  { to: '/kontak', label: 'Kontak' },
];

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { data: cv } = useCv();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const handleDownloadCv = async () => {
    if (!cv?.fileUrl) {
      toast.error('CV belum tersedia');
      return;
    }
    try {
      await cvApi.trackDownload(cv.id);
    } catch {
      /* ignore */
    }
    window.open(assetUrl(cv.fileUrl), '_blank');
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-3 sm:px-6 pt-3 sm:pt-4">
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`mx-auto max-w-6xl rounded-full px-4 sm:px-6 py-3 flex items-center justify-between gap-3 transition-all duration-300 ${
          scrolled ? 'glass-strong shadow-soft' : 'glass shadow-card'
        }`}
      >
        <Link to="/" className="flex items-center gap-1 shrink-0">
          <span className="font-display text-xl sm:text-2xl font-semibold text-pink">Sukma.</span>
          <Sparkle size={12} />
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `relative px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-pink' : 'text-ink/70 hover:text-pink'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-pink"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadCv}
            className="hidden sm:inline-flex btn-primary !py-2 !px-4 text-xs"
          >
            <Download size={14} />
            Unduh CV
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/70 text-gold hover:bg-white transition"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            type="button"
            className="lg:hidden grid h-9 w-9 place-items-center rounded-full bg-white/70 text-ink"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="lg:hidden mx-auto mt-2 max-w-6xl glass-strong rounded-3xl p-4 shadow-soft"
          >
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `rounded-2xl px-4 py-3 text-sm font-medium ${
                      isActive ? 'bg-pink text-white' : 'text-ink hover:bg-pink-soft/50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <button type="button" onClick={handleDownloadCv} className="btn-primary mt-2 w-full">
                <Download size={14} />
                Unduh CV
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
