const express = require('express');
const auth = require('../middleware/auth');
const { getPresignedUploadUrl } = require('../services/r2');

const router = express.Router();

const ALLOWED_KINDS = new Set(['avatar', 'cover']);
const ALLOWED_CONTENT_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
]);

const SIZE_LIMITS = {
  avatar: 2 * 1024 * 1024, // 2MB
  cover: 6 * 1024 * 1024, // 6MB
};

function getPublicUrl(key) {
  const base = process.env.R2_PUBLIC_BASE;
  if (!base) {
    throw new Error('R2_PUBLIC_BASE is not configured');
  }
  return `${base.replace(/\/$/, '')}/${key}`;
}

router.post('/presign', auth, async (req, res) => {
  try {
    const { kind, contentType, size } = req.body || {};

    if (!ALLOWED_KINDS.has(kind)) {
      return res.status(400).json({ error: 'Invalid kind. Use avatar or cover.' });
    }

    if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
      return res.status(400).json({ error: 'Unsupported content type' });
    }

    if (size !== undefined) {
      const bytes = Number(size);
      if (!Number.isFinite(bytes) || bytes <= 0) {
        return res.status(400).json({ error: 'Invalid file size' });
      }
      const limit = SIZE_LIMITS[kind] || 0;
      if (limit && bytes > limit) {
        return res.status(400).json({ error: `File exceeds ${Math.round(limit / (1024 * 1024))}MB limit` });
      }
    }

    const ext = ALLOWED_CONTENT_TYPES.get(contentType);
    const timestamp = Date.now();
    const key = `users/${req.user.id}/${kind}-${timestamp}.${ext}`;

    const uploadUrl = await getPresignedUploadUrl({ key, contentType });
    const publicUrl = getPublicUrl(key);

    return res.json({ uploadUrl, publicUrl });
  } catch (err) {
    console.error('Failed to presign upload', err);
    return res.status(500).json({ error: 'Failed to create upload URL' });
  }
});

module.exports = router;
