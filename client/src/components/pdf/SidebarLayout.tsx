import { Document, Page, Text, View, Link, Image } from '@react-pdf/renderer';
import type { PaperSizeChoice } from '../builder/types';
import type { ResumeData } from './shared';
import {
  hexToRgba, stripUrl,
  ExperienceItems, SkillsItemsWithDots, SkillsItems,
  ProjectsItems, EducationItems, CertItems, PageFooter,
} from './shared';

const BODY    = 'Helvetica';
const HEADING = 'Helvetica-Bold';
const ITALIC  = 'Helvetica-Oblique';

/** Section title for the sidebar column: small gray caps + thin rule */
function SidebarSectionTitle({ text, accent }: { text: string; accent: string }) {
  return (
    <View style={{ marginTop: 14, marginBottom: 5 }}>
      <Text style={{
        fontFamily: HEADING,
        fontSize: 7.5,
        color: accent,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        marginBottom: 3,
      }}>
        {text.toUpperCase()}
      </Text>
      <View style={{ borderBottomWidth: 0.5, borderBottomColor: hexToRgba(accent, 0.3) }} />
    </View>
  );
}

/** Section title for the main column: colored left border */
function MainSectionTitle({ text, accent }: { text: string; accent: string }) {
  return (
    <View style={{
      marginTop: 16,
      marginBottom: 6,
      borderLeftWidth: 3,
      borderLeftColor: accent,
      paddingLeft: 8,
    }}>
      <Text style={{
        fontFamily: HEADING,
        fontSize: 8.5,
        color: accent,
        letterSpacing: 1.4,
        textTransform: 'uppercase',
      }}>
        {text.toUpperCase()}
      </Text>
    </View>
  );
}

export function SidebarLayout({ data, accent, paperSize, sectionOrder }: {
  data: ResumeData;
  accent: string;
  paperSize: PaperSizeChoice;
  sectionOrder: string[];
}) {
  const experience     = data.experience     ?? [];
  const skills         = data.skills         ?? [];
  const projects       = data.projects       ?? [];
  const education      = data.education      ?? [];
  const certifications = data.certifications ?? [];

  const pageH     = paperSize === 'Letter' ? 792 : 841;
  const sidebarBg = hexToRgba(accent, 0.07);

  // Sections that live in sidebar vs main
  const sideOrder = sectionOrder.filter(s => ['Skills', 'Education', 'Certifications'].includes(s));
  const mainOrder = sectionOrder.filter(s => ['Experience', 'Projects'].includes(s));

  return (
    <Page
      size={paperSize === 'Letter' ? 'LETTER' : 'A4'}
      style={{ flexDirection: 'row', backgroundColor: '#ffffff' }}
    >
      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <View style={{ width: '33%', backgroundColor: sidebarBg, padding: 20, minHeight: pageH }}>
        {/* Profile photo */}
        {data.photo_url && (
          <Image
            src={data.photo_url}
            style={{ width: 68, height: 68, borderRadius: 34, marginBottom: 10, alignSelf: 'center' }}
          />
        )}

        {/* Name + title */}
        <Text style={{ fontFamily: HEADING, fontSize: 13, color: accent, textAlign: 'center', lineHeight: 1.2 }}>
          {data.name || 'Your Name'}
        </Text>
        {data.title && (
          <Text style={{ fontFamily: BODY, fontSize: 8.5, color: '#555555', textAlign: 'center', marginTop: 2, lineHeight: 1.3 }}>
            {data.title}
          </Text>
        )}

        {/* Contact */}
        <SidebarSectionTitle text="Contact" accent={accent} />
        {data.phone && (
          <Text style={{ fontFamily: BODY, fontSize: 8.5, color: '#333333', marginBottom: 3 }}>
            {'☎  '}{data.phone}
          </Text>
        )}
        {data.email && (
          <Text style={{ fontFamily: BODY, fontSize: 8.5, color: '#333333', marginBottom: 3 }}>
            {'✉  '}{data.email}
          </Text>
        )}
        {data.location && (
          <Text style={{ fontFamily: BODY, fontSize: 8.5, color: '#333333', marginBottom: 3 }}>
            {'⌖  '}{data.location}
          </Text>
        )}
        {data.github_url && (
          <Link src={data.github_url} style={{ fontFamily: BODY, fontSize: 8.5, color: accent, textDecoration: 'none', marginBottom: 3 }}>
            {'⌗  '}{stripUrl(data.github_url)}
          </Link>
        )}
        {data.linkedin_url && (
          <Link src={data.linkedin_url} style={{ fontFamily: BODY, fontSize: 8.5, color: accent, textDecoration: 'none', marginBottom: 3 }}>
            {'in  '}{stripUrl(data.linkedin_url)}
          </Link>
        )}
        {data.website_url && (
          <Link src={data.website_url} style={{ fontFamily: BODY, fontSize: 8.5, color: accent, textDecoration: 'none', marginBottom: 3 }}>
            {'↗  '}{stripUrl(data.website_url)}
          </Link>
        )}

        {/* Sidebar sections */}
        {sideOrder.map((name) => {
          if (name === 'Skills' && skills.length > 0) return (
            <View key="s">
              <SidebarSectionTitle text="Skills" accent={accent} />
              <SkillsItemsWithDots skills={skills} accent={accent} bodyFont={BODY} headingFont={HEADING} />
            </View>
          );
          if (name === 'Education' && education.length > 0) return (
            <View key="e">
              <SidebarSectionTitle text="Education" accent={accent} />
              <EducationItems
                entries={education} accent={accent}
                bodyFont={BODY} headingFont={HEADING} italicFont={ITALIC}
              />
            </View>
          );
          if (name === 'Certifications' && certifications.length > 0) return (
            <View key="c">
              <SidebarSectionTitle text="Certifications" accent={accent} />
              <CertItems certs={certifications} bodyFont={BODY} headingFont={HEADING} />
            </View>
          );
          return null;
        })}
      </View>

      {/* ── Main column ──────────────────────────────────────────────── */}
      <View style={{ width: '67%', padding: 24, paddingTop: 28, paddingBottom: 48 }}>
        {/* Summary */}
        {data.bio && (
          <View style={{ marginBottom: 4 }}>
            <MainSectionTitle text="Summary" accent={accent} />
            <Text style={{ fontFamily: BODY, fontSize: 9.5, color: '#444444', lineHeight: 1.5 }}>
              {data.bio}
            </Text>
          </View>
        )}

        {/* Main sections */}
        {mainOrder.map((name) => {
          if (name === 'Experience' && experience.length > 0) return (
            <View key="exp">
              <MainSectionTitle text="Experience" accent={accent} />
              <ExperienceItems entries={experience} accent={accent} bodyFont={BODY} headingFont={HEADING} italicFont={ITALIC} />
            </View>
          );
          if (name === 'Projects' && projects.length > 0) return (
            <View key="proj">
              <MainSectionTitle text="Projects" accent={accent} />
              <ProjectsItems projects={projects} accent={accent} bodyFont={BODY} headingFont={HEADING} />
            </View>
          );
          return null;
        })}

        {/* Skills overflow: if Skills not in sidebar order, show in main */}
        {!sideOrder.includes('Skills') && skills.length > 0 && (
          <View>
            <MainSectionTitle text="Skills" accent={accent} />
            <SkillsItems skills={skills} accent={accent} bodyFont={BODY} headingFont={HEADING} />
          </View>
        )}
      </View>

      <PageFooter name={data.name || ''} bodyFont={BODY} />
    </Page>
  );
}

export function SidebarDocument({ data, paperSize, sectionOrder }: {
  data: ResumeData;
  paperSize: PaperSizeChoice;
  sectionOrder: string[];
}) {
  const accent = data.accent_color || '#10b981';
  return (
    <Document title={`${data.name || 'Resume'} — Resume`} author={data.name}>
      <SidebarLayout data={data} accent={accent} paperSize={paperSize} sectionOrder={sectionOrder} />
    </Document>
  );
}
