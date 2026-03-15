import { Text, View, Link } from '@react-pdf/renderer';
import type { Skill, Project, ExperienceEntry, EducationEntry, CertEntry } from '../builder/types';

// ─── Data shape ────────────────────────────────────────────────────────────

export interface ResumeData {
  name?: string;
  title?: string;
  phone?: string;
  email?: string;
  location?: string;
  bio?: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  website_url?: string;
  photo_url?: string;
  accent_color?: string;
  skills?: Skill[];
  projects?: Project[];
  experience?: ExperienceEntry[];
  education?: EducationEntry[];
  certifications?: CertEntry[];
  [key: string]: unknown;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

export function hexToRgba(hex: string, alpha: number): string {
  const h = (hex || '#10b981').replace('#', '');
  const r = parseInt(h.substring(0, 2), 16) || 16;
  const g = parseInt(h.substring(2, 4), 16) || 185;
  const b = parseInt(h.substring(4, 6), 16) || 129;
  return `rgba(${r},${g},${b},${alpha})`;
}

export function stripUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}

// ─── Section item renderers ────────────────────────────────────────────────

export function ExperienceItems({ entries, accent, bodyFont, headingFont, italicFont, roleColor }: {
  entries: ExperienceEntry[];
  accent: string;
  bodyFont: string;
  headingFont: string;
  italicFont: string;
  roleColor?: string;
}) {
  const rc = roleColor ?? accent;
  return (
    <View>
      {entries.map((e, i) => (
        <View key={e.id || i} style={{ marginBottom: i < entries.length - 1 ? 10 : 0 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Text style={{ fontFamily: headingFont, fontSize: 11, color: '#1a1a1a', flex: 1 }}>{e.company}</Text>
            <Text style={{ fontFamily: bodyFont, fontSize: 9, color: '#888888' }}>
              {e.from_month} {e.from_year} – {e.current ? 'Present' : `${e.to_month} ${e.to_year}`}
            </Text>
          </View>
          <Text style={{ fontFamily: italicFont, fontSize: 10, color: rc, marginTop: 2 }}>{e.role}</Text>
          {e.bullets.filter(Boolean).map((b, bi) => (
            <Text key={bi} style={{ fontFamily: bodyFont, fontSize: 9.5, color: '#333333', marginTop: 2.5, marginLeft: 10, lineHeight: 1.4 }}>
              {'• '}{b}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

export function SkillsItems({ skills, accent, bodyFont, headingFont }: {
  skills: Skill[];
  accent: string;
  bodyFont: string;
  headingFont: string;
}) {
  const grouped: Record<string, Skill[]> = {};
  for (const s of skills) {
    if (!grouped[s.category]) grouped[s.category] = [];
    grouped[s.category].push(s);
  }
  return (
    <View>
      {Object.entries(grouped).map(([cat, catSkills]) => (
        <Text key={cat} style={{ fontFamily: bodyFont, fontSize: 9.5, color: '#333333', marginBottom: 5, lineHeight: 1.5 }}>
          <Text style={{ fontFamily: headingFont, fontSize: 9, color: accent }}>{cat}: </Text>
          {catSkills.map(s => s.name).join(', ')}
        </Text>
      ))}
    </View>
  );
}

export function SkillsItemsWithDots({ skills, accent, bodyFont, headingFont }: {
  skills: Skill[];
  accent: string;
  bodyFont: string;
  headingFont: string;
}) {
  const grouped: Record<string, Skill[]> = {};
  for (const s of skills) {
    if (!grouped[s.category]) grouped[s.category] = [];
    grouped[s.category].push(s);
  }
  return (
    <View>
      {Object.entries(grouped).map(([cat, catSkills]) => (
        <View key={cat} style={{ marginBottom: 6 }}>
          <Text style={{ fontFamily: headingFont, fontSize: 7.5, color: '#888888', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 }}>
            {cat.toUpperCase()}
          </Text>
          {catSkills.map((s) => {
            const filled = Math.round((s.level / 100) * 5);
            const dots = Array.from({ length: 5 }, (_, di) => di < filled ? '●' : '○').join('');
            return (
              <View key={s.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                <Text style={{ fontFamily: bodyFont, fontSize: 8.5, color: '#333333' }}>{s.name}</Text>
                <Text style={{ fontFamily: bodyFont, fontSize: 7.5, color: accent, letterSpacing: 1 }}>{dots}</Text>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

export function ProjectsItems({ projects, accent, bodyFont, headingFont }: {
  projects: Project[];
  accent: string;
  bodyFont: string;
  headingFont: string;
}) {
  return (
    <View>
      {projects.map((p, i) => (
        <View key={p.id || i} style={{ marginBottom: i < projects.length - 1 ? 10 : 0 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Text style={{ fontFamily: headingFont, fontSize: 11, color: '#1a1a1a', flex: 1 }}>{p.title}</Text>
            {p.live_url ? (
              <Link src={p.live_url} style={{ fontFamily: bodyFont, fontSize: 8, color: accent, textDecoration: 'none' }}>
                {stripUrl(p.live_url)}
              </Link>
            ) : p.github_url ? (
              <Link src={p.github_url} style={{ fontFamily: bodyFont, fontSize: 8, color: accent, textDecoration: 'none' }}>
                {stripUrl(p.github_url)}
              </Link>
            ) : null}
          </View>
          {p.tech_stack.length > 0 && (
            <Text style={{ fontFamily: bodyFont, fontSize: 8, color: '#777777', marginTop: 2, fontStyle: 'italic' }}>
              {p.tech_stack.join(', ')}
            </Text>
          )}
          {p.description && (
            <Text style={{ fontFamily: bodyFont, fontSize: 9.5, color: '#444444', marginTop: 3, lineHeight: 1.5 }}>
              {p.description}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}

export function EducationItems({ entries, accent, bodyFont, headingFont, italicFont, roleColor }: {
  entries: EducationEntry[];
  accent: string;
  bodyFont: string;
  headingFont: string;
  italicFont: string;
  roleColor?: string;
}) {
  const rc = roleColor ?? accent;
  return (
    <View>
      {entries.map((e, i) => (
        <View key={e.id || i} style={{ marginBottom: i < entries.length - 1 ? 9 : 0 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: headingFont, fontSize: 11, color: '#1a1a1a' }}>{e.institution}</Text>
            {e.grad_year && <Text style={{ fontFamily: bodyFont, fontSize: 9, color: '#888888' }}>{e.grad_year}</Text>}
          </View>
          <Text style={{ fontFamily: italicFont, fontSize: 10, color: rc, marginTop: 2 }}>
            {e.degree}{e.field ? ` in ${e.field}` : ''}
          </Text>
          {e.description ? (
            <Text style={{ fontFamily: bodyFont, fontSize: 9, color: '#666666', marginTop: 2.5, lineHeight: 1.5 }}>
              {e.description}
            </Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}

export function CertItems({ certs, bodyFont, headingFont }: {
  certs: CertEntry[];
  bodyFont: string;
  headingFont: string;
}) {
  return (
    <View>
      {certs.map((c, i) => (
        <Text key={c.id || i} style={{ fontFamily: bodyFont, fontSize: 9.5, color: '#333333', marginBottom: 4, lineHeight: 1.5 }}>
          <Text style={{ fontFamily: headingFont }}>{c.name}</Text>
          {c.issuer ? ` — ${c.issuer}` : ''}
          {c.year ? ` (${c.year})` : ''}
        </Text>
      ))}
    </View>
  );
}

export function PageFooter({ name, bodyFont }: { name: string; bodyFont: string }) {
  return (
    <Text
      style={{
        position: 'absolute',
        bottom: 14,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontFamily: bodyFont,
        fontSize: 8,
        color: '#aaaaaa',
      }}
      render={({ pageNumber, totalPages }) =>
        `${name || 'Resume'} — Resume · Page ${pageNumber} of ${totalPages}`
      }
      fixed
    />
  );
}
