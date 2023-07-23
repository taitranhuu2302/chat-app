export const convertSecondToMinute = (num: number): string => {
  const durationInMinutes = Math.floor(num / 60);
  const durationSecondsRemaining = num % 60;
  return `${durationInMinutes
    .toString()
    .padStart(2, '0')}:${durationSecondsRemaining.toString().padStart(2, '0')}`;
};
