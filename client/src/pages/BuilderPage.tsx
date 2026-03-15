import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import { ChevronLeft, ChevronRight, Check, RotateCcw, Save, FolderOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

import { pdf } from '@react-pdf/renderer';
import { ResumeDocument } from '../components/ResumePDF';
import { api } from '../lib/api';
import { ProgressBar }     from '../components/builder/ProgressBar';
import { Step1About }      from '../components/builder/Step1About';
import { Step2Skills }     from '../components/builder/Step2Skills';
import { Step3Projects }   from '../components/builder/Step3Projects';
import { Step4Experience } from '../components/builder/Step4Experience';
import { Step5Education }  from '../components/builder/Step5Education';
import { Step6Publish }    from '../components/builder/Step6Publish';
import { LivePreviewPanel } from '../components/builder/LivePreview';
import type {
  AboutValues, Skill, Project, ExperienceEntry, EducationEntry, CertEntry,
  TemplateChoice, PaperSizeChoice,
} from '../components/builder/types';

// ─── Validation schema ───────────────────────────────────────────────────

const schema = z.object({
  name:         z.string().min(1, 'Name is required'),
  title:        z.string().min(1, 'Professional title is required'),
  phone:        z.string().optional().default(''),
  location:     z.string().optional().default(''),
  bio:          z.string().max(300, 'Bio must be 300 chars or less').optional().default(''),
  email:        z.string().email('Invalid email').optional().or(z.literal('')),
  github_url:   z.string().url('Invalid URL').optional().or(z.literal('')),
  linkedin_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  twitter_url:  z.string().url('Invalid URL').optional().or(z.literal('')),
  website_url:  z.string().url('Invalid URL').optional().or(z.literal('')),
  photo_url:    z.string().optional().default(''),
  theme:        z.enum(['dark', 'light']).default('dark'),
  accent_color: z.string().default('#10b981'),
});

// ─── LocalStorage helpers ─────────────────────────────────────────────────

const STORAGE_KEY = 'resumeforge_draft';

const defaultValues: AboutValues = {
  name: '', title: '', phone: '', location: '', bio: '',
  email: '', github_url: '', linkedin_url: '',
  twitter_url: '', website_url: '', photo_url: '',
  theme: 'dark', accent_color: '#10b981',
};

const DEFAULT_SECTION_ORDER = ['Experience', 'Skills', 'Projects', 'Education', 'Certifications'];

function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { values: { ...defaultValues, ...parsed } as AboutValues, arrays: parsed };
    }
  } catch { /* ignore */ }
  return { values: defaultValues, arrays: {} };
}

// ─── Slide variants ───────────────────────────────────────────────────────

const slideVariants = {
  enter:  (dir: number) => ({ x: dir * 48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir: number) => ({ x: dir * -48, opacity: 0 }),
};

const STEP_VALIDATE: Record<number, (keyof AboutValues)[]> = {
  0: ['name', 'title', 'email', 'github_url', 'linkedin_url', 'twitter_url', 'website_url'],
  1: [], 2: [], 3: [], 4: [], 5: [],
};

// ─── Read slug from URL ───────────────────────────────────────────────────

const editSlugFromUrl = new URLSearchParams(window.location.search).get('slug');

// ─── Main component ───────────────────────────────────────────────────────

export default function BuilderPage() {
  const { values: savedValues, arrays: savedArrays } = editSlugFromUrl
    ? { values: defaultValues, arrays: {} }
    : loadDraft();

  const methods = useForm<AboutValues>({
    resolver: zodResolver(schema),
    defaultValues: savedValues,
    mode: 'onBlur',
  });

  // Array states
  const [skills,         setSkills]         = useState<Skill[]>(savedArrays.skills ?? []);
  const [projects,       setProjects]       = useState<Project[]>(savedArrays.projects ?? []);
  const [experience,     setExperience]     = useState<ExperienceEntry[]>(savedArrays.experience ?? []);
  const [education,      setEducation]      = useState<EducationEntry[]>(savedArrays.education ?? []);
  const [certifications, setCertifications] = useState<CertEntry[]>(savedArrays.certifications ?? []);

  // PDF style options
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateChoice>(savedArrays.selectedTemplate ?? 'Modern');
  const [paperSize,         setPaperSize]        = useState<PaperSizeChoice>(savedArrays.paperSize ?? 'A4');
  const [sectionOrder,      setSectionOrder]     = useState<string[]>(savedArrays.sectionOrder ?? DEFAULT_SECTION_ORDER);

  // UI state
  const [step,         setStep]         = useState(0);
  const [direction,    setDir]          = useState(1);
  const [mobileTab,    setMobileTab]    = useState<'edit' | 'preview'>('edit');
  const [saved,        setSaved]        = useState(false);
  const [resetPending, setResetPending] = useState(false);
  const [downloading,  setDownloading]  = useState(false);

  // Edit mode
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // File input ref for Load Draft
  const loadFileRef = useRef<HTMLInputElement>(null);

  // ── Load from URL slug on mount ──────────────────────────────────────────
  useEffect(() => {
    if (!editSlugFromUrl) return;
    api.get(`/api/portfolio/${editSlugFromUrl}`)
      .then((r) => {
        const d = r.data;
        methods.reset({
          name:         d.name         || '',
          title:        d.title        || '',
          phone:        d.phone        || '',
          location:     d.location     || '',
          bio:          d.bio          || '',
          email:        d.email        || '',
          github_url:   d.github_url   || '',
          linkedin_url: d.linkedin_url || '',
          twitter_url:  d.twitter_url  || '',
          website_url:  d.website_url  || '',
          photo_url:    d.photo_url    || '',
          theme:        d.theme        || 'dark',
          accent_color: d.accent_color || '#10b981',
        });
        setSkills((d.skills ?? []).map((s: string) => ({ id: uuid(), name: s, category: 'Other' as const, level: 75 })));
        setProjects((d.projects ?? []).map((p: { name: string; description?: string; url?: string }) => ({
          id: uuid(), title: p.name, description: p.description || '',
          live_url: p.url || '', github_url: '', tech_stack: [], image_url: '', featured: false,
        })));
        setExperience((d.experience ?? []).map((e: { company: string; role: string; duration?: string; description?: string }) => ({
          id: uuid(), company: e.company, role: e.role,
          from_month: 'Jan', from_year: '2020', to_month: 'Jan', to_year: '2021',
          current: (e.duration ?? '').includes('Present'),
          bullets: e.description ? [e.description] : [''],
        })));
        setEducation((d.education ?? []).map((e: { school: string; degree?: string; year?: string }) => ({
          id: uuid(), institution: e.school, degree: e.degree || 'Other',
          field: '', grad_year: e.year || '', description: '',
        })));
        setCertifications((d.certifications ?? []).map((c: { name: string; issuer?: string; year?: string }) => ({
          id: uuid(), name: c.name, issuer: c.issuer || '', year: c.year || '', cred_url: '',
        })));
        setEditingSlug(editSlugFromUrl);
        setEditingName(d.name || editSlugFromUrl);
        toast.success(`Loaded "${d.name}" for editing`);
      })
      .catch(() => toast.error('Could not load for editing'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Auto-save to localStorage ────────────────────────────────────────────
  const watched = methods.watch();

  useEffect(() => {
    const timer = setTimeout(() => {
      const draft = {
        ...watched,
        skills, projects, experience, education, certifications,
        selectedTemplate, paperSize, sectionOrder,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 500);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watched, skills, projects, experience, education, certifications, selectedTemplate, paperSize, sectionOrder]);

  // ── Navigation ───────────────────────────────────────────────────────────
  const goTo = useCallback(async (target: number) => {
    if (target > step) {
      const fields = STEP_VALIDATE[step];
      if (fields.length > 0) {
        const valid = await methods.trigger(fields as (keyof AboutValues)[]);
        if (!valid) return;
      }
      setDir(1);
    } else {
      setDir(-1);
    }
    setStep(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step, methods]);

  const next = () => goTo(step + 1);
  const back = () => goTo(step - 1);

  // ── Reset ────────────────────────────────────────────────────────────────
  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    methods.reset(defaultValues);
    setSkills([]); setProjects([]); setExperience([]); setEducation([]); setCertifications([]);
    setSelectedTemplate('Modern'); setPaperSize('A4');
    setSectionOrder(DEFAULT_SECTION_ORDER);
    setEditingSlug(null); setEditingName('');
    setStep(0); setResetPending(false);
  };

  // ── Save draft to file ───────────────────────────────────────────────────
  const saveDraftToFile = () => {
    const draft = {
      ...methods.getValues(),
      skills, projects, experience, education, certifications,
      selectedTemplate, paperSize, sectionOrder,
    };
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (methods.getValues().name || 'resume') + '-draft.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Draft saved to your computer!');
  };

  // ── Load draft from file ─────────────────────────────────────────────────
  const loadDraftFromFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (!parsed.name) { toast.error('Invalid draft file. Please use a ResumeForge draft.'); return; }
        methods.reset({
          name:         parsed.name         || '',
          title:        parsed.title        || '',
          phone:        parsed.phone        || '',
          location:     parsed.location     || '',
          bio:          parsed.bio          || '',
          email:        parsed.email        || '',
          github_url:   parsed.github_url   || '',
          linkedin_url: parsed.linkedin_url || '',
          twitter_url:  parsed.twitter_url  || '',
          website_url:  parsed.website_url  || '',
          photo_url:    parsed.photo_url    || '',
          theme:        parsed.theme        || 'dark',
          accent_color: parsed.accent_color || '#10b981',
        });
        setSkills(parsed.skills        ?? []);
        setProjects(parsed.projects    ?? []);
        setExperience(parsed.experience ?? []);
        setEducation(parsed.education  ?? []);
        setCertifications(parsed.certifications ?? []);
        if (parsed.selectedTemplate) setSelectedTemplate(parsed.selectedTemplate);
        if (parsed.paperSize)        setPaperSize(parsed.paperSize);
        if (parsed.sectionOrder)   setSectionOrder(parsed.sectionOrder);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        toast.success(`Draft loaded! ${parsed.name}`);
        setDir(-1); setStep(0);
      } catch {
        toast.error('Invalid draft file. Please use a ResumeForge draft.');
      }
    };
    reader.readAsText(file);
  };

  // ── Download PDF ─────────────────────────────────────────────────────────
  const handleDownload = async () => {
    const valid = await methods.trigger(['name', 'title']);
    if (!valid) {
      toast.error('Name and professional title are required');
      setDir(-1); setStep(0);
      return;
    }
    setDownloading(true);
    try {
      const values = methods.getValues();
      const data = { ...values, skills, projects, experience, education, certifications };
      const blob = await pdf(
        <ResumeDocument
          data={data}
          template={selectedTemplate}
          paperSize={paperSize}
          sectionOrder={sectionOrder}
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${values.name || 'resume'}-resume.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Resume downloaded!');
    } catch (err) {
      toast.error('Failed to generate PDF. Please try again.');
      console.error('PDF generation error:', err);
    } finally {
      setDownloading(false);
    }
  };

  // ── Preview ──────────────────────────────────────────────────────────────
  const handlePreview = () => {
    const values = methods.getValues();
    const previewData = {
      ...values,
      skills, projects, experience, education, certifications,
      selectedTemplate, paperSize, sectionOrder,
    };
    sessionStorage.setItem('resume_preview', JSON.stringify(previewData));
    window.open('/preview', '_blank');
  };

  // ── Render step ──────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (step) {
      case 0: return <Step1About />;
      case 1: return <Step2Skills skills={skills} setSkills={setSkills} />;
      case 2: return <Step3Projects projects={projects} setProjects={setProjects} />;
      case 3: return <Step4Experience experience={experience} setExperience={setExperience} />;
      case 4: return <Step5Education education={education} setEducation={setEducation} certifications={certifications} setCertifications={setCertifications} />;
      case 5: return (
        <Step6Publish
          onDownload={handleDownload}
          onPreview={handlePreview}
          downloading={downloading}
          selectedTemplate={selectedTemplate}
          setTemplate={setSelectedTemplate}
          paperSize={paperSize}
          setPaperSize={setPaperSize}
          sectionOrder={sectionOrder}
          setSectionOrder={setSectionOrder}
        />
      );
      default: return null;
    }
  };

  const previewProps = { skills, projects, experience, education, certifications, step };
  const topBarBtnClass = 'text-xs border border-dark-border text-zinc-400 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all hover:border-zinc-500 hover:text-white';

  return (
    <FormProvider {...methods}>
      <motion.div
        className="min-h-screen bg-dark-bg"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Mobile tab bar */}
        <div className="lg:hidden sticky top-0 z-40 flex border-b border-dark-border bg-dark-bg/90 backdrop-blur-md">
          <button onClick={() => setMobileTab('edit')}
            className={clsx('flex-1 py-3 text-sm font-medium transition-colors',
              mobileTab === 'edit' ? 'text-white border-b-2 border-primary' : 'text-zinc-500 hover:text-zinc-300')}>
            ✏️ Edit
          </button>
          <button onClick={() => setMobileTab('preview')}
            className={clsx('flex-1 py-3 text-sm font-medium transition-colors',
              mobileTab === 'preview' ? 'text-white border-b-2 border-primary' : 'text-zinc-500 hover:text-zinc-300')}>
            👁 Preview
          </button>
        </div>

        <div className="flex min-h-screen lg:min-h-0">
          {/* ── Left: Form panel ─────────────────────────────────────── */}
          <div className={clsx('w-full lg:w-[55%] flex flex-col', mobileTab !== 'edit' ? 'hidden lg:flex' : 'flex')}>
            {/* Sticky header */}
            <div className="sticky top-0 lg:top-0 z-30 bg-dark-bg/95 backdrop-blur-md border-b border-dark-border px-4 py-4">
              <div className="max-w-xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="font-display font-bold text-lg text-white leading-tight">
                      Resume<span className="text-primary">Forge</span>
                    </h1>
                    {editingSlug && (
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Editing: <span className="text-primary">{editingName}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <AnimatePresence>
                      {saved && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                          className="flex items-center gap-1 text-xs text-primary"
                        >
                          <Check size={12} /> Saved
                        </motion.span>
                      )}
                    </AnimatePresence>

                    <button onClick={saveDraftToFile} className={topBarBtnClass}>
                      <Save size={12} /> Save Draft
                    </button>
                    <button onClick={() => loadFileRef.current?.click()} className={topBarBtnClass}>
                      <FolderOpen size={12} /> Load Draft
                    </button>
                    <input
                      ref={loadFileRef} type="file" accept=".json" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) loadDraftFromFile(f); e.target.value = ''; }}
                    />

                    {resetPending ? (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-zinc-400">Clear all?</span>
                        <button onClick={handleReset} className="text-red-400 hover:text-red-300 transition-colors">Yes</button>
                        <button onClick={() => setResetPending(false)} className="text-zinc-500 hover:text-zinc-300 transition-colors">No</button>
                      </div>
                    ) : (
                      <button onClick={() => setResetPending(true)}
                        className="text-zinc-600 hover:text-zinc-400 text-xs flex items-center gap-1 transition-colors">
                        <RotateCcw size={12} /> Reset
                      </button>
                    )}
                  </div>
                </div>

                <ProgressBar current={step} onNavigate={(s) => goTo(s)} />
              </div>
            </div>

            {/* Scrollable form body */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-xl mx-auto px-4 py-8 pb-24">
                <AnimatePresence custom={direction} mode="wait">
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter" animate="center" exit="exit"
                    transition={{ duration: 0.28, ease: 'easeInOut' }}
                  >
                    {renderStep()}
                  </motion.div>
                </AnimatePresence>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-dark-border">
                  <motion.button
                    type="button" onClick={back} disabled={step === 0}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-dark-border text-zinc-400 hover:text-white hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-medium"
                    whileHover={{ x: -2 }} whileTap={{ scale: 0.97 }}
                  >
                    <ChevronLeft size={16} /> Back
                  </motion.button>

                  {step < 5 && (
                    <motion.button
                      type="button" onClick={next}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-black font-semibold hover:brightness-110 transition-all text-sm"
                      whileHover={{ x: 2 }} whileTap={{ scale: 0.97 }}
                    >
                      Next <ChevronRight size={16} />
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Preview panel ──────────────────────────────────── */}
          <div className={clsx('w-full lg:w-[45%] lg:border-l border-dark-border', mobileTab !== 'preview' ? 'hidden lg:block' : 'block')}>
            <div className="sticky top-0 lg:h-screen flex flex-col bg-dark-bg">
              <div className="flex items-center justify-between px-5 py-4 border-b border-dark-border">
                <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Live Preview</span>
                <button
                  onClick={handlePreview}
                  className="text-xs text-zinc-500 hover:text-primary transition-colors flex items-center gap-1"
                >
                  Preview PDF ↗
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <LivePreviewPanel {...previewProps} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </FormProvider>
  );
}
