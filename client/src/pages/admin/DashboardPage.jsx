import { FolderKanban, Sparkles, Briefcase, Award, Activity } from 'lucide-react';
import { useDashboard } from '../../hooks/usePortfolio';
import SEO from '../../components/common/SEO';

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();

  if (isLoading) {
    return <div className="skeleton h-64 w-full rounded-3xl" />;
  }

  const stats = [
    { label: 'Projects', value: data?.stats?.projects || 0, icon: FolderKanban, color: 'bg-pink/10 text-pink' },
    { label: 'Skills', value: data?.stats?.skills || 0, icon: Sparkles, color: 'bg-gold/10 text-gold' },
    { label: 'Experiences', value: data?.stats?.experiences || 0, icon: Briefcase, color: 'bg-pink-soft text-pink' },
    { label: 'Certificates', value: data?.stats?.certificates || 0, icon: Award, color: 'bg-gold-soft text-gold' },
  ];

  const maxCat = Math.max(...(data?.charts?.projectsByCategory?.map((c) => c.count) || [1]), 1);

  return (
    <>
      <SEO title="Admin Dashboard" />
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-semibold">Overview</h1>
          <p className="text-sm text-muted mt-1">Ringkasan konten portfolio Anda</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-2xl bg-white p-5 shadow-card border border-white">
                <div className={`inline-grid h-10 w-10 place-items-center rounded-xl ${s.color} mb-3`}>
                  <Icon size={18} />
                </div>
                <p className="font-display text-3xl font-semibold">{s.value}</p>
                <p className="text-sm text-muted">{s.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-card">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Activity size={16} className="text-pink" /> Projects by Category
            </h2>
            <div className="space-y-3">
              {(data?.charts?.projectsByCategory || []).map((item) => (
                <div key={item.category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.category}</span>
                    <span className="font-semibold text-pink">{item.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-pink-soft overflow-hidden">
                    <div
                      className="h-full bg-pink rounded-full"
                      style={{ width: `${(item.count / maxCat) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-card">
            <h2 className="font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {(data?.recentActivities || []).map((log) => (
                <div key={log.id} className="flex gap-3 text-sm border-b border-pink-soft/40 pb-3">
                  <span className="rounded-full bg-pink/10 text-pink px-2 py-0.5 text-xs font-semibold h-fit">
                    {log.action}
                  </span>
                  <div>
                    <p className="font-medium">{log.entity || 'system'}</p>
                    <p className="text-xs text-muted">
                      {new Date(log.createdAt).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
              {!data?.recentActivities?.length && (
                <p className="text-sm text-muted">Belum ada aktivitas.</p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card">
          <h2 className="font-semibold mb-4">Recent Projects</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-pink-soft">
                  <th className="pb-2 font-medium">Judul</th>
                  <th className="pb-2 font-medium">Kategori</th>
                  <th className="pb-2 font-medium">Dibuat</th>
                </tr>
              </thead>
              <tbody>
                {(data?.recentProjects || []).map((p) => (
                  <tr key={p.id} className="border-b border-pink-soft/40">
                    <td className="py-3 font-medium">{p.title}</td>
                    <td className="py-3 text-pink">{p.category}</td>
                    <td className="py-3 text-muted">
                      {new Date(p.createdAt).toLocaleDateString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
