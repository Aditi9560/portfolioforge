import { Router, Request, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router  = Router();
const storage = multer.memoryStorage();
const upload  = multer({ storage });

// POST /api/upload
router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  try {
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'portfolioforge' },
          (error, result) => {
            if (error || !result) return reject(error ?? new Error('No result from Cloudinary'));
            resolve({ secure_url: result.secure_url, public_id: result.public_id });
          }
        );
        stream.end(req.file!.buffer);
      }
    );

    console.log('[upload] success:', result.public_id);
    return res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[upload] Cloudinary error:', error);
    return res.status(500).json({ error: 'Upload failed', details: msg });
  }
});

export default router;
