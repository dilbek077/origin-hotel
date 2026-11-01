export function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function parseDate(key: string) {
  return new Date(`${key}T12:00:00`);
}

export function hotelToday() {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Tashkent', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const part = (type: string) => parts.find((item) => item.type === type)!.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export function nextDate(key: string) {
  const date = parseDate(key);
  date.setDate(date.getDate() + 1);
  return dateKey(date);
}
