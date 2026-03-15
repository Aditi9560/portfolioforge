import { Document, Page, Text, View } from '@react-pdf/renderer';
import type { PaperSizeChoice } from '../builder/types';
import type { ResumeData } from './shared';
import {
  stripUrl,
  ExperienceItems, SkillsItems, ProjectsItems,
  EducationItems, CertItems, PageFooter,
} from './shared';

const BODY    = 'Times-Roman';
const HEADING = 'Times-Bold';
const ITALIC  = 'Times-Italic';

function SectionTitle({ text, accent }: { text: string; accent: string }) {
  return (
    <View style={{ marginTop: 14, marginBottom: 6 }}>
      <Text style={{
        fontFamily: HEADING,
        fontSize: 8.5,
        color: accent,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        marginBottom: 4,
      }}>
        {text.toUpperCase()}
      </Text>
      <View style={{ borderBottomWidth: 0.75, borderBottomColor: '#cccccc' }} />
    </View>
  );
}

export function ClassicLayout({ data, accent, paperSize, sectionOrder }: {
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
            <ExperienceItems
              entries={experience} accent={accent}
              bodyFont={BODY} headingFont={HEADING} italicFont={ITALIC}
              roleColor="#555555"
            />
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
            <EducationItems
              entries={education} accent={accent}
              bodyFont={BODY} headingFont={HEADING} italicFont={ITALIC}
              roleColor="#555555"
            />
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
      style={{ paddingTop: 48, paddingBottom: 52, paddingHorizontal: 55, fontFamily: BODY, backgroundColor: '#ffffff' }}
    >
      {/* Header */}
      <View style={{ marginBottom: 4 }}>
        <Text style={{ fontFamily: HEADING, fontSize: 26, color: '#111111', lineHeight: 1.1 }}>
          {data.name || 'Your Name'}
        </Text>
        {data.title && (
          <Text style={{ fontFamily: BODY, fontSize: 11, color: '#555555', marginTop: 3 }}>
            {data.title}
          </Text>
        )}
        {contactParts.length > 0 && (
          <Text style={{ fontFamily: BODY, fontSize: 8.5, color: '#666666', marginTop: 5 }}>
            {contactParts.join('  |  ')}
          </Text>
        )}
        {/* Classic HR: thin gray */}
        <View style={{ borderBottomWidth: 1, borderBottomColor: '#999999', marginTop: 10, marginBottom: 0 }} />
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

export function ClassicDocument({ data, paperSize, sectionOrder }: {
  data: ResumeData;
  paperSize: PaperSizeChoice;
  sectionOrder: string[];
}) {
  const accent = data.accent_color || '#111111';
  return (
    <Document title={`${data.name || 'Resume'} — Resume`} author={data.name}>
      <ClassicLayout data={data} accent={accent} paperSize={paperSize} sectionOrder={sectionOrder} />
    </Document>
  );
}
