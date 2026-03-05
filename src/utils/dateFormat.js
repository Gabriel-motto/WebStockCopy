export function formatDate(
  isoString,
  { timeZone = 'Europe/Madrid', useUTC = false } = {}
) {
  const date = new Date(isoString);
  if (Number.isNaN(date)) throw new Error('Fecha inválida');

  const formatter = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: useUTC ? 'UTC' : timeZone,
  });

  const parts = formatter.formatToParts(date);
  const part = (type) => parts.find((p) => p.type === type)?.value ?? '';

  const dd = part('day');
  const mm = part('month');
  const yyyy = part('year');
  const HH = part('hour');
  const min = part('minute');

  return `${dd}/${mm}/${yyyy} ${HH}:${min}`;
}