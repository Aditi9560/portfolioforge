import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ExternalLink, Linkedin, Link as LinkIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  slug: string;
  onClose: () => void;
  isEditing?: boolean;
}

export function SuccessModal({ slug, onClose, isEditing = false }: Props) {
  const url     = `${window.location.origin}/p/${slug}`;
  const editUrl = `${window.location.origin}/create?slug=${slug}`;

  const [copied,     setCopied]     = useState(false);
  const [editCopied, setEditCopied] = useState(false);

  useEffect(() => {
    const fire = (opts: confetti.Options) => confetti({ ...opts, disableForReducedMotion: true });
    fire({ particleCount: 60, angle: 60,  spread: 55,  origin: { x: 0 },        colors: ['#10b981', '#ffffff', '#06b6d4'] });
    fire({ particleCount: 60, angle: 120, spread: 55,  origin: { x: 1 },        colors: ['#10b981', '#ffffff', '#06b6d4'] });
    setTimeout(() => fire({ particleCount: 40, spread: 100, origin: { y: 0.6 }, colors: ['#10b981', '#06b6d4'] }), 300);
  }, []);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyEditLink = async () => {
    await navigator.clipboard.writeText(editUrl);
    setEditCopied(true);
    setTimeout(() => setEditCopied(false), 2000);
  };

  const linkedInShare = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-dark-card border border-dark-border rounded-3xl p-8 sm:p-10 max-w-md w-full text-center z-10 shadow-2xl overflow-y-auto max-h-[90vh]"
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {/* Glow */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-32 bg-primary/10 rounded-full blur-3xl" />
            </div>
          </div>

          <div className="relative">
            <div className="text-5xl mb-4">🎉</div>

            <h2 className="font-display font-bold text-3xl text-white mb-2">
              {isEditing ? 'Portfolio Updated!' : 'Your Portfolio is Live!'}
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              {isEditing
                ? 'Your changes are now live.'
                : 'Share it with the world — your work deserves to be seen.'}
            </p>

            {/* Portfolio URL box */}
            <div className="bg-dark-bg border border-dark-border rounded-xl p-3.5 mb-4 font-mono text-sm text-primary break-all">
              {url}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  onClick={copyLink}
                  className="flex items-center justify-center gap-2 border border-dark-border text-zinc-300 hover:text-white py-2.5 rounded-xl text-sm transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {copied ? <><Check size={15} className="text-primary" />Copied!</> : <><Copy size={15} />Copy Link</>}
                </motion.button>
                <motion.button
                  onClick={linkedInShare}
                  className="flex items-center justify-center gap-2 bg-[#0077b5]/20 border border-[#0077b5]/40 text-[#0ca0e3] py-2.5 rounded-xl text-sm hover:bg-[#0077b5]/30 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Linkedin size={15} />Share on LinkedIn
                </motion.button>
              </div>
              <motion.a
                href={`/p/${slug}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-primary text-black font-semibold py-3 rounded-xl text-sm hover:brightness-110 transition-all"
                style={{ boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <ExternalLink size={15} /> View My Portfolio →
              </motion.a>
            </div>

            {/* Edit link section */}
            <div className="mt-6 text-left">
              <p className="text-xs text-zinc-500 mb-2">Save this link to edit your portfolio later:</p>
              <div className="flex items-center gap-2 bg-dark-bg border border-dark-border rounded-xl px-3 py-2.5">
                <span className="font-mono text-xs text-zinc-400 flex-1 truncate">{editUrl}</span>
                <button
                  onClick={copyEditLink}
                  className="flex-shrink-0 text-zinc-500 hover:text-primary transition-colors"
                  title="Copy edit link"
                >
                  {editCopied ? <Check size={13} className="text-primary" /> : <LinkIcon size={13} />}
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem('portfolioforge_draft');
                window.location.href = '/create';
              }}
              className="mt-5 text-zinc-600 hover:text-zinc-400 text-xs transition-colors underline underline-offset-2"
            >
              Clear draft and start over
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
