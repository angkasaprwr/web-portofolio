/** Shared UI primitives for floating modals across portfolio pages */

export function ModalOverlay({ children, onClose, variant = 'default' }) {
  const backdrop =
    variant === 'jobdesk'
      ? 'bg-[rgba(0,0,0,0.35)] backdrop-blur-md'
      : 'bg-black/40 backdrop-blur-sm';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div className={`absolute inset-0 ${backdrop}`} onClick={onClose} aria-hidden="true" />
      {children}
    </div>
  );
}

export function ModalHeader({
  icon: Icon,
  title,
  subtitle,
  onClose,
  iconShape = 'circle',
  variant = 'default',
}) {
  const isJobdesk = variant === 'jobdesk';
  const iconWrap = isJobdesk
    ? 'rounded-full bg-[#FFF1F7] dark:bg-pink/15 text-[#FF4F93]'
    : iconShape === 'square'
      ? 'rounded-2xl bg-gradient-to-br from-pink to-pink-deep'
      : 'rounded-full bg-gradient-to-br from-pink to-pink-deep';
  const iconSize = isJobdesk ? 'h-[72px] w-[72px]' : 'h-14 w-14';
  const iconInner = isJobdesk ? 30 : 26;
  const closeSize = isJobdesk ? 'h-[58px] w-[58px]' : 'h-10 w-10';

  return (
    <div
      className={`flex items-center gap-4 sm:gap-5 shrink-0 border-b border-[#F3D4E5]/80 dark:border-pink-soft/30 bg-white dark:bg-[#2a1e26] ${
        isJobdesk ? 'px-8 py-5 min-h-[110px]' : 'px-6 sm:px-8 pt-6 pb-4 border-pink-soft/50'
      }`}
    >
      <div
        className={`grid ${iconSize} shrink-0 place-items-center ${iconWrap} ${!isJobdesk ? 'text-white shadow-glow' : 'shadow-[0_10px_25px_rgba(255,79,147,0.08)]'}`}
      >
        <Icon size={iconInner} />
      </div>
      <div className="flex-1 min-w-0">
        <h2
          className={`font-display font-bold text-ink flex items-center gap-2 ${
            isJobdesk ? 'text-[28px] sm:text-[40px] leading-tight' : 'text-2xl sm:text-[1.65rem] font-semibold'
          }`}
        >
          {title}
        </h2>
        <p className={`text-[#7C7C7C] dark:text-[#c4b8be] truncate ${isJobdesk ? 'text-sm sm:text-base mt-1' : 'text-sm'}`}>
          {subtitle}
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className={`modal-btn-close grid ${closeSize} shrink-0 place-items-center rounded-full border border-[#F3D4E5] dark:border-pink-soft/40 bg-white dark:bg-[#352630] text-muted hover:text-ink hover:bg-[#FFF1F7] dark:hover:bg-pink/10 transition shadow-[0_10px_25px_rgba(0,0,0,0.06)]`}
        aria-label="Tutup"
      >
        <span className="sr-only">Tutup</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function SectionTitle({ children, size = 'default' }) {
  return (
    <h3
      className={`font-display text-[#FF4F93] dark:text-pink font-semibold flex items-center gap-2 ${
        size === 'large' ? 'text-lg sm:text-xl' : 'text-[15px]'
      }`}
    >
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

/** Soft-pink skill chip for jobdesk modal */
export function ModalSkillChip({ children, onRemove }) {
  return (
    <span className="modal-skill-chip">
      {children}
      {onRemove && (
        <button type="button" onClick={onRemove} className="modal-skill-chip-remove" aria-label="Hapus">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}

/** Light pink info alert box */
export function ModalInfoAlert({ children }) {
  return (
    <div className="modal-info-alert" role="note">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-[#FF4F93]">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
      <span>{children}</span>
    </div>
  );
}

const inputBase = {
  default: 'rounded-xl border border-pink-soft/70 py-2.5 text-sm',
  jobdesk: 'rounded-2xl border border-[#ECECEC] dark:border-[#5a4f56] h-14 text-base',
};

export function FormField({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
  disabled,
  hint,
  variant = 'default',
  className = '',
}) {
  const base = inputBase[variant] || inputBase.default;
  return (
    <div className={className}>
      {label && (
        <label className="text-xs font-semibold text-[#7C7C7C] dark:text-[#c4b8be] mb-1.5 block">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={variant === 'jobdesk' ? 16 : 14}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF4F93]/70 pointer-events-none"
          />
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || ''}
          required={required}
          disabled={disabled}
          className={`modal-input w-full bg-white dark:bg-[#352630] text-ink ${base} ${Icon ? 'pl-11' : 'pl-4'} pr-4 outline-none focus:border-[#FF4F93] focus:shadow-[0_0_0_3px_rgba(255,79,147,0.15)] disabled:opacity-50 transition`}
        />
      </div>
      {hint && <p className="mt-1.5 text-[11px] text-[#7C7C7C] dark:text-[#c4b8be]">{hint}</p>}
    </div>
  );
}

export function FormTextarea({ label, icon: Icon, value, onChange, placeholder, rows = 4, variant = 'default' }) {
  const isJobdesk = variant === 'jobdesk';
  return (
    <div>
      {label && (
        <label className="text-xs font-semibold text-[#7C7C7C] dark:text-[#c4b8be] mb-1.5 block">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <Icon size={16} className="absolute left-4 top-4 text-[#FF4F93]/70 pointer-events-none" />
        )}
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || ''}
          className={`modal-input w-full bg-white dark:bg-[#352630] text-ink resize-none outline-none focus:border-[#FF4F93] focus:shadow-[0_0_0_3px_rgba(255,79,147,0.15)] transition ${
            isJobdesk
              ? 'rounded-2xl border border-[#ECECEC] dark:border-[#5a4f56] min-h-[130px] text-base py-3'
              : 'rounded-xl border border-pink-soft/70 py-2.5 text-sm'
          } ${Icon ? 'pl-11' : 'pl-4'} pr-4`}
        />
      </div>
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
export function ModalActions({ onCancel, onDelete, saving, showDelete, variant = 'default' }) {
  const saveClass = variant === 'jobdesk' ? 'modal-btn-save-lg' : 'modal-btn-save';
  return (
    <div className="modal-actions flex flex-wrap items-center gap-3 pt-5 border-t border-[#F3D4E5]/60 dark:border-pink-soft/30">
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
      <button type="submit" disabled={saving} className={saveClass}>
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
