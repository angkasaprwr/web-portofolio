import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import SEO from '../../components/common/SEO';
import { useSocialLinks } from '../../hooks/usePortfolio';
import { socialApi } from '../../services/apiServices';
import { Modal, Input, Select } from './SkillsPage';

const empty = { platform: 'whatsapp', label: '', url: '', icon: '', order: 0, isActive: true };

export default function AdminSocialPage() {
  const { data: items = [], isLoading } = useSocialLinks();
  const queryClient = useQueryClient();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);

  const save = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        platform: form.platform,
        label: form.label || form.platform,
        url: form.url,
        icon: form.icon || form.platform,
        order: Number(form.order) || 0,
        isActive: form.isActive !== false,
      };
      if (modal === 'edit') await socialApi.update(form.id, payload);
      else await socialApi.create(payload);
      await queryClient.invalidateQueries({ queryKey: ['social-links'] });
      toast.success('Social link disimpan');
      setModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan');
    }
  };

  const remove = async (id) => {
    if (!confirm('Hapus link?')) return;
    try {
      await socialApi.remove(id);
      await queryClient.invalidateQueries({ queryKey: ['social-links'] });
      toast.success('Dihapus');
    } catch {
      toast.error('Gagal menghapus');
    }
  };

  return (
    <>
      <SEO title="Admin · Social Media" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold">Social Media</h1>
            <p className="text-sm text-muted">Kelola tautan kontak & sosial</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setForm(empty);
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
                  <th className="p-3">Platform</th>
                  <th className="p-3">Label</th>
                  <th className="p-3">URL</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-pink-soft/40">
                    <td className="p-3 font-medium capitalize">{item.platform}</td>
                    <td className="p-3">{item.label}</td>
                    <td className="p-3 text-muted truncate max-w-xs">{item.url}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setForm(item);
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
        <Modal title={modal === 'edit' ? 'Edit Link' : 'Tambah Link'} onClose={() => setModal(null)}>
          <form onSubmit={save} className="space-y-3">
            <Select
              label="Platform"
              value={form.platform}
              onChange={(v) => setForm({ ...form, platform: v })}
              options={['whatsapp', 'email', 'github', 'linkedin', 'instagram', 'dribbble']}
            />
            <Input label="Label" value={form.label || ''} onChange={(v) => setForm({ ...form, label: v })} />
            <Input label="URL" value={form.url} onChange={(v) => setForm({ ...form, url: v })} required />
            <Input label="Order" type="number" value={form.order} onChange={(v) => setForm({ ...form, order: v })} />
            <button type="submit" className="btn-primary w-full">Simpan</button>
          </form>
        </Modal>
      )}
    </>
  );
}
