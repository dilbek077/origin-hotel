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
    'https://www.google.com/maps/search/?api=1&query=Amir+Temur+shoh+ko%27chasi+15+Yunusobod+tumani+Qarshi';

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

          <div className="mt-4 rounded-[24px] overflow-hidden border border-gray-200 dark:border-slate-700 shadow-lg">
            <iframe
              title="Hotel location"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.openstreetmap.org/export/embed.html?bbox=65.7780%2C38.8540%2C65.7960%2C38.8630&amp;layer=mapnik"
              width="100%"
              height="420"
              style={{ border: 0 }}
              allowFullScreen
              aria-label="OpenStreetMap hotel location"
            />
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 dark:text-slate-500 mb-3 uppercase tracking-wider font-semibold">
              To‘liq xaritada ko‘rish
            </p>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-600/30 transition-all"
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