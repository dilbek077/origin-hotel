export type HotelInfoKey = 'pool' | 'spa' | 'fitness' | 'wifi' | 'parking' | 'transfer' | 'reception';

type HotelInformation = {
  title: string;
  description: string;
  items: string[];
  image?: string;
};

export const HOTEL_INFORMATION: Record<HotelInfoKey, HotelInformation> = {
  pool: {
    title: 'Basseyn',
    description: 'Origin Hotel qulayliklari qatorida basseyn va dam olish hududi mavjud.',
    items: ['Basseyn va SPA', 'Dam olish uchun mehmonxona muhiti', 'Batafsil ma’lumot uchun qabulxona bilan bog‘laning.'],
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=85',
  },
  spa: {
    title: 'SPA',
    description: 'Mehmonxonadagi SPA — dam olish qulayliklarimizdan biri.',
    items: ['Basseyn va SPA xizmatlari', 'Tashrifingizni rejalashtirish uchun qabulxonaga murojaat qiling.'],
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1000&q=85',
  },
  fitness: {
    title: 'Fitnes zali',
    description: 'Origin Hotel’da fitnes zali mavjud — sayohat davomida ham mashg‘ulotlarni davom ettiring.',
    items: ['Mehmonxona fitnes zali', 'Xizmat haqida batafsil ma’lumot: +998 71 200 20 20'],
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=85',
  },
  wifi: {
    title: 'Bepul Wi-Fi',
    description: 'Origin Hotel’da bepul Wi-Fi mavjud. Xona qulayliklari qatorida tezkor Wi-Fi ham ko‘rsatilgan.',
    items: ['Bepul Wi-Fi', 'Ulanishda yordam uchun 24/7 qabulxonaga murojaat qiling.'],
  },
  parking: {
    title: 'Bepul parking',
    description: 'Bepul parking — Origin Hotel’ning mavjud qulayliklaridan biri.',
    items: ['Avtomobil bilan tashrif buyuruvchi mehmonlar uchun parking', 'Manzil: Amir Temur shoh ko‘chasi 15, Toshkent'],
  },
  transfer: {
    title: 'Aeroport transferi',
    description: 'Origin Hotel’da aeroport transferi xizmati mavjud.',
    items: ['Transfer tafsilotlarini qabulxona bilan kelishing.', 'Presidential xona qulayliklarida bepul transfer ko‘rsatilgan.', 'Bog‘lanish: +998 71 200 20 20'],
  },
  reception: {
    title: 'Qabulxona: 24/7',
    description: 'Origin Hotel qabulxonasi kechayu kunduz, haftasiga 7 kun ishlaydi.',
    items: ['Telefon: +998 71 200 20 20', 'Email: reservations@originhotel.uz', 'Manzil: Amir Temur shoh ko‘chasi 15, Toshkent 100000'],
  },
};
