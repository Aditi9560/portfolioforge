import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Pencil, Trash2, ChevronUp, ChevronDown, Upload, Link2, Star, Loader2 } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';
import { api } from '../../lib/api';
import type { Project } from './types';

const MAX_PROJECTS = 8;
const INPUT = 'w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all text-sm';
const LABEL = 'block text-zinc-400 text-sm mb-1.5 font-medium';

const empty = (): Project => ({
  id: uuid(), title: '', description: '', live_url: '', github_url: '',
  tech_stack: [], image_url: '', featured: false,
});

function ImagePicker({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [tab, setTab]     = useState<'upload' | 'url'>('upload');
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput]   = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post('/api/upload', fd);
      onChange(res.data.url);
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  return (
    <div>
      <label className={LABEL}>Project Image</label>
      <div className="flex gap-1 bg-dark-card border border-dark-border rounded-xl p-1 mb-2 w-fit">
        {(['upload', 'url'] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)}
            className={clsx('px-3 py-1 rounded-lg text-xs font-semibold transition-all',
              tab === t ? 'bg-primary text-black' : 'text-zinc-400 hover:text-white'
            )}>
            {t === 'upload' ? <><Upload size={10} className="inline mr-1" />Upload</> : <><Link2 size={10} className="inline mr-1" />URL</>}
          </button>
        ))}
      </div>
      <div className="flex gap-3 items-start">
        {value && (
          <div className="relative flex-shrink-0">
            <img src={value} alt="preview" className="w-16 h-12 rounded-lg object-cover border border-dark-border" />
            <button type="button" onClick={() => onChange('')}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">×</button>
          </div>
        )}
        <div className="flex-1">
          {tab === 'upload' ? (
            <div
              className={clsx('border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all text-xs',
                dragging ? 'border-primary bg-primary/5' : 'border-dark-border hover:border-zinc-600')}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) uploadFile(f); }}
              onClick={() => inputRef.current?.click()}
            >
              <input ref={inputRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); }} />
              {uploading
                ? <span className="flex items-center justify-center gap-1 text-zinc-400"><Loader2 size={12} className="animate-spin" />Uploading...</span>
                : <span className="text-zinc-500">Drop or <span className="text-primary">click</span></span>
              }
            </div>
          ) : (
            <div className="flex gap-2">
              <input type="url" value={urlInput} onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://..." className={INPUT} />
              <button type="button"
                onClick={() => { if (urlInput.trim()) { onChange(urlInput.trim()); setUrlInput(''); } }}
                className="bg-primary text-black px-3 rounded-xl text-xs font-semibold hover:brightness-110 flex-shrink-0">Load</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectForm({
  initial, onSave, onCancel,
}: { initial?: Project; onSave: (p: Project) => void; onCancel: () => void }) {
  const [p, setP] = useState<Project>(initial ?? empty());
  const [techInput, setTechInput] = useState('');

  const set = (k: keyof Project, v: Project[keyof Project]) =>
    setP((prev) => ({ ...prev, [k]: v }));

  const addTech = () => {
    const t = techInput.trim();
    if (t && !(p.tech_stack as string[]).includes(t)) {
      setP((prev) => ({ ...prev, tech_stack: [...prev.tech_stack, t] }));
    }
    setTechInput('');
  };

  const validate = () => {
    if (!p.title.trim()) { toast.error('Project title is required'); return false; }
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
          <label className={LABEL}>Project Title <span className="text-primary">*</span></label>
          <input value={p.title} onChange={(e) => set('title', e.target.value)} placeholder="My Awesome Project" className={INPUT} />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-400 pb-2.5">
            <div
              onClick={() => set('featured', !p.featured)}
              className={clsx('w-9 h-5 rounded-full transition-colors flex items-center px-0.5',
                p.featured ? 'bg-primary' : 'bg-zinc-700')}
            >
              <div className={clsx('w-4 h-4 rounded-full bg-white transition-transform',
                p.featured ? 'translate-x-4' : 'translate-x-0')} />
            </div>
            <Star size={14} className={p.featured ? 'text-yellow-400' : 'text-zinc-600'} />
            Mark as Featured
          </label>
        </div>
      </div>

      <div>
        <label className={LABEL}>Description <span className="text-zinc-600">(max 200 chars)</span></label>
        <textarea rows={3} maxLength={200} value={p.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="What does this project do and what makes it special?"
          className={clsx(INPUT, 'resize-none')} />
        <p className="text-right text-xs text-zinc-600 mt-1">{p.description.length}/200</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Live URL</label>
          <input type="url" value={p.live_url} onChange={(e) => set('live_url', e.target.value)} placeholder="https://your-project.com" className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>GitHub URL</label>
          <input type="url" value={p.github_url} onChange={(e) => set('github_url', e.target.value)} placeholder="https://github.com/..." className={INPUT} />
        </div>
      </div>

      <div>
        <label className={LABEL}>Tech Stack</label>
        <div className="flex gap-2 mb-2">
          <input value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
            placeholder="Type a technology and press Enter"
            className={INPUT} />
          <button type="button" onClick={addTech} className="bg-dark-card border border-dark-border text-zinc-400 hover:text-white px-3 rounded-xl text-sm transition-colors flex-shrink-0">+</button>
        </div>
        {p.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {(p.tech_stack as string[]).map((t) => (
              <span key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs">
                {t}
                <button type="button" onClick={() => setP((prev) => ({ ...prev, tech_stack: prev.tech_stack.filter((x) => x !== t) }))}><X size={10} /></button>
              </span>
            ))}
          </div>
        )}
      </div>

      <ImagePicker value={p.image_url} onChange={(url) => set('image_url', url)} />

      <div className="flex gap-3 pt-1">
        <button type="button"
          onClick={() => validate() && onSave(p)}
          className="bg-primary text-black font-semibold px-6 py-2.5 rounded-xl text-sm hover:brightness-110 transition-all">
          Save Project
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
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

export function Step3Projects({ projects, setProjects }: Props) {
  const [adding, setAdding]       = useState(false);
  const [editing, setEditing]     = useState<string | null>(null);

  const saveNew = (p: Project) => { setProjects((prev) => [...prev, p]); setAdding(false); };
  const saveEdit = (p: Project) => { setProjects((prev) => prev.map((x) => x.id === p.id ? p : x)); setEditing(null); };
  const remove = (id: string) => setProjects((p) => p.filter((x) => x.id !== id));
  const move = (id: string, dir: 'up' | 'down') => {
    setProjects((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if ((dir === 'up' && idx === 0) || (dir === 'down' && idx === prev.length - 1)) return prev;
      const arr = [...prev];
      const swap = dir === 'up' ? idx - 1 : idx + 1;
      [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
      return arr;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-white mb-1">Projects</h2>
          <p className="text-zinc-500 text-sm">Showcase your best work.</p>
        </div>
        <span className="text-xs text-zinc-500 bg-dark-card border border-dark-border px-2.5 py-1 rounded-full mt-1">{projects.length}/{MAX_PROJECTS}</span>
      </div>

      {/* Add button */}
      {!adding && editing === null && projects.length < MAX_PROJECTS && (
        <button type="button" onClick={() => setAdding(true)}
          className="w-full border-2 border-dashed border-dark-border rounded-2xl py-4 text-zinc-500 hover:border-primary hover:text-primary transition-all text-sm flex items-center justify-center gap-2">
          <Plus size={16} /> Add Project
        </button>
      )}

      {/* Add form */}
      <AnimatePresence>
        {adding && (
          <ProjectForm onSave={saveNew} onCancel={() => setAdding(false)} />
        )}
      </AnimatePresence>

      {/* Project cards */}
      <AnimatePresence>
        {projects.map((p) => (
          <motion.div
            key={p.id}
            layout
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden"
          >
            {editing === p.id ? (
              <div className="p-4">
                <ProjectForm initial={p} onSave={saveEdit} onCancel={() => setEditing(null)} />
              </div>
            ) : (
              <div className="p-4 flex gap-3 items-start">
                {p.image_url && (
                  <img src={p.image_url} alt={p.title} className="w-16 h-12 rounded-lg object-cover flex-shrink-0 border border-dark-border" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm truncate">{p.title}</span>
                    {p.featured && <Star size={12} className="text-yellow-400 flex-shrink-0" fill="currentColor" />}
                  </div>
                  {p.description && <p className="text-zinc-500 text-xs mt-0.5 line-clamp-1">{p.description}</p>}
                  {p.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {(p.tech_stack as string[]).slice(0, 4).map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{t}</span>
                      ))}
                      {p.tech_stack.length > 4 && <span className="text-[10px] text-zinc-500">+{p.tech_stack.length - 4}</span>}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button type="button" onClick={() => move(p.id, 'up')} className="p-1 text-zinc-600 hover:text-white transition-colors"><ChevronUp size={14} /></button>
                  <button type="button" onClick={() => move(p.id, 'down')} className="p-1 text-zinc-600 hover:text-white transition-colors"><ChevronDown size={14} /></button>
                  <button type="button" onClick={() => setEditing(p.id)} className="p-1 text-zinc-600 hover:text-primary transition-colors"><Pencil size={14} /></button>
                  <button type="button" onClick={() => remove(p.id)} className="p-1 text-zinc-600 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
