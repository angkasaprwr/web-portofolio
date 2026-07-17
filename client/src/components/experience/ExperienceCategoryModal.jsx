import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Building2,
  Calendar,
  MapPin,
  FileText,
  ListOrdered,
  Upload,
  File,
  Check,
  Eye,
} from 'lucide-react';
import { useExperiences } from '../../hooks/usePortfolio';
import { experiencesApi } from '../../services/apiServices';
import { Sparkle } from '../common/Decorations';
import { getCategoryConfig } from './experienceCategoryConfig';
import {
  ModalOverlay,
  ModalHeader,
  SectionTitle,
  PreviewButton,
  ModalAddButton,
  ModalEditButton,
  ModalSkillChip,
  ModalInfoAlert,
  FormField,
  FormTextarea,
  ModalActions,
  InfoRow,
} from '../about/modalUi';

const emptyForm = {
  title: '',
  company: '',
  location: '',
  description: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  order: 0,
  skills: [],
  responsibilities: [''],
};

function formatPeriod(start, end, isCurrent) {
  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }) : '';
  const startStr = fmt(start);
  const endStr = isCurrent ? 'Sekarang' : fmt(end);
  return startStr ? `${startStr} - ${endStr}` : '—';
}

function toDateInput(val) {
  if (!val) return '';
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

function expToForm(exp) {
  const skills = Array.isArray(exp?.skills) ? exp.skills : [];
  const responsibilities =
    Array.isArray(exp?.responsibilities) && exp.responsibilities.length ? exp.responsibilities : [''];
  return {
    title: exp?.title || '',
    company: exp?.company || '',
    location: exp?.location || '',
    description: exp?.description || '',
    startDate: toDateInput(exp?.startDate),
    endDate: toDateInput(exp?.endDate),
    isCurrent: !!exp?.isCurrent,
    order: exp?.order || 0,
    skills,
    responsibilities,
  };
}

function fileNameFromUrl(url) {
  if (!url) return '';
  return url.split('/').pop() || 'dokumen.pdf';
}

export default function ExperienceCategoryModal({ open, onClose, category = 'Jobdesk' }) {
  const cfg = getCategoryConfig(category);
  const CategoryIcon = cfg.icon;
  const queryClient = useQueryClient();
  const { data: expRes, isLoading } = useExperiences({
    category,
    all: true,
    limit: 50,
    sort: 'order',
  });

  const items = (expRes?.data || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0));
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState('view');
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [existingDoc, setExistingDoc] = useState('');
  const fileRef = useRef(null);

  const { register, handleSubmit, reset, watch, setValue, control } = useForm({
    defaultValues: emptyForm,
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'responsibilities' });
  const formValues = watch();

  useEffect(() => {
    if (!open) {
      setSelected(null);
      reset(emptyForm);
      setMode('view');
      setPreview(false);
      setSkillInput('');
      setDocumentFile(null);
      setExistingDoc('');
      return;
    }
    if (items.length > 0) {
      const pick = selected ? items.find((e) => e.id === selected.id) || items[0] : items[0];
      setSelected(pick);
      reset(expToForm(pick));
      setExistingDoc(pick.documentUrl || '');
      setMode('edit');
    } else {
      setSelected(null);
      reset(emptyForm);
      setMode('view');
    }
  }, [open, category, items]);

  const selectItem = (exp) => {
    setSelected(exp);
    reset(expToForm(exp));
    setExistingDoc(exp.documentUrl || '');
    setDocumentFile(null);
    setMode('edit');
    setPreview(false);
    setSkillInput('');
  };

  const startCreate = () => {
    setSelected(null);
    reset({ ...emptyForm, order: items.length + 1 });
    setExistingDoc('');
    setDocumentFile(null);
    setMode('create');
    setPreview(false);
    setSkillInput('');
  };

  const addSkill = () => {
    const val = skillInput.trim();
    if (!val) return;
    const current = watch('skills') || [];
    if (current.includes(val)) {
      toast.error('Keahlian sudah ada');
      return;
    }
    setValue('skills', [...current, val]);
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    setValue('skills', (watch('skills') || []).filter((s) => s !== skill));
  };

  const onSave = async (data) => {
    if (!data.title?.trim() || !data.company?.trim() || !data.startDate) {
      toast.error('Posisi, perusahaan, dan tanggal mulai wajib diisi');
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      const responsibilities = (data.responsibilities || []).map((r) => r?.trim()).filter(Boolean);
      fd.append('title', data.title.trim());
      fd.append('company', data.company.trim());
      fd.append('location', data.location?.trim() || '');
      fd.append('type', cfg.type);
      fd.append('category', category);
      fd.append('description', data.description?.trim() || data.title);
      fd.append('shortDesc', data.description?.trim()?.slice(0, 120) || '');
      fd.append('skills', JSON.stringify(data.skills || []));
      fd.append('responsibilities', JSON.stringify(responsibilities));
      fd.append('startDate', data.startDate);
      fd.append('endDate', data.isCurrent ? '' : data.endDate || '');
      fd.append('isCurrent', String(!!data.isCurrent));
      fd.append('order', String(Number(data.order) || 0));
      fd.append('isActive', 'true');
      if (documentFile) fd.append('document', documentFile);

      if (mode === 'create') {
        const { data: res } = await experiencesApi.create(fd);
        setSelected(res.data);
        reset(expToForm(res.data));
        setExistingDoc(res.data.documentUrl || '');
        setMode('edit');
        toast.success(cfg.toastAdd);
      } else {
        const { data: res } = await experiencesApi.update(selected.id, fd);
        setSelected(res.data);
        reset(expToForm(res.data));
        setExistingDoc(res.data.documentUrl || '');
        toast.success(cfg.toastUpdate);
      }
      setDocumentFile(null);
      await queryClient.invalidateQueries({ queryKey: ['experiences'] });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected?.id || !confirm(cfg.deleteConfirm)) return;
    try {
      await experiencesApi.remove(selected.id);
      await queryClient.invalidateQueries({ queryKey: ['experiences'] });
      const remaining = items.filter((e) => e.id !== selected.id);
      if (remaining.length > 0) {
        setSelected(remaining[0]);
        reset(expToForm(remaining[0]));
        setExistingDoc(remaining[0].documentUrl || '');
      } else {
        setSelected(null);
        reset(emptyForm);
        setMode('view');
      }
      toast.success(cfg.toastDelete);
    } catch {
      toast.error('Gagal menghapus');
    }
  };

  if (!open) return null;

  const displayDoc = documentFile?.name || fileNameFromUrl(existingDoc);
  const modalId = `exp-modal-${category.replace(/\s/g, '-')}`;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <ModalOverlay onClose={onClose} variant="jobdesk">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="jobdesk-modal-panel relative bg-white dark:bg-[#2a1e26] overflow-hidden flex flex-col modal-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={modalId}
          >
            <ModalHeader
              variant="jobdesk"
              icon={CategoryIcon}
              title={
                <span id={modalId} className="flex items-center gap-2 text-[#222222] dark:text-[#f7f2f5]">
                  {cfg.title} <Sparkle size={16} className="text-gold" />
                </span>
              }
              subtitle={cfg.subtitle}
              onClose={onClose}
            />

            <div className="flex-1 overflow-hidden">
              <div className="grid h-full lg:grid-cols-[2fr_3fr] divide-y lg:divide-y-0 lg:divide-x divide-[#F3D4E5]/60 dark:divide-pink-soft/30">
                <div className="p-8 flex flex-col min-h-0 overflow-hidden bg-white dark:bg-[#2a1e26]">
                  <div className="flex items-center justify-between gap-3 mb-6 shrink-0">
                    <SectionTitle size="large">
                      {cfg.listTitle} <Sparkle size={12} className="text-gold" />
                    </SectionTitle>
                    <ModalAddButton onClick={startCreate}>
                      {cfg.addLabel}
                    </ModalAddButton>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-6 pr-1">
                    {isLoading ? (
                      [1, 2].map((i) => <div key={i} className="skeleton h-[170px] rounded-[20px]" />)
                    ) : items.length === 0 ? (
                      <p className="text-sm text-[#7C7C7C] dark:text-[#c4b8be] text-center py-16">{cfg.emptyText}</p>
                    ) : (
                      items.map((exp, i) => {
                        const active = selected?.id === exp.id;
                        const statusLabel = exp.isCurrent ? 'Aktif' : 'Selesai';
                        const statusClass = exp.isCurrent
                          ? 'bg-[#FFF1F7] text-[#FF4F93] border-[#F3D4E5]'
                          : 'bg-[#F5E6B8]/50 text-[#D4AF37] border-[#D4AF37]/40';

                        return (
                          <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ y: -3 }}
                            role="button"
                            tabIndex={0}
                            onClick={() => selectItem(exp)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                selectItem(exp);
                              }
                            }}
                            className={`jobdesk-card relative cursor-pointer p-5 pl-14 border-2 ${
                              active
                                ? 'border-[#FF4F93] bg-[#FFF1F7]/30 dark:bg-pink/5'
                                : 'border-[#F3D4E5]/80 dark:border-[#5a4f56] bg-white dark:bg-[#352630]'
                            }`}
                          >
                            <div className="absolute left-5 top-5 bottom-5 flex flex-col items-center" aria-hidden="true">
                              <span className="h-3 w-3 rounded-full bg-[#FF4F93] ring-4 ring-[#FF4F93]/20 shrink-0" />
                              <span className="w-px flex-1 bg-[#F3D4E5] dark:bg-pink-soft/40 my-1" />
                              <span className="grid h-9 w-9 place-items-center rounded-xl border-2 border-[#F3D4E5] dark:border-pink-soft/40 bg-white dark:bg-[#352630] text-[#FF4F93]">
                                <CategoryIcon size={16} />
                              </span>
                            </div>

                            <motion.span className="absolute top-4 right-4" whileHover={{ scale: 1.05 }}>
                              <ModalEditButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  selectItem(exp);
                                }}
                              />
                            </motion.span>

                            <p className="text-sm font-bold text-[#FF4F93] pr-10">
                              {formatPeriod(exp.startDate, exp.endDate, exp.isCurrent)}
                            </p>
                            <p className="font-bold text-[#2C2C2C] dark:text-[#f7f2f5] text-base mt-1 pr-8 leading-snug">
                              {exp.title}
                            </p>
                            <p className="text-sm text-[#7C7C7C] dark:text-[#c4b8be] mt-0.5">{exp.company}</p>
                            <span
                              className={`inline-block mt-3 text-[11px] font-bold rounded-full px-3 py-1 border ${statusClass}`}
                            >
                              {statusLabel}
                            </span>
                          </motion.div>
                        );
                      })
                    )}
                  </div>

                  <div className="mt-6 shrink-0 space-y-3">
                    <ModalAddButton
                      onClick={startCreate}
                      className="w-full justify-center !rounded-2xl !py-3 !text-sm !border-2 border-dashed"
                    >
                      {cfg.addLabel} Baru
                    </ModalAddButton>
                    <ModalInfoAlert>
                      Klik pada salah satu item untuk melihat atau mengedit detail.
                    </ModalInfoAlert>
                  </div>
                </div>

                <div className="flex flex-col min-h-0 bg-white dark:bg-[#2a1e26]">
                  {!selected && mode !== 'create' ? (
                    <div className="h-full min-h-[300px] flex items-center justify-center text-[#7C7C7C] dark:text-[#c4b8be] text-sm p-9">
                      {cfg.selectText}
                    </div>
                  ) : preview ? (
                    <div className="p-9 overflow-y-auto">
                      <PreviewPanel
                        cfg={cfg}
                        form={formValues}
                        documentName={displayDoc}
                        onClose={() => setPreview(false)}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between px-9 pt-8 pb-2 shrink-0">
                        <SectionTitle size="large">
                          {cfg.editTitle} <Sparkle size={12} className="text-gold" />
                        </SectionTitle>
                        <PreviewButton onClick={() => setPreview(true)} />
                      </div>

                      <form
                        onSubmit={handleSubmit(onSave)}
                        className="flex-1 flex flex-col min-h-0"
                      >
                        <div className="flex-1 overflow-y-auto px-9 pb-4 space-y-5">
                        <div className="grid sm:grid-cols-2 gap-5">
                          <FormField
                            label="Posisi / Jabatan"
                            icon={CategoryIcon}
                            variant="jobdesk"
                            value={formValues.title}
                            onChange={(v) => setValue('title', v)}
                            required
                          />
                          <FormField
                            label="Perusahaan"
                            icon={Building2}
                            variant="jobdesk"
                            value={formValues.company}
                            onChange={(v) => setValue('company', v)}
                            required
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-[#7C7C7C] dark:text-[#c4b8be] mb-1.5 block">
                            Periode
                          </label>
                          <div className="grid sm:grid-cols-2 gap-5">
                            <FormField
                              icon={Calendar}
                              variant="jobdesk"
                              type="date"
                              value={formValues.startDate}
                              onChange={(v) => setValue('startDate', v)}
                              required
                            />
                            <FormField
                              icon={Calendar}
                              variant="jobdesk"
                              type="date"
                              value={formValues.isCurrent ? '' : formValues.endDate}
                              onChange={(v) => setValue('endDate', v)}
                              disabled={formValues.isCurrent}
                              placeholder="Tanggal Selesai"
                            />
                          </div>
                          <label className="mt-3 flex items-center gap-2 text-sm text-[#7C7C7C] dark:text-[#c4b8be] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!formValues.isCurrent}
                              onChange={(e) => {
                                setValue('isCurrent', e.target.checked);
                                if (e.target.checked) setValue('endDate', '');
                              }}
                              className="accent-[#FF4F93] h-4 w-4 rounded"
                            />
                            Masih berlangsung
                          </label>
                        </div>

                        <FormField
                          label="Lokasi (opsional)"
                          icon={MapPin}
                          variant="jobdesk"
                          value={formValues.location}
                          onChange={(v) => setValue('location', v)}
                        />

                        <FormTextarea
                          label="Deskripsi Pekerjaan"
                          icon={FileText}
                          variant="jobdesk"
                          rows={5}
                          value={formValues.description}
                          onChange={(v) => setValue('description', v)}
                        />

                        <div>
                          <p className="text-sm font-bold text-[#2C2C2C] dark:text-[#f7f2f5] mb-3">Tanggung Jawab</p>
                          <div className="space-y-2.5">
                            {fields.map((field, idx) => (
                              <div key={field.id} className="flex items-start gap-2">
                                <span className="mt-4 shrink-0 text-[#FF4F93]">
                                  <Check size={16} strokeWidth={2.5} />
                                </span>
                                <input
                                  {...register(`responsibilities.${idx}`)}
                                  className="modal-input flex-1 rounded-2xl border border-[#ECECEC] dark:border-[#5a4f56] bg-white dark:bg-[#352630] h-12 px-4 text-sm text-ink outline-none focus:border-[#FF4F93] focus:shadow-[0_0_0_3px_rgba(255,79,147,0.15)]"
                                  placeholder="Tanggung jawab..."
                                />
                                {fields.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => remove(idx)}
                                    className="mt-3 text-[#7C7C7C] hover:text-[#FF4F93] text-xs"
                                    aria-label="Hapus item"
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                          <ModalAddButton onClick={() => append('')} className="mt-3 !rounded-2xl !px-4 !py-2 !text-sm">
                            Tambah Tanggung Jawab
                          </ModalAddButton>
                        </div>

                        <div>
                          <p className="text-sm font-bold text-[#2C2C2C] dark:text-[#f7f2f5] mb-3">
                            Keahlian yang Digunakan
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {(formValues.skills || []).map((skill) => (
                              <ModalSkillChip key={skill} onRemove={() => removeSkill(skill)}>
                                {skill}
                              </ModalSkillChip>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={skillInput}
                              onChange={(e) => setSkillInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addSkill();
                                }
                              }}
                              placeholder="Nama keahlian..."
                              className="modal-input flex-1 rounded-2xl border border-[#ECECEC] dark:border-[#5a4f56] bg-white dark:bg-[#352630] h-12 px-4 text-sm text-ink outline-none focus:border-[#FF4F93]"
                            />
                            <ModalAddButton onClick={addSkill} className="!rounded-2xl !px-4 !py-3 !text-sm">
                              Tambah
                            </ModalAddButton>
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-5 items-start">
                          <div>
                            <p className="text-xs font-semibold text-[#7C7C7C] dark:text-[#c4b8be] mb-1.5">
                              Dokumen / Bukti
                            </p>
                            {displayDoc && (
                              <div className="flex items-center gap-2 mb-2 rounded-xl border border-[#ECECEC] dark:border-[#5a4f56] bg-[#FFF1F7]/40 dark:bg-pink/5 px-3 py-2">
                                <File size={16} className="text-[#FF4F93] shrink-0" />
                                <span className="text-xs text-ink truncate flex-1">{displayDoc}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDocumentFile(null);
                                    setExistingDoc('');
                                  }}
                                  className="text-[#7C7C7C] hover:text-[#FF4F93] text-xs"
                                  aria-label="Hapus dokumen"
                                >
                                  ✕
                                </button>
                              </div>
                            )}
                            <input
                              ref={fileRef}
                              type="file"
                              accept=".pdf,.doc,.docx,image/*"
                              className="sr-only"
                              onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                            />
                            <button
                              type="button"
                              onClick={() => fileRef.current?.click()}
                              className="jobdesk-upload-zone w-full text-sm font-semibold text-[#FF4F93]"
                            >
                              <Upload size={18} />
                              Upload File
                            </button>
                          </div>
                          <FormField
                            label="Urutan"
                            icon={ListOrdered}
                            variant="jobdesk"
                            type="number"
                            value={formValues.order}
                            onChange={(v) => setValue('order', v)}
                            hint="Semakin kecil angka, semakin tinggi posisinya."
                            className="sm:max-w-[200px]"
                          />
                        </div>
                        </div>

                        <div className="shrink-0 px-9 pb-7 pt-3 bg-white dark:bg-[#2a1e26] border-t border-[#F3D4E5]/60 dark:border-pink-soft/30">
                          <ModalActions
                            variant="jobdesk"
                            onCancel={() => {
                              if (selected) reset(expToForm(selected));
                              else onClose();
                            }}
                            onDelete={handleDelete}
                            saving={saving}
                            showDelete={mode === 'edit' && !!selected?.id}
                          />
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </ModalOverlay>
      </motion.div>
    </AnimatePresence>
  );
}

function PreviewPanel({ cfg, form, documentName, onClose }) {
  const data = form || {};
  const skills = Array.isArray(data.skills) ? data.skills : [];
  const responsibilities = (Array.isArray(data.responsibilities) ? data.responsibilities : []).filter(Boolean);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      {onClose && (
        <div className="flex justify-between items-center">
          <SectionTitle size="large">
            {cfg.previewTitle} <Eye size={16} />
          </SectionTitle>
          <button type="button" onClick={onClose} className="text-xs text-[#FF4F93] font-semibold hover:underline">
            Kembali ke form
          </button>
        </div>
      )}
      <div className="rounded-[20px] border border-[#F3D4E5] dark:border-pink-soft/40 bg-[#FFF1F7]/40 dark:bg-[#352630] p-6 space-y-4">
        <div>
          <p className="text-sm font-bold text-[#FF4F93]">
            {data.startDate
              ? `${new Date(data.startDate).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })} - ${
                  data.isCurrent
                    ? 'Sekarang'
                    : data.endDate
                      ? new Date(data.endDate).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
                      : '—'
                }`
              : '—'}
          </p>
          <p className="font-display text-xl font-bold text-ink mt-1">{data.title || '—'}</p>
          <p className="text-sm text-[#7C7C7C] dark:text-[#c4b8be]">{data.company || '—'}</p>
          {data.location && (
            <p className="text-xs text-[#7C7C7C] dark:text-[#c4b8be] mt-1 flex items-center gap-1">
              <MapPin size={12} /> {data.location}
            </p>
          )}
        </div>
        {data.description && (
          <div className="pt-3 border-t border-[#F3D4E5]/60">
            <p className="text-xs font-semibold text-[#7C7C7C] dark:text-[#c4b8be] mb-1">Deskripsi</p>
            <p className="text-sm text-ink leading-relaxed">{data.description}</p>
          </div>
        )}
        {responsibilities.length > 0 && (
          <div className="pt-3 border-t border-[#F3D4E5]/60">
            <p className="text-xs font-semibold text-[#7C7C7C] dark:text-[#c4b8be] mb-2">Tanggung Jawab</p>
            <ul className="space-y-1.5">
              {responsibilities.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-ink">
                  <Check size={14} className="text-[#FF4F93] mt-0.5 shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}
        {skills.length > 0 && (
          <div className="pt-3 border-t border-[#F3D4E5]/60">
            <p className="text-xs font-semibold text-[#7C7C7C] dark:text-[#c4b8be] mb-2">Keahlian</p>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s} className="modal-skill-chip">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <InfoRow label="Urutan" value={data.order ?? '—'} />
          <InfoRow label="Dokumen" value={documentName || '—'} />
        </div>
      </div>
    </motion.div>
  );
}
