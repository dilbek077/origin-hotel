import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Globe, Home, Menu, X } from 'lucide-react';
import { LANGUAGES, useTranslation } from '@/i18n';
import type { HotelInfoKey } from '@/data/hotelInformation';

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
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const mobileRef = useRef<HTMLButtonElement>(null);
  const languageRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const closeTimer = useRef<number | null>(null);
  const { locale, setLocale } = useTranslation();
  const dashboard = localStorage.getItem('role') === 'STAFF' ? '/staff' : '/admin';

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
    };
  }, []);

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
  const activate = (link: SubLink) => {
    if (link.infoKey) onInfoSelect(link.infoKey, `hotel-nav-trigger-${activeMenu ?? 4}`);
    if (link.roomType) onRoomSelect(link.roomType);
    if (link.diningSlide !== undefined) onDiningSelect(link.diningSlide);
    if (link.experienceSlide !== undefined) onExperienceSelect(link.experienceSlide);
    if (link.openDirections) {
      const details = document.getElementById('transport-details');
      if (details instanceof HTMLDetailsElement) details.open = true;
    }
    closeAll();
  };

  const renderLink = (link: SubLink) => link.infoKey
    ? <button type="button" aria-haspopup="dialog" onClick={() => activate(link)}>{link.label}</button>
    : <a href={link.href} onClick={() => activate(link)}>{link.label}</a>;

  return (
    <header
      ref={headerRef}
      className={`shilla-header ${scrolled ? 'is-scrolled' : ''}`}
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
        <a href="#benefits" className="shilla-hotel-link" onClick={closeAll}><Home size={21} strokeWidth={1.2} /><span>Mehmonxona haqida +</span></a>
        <Link to="/" className="shilla-wordmark" aria-label="Origin Hotel — bosh sahifa" onClick={closeAll}><span>ORIGIN HOTEL</span><small>TOSHKENT</small></Link>
        <div className="shilla-account-links">
          <Link to="/login" onClick={closeAll}>Kirish</Link>
          <Link to={`${dashboard}/bronlar`} onClick={closeAll}>Bronlarim</Link>
          <Link to={dashboard} onClick={closeAll}>Boshqaruv</Link>
          <a href="#contact" onClick={closeAll}>Bog‘lanish</a>
          <div className="shilla-language">
            <button ref={languageRef} type="button" aria-expanded={languageOpen} aria-controls="hotel-language-options" aria-label="Tilni tanlash" onClick={() => { setActiveMenu(null); setLanguageOpen(!languageOpen); }}><Globe size={15} strokeWidth={1.1} />{LANGUAGES.find((language) => language.code === locale)?.label}<ChevronDown size={13} /></button>
            {languageOpen && <div id="hotel-language-options" className="shilla-language-options">{LANGUAGES.map((language) => <button type="button" key={language.code} aria-pressed={language.code === locale} onClick={() => { setLocale(language.code); setLanguageOpen(false); languageRef.current?.focus(); }}>{language.label}</button>)}</div>}
          </div>
        </div>
        <button ref={mobileRef} type="button" className="shilla-mobile-toggle" aria-label="Menyu" aria-controls="hotel-primary-navigation" aria-expanded={mobileOpen} onClick={() => { setMobileOpen(!mobileOpen); setActiveMenu(null); setLanguageOpen(false); }}>{mobileOpen ? <X size={23} /> : <Menu size={23} />}</button>
      </div>
      <nav id="hotel-primary-navigation" className={`shilla-primary-nav ${mobileOpen ? 'is-open' : ''}`} aria-label="Asosiy menyu">
        {MENUS.map((menu, index) => (
          <div className="shilla-nav-item" key={menu.label} onPointerEnter={(event) => { if (event.pointerType === 'mouse' && window.matchMedia('(min-width: 768px) and (hover: hover)').matches) showMenu(index); }}>
            <button
              ref={(element) => { triggerRefs.current[index] = element; }}
              id={`hotel-nav-trigger-${index}`}
              className="shilla-nav-trigger"
              type="button"
              aria-expanded={activeMenu === index}
              aria-controls={`hotel-submenu-${index}`}
              onClick={() => { cancelClose(); setLanguageOpen(false); setActiveMenu(activeMenu === index ? null : index); }}
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
            >{menu.label}<ChevronDown size={14} className="shilla-nav-chevron" aria-hidden="true" /></button>
            {activeMenu === index && (
              <div id={`hotel-submenu-${index}`} className={`shilla-nav-panel ${menu.groups ? 'is-grouped' : ''}`} aria-labelledby={`hotel-nav-trigger-${index}`}>
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
        <a href="#reservation" className="shilla-nav-reserve" onPointerEnter={() => setActiveMenu(null)} onClick={closeAll}>Bron qilish</a>
      </nav>
    </header>
  );
}
