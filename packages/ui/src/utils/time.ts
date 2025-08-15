export const formatTime = (totalSeconds: number) => {
  const sign = totalSeconds < 0 ? '-' : '';
  const secs = Math.abs(Math.trunc(totalSeconds));
  const hours = Math.floor(secs / 3600);
  const minutes = Math.floor((secs % 3600) / 60);
  const seconds = secs % 60;
  const mm = hours > 0 ? String(minutes).padStart(2, '0') : String(minutes);
  const hh = String(hours);
  const ss = String(seconds).padStart(2, '0');
  return hours > 0 ? `${sign}${hh}:${mm}:${ss}` : `${sign}${mm}:${ss}`;
};
