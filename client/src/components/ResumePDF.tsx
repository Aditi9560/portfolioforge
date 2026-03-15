import { Document } from '@react-pdf/renderer';
import type { PaperSizeChoice, TemplateChoice } from './builder/types';
import type { ResumeData } from './pdf/shared';
import { ClassicLayout } from './pdf/ClassicLayout';
import { ModernLayout }  from './pdf/ModernLayout';
import { SidebarLayout } from './pdf/SidebarLayout';

// Re-export so callers that import ResumeData from here still work
export type { ResumeData } from './pdf/shared';

export interface ResumeDocumentProps {
  data: ResumeData;
  template?: TemplateChoice;
  paperSize?: PaperSizeChoice;
  sectionOrder?: string[];
}

const DEFAULT_ORDER = ['Experience', 'Skills', 'Projects', 'Education', 'Certifications'];

export function ResumeDocument({
  data,
  template     = 'Modern',
  paperSize    = 'A4',
  sectionOrder = DEFAULT_ORDER,
}: ResumeDocumentProps) {
  const props = { data, paperSize, sectionOrder };

  return (
    <Document title={`${data.name || 'Resume'} — Resume`} author={data.name}>
      {template === 'Classic' ? (
        <ClassicLayout {...props} accent={data.accent_color || '#111111'} />
      ) : template === 'Sidebar' ? (
        <SidebarLayout {...props} accent={data.accent_color || '#10b981'} />
      ) : (
        <ModernLayout {...props} accent={data.accent_color || '#10b981'} />
      )}
    </Document>
  );
}
