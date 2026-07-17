import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus, Trash2, Download } from 'lucide-react';
import SEO from '../../components/common/SEO';
import { cvApi } from '../../services/apiServices';
import { assetUrl } from '../../lib/api';
import { Modal, Input } from './SkillsPage';

export default function AdminCvPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-cv'],
    queryFn: async () => (await cvApi.adminList()).data.data,
  });
  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState('CV Sukma');
  const [file, setFile] = useState(null);
  const items = data || [];

  const save = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Pilih file CV');
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('file', file);
      fd.append('isActive', 'true');
      await cvApi.create(fd);
      await queryClient.invalidateQueries({ queryKey: ['admin-cv'] });
      await queryClient.invalidateQueries({ queryKey: ['cv'] });
      toast.success('CV diunggah');
      setModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal upload');
    }
  };

  const remove = async (id) => {
    if (!confirm('Hapus CV?')) return;
    try {
      await cvApi.remove(id);
      await queryClient.invalidateQueries({ queryKey: ['admin-cv'] });
      await queryClient.invalidateQueries({ queryKey: ['cv'] });
      toast.success('CV dihapus');
    } catch {
      toast.error('Gagal menghapus');
    }
  };

  const activate = async (id) => {
    try {
      await cvApi.update(id, (() => {
        const fd = new FormData();
        fd.append('isActive', 'true');
        return fd;
      })());
      await queryClient.invalidateQueries({ queryKey: ['admin-cv'] });
      await queryClient.invalidateQueries({ queryKey: ['cv'] });
      toast.success('CV diaktifkan');
    } catch {
      toast.error('Gagal mengaktifkan');
    }
  };

  return (
    <>
      <SEO title="Admin · CV" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold">CV</h1>
            <p className="text-sm text-muted">Upload & kelola file CV</p>
          </div>
          <button type="button" onClick={() => setModal(true)} className="btn-primary !py-2">
            <Plus size={16} /> Upload CV
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
                  <th className="p-3">File</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Downloads</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-pink-soft/40">
                    <td className="p-3 font-medium">{item.title}</td>
                    <td className="p-3">{item.fileName}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${item.isActive ? 'bg-pink text-white' : 'bg-pink-soft text-muted'}`}>
                        {item.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="p-3">{item.downloads}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <a href={assetUrl(item.fileUrl)} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg hover:bg-pink-soft/50 text-pink">
                          <Download size={14} />
                        </a>
                        {!item.isActive && (
                          <button type="button" onClick={() => activate(item.id)} className="text-xs text-pink font-medium">
                            Aktifkan
                          </button>
                        )}
                        <button type="button" onClick={() => remove(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!items.length && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-muted">
                      Belum ada CV. Upload terlebih dahulu.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {modal && (
        <Modal title="Upload CV" onClose={() => setModal(false)}>
          <form onSubmit={save} className="space-y-3">
            <Input label="Judul" value={title} onChange={setTitle} required />
            <div>
              <label className="text-sm font-medium mb-1 block">File (PDF/DOC)</label>
              <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] || null)} required className="text-sm" />
            </div>
            <button type="submit" className="btn-primary w-full">Upload</button>
          </form>
        </Modal>
      )}
    </>
  );
}
