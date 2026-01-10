// utils/imageUrl.js
const BASE_URL = import.meta.env.VITE_API_URL || "https://shopclues-xr1j.onrender.com";

export const getImageUrl = (path) => {
  if (!path) return "/no-image.png";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}/${path}`;
};
