import { useFormContext, useWatch } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Loader2, Download, Eye, ChevronUp, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import type { AboutValues, TemplateChoice, PaperSizeChoice } from './types';

const SWATCHES = [
  { color: '#10b981', label: 'Emerald' },
  { color: '#3b82f6', label: 'Blue' },
  { color: '#8b5cf6', label: 'Purple' },
  { color: '#f59e0b', label: 'Amber' },
  { color: '#ec4899', label: 'Pink' },
  { color: '#ef4444', label: 'Red' },
];

const DEFAULT_ORDER = ['Experience', 'Skills', 'Projects', 'Education', 'Certifications'];

// ─── Mini preview components ───────────────────────────────────────────────

function ClassicPreview() {
  return (
    <div className="w-full h-[88px] bg-white rounded-lg p-3 flex flex-col gap-1 overflow-hidden">
      <div className="h-1.5 w-20 bg-gray-800 rounded-sm" />
      <div className="h-1 w-14 bg-gray-400 rounded-sm" />
      <div className="h-px w-full bg-gray-300 mt-0.5" />
      <div className="h-px w-full bg-gray-800 mt-0.5" />
      <div className="h-1 w-16 bg-gray-500 rounded-sm mt-1" />
      <div className="h-px w-full bg-gray-200 mb-0.5" />
      <div className="flex flex-col gap-0.5">
        <div className="h-0.5 w-full bg-gray-200 rounded" />
        <div className="h-0.5 w-5/6 bg-gray-200 rounded" />
        <div className="h-0.5 w-4/5 bg-gray-200 rounded" />
        <div className="h-0.5 w-full bg-gray-200 rounded" />
      </div>
    </div>
  );
}

function ModernPreview({ accent }: { accent: string }) {
  return (
    <div className="w-full h-[88px] bg-white rounded-lg p-3 flex flex-col gap-1 overflow-hidden">
      <div className="h-2 w-20 rounded-sm" style={{ backgroundColor: accent }} />
      <div className="h-1 w-14 bg-gray-300 rounded-sm" />
      <div className="h-0.5 w-full mt-0.5" style={{ backgroundColor: accent }} />
      <div className="flex items-center gap-1 mt-0.5">
        <div className="w-0.5 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: accent }} />
        <div className="h-1 w-14 rounded-sm" style={{ backgroundColor: accent, opacity: 0.65 }} />
      </div>
      <div className="flex flex-col gap-0.5 ml-1.5">
        <div className="h-0.5 w-full bg-gray-200 rounded" />
        <div className="h-0.5 w-5/6 bg-gray-200 rounded" />
        <div className="h-0.5 w-4/5 bg-gray-200 rounded" />
        <div className="h-0.5 w-full bg-gray-200 rounded" />
      </div>
    </div>
  );
}

function SidebarPreview({ accent }: { accent: string }) {
  // Build a CSS hex+alpha for sidebar bg: append '15' (≈8% opacity)
  const sidebarBg = `${accent}15`;
  return (
    <div className="w-full h-[88px] bg-white rounded-lg overflow-hidden flex">
      {/* Sidebar */}
      <div className="w-[33%] p-2 flex flex-col gap-1" style={{ backgroundColor: sidebarBg }}>
        <div className="w-5 h-5 rounded-full mx-auto mb-0.5" style={{ backgroundColor: accent }} />
        <div className="h-1 w-full bg-gray-400 rounded-sm" />
        <div className="h-px w-full bg-gray-300 mt-0.5" />
        <div className="h-0.5 w-full bg-gray-200 rounded" />
        <div className="h-0.5 w-5/6 bg-gray-200 rounded" />
        <div className="h-0.5 w-4/5 bg-gray-200 rounded" />
        <div className="h-0.5 w-3/4 bg-gray-200 rounded" />
      </div>
      {/* Main */}
      <div className="w-[67%] p-2 flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <div className="w-0.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: accent }} />
          <div className="h-1 w-12 rounded-sm" style={{ backgroundColor: accent, opacity: 0.65 }} />
        </div>
        <div className="flex flex-col gap-0.5 ml-1.5">
          <div className="h-0.5 w-full bg-gray-200 rounded" />
          <div className="h-0.5 w-5/6 bg-gray-200 rounded" />
          <div className="h-0.5 w-4/5 bg-gray-200 rounded" />
          <div className="h-0.5 w-full bg-gray-200 rounded" />
          <div className="h-0.5 w-5/6 bg-gray-200 rounded" />
          <div className="h-0.5 w-4/5 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

// ─── Template definitions ──────────────────────────────────────────────────

const TEMPLATES: {
  value: TemplateChoice;
  name: string;
  desc: string;
  bestFor: string;
}[] = [
  {
    value: 'Classic',
    name: 'Classic',
    desc: 'Traditional serif layout',
    bestFor: 'Finance, Law, Government',
  },
  {
    value: 'Modern',
    name: 'Modern',
    desc: 'Clean single-column (default)',
    bestFor: 'Tech, Startups, Product',
  },
  {
    value: 'Sidebar',
    name: 'Sidebar',
    desc: 'Two-column with sidebar',
    bestFor: 'Creative, Design, Marketing',
  },
];

// ─── Props ────────────────────────────────────────────────────────────────

interface Props {
  onDownload: () => Promise<void>;
  onPreview: () => void;
  downloading: boolean;
  selectedTemplate: TemplateChoice;
  setTemplate: (t: TemplateChoice) => void;
  paperSize: PaperSizeChoice;
  setPaperSize: (p: PaperSizeChoice) => void;
  sectionOrder: string[];
  setSectionOrder: React.Dispatch<React.SetStateAction<string[]>>;
}

// ─── Component ────────────────────────────────────────────────────────────

export function Step6Publish({
  onDownload, onPreview, downloading,
  selectedTemplate, setTemplate,
  paperSize, setPaperSize,
  sectionOrder, setSectionOrder,
}: Props) {
  const { setValue } = useFormContext<AboutValues>();
  const accent = useWatch<AboutValues, 'accent_color'>({ name: 'accent_color' }) || '#10b981';

  const moveSection = (idx: number, dir: 'up' | 'down') => {
    setSectionOrder((prev) => {
      const arr = [...prev];
      const target = dir === 'up' ? idx - 1 : idx + 1;
      if (target < 0 || target >= arr.length) return prev;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return arr;
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display font-bold text-2xl text-white mb-1">Resume Style &amp; Download</h2>
        <p className="text-zinc-500 text-sm">Choose a template, customize your resume, and download as PDF.</p>
      </div>

      {/* ── Template selector ── */}
      <div>
        <label className="block text-zinc-400 text-sm mb-3 font-medium">Template</label>
        <div className="grid grid-cols-3 gap-3">
          {TEMPLATES.map((t) => {
            const selected = selectedTemplate === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setTemplate(t.value)}
                className={clsx(
                  'relative flex flex-col rounded-xl border-2 overflow-hidden transition-all text-left',
                  selected
                    ? 'border-primary shadow-[0_0_0_1px_#10b981]'
                    : 'border-dark-border bg-dark-card hover:border-zinc-600'
                )}
              >
                {/* Visual preview */}
                <div className="p-2 bg-zinc-100">
                  {t.value === 'Classic' && <ClassicPreview />}
                  {t.value === 'Modern'  && <ModernPreview accent={accent} />}
                  {t.value === 'Sidebar' && <SidebarPreview accent={accent} />}
                </div>

                {/* Card body */}
                <div className="px-2.5 py-2 bg-dark-card flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-white text-xs font-semibold">{t.name}</p>
                    {selected && (
                      <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-black text-[10px] font-bold flex-shrink-0">✓</span>
                    )}
                  </div>
                  <p className="text-zinc-500 text-[10px] leading-snug">{t.bestFor}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Accent color ── */}
      <div>
        <label className="block text-zinc-400 text-sm mb-3 font-medium">Accent Color</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {SWATCHES.map((s) => (
            <button
              key={s.color}
              type="button"
              title={s.label}
              onClick={() => setValue('accent_color', s.color, { shouldDirty: true })}
              className={clsx(
                'w-8 h-8 rounded-full transition-all hover:scale-110',
                accent === s.color ? 'ring-2 ring-offset-2 ring-offset-dark-bg ring-white' : ''
              )}
              style={{ backgroundColor: s.color }}
            />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-dark-border flex-shrink-0" style={{ backgroundColor: accent }} />
          <input
            type="text"
            value={accent}
            onChange={(e) => {
              const v = e.target.value;
              if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setValue('accent_color', v, { shouldDirty: true });
            }}
            placeholder="#10b981"
            className="w-36 bg-dark-card border border-dark-border rounded-xl px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-primary transition-colors"
            maxLength={7}
          />
          <span className="text-zinc-500 text-xs">Custom hex color</span>
        </div>
      </div>

      {/* ── Paper size ── */}
      <div>
        <label className="block text-zinc-400 text-sm mb-3 font-medium">Paper Size</label>
        <div className="flex gap-2">
          {(['A4', 'Letter'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPaperSize(p)}
              className={clsx(
                'px-5 py-2 rounded-xl border-2 text-sm font-medium transition-all',
                paperSize === p
                  ? 'border-primary bg-primary/5 text-white'
                  : 'border-dark-border bg-dark-card text-zinc-400 hover:border-zinc-600'
              )}
            >
              {p}{p === 'A4' ? ' (International)' : ' (US)'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Section order ── */}
      <div>
        <label className="block text-zinc-400 text-sm mb-3 font-medium">Section Order</label>
        <div className="space-y-1.5">
          {sectionOrder.map((s, i) => (
            <div key={s} className="flex items-center gap-2 bg-dark-card border border-dark-border rounded-xl px-4 py-2.5">
              <span className="flex-1 text-white text-sm">{s}</span>
              <button
                type="button"
                onClick={() => moveSection(i, 'up')}
                disabled={i === 0}
                className="p-1 text-zinc-600 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronUp size={14} />
              </button>
              <button
                type="button"
                onClick={() => moveSection(i, 'down')}
                disabled={i === sectionOrder.length - 1}
                className="p-1 text-zinc-600 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronDown size={14} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setSectionOrder(DEFAULT_ORDER)}
          className="text-xs text-zinc-600 hover:text-zinc-400 mt-2 transition-colors"
        >
          Reset to default order
        </button>
      </div>

      {/* ── Download + Preview ── */}
      <div className="pt-2 space-y-3">
        <motion.button
          type="button"
          onClick={onDownload}
          disabled={downloading}
          className="w-full bg-primary text-black font-display font-bold text-lg py-5 rounded-2xl hover:brightness-110 disabled:opacity-60 transition-all flex items-center justify-center gap-3"
          style={{ boxShadow: '0 0 40px rgba(16,185,129,0.3)' }}
          animate={downloading ? {} : { scale: [1, 1.01, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ scale: 1.01, boxShadow: '0 0 50px rgba(16,185,129,0.45)' }}
          whileTap={{ scale: 0.98 }}
        >
          {downloading
            ? <><Loader2 size={20} className="animate-spin" />Generating PDF...</>
            : <><Download size={20} /> Download Resume PDF</>
          }
        </motion.button>

        <button
          type="button"
          onClick={onPreview}
          className="w-full border border-dark-border text-zinc-400 hover:text-white hover:border-zinc-500 py-3 rounded-2xl text-sm font-medium transition-all flex items-center justify-center gap-2"
        >
          <Eye size={16} /> Preview Resume
        </button>

        <p className="text-center text-zinc-600 text-xs">
          Free forever · No account needed · Instant download
        </p>
      </div>
    </div>
  );
}
