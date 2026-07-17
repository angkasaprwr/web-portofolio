const slugify = (text) =>
  String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const buildFileUrl = (req, filename, folder = 'images') => {
  if (!filename) return null;
  if (filename.startsWith('http')) return filename;
  const base = `${req.protocol}://${req.get('host')}`;
  return `${base}/uploads/${folder}/${filename}`;
};

module.exports = { slugify, buildFileUrl };
