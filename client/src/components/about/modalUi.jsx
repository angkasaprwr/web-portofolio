/** Shared UI primitives for About-page floating modals (Pendidikan & Keahlian) */

export function ModalOverlay({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      {children}
    </div>
  );
}

export function ModalHeader({ icon: Icon, title, subtitle, onClose, iconShape = 'circle' }) {
  const iconWrap =
    iconShape === 'square'
      ? 'rounded-2xl bg-gradient-to-br from-pink to-pink-deep'
      : 'rounded-full bg-gradient-to-br from-pink to-pink-deep';
  return (
    <div className="flex items-center gap-4 px-6 sm:px-8 pt-6 pb-4 border-b border-pink-soft/50 dark:border-pink-soft/30">
      <div className={`grid h-14 w-14 shrink-0 place-items-center ${iconWrap} text-white shadow-glow`}>
        <Icon size={26} />
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="font-display text-2xl sm:text-[1.65rem] font-semibold text-ink flex items-center gap-2">
          {title}
        </h2>
        <p className="text-sm text-muted truncate">{subtitle}</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-pink-soft/60 bg-white dark:bg-[#352630] text-muted hover:text-ink hover:bg-pink-soft/30 transition"
        aria-label="Tutup"
      >
        <span className="sr-only">Tutup</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function SectionTitle({ children }) {
  return (
    <h3 className="font-display text-pink font-semibold flex items-center gap-2 text-[15px]">
      {children}
    </h3>
  );
}

export function PreviewButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-gold bg-white dark:bg-[#352630] px-3.5 py-1.5 text-xs font-semibold text-gold hover:bg-gold-soft/40 transition"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      Preview
    </button>
  );
}

export function FormField({ label, icon: Icon, value, onChange, placeholder, type = 'text', required, disabled, hint }) {
  return (
    <div>
      {label && (
        <label className="text-xs font-semibold text-muted mb-1.5 block">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-pink/70 pointer-events-none" />
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || ''}
          required={required}
          disabled={disabled}
          className={`modal-input w-full rounded-xl border border-pink-soft/70 bg-white dark:bg-[#352630] py-2.5 text-sm text-ink ${Icon ? 'pl-9' : 'pl-3'} pr-4 outline-none focus:border-pink disabled:opacity-50`}
        />
      </div>
      {hint && <p className="mt-1 text-[11px] text-muted">{hint}</p>}
    </div>
  );
}

export function FormSelect({ label, icon: Icon, value, onChange, options }) {
  return (
    <div>
      {label && <label className="text-xs font-semibold text-muted mb-1.5 block">{label}</label>}
      <div className="relative">
        {Icon && (
          <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-pink/70 pointer-events-none z-10" />
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`modal-input w-full rounded-xl border border-pink-soft/70 bg-white dark:bg-[#352630] py-2.5 text-sm text-ink ${Icon ? 'pl-9' : 'pl-3'} pr-8 outline-none focus:border-pink appearance-none`}
        >
          {options.map((o) => (
            <option key={o.value ?? o} value={o.value ?? o}>
              {o.label ?? o}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}

export function ModalActions({ onCancel, onDelete, saving, showDelete }) {
  return (
    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-pink-soft/40">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted hover:text-ink hover:bg-pink-soft/20 transition"
      >
        Batal
      </button>
      <div className="flex-1" />
      {showDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center gap-1.5 rounded-xl border-2 border-red-400/70 bg-white dark:bg-[#352630] px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
          Hapus
        </button>
      )}
      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-pink to-pink-deep px-5 py-2.5 text-sm font-semibold text-white shadow-glow hover:shadow-[0_0_30px_rgba(248,87,166,0.45)] transition disabled:opacity-60"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M20 6L9 17l-5-5" />
        </svg>
        {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
      </button>
    </div>
  );
}

export function InfoRow({ label, value }) {
  return (
    <div className="rounded-xl bg-white/70 dark:bg-[#352630] px-3 py-2 border border-pink-soft/30">
      <p className="text-[10px] font-semibold text-muted uppercase tracking-wide">{label}</p>
      <p className="font-medium text-sm text-ink">{value}</p>
    </div>
  );
}
