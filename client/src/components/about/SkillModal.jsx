import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  X,
  BarChart3,
  Pencil,
  Plus,
  Eye,
  GripVertical,
  PenTool,
  Code,
  Target,
  Palette,
  Wrench,
  Star,
  ChevronDown,
  Trash2,
  Save,
  RotateCcw,
  ListOrdered,
  FileText,
  Tag,
  Info,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSkills } from '../../hooks/usePortfolio';
import { skillsApi } from '../../services/apiServices';
import { Sparkle } from '../common/Decorations';

const CATEGORIES = ['UI Design', 'Website Development', 'Data Analysis', 'Tools', 'Proficiency'];

const emptyForm = {
  name: '',
  category: 'Proficiency',
  level: 80,
  icon: '',
  description: '',
  tools: [],
  order: 0,
  isActive: true,
};

const categoryIcons = {
  'UI Design': Palette,
  'Website Development': Code,
  'Data Analysis': BarChart3,
  Tools: Wrench,
  Proficiency: Star,
};

const iconMap = {
  palette: Palette,
  code: Code,
  target: Target,
  figma: PenTool,
  layout: PenTool,
  layers: PenTool,
};

function getSkillIcon(skill) {
  if (skill?.icon && iconMap[skill.icon]) return iconMap[skill.icon];
  return categoryIcons[skill?.category] || Star;
}

function skillToForm(skill) {
  const tools = Array.isArray(skill?.tools) ? skill.tools : [];
  return {
    name: skill?.name || '',
    category: skill?.category || 'Proficiency',
    level: skill?.level ?? 80,
    icon: skill?.icon || '',
    description: skill?.description || '',
    tools,
    order: skill?.order || 0,
    isActive: skill?.isActive !== false,
  };
}

export default function SkillModal({ open, onClose, category = 'Proficiency' }) {
  const { isAuthenticated } = useAuth();
  const { data: skillsRes, isLoading } = useSkills({
    category,
    all: isAuthenticated,
  });
  const queryClient = useQueryClient();

  const skills = (skillsRes?.data || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0));
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [mode, setMode] = useState('view');
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [toolInput, setToolInput] = useState('');
  const dragItem = useRef(null);
  const dragOver = useRef(null);

  useEffect(() => {
    setItems(skills);
    if (skills.length > 0 && !selected) {
      setSelected(skills[0]);
      setForm(skillToForm(skills[0]));
      setMode(isAuthenticated ? 'edit' : 'view');
    }
  }, [skills, isAuthenticated]);

  const selectItem = (skill) => {
    setSelected(skill);
    setForm(skillToForm(skill));
    setMode(isAuthenticated ? 'edit' : 'view');
    setPreview(false);
    setToolInput('');
  };

  const startCreate = () => {
    setSelected(null);
    setForm({ ...emptyForm, category, order: items.length + 1 });
    setMode('create');
    setPreview(false);
    setToolInput('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name?.trim()) {
      toast.error('Nama keahlian wajib diisi');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        category: form.category,
        level: Number(form.level) || 0,
        icon: form.icon || null,
        description: form.description || null,
        tools: form.tools?.length ? form.tools : null,
        order: Number(form.order) || 0,
        isActive: !!form.isActive,
        isFeatured: form.category === 'Proficiency',
      };
      if (mode === 'create') {
        const { data } = await skillsApi.create(payload);
        setSelected(data.data);
        setForm(skillToForm(data.data));
        setMode('edit');
        toast.success('Keahlian ditambahkan');
      } else {
        const { data } = await skillsApi.update(selected.id, payload);
        setSelected(data.data);
        setForm(skillToForm(data.data));
        toast.success('Keahlian diperbarui');
      }
      await queryClient.invalidateQueries({ queryKey: ['skills'] });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected?.id || !confirm('Hapus keahlian ini?')) return;
    try {
      await skillsApi.remove(selected.id);
      await queryClient.invalidateQueries({ queryKey: ['skills'] });
      setSelected(null);
      setForm(emptyForm);
      setMode('view');
      toast.success('Keahlian dihapus');
    } catch {
      toast.error('Gagal menghapus');
    }
  };

  const addTool = () => {
    const val = toolInput.trim();
    if (!val) return;
    if (form.tools.includes(val)) {
      toast.error('Tool sudah ada');
      return;
    }
    setForm({ ...form, tools: [...form.tools, val] });
    setToolInput('');
  };

  const removeTool = (tool) => {
    setForm({ ...form, tools: form.tools.filter((t) => t !== tool) });
  };

  const handleDragStart = (index) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index) => {
    dragOver.current = index;
  };

  const handleDragEnd = async () => {
    if (dragItem.current === null || dragOver.current === null) return;
    const newItems = [...items];
    const dragged = newItems.splice(dragItem.current, 1)[0];
    newItems.splice(dragOver.current, 0, dragged);
    dragItem.current = null;
    dragOver.current = null;
    setItems(newItems);

    if (!isAuthenticated) return;

    const orders = newItems.map((item, idx) => ({ id: item.id, order: idx + 1 }));
    try {
      await skillsApi.reorder(orders);
      await queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast.success('Urutan keahlian diperbarui');
    } catch {
      toast.error('Gagal mengubah urutan');
      setItems(skills);
    }
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
          className="relative w-full max-w-5xl max-h-[92vh] rounded-3xl bg-white dark:bg-[#2a1e26] shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center gap-4 px-6 sm:px-8 pt-6 pb-4 border-b border-pink-soft/50">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-pink to-pink-deep text-white shadow-glow">
              <BarChart3 size={26} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-2xl sm:text-3xl font-semibold flex items-center gap-2">
                Detail Keahlian Utama <Sparkles size={18} className="text-pink" />
              </h2>
              <p className="text-sm text-muted truncate">Kelola semua keahlian utama yang Anda miliki.</p>
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
            <div className="grid lg:grid-cols-[340px_1fr] divide-y lg:divide-y-0 lg:divide-x divide-pink-soft/40">
              {/* Left: skill list */}
              <div className="p-5 sm:p-6 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-pink font-semibold flex items-center gap-2">
                    Daftar Keahlian <Sparkle size={10} />
                  </h3>
                  {isAuthenticated && (
                    <button
                      type="button"
                      onClick={startCreate}
                      className="inline-flex items-center gap-1 rounded-full border border-pink/50 px-3 py-1 text-xs font-semibold text-pink hover:bg-pink-soft/30 transition"
                    >
                      <Plus size={12} /> Tambah Keahlian
                    </button>
                  )}
                </div>

                <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[50vh] lg:max-h-[55vh] pr-1">
                  {isLoading ? (
                    [1, 2, 3].map((i) => <div key={i} className="skeleton h-20 rounded-2xl" />)
                  ) : items.length === 0 ? (
                    <p className="text-sm text-muted text-center py-8">Belum ada keahlian.</p>
                  ) : (
                    items.map((skill, index) => {
                      const Icon = getSkillIcon(skill);
                      const isSelected = selected?.id === skill.id;
                      return (
                        <div
                          key={skill.id}
                          draggable={isAuthenticated}
                          onDragStart={() => handleDragStart(index)}
                          onDragEnter={() => handleDragEnter(index)}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e) => e.preventDefault()}
                          className={`relative flex items-center gap-2 rounded-2xl border-2 p-3 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-pink bg-pink-soft/30 shadow-[0_0_16px_rgba(248,87,166,0.15)]'
                              : 'border-pink-soft/50 hover:border-pink/50 bg-white dark:bg-[#2a1e26]'
                          }`}
                          onClick={() => selectItem(skill)}
                        >
                          {isAuthenticated && (
                            <span className="shrink-0 cursor-grab text-muted/50 hover:text-pink">
                              <GripVertical size={16} />
                            </span>
                          )}
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-pink/10 text-pink">
                            <Icon size={18} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm truncate">{skill.name}</p>
                            <p className="text-[11px] text-muted truncate">{skill.category}</p>
                            <div className="mt-1.5 h-1.5 rounded-full bg-pink-soft overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-pink to-pink-deep transition-all duration-500"
                                style={{ width: `${skill.level}%` }}
                              />
                            </div>
                          </div>
                          <div className="shrink-0 text-right flex flex-col items-end gap-1">
                            <span className="text-sm font-bold text-pink">{skill.level}%</span>
                            {isAuthenticated && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  selectItem(skill);
                                }}
                                className="grid h-7 w-7 place-items-center rounded-lg bg-pink/10 text-pink hover:bg-pink hover:text-white transition"
                                aria-label="Edit"
                              >
                                <Pencil size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {isAuthenticated && (
                  <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted">
                    <Info size={12} className="text-pink shrink-0" />
                    Drag & drop untuk mengubah urutan keahlian.
                  </p>
                )}
              </div>

              {/* Right: form / preview */}
              <div className="p-5 sm:p-6 overflow-y-auto max-h-[60vh] lg:max-h-none">
                {!selected && mode !== 'create' ? (
                  <div className="h-full flex items-center justify-center text-muted text-sm">
                    Pilih keahlian dari daftar di sebelah kiri.
                  </div>
                ) : preview ? (
                  <PreviewPanel skill={selected} form={form} onClose={() => setPreview(false)} />
                ) : isAuthenticated ? (
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-pink font-semibold flex items-center gap-2">
                        Edit Keahlian <Sparkle size={10} />
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
                      <FormField
                        label="Nama Keahlian"
                        icon={PenTool}
                        value={form.name}
                        onChange={(v) => setForm({ ...form, name: v })}
                        required
                      />

                      <div>
                        <label className="text-xs font-semibold text-muted mb-1.5 block">Kategori</label>
                        <div className="relative">
                          <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-pink/60" />
                          <select
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                            className="w-full rounded-xl border border-pink-soft/70 bg-white dark:bg-[#2a1e26] py-2.5 pl-9 pr-8 text-sm outline-none focus:border-pink appearance-none"
                          >
                            {CATEGORIES.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-muted mb-1.5 block">Persentase Kemampuan</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={form.level}
                            onChange={(e) => setForm({ ...form, level: Math.min(100, Math.max(0, Number(e.target.value) || 0)) })}
                            className="w-20 rounded-xl border border-pink-soft/70 bg-white dark:bg-[#2a1e26] py-2.5 px-3 text-sm text-center font-bold text-pink outline-none focus:border-pink"
                          />
                          <span className="text-sm text-muted">%</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={form.level}
                          onChange={(e) => setForm({ ...form, level: Number(e.target.value) })}
                          className="mt-2 w-full accent-pink h-2 cursor-pointer"
                        />
                        <div className="mt-1.5 h-2 rounded-full bg-pink-soft overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-pink to-pink-deep"
                            animate={{ width: `${form.level}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-muted mb-1.5 block">Deskripsi</label>
                        <div className="relative">
                          <FileText size={14} className="absolute left-3 top-3 text-pink/60" />
                          <textarea
                            rows={3}
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="Deskripsi singkat tentang keahlian..."
                            className="w-full rounded-xl border border-pink-soft/70 bg-white dark:bg-[#2a1e26] py-2.5 pl-9 pr-4 text-sm outline-none focus:border-pink resize-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-muted mb-1.5 block">Tools / Teknologi</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {form.tools.map((tool) => (
                            <span
                              key={tool}
                              className="inline-flex items-center gap-1 rounded-full bg-pink-soft/60 text-pink px-3 py-1 text-xs font-medium"
                            >
                              {tool}
                              <button
                                type="button"
                                onClick={() => removeTool(tool)}
                                className="hover:text-pink-deep"
                                aria-label={`Hapus ${tool}`}
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={toolInput}
                            onChange={(e) => setToolInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addTool();
                              }
                            }}
                            placeholder="Tambah tool..."
                            className="flex-1 rounded-xl border border-pink-soft/70 bg-white dark:bg-[#2a1e26] py-2 px-3 text-sm outline-none focus:border-pink"
                          />
                          <button
                            type="button"
                            onClick={addTool}
                            className="inline-flex items-center gap-1 rounded-xl border border-pink/50 px-3 py-2 text-xs font-semibold text-pink hover:bg-pink-soft/30 transition"
                          >
                            <Plus size={12} /> Tambah
                          </button>
                        </div>
                      </div>

                      <FormField
                        label="Urutan"
                        icon={ListOrdered}
                        type="number"
                        value={form.order}
                        onChange={(v) => setForm({ ...form, order: v })}
                      />

                      <label className="flex items-center justify-between gap-3 rounded-xl border border-pink-soft/60 bg-pink-light/30 dark:bg-[#352630] px-4 py-3 cursor-pointer">
                        <span className="text-sm font-medium">Aktif (Akan ditampilkan di halaman publik)</span>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={form.isActive}
                            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 rounded-full bg-pink-soft/80 peer-checked:bg-pink transition-colors" />
                          <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow peer-checked:translate-x-5 transition-transform" />
                        </div>
                      </label>

                      <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-pink-soft/40">
                        <button
                          type="button"
                          onClick={() => {
                            if (selected) setForm(skillToForm(selected));
                            else onClose();
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
                  <PreviewPanel skill={selected} form={skillToForm(selected)} />
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function FormField({ label, icon: Icon, value, onChange, placeholder, type = 'text', required }) {
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
          className={`w-full rounded-xl border border-pink-soft/70 bg-white dark:bg-[#2a1e26] py-2.5 ${Icon ? 'pl-9' : 'pl-3'} pr-4 text-sm outline-none focus:border-pink`}
        />
      </div>
    </div>
  );
}

function PreviewPanel({ skill, form, onClose }) {
  const data = form || {};
  const Icon = getSkillIcon({ ...skill, category: data.category, icon: data.icon });
  const tools = Array.isArray(data.tools) ? data.tools : [];

  return (
    <div className="space-y-4">
      {onClose && (
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-pink font-semibold flex items-center gap-2">
            Preview Keahlian <Eye size={14} />
          </h3>
          <button type="button" onClick={onClose} className="text-xs text-pink font-medium hover:underline">
            Kembali ke form
          </button>
        </div>
      )}
      <div className="rounded-2xl border border-pink-soft/60 bg-pink-light/50 dark:bg-[#2a1e26] p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-pink/10">
            <Icon size={22} className="text-pink" />
          </div>
          <div className="flex-1">
            <p className="font-display text-lg font-semibold">{data.name || '—'}</p>
            <p className="text-sm text-muted">{data.category || '—'}</p>
          </div>
          <span className="text-2xl font-bold text-pink">{data.level ?? 0}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-pink-soft overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-pink to-pink-deep"
            style={{ width: `${data.level ?? 0}%` }}
          />
        </div>
        {data.description && (
          <div className="pt-2 border-t border-pink-soft/40">
            <p className="text-xs font-semibold text-muted mb-1">Deskripsi</p>
            <p className="text-sm text-muted leading-relaxed">{data.description}</p>
          </div>
        )}
        {tools.length > 0 && (
          <div className="pt-2 border-t border-pink-soft/40">
            <p className="text-xs font-semibold text-muted mb-2">Tools / Teknologi</p>
            <div className="flex flex-wrap gap-2">
              {tools.map((t) => (
                <span key={t} className="rounded-full bg-pink-soft/60 text-pink px-3 py-1 text-xs font-medium">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <InfoRow label="Urutan" value={data.order ?? '—'} />
          <InfoRow label="Status" value={data.isActive !== false ? 'Aktif' : 'Nonaktif'} />
        </div>
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
