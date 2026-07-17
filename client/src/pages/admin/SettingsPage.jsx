import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import SEO from '../../components/common/SEO';
import { useSettings } from '../../hooks/usePortfolio';
import { settingsApi, authApi } from '../../services/apiServices';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(8, 'Minimal 8 karakter'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Konfirmasi password tidak cocok',
    path: ['confirmPassword'],
  });

export default function AdminSettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const queryClient = useQueryClient();
  const [siteForm, setSiteForm] = useState({ siteName: '', tagline: '', description: '' });
  const [statsForm, setStatsForm] = useState({
    projectsCompleted: '',
    happyClients: '',
    yearsExperience: '',
    commitment: '',
  });
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(passwordSchema) });

  useEffect(() => {
    if (settings?.site) setSiteForm(settings.site);
    if (settings?.stats) setStatsForm(settings.stats);
  }, [settings]);

  const saveSettings = async () => {
    setSaving(true);
    try {
      await settingsApi.upsert('site', siteForm);
      await settingsApi.upsert('stats', statsForm);
      await queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Pengaturan disimpan');
    } catch {
      toast.error('Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (values) => {
    try {
      await authApi.changePassword(values);
      toast.success('Password diubah. Silakan login ulang.');
      reset();
      localStorage.removeItem('accessToken');
      window.location.href = '/admin/login';
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengubah password');
    }
  };

  if (isLoading) return <div className="skeleton h-64 rounded-3xl" />;

  return (
    <>
      <SEO title="Admin · Pengaturan" />
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="font-display text-3xl font-semibold">Pengaturan</h1>
          <p className="text-sm text-muted">Konfigurasi situs & keamanan</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card space-y-4">
          <h2 className="font-semibold">Informasi Situs</h2>
          <Field label="Nama Situs" value={siteForm.siteName || ''} onChange={(v) => setSiteForm({ ...siteForm, siteName: v })} />
          <Field label="Tagline" value={siteForm.tagline || ''} onChange={(v) => setSiteForm({ ...siteForm, tagline: v })} />
          <Field label="Deskripsi" as="textarea" rows={3} value={siteForm.description || ''} onChange={(v) => setSiteForm({ ...siteForm, description: v })} />
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card space-y-4">
          <h2 className="font-semibold">Statistik Beranda</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Proyek Selesai" value={statsForm.projectsCompleted || ''} onChange={(v) => setStatsForm({ ...statsForm, projectsCompleted: v })} />
            <Field label="Klien Puas" value={statsForm.happyClients || ''} onChange={(v) => setStatsForm({ ...statsForm, happyClients: v })} />
            <Field label="Tahun Pengalaman" value={statsForm.yearsExperience || ''} onChange={(v) => setStatsForm({ ...statsForm, yearsExperience: v })} />
            <Field label="Komitmen" value={statsForm.commitment || ''} onChange={(v) => setStatsForm({ ...statsForm, commitment: v })} />
          </div>
          <button type="button" onClick={saveSettings} disabled={saving} className="btn-primary">
            {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>

        <form onSubmit={handleSubmit(changePassword)} className="rounded-2xl bg-white p-6 shadow-card space-y-4">
          <h2 className="font-semibold">Ubah Password</h2>
          <div>
            <label className="text-sm font-medium mb-1 block">Password Saat Ini</label>
            <input type="password" {...register('currentPassword')} className="w-full rounded-xl border border-pink-soft px-3 py-2.5 text-sm outline-none focus:border-pink" />
            {errors.currentPassword && <p className="text-xs text-red-500 mt-1">{errors.currentPassword.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Password Baru</label>
            <input type="password" {...register('newPassword')} className="w-full rounded-xl border border-pink-soft px-3 py-2.5 text-sm outline-none focus:border-pink" />
            {errors.newPassword && <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Konfirmasi Password</label>
            <input type="password" {...register('confirmPassword')} className="w-full rounded-xl border border-pink-soft px-3 py-2.5 text-sm outline-none focus:border-pink" />
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <button type="submit" className="btn-outline">Ubah Password</button>
        </form>
      </div>
    </>
  );
}

function Field({ label, value, onChange, as = 'input', rows }) {
  const Comp = as;
  return (
    <div>
      <label className="text-sm font-medium mb-1 block">{label}</label>
      <Comp
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-pink-soft px-3 py-2.5 text-sm outline-none focus:border-pink"
      />
    </div>
  );
}
