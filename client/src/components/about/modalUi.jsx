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
        className="modal-btn-close grid h-10 w-10 shrink-0 place-items-center rounded-full border border-pink-soft/60 bg-white dark:bg-[#352630] text-muted hover:text-ink hover:bg-pink-soft/30 transition"
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

/** Gold-outline Preview pill — mockup */
export function PreviewButton({ onClick }) {
  return (
    <button type="button" onClick={onClick} className="modal-btn-preview">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      Preview
    </button>
  );
}

/** Pink-outline add pill in list header */
export function ModalAddButton({ onClick, children, className = '' }) {
  return (
    <button type="button" onClick={onClick} className={`modal-btn-add ${className}`.trim()}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M12 5v14M5 12h14" />
      </svg>
      {children}
    </button>
  );
}

/** Pink square edit button on list cards */
export function ModalEditButton({ onClick, label = 'Edit' }) {
  return (
    <button type="button" onClick={onClick} className="modal-btn-edit" aria-label={label}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    </button>
  );
}

/** Gray tool/tag chip with remove */
export function ModalTag({ children, onRemove }) {
  return (
    <span className="modal-tag">
      {children}
      {onRemove && (
        <button type="button" onClick={onRemove} className="modal-tag-remove" aria-label="Hapus">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}

export function FormField({ label, icon: Icon, value, onChange, placeholder, type = 'text', required, disabled, hint }) {
  return (
    <div>
      {label && <label className="text-xs font-semibold text-muted mb-1.5 block">{label}</label>}
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

/** Footer actions: Batal | Hapus | Simpan Perubahan — shared across all floating cards */
export function ModalActions({ onCancel, onDelete, saving, showDelete }) {
  return (
    <div className="modal-actions flex flex-wrap items-center gap-3 pt-4 border-t border-pink-soft/40">
      <button type="button" onClick={onCancel} className="modal-btn-cancel">
        Batal
      </button>
      <div className="flex-1" />
      {showDelete && (
        <button type="button" onClick={onDelete} className="modal-btn-delete">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
          Hapus
        </button>
      )}
      <button type="submit" disabled={saving} className="modal-btn-save">
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
