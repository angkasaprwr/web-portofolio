import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Sparkle } from '../../components/common/Decorations';
import SEO from '../../components/common/SEO';

const schema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export default function AdminLoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  if (!loading && isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname || '/admin'} replace />;
  }

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await login(values.email, values.password);
      toast.success('Login berhasil');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login gagal');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Admin Login" />
      <div className="min-h-screen bg-hero grid place-items-center px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md glass-strong rounded-3xl p-8 shadow-soft"
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-1 mb-2">
              <span className="font-display text-3xl text-pink font-semibold">Sukma.</span>
              <Sparkle size={14} />
            </div>
            <p className="text-sm text-muted">Masuk ke Dashboard Admin</p>
          </div>

          <label className="block text-sm font-medium mb-1.5">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full rounded-xl border border-pink-soft px-4 py-3 text-sm outline-none focus:border-pink mb-1"
            placeholder="admin@sukma.dev"
          />
          {errors.email && <p className="text-xs text-red-500 mb-3">{errors.email.message}</p>}

          <label className="block text-sm font-medium mb-1.5 mt-3">Password</label>
          <input
            type="password"
            {...register('password')}
            className="w-full rounded-xl border border-pink-soft px-4 py-3 text-sm outline-none focus:border-pink mb-1"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-xs text-red-500 mb-3">{errors.password.message}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full mt-6">
            {submitting ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>
    </>
  );
}
