import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  BarChart3,
  Eye,
  GripVertical,
  PenTool,
  Code,
  Target,
  Palette,
  Wrench,
  Star,
  FileText,
  LayoutGrid,
  ListOrdered,
  Info,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSkills } from '../../hooks/usePortfolio';
import { skillsApi } from '../../services/apiServices';
import { Sparkle } from '../common/Decorations';
import {
  ModalOverlay,
  ModalHeader,
  SectionTitle,
  PreviewButton,
  ModalAddButton,
  ModalEditButton,
  ModalTag,
  FormField,
  FormSelect,
  ModalActions,
  InfoRow,
} from './modalUi';

const CATEGORIES = [
  { value: 'UI Design', label: 'UI/UX Design' },
  { value: 'Website Development', label: 'Frontend Development' },
  { value: 'Data Analysis', label: 'Data Analysis' },
  { value: 'Tools', label: 'Tools' },
  { value: 'Proficiency', label: 'Proficiency' },
];

function categoryLabel(cat) {
  return CATEGORIES.find((c) => c.value === cat)?.label || cat;
}

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
  const { data: skillsRes, isLoading } = useSkills({ category, all: isAuthenticated });
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
    if (!open) {
      setSelected(null);
      setForm(emptyForm);
      setMode('view');
      setPreview(false);
      setToolInput('');
      return;
    }
    setItems(skills);
    if (skills.length > 0) {
      const pick = selected ? skills.find((s) => s.id === selected.id) || skills[0] : skills[0];
      setSelected(pick);
      setForm(skillToForm(pick));
      setMode(isAuthenticated ? 'edit' : 'view');
    }
  }, [open, skills, isAuthenticated]);

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
      const remaining = items.filter((s) => s.id !== selected.id);
      if (remaining.length > 0) {
        setSelected(remaining[0]);
        setForm(skillToForm(remaining[0]));
      } else {
        setSelected(null);
        setForm(emptyForm);
        setMode('view');
      }
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <ModalOverlay onClose={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="relative w-full max-w-[980px] max-h-[92vh] rounded-3xl bg-white dark:bg-[#2a1e26] shadow-2xl overflow-hidden flex flex-col modal-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader
              icon={BarChart3}
              iconShape="square"
              title={
                <>
                  Detail Keahlian Utama <Sparkles size={16} className="text-pink" />
                </>
              }
              subtitle="Kelola semua keahlian utama yang Anda miliki."
              onClose={onClose}
            />

            <div className="flex-1 overflow-y-auto">
              <div className="grid lg:grid-cols-[2fr_3fr] divide-y lg:divide-y-0 lg:divide-x divide-pink-soft/40">
                {/* Left — skill list */}
                <div className="p-5 sm:p-6 flex flex-col min-h-[420px]">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <SectionTitle>
                      Daftar Keahlian <Sparkle size={10} />
                    </SectionTitle>
                    {isAuthenticated && (
                      <ModalAddButton onClick={startCreate}>Tambah Keahlian</ModalAddButton>
                    )}
                  </div>

                  <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[50vh] lg:max-h-none pr-1">
                    {isLoading ? (
                      [1, 2, 3].map((i) => <div key={i} className="skeleton h-20 rounded-2xl" />)
                    ) : items.length === 0 ? (
                      <p className="text-sm text-muted text-center py-10">Belum ada keahlian.</p>
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
                            className={`relative flex items-center gap-2.5 rounded-2xl border p-3.5 transition-all cursor-pointer ${
                              isSelected
                                ? 'border-pink bg-pink-soft/20 shadow-[0_0_0_1px_rgba(248,87,166,0.35)]'
                                : 'border-pink-soft/50 hover:border-pink/35 bg-white dark:bg-[#352630]'
                            }`}
                            onClick={() => selectItem(skill)}
                          >
                            {isAuthenticated && (
                              <span className="shrink-0 cursor-grab text-muted/60 hover:text-pink">
                                <GripVertical size={16} />
                              </span>
                            )}
                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-pink-soft/60 dark:bg-pink/15 text-pink">
                              <Icon size={18} />
                            </span>
                            <div className="min-w-0 flex-1 pr-1">
                              <p className="font-semibold text-sm text-ink truncate leading-tight">{skill.name}</p>
                              <p className="text-[11px] text-muted truncate mt-0.5">{categoryLabel(skill.category)}</p>
                              <div className="mt-2 h-1.5 rounded-full bg-gray-200 dark:bg-[#4a3540] overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-pink to-pink-deep"
                                  style={{ width: `${skill.level}%` }}
                                />
                              </div>
                            </div>
                            <div className="shrink-0 flex flex-col items-end gap-1">
                              <span className="text-sm font-bold text-pink">{skill.level}%</span>
                              {isAuthenticated && (
                                <ModalEditButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    selectItem(skill);
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {isAuthenticated && (
                    <p className="mt-4 flex items-center gap-1.5 text-[11px] text-pink font-medium">
                      <Info size={12} className="shrink-0" />
                      Drag & drop untuk mengubah urutan keahlian.
                    </p>
                  )}
                </div>

                {/* Right — form */}
                <div className="p-5 sm:p-6 overflow-y-auto max-h-[70vh] lg:max-h-none">
                  {!selected && mode !== 'create' ? (
                    <div className="h-full min-h-[300px] flex items-center justify-center text-muted text-sm">
                      Pilih keahlian dari daftar di sebelah kiri.
                    </div>
                  ) : preview ? (
                    <PreviewPanel form={form} onClose={() => setPreview(false)} />
                  ) : isAuthenticated ? (
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <SectionTitle>
                          Edit Keahlian <Sparkle size={10} />
                        </SectionTitle>
                        <PreviewButton onClick={() => setPreview(true)} />
                      </div>

                      <form onSubmit={handleSave} className="space-y-4">
                        <FormField
                          label="Nama Keahlian"
                          icon={PenTool}
                          value={form.name}
                          onChange={(v) => setForm({ ...form, name: v })}
                          required
                        />

                        <FormSelect
                          label="Kategori"
                          icon={LayoutGrid}
                          value={form.category}
                          onChange={(v) => setForm({ ...form, category: v })}
                          options={CATEGORIES}
                        />

                        <div>
                          <label className="text-xs font-semibold text-muted mb-1.5 block">
                            Persentase Kemampuan
                          </label>
                          <div className="relative mb-2">
                            <Star size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-pink/70 pointer-events-none" />
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={form.level}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  level: Math.min(100, Math.max(0, Number(e.target.value) || 0)),
                                })
                              }
                              className="modal-input w-full rounded-xl border border-pink-soft/70 bg-white dark:bg-[#352630] py-2.5 pl-9 pr-10 text-sm font-semibold text-ink outline-none focus:border-pink"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-pink">%</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={form.level}
                            onChange={(e) => setForm({ ...form, level: Number(e.target.value) })}
                            className="w-full accent-pink h-2 cursor-pointer"
                          />
                          <div className="mt-2 h-2 rounded-full bg-gray-200 dark:bg-[#4a3540] overflow-hidden">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-pink to-pink-deep"
                              animate={{ width: `${form.level}%` }}
                              transition={{ duration: 0.25 }}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-muted mb-1.5 block">Deskripsi (opsional)</label>
                          <div className="relative">
                            <FileText size={14} className="absolute left-3 top-3 text-pink/70" />
                            <textarea
                              rows={3}
                              value={form.description}
                              onChange={(e) => setForm({ ...form, description: e.target.value })}
                              placeholder="Deskripsi singkat tentang keahlian..."
                              className="modal-input w-full rounded-xl border border-pink-soft/70 bg-white dark:bg-[#352630] py-2.5 pl-9 pr-4 text-sm text-ink outline-none focus:border-pink resize-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-muted mb-1.5 block">
                            Tools / Teknologi (opsional)
                          </label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {form.tools.map((tool) => (
                              <ModalTag key={tool} onRemove={() => removeTool(tool)}>
                                {tool}
                              </ModalTag>
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
                              placeholder="Nama tool..."
                              className="modal-input flex-1 rounded-xl border border-pink-soft/70 bg-white dark:bg-[#352630] py-2 px-3 text-sm text-ink outline-none focus:border-pink"
                            />
                            <ModalAddButton onClick={addTool} className="!rounded-xl !px-3 !py-2 !text-xs">
                              Tambah
                            </ModalAddButton>
                          </div>
                        </div>

                        <FormField
                          label="Urutan"
                          icon={ListOrdered}
                          type="number"
                          value={form.order}
                          onChange={(v) => setForm({ ...form, order: v })}
                          hint="Semakin kecil angka, semakin tinggi posisinya."
                        />

                        <label className="flex items-center justify-between gap-3 rounded-xl border border-pink-soft/60 bg-pink-light/30 dark:bg-[#352630] px-4 py-3 cursor-pointer">
                          <span className="text-sm font-medium text-ink">
                            Aktif (Akan ditampilkan di halaman publik)
                          </span>
                          <div className="relative shrink-0">
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

                        <ModalActions
                          onCancel={() => {
                            if (selected) setForm(skillToForm(selected));
                            else onClose();
                          }}
                          onDelete={handleDelete}
                          saving={saving}
                          showDelete={mode === 'edit' && !!selected?.id}
                        />
                      </form>
                    </div>
                  ) : (
                    <PreviewPanel form={skillToForm(selected)} />
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
  const Icon = getSkillIcon({ category: data.category, icon: data.icon });
  const tools = Array.isArray(data.tools) ? data.tools : [];

  return (
    <div className="space-y-4">
      {onClose && (
        <div className="flex justify-between items-center mb-2">
          <SectionTitle>
            Preview Keahlian <Eye size={14} />
          </SectionTitle>
          <button type="button" onClick={onClose} className="text-xs text-pink font-medium hover:underline">
            Kembali ke form
          </button>
        </div>
      )}
      <div className="rounded-2xl border border-pink-soft/60 bg-pink-light/40 dark:bg-[#352630] p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-pink/10">
            <Icon size={22} className="text-pink" />
          </div>
          <div className="flex-1">
            <p className="font-display text-lg font-semibold text-ink">{data.name || '—'}</p>
            <p className="text-sm text-muted">{categoryLabel(data.category) || '—'}</p>
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
                <span key={t} className="modal-tag">
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
