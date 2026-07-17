import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  GraduationCap,
  Eye,
  Calendar,
  BookOpen,
  Building2,
  Star,
  ListOrdered,
  FileText,
  Tag,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEducations } from '../../hooks/useEducation';
import { educationsApi } from '../../services/educationApi';
import { Sparkle } from '../common/Decorations';
import {
  ModalOverlay,
  ModalHeader,
  SectionTitle,
  PreviewButton,
  FormField,
  FormSelect,
  ModalActions,
  InfoRow,
} from './modalUi';

const emptyForm = {
  institution: '',
  degree: '',
  field: '',
  level: 'S1',
  gpa: '',
  description: '',
  startYear: '',
  endYear: '',
  isCurrent: false,
  status: 'active',
  order: 0,
};

const levels = ['SD', 'SMP', 'SMA', 'D3', 'S1', 'S2', 'S3'];
const statuses = [
  { value: 'active', label: 'Aktif' },
  { value: 'graduated', label: 'Lulus' },
  { value: 'dropout', label: 'Keluar' },
];

function eduToForm(edu) {
  return {
    institution: edu?.institution || '',
    degree: edu?.degree || '',
    field: edu?.field || '',
    level: edu?.level || 'S1',
    gpa: edu?.gpa || '',
    description: edu?.description || '',
    startYear: edu?.startYear || '',
    endYear: edu?.endYear || '',
    isCurrent: !!edu?.isCurrent,
    status: edu?.status || 'active',
    order: edu?.order || 0,
  };
}

function formatPeriod(edu) {
  const end = edu.isCurrent ? 'Sekarang' : edu.endYear || '';
  return `${edu.startYear}${end ? ` - ${end}` : ''}`;
}

function majorLabel(edu) {
  return edu.field || edu.degree || '';
}

function detailLine(edu) {
  if (edu.gpa) return `IPK: ${edu.gpa}`;
  if (edu.description) return edu.description;
  return '';
}

export default function EducationModal({ open, onClose }) {
  const { isAuthenticated } = useAuth();
  const { data: educations = [], isLoading } = useEducations({ all: isAuthenticated });
  const queryClient = useQueryClient();

  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [mode, setMode] = useState('view');
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  const requireAuth = () => {
    if (isAuthenticated) return true;
    toast.error('Silakan login admin untuk mengubah data');
    return false;
  };

  useEffect(() => {
    if (!open) {
      setSelected(null);
      setForm(emptyForm);
      setMode('view');
      setPreview(false);
      return;
    }
    if (educations.length > 0) {
      const pick = selected ? educations.find((e) => e.id === selected.id) || educations[0] : educations[0];
      setSelected(pick);
      setForm(eduToForm(pick));
      setMode('edit');
    }
  }, [open, educations]);

  const selectItem = (edu) => {
    setSelected(edu);
    setForm(eduToForm(edu));
    setMode('edit');
    setPreview(false);
  };

  const startCreate = () => {
    if (!requireAuth()) return;
    setSelected(null);
    setForm({ ...emptyForm, order: educations.length + 1 });
    setMode('create');
    setPreview(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!requireAuth()) return;
    if (!form.institution || !form.startYear) {
      toast.error('Institusi dan tahun mulai wajib diisi');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        degree: form.field || form.degree || form.institution,
        order: Number(form.order) || 0,
        endYear: form.isCurrent ? null : form.endYear || null,
        gpa: form.gpa || null,
        field: form.field || null,
        description: form.description || null,
      };
      if (mode === 'create') {
        const { data } = await educationsApi.create(payload);
        setSelected(data.data);
        setForm(eduToForm(data.data));
        setMode('edit');
        toast.success('Pendidikan ditambahkan');
      } else {
        const { data } = await educationsApi.update(selected.id, payload);
        setSelected(data.data);
        setForm(eduToForm(data.data));
        toast.success('Pendidikan diperbarui');
      }
      await queryClient.invalidateQueries({ queryKey: ['educations'] });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!requireAuth()) return;
    if (!selected?.id || !confirm('Hapus data pendidikan ini?')) return;
    try {
      await educationsApi.remove(selected.id);
      await queryClient.invalidateQueries({ queryKey: ['educations'] });
      const remaining = educations.filter((e) => e.id !== selected.id);
      if (remaining.length > 0) {
        setSelected(remaining[0]);
        setForm(eduToForm(remaining[0]));
        setMode('edit');
      } else {
        setSelected(null);
        setForm(emptyForm);
        setMode('view');
      }
      toast.success('Pendidikan dihapus');
    } catch {
      toast.error('Gagal menghapus');
    }
  };

  if (!open) return null;

  const periodDisplay = form.isCurrent
    ? `${form.startYear} - Sekarang`
    : form.startYear && form.endYear
      ? `${form.startYear} - ${form.endYear}`
      : form.startYear;
  const showForm = selected || mode === 'create';
  const readOnly = !isAuthenticated;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <ModalOverlay onClose={onClose} variant="jobdesk">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="jobdesk-modal-panel relative bg-white dark:bg-[#2a1e26] overflow-hidden flex flex-col modal-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edu-modal-title"
          >
            <ModalHeader
              variant="jobdesk"
              icon={GraduationCap}
              title={
                <span id="edu-modal-title" className="flex items-center gap-2">
                  Detail Pendidikan <Sparkle size={16} className="text-gold" />
                </span>
              }
              subtitle="Kelola data pendidikan yang telah Anda tempuh."
              onClose={onClose}
            />

            <div className="flex-1 overflow-hidden">
              <div className="grid h-full lg:grid-cols-[2fr_3fr] divide-y lg:divide-y-0 lg:divide-x divide-[#F3D4E5]/60 dark:divide-pink-soft/30">
                {/* Left list */}
                <div className="p-8 flex flex-col min-h-0 overflow-hidden bg-white dark:bg-[#2a1e26]">
                  <SectionTitle size="large">
                    Daftar Pendidikan <Sparkle size={12} className="text-gold" />
                  </SectionTitle>

                  <div className="flex-1 mt-5 overflow-y-auto pr-1 space-y-4">
                    {isLoading ? (
                      [1, 2, 3].map((i) => <div key={i} className="skeleton h-28 rounded-2xl" />)
                    ) : educations.length === 0 ? (
                      <p className="text-sm text-[#7C7C7C] dark:text-[#c4b8be] text-center py-12">
                        Belum ada data pendidikan.
                      </p>
                    ) : (
                      <div className="relative pl-2">
                        <div
                          className="absolute left-[13px] top-6 bottom-6 w-px bg-[#F3D4E5] dark:bg-pink-soft/40"
                          aria-hidden="true"
                        />
                        <div className="space-y-4">
                          {educations.map((edu) => {
                            const active = selected?.id === edu.id;
                            const detail = detailLine(edu);
                            return (
                              <div key={edu.id} className="relative pl-8">
                                <span
                                  className={`absolute left-0.5 top-6 z-10 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-[#2a1e26] ${
                                    active ? 'bg-[#FF4F93] ring-4 ring-[#FF4F93]/20' : 'bg-[#FF4F93]'
                                  }`}
                                  aria-hidden="true"
                                />
                                <motion.div
                                  role="button"
                                  tabIndex={0}
                                  whileHover={{ y: -2 }}
                                  onClick={() => selectItem(edu)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault();
                                      selectItem(edu);
                                    }
                                  }}
                                  className={`relative w-full text-left rounded-[20px] border-2 p-4 transition-all cursor-pointer shadow-[0_8px_25px_rgba(255,79,147,0.08)] ${
                                    active
                                      ? 'border-[#FF4F93] bg-[#FFF1F7]/40 dark:bg-pink/5'
                                      : 'border-[#F3D4E5] dark:border-[#5a4f56] bg-white dark:bg-[#352630]'
                                  }`}
                                >
                                  <button
                                    type="button"
                                    className="absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full border border-[#FF4F93]/50 bg-white dark:bg-[#352630] text-[#FF4F93] hover:bg-[#FF4F93] hover:text-white transition"
                                    aria-label="Edit pendidikan"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      selectItem(edu);
                                    }}
                                  >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                                    </svg>
                                  </button>
                                  <p className="text-xs font-bold text-[#FF4F93] pr-10">{formatPeriod(edu)}</p>
                                  <p className="font-bold text-sm text-[#2C2C2C] dark:text-[#f7f2f5] mt-1 pr-8 leading-snug">
                                    {edu.institution}
                                  </p>
                                  <p className="text-xs text-[#7C7C7C] dark:text-[#c4b8be] mt-0.5 truncate">
                                    {majorLabel(edu)}
                                  </p>
                                  {detail && (
                                    <p className="text-[11px] text-[#7C7C7C] dark:text-[#c4b8be] mt-1 line-clamp-1">
                                      {detail}
                                    </p>
                                  )}
                                  {edu.level && (
                                    <span className="inline-block mt-2 text-[10px] font-bold text-[#FF4F93] bg-[#FFF1F7] dark:bg-pink/15 rounded-full px-2.5 py-0.5">
                                      {edu.level}
                                    </span>
                                  )}
                                </motion.div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={startCreate}
                    className="mt-5 shrink-0 w-full flex items-center justify-center gap-2 rounded-full border-2 border-[#FF4F93] py-3 text-sm font-semibold text-[#FF4F93] hover:bg-[#FF4F93] hover:text-white transition"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    Tambah Pendidikan Baru
                  </button>
                </div>

                {/* Right form */}
                <div className="flex flex-col min-h-0 bg-white dark:bg-[#2a1e26]">
                  {!showForm ? (
                    <div className="h-full min-h-[300px] flex items-center justify-center text-[#7C7C7C] dark:text-[#c4b8be] text-sm p-9">
                      Pilih pendidikan dari daftar di sebelah kiri.
                    </div>
                  ) : preview ? (
                    <div className="p-9 overflow-y-auto">
                      <PreviewPanel form={form} onClose={() => setPreview(false)} />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between px-9 pt-8 pb-2 shrink-0">
                        <SectionTitle size="large">
                          Detail Pendidikan <Sparkle size={12} className="text-gold" />
                        </SectionTitle>
                        <PreviewButton onClick={() => setPreview(true)} />
                      </div>

                      <form onSubmit={handleSave} className="flex-1 flex flex-col min-h-0">
                        <div className="flex-1 overflow-y-auto px-9 pb-4 space-y-4">
                          <div>
                            <label className="text-xs font-semibold text-[#7C7C7C] dark:text-[#c4b8be] mb-1.5 block">
                              Periode
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="relative">
                                <Calendar
                                  size={16}
                                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF4F93]/70 pointer-events-none"
                                />
                                <input
                                  type="text"
                                  value={periodDisplay}
                                  onChange={(e) => {
                                    if (readOnly) return;
                                    const raw = e.target.value;
                                    const parts = raw.split('-').map((s) => s.trim());
                                    const start = parts[0] || '';
                                    const endPart = parts[1];
                                    if (endPart?.toLowerCase() === 'sekarang') {
                                      setForm({ ...form, startYear: start, isCurrent: true, endYear: '' });
                                    } else {
                                      setForm({
                                        ...form,
                                        startYear: start,
                                        isCurrent: false,
                                        endYear: endPart || '',
                                      });
                                    }
                                  }}
                                  readOnly={readOnly}
                                  placeholder="2022 - Sekarang"
                                  required
                                  className="modal-input w-full rounded-2xl border border-[#ECECEC] dark:border-[#5a4f56] bg-white dark:bg-[#352630] h-14 pl-11 pr-10 text-base text-ink outline-none focus:border-[#FF4F93] focus:shadow-[0_0_0_3px_rgba(255,79,147,0.15)]"
                                />
                                {periodDisplay && !readOnly && (
                                  <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7C7C7C] hover:text-[#FF4F93]"
                                    aria-label="Clear periode"
                                    onClick={() => setForm({ ...form, startYear: '', endYear: '', isCurrent: false })}
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                              </div>
                              <FormField
                                icon={Calendar}
                                variant="jobdesk"
                                placeholder="Tanggal Selesai (opsional)"
                                value={form.isCurrent ? '' : form.endYear}
                                onChange={(v) => setForm({ ...form, endYear: v, isCurrent: false })}
                                disabled={form.isCurrent || readOnly}
                              />
                            </div>
                          </div>

                          <FormField
                            label="Institusi"
                            icon={GraduationCap}
                            variant="jobdesk"
                            value={form.institution}
                            onChange={(v) => setForm({ ...form, institution: v })}
                            required
                            disabled={readOnly}
                          />

                          <FormField
                            label="Program Studi / Jurusan"
                            icon={BookOpen}
                            variant="jobdesk"
                            value={form.field || ''}
                            onChange={(v) => setForm({ ...form, field: v, degree: v })}
                            disabled={readOnly}
                          />

                          <div className="grid grid-cols-2 gap-3">
                            <FormSelect
                              label="Jenjang"
                              icon={Building2}
                              value={form.level}
                              onChange={(v) => setForm({ ...form, level: v })}
                              options={levels}
                              disabled={readOnly}
                            />
                            <FormField
                              label="IPK (opsional)"
                              icon={Star}
                              variant="jobdesk"
                              placeholder="3.72"
                              value={form.gpa || ''}
                              onChange={(v) => setForm({ ...form, gpa: v })}
                              disabled={readOnly}
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-[#7C7C7C] dark:text-[#c4b8be] mb-1.5 block">
                              Deskripsi (opsional)
                            </label>
                            <div className="relative">
                              <FileText size={16} className="absolute left-4 top-4 text-[#FF4F93]/70" />
                              <textarea
                                rows={4}
                                value={form.description || ''}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Deskripsi singkat tentang pendidikan..."
                                readOnly={readOnly}
                                className="modal-input w-full rounded-2xl border border-[#ECECEC] dark:border-[#5a4f56] bg-white dark:bg-[#352630] min-h-[130px] py-3 pl-11 pr-4 text-base text-ink outline-none focus:border-[#FF4F93] focus:shadow-[0_0_0_3px_rgba(255,79,147,0.15)] resize-y"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <FormSelect
                              label="Status"
                              icon={Tag}
                              value={form.status}
                              onChange={(v) => setForm({ ...form, status: v })}
                              options={statuses}
                              disabled={readOnly}
                            />
                            <FormField
                              label="Urutan"
                              icon={ListOrdered}
                              variant="jobdesk"
                              type="number"
                              value={form.order}
                              onChange={(v) => setForm({ ...form, order: v })}
                              disabled={readOnly}
                            />
                          </div>
                        </div>

                        {/* Sticky action buttons — always visible */}
                        <div className="shrink-0 px-9 pb-7 pt-3 bg-white dark:bg-[#2a1e26] border-t border-[#F3D4E5]/60 dark:border-pink-soft/30">
                          <ModalActions
                            variant="jobdesk"
                            onCancel={() => {
                              if (selected) setForm(eduToForm(selected));
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

function PreviewPanel({ form, onClose }) {
  const data = form || {};
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <SectionTitle size="large">
          Preview Pendidikan <Eye size={16} />
        </SectionTitle>
        <button type="button" onClick={onClose} className="text-xs text-[#FF4F93] font-semibold hover:underline">
          Kembali ke form
        </button>
      </div>
      <div className="rounded-[20px] border border-[#F3D4E5] dark:border-pink-soft/40 bg-[#FFF1F7]/40 dark:bg-[#352630] p-6 space-y-3">
        <div className="flex items-center gap-3 mb-2">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-[#FFF1F7] dark:bg-pink/15">
            <GraduationCap size={22} className="text-[#FF4F93]" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-ink">{data.institution || '—'}</p>
            <p className="text-sm text-[#7C7C7C] dark:text-[#c4b8be]">{data.field || data.degree || '—'}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <InfoRow
            label="Periode"
            value={`${data.startYear || '—'} – ${data.isCurrent ? 'Sekarang' : data.endYear || '—'}`}
          />
          <InfoRow label="Jenjang" value={data.level || '—'} />
          <InfoRow label="IPK" value={data.gpa || '—'} />
          <InfoRow
            label="Status"
            value={data.status === 'active' ? 'Aktif' : data.status === 'graduated' ? 'Lulus' : data.status || '—'}
          />
        </div>
        {data.description && (
          <div className="pt-2 border-t border-[#F3D4E5]/60">
            <p className="text-xs font-semibold text-[#7C7C7C] dark:text-[#c4b8be] mb-1">Deskripsi</p>
            <p className="text-sm text-ink leading-relaxed">{data.description}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
