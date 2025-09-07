import { Duration } from 'luxon';

export const formatTimeMillis = (totalMillis: number | undefined) => {
  if (totalMillis === undefined) {
    return '';
  }
  const totalSeconds = Math.floor(totalMillis / 1000);
  return formatTimeSeconds(totalSeconds);
};

export const formatTimeSeconds = (totalSeconds: number | undefined) => {
  if (totalSeconds === undefined) {
    return '';
  }

  const sign = totalSeconds < 0 ? '-' : '';
  const secs = Math.abs(Math.trunc(totalSeconds));
  const dur = Duration.fromObject({ seconds: secs }).shiftTo(
    'hours',
    'minutes',
    'seconds',
  );
  const hours = dur.hours ?? 0;
  const fmt = hours > 0 ? 'h:mm:ss' : 'm:ss';
  return `${sign}${dur.toFormat(fmt)}`;
};
