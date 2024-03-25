export const extractRootDirectory = (path: string): string => {
  path = path.startsWith('/') ? path.slice(1) : path;
  return path.split('/')[0];
};
