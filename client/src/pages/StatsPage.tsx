import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Calendar, FolderOpen, Code2, Briefcase, ArrowLeft } from 'lucide-react';
import { api } from '../lib/api';

interface Stats {
  views: number;
  created_at: string;
  slug: string;
  projectCount: number;
  skillCount: number;
  experienceCount: number;
}

export default function StatsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    api.get(`/api/portfolio/${slug}/stats`)
      .then((r) => setStats(r.data))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-black mb-3">Stats Not Found</h1>
        <Link to="/" className="text-primary underline">← Back to Home</Link>
      </div>
    );
  }

  const cards = [
    { label: 'Total Views',   value: stats.views,           icon: <Eye size={22} /> },
    { label: 'Projects',      value: stats.projectCount,    icon: <FolderOpen size={22} /> },
    { label: 'Skills',        value: stats.skillCount,      icon: <Code2 size={22} /> },
    { label: 'Experience',    value: stats.experienceCount, icon: <Briefcase size={22} /> },
  ];

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center py-16 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full max-w-2xl">
        <Link
          to={`/p/${slug}`}
          className="inline-flex items-center gap-1 text-gray-500 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Portfolio
        </Link>

        <h1 className="text-4xl font-black mb-2">Portfolio Stats</h1>
        <p className="text-gray-500 text-sm mb-2 flex items-center gap-1">
          <Calendar size={14} />
          Created {new Date(stats.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <p className="text-gray-600 text-sm mb-10">
          /p/<span className="text-primary">{stats.slug}</span>
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((c) => (
            <motion.div
              key={c.label}
              className="bg-dark-card border border-dark-border rounded-2xl p-5 flex flex-col items-center text-center"
              whileHover={{ scale: 1.03 }}
            >
              <div className="text-primary mb-3">{c.icon}</div>
              <p className="text-3xl font-black text-white">{c.value}</p>
              <p className="text-gray-500 text-xs mt-1">{c.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
