import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Pencil, Trash2 } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';
import { MONTHS, YEARS_PAST } from './types';
import type { ExperienceEntry } from './types';

const INPUT = 'w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all text-sm';
const SELECT = clsx(INPUT, 'cursor-pointer');
const LABEL = 'block text-zinc-400 text-sm mb-1.5 font-medium';

const emptyEntry = (): ExperienceEntry => ({
  id: uuid(), company: '', role: '',
  from_month: 'Jan', from_year: '2022',
  to_month: 'Jan', to_year: '2024',
  current: false, bullets: [''],
});

function ExperienceForm({
  initial, onSave, onCancel,
}: { initial?: ExperienceEntry; onSave: (e: ExperienceEntry) => void; onCancel: () => void }) {
  const [e, setE] = useState<ExperienceEntry>(initial ?? emptyEntry());

  const set = <K extends keyof ExperienceEntry>(k: K, v: ExperienceEntry[K]) =>
    setE((prev) => ({ ...prev, [k]: v }));

  const setBullet = (i: number, val: string) =>
    setE((prev) => { const b = [...prev.bullets]; b[i] = val; return { ...prev, bullets: b }; });

  const addBullet = () => {
    if (e.bullets.length < 5) setE((prev) => ({ ...prev, bullets: [...prev.bullets, ''] }));
  };

  const removeBullet = (i: number) =>
    setE((prev) => ({ ...prev, bullets: prev.bullets.filter((_, idx) => idx !== i) }));

  const validate = () => {
    if (!e.company.trim()) { toast.error('Company name is required'); return false; }
    if (!e.role.trim()) { toast.error('Role/title is required'); return false; }
    return true;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="bg-dark-bg border border-dark-border rounded-2xl p-5 space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Company Name <span className="text-primary">*</span></label>
          <input value={e.company} onChange={(ev) => set('company', ev.target.value)} placeholder="Acme Corp" className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Role / Title <span className="text-primary">*</span></label>
          <input value={e.role} onChange={(ev) => set('role', ev.target.value)} placeholder="Senior Software Engineer" className={INPUT} />
        </div>
      </div>

      {/* Date range */}
      <div className="space-y-3">
        <div>
          <label className={LABEL}>From</label>
          <div className="grid grid-cols-2 gap-3">
            <select value={e.from_month} onChange={(ev) => set('from_month', ev.target.value)} className={SELECT}>
              {MONTHS.map((m) => <option key={m}>{m}</option>)}
            </select>
            <select value={e.from_year} onChange={(ev) => set('from_year', ev.target.value)} className={SELECT}>
              {YEARS_PAST.map((y) => <option key={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-400">
          <div
            onClick={() => set('current', !e.current)}
            className={clsx('w-9 h-5 rounded-full transition-colors flex items-center px-0.5 cursor-pointer',
              e.current ? 'bg-primary' : 'bg-zinc-700')}
          >
            <div className={clsx('w-4 h-4 rounded-full bg-white transition-transform',
              e.current ? 'translate-x-4' : 'translate-x-0')} />
          </div>
          Currently working here
        </label>

        {!e.current && (
          <div>
            <label className={LABEL}>To</label>
            <div className="grid grid-cols-2 gap-3">
              <select value={e.to_month} onChange={(ev) => set('to_month', ev.target.value)} className={SELECT}>
                {MONTHS.map((m) => <option key={m}>{m}</option>)}
              </select>
              <select value={e.to_year} onChange={(ev) => set('to_year', ev.target.value)} className={SELECT}>
                {YEARS_PAST.map((y) => <option key={y}>{y}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Bullets */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={LABEL} style={{ margin: 0 }}>Key Highlights</label>
          {e.bullets.length < 5 && (
            <button type="button" onClick={addBullet}
              className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
              <Plus size={12} /> Add bullet
            </button>
          )}
        </div>
        <div className="space-y-2">
          {e.bullets.map((b, i) => (
            <div key={i} className="flex gap-2 items-center">
              <span className="text-zinc-600 text-sm">•</span>
              <input
                value={b}
                onChange={(ev) => setBullet(i, ev.target.value)}
                placeholder="Describe an achievement or responsibility..."
                className={clsx(INPUT, 'flex-1')}
              />
              {e.bullets.length > 1 && (
                <button type="button" onClick={() => removeBullet(i)}
                  className="text-zinc-600 hover:text-red-400 transition-colors flex-shrink-0">
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button type="button"
          onClick={() => validate() && onSave(e)}
          className="bg-primary text-black font-semibold px-6 py-2.5 rounded-xl text-sm hover:brightness-110 transition-all">
          Save Experience
        </button>
        <button type="button" onClick={onCancel}
          className="border border-dark-border text-zinc-400 hover:text-white px-6 py-2.5 rounded-xl text-sm transition-colors">
          Cancel
        </button>
      </div>
    </motion.div>
  );
}

interface Props {
  experience: ExperienceEntry[];
  setExperience: React.Dispatch<React.SetStateAction<ExperienceEntry[]>>;
}

export function Step4Experience({ experience, setExperience }: Props) {
  const [adding, setAdding]   = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  const saveNew  = (e: ExperienceEntry) => { setExperience((p) => [...p, e]); setAdding(false); };
  const saveEdit = (e: ExperienceEntry) => { setExperience((p) => p.map((x) => x.id === e.id ? e : x)); setEditing(null); };
  const remove   = (id: string) => setExperience((p) => p.filter((x) => x.id !== id));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl text-white mb-1">Experience</h2>
        <p className="text-zinc-500 text-sm">Your work history and achievements.</p>
      </div>

      {!adding && editing === null && (
        <button type="button" onClick={() => setAdding(true)}
          className="w-full border-2 border-dashed border-dark-border rounded-2xl py-4 text-zinc-500 hover:border-primary hover:text-primary transition-all text-sm flex items-center justify-center gap-2">
          <Plus size={16} /> Add Experience
        </button>
      )}

      <AnimatePresence>
        {adding && <ExperienceForm onSave={saveNew} onCancel={() => setAdding(false)} />}
      </AnimatePresence>

      {/* Timeline list */}
      <div className="space-y-3">
        <AnimatePresence>
          {experience.map((e) => (
            <motion.div
              key={e.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              {editing === e.id ? (
                <ExperienceForm initial={e} onSave={saveEdit} onCancel={() => setEditing(null)} />
              ) : (
                <div className="flex gap-4 bg-dark-card border border-dark-border rounded-2xl p-4">
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-primary mt-1" />
                    <div className="w-0.5 flex-1 bg-dark-border" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-white text-sm">{e.role}</p>
                        <p className="text-primary text-xs">{e.company}</p>
                        <p className="text-zinc-500 text-xs mt-0.5">
                          {e.from_month} {e.from_year} – {e.current ? 'Present' : `${e.to_month} ${e.to_year}`}
                        </p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button type="button" onClick={() => setEditing(e.id)} className="p-1 text-zinc-600 hover:text-primary transition-colors"><Pencil size={13} /></button>
                        <button type="button" onClick={() => remove(e.id)} className="p-1 text-zinc-600 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                      </div>
                    </div>
                    {e.bullets.filter(Boolean).length > 0 && (
                      <ul className="mt-2 space-y-0.5">
                        {e.bullets.filter(Boolean).map((b, i) => (
                          <li key={i} className="text-zinc-400 text-xs flex gap-1.5"><span className="text-primary mt-0.5">•</span>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
