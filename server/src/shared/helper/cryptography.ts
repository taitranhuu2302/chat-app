import * as CryptoJS from 'crypto-js';

export const handleEncoding = (message: string) => {
  return CryptoJS.AES.encrypt(message, 'Secret key').toString();
}

export const handleDecoding = (message: any) => {
  const bytes = CryptoJS.AES.decrypt(message, 'Secret key');
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}