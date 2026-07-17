import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import SEO from '../../components/common/SEO';
import { useAbout } from '../../hooks/usePortfolio';
import { aboutApi, uploadApi } from '../../services/apiServices';

export default function AdminAboutPage() {
  const { data: about, isLoading } = useAbout();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, setValue, watch } = useForm();

  useEffect(() => {
    if (about) {
      reset({
        fullName: about.fullName || '',
        shortName: about.shortName || '',
        profession: about.profession || '',
        headline: about.headline || '',
        bio: about.bio || '',
        shortBio: about.shortBio || '',
        story: about.story || '',
        quote: about.quote || '',
        education: about.education || '',
        birthDate: about.birthDate ? about.birthDate.slice(0, 10) : '',
        yearsExperience: about.yearsExperience || 0,
        projectsCount: about.projectsCount || 0,
        clientsCount: about.clientsCount || 0,
        commitment: about.commitment || '100%',
        photo: about.photo || '',
        heroPhoto: about.heroPhoto || '',
        hobbies: JSON.stringify(about.hobbies || [], null, 2),
        educationTimeline: JSON.stringify(about.educationTimeline || [], null, 2),
      });
    }
  }, [about, reset]);

  const onUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { data } = await uploadApi.image(file, 'images');
      setValue(field, data.data.url);
      toast.success('Foto diunggah');
    } catch {
      toast.error('Gagal mengunggah foto');
    }
  };

  const onSubmit = async (values) => {
    setSaving(true);
    try {
      const payload = {
        ...values,
        yearsExperience: Number(values.yearsExperience),
        projectsCount: Number(values.projectsCount),
        clientsCount: Number(values.clientsCount),
        birthDate: values.birthDate || null,
        hobbies: values.hobbies ? JSON.parse(values.hobbies) : [],
        educationTimeline: values.educationTimeline ? JSON.parse(values.educationTimeline) : [],
      };
      await aboutApi.upsert(payload);
      await queryClient.invalidateQueries({ queryKey: ['about'] });
      toast.success('Data tentang saya disimpan');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <div className="skeleton h-96 rounded-3xl" />;

  const photo = watch('photo');

  return (
    <>
      <SEO title="Admin · Tentang Saya" />
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="font-display text-3xl font-semibold">Tentang Saya</h1>
          <p className="text-sm text-muted">Kelola profil & bio portfolio</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl bg-white p-6 shadow-card space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama Lengkap" {...register('fullName')} />
            <Field label="Nama Panggil" {...register('shortName')} />
            <Field label="Profesi" {...register('profession')} />
            <Field label="Headline" {...register('headline')} />
            <Field label="Tanggal Lahir" type="date" {...register('birthDate')} />
            <Field label="Pendidikan" {...register('education')} />
            <Field label="Tahun Pengalaman" type="number" {...register('yearsExperience')} />
            <Field label="Jumlah Proyek" type="number" {...register('projectsCount')} />
            <Field label="Jumlah Klien" type="number" {...register('clientsCount')} />
            <Field label="Komitmen" {...register('commitment')} />
          </div>
          <Field label="Bio Singkat" as="textarea" rows={2} {...register('shortBio')} />
          <Field label="Bio" as="textarea" rows={4} {...register('bio')} />
          <Field label="Cerita" as="textarea" rows={5} {...register('story')} />
          <Field label="Quote" as="textarea" rows={2} {...register('quote')} />
          <Field label="Hobbies (JSON)" as="textarea" rows={4} {...register('hobbies')} />
          <Field label="Timeline Pendidikan (JSON)" as="textarea" rows={5} {...register('educationTimeline')} />

          <div>
            <label className="text-sm font-medium mb-1.5 block">Foto Profil</label>
            <input type="file" accept="image/*" onChange={(e) => onUpload(e, 'photo')} className="text-sm" />
            <input type="hidden" {...register('photo')} />
            {photo && <img src={photo} alt="" className="mt-2 h-24 w-24 rounded-full object-cover" />}
          </div>

          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </>
  );
}

function Field({ label, as = 'input', ...props }) {
  const Comp = as;
  return (
    <div>
      <label className="text-sm font-medium mb-1.5 block">{label}</label>
      <Comp
        className="w-full rounded-xl border border-pink-soft px-3 py-2.5 text-sm outline-none focus:border-pink"
        {...props}
      />
    </div>
  );
}
