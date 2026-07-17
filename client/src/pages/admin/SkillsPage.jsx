import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import SEO from '../../components/common/SEO';
import { useSkills } from '../../hooks/usePortfolio';
import { skillsApi } from '../../services/apiServices';

const empty = { name: '', category: 'UI Design', level: 80, icon: '', description: '', isFeatured: false, order: 0, isActive: true };

export default function AdminSkillsPage() {
  const { data, isLoading } = useSkills({ all: true });
  const queryClient = useQueryClient();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const skills = data?.data || [];

  const openCreate = () => {
    setForm(empty);
    setModal('create');
  };
  const openEdit = (item) => {
    setForm({ ...item });
    setModal('edit');
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        category: form.category,
        level: Number(form.level),
        icon: form.icon || null,
        description: form.description || null,
        isFeatured: !!form.isFeatured,
        order: Number(form.order) || 0,
        isActive: form.isActive !== false,
      };
      if (modal === 'edit') await skillsApi.update(form.id, payload);
      else await skillsApi.create(payload);
      await queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast.success('Skill disimpan');
      setModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan');
    }
  };

  const remove = async (id) => {
    if (!confirm('Hapus skill ini?')) return;
    try {
      await skillsApi.remove(id);
      await queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast.success('Skill dihapus');
    } catch {
      toast.error('Gagal menghapus');
    }
  };

  return (
    <>
      <SEO title="Admin · Skill" />
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold">Skill</h1>
            <p className="text-sm text-muted">Kelola keahlian & tools</p>
          </div>
          <button type="button" onClick={openCreate} className="btn-primary !py-2">
            <Plus size={16} /> Tambah
          </button>
        </div>

        <div className="rounded-2xl bg-white shadow-card overflow-hidden">
          {isLoading ? (
            <div className="skeleton h-48 m-4" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-pink-light text-left">
                  <tr>
                    <th className="p-3">Nama</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Level</th>
                    <th className="p-3">Featured</th>
                    <th className="p-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {skills.map((s) => (
                    <tr key={s.id} className="border-t border-pink-soft/40">
                      <td className="p-3 font-medium">{s.name}</td>
                      <td className="p-3 text-pink">{s.category}</td>
                      <td className="p-3">{s.level}%</td>
                      <td className="p-3">{s.isFeatured ? '✓' : '—'}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button type="button" onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-pink-soft/50 text-pink">
                            <Pencil size={14} />
                          </button>
                          <button type="button" onClick={() => remove(s.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {modal && (
        <Modal title={modal === 'edit' ? 'Edit Skill' : 'Tambah Skill'} onClose={() => setModal(null)}>
          <form onSubmit={save} className="space-y-3">
            <Input label="Nama" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <Select
              label="Kategori"
              value={form.category}
              onChange={(v) => setForm({ ...form, category: v })}
              options={['UI Design', 'Website Development', 'Data Analysis', 'Tools', 'Proficiency']}
            />
            <Input label="Level (0-100)" type="number" value={form.level} onChange={(v) => setForm({ ...form, level: v })} />
            <Input label="Icon" value={form.icon || ''} onChange={(v) => setForm({ ...form, icon: v })} />
            <Input label="Order" type="number" value={form.order} onChange={(v) => setForm({ ...form, order: v })} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
              Featured
            </label>
            <button type="submit" className="btn-primary w-full">Simpan</button>
          </form>
        </Modal>
      )}
    </>
  );
}

export function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/40">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl">{title}</h3>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-pink-soft/50">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Input({ label, value, onChange, type = 'text', required, as = 'input', rows }) {
  const Comp = as;
  return (
    <div>
      <label className="text-sm font-medium mb-1 block">{label}</label>
      <Comp
        type={as === 'input' ? type : undefined}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-xl border border-pink-soft px-3 py-2.5 text-sm outline-none focus:border-pink"
      />
    </div>
  );
}

export function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-sm font-medium mb-1 block">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-pink-soft px-3 py-2.5 text-sm outline-none focus:border-pink"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
