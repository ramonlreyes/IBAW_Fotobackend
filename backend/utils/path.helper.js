import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = path.join(__dirname, '..', '..');

export const getUploadsDir = () => {
  return path.join(projectRoot, 'uploads');
};

export const getAlbumDir = (albumTitle, albumId) => {
  const folderName = `${albumTitle.replace(/\s+/g, '_')}-${albumId}`;
  return path.join(getUploadsDir(), folderName);
}

export const getFotoPath = (albumTitle, albumId, filename) => {
  return path.join(getAlbumDir(albumTitle, albumId), filename);
};

export const getUrlPath = (albumTitle, albumId, filename) => {
  const folderName = `${albumTitle.replace(/\s+/g, '_')}-${albumId}`;
  return `/uploads/${folderName}/${filename}`;
};

export const normalizeTitle = (title) => title.trim().replace(/\s+/g, '_');