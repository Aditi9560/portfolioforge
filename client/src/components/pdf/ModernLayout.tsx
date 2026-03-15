import { Document, Page, Text, View } from '@react-pdf/renderer';
import type { PaperSizeChoice } from '../builder/types';
import type { ResumeData } from './shared';
import {
  stripUrl,
  ExperienceItems, SkillsItems, ProjectsItems,
  EducationItems, CertItems, PageFooter,
} from './shared';

const BODY    = 'Helvetica';
const HEADING = 'Helvetica-Bold';
const ITALIC  = 'Helvetica-Oblique';

function SectionTitle({ text, accent }: { text: string; accent: string }) {
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

export function ModernLayout({ data, accent, paperSize, sectionOrder }: {
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

  const contactParts: string[] = [];
  if (data.phone)        contactParts.push(data.phone);
  if (data.email)        contactParts.push(data.email);
  if (data.location)     contactParts.push(data.location);
  if (data.github_url)   contactParts.push(stripUrl(data.github_url));
  if (data.linkedin_url) contactParts.push(stripUrl(data.linkedin_url));
  if (data.website_url)  contactParts.push(stripUrl(data.website_url));

  const renderSection = (name: string) => {
    switch (name) {
      case 'Experience':
        if (!experience.length) return null;
        return (
          <View key="exp">
            <SectionTitle text="Experience" accent={accent} />
            <ExperienceItems entries={experience} accent={accent} bodyFont={BODY} headingFont={HEADING} italicFont={ITALIC} />
          </View>
        );
      case 'Skills':
        if (!skills.length) return null;
        return (
          <View key="skills">
            <SectionTitle text="Skills" accent={accent} />
            <SkillsItems skills={skills} accent={accent} bodyFont={BODY} headingFont={HEADING} />
          </View>
        );
      case 'Projects':
        if (!projects.length) return null;
        return (
          <View key="proj">
            <SectionTitle text="Projects" accent={accent} />
            <ProjectsItems projects={projects} accent={accent} bodyFont={BODY} headingFont={HEADING} />
          </View>
        );
      case 'Education':
        if (!education.length) return null;
        return (
          <View key="edu">
            <SectionTitle text="Education" accent={accent} />
            <EducationItems entries={education} accent={accent} bodyFont={BODY} headingFont={HEADING} italicFont={ITALIC} />
          </View>
        );
      case 'Certifications':
        if (!certifications.length) return null;
        return (
          <View key="cert">
            <SectionTitle text="Certifications" accent={accent} />
            <CertItems certs={certifications} bodyFont={BODY} headingFont={HEADING} />
          </View>
        );
      default: return null;
    }
  };

  return (
    <Page
      size={paperSize === 'Letter' ? 'LETTER' : 'A4'}
      style={{ paddingTop: 42, paddingBottom: 48, paddingHorizontal: 50, fontFamily: BODY, backgroundColor: '#ffffff' }}
    >
      {/* Header */}
      <View style={{ marginBottom: 4 }}>
        <Text style={{ fontFamily: HEADING, fontSize: 30, color: accent, lineHeight: 1.1 }}>
          {data.name || 'Your Name'}
        </Text>
        {data.title && (
          <Text style={{ fontFamily: BODY, fontSize: 13, color: '#666666', marginTop: 3 }}>
            {data.title}
          </Text>
        )}
        {contactParts.length > 0 && (
          <Text style={{ fontFamily: BODY, fontSize: 8.5, color: '#666666', marginTop: 6 }}>
            {contactParts.join('  |  ')}
          </Text>
        )}
        {/* Modern HR: 2pt accent color */}
        <View style={{ borderBottomWidth: 2, borderBottomColor: accent, marginTop: 10 }} />
        {data.bio && (
          <Text style={{ fontFamily: BODY, fontSize: 9.5, color: '#444444', marginTop: 10, lineHeight: 1.5 }}>
            {data.bio}
          </Text>
        )}
      </View>

      {sectionOrder.map((s) => renderSection(s))}

      <PageFooter name={data.name || ''} bodyFont={BODY} />
    </Page>
  );
}

export function ModernDocument({ data, paperSize, sectionOrder }: {
  data: ResumeData;
  paperSize: PaperSizeChoice;
  sectionOrder: string[];
}) {
  const accent = data.accent_color || '#10b981';
  return (
    <Document title={`${data.name || 'Resume'} — Resume`} author={data.name}>
      <ModernLayout data={data} accent={accent} paperSize={paperSize} sectionOrder={sectionOrder} />
    </Document>
  );
}
