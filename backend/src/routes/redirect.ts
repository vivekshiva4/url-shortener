import { Router, Request, Response } from 'express';
import { getUrlBySlug } from '../controllers/urlController';
import logger from '../logger';

interface RedirectRequestParams {
  slug: string;
}

type RedirectResponse = Response<string>;

const router = Router();

router.get('/:slug', async (req: Request<RedirectRequestParams>, res: RedirectResponse) => {
  const { slug } = req.params;

  if (!slug) {
    logger.debug('Slug not found in the req param');
    return res.status(400).send('Slug is required');
  }
  try {
    const originalUrl = await getUrlBySlug(slug);
    if (originalUrl) {
      logger.info(`Redirecting slug "${slug}" to "${originalUrl}"`);
      return res.redirect(originalUrl);
    }
    logger.warn(`Slug not found: ${slug}`);
    return res.status(404).send('Not Found');
  } catch (error) {
    logger.error('Error processing redirect:', error);
    return res.status(500).send('Internal Server Error');
  }
});

export default router;
