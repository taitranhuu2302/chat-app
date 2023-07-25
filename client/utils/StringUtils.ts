export const formatLimitText = (text: string, countCharacter: number) => { 
  return text.length <= countCharacter ? text : `${text.substring(0, countCharacter)}...`
}