import { PDFViewer } from '@react-pdf/renderer';
import { ResumeDocument } from '../components/ResumePDF';
import type { TemplateChoice, PaperSizeChoice } from '../components/builder/types';

export default function PreviewPage() {
  let data = null;
  let template: TemplateChoice     = 'Modern';
  let paperSize: PaperSizeChoice   = 'A4';
  let sectionOrder = ['Experience', 'Skills', 'Projects', 'Education', 'Certifications'];

  try {
    const raw = sessionStorage.getItem('resume_preview');
    if (raw) {
      const parsed = JSON.parse(raw);
      data         = parsed;
      template     = parsed.selectedTemplate ?? 'Modern';
      paperSize    = parsed.paperSize        ?? 'A4';
      sectionOrder = parsed.sectionOrder     ?? sectionOrder;
    }
  } catch { /* ignore */ }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-dark-bg">
        <p className="text-zinc-400 text-lg mb-4">No preview data found.</p>
        <a href="/create" className="text-primary underline text-sm">← Go to Resume Builder</a>
      </div>
    );
  }

  return (
    <PDFViewer style={{ width: '100%', height: '100vh', border: 'none' }}>
      <ResumeDocument
        data={data}
        template={template}
        paperSize={paperSize}
        sectionOrder={sectionOrder}
      />
    </PDFViewer>
  );
}
