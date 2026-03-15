import { useWatch } from 'react-hook-form';
import { Mail, MapPin, Github, Linkedin, Globe, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';
import type { AboutValues, Skill, Project, ExperienceEntry, EducationEntry, CertEntry } from './types';
import { CATEGORY_COLORS } from './types';

interface PreviewData {
  skills: Skill[];
  projects: Project[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  certifications: CertEntry[];
  step: number;
}

function SectionLabel({ children, highlighted }: { children: React.ReactNode; highlighted: boolean }) {
  return (
    <div className={clsx('rounded-xl p-0.5 transition-all', highlighted ? 'ring-1 ring-primary/50 shadow-sm shadow-primary/10' : '')}>
      {children}
    </div>
  );
}

export function LivePreview({ skills, projects, experience, education, certifications, step }: PreviewData) {
  const name        = useWatch<AboutValues, 'name'>({ name: 'name' });
  const title       = useWatch<AboutValues, 'title'>({ name: 'title' });
  const bio         = useWatch<AboutValues, 'bio'>({ name: 'bio' });
  const location    = useWatch<AboutValues, 'location'>({ name: 'location' });
  const email       = useWatch<AboutValues, 'email'>({ name: 'email' });
  const github_url  = useWatch<AboutValues, 'github_url'>({ name: 'github_url' });
  const linkedin_url= useWatch<AboutValues, 'linkedin_url'>({ name: 'linkedin_url' });
  const twitter_url = useWatch<AboutValues, 'twitter_url'>({ name: 'twitter_url' });
  const website_url = useWatch<AboutValues, 'website_url'>({ name: 'website_url' });
  const photo_url   = useWatch<AboutValues, 'photo_url'>({ name: 'photo_url' });
  const accent      = useWatch<AboutValues, 'accent_color'>({ name: 'accent_color' });

  const accentStyle = { color: accent };
  const accentBorder = { borderColor: accent };
  const accentBg = { backgroundColor: `${accent}20` };

  return (
    <div
      className="bg-[#0a0a0a] rounded-2xl overflow-y-auto text-left"
      style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}
    >
      {/* Hero */}
      <SectionLabel highlighted={step === 0}>
        <div className="p-5 text-center border-b border-[#1f1f1f]">
          {photo_url ? (
            <img src={photo_url} alt="photo" className="w-14 h-14 rounded-full object-cover mx-auto mb-3 border-2" style={accentBorder} />
          ) : (
            <div className="w-14 h-14 rounded-full mx-auto mb-3 bg-[#1f1f1f] flex items-center justify-center text-zinc-600 text-xl">
              {name ? name[0].toUpperCase() : '?'}
            </div>
          )}
          <h1 className="font-bold text-white text-lg leading-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            {name || <span className="text-zinc-600 italic">Your Name</span>}
          </h1>
          {title && <p className="text-zinc-400 text-xs mt-0.5">{title}</p>}
          {location && (
            <p className="flex items-center justify-center gap-1 text-zinc-500 text-xs mt-1">
              <MapPin size={10} />{location}
            </p>
          )}
          {bio && <p className="text-zinc-400 text-xs mt-2 max-w-xs mx-auto leading-relaxed">{bio}</p>}
          <div className="flex items-center justify-center gap-3 mt-3 text-zinc-500">
            {email && <Mail size={12} />}
            {github_url && <Github size={12} />}
            {linkedin_url && <Linkedin size={12} />}
            {twitter_url && <span style={{ fontSize: 10, fontWeight: 'bold' }}>𝕏</span>}
            {website_url && <Globe size={12} />}
          </div>
        </div>
      </SectionLabel>

      {/* Skills */}
      {skills.length > 0 && (
        <SectionLabel highlighted={step === 1}>
          <div className="p-4 border-b border-[#1f1f1f]">
            <h2 className="font-bold text-xs mb-3" style={{ ...accentStyle, fontFamily: "'Syne', sans-serif" }}>SKILLS</h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span key={s.id}
                  className={clsx('text-[10px] px-2 py-0.5 rounded-full border', CATEGORY_COLORS[s.category])}>
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        </SectionLabel>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <SectionLabel highlighted={step === 2}>
          <div className="p-4 border-b border-[#1f1f1f]">
            <h2 className="font-bold text-xs mb-3" style={{ ...accentStyle, fontFamily: "'Syne', sans-serif" }}>PROJECTS</h2>
            <div className="space-y-2.5">
              {projects.slice(0, 3).map((p) => (
                <div key={p.id} className="bg-[#111] rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-xs font-semibold">{p.title}</span>
                    {(p.live_url || p.github_url) && <ExternalLink size={9} className="text-zinc-500" />}
                  </div>
                  {p.description && <p className="text-zinc-500 text-[10px] mt-0.5 line-clamp-2">{p.description}</p>}
                  {p.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {(p.tech_stack as string[]).slice(0, 3).map((t) => (
                        <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ ...accentBg, ...accentStyle }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {projects.length > 3 && <p className="text-zinc-600 text-[10px] text-center">+{projects.length - 3} more</p>}
            </div>
          </div>
        </SectionLabel>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <SectionLabel highlighted={step === 3}>
          <div className="p-4 border-b border-[#1f1f1f]">
            <h2 className="font-bold text-xs mb-3" style={{ ...accentStyle, fontFamily: "'Syne', sans-serif" }}>EXPERIENCE</h2>
            <div className="space-y-3">
              {experience.map((e) => (
                <div key={e.id} className="flex gap-2">
                  <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-0.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
                    <div className="w-px flex-1 bg-[#1f1f1f]" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold">{e.role}</p>
                    <p className="text-[10px]" style={accentStyle}>{e.company}</p>
                    <p className="text-zinc-600 text-[9px]">
                      {e.from_month} {e.from_year} – {e.current ? 'Present' : `${e.to_month} ${e.to_year}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionLabel>
      )}

      {/* Education */}
      {(education.length > 0 || certifications.length > 0) && (
        <SectionLabel highlighted={step === 4}>
          <div className="p-4">
            {education.length > 0 && (
              <>
                <h2 className="font-bold text-xs mb-3" style={{ ...accentStyle, fontFamily: "'Syne', sans-serif" }}>EDUCATION</h2>
                <div className="space-y-2 mb-3">
                  {education.map((e) => (
                    <div key={e.id}>
                      <p className="text-white text-xs font-semibold">{e.institution}</p>
                      <p className="text-zinc-500 text-[10px]">{e.degree}{e.field ? ` · ${e.field}` : ''} · {e.grad_year}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
            {certifications.length > 0 && (
              <>
                <h2 className="font-bold text-xs mb-2" style={{ ...accentStyle, fontFamily: "'Syne', sans-serif" }}>CERTIFICATIONS</h2>
                <div className="flex flex-wrap gap-1.5">
                  {certifications.map((c) => (
                    <span key={c.id} className="text-[10px] px-2 py-0.5 rounded-full bg-[#111] border border-[#1f1f1f] text-zinc-300">{c.name}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </SectionLabel>
      )}

      {/* Empty state */}
      {!name && skills.length === 0 && projects.length === 0 && (
        <div className="p-8 text-center text-zinc-600 text-xs">
          <div className="text-2xl mb-2">👆</div>
          Fill in the form to see your live preview here
        </div>
      )}
    </div>
  );
}

// Wrapper that must be inside FormProvider
export function LivePreviewPanel(props: PreviewData) {
  // useWatch needs FormProvider, which is provided by BuilderPage
  return <LivePreview {...props} />;
}
