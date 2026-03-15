import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Pencil, Trash2 } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';
import { YEARS_FUTURE } from './types';
import type { EducationEntry, CertEntry } from './types';

const INPUT = 'w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all text-sm';
const LABEL = 'block text-zinc-400 text-sm mb-1.5 font-medium';

const DEGREE_TYPES = ['B.Tech','B.Sc','M.Tech','MBA','Diploma','Other'];

const emptyEdu = (): EducationEntry => ({
  id: uuid(), institution: '', degree: 'B.Tech', field: '', grad_year: '2024', description: '',
});
const emptyCert = (): CertEntry => ({
  id: uuid(), name: '', issuer: '', year: '2024', cred_url: '',
});

function EducationForm({ initial, onSave, onCancel }: { initial?: EducationEntry; onSave: (e: EducationEntry) => void; onCancel: () => void }) {
  const [e, setE] = useState<EducationEntry>(initial ?? emptyEdu());
  const set = <K extends keyof EducationEntry>(k: K, v: EducationEntry[K]) => setE((p) => ({ ...p, [k]: v }));

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
      className="bg-dark-bg border border-dark-border rounded-2xl p-5 space-y-4">
      <div>
        <label className={LABEL}>Institution Name <span className="text-primary">*</span></label>
        <input value={e.institution} onChange={(ev) => set('institution', ev.target.value)} placeholder="MIT, IIT Bombay..." className={INPUT} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={LABEL}>Degree</label>
          <select value={e.degree} onChange={(ev) => set('degree', ev.target.value)} className={INPUT}>
            {DEGREE_TYPES.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className={LABEL}>Field of Study</label>
          <input value={e.field} onChange={(ev) => set('field', ev.target.value)} placeholder="Computer Science" className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Graduation Year</label>
          <select value={e.grad_year} onChange={(ev) => set('grad_year', ev.target.value)} className={INPUT}>
            {YEARS_FUTURE.map((y) => <option key={y}>{y}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className={LABEL}>Description <span className="text-zinc-600">(optional)</span></label>
        <textarea rows={2} value={e.description} onChange={(ev) => set('description', ev.target.value)}
          placeholder="Notable achievements, GPA, activities..." className={clsx(INPUT, 'resize-none')} />
      </div>
      <div className="flex gap-3">
        <button type="button"
          onClick={() => { if (!e.institution.trim()) { toast.error('Institution name required'); return; } onSave(e); }}
          className="bg-primary text-black font-semibold px-6 py-2 rounded-xl text-sm hover:brightness-110 transition-all">
          Add Education
        </button>
        <button type="button" onClick={onCancel} className="border border-dark-border text-zinc-400 hover:text-white px-6 py-2 rounded-xl text-sm transition-colors">Cancel</button>
      </div>
    </motion.div>
  );
}

function CertForm({ onSave, onCancel }: { onSave: (c: CertEntry) => void; onCancel: () => void }) {
  const [c, setC] = useState<CertEntry>(emptyCert());
  const set = <K extends keyof CertEntry>(k: K, v: CertEntry[K]) => setC((p) => ({ ...p, [k]: v }));

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
      className="bg-dark-bg border border-dark-border rounded-2xl p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Certification Name</label>
          <input value={c.name} onChange={(ev) => set('name', ev.target.value)} placeholder="AWS Certified Developer" className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Issuing Organization</label>
          <input value={c.issuer} onChange={(ev) => set('issuer', ev.target.value)} placeholder="Amazon Web Services" className={INPUT} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Year</label>
          <select value={c.year} onChange={(ev) => set('year', ev.target.value)} className={INPUT}>
            {YEARS_FUTURE.map((y) => <option key={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label className={LABEL}>Credential URL <span className="text-zinc-600">(optional)</span></label>
          <input type="url" value={c.cred_url} onChange={(ev) => set('cred_url', ev.target.value)} placeholder="https://..." className={INPUT} />
        </div>
      </div>
      <div className="flex gap-3">
        <button type="button"
          onClick={() => { if (!c.name.trim()) { toast.error('Cert name required'); return; } onSave(c); }}
          className="bg-primary text-black font-semibold px-6 py-2 rounded-xl text-sm hover:brightness-110 transition-all">
          Add Certification
        </button>
        <button type="button" onClick={onCancel} className="border border-dark-border text-zinc-400 hover:text-white px-6 py-2 rounded-xl text-sm transition-colors">Cancel</button>
      </div>
    </motion.div>
  );
}

interface Props {
  education: EducationEntry[];
  setEducation: React.Dispatch<React.SetStateAction<EducationEntry[]>>;
  certifications: CertEntry[];
  setCertifications: React.Dispatch<React.SetStateAction<CertEntry[]>>;
}

export function Step5Education({ education, setEducation, certifications, setCertifications }: Props) {
  const [addingEdu, setAddingEdu]   = useState(false);
  const [editingEdu, setEditingEdu] = useState<string | null>(null);
  const [addingCert, setAddingCert] = useState(false);

  return (
    <div className="space-y-8">
      {/* Education */}
      <div className="space-y-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-white mb-1">Education</h2>
          <p className="text-zinc-500 text-sm">Your academic background.</p>
        </div>

        {!addingEdu && editingEdu === null && (
          <button type="button" onClick={() => setAddingEdu(true)}
            className="w-full border-2 border-dashed border-dark-border rounded-2xl py-4 text-zinc-500 hover:border-primary hover:text-primary transition-all text-sm flex items-center justify-center gap-2">
            <Plus size={16} /> Add Education
          </button>
        )}

        <AnimatePresence>
          {addingEdu && <EducationForm onSave={(e) => { setEducation((p) => [...p, e]); setAddingEdu(false); }} onCancel={() => setAddingEdu(false)} />}
        </AnimatePresence>

        <div className="space-y-3">
          <AnimatePresence>
            {education.map((e) => (
              <motion.div key={e.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                {editingEdu === e.id ? (
                  <EducationForm initial={e}
                    onSave={(updated) => { setEducation((p) => p.map((x) => x.id === updated.id ? updated : x)); setEditingEdu(null); }}
                    onCancel={() => setEditingEdu(null)} />
                ) : (
                  <div className="flex gap-3 bg-dark-card border border-dark-border rounded-2xl p-4">
                    <div className="flex-1">
                      <p className="font-semibold text-white text-sm">{e.institution}</p>
                      <p className="text-primary text-xs">{e.degree}{e.field ? ` in ${e.field}` : ''} · {e.grad_year}</p>
                      {e.description && <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{e.description}</p>}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button type="button" onClick={() => setEditingEdu(e.id)} className="p-1 text-zinc-600 hover:text-primary transition-colors"><Pencil size={13} /></button>
                      <button type="button" onClick={() => setEducation((p) => p.filter((x) => x.id !== e.id))} className="p-1 text-zinc-600 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-dark-border" />

      {/* Certifications */}
      <div className="space-y-4">
        <div>
          <h3 className="font-display font-bold text-xl text-white mb-1">Certifications</h3>
          <p className="text-zinc-500 text-sm">Professional certifications and credentials.</p>
        </div>

        {!addingCert && (
          <button type="button" onClick={() => setAddingCert(true)}
            className="w-full border-2 border-dashed border-dark-border rounded-2xl py-4 text-zinc-500 hover:border-primary hover:text-primary transition-all text-sm flex items-center justify-center gap-2">
            <Plus size={16} /> Add Certification
          </button>
        )}

        <AnimatePresence>
          {addingCert && <CertForm onSave={(c) => { setCertifications((p) => [...p, c]); setAddingCert(false); }} onCancel={() => setAddingCert(false)} />}
        </AnimatePresence>

        {certifications.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {certifications.map((c) => (
                <motion.div key={c.id}
                  initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-2 px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-sm">
                  <div>
                    <p className="text-white text-xs font-medium">{c.name}</p>
                    {c.issuer && <p className="text-zinc-500 text-[10px]">{c.issuer} · {c.year}</p>}
                  </div>
                  <button type="button" onClick={() => setCertifications((p) => p.filter((x) => x.id !== c.id))}
                    className="text-zinc-600 hover:text-red-400 transition-colors ml-1"><X size={12} /></button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
