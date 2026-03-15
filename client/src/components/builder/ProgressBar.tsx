import { motion } from 'framer-motion';

const STEPS = ['About', 'Skills', 'Projects', 'Experience', 'Education', 'Publish'];

interface Props {
  current: number;
  onNavigate: (step: number) => void;
}

export function ProgressBar({ current, onNavigate }: Props) {
  return (
    <div className="w-full max-w-lg mx-auto px-2">
      <div className="relative flex items-start justify-between">
        {/* Connecting line track */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-zinc-800 -z-0" />
        {/* Filled progress line */}
        <motion.div
          className="absolute top-4 left-4 h-0.5 bg-primary origin-left"
          style={{ right: 4 }}
          initial={false}
          animate={{ scaleX: current / (STEPS.length - 1) }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />

        {STEPS.map((label, i) => {
          const done    = i < current;
          const active  = i === current;
          const canClick = done;

          return (
            <div key={label} className="relative z-10 flex flex-col items-center gap-1.5">
              <button
                onClick={() => canClick && onNavigate(i)}
                disabled={!canClick}
                className={[
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all select-none',
                  done   ? 'bg-primary text-black cursor-pointer hover:brightness-110' : '',
                  active ? 'bg-dark-bg border-2 border-primary text-primary ring-4 ring-primary/20' : '',
                  !done && !active ? 'bg-dark-card border-2 border-dark-border text-zinc-600' : '',
                ].join(' ')}
              >
                {done ? '✓' : i + 1}
              </button>
              <span
                className={[
                  'text-[10px] leading-tight hidden sm:block whitespace-nowrap',
                  active ? 'text-primary font-semibold' : done ? 'text-white' : 'text-zinc-600',
                ].join(' ')}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
