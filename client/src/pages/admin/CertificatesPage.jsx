import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import SEO from '../../components/common/SEO';
import { useCertificates } from '../../hooks/usePortfolio';
import { certificatesApi } from '../../services/apiServices';
import { Modal, Input } from './SkillsPage';

const empty = { title: '', issuer: '', description: '', credentialUrl: '', issueDate: '', order: 0 };

export default function AdminCertificatesPage() {
  const { data, isLoading } = useCertificates({ all: true });
  const queryClient = useQueryClient();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState(null);
  const items = data?.data || [];

  const save = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries({
        title: form.title,
        issuer: form.issuer,
        description: form.description || '',
        credentialUrl: form.credentialUrl || '',
        issueDate: form.issueDate || '',
        order: String(form.order || 0),
        isActive: 'true',
      }).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('image', file);
      if (modal === 'edit') await certificatesApi.update(form.id, fd);
      else await certificatesApi.create(fd);
      await queryClient.invalidateQueries({ queryKey: ['certificates'] });
      toast.success('Sertifikat disimpan');
      setModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan');
    }
  };

  const remove = async (id) => {
    if (!confirm('Hapus sertifikat?')) return;
    try {
      await certificatesApi.remove(id);
      await queryClient.invalidateQueries({ queryKey: ['certificates'] });
      toast.success('Dihapus');
    } catch {
      toast.error('Gagal menghapus');
    }
  };

  return (
    <>
      <SEO title="Admin · Sertifikat" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold">Sertifikat</h1>
            <p className="text-sm text-muted">Kelola sertifikat & kursus</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setForm(empty);
              setFile(null);
              setModal('create');
            }}
            className="btn-primary !py-2"
          >
            <Plus size={16} /> Tambah
          </button>
        </div>
        <div className="rounded-2xl bg-white shadow-card overflow-x-auto">
          {isLoading ? (
            <div className="skeleton h-40 m-4" />
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-pink-light text-left">
                <tr>
                  <th className="p-3">Judul</th>
                  <th className="p-3">Penerbit</th>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-pink-soft/40">
                    <td className="p-3 font-medium">{item.title}</td>
                    <td className="p-3">{item.issuer}</td>
                    <td className="p-3 text-muted">
                      {item.issueDate ? new Date(item.issueDate).toLocaleDateString('id-ID') : '—'}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setForm({
                              ...item,
                              issueDate: item.issueDate ? item.issueDate.slice(0, 10) : '',
                            });
                            setFile(null);
                            setModal('edit');
                          }}
                          className="p-1.5 rounded-lg hover:bg-pink-soft/50 text-pink"
                        >
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
        <Modal title={modal === 'edit' ? 'Edit Sertifikat' : 'Tambah Sertifikat'} onClose={() => setModal(null)}>
          <form onSubmit={save} className="space-y-3">
            <Input label="Judul" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
            <Input label="Penerbit" value={form.issuer} onChange={(v) => setForm({ ...form, issuer: v })} required />
            <Input label="Deskripsi" as="textarea" rows={3} value={form.description || ''} onChange={(v) => setForm({ ...form, description: v })} />
            <Input label="Credential URL" value={form.credentialUrl || ''} onChange={(v) => setForm({ ...form, credentialUrl: v })} />
            <Input label="Tanggal" type="date" value={form.issueDate || ''} onChange={(v) => setForm({ ...form, issueDate: v })} />
            <div>
              <label className="text-sm font-medium mb-1 block">Gambar</label>
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm" />
            </div>
            <button type="submit" className="btn-primary w-full">Simpan</button>
          </form>
        </Modal>
      )}
    </>
  );
}
