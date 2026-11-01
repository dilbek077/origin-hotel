import { useTranslation, type LanguageCode } from '@/i18n';
import { L } from '@/localization/elements';
import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from 'react';
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { dateKey, hotelToday, nextDate, parseDate } from '@/data/reservationDates';

type Props = {
  checkIn: string;
  checkOut: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (checkIn: string, checkOut: string) => void;
};
const WEEKDAYS = ['Yak', 'Du', 'Se', 'Chor', 'Pay', 'Ju', 'Sha'];
const monthStart = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1, 12);
const addMonth = (date: Date, count: number) => new Date(date.getFullYear(), date.getMonth() + count, 1, 12);
const monthKey = (date: Date) => dateKey(date).slice(0, 7);
const monthTitle = (date: Date) => `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`;
const MONTH_NAMES = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
const fullDate = (key: string) => { const date = parseDate(key); return `${date.getFullYear()}-yil ${date.getDate()}-${MONTH_NAMES[date.getMonth()]}`; };
const weekdays = (locale: LanguageCode) => locale === 'uz' ? WEEKDAYS : Array.from({ length: 7 }, (_, day) => new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(new Date(2024, 0, 7 + day)));
const localizedDate = (key: string, locale: LanguageCode) => locale === 'uz' ? fullDate(key) : new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(parseDate(key));
const shortDate = (key: string, locale: LanguageCode) => `${key.replaceAll('-', '.')} (${weekdays(locale)[parseDate(key).getDay()]})`;

function CalendarPanel({ checkIn, checkOut, initialStep, onClose, onChange, trigger }: Omit<Props, 'open' | 'onOpenChange'> & { initialStep: 'arrival' | 'departure'; onClose: (restore?: boolean) => void; trigger: RefObject<HTMLDivElement | null> }) {
  const { locale } = useTranslation();
  const fullDate = (key: string) => localizedDate(key, locale);
  const daysOfWeek = weekdays(locale);
  const today = hotelToday();
  const firstMonth = monthStart(parseDate(today));
  const [view, setView] = useState(() => monthStart(parseDate(checkIn < today ? today : checkIn)));
  const [start, setStart] = useState(checkIn);
  const [end, setEnd] = useState(checkOut);
  const [step, setStep] = useState(initialStep);
  const [hover, setHover] = useState<string | null>(null);
  const [focused, setFocused] = useState(initialStep === 'arrival' ? checkIn : checkOut);
  const panelRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<string | null>(null);

  useEffect(() => {
    panelRef.current?.focus({ preventScroll: true });
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target) && !trigger.current?.contains(target)) onClose(false);
    };
    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); }
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [onClose, trigger]);

  useEffect(() => {
    if (pendingFocus.current) {
      panelRef.current?.querySelector<HTMLButtonElement>(`[data-date="${pendingFocus.current}"]`)?.focus({ preventScroll: true });
      pendingFocus.current = null;
    }
  }, [focused, view]);

  function selectDate(key: string) {
    if (key < today) return;
    if (step === 'arrival' || key < start) {
      setStart(key); setEnd(''); setHover(null); setStep('departure');
      const next = nextDate(key);
      if (monthStart(parseDate(next)) > addMonth(view, 1)) setView(monthStart(parseDate(next)));
      pendingFocus.current = next; setFocused(next);
    } else if (key > start) {
      onChange(start, key);
      onClose();
    }
  }

  function navigateDay(event: KeyboardEvent<HTMLButtonElement>, key: string) {
    const date = parseDate(key);
    const increments: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7, Home: -date.getDay(), End: 6 - date.getDay() };
    if (event.key in increments) date.setDate(date.getDate() + increments[event.key]);
    else if (event.key === 'PageUp' || event.key === 'PageDown') {
      const day = date.getDate(); date.setDate(1); date.setMonth(date.getMonth() + (event.key === 'PageUp' ? -1 : 1)); date.setDate(Math.min(day, new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()));
    } else return;
    event.preventDefault();
    const next = dateKey(date) < today ? today : dateKey(date);
    const targetMonth = monthStart(parseDate(next));
    if (targetMonth < view || targetMonth > addMonth(view, 1)) setView(targetMonth);
    pendingFocus.current = next;
    setFocused(next);
  }

  const focusMonth = monthStart(parseDate(focused));
  const tabbableDay = focusMonth >= view && focusMonth <= addMonth(view, 1) ? focused : dateKey(view) < today ? today : dateKey(view);
  const previewEnd = step === 'departure' && hover && hover > start ? hover : end;
  const months = [view, addMonth(view, 1)];
  // Month dropdowns include the viewed month even after navigating far ahead.
  const monthsAhead = (view.getFullYear() - firstMonth.getFullYear()) * 12 + view.getMonth() - firstMonth.getMonth();
  const options = Array.from({ length: Math.max(36, monthsAhead + 3) }, (_, index) => addMonth(firstMonth, index));

  return <L.div ref={panelRef} id="reservation-calendar" className="shilla-calendar-panel" role="dialog" aria-labelledby="reservation-calendar-title" tabIndex={-1}>
    <L.h2 id="reservation-calendar-title" className="sr-only">Kelish va ketish sanalarini tanlash</L.h2>
    <L.button type="button" className="shilla-calendar-close" aria-label="Taqvimni yopish" onClick={() => onClose()}><X size={20} strokeWidth={1} /></L.button>
    <L.button type="button" className="shilla-calendar-prev" aria-label="Oldingi oy" disabled={view <= firstMonth} onClick={() => setView(addMonth(view, -1))}><ChevronLeft size={32} strokeWidth={1} /></L.button>
    <L.div className="shilla-calendar-months">
      {months.map((month, monthIndex) => {
        const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
        const offset = month.getDay();
        const cells = Array.from({ length: Math.ceil((days + offset) / 7) * 7 }, (_, index) => index - offset + 1);
        return <L.section className="shilla-calendar-month" aria-label={monthTitle(month)} key={monthIndex}>
          <L.div className="shilla-calendar-month-title"><L.span>{monthTitle(month)}</L.span><ChevronDown size={20} strokeWidth={1} /><L.select aria-label={`${monthIndex + 1}-taqvim oyini tanlash`} value={monthKey(month)} onChange={(event) => setView(addMonth(parseDate(`${event.target.value}-01`), -monthIndex))}>{options.map((option, index) => <L.option key={monthKey(option)} value={monthKey(option)} disabled={monthIndex === 1 && index === 0}>{monthTitle(option)}</L.option>)}</L.select></L.div>
          <L.div className="shilla-calendar-weekdays" aria-hidden="true">{daysOfWeek.map((day, index) => <L.span className={index === 0 ? 'is-sunday' : ''} key={day}>{day}</L.span>)}</L.div>
          <L.div className="shilla-calendar-days" role="group" aria-label={`${monthTitle(month)} kunlari`} onPointerLeave={() => setHover(null)}>
            {cells.map((day, index) => {
              if (day < 1 || day > days) return <L.span className="shilla-calendar-empty" key={index} aria-hidden="true" />;
              const key = dateKey(new Date(month.getFullYear(), month.getMonth(), day, 12));
              const selectedStart = key === start;
              const selectedEnd = key === previewEnd;
              const between = !!previewEnd && key > start && key < previewEnd;
              const className = ['shilla-calendar-day', index % 7 === 0 && 'is-sunday', key === today && 'is-today', selectedStart && 'is-range-start', selectedEnd && 'is-range-end', between && 'is-in-range'].filter(Boolean).join(' ');
              return <L.div className={className} key={key}>
                <L.button type="button" data-date={key} aria-label={fullDate(key)} aria-pressed={selectedStart || key === end} aria-current={key === today ? 'date' : undefined} disabled={key < today || (step === 'departure' && key === start)} tabIndex={key === tabbableDay ? 0 : -1} onKeyDown={(event) => navigateDay(event, key)} onFocus={() => { setFocused(key); if (step === 'departure') setHover(key); }} onPointerEnter={() => { if (step === 'departure') setHover(key); }} onClick={() => selectDate(key)}><L.span>{day}</L.span></L.button>
                {key === today && <L.small>Bugun</L.small>}
              </L.div>;
            })}
          </L.div>
        </L.section>;
      })}
    </L.div>
    <L.button type="button" className="shilla-calendar-next" aria-label="Keyingi oy" onClick={() => setView(addMonth(view, 1))}><ChevronRight size={32} strokeWidth={1} /></L.button>
    <L.p className="shilla-calendar-note" aria-live="polite">{step === 'arrival' ? 'Kelish sanasini tanlang.' : 'Ketish sanasini tanlang — kamida bir kecha.'} <L.span>{start && fullDate(start)}{previewEnd && ` — ${fullDate(previewEnd)}`}</L.span></L.p>
  </L.div>;
}

export default function ReservationDatePicker({ checkIn, checkOut, open, onOpenChange, onChange }: Props) {
  const { locale } = useTranslation();
  const fullDate = (key: string) => localizedDate(key, locale);
  const [initialStep, setInitialStep] = useState<'arrival' | 'departure'>('arrival');
  const triggerRef = useRef<HTMLDivElement>(null);
  const arrivalRef = useRef<HTMLButtonElement>(null);
  const departureRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLButtonElement | null>(null);
  // Stable callbacks keep calendar focus from resetting after a selection.
  const closeRef = useRef(onOpenChange);
  useEffect(() => { closeRef.current = onOpenChange; }, [onOpenChange]);
  const [close] = useState(() => (restore = true) => { closeRef.current(false); if (restore) returnFocus.current?.focus({ preventScroll: true }); });
  function show(step: 'arrival' | 'departure') {
    setInitialStep(step);
    returnFocus.current = step === 'arrival' ? arrivalRef.current : departureRef.current;
    onOpenChange(!open);
  }
  return <L.div ref={triggerRef} className="shilla-date-field shilla-date-picker">
    <L.div className="shilla-date-triggers">
      <L.button ref={arrivalRef} type="button" aria-label={`Kelish sanasi: ${fullDate(checkIn)}`} aria-expanded={open} aria-controls="reservation-calendar" aria-haspopup="dialog" onClick={() => show('arrival')}>{shortDate(checkIn, locale)}</L.button><L.span aria-hidden="true">–</L.span>
      <L.button ref={departureRef} type="button" aria-label={`Ketish sanasi: ${fullDate(checkOut)}`} aria-expanded={open} aria-controls="reservation-calendar" aria-haspopup="dialog" onClick={() => show('departure')}>{shortDate(checkOut, locale)}<CalendarDays size={23} strokeWidth={1.2} /></L.button>
    </L.div>
    {open && <CalendarPanel checkIn={checkIn} checkOut={checkOut} initialStep={initialStep} onChange={onChange} onClose={close} trigger={triggerRef} />}
  </L.div>;
}
