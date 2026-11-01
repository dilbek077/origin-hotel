import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Globe, Home, Menu, X } from 'lucide-react';
import { LANGUAGES, useTranslation } from '@/i18n';

type SubLink = {
  label: string;
  href: string;
  roomType?: string;
  diningSlide?: number;
  experienceSlide?: number;
  openDirections?: boolean;
};

const MENUS: { label: string; links: SubLink[] }[] = [
  { label: 'Biz haqimizda', links: [
    { label: 'Origin Hotel', href: '#benefits' },
    { label: 'Joylashuv', href: '#contact' },
    { label: 'Qabulxona: 24/7', href: 'tel:+998712002020' },
  ] },
  { label: 'Takliflar', links: [
    { label: 'Xonalar va narxlar', href: '#rooms' },
    { label: 'Bron qilish', href: '#reservation' },
    { label: 'Afzalliklar', href: '#benefits' },
  ] },
  { label: 'Xonalar', links: [
    { label: 'Standart', href: '#rooms', roomType: 'Standart' },
    { label: 'Deluxe', href: '#rooms', roomType: 'Deluxe' },
    { label: 'Suite', href: '#rooms', roomType: 'Suite' },
    { label: 'Presidential', href: '#rooms', roomType: 'Presidential' },
  ] },
  { label: 'Restoran', links: [
    { label: 'Restoran haqida', href: '#dining' },
    { label: 'Nonushta', href: '#dining', diningSlide: 1 },
    { label: 'Shved stoli', href: '#dining', diningSlide: 2 },
    { label: 'Bog‘lanish', href: '#contact' },
  ] },
  { label: 'Qulayliklar', links: [
    { label: 'Basseyn va SPA', href: '#experiences', experienceSlide: 1 },
    { label: 'Mehmonxona muhiti', href: '#experiences', experienceSlide: 2 },
    { label: 'Xizmatlar', href: '#benefits' },
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
  onDiningSelect: (index: number) => void;
  onExperienceSelect: (index: number) => void;
};

export default function HotelNavbar({ onRoomSelect, onDiningSelect, onExperienceSelect }: Props) {
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
      const links = headerRef.current?.querySelectorAll<HTMLAnchorElement>(`#hotel-submenu-${index} a`);
      if (links?.length) links[last ? links.length - 1 : 0].focus();
    });
  };
  const activate = (link: SubLink) => {
    if (link.roomType) onRoomSelect(link.roomType);
    if (link.diningSlide !== undefined) onDiningSelect(link.diningSlide);
    if (link.experienceSlide !== undefined) onExperienceSelect(link.experienceSlide);
    if (link.openDirections) {
      const details = document.getElementById('transport-details');
      if (details instanceof HTMLDetailsElement) details.open = true;
    }
    closeAll();
  };

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
              <div id={`hotel-submenu-${index}`} className="shilla-nav-panel" aria-labelledby={`hotel-nav-trigger-${index}`}>
                <div className="shilla-nav-panel-links">
                  {menu.links.map((link) => <a key={link.label} href={link.href} onClick={() => activate(link)}>{link.label}</a>)}
                </div>
              </div>
            )}
          </div>
        ))}
        <a href="#reservation" className="shilla-nav-reserve" onPointerEnter={() => setActiveMenu(null)} onClick={closeAll}>Bron qilish</a>
      </nav>
    </header>
  );
}
