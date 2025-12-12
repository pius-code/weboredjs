import { getRandomCachedImage } from "../utils/ImageCache.js";

export const getRandomImage = async () => {
  return await getRandomCachedImage();
};
