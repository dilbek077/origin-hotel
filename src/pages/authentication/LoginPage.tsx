import { useState } from 'react';
import { Eye, EyeOff, Hotel, KeyRound, MoonStar, Sparkles, SunMedium } from 'lucide-react';
import { LANGUAGES, useTranslation, type LanguageCode } from '@/i18n';
import { MOCK_USERS, authenticateMockUser, type MockUser } from '@/services/mockAuth';
import { useTheme } from '@/theme';

export default function LoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t, locale, setLocale } = useTranslation();
  const { isDark, toggleTheme } = useTheme();

  const fillCredentials = (user: MockUser) => {
    setUsername(user.username);
    setPassword(user.password);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError(t('login.empty'));
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const user = authenticateMockUser(username, password);

      if (!user) {
        setLoading(false);
        setError(t('login.invalid'));
        return;
      }

      localStorage.setItem('token', 'mock-token-' + user.id);
      localStorage.setItem('role', user.role);
      localStorage.setItem('username', user.name);

      if (user.role === 'ADMIN') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/staff';
      }
    }, 600);
  };

  return (
    <div
      className={
        isDark
          ? 'min-h-screen flex bg-slate-950 text-slate-100 transition-colors'
          : 'min-h-screen flex bg-[radial-gradient(circle_at_top,_rgba(191,219,254,0.7),_rgba(239,246,255,0.9)_35%,_rgba(248,250,252,1)_100%)] transition-colors'
      }
    >
      {/* Left branding banner */}
      <div
        className={
          isDark
            ? 'hidden lg:flex lg:w-1/2 relative flex-col justify-between overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.12),_transparent_25%),linear-gradient(135deg,#0a1829_0%,#0f2847_45%,#071322_100%)] border-r border-slate-800'
            : 'hidden lg:flex lg:w-1/2 relative flex-col justify-between overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.38),_transparent_18%),linear-gradient(135deg,#edfaff_0%,#dfeeff_18%,#c9e5ff_42%,#b5d8f5_100%)]'
        }
      >
        <div className="absolute -top-24 -left-20 w-96 h-96 bg-white/10 rounded-full blur-xl" />
        <div className="absolute -bottom-28 -right-20 w-[520px] h-[520px] bg-sky-500/10 rounded-full blur-2xl" />
        <div className="absolute top-1/3 -right-12 w-64 h-64 bg-cyan-400/10 rounded-full blur-xl" />

        <div className="relative z-10 p-10">
          <div className="flex items-center gap-3">
            <div className="bg-white/15 backdrop-blur-md p-2.5 rounded-xl ring-1 ring-white/20 shadow-lg">
              <Hotel className={isDark ? 'text-sky-400 w-7 h-7' : 'text-sky-900 w-7 h-7'} />
            </div>
            <span className={isDark ? 'text-white text-2xl font-bold tracking-wide' : 'text-sky-950 text-2xl font-bold tracking-wide'}>
              {t('login.brandTitle')}
            </span>
          </div>
        </div>

        <div className="relative z-10 px-10 pb-4">
          <h1 className={isDark ? 'text-white text-4xl font-extrabold leading-tight mb-4' : 'text-sky-950 text-4xl font-extrabold leading-tight mb-4'}>
            {t('login.title')}
          </h1>
          <p className={isDark ? 'text-slate-300 text-lg leading-relaxed max-w-sm' : 'text-sky-800 text-lg leading-relaxed max-w-sm'}>
            {t('login.subtitle')}
          </p>

          <div className="flex gap-8 mt-10">
            <div>
              <p className={isDark ? 'text-sky-400 text-3xl font-bold' : 'text-sky-950 text-3xl font-bold'}>120+</p>
              <p className={isDark ? 'text-slate-400 text-sm mt-1' : 'text-sky-700 text-sm mt-1'}>{t('login.stats.rooms')}</p>
            </div>
            <div className={isDark ? 'w-px bg-slate-700' : 'w-px bg-sky-300/70'} />
            <div>
              <p className={isDark ? 'text-sky-400 text-3xl font-bold' : 'text-sky-950 text-3xl font-bold'}>98%</p>
              <p className={isDark ? 'text-slate-400 text-sm mt-1' : 'text-sky-700 text-sm mt-1'}>{t('login.stats.satisfaction')}</p>
            </div>
            <div className={isDark ? 'w-px bg-slate-700' : 'w-px bg-sky-300/70'} />
            <div>
              <p className={isDark ? 'text-sky-400 text-3xl font-bold' : 'text-sky-950 text-3xl font-bold'}>24/7</p>
              <p className={isDark ? 'text-slate-400 text-sm mt-1' : 'text-sky-700 text-sm mt-1'}>{t('login.stats.service')}</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 p-10">
          <p className={isDark ? 'text-slate-400 text-sm' : 'text-sky-700 text-sm'}>{t('login.footer')}</p>
        </div>
      </div>

      {/* Right form side */}
      <div
        className={
          isDark
            ? 'flex-1 flex items-center justify-center bg-slate-950 px-6 py-12'
            : 'flex-1 flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(226,238,255,0.88)_35%,_rgba(219,232,255,0.9)_100%)] px-6 py-12'
        }
      >
        <div className="w-full max-w-md">
          <div className="flex lg:hidden items-center gap-3 justify-center mb-10">
            <div className="bg-[linear-gradient(135deg,#0f2340,#5ab0ff)] p-2.5 rounded-xl shadow-lg">
              <Hotel className="text-white w-6 h-6" />
            </div>
            <span className={isDark ? 'text-white text-2xl font-bold' : 'text-slate-800 text-2xl font-bold'}>
              {t('login.brandTitle')}
            </span>
          </div>

          <div
            className={
              isDark
                ? 'bg-slate-900/95 rounded-2xl shadow-[0_22px_60px_rgba(0,0,0,0.6)] px-8 py-10 border border-slate-800 backdrop-blur-xl'
                : 'bg-white/85 rounded-2xl shadow-[0_22px_60px_rgba(82,120,169,0.15)] px-8 py-10 border border-sky-100 backdrop-blur-xl'
            }
          >
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <h2 className={isDark ? 'text-2xl font-bold text-white' : 'text-2xl font-bold text-slate-900'}>
                  {t('login.welcome')}
                </h2>
                <p className={isDark ? 'text-slate-400 mt-1 text-sm' : 'text-slate-500 mt-1 text-sm'}>
                  {t('login.brandText')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={
                    isDark
                      ? 'p-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700'
                      : 'p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }
                  aria-label="Toggle theme"
                >
                  {isDark ? <SunMedium size={16} /> : <MoonStar size={16} />}
                </button>
                <select
                  value={locale}
                  onChange={(event) => setLocale(event.target.value as LanguageCode)}
                  className={
                    isDark
                      ? 'rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-slate-100 outline-none focus:ring-2 focus:ring-blue-500'
                      : 'rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-blue-500'
                  }
                >
                  {LANGUAGES.map((language) => (
                    <option key={language.code} value={language.code} className={isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}>
                      {language.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-5">
                <label
                  htmlFor="username"
                  className={isDark ? 'block text-sm font-medium text-slate-300 mb-1.5' : 'block text-sm font-medium text-gray-700 mb-1.5'}
                >
                  {t('login.username')}
                </label>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t('login.demoHint')}
                  className={
                    isDark
                      ? 'w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-200'
                      : 'w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition duration-200'
                  }
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className={isDark ? 'block text-sm font-medium text-slate-300 mb-1.5' : 'block text-sm font-medium text-gray-700 mb-1.5'}
                >
                  {t('login.password')}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={
                      isDark
                        ? 'w-full px-4 py-3 pr-12 rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-200'
                        : 'w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition duration-200'
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className={
                      isDark
                        ? 'absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors'
                        : 'absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                    }
                    tabIndex={-1}
                    aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 active:from-sky-700 active:to-cyan-500 text-white font-semibold text-sm rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                    </svg>
                    {t('login.submit')}...
                  </>
                ) : (
                  t('login.submit')
                )}
              </button>
            </form>

            <div className={`mt-6 pt-5 border-t ${isDark ? 'border-slate-800' : 'border-gray-100'}`}>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{t('login.demo')}</span>
              </div>

              <div className="space-y-2">
                {MOCK_USERS.map((user) => {
                  const isSelected = username === user.username;
                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => fillCredentials(user)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between text-xs cursor-pointer ${
                        isSelected
                          ? isDark
                            ? 'border-sky-500 bg-sky-950/40 text-sky-200 shadow-sm'
                            : 'border-blue-500 bg-blue-50/70 text-blue-900 shadow-sm'
                          : isDark
                            ? 'border-slate-800 hover:border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-300'
                            : 'border-gray-100 hover:border-gray-200 bg-gray-50/80 hover:bg-gray-100/70 text-gray-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={isDark ? 'font-semibold text-white' : 'font-semibold text-gray-900'}>{user.name}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${user.role === 'ADMIN' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                            {user.role}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-2">
                          <span>Login: <strong className={isDark ? 'text-slate-300 font-mono' : 'text-gray-600 font-mono'}>{user.username}</strong></span>
                          <span>•</span>
                          <span>{t('login.password')}: <strong className={isDark ? 'text-slate-300 font-mono' : 'text-gray-600 font-mono'}>{user.password}</strong></span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sky-500 font-medium text-[11px]">
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>OK</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <p className="text-center text-gray-400 dark:text-slate-500 text-xs mt-6">
            © 2026 Origin Hotel Management System
          </p>
        </div>
      </div>
    </div>
  );
}
