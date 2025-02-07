import { randomInt } from 'crypto';

export const generateSlug = (length: number = 6): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charsLength = chars.length;
  let slug = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = randomInt(0, charsLength);
    slug += chars.charAt(randomIndex);
  }

  return slug;
};
