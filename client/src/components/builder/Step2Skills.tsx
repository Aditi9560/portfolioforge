import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { clsx } from 'clsx';
import type { Skill, SkillCategory } from './types';
import { CATEGORY_COLORS } from './types';

const QUICK_ADD = [
  'React','TypeScript','Node.js','Express','PostgreSQL','Python',
  'Docker','AWS','Azure','Git','MongoDB','Redis','GraphQL','Next.js',
];

const CATEGORIES: SkillCategory[] = [
  'Frontend','Backend','Database','Cloud & DevOps','Tools','Other',
];

const LEVEL_LABEL = (n: number) =>
  n <= 25 ? 'Beginner' : n <= 50 ? 'Intermediate' : n <= 75 ? 'Advanced' : 'Expert';

const INPUT = 'w-full bg-dark-card border border-dark-border rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all text-sm';
const LABEL = 'block text-zinc-400 text-sm mb-1.5 font-medium';

interface Props {
  skills: Skill[];
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
}

export function Step2Skills({ skills, setSkills }: Props) {
  const [name, setName]         = useState('');
  const [category, setCategory] = useState<SkillCategory>('Frontend');
  const [level, setLevel]       = useState(75);

  const addSkill = (skillName: string, cat: SkillCategory = category, lvl: number = level) => {
    if (!skillName.trim()) return;
    if (skills.some((s) => s.name.toLowerCase() === skillName.trim().toLowerCase())) return;
    setSkills((prev) => [
      ...prev,
      { id: uuid(), name: skillName.trim(), category: cat, level: lvl },
    ]);
  };

  const handleAdd = () => {
    addSkill(name);
    setName('');
    setLevel(75);
  };

  const remove = (id: string) => setSkills((p) => p.filter((s) => s.id !== id));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl text-white mb-1">Skills</h2>
        <p className="text-zinc-500 text-sm">Add technologies and tools you know.</p>
      </div>

      {/* Quick-add chips */}
      <div>
        <label className={LABEL}>Quick Add</label>
        <div className="flex flex-wrap gap-2">
          {QUICK_ADD.map((s) => {
            const exists = skills.some((sk) => sk.name === s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => !exists && addSkill(s, 'Frontend', 75)}
                disabled={exists}
                className={clsx(
                  'px-3 py-1 rounded-full text-xs font-medium border transition-all',
                  exists
                    ? 'bg-primary/20 border-primary/40 text-primary opacity-50 cursor-default'
                    : 'border-dark-border text-zinc-400 hover:border-primary hover:text-primary cursor-pointer'
                )}
              >
                {exists ? '✓ ' : '+ '}{s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Manual add form */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-5 space-y-4">
        <p className="text-zinc-400 text-sm font-medium flex items-center gap-1.5"><Plus size={14} />Add Custom Skill</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Skill Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
              placeholder="e.g. Kubernetes"
              className={INPUT}
            />
          </div>
          <div>
            <label className={LABEL}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as SkillCategory)}
              className={INPUT}
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={LABEL} style={{ margin: 0 }}>Proficiency</label>
            <span className="text-xs text-primary font-semibold">{level}% — {LEVEL_LABEL(level)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-primary bg-zinc-800"
          />
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!name.trim()}
          className="bg-primary text-black text-sm font-semibold px-5 py-2 rounded-xl hover:brightness-110 disabled:opacity-40 transition-all"
        >
          Add Skill
        </button>
      </div>

      {/* Added skills */}
      {skills.length > 0 && (
        <div>
          <label className={LABEL}>Added Skills ({skills.length})</label>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {skills.map((s) => (
                <motion.div
                  key={s.id}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border',
                    CATEGORY_COLORS[s.category]
                  )}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                  {s.name}
                  <span className="opacity-60 ml-0.5">{s.level}%</span>
                  <button
                    type="button"
                    onClick={() => remove(s.id)}
                    className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <X size={10} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
