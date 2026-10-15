import { useState } from 'react';
import { Eye, EyeOff, Hotel, KeyRound, Sparkles } from 'lucide-react';
import { MOCK_USERS, authenticateMockUser, type MockUser } from '@/services/mockAuth';

export default function LoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fillCredentials = (user: MockUser) => {
    setUsername(user.username);
    setPassword(user.password);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError("Iltimos, barcha maydonlarni to'ldiring.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const user = authenticateMockUser(username, password);

      if (!user) {
        setLoading(false);
        setError("Login yoki parol noto'g'ri! (Pastdagi demo hisoblardan tanlang)");
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
    <div className="min-h-screen flex">
      {/* Left Side — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between bg-gradient-to-br from-blue-600 to-blue-800 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-white/5 rounded-full" />
        <div className="absolute top-1/3 -right-16 w-64 h-64 bg-blue-500/30 rounded-full" />

        {/* Top Logo */}
        <div className="relative z-10 p-10">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
              <Hotel className="text-white w-7 h-7" />
            </div>
            <span className="text-white text-2xl font-bold tracking-wide">Origin Hotel</span>
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 px-10 pb-4">
          <h1 className="text-white text-4xl font-extrabold leading-tight mb-4">
            Mehmonxona<br />Boshqaruv Tizimi
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed max-w-sm">
            Barcha xonalar, mehmonlar va xizmatlarni bir joydan boshqaring.
          </p>

          {/* Stats */}
          <div className="flex gap-8 mt-10">
            <div>
              <p className="text-white text-3xl font-bold">120+</p>
              <p className="text-blue-200 text-sm mt-1">Xonalar</p>
            </div>
            <div className="w-px bg-white/20" />
            <div>
              <p className="text-white text-3xl font-bold">98%</p>
              <p className="text-blue-200 text-sm mt-1">Mijozlar mamnuniyati</p>
            </div>
            <div className="w-px bg-white/20" />
            <div>
              <p className="text-white text-3xl font-bold">24/7</p>
              <p className="text-blue-200 text-sm mt-1">Xizmat</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 p-10">
          <p className="text-blue-300 text-sm">© 2026 Origin Hotel. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>

      {/* Right Side — Login Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-3 justify-center mb-10">
            <div className="bg-blue-600 p-2.5 rounded-xl">
              <Hotel className="text-white w-6 h-6" />
            </div>
            <span className="text-gray-800 text-2xl font-bold">Origin Hotel</span>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 px-8 py-10 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Xush kelibsiz!</h2>
              <p className="text-gray-500 mt-1 text-sm">Tizimga kirish uchun ma'lumotlaringizni kiriting.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* Username */}
              <div className="mb-5">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Foydalanuvchi nomi
                </label>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin yoki staff"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white
                    transition duration-200"
                />
              </div>

              {/* Password */}
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Parol
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white
                      transition duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Parolni yashirish' : 'Parolni ko\'rsatish'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                  text-white font-semibold text-sm rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  transition duration-200 flex items-center justify-center gap-2
                  disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                      />
                    </svg>
                    Kirish...
                  </>
                ) : (
                  'Kirish'
                )}
              </button>
            </form>

            {/* Demo hisoblar (Mock data) */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Demo hisoblar (Bosing va sinab ko'ring):</span>
              </div>

              <div className="space-y-2">
                {MOCK_USERS.map((user) => {
                  const isSelected = username === user.username;
                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => fillCredentials(user)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between text-xs ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/70 text-blue-900 shadow-sm'
                          : 'border-gray-100 hover:border-gray-200 bg-gray-50/80 hover:bg-gray-100/70 text-gray-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{user.name}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                              user.role === 'ADMIN'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {user.role}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-2">
                          <span>Login: <strong className="text-gray-600 font-mono">{user.username}</strong></span>
                          <span>•</span>
                          <span>Parol: <strong className="text-gray-600 font-mono">{user.password}</strong></span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-blue-600 font-medium text-[11px]">
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Tanlash</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <p className="text-center text-gray-400 text-xs mt-6">
            © 2026 Origin Hotel Management System
          </p>
        </div>
      </div>
    </div>
  );
}
