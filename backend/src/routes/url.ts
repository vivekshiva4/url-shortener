import { Router, Request, Response } from 'express';
import { createShortUrl, getUrlsByUser } from '../controllers/urlController';
import { authenticateToken } from '../middleware/auth';
import logger from '../logger';
import { BASE_URL, ERROR_MESSAGES } from '../constants';

interface ShorternRequestBody {
  originalUrl: string;
  customSlug?: string;
  userId?: string;
}

interface UserUrlRequestBody {
  username: string;
  password: string;
}

const router = Router();
router.post('/shorten', async (req: Request<{}, {}, ShorternRequestBody>, res: Response) => {
  try {
    const { body: { originalUrl, customSlug, userId } } = req;
    if (!originalUrl) {
      logger.warn('Url is required');
      return res.status(400).json({ message: 'Url is required' });
    }
    try {
      new URL(originalUrl);
    } catch {
      return res.status(400).json({ message: 'Invalid Url' });
    }
    const slug = await createShortUrl(originalUrl, customSlug, userId);
    return res
      .status(201)
      .json({ shortUrl: `${BASE_URL}/${slug}` });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.UNEXPECTED_ERROR;
    const statusCode = errorMessage === ERROR_MESSAGES.SLUG_ALREADY_EXISTED ? 409 : 500;
    return res.status(statusCode).json({ error: errorMessage });
  }
});

router.get('/user/urls', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'userId is required and must be a string.' });
    }
    const urls = await getUrlsByUser(userId);

    res.json({
      data: urls.map(url => ({
        data: {
          slug: url.slug,
          originalUrl: url.originalUrl,
          visits: url.visits,
          shortUrl: `${BASE_URL}/${url.slug}`
        }
      }))
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
    return res.status(500).json({ error: errorMessage });
  }
});

export default router;
