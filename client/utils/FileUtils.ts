export const ALLOWED_TYPES = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.mp4',
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.ppt',
  '.pptx',
  '.txt',
];

export function getFileType(url: string): string {

  const extension = url.substring(url.lastIndexOf('.')).toLowerCase();

  if (
    extension === '.jpg' ||
    extension === '.jpeg' ||
    extension === '.png' ||
    extension === '.gif'
  ) {
    return 'image';
  } else if (extension === '.mp4') {
    return 'video';
  } else if (ALLOWED_TYPES.includes(extension)) {
    return 'docs';
  } else {
    return 'unknown';
  }
}