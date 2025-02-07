import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { createShortUrl, getUrlsByUser } from '../controllers/urlController';
import { DUMMY_JWT_SECRET, BASE_URL, ERROR_MESSAGES } from '../constants';
import logger from '../logger';

interface ShorternRequestBody {
  originalUrl: string;
  customSlug?: string;
}

const router = Router();

router.post(
  '/shorten',
  async (req: Request<{}, {}, ShorternRequestBody>, res: Response) => {
    try {
      const { originalUrl, customSlug } = req.body;
      if (!originalUrl) {
        logger.warn('Url is required');
        return res
          .status(400)
          .json({ errors: [{ detail: 'Url is required' }] });
      }
      try {
        new URL(originalUrl);
      } catch {
        return res
          .status(400)
          .json({ errors: [{ detail: 'Invalid Url' }] });
      }
      
      let userId: string | undefined = undefined;
      const authHeader = req.headers['authorization'];
      if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
          const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || DUMMY_JWT_SECRET
          ) as { userId: string };
          userId = decoded.userId;
        } catch (err) {
          logger.warn('Invalid token provided in shorten endpoint.');
        }
      }
      
      // Create the short URL and associate it with the user if userId is present.
      const slug = await createShortUrl(originalUrl, customSlug, userId);
      return res.status(201).json({
        data: {
          attributes: {
            shortUrl: `${BASE_URL}/${slug}`,
          },
        },
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : ERROR_MESSAGES.UNEXPECTED_ERROR;
      const statusCode =
        errorMessage === ERROR_MESSAGES.SLUG_ALREADY_EXISTED ? 409 : 500;
      return res
        .status(statusCode)
        .json({ errors: [{ detail: errorMessage }] });
    }
  }
);

router.get('/user/urls', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ errors: [{ detail: 'Unauthorized' }] });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || DUMMY_JWT_SECRET
    ) as { userId: string };
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ errors: [{ detail: 'Unauthorized' }] });
    }
    const urls = await getUrlsByUser(decoded.userId);
    res.json({
      data: urls.map(url => ({
        id: url.slug,
        attributes: {
          slug: url.slug,
          originalUrl: url.originalUrl,
          visits: url.visits,
          shortUrl: `${BASE_URL}/${url.slug}`
        }
      }))
    });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : 'An unexpected error occurred.';
    return res.status(500).json({ errors: [{ detail: errorMessage }] });
  }
});

export default router;
