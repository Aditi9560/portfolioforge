import { useState, useRef, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Upload, Link2, User, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../lib/api';
import { clsx } from 'clsx';
import type { AboutValues } from './types';

const INPUT = clsx(
  'w-full bg-dark-card border border-dark-border rounded-xl px-4 py-2.5 text-white',
  'placeholder-zinc-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30',
  'transition-all text-sm'
);
const ERR = 'text-red-400 text-xs mt-1';
const LABEL = 'block text-zinc-400 text-sm mb-1.5 font-medium';

function errorInput(hasError: boolean) {
  return hasError
    ? clsx(INPUT, 'border-red-500 focus:border-red-500 focus:ring-red-500/20')
    : INPUT;
}

function PhotoUpload() {
  const { setValue, watch } = useFormContext<AboutValues>();
  const photoUrl = watch('photo_url');
  const [tab, setTab]       = useState<'upload' | 'url'>('upload');
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput]   = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post('/api/upload', fd);
      setValue('photo_url', res.data.url, { shouldDirty: true });
    } catch {
      toast.error('Upload failed — check Cloudinary credentials in server/.env');
    } finally {
      setUploading(false);
    }
  }, [setValue]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  return (
    <div>
      <label className={LABEL}>Profile Photo</label>
      {/* Tab switcher */}
      <div className="flex gap-1 bg-dark-card border border-dark-border rounded-xl p-1 mb-3 w-fit">
        {(['upload', 'url'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              tab === t ? 'bg-primary text-black' : 'text-zinc-400 hover:text-white'
            )}
          >
            {t === 'upload' ? <><Upload size={12} className="inline mr-1" />Upload File</> : <><Link2 size={12} className="inline mr-1" />Paste URL</>}
          </button>
        ))}
      </div>

      <div className="flex gap-4 items-start">
        {/* Preview circle */}
        {photoUrl ? (
          <div className="relative flex-shrink-0">
            <img src={photoUrl} alt="preview" className="w-16 h-16 rounded-full object-cover border-2 border-primary" />
            <button
              type="button"
              onClick={() => setValue('photo_url', '', { shouldDirty: true })}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-400"
            >×</button>
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-dark-card border-2 border-dashed border-dark-border flex items-center justify-center text-zinc-600 flex-shrink-0">
            <User size={20} />
          </div>
        )}

        {/* Upload zone / URL input */}
        <div className="flex-1">
          {tab === 'upload' ? (
            <div
              className={clsx(
                'border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all',
                dragging ? 'border-primary bg-primary/5' : 'border-dark-border hover:border-zinc-600'
              )}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); }}
              />
              {uploading ? (
                <div className="flex items-center justify-center gap-2 text-zinc-400 text-sm">
                  <Loader2 size={16} className="animate-spin" /> Uploading...
                </div>
              ) : (
                <div className="text-zinc-500 text-sm">
                  <Upload size={20} className="mx-auto mb-1 text-zinc-600" />
                  Drop image here or <span className="text-primary">click to browse</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className={INPUT}
              />
              <button
                type="button"
                onClick={() => { if (urlInput.trim()) { setValue('photo_url', urlInput.trim(), { shouldDirty: true }); setUrlInput(''); } }}
                className="bg-primary text-black px-4 rounded-xl text-sm font-semibold hover:brightness-110 transition-all flex-shrink-0"
              >
                Load
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Step1About() {
  const { register, watch, formState: { errors } } = useFormContext<AboutValues>();
  const bio = watch('bio') ?? '';

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display font-bold text-2xl text-white mb-1">About You</h2>
        <p className="text-zinc-500 text-sm">Your personal details and how to reach you.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Full Name <span className="text-primary">*</span></label>
          <input className={errorInput(!!errors.name)} placeholder="Aditi Sharma" {...register('name')} />
          {errors.name && <p className={ERR}>{errors.name.message}</p>}
        </div>
        <div>
          <label className={LABEL}>Professional Title <span className="text-primary">*</span></label>
          <input className={errorInput(!!errors.title)} placeholder="Full Stack Developer" {...register('title')} />
          {errors.title && <p className={ERR}>{errors.title.message}</p>}
        </div>
      </div>

      <div>
        <label className={LABEL}>Location</label>
        <input className={INPUT} placeholder="Bangalore, India" {...register('location')} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className={LABEL} style={{ margin: 0 }}>Bio</label>
          <span className={clsx('text-xs', bio.length > 280 ? 'text-red-400' : 'text-zinc-500')}>
            {bio.length}/300
          </span>
        </div>
        <textarea
          rows={4}
          maxLength={300}
          className={clsx(INPUT, 'resize-none')}
          placeholder="I'm a developer who loves building fast, accessible web apps..."
          {...register('bio')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Email</label>
          <input type="email" className={errorInput(!!errors.email)} placeholder="you@example.com" {...register('email')} />
          {errors.email && <p className={ERR}>{errors.email.message}</p>}
        </div>
        <div>
          <label className={LABEL}>Phone Number</label>
          <input type="tel" className={INPUT} placeholder="+91 98765 43210" {...register('phone')} />
        </div>
      </div>

      <PhotoUpload />

      <div className="pt-1 border-t border-dark-border">
        <p className="text-zinc-500 text-xs mb-4 mt-3">Social &amp; Links</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>GitHub URL</label>
            <input className={errorInput(!!errors.github_url)} placeholder="https://github.com/username" {...register('github_url')} />
            {errors.github_url && <p className={ERR}>{errors.github_url.message}</p>}
          </div>
          <div>
            <label className={LABEL}>LinkedIn URL</label>
            <input className={errorInput(!!errors.linkedin_url)} placeholder="https://linkedin.com/in/username" {...register('linkedin_url')} />
            {errors.linkedin_url && <p className={ERR}>{errors.linkedin_url.message}</p>}
          </div>
          <div>
            <label className={LABEL}>Twitter / X URL</label>
            <input className={errorInput(!!errors.twitter_url)} placeholder="https://twitter.com/username" {...register('twitter_url')} />
            {errors.twitter_url && <p className={ERR}>{errors.twitter_url.message}</p>}
          </div>
          <div>
            <label className={LABEL}>Website URL</label>
            <input className={errorInput(!!errors.website_url)} placeholder="https://yoursite.com" {...register('website_url')} />
            {errors.website_url && <p className={ERR}>{errors.website_url.message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
