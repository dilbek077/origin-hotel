import { useTranslation } from '@/i18n';
import { useTheme } from '@/theme';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
} from 'lucide-react';

export default function LocationPage() {
  const { t } = useTranslation();
  const { isDark: themeIsDark } = useTheme();
  const navigate = useNavigate();

  const dark = themeIsDark;

  const handleBack = () => {
    navigate(-1);
  };

  const googleMapsUrl =
    'https://www.google.com/maps/place/Origin+Hotel/@38.8442221,65.7958732,19.38z/data=!4m6!3m5!1s0x3f4ea7000943d029:0xb6072f27825eea07!8m2!3d38.8442376!4d65.7958525!16s%2Fg%2F11zwqnh0w1';

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        dark ? 'bg-[#0a0f13] text-slate-200' : 'bg-white text-gray-900'
      }`}
    >
      <header className="px-6 py-4 border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-20 backdrop-blur bg-white/80 dark:bg-[#0a0f13]/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={handleBack}
            aria-label="Orqaga qaytish"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
              dark
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
            }`}
          >
            <span>{t('common.backTo')}</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <section className="max-w-2xl mx-auto mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-[20px] flex items-center justify-center text-white bg-blue-500 dark:bg-blue-600">
              <MapPin size={30} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-1 text-gray-900 dark:text-white">
                {t('location.title')}
              </h1>
              <p className="text-base text-gray-600 dark:text-slate-400">
                {t('location.subtitle')}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="flex items-start gap-3 p-5 rounded-2xl border bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700/50 text-gray-900 dark:text-slate-200">
              <MapPin size={20} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">
                  {t('location.addressLabel')}
                </p>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Amir Temur shoh ko‘chasi 15, Yunusobod tumani, Qarshi
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-5 rounded-2xl border bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700/50 text-gray-900 dark:text-slate-200">
              <Clock size={20} className="flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">
                  {t('location.workingHoursLabel')}
                </p>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  24/7 ochiq
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 p-5 rounded-2xl border bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700/50 text-gray-900 dark:text-slate-200 mb-10">
            <div className="flex items-center gap-3">
              <Phone size={20} className="flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">{t('location.phoneLabel')}</p>
                <a
                  href="tel:+998712000000"
                  className="text-sm text-blue-600 dark:text-blue-400"
                >
                  +998 (71) 200-00-00
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={20} className="flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">{t('location.emailLabel')}</p>
                <a
                  href="mailto:reservations@originhotel.uz"
                  className="text-sm text-blue-600 dark:text-blue-400"
                >
                  reservations@originhotel.uz
                </a>
              </div>
            </div>
          </div>

          <div className="relative mt-4 h-[420px] overflow-hidden rounded-[24px] border border-[#c8a15a]/30 shadow-xl ring-1 ring-black/5">
            <iframe
              title="Origin Hotel joylashuvi"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.openstreetmap.org/export/embed.html?bbox=65.7915%2C38.8415%2C65.8002%2C38.8470&amp;layer=mapnik&amp;marker=38.8442376%2C65.7958525"
              className="absolute inset-0 h-full w-full border-0"
              allowFullScreen
              aria-label="OpenStreetMap hotel location"
            />
            <div className="absolute left-4 top-4 z-10 flex items-center gap-2.5 rounded-xl border border-white/70 bg-white/95 px-3.5 py-2.5 shadow-lg backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/95">
              <MapPin size={17} className="text-[#a77b32] dark:text-[#d6b36a]" aria-hidden="true" />
              <span>
                <span className="block text-xs font-semibold text-slate-900 dark:text-white">Origin Hotel</span>
                <span className="mt-0.5 block text-[11px] text-slate-500 dark:text-slate-400">Qarshi markazi</span>
              </span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 dark:text-slate-500 mb-3 uppercase tracking-wider font-semibold">
              To‘liq xaritada ko‘rish
            </p>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#c8a15a] px-8 py-4 text-sm font-bold text-slate-950 shadow-xl shadow-[#c8a15a]/20 transition-all hover:bg-[#d6b36a]"
            >
              <ExternalLink size={20} /> {t('location.openInMaps')}
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/50 dark:border-slate-700/50 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 dark:text-slate-500">
            Origin Hotel &copy; {new Date().getFullYear()}
          </p>
          <Link
            to="/"
            className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
          >
            {t('nav.home')} →
          </Link>
        </div>
      </footer>
    </div>
  );
}