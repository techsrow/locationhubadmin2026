const FILE_BASE_URL = process.env.NEXT_PUBLIC_FILE_URL;

export const getFileUrl = (path: string) => {
  if (!path) return "";

  // If already full URL, return as-is
  if (path.startsWith("http")) return path;

  // Remove leading slash if exists
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  return `${FILE_BASE_URL}/${cleanPath}`;
};
