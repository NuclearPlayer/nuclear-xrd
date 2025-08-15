import { Duration } from 'luxon';

export const formatTime = (totalSeconds: number) => {
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
