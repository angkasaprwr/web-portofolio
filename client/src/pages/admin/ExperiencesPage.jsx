import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import SEO from '../../components/common/SEO';
import { useExperiences } from '../../hooks/usePortfolio';
import { experiencesApi } from '../../services/apiServices';
import { Modal, Input, Select } from './SkillsPage';

const empty = {
  title: '',
  company: '',
  location: '',
  type: 'Formal',
  category: 'Magang',
  description: '',
  shortDesc: '',
  skills: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  order: 0,
};

export default function AdminExperiencesPage() {
  const { data, isLoading } = useExperiences({ all: true, limit: 100 });
  const queryClient = useQueryClient();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [thumbnail, setThumbnail] = useState(null);
  const [document, setDocument] = useState(null);
  const items = data?.data || [];

  const openCreate = () => {
    setForm(empty);
    setThumbnail(null);
    setDocument(null);
    setModal('create');
  };
  const openEdit = (item) => {
    setForm({
      ...item,
      skills: (item.skills || []).join(', '),
      startDate: item.startDate ? item.startDate.slice(0, 10) : '',
      endDate: item.endDate ? item.endDate.slice(0, 10) : '',
    });
    setThumbnail(null);
    setDocument(null);
    setModal('edit');
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries({
        title: form.title,
        company: form.company,
        location: form.location || '',
        type: form.type,
        category: form.category,
        description: form.description,
        shortDesc: form.shortDesc || '',
        skills: form.skills,
        startDate: form.startDate,
        endDate: form.endDate || '',
        isCurrent: String(!!form.isCurrent),
        order: String(form.order || 0),
        isActive: 'true',
      }).forEach(([k, v]) => fd.append(k, v));
      if (thumbnail) fd.append('thumbnail', thumbnail);
      if (document) fd.append('document', document);

      if (modal === 'edit') await experiencesApi.update(form.id, fd);
      else await experiencesApi.create(fd);
      await queryClient.invalidateQueries({ queryKey: ['experiences'] });
      toast.success('Pengalaman disimpan');
      setModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan');
    }
  };

  const remove = async (id) => {
    if (!confirm('Hapus pengalaman ini?')) return;
    try {
      await experiencesApi.remove(id);
      await queryClient.invalidateQueries({ queryKey: ['experiences'] });
      toast.success('Pengalaman dihapus');
    } catch {
      toast.error('Gagal menghapus');
    }
  };

  const categoryOptions =
    form.type === 'Formal'
      ? ['Magang', 'Jobdesk']
      : ['Organisasi', 'Proyek Kelompok', 'Sertifikat & Kursus'];

  return (
    <>
      <SEO title="Admin · Pengalaman" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold">Pengalaman</h1>
            <p className="text-sm text-muted">Kelola pengalaman formal & informal</p>
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
                  <th className="p-3">Judul</th>
                  <th className="p-3">Instansi</th>
                  <th className="p-3">Tipe</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-pink-soft/40">
                    <td className="p-3 font-medium">{item.title}</td>
                    <td className="p-3">{item.company}</td>
                    <td className="p-3">{item.type}</td>
                    <td className="p-3 text-pink">{item.category}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-pink-soft/50 text-pink">
                          <Pencil size={14} />
                        </button>
                        <button type="button" onClick={() => remove(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500">
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
        <Modal title={modal === 'edit' ? 'Edit Pengalaman' : 'Tambah Pengalaman'} onClose={() => setModal(null)}>
          <form onSubmit={save} className="space-y-3">
            <Input label="Judul / Role" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
            <Input label="Instansi" value={form.company} onChange={(v) => setForm({ ...form, company: v })} required />
            <Input label="Lokasi" value={form.location || ''} onChange={(v) => setForm({ ...form, location: v })} />
            <Select
              label="Tipe"
              value={form.type}
              onChange={(v) =>
                setForm({
                  ...form,
                  type: v,
                  category: v === 'Formal' ? 'Magang' : 'Organisasi',
                })
              }
              options={['Formal', 'Informal']}
            />
            <Select label="Kategori" value={form.category} onChange={(v) => setForm({ ...form, category: v })} options={categoryOptions} />
            <Input label="Deskripsi" as="textarea" rows={4} value={form.description} onChange={(v) => setForm({ ...form, description: v })} required />
            <Input label="Skill (pisahkan koma)" value={form.skills || ''} onChange={(v) => setForm({ ...form, skills: v })} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Mulai" type="date" value={form.startDate} onChange={(v) => setForm({ ...form, startDate: v })} required />
              <Input label="Selesai" type="date" value={form.endDate || ''} onChange={(v) => setForm({ ...form, endDate: v })} />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!form.isCurrent} onChange={(e) => setForm({ ...form, isCurrent: e.target.checked })} />
              Masih berlangsung
            </label>
            <div>
              <label className="text-sm font-medium mb-1 block">Thumbnail</label>
              <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} className="text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Dokumen</label>
              <input type="file" accept=".pdf,.doc,.docx,image/*" onChange={(e) => setDocument(e.target.files?.[0] || null)} className="text-sm" />
            </div>
            <button type="submit" className="btn-primary w-full">Simpan</button>
          </form>
        </Modal>
      )}
    </>
  );
}
