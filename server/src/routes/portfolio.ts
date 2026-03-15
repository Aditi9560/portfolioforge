import { Router, Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { db } from '../db';
import { portfolios } from '../schema';

const router = Router();

const JSON_FIELDS = ['skills', 'projects', 'experience', 'education', 'certifications'] as const;

function stringifyArrayFields(data: Record<string, unknown>) {
  const result = { ...data };
  for (const field of JSON_FIELDS) {
    if (Array.isArray(result[field])) {
      result[field] = JSON.stringify(result[field]);
    }
  }
  return result;
}

function parseArrayFields(row: Record<string, unknown>) {
  const result = { ...row };
  for (const field of JSON_FIELDS) {
    if (typeof result[field] === 'string') {
      try {
        result[field] = JSON.parse(result[field] as string);
      } catch {
        result[field] = [];
      }
    }
  }
  return result;
}

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
}

const createPortfolioSchema = z.object({
  name:           z.string().min(1),
  title:          z.string().optional(),
  bio:            z.string().optional(),
  phone:          z.string().optional(),
  photo_url:      z.string().url().optional(),
  resume_url:     z.string().url().optional(),
  email:          z.string().email().optional(),
  github_url:     z.string().url().optional(),
  linkedin_url:   z.string().url().optional(),
  twitter_url:    z.string().url().optional(),
  location:       z.string().optional(),
  skills:         z.array(z.unknown()).optional(),
  projects:       z.array(z.unknown()).optional(),
  experience:     z.array(z.unknown()).optional(),
  education:      z.array(z.unknown()).optional(),
  certifications: z.array(z.unknown()).optional(),
  theme:          z.string().optional(),
  accent_color:   z.string().optional(),
});

// POST /api/portfolio
router.post('/', async (req: Request, res: Response) => {
  const parsed = createPortfolioSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const data = parsed.data;
  const id = uuidv4();
  const slug = generateSlug(data.name);
  const now = new Date().toISOString();

  const row = stringifyArrayFields({
    id,
    slug,
    name:           data.name,
    title:          data.title ?? null,
    bio:            data.bio ?? null,
    phone:          data.phone ?? null,
    photo_url:      data.photo_url ?? null,
    resume_url:     data.resume_url ?? null,
    email:          data.email ?? null,
    github_url:     data.github_url ?? null,
    linkedin_url:   data.linkedin_url ?? null,
    twitter_url:    data.twitter_url ?? null,
    location:       data.location ?? null,
    skills:         data.skills ?? [],
    projects:       data.projects ?? [],
    experience:     data.experience ?? [],
    education:      data.education ?? [],
    certifications: data.certifications ?? [],
    theme:          data.theme ?? 'dark',
    accent_color:   data.accent_color ?? '#10b981',
    views:          0,
    created_at:     now,
    updated_at:     now,
  });

  await db.insert(portfolios).values(row as typeof portfolios.$inferInsert);
  return res.status(201).json({ id, slug });
});

// PUT /api/portfolio/:slug
router.put('/:slug', async (req: Request, res: Response) => {
  const parsed = createPortfolioSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const rows = await db.select().from(portfolios).where(eq(portfolios.slug, req.params.slug));
  if (rows.length === 0) {
    return res.status(404).json({ error: 'Portfolio not found' });
  }

  const data = parsed.data;
  const now = new Date().toISOString();

  const updates = stringifyArrayFields({
    name:           data.name,
    title:          data.title ?? null,
    bio:            data.bio ?? null,
    phone:          data.phone ?? null,
    photo_url:      data.photo_url ?? null,
    resume_url:     data.resume_url ?? null,
    email:          data.email ?? null,
    github_url:     data.github_url ?? null,
    linkedin_url:   data.linkedin_url ?? null,
    twitter_url:    data.twitter_url ?? null,
    location:       data.location ?? null,
    skills:         data.skills ?? [],
    projects:       data.projects ?? [],
    experience:     data.experience ?? [],
    education:      data.education ?? [],
    certifications: data.certifications ?? [],
    theme:          data.theme ?? 'dark',
    accent_color:   data.accent_color ?? '#10b981',
    updated_at:     now,
  });

  await db
    .update(portfolios)
    .set(updates as Partial<typeof portfolios.$inferInsert>)
    .where(eq(portfolios.slug, req.params.slug));

  return res.json({ slug: req.params.slug, message: 'Portfolio updated' });
});

// GET /api/portfolio/:slug
router.get('/:slug', async (req: Request, res: Response) => {
  const { slug } = req.params;
  const rows = await db.select().from(portfolios).where(eq(portfolios.slug, slug));
  if (rows.length === 0) {
    return res.status(404).json({ error: 'Portfolio not found' });
  }

  const portfolio = rows[0];

  await db
    .update(portfolios)
    .set({ views: (portfolio.views ?? 0) + 1 })
    .where(eq(portfolios.slug, slug));

  const parsed = parseArrayFields(portfolio as unknown as Record<string, unknown>);
  return res.json(parsed);
});

// GET /api/portfolio/:slug/stats
router.get('/:slug/stats', async (req: Request, res: Response) => {
  const { slug } = req.params;
  const rows = await db.select().from(portfolios).where(eq(portfolios.slug, slug));
  if (rows.length === 0) {
    return res.status(404).json({ error: 'Portfolio not found' });
  }

  const p = rows[0];
  const parseLen = (field: string | null | undefined): number => {
    try {
      return JSON.parse(field ?? '[]').length;
    } catch {
      return 0;
    }
  };

  return res.json({
    views:           p.views,
    created_at:      p.created_at,
    slug:            p.slug,
    projectCount:    parseLen(p.projects),
    skillCount:      parseLen(p.skills),
    experienceCount: parseLen(p.experience),
  });
});

export default router;
