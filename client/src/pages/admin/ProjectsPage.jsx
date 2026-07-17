import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import SEO from '../../components/common/SEO';
import { useProjects } from '../../hooks/usePortfolio';
import { projectsApi } from '../../services/apiServices';
import { Modal, Input, Select } from './SkillsPage';
import { assetUrl } from '../../lib/api';

const empty = {
  title: '',
  category: 'UI Design',
  description: '',
  shortDesc: '',
  techStack: '',
  githubUrl: '',
  demoUrl: '',
  role: '',
  status: 'completed',
  featured: false,
  order: 0,
  startDate: '',
  endDate: '',
};

export default function AdminProjectsPage() {
  const { data, isLoading } = useProjects({ all: true, limit: 100 });
  const queryClient = useQueryClient();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState(null);
  const projects = data?.data || [];

  const openCreate = () => {
    setForm(empty);
    setFile(null);
    setModal('create');
  };
  const openEdit = (item) => {
    setForm({
      ...item,
      techStack: (item.techStack || []).join(', '),
      startDate: item.startDate ? item.startDate.slice(0, 10) : '',
      endDate: item.endDate ? item.endDate.slice(0, 10) : '',
    });
    setFile(null);
    setModal('edit');
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries({
        title: form.title,
        category: form.category,
        description: form.description,
        shortDesc: form.shortDesc || '',
        techStack: form.techStack,
        githubUrl: form.githubUrl || '',
        demoUrl: form.demoUrl || '',
        role: form.role || '',
        status: form.status,
        featured: String(!!form.featured),
        order: String(form.order || 0),
        startDate: form.startDate || '',
        endDate: form.endDate || '',
        isActive: 'true',
      }).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('thumbnail', file);

      if (modal === 'edit') await projectsApi.update(form.id, fd);
      else await projectsApi.create(fd);
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project disimpan');
      setModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan');
    }
  };

  const remove = async (id) => {
    if (!confirm('Hapus project ini?')) return;
    try {
      await projectsApi.remove(id);
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project dihapus');
    } catch {
      toast.error('Gagal menghapus');
    }
  };

  return (
    <>
      <SEO title="Admin · Project" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold">Project</h1>
            <p className="text-sm text-muted">Kelola karya portfolio</p>
          </div>
          <button type="button" onClick={openCreate} className="btn-primary !py-2">
            <Plus size={16} /> Tambah
          </button>
        </div>

        <div className="rounded-2xl bg-white shadow-card overflow-x-auto">
          {isLoading ? (
            <div className="skeleton h-48 m-4" />
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-pink-light text-left">
                <tr>
                  <th className="p-3">Thumbnail</th>
                  <th className="p-3">Judul</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Featured</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id} className="border-t border-pink-soft/40">
                    <td className="p-3">
                      <div className="h-12 w-16 rounded-lg bg-pink-soft overflow-hidden">
                        {p.thumbnail && <img src={assetUrl(p.thumbnail)} alt="" className="h-full w-full object-cover" />}
                      </div>
                    </td>
                    <td className="p-3 font-medium">{p.title}</td>
                    <td className="p-3 text-pink">{p.category}</td>
                    <td className="p-3">{p.featured ? '✓' : '—'}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-pink-soft/50 text-pink">
                          <Pencil size={14} />
                        </button>
                        <button type="button" onClick={() => remove(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal && (
        <Modal title={modal === 'edit' ? 'Edit Project' : 'Tambah Project'} onClose={() => setModal(null)}>
          <form onSubmit={save} className="space-y-3">
            <Input label="Judul" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
            <Select label="Kategori" value={form.category} onChange={(v) => setForm({ ...form, category: v })} options={['UI Design', 'Website', 'Data Analysis', 'Lainnya']} />
            <Input label="Deskripsi Singkat" value={form.shortDesc || ''} onChange={(v) => setForm({ ...form, shortDesc: v })} />
            <Input label="Deskripsi" as="textarea" rows={4} value={form.description} onChange={(v) => setForm({ ...form, description: v })} required />
            <Input label="Tech Stack (pisahkan koma)" value={form.techStack || ''} onChange={(v) => setForm({ ...form, techStack: v })} />
            <Input label="Role" value={form.role || ''} onChange={(v) => setForm({ ...form, role: v })} />
            <Input label="GitHub URL" value={form.githubUrl || ''} onChange={(v) => setForm({ ...form, githubUrl: v })} />
            <Input label="Demo URL" value={form.demoUrl || ''} onChange={(v) => setForm({ ...form, demoUrl: v })} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Mulai" type="date" value={form.startDate || ''} onChange={(v) => setForm({ ...form, startDate: v })} />
              <Input label="Selesai" type="date" value={form.endDate || ''} onChange={(v) => setForm({ ...form, endDate: v })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Thumbnail</label>
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              Featured
            </label>
            <button type="submit" className="btn-primary w-full">Simpan</button>
          </form>
        </Modal>
      )}
    </>
  );
}
