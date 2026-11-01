import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, Globe, Home, Menu, Phone, X } from 'lucide-react';
import { LANGUAGES, useTranslation } from '@/i18n';
import type { HotelInfoKey } from '@/data/hotelInformation';
import { hotelNavigationText } from '@/data/hotelNavigationTranslations';
import HotelOverviewDialog, { type HotelOverviewAction } from './HotelOverviewDialog';

type SubLink = {
  label: string;
  href: string;
  roomType?: string;
  diningSlide?: number;
  experienceSlide?: number;
  openDirections?: boolean;
  infoKey?: HotelInfoKey;
};

type NavGroup = { heading: SubLink; links: SubLink[] };
type NavMenu = { label: string; links?: SubLink[]; groups?: NavGroup[] };

const MENUS: NavMenu[] = [
  { label: 'Biz haqimizda', groups: [
    { heading: { label: 'Origin Hotel', href: '#benefits' }, links: [
      { label: 'Mehmonxona afzalliklari', href: '#benefits' },
      { label: 'Xonalar va narxlar', href: '#rooms' },
    ] },
    { heading: { label: 'Joylashuv', href: '#contact' }, links: [
      { label: 'Manzil va xarita', href: '#contact' },
      { label: 'Yo‘l ma’lumotlari', href: '#transport-details', openDirections: true },
    ] },
    { heading: { label: 'Qabulxona', href: '#benefits', infoKey: 'reception' }, links: [
      { label: 'Qabulxona: 24/7', href: '#benefits', infoKey: 'reception' },
      { label: 'Email yuborish', href: 'mailto:reservations@originhotel.uz' },
    ] },
  ] },
  { label: 'Takliflar', links: [
    { label: 'Xonalar va narxlar', href: '#rooms' },
    { label: 'Bron qilish', href: '#reservation' },
    { label: 'Afzalliklar', href: '#benefits' },
  ] },
  { label: 'Xonalar', groups: [
    { heading: { label: 'Standart', href: '#rooms', roomType: 'Standart' }, links: [
      { label: '28 m² · 2 kishi', href: '#rooms', roomType: 'Standart' },
      { label: 'Bepul nonushta', href: '#rooms', roomType: 'Standart' },
    ] },
    { heading: { label: 'Deluxe', href: '#rooms', roomType: 'Deluxe' }, links: [
      { label: '42 m² · 2 kishi', href: '#rooms', roomType: 'Deluxe' },
      { label: 'Balkon va mini-bar', href: '#rooms', roomType: 'Deluxe' },
    ] },
    { heading: { label: 'Suite', href: '#rooms', roomType: 'Suite' }, links: [
      { label: '68 m² · 4 kishi', href: '#rooms', roomType: 'Suite' },
      { label: 'Jakuzi va VIP xizmat', href: '#rooms', roomType: 'Suite' },
    ] },
    { heading: { label: 'Presidential', href: '#rooms', roomType: 'Presidential' }, links: [
      { label: '120 m² · 4 kishi', href: '#rooms', roomType: 'Presidential' },
      { label: 'Shaxsiy terras va batler', href: '#rooms', roomType: 'Presidential' },
    ] },
  ] },
  { label: 'Restoran', groups: [
    { heading: { label: 'Restoran haqida', href: '#dining', diningSlide: 0 }, links: [
      { label: 'Restoran muhiti', href: '#dining', diningSlide: 0 },
      { label: 'Bog‘lanish', href: '#contact' },
    ] },
    { heading: { label: 'Nonushta', href: '#dining', diningSlide: 1 }, links: [
      { label: 'Standart xona nonushtasi', href: '#dining', diningSlide: 1 },
      { label: 'Xona tafsilotlari', href: '#rooms', roomType: 'Standart' },
    ] },
    { heading: { label: 'Shved stoli', href: '#dining', diningSlide: 2 }, links: [
      { label: 'Deluxe xona qulayliklari', href: '#rooms', roomType: 'Deluxe' },
      { label: 'Restoran bilan bog‘lanish', href: '#contact' },
    ] },
  ] },
  { label: 'Qulayliklar', groups: [
    { heading: { label: 'Basseyn', href: '#experiences', experienceSlide: 1 }, links: [
      { label: 'Basseyn haqida', href: '#benefits', infoKey: 'pool' },
      { label: 'Suratlarni ko‘rish', href: '#experiences', experienceSlide: 1 },
    ] },
    { heading: { label: 'Fitnes', href: '#benefits', infoKey: 'fitness' }, links: [
      { label: 'Fitnes zali', href: '#benefits', infoKey: 'fitness' },
    ] },
    { heading: { label: 'SPA', href: '#benefits', infoKey: 'spa' }, links: [
      { label: 'SPA haqida', href: '#benefits', infoKey: 'spa' },
    ] },
    { heading: { label: 'Mehmonxona xizmatlari', href: '#benefits' }, links: [
      { label: 'Bepul Wi-Fi', href: '#benefits', infoKey: 'wifi' },
      { label: 'Bepul parking', href: '#benefits', infoKey: 'parking' },
      { label: 'Aeroport transferi', href: '#benefits', infoKey: 'transfer' },
      { label: 'Qabulxona: 24/7', href: '#benefits', infoKey: 'reception' },
    ] },
    { heading: { label: 'Restoran', href: '#dining' }, links: [
      { label: 'Nonushta', href: '#dining', diningSlide: 1 },
      { label: 'Shved stoli', href: '#dining', diningSlide: 2 },
    ] },
  ] },
  { label: 'Galereya', links: [
    { label: 'Tashqi ko‘rinish', href: '#experiences', experienceSlide: 0 },
    { label: 'Basseyn', href: '#experiences', experienceSlide: 1 },
    { label: 'Qabulxona', href: '#experiences', experienceSlide: 2 },
  ] },
  { label: 'Aloqa', links: [
    { label: 'Manzil va xarita', href: '#contact' },
    { label: 'Yo‘l ma’lumotlari', href: '#transport-details', openDirections: true },
    { label: '+998 71 200 20 20', href: 'tel:+998712002020' },
    { label: 'Email yuborish', href: 'mailto:reservations@originhotel.uz' },
  ] },
];

type Props = {
  onRoomSelect: (type: string) => void;
  onInfoSelect: (key: HotelInfoKey, triggerId: string) => void;
  onDiningSelect: (index: number) => void;
  onExperienceSelect: (index: number) => void;
};

export default function HotelNavbar({ onRoomSelect, onInfoSelect, onDiningSelect, onExperienceSelect }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const overviewRef = useRef<HTMLButtonElement>(null);
  const skipOverviewRestore = useRef(false);
  const [menuState, setMenuState] = useState<{ index: number | null; closing: boolean }>({ index: null, closing: false });
  const activeMenu = menuState.closing ? null : menuState.index;
  const [languageOpen, setLanguageOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const mobileRef = useRef<HTMLButtonElement>(null);
  const languageRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const closeTimer = useRef<number | null>(null);
  const exitTimer = useRef<number | null>(null);
  const { locale, setLocale } = useTranslation();
  const role = localStorage.getItem('role');
  const signedIn = Boolean(localStorage.getItem('token')) && (role === 'ADMIN' || role === 'STAFF');
  const dashboard = signedIn && role === 'STAFF' ? '/staff' : '/admin';
  const accountPath = signedIn ? dashboard : '/login';
  const accountLabel = signedIn ? 'Hisobim' : 'Kirish';
  const text = (caption: string) => hotelNavigationText(caption, locale);

  const setActiveMenu = useCallback((index: number | null) => {
    if (exitTimer.current !== null) window.clearTimeout(exitTimer.current);
    exitTimer.current = null;
    if (index !== null || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setMenuState({ index, closing: false });
      return;
    }
    setMenuState((previous) => previous.index === null ? previous : { ...previous, closing: true });
    exitTimer.current = window.setTimeout(() => {
      setMenuState({ index: null, closing: false });
      exitTimer.current = null;
    }, 140);
  }, []);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 160);
    const outside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setActiveMenu(null);
        setLanguageOpen(false);
        setMobileOpen(false);
      }
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    document.addEventListener('pointerdown', outside);
    return () => {
      window.removeEventListener('scroll', update);
      document.removeEventListener('pointerdown', outside);
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
      if (exitTimer.current !== null) window.clearTimeout(exitTimer.current);
    };
  }, [setActiveMenu]);

  useEffect(() => {
    if (!mobileOpen || !window.matchMedia('(max-width: 767px)').matches) return;
    const menu = document.getElementById('hotel-primary-navigation');
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const background = [...(headerRef.current?.parentElement?.children ?? [])].filter((element) => element.matches('main, footer, .hotel-quick-dock')) as HTMLElement[];
    const previousInert = background.map((element) => element.inert);
    background.forEach((element) => { element.inert = true; });
    menu?.querySelector<HTMLElement>('.shilla-mobile-menu-close')?.focus();
    const trap = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const items = [...(menu?.querySelectorAll<HTMLElement>('a[href], button:not(:disabled), select') ?? [])].filter((element) => element.offsetParent !== null && !element.closest('[inert]'));
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || !menu?.contains(document.activeElement))) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !menu?.contains(document.activeElement))) { event.preventDefault(); first?.focus(); }
    };
    const resize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    document.addEventListener('keydown', trap);
    window.addEventListener('resize', resize);
    return () => {
      document.body.style.overflow = previousOverflow;
      background.forEach((element, index) => { element.inert = previousInert[index]; });
      document.removeEventListener('keydown', trap);
      window.removeEventListener('resize', resize);
    };
  }, [mobileOpen]);

  const cancelClose = () => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const closeAll = () => {
    cancelClose();
    setActiveMenu(null);
    setLanguageOpen(false);
    setMobileOpen(false);
  };
  const showMenu = (index: number) => {
    cancelClose();
    setLanguageOpen(false);
    setActiveMenu(index);
  };
  const focusSubLink = (index: number, last = false) => {
    showMenu(index);
    requestAnimationFrame(() => {
      const links = headerRef.current?.querySelectorAll<HTMLElement>(`#hotel-submenu-${index} a, #hotel-submenu-${index} button`);
      if (links?.length) links[last ? links.length - 1 : 0].focus();
    });
  };
  const activate = (link: SubLink, triggerId = `hotel-nav-trigger-${activeMenu ?? 4}`) => {
    if (link.infoKey) onInfoSelect(link.infoKey, triggerId);
    if (link.roomType) onRoomSelect(link.roomType);
    if (link.diningSlide !== undefined) onDiningSelect(link.diningSlide);
    if (link.experienceSlide !== undefined) onExperienceSelect(link.experienceSlide);
    if (link.openDirections) {
      const details = document.getElementById('transport-details');
      if (details instanceof HTMLDetailsElement) details.open = true;
    }
    closeAll();
  };

  const goHome = () => {
    closeAll();
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  const renderLink = (link: SubLink) => link.infoKey
    ? <button type="button" aria-haspopup="dialog" onClick={() => activate(link)}>{text(link.label)}</button>
    : <a href={link.href} onClick={() => activate(link)}>{text(link.label)}</a>;

  const openOverview = () => {
    closeAll();
    skipOverviewRestore.current = false;
    setOverviewOpen(true);
  };
  const selectOverview = (action: HotelOverviewAction) => {
    skipOverviewRestore.current = Boolean(action.infoKey || action.roomType);
    setOverviewOpen(false);
    activate(action, 'hotel-overview-trigger');
  };

  return (
    <>
    <header
      ref={headerRef}
      className={`shilla-header ${scrolled ? 'is-scrolled' : ''} ${mobileOpen ? 'is-mobile-open' : ''}`}
      onPointerEnter={cancelClose}
      onPointerLeave={(event) => {
        if (event.pointerType !== 'mouse' || event.currentTarget.contains(document.activeElement)) return;
        cancelClose();
        closeTimer.current = window.setTimeout(() => setActiveMenu(null), 150);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) closeAll();
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Escape') return;
        event.preventDefault();
        cancelClose();
        if (languageOpen) {
          setLanguageOpen(false);
          languageRef.current?.focus();
        } else if (activeMenu !== null) {
          setActiveMenu(null);
          triggerRefs.current[activeMenu]?.focus();
        } else if (mobileOpen) {
          setMobileOpen(false);
          mobileRef.current?.focus();
        }
      }}
    >
      <div className="shilla-header-top" onPointerEnter={() => setActiveMenu(null)}>
        <Link to="/" className="shilla-mobile-home" aria-label={text('Bosh sahifaga qaytish')} onClick={goHome}><Home size={24} strokeWidth={1.2} /></Link>
        <div className="shilla-hotel-link">
          <Link to="/" onClick={goHome} aria-label={text('Bosh sahifaga qaytish')}><Home size={21} strokeWidth={1.2} /></Link>
          <button ref={overviewRef} id="hotel-overview-trigger" type="button" aria-haspopup="dialog" aria-expanded={overviewOpen} aria-controls="hotel-overview-panel" onClick={openOverview}>{text('Mehmonxona haqida +')}</button>
        </div>
        <Link to="/" className="shilla-wordmark" aria-label={`Origin Hotel — ${text('Bosh sahifaga qaytish')}`} onClick={goHome}><span>ORIGIN HOTEL</span><small>TOSHKENT</small></Link>
        <div className="shilla-account-links">
          <Link to={accountPath} onClick={closeAll}>{text(accountLabel)}</Link>
          <Link to={`${dashboard}/bronlar`} title={text('Bronlarim')} onClick={closeAll}>{text('Bronlarim')}</Link>
          <Link to={dashboard} onClick={closeAll}>{text('Boshqaruv')}</Link>
          <a href="#contact" onClick={closeAll}>{text('Bog‘lanish')}</a>
          <div className="shilla-language">
            <button ref={languageRef} type="button" aria-expanded={languageOpen} aria-controls="hotel-language-options" aria-label={text('Tilni tanlash')} onClick={() => { setActiveMenu(null); setLanguageOpen(!languageOpen); }}><Globe size={15} strokeWidth={1.1} />{LANGUAGES.find((language) => language.code === locale)?.label}<ChevronDown size={13} /></button>
            {languageOpen && <div id="hotel-language-options" className="shilla-language-options">{LANGUAGES.map((language) => <button type="button" key={language.code} aria-pressed={language.code === locale} onClick={() => { setLocale(language.code); setLanguageOpen(false); languageRef.current?.focus(); }}>{language.label}</button>)}</div>}
          </div>
        </div>
        <button ref={mobileRef} type="button" className="shilla-mobile-toggle" aria-label={text('Menyu')} aria-controls="hotel-primary-navigation" aria-expanded={mobileOpen} onClick={() => { setMobileOpen(!mobileOpen); setActiveMenu(null); setLanguageOpen(false); }}>{mobileOpen ? <X size={23} /> : <Menu size={23} />}</button>
      </div>
      <nav id="hotel-primary-navigation" className={`shilla-primary-nav ${mobileOpen ? 'is-open' : ''}`} aria-label={text('Asosiy menyu')}>
        <div className="shilla-mobile-menu-intro">
          <div className="shilla-mobile-menu-bar">
            <Link to="/" aria-label={text('Bosh sahifaga qaytish')} onClick={goHome}><Home size={25} strokeWidth={1.2} /></Link>
            <a href="tel:+998712002020" aria-label="Mehmonxonaga qo‘ng‘iroq qilish"><Phone size={24} strokeWidth={1.2} /></a>
            <button type="button" className="shilla-mobile-menu-close" aria-label="Menyuni yopish" onClick={() => { closeAll(); mobileRef.current?.focus(); }}><X size={27} strokeWidth={1.2} /></button>
          </div>
          <div className="shilla-mobile-account-card">
            <Link className="shilla-mobile-account-title" to={accountPath} onClick={closeAll}>{signedIn ? text('Hisobim') : 'Tizimga kirish'}<ChevronRight size={20} strokeWidth={1} /></Link>
            <p>{signedIn ? 'Bronlaringiz va mehmonxona xizmatlarini boshqaring.' : 'Bronlaringizni ko‘rish va mehmonxona xizmatlaridan foydalanish uchun tizimga kiring.'}</p>
            <div className="shilla-mobile-account-grid">
              <a href="#reservation" onClick={() => { closeAll(); window.dispatchEvent(new Event('origin-open-mobile-reservation')); }}>Xona bron qilish</a>
              <a href="#dining" onClick={closeAll}>Restoran</a>
              <Link to={`${dashboard}/bronlar`} onClick={closeAll}>Bronlarimni ko‘rish</Link>
              <a href="tel:+998712002020" onClick={closeAll}>Restoran bilan aloqa</a>
            </div>
          </div>
          <button type="button" className="shilla-mobile-overview" aria-haspopup="dialog" onClick={openOverview}>{text('Mehmonxona haqida +')}</button>
          <Link to="/" className="shilla-mobile-menu-home" onClick={goHome}>{text('Bosh sahifaga qaytish')}</Link>
        </div>
        {MENUS.map((menu, index) => (
          <div className="shilla-nav-item" key={menu.label} onPointerEnter={(event) => { if (event.pointerType === 'mouse' && window.matchMedia('(min-width: 768px) and (hover: hover)').matches) showMenu(index); }}>
            <button
              ref={(element) => { triggerRefs.current[index] = element; }}
              id={`hotel-nav-trigger-${index}`}
              className="shilla-nav-trigger"
              type="button"
              aria-expanded={activeMenu === index}
              aria-controls={`hotel-submenu-${index}`}
              onClick={(event) => {
                cancelClose();
                setLanguageOpen(false);
                const pointerClick = event.detail > 0 && window.matchMedia('(min-width: 768px) and (hover: hover)').matches;
                setActiveMenu(pointerClick ? index : activeMenu === index ? null : index);
              }}
              onFocus={() => { if (activeMenu !== null && activeMenu !== index) showMenu(index); }}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                  event.preventDefault();
                  focusSubLink(index, event.key === 'ArrowUp');
                } else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                  event.preventDefault();
                  const next = (index + (event.key === 'ArrowRight' ? 1 : -1) + MENUS.length) % MENUS.length;
                  showMenu(next);
                  triggerRefs.current[next]?.focus();
                }
              }}
            >{text(menu.label)}<ChevronDown size={14} className="shilla-nav-chevron" aria-hidden="true" /></button>
            {menuState.index === index && (
              <div id={`hotel-submenu-${index}`} className={`shilla-nav-panel ${menu.groups ? 'is-grouped' : ''}`} data-state={menuState.closing ? 'closing' : 'open'} inert={menuState.closing} aria-hidden={menuState.closing} aria-labelledby={`hotel-nav-trigger-${index}`}>
                {menu.groups ? (
                  <div className="shilla-nav-groups" style={{ gridTemplateColumns: `repeat(${menu.groups.length}, minmax(0, 1fr))` }}>
                    {menu.groups.map((group) => (
                      <div className="shilla-nav-group" key={group.heading.label}>
                        <h3>{renderLink(group.heading)}</h3>
                        <ul>{group.links.map((link) => <li key={link.label}>{renderLink(link)}</li>)}</ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="shilla-nav-panel-links">
                    {menu.links?.map((link) => <span key={link.label}>{renderLink(link)}</span>)}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        <div className="shilla-mobile-accounts">
          <Link to={accountPath} onClick={closeAll}>{text(accountLabel)}</Link>
          <Link to={`${dashboard}/bronlar`} onClick={closeAll}>{text('Bronlarim')}</Link>
          <Link to={dashboard} onClick={closeAll}>{text('Boshqaruv')}</Link>
          <a href="#contact" onClick={closeAll}>{text('Bog‘lanish')}</a>
          <div className="shilla-mobile-languages" role="group" aria-label={text('Tilni tanlash')}>
            {LANGUAGES.map((language) => <button type="button" key={language.code} aria-pressed={language.code === locale} onClick={() => { setLocale(language.code); closeAll(); mobileRef.current?.focus(); }}>{language.label}</button>)}
          </div>
        </div>
        <a href="#reservation" className="shilla-nav-reserve" onPointerEnter={() => setActiveMenu(null)} onClick={closeAll}>{text('Bron qilish')}</a>
      </nav>
    </header>
    <HotelOverviewDialog
      open={overviewOpen}
      onOpenChange={setOverviewOpen}
      onSelect={selectOverview}
      onRestoreFocus={() => {
        if (skipOverviewRestore.current) return;
        (window.matchMedia('(max-width: 767px)').matches ? mobileRef.current : overviewRef.current)?.focus({ preventScroll: true });
      }}
    />
    </>
  );
}
