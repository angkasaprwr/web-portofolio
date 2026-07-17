import { Link } from 'react-router-dom';
import { FaLinkedinIn, FaGithub, FaInstagram, FaDribbble } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { Sparkle } from '../common/Decorations';
import { useSocialLinks } from '../../hooks/usePortfolio';

const iconMap = {
  linkedin: FaLinkedinIn,
  github: FaGithub,
  instagram: FaInstagram,
  dribbble: FaDribbble,
  email: MdEmail,
};

export default function Footer({ variant = 'simple' }) {
  const { data: socials = [] } = useSocialLinks();
  const publicSocials = socials.filter((s) =>
    ['linkedin', 'github', 'instagram', 'dribbble', 'email'].includes(s.platform)
  );

  if (variant === 'full') {
    return (
      <footer className="mt-10 bg-pink-light/80 border-t border-pink-soft/60">
        <div className="container-site px-4 sm:px-6 lg:px-8 py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-1 mb-2">
              <span className="font-display text-2xl text-pink font-semibold">Sukma.</span>
              <Sparkle size={12} />
            </div>
            <p className="text-sm font-medium text-ink mb-1">UI/UX Designer</p>
            <p className="text-sm text-muted leading-relaxed mb-4">
              Menciptakan pengalaman digital yang elegan, intuitif, dan bermakna.
            </p>
            <div className="flex gap-2">
              {publicSocials.slice(0, 4).map((s) => {
                const Icon = iconMap[s.platform] || MdEmail;
                return (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-9 w-9 place-items-center rounded-full bg-pink/10 text-pink hover:bg-pink hover:text-white transition"
                    aria-label={s.platform}
                  >
                    <Icon size={14} />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Navigasi</h4>
            <ul className="space-y-2 text-sm text-muted">
              {[
                ['/', 'Beranda'],
                ['/tentang', 'Tentang Saya'],
                ['/proyek', 'Proyek'],
                ['/keahlian', 'Keahlian'],
                ['/pengalaman', 'Pengalaman'],
                ['/kontak', 'Kontak'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-pink transition">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Lainnya</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>Blog</li>
              <li>FAQ</li>
              <li>Testimoni</li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xl mb-3">Tertarik Bekerja Sama?</h4>
            <Link to="/kontak" className="btn-outline !py-2.5 text-sm">
              Mari Berkolaborasi →
            </Link>
          </div>
        </div>
        <div className="bg-pink text-white text-center text-sm py-3 flex items-center justify-center gap-2">
          <span>© {new Date().getFullYear()} Sukma Ayu Dwi Wulandari. All rights reserved.</span>
          <span className="text-gold">♥</span>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-pink-soft/50 bg-pink-light/60">
      <div className="container-site px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-display text-xl text-pink font-semibold">Sukma.</span>
          <p className="text-xs text-muted mt-1">
            © {new Date().getFullYear()} Sukma Ayu Dwi Wulandari. All rights reserved.
          </p>
        </div>
        <div className="flex gap-2">
          {publicSocials.slice(0, 4).map((s) => {
            const Icon = iconMap[s.platform] || MdEmail;
            return (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="grid h-9 w-9 place-items-center rounded-full border border-pink/20 text-pink hover:bg-pink hover:text-white transition"
              >
                <Icon size={14} />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
