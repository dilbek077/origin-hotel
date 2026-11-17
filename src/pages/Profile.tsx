import { useState } from 'react';
import { CheckCircle2, Mail, Phone, Save, ShieldCheck, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTranslation } from '@/i18n';
import { readProfileSettings, saveProfileSettings } from '@/services/profileSettings';

export default function Profile() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState(readProfileSettings);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const role = localStorage.getItem('role') ?? 'STAFF';
  const initial = profile.fullName.trim().charAt(0).toUpperCase() || '?';
  const roleLabel = role === 'ADMIN' ? t('profile.admin') : t('profile.staff');

  const inputClass =
    'w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring';
  const labelClass = 'mb-2 block text-sm font-medium text-foreground';
  const cardClass = 'gap-0 overflow-hidden border-border bg-card py-0 shadow-sm';

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const savedProfile = { ...profile, fullName: profile.fullName.trim() };
    saveProfileSettings(savedProfile);
    setProfile(savedProfile);
    setSaveSuccess(true);
    window.setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="min-h-full bg-muted/20 px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">{t('nav.profile')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('profile.description')}</p>
        </header>

        <form onSubmit={handleSave}>
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
            <Card className={cardClass}>
              <div className="flex items-center gap-3 border-b border-border px-5 py-4 sm:px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {initial}
                </div>
                <div>
                  <h2 className="font-semibold">{t('profile.personalInfo')}</h2>
                  <p className="text-xs text-muted-foreground">{profile.fullName || t('common.user')}</p>
                </div>
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                <div>
                  <label htmlFor="profile-name" className={labelClass}>{t('settings.fullName')}</label>
                  <input
                    id="profile-name"
                    required
                    value={profile.fullName}
                    onChange={(event) => setProfile({ ...profile, fullName: event.target.value })}
                    className={inputClass}
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label htmlFor="profile-phone" className={labelClass}>{t('settings.phone')}</label>
                  <div className="relative">
                    <Phone size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="profile-phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(event) => setProfile({ ...profile, phone: event.target.value })}
                      className={`${inputClass} pl-9`}
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="profile-bio" className={labelClass}>{t('profile.bio')}</label>
                  <textarea
                    id="profile-bio"
                    rows={4}
                    value={profile.bio}
                    onChange={(event) => setProfile({ ...profile, bio: event.target.value })}
                    className={`${inputClass} resize-y`}
                  />
                </div>
              </div>
            </Card>

            <div className="space-y-5">
              <Card className={cardClass}>
                <div className="flex items-center gap-3 border-b border-border px-5 py-4 sm:px-6">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h2 className="font-semibold">{t('profile.account')}</h2>
                    <p className="text-xs text-muted-foreground">{t('profile.accountDescription')}</p>
                  </div>
                </div>
                <div className="space-y-5 p-5 sm:p-6">
                  <div>
                    <label htmlFor="profile-email" className={labelClass}>{t('profile.accountEmail')}</label>
                    <input
                      id="profile-email"
                      type="email"
                      value={profile.email}
                      onChange={(event) => setProfile({ ...profile, email: event.target.value })}
                      className={inputClass}
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <label htmlFor="profile-role" className={labelClass}>{t('settings.role')}</label>
                    <input
                      id="profile-role"
                      value={roleLabel}
                      readOnly
                      className={`${inputClass} text-muted-foreground`}
                    />
                  </div>
                </div>
              </Card>

              <Card className={cardClass}>
                <div className="flex items-center gap-3 border-b border-border px-5 py-4 sm:px-6">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h2 className="font-semibold">{t('profile.security')}</h2>
                    <p className="text-xs text-muted-foreground">{t('profile.securityDescription')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-5 sm:p-6">
                  <UserRound size={17} className="mt-0.5 shrink-0 text-muted-foreground" />
                  <p className="text-sm leading-6 text-muted-foreground">
                    {t('profile.accessRole')} <span className="font-medium text-foreground">{roleLabel}</span>
                  </p>
                </div>
              </Card>
            </div>
          </div>

          <footer className="mt-5 flex min-h-14 items-center justify-end gap-3">
            {saveSuccess && (
              <span role="status" className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 size={16} className="text-emerald-500" />
                {t('common.saved')}
              </span>
            )}
            <Button type="submit">
              <Save size={16} />
              {t('common.save')}
            </Button>
          </footer>
        </form>
      </div>
    </div>
  );
}
