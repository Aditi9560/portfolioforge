import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, MapPin, Github, Linkedin, Twitter, BarChart2, Download, Loader2, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../lib/api';

interface Portfolio {
  id: string;
  slug: string;
  name: string;
  title?: string;
  bio?: string;
  photo_url?: string;
  email?: string;
  location?: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  skills: string[];
  projects: { name: string; description?: string; url?: string }[];
  experience: { company: string; role: string; duration?: string; description?: string }[];
  education: { school: string; degree?: string; year?: string }[];
  certifications: { name: string; issuer?: string; year?: string }[];
  accent_color: string;
  views: number;
}

async function downloadPDF(name: string) {
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  const el = document.getElementById('portfolio-content');
  if (!el) return;

  const canvas = await html2canvas(el, {
    scale: 2,
    backgroundColor: '#0a0a0a',
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.92);
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const imgH = (canvas.height * pageW) / canvas.width;

  let y = 0;
  while (y < imgH) {
    if (y > 0) pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, -y, pageW, imgH);
    y += pageH;
  }

  pdf.save(`${name.toLowerCase().replace(/\s+/g, '-')}-portfolio.pdf`);
}

export default function PortfolioPage() {
  const { slug } = useParams<{ slug: string }>();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    if (!slug) return;
    api.get(`/api/portfolio/${slug}`)
      .then((r) => setPortfolio(r.data))
      .catch((e) => { if (e.response?.status === 404) setNotFound(true); })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !portfolio) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-black mb-3">Portfolio Not Found</h1>
        <p className="text-gray-400 mb-6">The slug <code className="text-primary">/{slug}</code> doesn't exist.</p>
        <Link to="/" className="text-primary underline">← Back to Home</Link>
      </div>
    );
  }

  const accent   = portfolio.accent_color || '#10b981';
  const canEdit  = new URLSearchParams(window.location.search).get('edit') === 'true';

  const handleDownload = async () => {
    setPdfLoading(true);
    try {
      await downloadPDF(portfolio.name);
      toast.success('PDF downloaded!');
    } catch {
      toast.error('PDF generation failed');
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen px-4 py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div id="portfolio-content" className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          {portfolio.photo_url && (
            <img
              src={portfolio.photo_url}
              alt={portfolio.name}
              className="w-24 h-24 rounded-full object-cover border-2 mb-4"
              style={{ borderColor: accent }}
            />
          )}
          <h1 className="text-4xl font-black" style={{ color: accent }}>{portfolio.name}</h1>
          {portfolio.title && <p className="text-gray-300 text-lg mt-1">{portfolio.title}</p>}
          {portfolio.location && (
            <p className="flex items-center gap-1 text-gray-500 text-sm mt-1">
              <MapPin size={14} /> {portfolio.location}
            </p>
          )}
          {portfolio.bio && (
            <p className="text-gray-400 mt-4 max-w-xl">{portfolio.bio}</p>
          )}

          {/* Links */}
          <div className="flex gap-4 mt-5 text-gray-400">
            {portfolio.email && (
              <a href={`mailto:${portfolio.email}`} className="hover:text-white transition-colors"><Mail size={20} /></a>
            )}
            {portfolio.github_url && (
              <a href={portfolio.github_url} target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><Github size={20} /></a>
            )}
            {portfolio.linkedin_url && (
              <a href={portfolio.linkedin_url} target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><Linkedin size={20} /></a>
            )}
            {portfolio.twitter_url && (
              <a href={portfolio.twitter_url} target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><Twitter size={20} /></a>
            )}
          </div>
        </div>

        {/* Skills */}
        {portfolio.skills?.length > 0 && (
          <Section title="Skills" accent={accent}>
            <div className="flex flex-wrap gap-2">
              {portfolio.skills.map((s) => (
                <span key={s} className="px-3 py-1 rounded-full text-sm border" style={{ borderColor: accent, color: accent }}>
                  {s}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Projects */}
        {portfolio.projects?.length > 0 && (
          <Section title="Projects" accent={accent}>
            <div className="space-y-4">
              {portfolio.projects.map((p, i) => (
                <div key={i} className="bg-dark-card border border-dark-border rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white">{p.name}</h3>
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noreferrer" className="text-xs text-gray-500 hover:text-primary transition-colors">
                        View →
                      </a>
                    )}
                  </div>
                  {p.description && <p className="text-gray-400 text-sm mt-1">{p.description}</p>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Experience */}
        {portfolio.experience?.length > 0 && (
          <Section title="Experience" accent={accent}>
            <div className="space-y-4">
              {portfolio.experience.map((e, i) => (
                <div key={i} className="border-l-2 pl-4" style={{ borderColor: accent }}>
                  <p className="font-bold text-white">{e.role}</p>
                  <p className="text-gray-400 text-sm">{e.company}{e.duration ? ` · ${e.duration}` : ''}</p>
                  {e.description && <p className="text-gray-500 text-sm mt-1">{e.description}</p>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Education */}
        {portfolio.education?.length > 0 && (
          <Section title="Education" accent={accent}>
            <div className="space-y-3">
              {portfolio.education.map((e, i) => (
                <div key={i}>
                  <p className="font-bold text-white">{e.school}</p>
                  <p className="text-gray-400 text-sm">{e.degree}{e.year ? ` · ${e.year}` : ''}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Certifications */}
        {portfolio.certifications?.length > 0 && (
          <Section title="Certifications" accent={accent}>
            <div className="space-y-3">
              {portfolio.certifications.map((c, i) => (
                <div key={i}>
                  <p className="font-bold text-white">{c.name}</p>
                  <p className="text-gray-400 text-sm">{c.issuer}{c.year ? ` · ${c.year}` : ''}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Stats link */}
        <div className="text-center pt-4">
          <Link
            to={`/p/${slug}/stats`}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-primary text-sm transition-colors"
          >
            <BarChart2 size={16} /> View Stats
          </Link>
        </div>
      </div>

      {/* Edit Portfolio button — only visible to owner via ?edit=true */}
      {canEdit && (
        <a
          href={`/create?slug=${slug}`}
          className="no-print fixed top-4 right-4 z-50 flex items-center gap-2 text-sm px-4 py-2 rounded-lg border transition-all"
          style={{ background: '#111', borderColor: '#1f1f1f' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = '#10b981';
            (e.currentTarget as HTMLAnchorElement).style.color = '#10b981';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = '#1f1f1f';
            (e.currentTarget as HTMLAnchorElement).style.color = '';
          }}
        >
          <Pencil size={14} /> Edit Portfolio
        </a>
      )}

      {/* Download PDF button */}
      <button
        onClick={handleDownload}
        disabled={pdfLoading}
        className="no-print fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-dark-card border border-dark-border text-zinc-300 hover:text-white hover:border-primary px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg disabled:opacity-60"
      >
        {pdfLoading
          ? <><Loader2 size={15} className="animate-spin" /> Generating...</>
          : <><Download size={15} /> Download PDF</>
        }
      </button>
    </motion.div>
  );
}

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4" style={{ color: accent }}>{title}</h2>
      {children}
    </div>
  );
}
