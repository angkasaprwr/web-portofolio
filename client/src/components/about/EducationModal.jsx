import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  X,
  GraduationCap,
  Pencil,
  Plus,
  Eye,
  Calendar,
  Building2,
  BookOpen,
  Trophy,
  Star,
  ListOrdered,
  FileText,
  ChevronDown,
  Trash2,
  Save,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEducations } from '../../hooks/useEducation';
import { educationsApi } from '../../services/educationApi';
import { Sparkle } from '../common/Decorations';

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
    if (educations.length > 0 && !selected) {
      setSelected(educations[0]);
      setForm(eduToForm(educations[0]));
      setMode(isAuthenticated ? 'edit' : 'view');
    }
  }, [educations, isAuthenticated]);

  const eduToForm = (edu) => ({
    institution: edu.institution || '',
    degree: edu.degree || '',
    field: edu.field || '',
    level: edu.level || 'S1',
    gpa: edu.gpa || '',
    description: edu.description || '',
    startYear: edu.startYear || '',
    endYear: edu.endYear || '',
    isCurrent: !!edu.isCurrent,
    status: edu.status || 'active',
    order: edu.order || 0,
  });

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
      setSelected(null);
      setForm(emptyForm);
      setMode('view');
      toast.success('Pendidikan dihapus');
    } catch {
      toast.error('Gagal menghapus');
    }
  };

  const formatPeriod = (edu) => {
    const start = edu.startYear;
    const end = edu.isCurrent ? 'Sekarang' : edu.endYear || '';
    return `${start} - ${end}`;
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl bg-white dark:bg-[#2a1e26] shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center gap-4 px-6 sm:px-8 pt-6 pb-4 border-b border-pink-soft/50">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-pink to-pink-deep text-white shadow-glow">
              <GraduationCap size={26} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-2xl sm:text-3xl font-semibold flex items-center gap-2">
                Detail Pendidikan <Sparkle size={16} />
              </h2>
              <p className="text-sm text-muted truncate">Kelola data pendidikan yang telah Anda tempuh.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl hover:bg-pink-soft/50 transition"
              aria-label="Tutup"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid lg:grid-cols-[300px_1fr] divide-y lg:divide-y-0 lg:divide-x divide-pink-soft/40">
              {/* Left: education list */}
              <div className="p-5 sm:p-6 space-y-3 overflow-y-auto max-h-[60vh] lg:max-h-none">
                <h3 className="text-pink font-semibold flex items-center gap-2 mb-3">
                  Daftar Pendidikan <Sparkle size={10} />
                </h3>

                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="skeleton h-24 rounded-2xl" />
                    ))}
                  </div>
                ) : (
                  <>
                    {educations.map((edu) => (
                      <button
                        type="button"
                        key={edu.id}
                        onClick={() => selectItem(edu)}
                        className={`relative w-full text-left rounded-2xl border-2 p-4 transition-all ${
                          selected?.id === edu.id
                            ? 'border-pink bg-pink-soft/30 shadow-[0_0_16px_rgba(248,87,166,0.15)]'
                            : 'border-pink-soft/50 hover:border-pink/50 bg-white dark:bg-[#2a1e26]'
                        }`}
                      >
                        {isAuthenticated && (
                          <span className="absolute top-3 right-3 grid h-7 w-7 place-items-center rounded-lg bg-pink/10 text-pink">
                            <Pencil size={12} />
                          </span>
                        )}
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 h-3 w-3 shrink-0 rounded-full bg-pink" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-pink">{formatPeriod(edu)}</p>
                            <p className="font-semibold text-sm mt-0.5 truncate">{edu.institution}</p>
                            <p className="text-xs text-muted truncate">{edu.degree}</p>
                            {edu.level && (
                              <span className="inline-block mt-1.5 text-[10px] font-bold text-pink bg-pink-soft/70 rounded-md px-2 py-0.5">
                                {edu.level}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}

                    {isAuthenticated && (
                      <button
                        type="button"
                        onClick={startCreate}
                        className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-pink/50 py-3 text-sm font-semibold text-pink hover:bg-pink-soft/30 transition"
                      >
                        <Plus size={16} /> Tambah Pendidikan Baru
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Right: detail / form */}
              <div className="p-5 sm:p-6 overflow-y-auto max-h-[60vh] lg:max-h-none">
                {!selected && mode !== 'create' ? (
                  <div className="h-full flex items-center justify-center text-muted text-sm">
                    Pilih pendidikan dari daftar di sebelah kiri.
                  </div>
                ) : preview ? (
                  <PreviewPanel edu={selected} form={form} onClose={() => setPreview(false)} />
                ) : isAuthenticated ? (
                  /* Edit / Create form */
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-pink font-semibold flex items-center gap-2">
                        Detail Pendidikan <Sparkle size={10} />
                      </h3>
                      <button
                        type="button"
                        onClick={() => setPreview(true)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-pink/50 bg-white dark:bg-[#2a1e26] px-3 py-1.5 text-xs font-semibold text-pink hover:bg-pink-soft/30 transition"
                      >
                        <Eye size={12} /> Preview
                      </button>
                    </div>

                    <form onSubmit={handleSave} className="space-y-4">
                      {/* Period */}
                      <div>
                        <label className="text-xs font-semibold text-muted mb-1.5 block">Periode</label>
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            icon={Calendar}
                            placeholder="Tahun Mulai"
                            value={form.startYear}
                            onChange={(v) => setForm({ ...form, startYear: v })}
                            required
                          />
                          <FormField
                            icon={Calendar}
                            placeholder="Tanggal Selesai (opsional)"
                            value={form.isCurrent ? 'Sekarang' : form.endYear}
                            onChange={(v) => setForm({ ...form, endYear: v })}
                            disabled={form.isCurrent}
                          />
                        </div>
                      </div>

                      <FormField
                        label="Institusi"
                        icon={Building2}
                        value={form.institution}
                        onChange={(v) => setForm({ ...form, institution: v })}
                        required
                      />

                      <FormField
                        label="Program Studi / Jurusan"
                        icon={BookOpen}
                        value={form.field || ''}
                        onChange={(v) => setForm({ ...form, field: v })}
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-muted mb-1.5 block">Jenjang</label>
                          <div className="relative">
                            <Trophy size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-pink/60" />
                            <select
                              value={form.level}
                              onChange={(e) => setForm({ ...form, level: e.target.value })}
                              className="w-full rounded-xl border border-pink-soft/70 bg-white dark:bg-[#2a1e26] py-2.5 pl-9 pr-8 text-sm outline-none focus:border-pink appearance-none"
                            >
                              {levels.map((l) => (
                                <option key={l} value={l}>{l}</option>
                              ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                          </div>
                        </div>
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
                          <FileText size={14} className="absolute left-3 top-3 text-pink/60" />
                          <textarea
                            rows={3}
                            value={form.description || ''}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="Deskripsi singkat tentang pendidikan..."
                            className="w-full rounded-xl border border-pink-soft/70 bg-white dark:bg-[#2a1e26] py-2.5 pl-9 pr-4 text-sm outline-none focus:border-pink resize-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-muted mb-1.5 block">Status</label>
                          <div className="relative">
                            <select
                              value={form.status}
                              onChange={(e) => setForm({ ...form, status: e.target.value })}
                              className="w-full rounded-xl border border-pink-soft/70 bg-white dark:bg-[#2a1e26] py-2.5 pl-3 pr-8 text-sm outline-none focus:border-pink appearance-none"
                            >
                              {statuses.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                              ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                          </div>
                        </div>
                        <FormField
                          label="Urutan"
                          icon={ListOrdered}
                          type="number"
                          value={form.order}
                          onChange={(v) => setForm({ ...form, order: v })}
                        />
                      </div>

                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.isCurrent}
                          onChange={(e) => setForm({ ...form, isCurrent: e.target.checked })}
                          className="accent-pink h-4 w-4"
                        />
                        Masih menempuh pendidikan ini
                      </label>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-pink-soft/40">
                        <button
                          type="button"
                          onClick={() => {
                            if (selected) {
                              setForm(eduToForm(selected));
                            } else {
                              onClose();
                            }
                          }}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-pink-soft/70 bg-white dark:bg-[#2a1e26] px-4 py-2.5 text-sm font-medium hover:bg-pink-soft/30 transition"
                        >
                          <RotateCcw size={14} /> Batal
                        </button>

                        <div className="flex-1" />

                        {mode === 'edit' && selected?.id && (
                          <button
                            type="button"
                            onClick={handleDelete}
                            className="inline-flex items-center gap-1.5 rounded-xl border-2 border-pink/60 px-4 py-2.5 text-sm font-semibold text-pink hover:bg-pink hover:text-white transition"
                          >
                            <Trash2 size={14} /> Hapus
                          </button>
                        )}

                        <button
                          type="submit"
                          disabled={saving}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-pink to-pink-deep px-5 py-2.5 text-sm font-semibold text-white shadow-glow hover:shadow-[0_0_30px_rgba(248,87,166,0.5)] transition disabled:opacity-60"
                        >
                          <Save size={14} /> {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  /* Public view */
                  <PreviewPanel edu={selected} form={eduToForm(selected)} />
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function FormField({ label, icon: Icon, value, onChange, placeholder, type = 'text', required, disabled }) {
  return (
    <div>
      {label && <label className="text-xs font-semibold text-muted mb-1.5 block">{label}</label>}
      <div className="relative">
        {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-pink/60" />}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || ''}
          required={required}
          disabled={disabled}
          className={`w-full rounded-xl border border-pink-soft/70 bg-white dark:bg-[#2a1e26] py-2.5 ${Icon ? 'pl-9' : 'pl-3'} pr-4 text-sm outline-none focus:border-pink disabled:opacity-50 disabled:cursor-not-allowed`}
        />
      </div>
    </div>
  );
}

function PreviewPanel({ edu, form, onClose }) {
  const data = form || {};
  return (
    <div className="space-y-4">
      {onClose && (
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-pink font-semibold flex items-center gap-2">
            Preview Pendidikan <Eye size={14} />
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-pink font-medium hover:underline"
          >
            Kembali ke form
          </button>
        </div>
      )}
      <div className="rounded-2xl border border-pink-soft/60 bg-pink-light/50 dark:bg-[#2a1e26] p-5 space-y-3">
        <div className="flex items-center gap-3 mb-4">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-pink/10">
            <GraduationCap size={22} className="text-pink" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold">{data.institution || '—'}</p>
            <p className="text-sm text-muted">{data.field || data.degree || '—'}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <InfoRow label="Periode" value={`${data.startYear || '—'} – ${data.isCurrent ? 'Sekarang' : data.endYear || '—'}`} />
          <InfoRow label="Jenjang" value={data.level || '—'} />
          <InfoRow label="IPK" value={data.gpa || '—'} />
          <InfoRow label="Status" value={data.status === 'active' ? 'Aktif' : data.status === 'graduated' ? 'Lulus' : data.status || '—'} />
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

function InfoRow({ label, value }) {
  return (
    <div className="rounded-xl bg-white/60 dark:bg-[#352630] px-3 py-2">
      <p className="text-[10px] font-semibold text-muted uppercase tracking-wide">{label}</p>
      <p className="font-medium text-sm">{value}</p>
    </div>
  );
}
