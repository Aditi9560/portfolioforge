import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText, Eye, Download, Palette, Monitor, GraduationCap,
  UserCheck, ArrowRight, Menu, X, MapPin, Star,
  CheckCircle2, ChevronRight, Github, Linkedin, Globe, Zap,
} from 'lucide-react';
import { clsx } from 'clsx';

// ─── Animation variants ────────────────────────────────────────────────────

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: d, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeIn = {
  hidden:  { opacity: 0 },
  visible: (d = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: d },
  }),
};

// ─── Sample portfolio data ─────────────────────────────────────────────────

const SAMPLES = [
  {
    initials: 'SC', avatarBg: '#10b981', accent: '#10b981',
    name: 'Sarah Chen', title: 'Full Stack Developer',
    location: 'San Francisco, CA',
    bio: 'Building fast APIs and beautiful React frontends.',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
    projects: 8, stars: 4.9,
    github: true, linkedin: true, website: true,
  },
  {
    initials: 'AR', avatarBg: '#3b82f6', accent: '#3b82f6',
    name: 'Alex Rivera', title: 'UI/UX Designer & Developer',
    location: 'New York, NY',
    bio: 'Crafting pixel-perfect interfaces users love.',
    skills: ['Figma', 'React', 'CSS', 'Motion'],
    projects: 12, stars: 5.0,
    github: true, linkedin: true, website: false,
  },
  {
    initials: 'PS', avatarBg: '#8b5cf6', accent: '#8b5cf6',
    name: 'Priya Sharma', title: 'Data Engineer',
    location: 'London, UK',
    bio: 'Turning raw data into production-grade ML pipelines.',
    skills: ['Python', 'TensorFlow', 'SQL', 'Spark'],
    projects: 6, stars: 4.8,
    github: false, linkedin: true, website: true,
  },
] as const;

// ─── Navbar ────────────────────────────────────────────────────────────────

function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  const navLinks = [
    { label: 'How it works', id: 'how-it-works' },
    { label: 'Features',     id: 'features' },
  ];

  return (
    <motion.nav
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled && 'backdrop-blur-xl bg-[#0a0a0a]/85 border-b border-[#1f1f1f]'
      )}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display font-bold text-xl text-white select-none">
          Resume<span className="text-primary">Forge</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <button key={l.id} onClick={() => scrollTo(l.id)}
              className="text-zinc-400 hover:text-white text-sm transition-colors">
              {l.label}
            </button>
          ))}
          <motion.button
            onClick={() => navigate('/create')}
            className="bg-primary text-black text-sm font-semibold px-5 py-2 rounded-full hover:brightness-110 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            Build Resume
          </motion.button>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen((v) => !v)}
          className="md:hidden text-zinc-400 hover:text-white transition-colors p-1">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden bg-[#111] border-b border-[#1f1f1f] px-6 pb-5 pt-2"
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((l) => (
                <button key={l.id} onClick={() => scrollTo(l.id)}
                  className="text-zinc-400 hover:text-white text-sm text-left transition-colors">
                  {l.label}
                </button>
              ))}
              <button onClick={() => { navigate('/create'); setOpen(false); }}
                className="bg-primary text-black text-sm font-semibold px-5 py-2.5 rounded-full w-fit">
                Build Resume
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ─── Sample portfolio cards ────────────────────────────────────────────────

function SampleCard({ s, i }: { s: typeof SAMPLES[number]; i: number }) {
  return (
    <motion.div
      custom={0.55 + i * 0.12}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="relative bg-[#111] rounded-2xl border border-[#1f1f1f] p-5 flex flex-col gap-3.5 overflow-hidden cursor-default group"
      style={{ transition: 'border-color 0.2s' }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = s.accent + '50')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#1f1f1f')}
    >
      {/* Subtle glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${s.accent}0d 0%, transparent 70%)` }}
      />

      {/* Live badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
        style={{ backgroundColor: s.accent + '20', color: s.accent }}>
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: s.accent }} />
        LIVE
      </div>

      {/* Profile */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold"
          style={{ backgroundColor: s.avatarBg }}>
          {s.initials}
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm font-semibold leading-tight">{s.name}</p>
          <p className="text-zinc-400 text-xs truncate">{s.title}</p>
        </div>
      </div>

      {/* Bio */}
      <p className="text-zinc-500 text-xs leading-relaxed">{s.bio}</p>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5">
        {s.skills.map((sk) => (
          <span key={sk} className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{ backgroundColor: s.accent + '18', color: s.accent }}>
            {sk}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[#1f1f1f] mt-auto">
        <span className="flex items-center gap-1 text-zinc-600 text-[10px]">
          <MapPin size={9} /> {s.location}
        </span>
        <div className="flex items-center gap-3 text-zinc-600">
          {s.github && <Github size={11} />}
          {s.linkedin && <Linkedin size={11} />}
          {s.website && <Globe size={11} />}
          <span className="text-[10px] flex items-center gap-0.5">
            <Star size={9} className="text-yellow-400" fill="currentColor" />
            {s.stars}
          </span>
        </div>
      </div>

      {/* "View portfolio" hover reveal */}
      <div
        className="absolute inset-x-0 bottom-0 py-2 text-center text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-b-2xl"
        style={{ backgroundColor: s.accent + '15', color: s.accent }}
      >
        resumeforge.com/{s.name.toLowerCase().replace(' ', '-')}-resume.pdf →
      </div>
    </motion.div>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-20 overflow-hidden text-center">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #1f1f1f 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.25 }} />

      {/* Badge */}
      <motion.div
        custom={0} variants={fadeUp} initial="hidden" animate="visible"
        className="relative inline-flex items-center gap-2 border border-[#1f1f1f] bg-[#111] text-zinc-400 text-xs sm:text-sm px-4 py-1.5 rounded-full mb-7"
      >
        <Zap size={12} className="text-primary" />
        Free forever · No login · No code
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
      </motion.div>

      {/* Headline */}
      <motion.h1
        custom={0.1} variants={fadeUp} initial="hidden" animate="visible"
        className="relative font-display font-extrabold text-[2.6rem] sm:text-6xl lg:text-7xl leading-[1.08] tracking-tight mb-5 max-w-4xl"
      >
        <span className="text-white">Build Your Resume</span>
        {' '}
        <span className="bg-gradient-to-r from-primary via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          in 5&nbsp;Minutes&nbsp;Flat
        </span>
      </motion.h1>

      {/* Subtext */}
      <motion.p
        custom={0.2} variants={fadeUp} initial="hidden" animate="visible"
        className="relative text-zinc-400 text-base sm:text-lg max-w-lg mb-9 leading-relaxed"
      >
        Fill a form. Preview your resume. Download as PDF.
        <br className="hidden sm:block" />
        <span className="text-zinc-300">No account needed. No subscriptions. Completely free.</span>
      </motion.p>

      {/* CTA */}
      <motion.div
        custom={0.3} variants={fadeUp} initial="hidden" animate="visible"
        className="relative flex flex-col sm:flex-row items-center gap-3 mb-5"
      >
        <motion.button
          onClick={() => navigate('/create')}
          className="flex items-center gap-2 bg-primary text-black font-bold text-base px-8 py-4 rounded-full"
          style={{ boxShadow: '0 0 40px rgba(16,185,129,0.4)' }}
          whileHover={{ scale: 1.05, boxShadow: '0 0 55px rgba(16,185,129,0.55)' }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
        >
          Build My Resume — It's Free
          <ArrowRight size={18} />
        </motion.button>
        <a href="#how-it-works"
          className="text-zinc-400 hover:text-white text-sm transition-colors flex items-center gap-1">
          See how it works <ChevronRight size={14} />
        </a>
      </motion.div>

      {/* Social proof */}
      <motion.p
        custom={0.38} variants={fadeIn} initial="hidden" animate="visible"
        className="relative text-zinc-600 text-xs mb-16"
      >
        Trusted by <span className="text-zinc-400 font-semibold">500+ job seekers</span> · Takes &lt; 5 minutes
      </motion.p>

      {/* Sample portfolio cards */}
      <div className="relative w-full max-w-5xl">
        {/* Label */}
        <motion.p
          custom={0.45} variants={fadeIn} initial="hidden" animate="visible"
          className="text-zinc-600 text-xs uppercase tracking-widest mb-5 font-medium"
        >
          Resume previews built with ResumeForge
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SAMPLES.map((s, i) => <SampleCard key={s.name} s={s} i={i} />)}
        </div>

        {/* Fade-out bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
      </div>
    </section>
  );
}

// ─── How It Works ──────────────────────────────────────────────────────────

const STEPS = [
  {
    number: '01',
    icon: <FileText size={24} />,
    title: 'Fill the Form',
    desc: 'Enter your name, bio, skills, projects, and experience. Takes under 5 minutes.',
  },
  {
    number: '02',
    icon: <Eye size={24} />,
    title: 'Preview Live',
    desc: 'See your resume update in real-time as you type — no waiting, no refresh.',
  },
  {
    number: '03',
    icon: <Download size={24} />,
    title: 'Download PDF',
    desc: 'Get a beautiful, ATS-friendly PDF instantly — ready to send to recruiters.',
  },
];

function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="how-it-works" ref={ref} className="py-28 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}>
          <span className="inline-block text-primary text-xs font-bold uppercase tracking-widest mb-3 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            How it works
          </span>
          <h2 className="font-display font-bold text-4xl text-white mt-3 mb-3">
            Three steps. Five minutes.
          </h2>
          <p className="text-zinc-400 text-lg">Three steps. One perfect PDF.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Desktop connecting line */}
          <div className="hidden md:block absolute top-12 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px"
            style={{ background: 'linear-gradient(90deg, #10b981 0%, #1f1f1f 50%, #10b981 100%)' }} />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ y: -4 }}
              className="relative bg-[#111] border border-[#1f1f1f] rounded-2xl p-7 text-left group hover:border-emerald-500/40 transition-colors"
            >
              {/* Faded number */}
              <span className="absolute top-4 right-5 font-display font-black text-7xl leading-none text-emerald-500/10 select-none pointer-events-none">
                {step.number}
              </span>

              {/* Icon in circle */}
              <div className="relative z-10 w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5 group-hover:bg-primary/20 transition-colors">
                {step.icon}
              </div>

              <h3 className="relative z-10 font-display font-bold text-white text-xl mb-2">
                {step.title}
              </h3>
              <p className="relative z-10 text-zinc-400 text-sm leading-relaxed">
                {step.desc}
              </p>

              {/* Arrow connector for mobile */}
              {i < STEPS.length - 1 && (
                <div className="md:hidden flex justify-center mt-5">
                  <ChevronRight size={20} className="text-zinc-700 rotate-90" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features ──────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: <Download size={20} />,      title: 'Download as PDF instantly',   desc: 'One click to get a beautiful, ready-to-send PDF resume.' },
  { icon: <Eye size={20} />,           title: 'Live preview as you type',    desc: 'Your resume renders in real-time in the side panel.' },
  { icon: <Palette size={20} />,       title: 'Multiple resume templates',   desc: 'Classic, Modern, Creative, Minimal — pick your style.' },
  { icon: <Monitor size={20} />,       title: 'Single & two-column layouts', desc: 'Choose traditional or sidebar layout for your role.' },
  { icon: <UserCheck size={20} />,     title: 'ATS-friendly formatting',     desc: 'Clean PDF structure that passes applicant tracking systems.' },
  { icon: <GraduationCap size={20} />, title: 'Save & load drafts',          desc: 'Export your draft as JSON, come back any time to continue.' },
] as const;

function Features() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="features" ref={ref} className="py-12 pb-28 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}>
          <span className="inline-block text-primary text-xs font-bold uppercase tracking-widest mb-3 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            Features
          </span>
          <h2 className="font-display font-bold text-4xl text-white mt-3 mb-3">
            Everything you need. Nothing you don't.
          </h2>
          <p className="text-zinc-400 text-base">Built for job seekers who want results, not friction.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="group flex gap-4 bg-[#111] border border-[#1f1f1f] rounded-xl p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 cursor-default"
            >
              {/* Check + icon combo */}
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                  {f.icon}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 size={13} className="text-primary flex-shrink-0" />
                  <h3 className="font-display font-semibold text-white text-sm leading-tight">{f.title}</h3>
                </div>
                <p className="text-zinc-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA strip ─────────────────────────────────────────────────────────────

function CTAStrip() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const navigate  = useNavigate();

  return (
    <section ref={ref} className="px-4 pb-24">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl border border-[#1f1f1f] overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0d1f18 0%, #0a0a0a 50%, #0d0d1f 100%)' }}
        >
          {/* Glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-primary/10 blur-3xl rounded-full" />
          </div>
          {/* Border glow */}
          <div className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ boxShadow: 'inset 0 0 60px rgba(16,185,129,0.04)' }} />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-10 md:px-12 md:py-10">
            <div className="text-center md:text-left">
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-2">
                Ready to land that job?
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base">
                A great resume is the first step. Build yours in minutes.
              </p>
            </div>

            <motion.button
              onClick={() => navigate('/create')}
              className="flex-shrink-0 flex items-center gap-2 bg-primary text-black font-bold text-base px-8 py-4 rounded-full"
              style={{ boxShadow: '0 0 40px rgba(16,185,129,0.35)' }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 55px rgba(16,185,129,0.5)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            >
              Build My Resume — It's Free
              <ArrowRight size={18} />
            </motion.button>
          </div>

          <p className="relative text-center text-zinc-600 text-xs pb-4">
            Free forever · No credit card · No login required
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-[#1f1f1f] py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-display font-bold text-lg text-white">
            Resume<span className="text-primary">Forge</span>
          </span>
          <span className="text-zinc-600 text-sm">Made with ❤️ for job seekers</span>
        </div>

        <p className="text-zinc-600 text-xs text-center">
          © 2025 ResumeForge · Free for everyone, forever.
        </p>

        <Link to="/create"
          className="text-primary hover:text-primary/80 text-sm font-semibold transition-colors flex items-center gap-1">
          Build Resume <ArrowRight size={14} />
        </Link>
      </div>
    </footer>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <motion.div
      className="bg-[#0a0a0a] min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <CTAStrip />
      <Footer />
    </motion.div>
  );
}
