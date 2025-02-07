import { getRepository } from "typeorm";
import { generateSlug } from "../utils/generateSlug";
import { ShortUrl } from "../entity/ShortUrl";
import { User } from "../entity/User";
import logger from "../logger";
import { ERROR_MESSAGES } from "../constants";

export const createShortUrl = async (
  originalUrl: string,
  customSlug?: string,
  userId?: string
): Promise<string> => {
  const urlRepository = getRepository(ShortUrl);
  let slug: string;

  if (customSlug) {
    const exists = await urlRepository.findOne(customSlug);
    if (exists) {
      logger.warn(`Custom slug "${customSlug}" already in use`);
      throw new Error(ERROR_MESSAGES.SLUG_ALREADY_EXISTED);
    }
    slug = customSlug;
  } else {
    slug = generateSlug();
    while (await urlRepository.findOne(slug)) {
      slug = generateSlug();
    }
  }

  const urlEntry = new ShortUrl();
  urlEntry.slug = slug;
  urlEntry.originalUrl = originalUrl;
  urlEntry.visits = 0;

  if (userId) {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne(userId);
    if (user) {
      urlEntry.user = user;
    }
  }

  await urlRepository.save(urlEntry);
  logger.info(`Created new short URL: ${slug} for ${originalUrl}`);
  return slug;
}

export const getUrlBySlug = async (slug: string): Promise<string | null> => {
  const urlRepository = getRepository(ShortUrl);
  const record = await urlRepository.findOne(slug);
  if (record) {
    record.visits++;
    await urlRepository.save(record);
    return record.originalUrl;
  }
  return null;
};

export const getUrlsByUser = async (userId: string): Promise<ShortUrl[]> => {
  const urlRepository = getRepository(ShortUrl);
  return await urlRepository.find({
    where: { user: { userId } },
    relations: ['user'],
  });
};
