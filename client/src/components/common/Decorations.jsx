import { motion } from 'framer-motion';

export const Sparkle = ({ className = '', size = 16, color = '#D4AF37' }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    animate={{ rotate: [0, 20, 0], scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
  >
    <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
  </motion.svg>
);

export const Leaf = ({ className = '', color = '#F857A6' }) => (
  <motion.svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    className={className}
    animate={{ y: [0, -8, 0], rotate: [0, 8, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
  >
    <path
      d="M8 32C8 32 12 8 32 8C32 28 16 36 8 32Z"
      fill={color}
      fillOpacity="0.35"
      stroke={color}
      strokeWidth="1.5"
    />
  </motion.svg>
);

export const Blob = ({ className = '' }) => (
  <div
    className={`pointer-events-none absolute rounded-full blur-3xl opacity-60 ${className}`}
    aria-hidden
  />
);

export const WaveLines = ({ className = '' }) => (
  <svg
    className={`pointer-events-none absolute inset-0 w-full h-full opacity-40 ${className}`}
    viewBox="0 0 1200 600"
    fill="none"
    preserveAspectRatio="none"
    aria-hidden
  >
    <path
      d="M0 300C200 200 400 400 600 300C800 200 1000 350 1200 280"
      stroke="#D4AF37"
      strokeWidth="1.5"
      strokeOpacity="0.4"
    />
    <path
      d="M0 350C250 280 450 420 700 340C900 280 1050 400 1200 330"
      stroke="#F857A6"
      strokeWidth="1.5"
      strokeOpacity="0.25"
    />
  </svg>
);

export const PortraitPlaceholder = ({ name = 'Sukma', className = '', size = 320 }) => (
  <div
    className={`relative mx-auto ${className}`}
    style={{ width: size, height: size, maxWidth: '100%' }}
  >
    <div className="absolute inset-0 rounded-full border-2 border-gold/50 scale-105" />
    <div className="absolute inset-0 rounded-full border border-gold/30 scale-110" />
    <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-pink-soft/80 to-gold-soft/40 blur-sm" />
    <div className="relative h-full w-full overflow-hidden rounded-full bg-gradient-to-br from-pink-soft via-white to-pink shadow-soft">
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <defs>
          <linearGradient id="hijab" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F857A6" />
            <stop offset="100%" stopColor="#FFD6E8" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="100" fill="#FFF3F8" />
        <ellipse cx="100" cy="85" rx="38" ry="42" fill="#F5D0C5" />
        <path d="M40 70 Q100 10 160 70 Q155 160 100 175 Q45 160 40 70Z" fill="url(#hijab)" opacity="0.9" />
        <ellipse cx="100" cy="95" rx="28" ry="32" fill="#F5D0C5" />
        <path d="M72 88 Q100 100 128 88" stroke="#2C2C2C" strokeWidth="1.5" fill="none" opacity="0.3" />
        <circle cx="88" cy="90" r="2.5" fill="#2C2C2C" />
        <circle cx="112" cy="90" r="2.5" fill="#2C2C2C" />
        <path d="M92 108 Q100 114 108 108" stroke="#E07A7A" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
    <Sparkle className="absolute top-4 right-6" size={18} />
    <Sparkle className="absolute bottom-10 left-2" size={12} />
    <Leaf className="absolute -left-2 top-16" />
    <Leaf className="absolute -right-4 bottom-20 rotate-180" color="#D4AF37" />
    <span
      className="absolute -bottom-2 right-4 font-display text-3xl italic text-pink"
      style={{ fontFamily: 'Playfair Display, serif' }}
    >
      {name}
    </span>
  </div>
);

export default { Sparkle, Leaf, Blob, WaveLines, PortraitPlaceholder };
