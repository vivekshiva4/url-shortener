
import { Router, Request, Response } from 'express';
import { getUrlBySlug } from '../controllers/urlController';
import logger from '../logger';

interface RedirectRequestParams {
  slug: string;
}

const router = Router();

router.get('/:slug', async (req: Request<RedirectRequestParams>, res: Response) => {
  const { slug } = req.params;

  if (!slug) {
    logger.debug('Slug not found in the req param');
    return res.status(400).json({ errors: [{ detail: 'Slug is required' }] });
  }
  try {
    const originalUrl = await getUrlBySlug(slug);
    if (originalUrl) {
      logger.info(`Redirecting slug "${slug}" to "${originalUrl}"`);
      return res.redirect(originalUrl);
    }
    logger.warn(`Slug not found: ${slug}`);
    return res.status(404).json({ errors: [{ detail: 'Not Found' }] });
  } catch (error) {
    logger.error('Error processing redirect:', error);
    return res.status(500).json({ errors: [{ detail: 'Internal Server Error' }] });
  }
});

export default router;
