/** Resolve only known application destinations; never redirect to an external URL. */
export function getPostLoginPath(role: 'ADMIN' | 'STAFF', from: unknown): string {
  const base = role === 'ADMIN' ? '/admin' : '/staff';
  if (typeof from !== 'string' || !/^\/(admin|staff)(\/|$)/.test(from)) return base;
  const path = from.split(/[?#]/, 1)[0];
  const suffix = path.replace(/^\/(admin|staff)/, '');
  const shared = ['', '/xonalar', '/mehmonlar', '/bronlar', '/bronlar/kelish-ketish'];
  const admin = ['/moliya', '/hisobotlar', '/sozlamalar', '/sozlamalar/profil', '/sozlamalar/bildirishnomalar'];
  return shared.includes(suffix) || (role === 'ADMIN' && admin.includes(suffix)) ? `${base}${suffix}` : base;
}
