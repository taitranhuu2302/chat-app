export const formatLimitText = (text: string, countCharacter: number) => {
  return text.length <= countCharacter
    ? text
    : `${text.substring(0, countCharacter)}...`;
};

export function removeMetadata(str: string) {
  return str
    .replace(/\[ar:.*?\]/g, '')
    .replace(/\[ti:.*?\]/g, '')
    .replace(/\[al:.*?\]/g, '')
    .replace(/\[by:.*?\]/g, '')
    .replace(/\[length:.*?\]/g, '')
    .replace(/\[id:.*?\]/g, '')
    .trim();
}
