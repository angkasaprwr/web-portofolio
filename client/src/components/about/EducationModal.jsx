import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  GraduationCap,
  Pencil,
  Plus,
  Eye,
  Calendar,
  BookOpen,
  Building2,
  Star,
  ListOrdered,
  FileText,
  Clock,
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

export default function EducationModal({ open, onClose }) {
  const { isAuthenticated } = useAuth();
  const { data: educations = [], isLoading } = useEducations({ all: isAuthenticated });
  const queryClient = useQueryClient();

  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [mode, setMode] = useState('view');
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (!open) {
      setSelected(null);
      setForm(emptyForm);
      setMode('view');
      setPreview(false);
      return;
    }
    if (educations.length > 0 && !selected) {
      setSelected(educations[0]);
      setForm(eduToForm(educations[0]));
      setMode(isAuthenticated ? 'edit' : 'view');
    }
  }, [open, educations, isAuthenticated]);

  const selectItem = (edu) => {
    setSelected(edu);
    setForm(eduToForm(edu));
    setMode(isAuthenticated ? 'edit' : 'view');
    setPreview(false);
  };

  const startCreate = () => {
    setSelected(null);
    setForm({ ...emptyForm, order: educations.length + 1 });
    setMode('create');
    setPreview(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
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
    if (!selected?.id || !confirm('Hapus data pendidikan ini?')) return;
    try {
      await educationsApi.remove(selected.id);
      await queryClient.invalidateQueries({ queryKey: ['educations'] });
      const remaining = educations.filter((e) => e.id !== selected.id);
      if (remaining.length > 0) {
        setSelected(remaining[0]);
        setForm(eduToForm(remaining[0]));
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

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <ModalOverlay onClose={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="relative w-full max-w-[920px] max-h-[92vh] rounded-3xl bg-white dark:bg-[#2a1e26] shadow-2xl overflow-hidden flex flex-col modal-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader
              icon={GraduationCap}
              title={
                <>
                  Detail Pendidikan <Sparkle size={14} className="text-gold" />
                </>
              }
              subtitle="Kelola data pendidikan yang telah Anda tempuh."
              onClose={onClose}
            />

            <div className="flex-1 overflow-y-auto">
              <div className="grid lg:grid-cols-[minmax(280px,320px)_1fr] divide-y lg:divide-y-0 lg:divide-x divide-pink-soft/40">
                {/* Left — timeline list */}
                <div className="p-5 sm:p-6 flex flex-col min-h-[420px]">
                  <SectionTitle>
                    Daftar Pendidikan <Sparkle size={10} />
                  </SectionTitle>

                  <div className="flex-1 mt-4 overflow-y-auto max-h-[52vh] lg:max-h-none pr-1">
                    {isLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="skeleton h-24 rounded-2xl" />
                        ))}
                      </div>
                    ) : educations.length === 0 ? (
                      <p className="text-sm text-muted text-center py-10">Belum ada data pendidikan.</p>
                    ) : (
                      <div className="relative pl-3">
                        <div
                          className="absolute left-[11px] top-5 bottom-5 w-px bg-pink-soft/80"
                          aria-hidden="true"
                        />
                        <div className="space-y-3">
                          {educations.map((edu) => {
                            const active = selected?.id === edu.id;
                            return (
                              <div key={edu.id} className="relative pl-6">
                                <span
                                  className={`absolute left-0 top-5 z-10 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-[#2a1e26] ${active ? 'bg-pink ring-4 ring-pink/20' : 'bg-pink'}`}
                                  aria-hidden="true"
                                />
                                <button
                                  type="button"
                                  onClick={() => selectItem(edu)}
                                  className={`relative w-full text-left rounded-2xl border p-4 transition-all ${
                                    active
                                      ? 'border-pink bg-pink-soft/25 shadow-[0_0_0_1px_rgba(248,87,166,0.2)]'
                                      : 'border-pink-soft/60 hover:border-pink/40 bg-white dark:bg-[#352630]'
                                  }`}
                                >
                                  {isAuthenticated && (
                                    <span className="absolute top-3 right-3 grid h-7 w-7 place-items-center rounded-lg border border-pink/40 bg-pink/5 text-pink">
                                      <Pencil size={12} />
                                    </span>
                                  )}
                                  <p className="text-xs font-semibold text-pink pr-8">{formatPeriod(edu)}</p>
                                  <p className="font-semibold text-sm text-ink mt-1 pr-6 leading-snug">
                                    {edu.institution}
                                  </p>
                                  <p className="text-xs text-muted mt-0.5 truncate">{majorLabel(edu)}</p>
                                  {edu.level && (
                                    <span className="inline-block mt-2 text-[10px] font-bold text-pink bg-pink-soft/70 dark:bg-pink/15 rounded-md px-2 py-0.5">
                                      {edu.level}
                                    </span>
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {isAuthenticated && (
                    <button
                      type="button"
                      onClick={startCreate}
                      className="mt-4 w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-pink py-3 text-sm font-semibold text-pink hover:bg-pink-soft/25 transition"
                    >
                      <Plus size={16} /> Tambah Pendidikan Baru
                    </button>
                  )}
                </div>

                {/* Right — form */}
                <div className="p-5 sm:p-6 overflow-y-auto max-h-[70vh] lg:max-h-none">
                  {!selected && mode !== 'create' ? (
                    <div className="h-full min-h-[300px] flex items-center justify-center text-muted text-sm">
                      Pilih pendidikan dari daftar di sebelah kiri.
                    </div>
                  ) : preview ? (
                    <PreviewPanel form={form} onClose={() => setPreview(false)} />
                  ) : isAuthenticated ? (
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <SectionTitle>
                          Detail Pendidikan <Sparkle size={10} />
                        </SectionTitle>
                        <PreviewButton onClick={() => setPreview(true)} />
                      </div>

                      <form onSubmit={handleSave} className="space-y-4">
                        <div>
                          <label className="text-xs font-semibold text-muted mb-1.5 block">Periode</label>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="relative">
                              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-pink/70" />
                              <input
                                type="text"
                                value={periodDisplay}
                                onChange={(e) => {
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
                                placeholder="2022 - Sekarang"
                                required
                                className="modal-input w-full rounded-xl border border-pink-soft/70 bg-white dark:bg-[#352630] py-2.5 pl-9 pr-4 text-sm text-ink outline-none focus:border-pink"
                              />
                            </div>
                            <FormField
                              icon={Calendar}
                              placeholder="Tanggal Selesai (opsional)"
                              value={form.isCurrent ? '' : form.endYear}
                              onChange={(v) => setForm({ ...form, endYear: v, isCurrent: false })}
                              disabled={form.isCurrent}
                            />
                          </div>
                          <label className="mt-2 flex items-center gap-2 text-xs text-muted cursor-pointer">
                            <input
                              type="checkbox"
                              checked={form.isCurrent}
                              onChange={(e) =>
                                setForm({ ...form, isCurrent: e.target.checked, endYear: e.target.checked ? '' : form.endYear })
                              }
                              className="accent-pink h-3.5 w-3.5"
                            />
                            Masih menempuh pendidikan ini
                          </label>
                        </div>

                        <FormField
                          label="Institusi"
                          icon={GraduationCap}
                          value={form.institution}
                          onChange={(v) => setForm({ ...form, institution: v })}
                          required
                        />

                        <FormField
                          label="Program Studi / Jurusan"
                          icon={BookOpen}
                          value={form.field || ''}
                          onChange={(v) => setForm({ ...form, field: v, degree: v })}
                        />

                        <div className="grid grid-cols-2 gap-3">
                          <FormSelect
                            label="Jenjang"
                            icon={Building2}
                            value={form.level}
                            onChange={(v) => setForm({ ...form, level: v })}
                            options={levels}
                          />
                          <FormField
                            label="IPK (opsional)"
                            icon={Star}
                            placeholder="3.72"
                            value={form.gpa || ''}
                            onChange={(v) => setForm({ ...form, gpa: v })}
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-muted mb-1.5 block">Deskripsi (opsional)</label>
                          <div className="relative">
                            <FileText size={14} className="absolute left-3 top-3 text-pink/70" />
                            <textarea
                              rows={4}
                              value={form.description || ''}
                              onChange={(e) => setForm({ ...form, description: e.target.value })}
                              placeholder="Deskripsi singkat tentang pendidikan..."
                              className="modal-input w-full rounded-xl border border-pink-soft/70 bg-white dark:bg-[#352630] py-2.5 pl-9 pr-4 text-sm text-ink outline-none focus:border-pink resize-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <FormSelect
                            label="Status"
                            icon={Clock}
                            value={form.status}
                            onChange={(v) => setForm({ ...form, status: v })}
                            options={statuses}
                          />
                          <FormField
                            label="Urutan"
                            icon={ListOrdered}
                            type="number"
                            value={form.order}
                            onChange={(v) => setForm({ ...form, order: v })}
                          />
                        </div>

                        <ModalActions
                          onCancel={() => {
                            if (selected) setForm(eduToForm(selected));
                            else onClose();
                          }}
                          onDelete={handleDelete}
                          saving={saving}
                          showDelete={mode === 'edit' && !!selected?.id}
                        />
                      </form>
                    </div>
                  ) : (
                    <PreviewPanel form={eduToForm(selected)} />
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
    <div className="space-y-4">
      {onClose && (
        <div className="flex justify-between items-center mb-2">
          <SectionTitle>
            Preview Pendidikan <Eye size={14} />
          </SectionTitle>
          <button type="button" onClick={onClose} className="text-xs text-pink font-medium hover:underline">
            Kembali ke form
          </button>
        </div>
      )}
      <div className="rounded-2xl border border-pink-soft/60 bg-pink-light/40 dark:bg-[#352630] p-5 space-y-3">
        <div className="flex items-center gap-3 mb-2">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-pink/10">
            <GraduationCap size={22} className="text-pink" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-ink">{data.institution || '—'}</p>
            <p className="text-sm text-muted">{data.field || data.degree || '—'}</p>
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
          <div className="pt-2 border-t border-pink-soft/40">
            <p className="text-xs font-semibold text-muted mb-1">Deskripsi</p>
            <p className="text-sm text-muted leading-relaxed">{data.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
