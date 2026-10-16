export interface RoomSpace {
  id: string;
  name: string;
  typeLabel: string;
  size: string;
  description: string;
  image: string;
  features: string[];
}

export interface Room {
  id: number;
  name: string;
  category: 'standart' | 'deluxe' | 'suite' | 'president';
  categoryLabel: string;
  price: number;
  capacity: string;
  capacityCount: number;
  size: string;
  sizeSquareMeters: number;
  roomCount: number;
  roomCountLabel: string;
  floor: number;
  bedType: string;
  view: string;
  description: string;
  fullDescription: string;
  features: string[];
  image: string;
  popular?: boolean;
  spaces: RoomSpace[];
  amenities: {
    comfort: string[];
    bathroom: string[];
    technology: string[];
    services: string[];
  };
}

export const ROOMS: Room[] = [
  {
    id: 1,
    name: 'Standart Qulay Xona',
    category: 'standart',
    categoryLabel: 'Standart',
    price: 350000,
    capacity: '2 kishilik',
    capacityCount: 2,
    size: '28 m²',
    sizeSquareMeters: 28,
    roomCount: 1,
    roomCountLabel: '1 xonali shinam xona',
    floor: 2,
    bedType: 'King Size (180x200 sm)',
    view: 'Ichki sokin hovli manzarasi',
    description: "Sayohat va qisqa muddatli tashriflar uchun barcha qulayliklarga ega shinam xona.",
    fullDescription: "Standart toifasidagi ushbu xona biznes safari yoki shahar bo'ylab sayohatga kelgan mehmonlar uchun ayni muddao. Ergonomik jihozlangan xona maydoni, qulay ortopedik to'shak va zamonaviy dush xonasi sizga to'laqonli dam olish imkoniyatini beradi. Har bir detal mehmonlarning tinchligi va farovonligi uchun puxta o'ylangan.",
    features: ['Tezkor Wi-Fi', 'Smart TV', 'Konditsioner', 'Bepul nonushta'],
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
    spaces: [
      {
        id: 'std-bedroom',
        name: 'Asosiy Yotoqxona hududi',
        typeLabel: 'Yotoqxona',
        size: '18 m²',
        description: 'Katta qulay King Size karavot, zamonaviy yoritish tizimi, qulay ish stoli va 43" Smart TV.',
        image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
        features: ['Ortopedik matras', 'Ish stoli va qulay stul', 'Garderob va seyf', 'Shovqin o‘tkazmaydigan devorlar'],
      },
      {
        id: 'std-bathroom',
        name: 'Shinam Vanna & Dush xonasi',
        typeLabel: 'Hammom',
        size: '6 m²',
        description: 'Marmar bezakli shisha dush kabinasi, iliq pol, kuchli soch feni va tozalik vositalari to‘plami.',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
        features: ['Tropik dush', 'Issiq pol tizimi', 'Premium sochiqlar', 'Organik dush geli va shampun'],
      },
      {
        id: 'std-balcony',
        name: 'Fransuzcha Kichik Balkon',
        typeLabel: 'Balkon',
        size: '4 m²',
        description: 'Ertalabki qahva uchun sokin ichki hovliga qaragan shinam shaxsiy balkon.',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        features: ['Kofe stoli', '2 ta qulay kreslo', 'Yashil hovli manzarasi'],
      },
    ],
    amenities: {
      comfort: ['Ortopedik matras', 'Shaxsiy iqlim nazorati (Konditsioner)', 'Gipoallergen yostiqlar', 'Qalin pardalar (Blackout)'],
      bathroom: ['Tropik dush', 'Yumshoq xalat va shippaklar', 'Kuchli fen', 'Kundalik gigiyena vositalari'],
      technology: ['Cheksiz yuqori tezlikdagi Wi-Fi (100 Mb/s)', '43" Full HD Smart TV', 'USB va Type-C zaryadlash portlari', 'Elektron seyf'],
      services: ['Bepul shved stoli nonushtasi', 'Har kungi tozalash xizmati', '24/7 resepshn va konsyerj', 'Bepul tozalangan suv'],
    },
  },
  {
    id: 2,
    name: 'Deluxe Shahar Manzarali',
    category: 'deluxe',
    categoryLabel: 'Deluxe',
    price: 550000,
    capacity: '2-3 kishilik',
    capacityCount: 3,
    size: '42 m²',
    sizeSquareMeters: 42,
    roomCount: 2,
    roomCountLabel: '2 xonali lyuks xona',
    floor: 3,
    bedType: 'Super King (200x200 sm) + Yumshoq divan',
    view: 'Toshkent shahrining panoramik ko‘rinishi',
    description: "Keng maydon, shahar panoramik manzarasi va mini-bar bilan jihozlangan lyuks xona.",
    fullDescription: "Deluxe toifasidagi 2 xonali bu lyuks xonadon shahar manzarasi bilan uyg'unlashgan nafis interyerni taqdim etadi. Alohida yotoqxona va shinam zal-mehmonxona qismi mehmonlarga nafaqat dam olish, balki do'stlar yoki hamkasblar bilan bemalol suhbatlashish uchun ham keng sharoit yaratadi.",
    features: ['Panoramik oyna', 'Katta balkon', 'Mini-bar', 'Shved stoli nonushtasi'],
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    popular: true,
    spaces: [
      {
        id: 'dlx-bedroom',
        name: 'Katta Yotoqxona (Master Bedroom)',
        typeLabel: '1-xona (Yotoqxona)',
        size: '22 m²',
        description: 'Super King-size karavot, panoramik deraza, maxsus yoritish tizimi va keng kiyim shkafi.',
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
        features: ['Super King karavot (200x200)', 'Katta kiyinish oynasi', 'Shahar panoramasi', 'Elektron seyf'],
      },
      {
        id: 'dlx-living',
        name: 'Mehmonxona & Dam Olish Zali (Living Room)',
        typeLabel: '2-xona (Zal)',
        size: '14 m²',
        description: 'Qulay yumshoq burchak divani, jurnal stoli, to‘ldirilgan mini-bar hamda 55" 4K Smart TV.',
        image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
        features: ['Ochiladigan yumshoq divan', 'Mini-bar va choy burchagi', '55" 4K Smart TV', 'Kofe mashinasi'],
      },
      {
        id: 'dlx-bathroom',
        name: 'Premium Marmar Vanna & Dush',
        typeLabel: 'Hammom',
        size: '6 m²',
        description: 'Chuqur qulay vanna, shisha dush paneli, keng oynali yoritgich va premium vanna to‘plami.',
        image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80',
        features: ['Chuqur akril vanna', 'Yomg‘ir effekti beruvchi dush', 'Yoritgichli katta oyna', 'Premium xalatlar'],
      },
      {
        id: 'dlx-balcony',
        name: 'Panoramik Shahar Balkoni',
        typeLabel: 'Katta Balkon',
        size: '8 m²',
        description: 'Shahar markazi va tungi chiroqlarni tomosha qilish uchun mebellangan keng balkon.',
        image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
        features: ['Shisha to‘siqlar', 'Dam olish stoli va stullar', '3-qavat balandlik panoramasi'],
      },
    ],
    amenities: {
      comfort: ['Ortopedik Super King karavot', 'Alohida harorat sozlagich', 'Yumshoq divan (qo‘shimcha yotoq)', 'Maxsus ovoz izolyatsiyasi'],
      bathroom: ['Chuqur vanna va alohida dush', 'Bambuk matoli xalat va shippaklar', 'Issiq pol', 'Dior/L’Occitane parfyumeriya vositalari'],
      technology: ['55" 4K Ultra HD Smart TV', 'Tezkor Wi-Fi 6', 'Simsiz zaryadlagich stansiyalari', 'Nespresso kapsulali kofe mashinasi'],
      services: ['Har tong shved stoli nonushtasi', 'Mini-bardan bepul salqin ichimliklar', 'Kunlik tozalash va sochiq almashtirish', 'Xonaga bepul kechki choy xizmati'],
    },
  },
  {
    id: 3,
    name: 'Premium Oila Suite',
    category: 'suite',
    categoryLabel: 'Suite',
    price: 850000,
    capacity: '4 kishilik',
    capacityCount: 4,
    size: '68 m²',
    sizeSquareMeters: 68,
    roomCount: 3,
    roomCountLabel: '3 xonali oilaviy suit',
    floor: 4,
    bedType: '1 ta King Size + 2 ta Alohida Single karavot',
    view: 'Toshkent shahar markazi va favvoralar xiyoboni',
    description: "Oilaviy dam olish uchun alohida mehmonxona va yotoqxona qismlariga ega keng suit.",
    fullDescription: "Butun oila a'zolari birgalikda bekamu-ko'st hordiq chiqarishi uchun yaratilgan 3 xonali keng Suite. Asosiy yotoqxona, bolalar/mehmonlar uchun alohida ikkinchi yotoqxona, katta oilaviy yashash zali hamda mini-oshxona to'liq qulaylikni ta'minlaydi. Gidromassajli jakuzi esa kun so'ngida charchoqni chiqarish uchun ajoyib imkoniyat.",
    features: ['2 ta xona', 'Jakuzi vanna', 'Oshxona burchagi', 'VIP xizmat'],
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    spaces: [
      {
        id: 'ste-living',
        name: 'Katta Oilaviy Mehmonxona Zali (Grand Living Hall)',
        typeLabel: '1-xona (Zal)',
        size: '26 m²',
        description: 'Oilaviy suhbatlar uchun keng yumshoq mebel to‘plami, 65" 4K televizor va qulay yorug‘ dizayn.',
        image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80',
        features: ['L-shaklidagi katta yumshoq divan', '65" 4K Smart TV kinoteatr rejimi', 'Katta jurnal stoli', 'Panoramik derazalar'],
      },
      {
        id: 'ste-master-bedroom',
        name: 'Asosiy Ota-onalar Yotoqxonasi (Master Bedroom)',
        typeLabel: '2-xona (Yotoqxona)',
        size: '20 m²',
        description: 'Maxsus ergonomik King Size to‘shak, kiyinish zonasi, shaxsiy balkon chiqishi va sokin muhit.',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
        features: ['King Size to‘shak', 'Alohida garderob shkafi', 'Balkonga shaxsiy chiqish eshigi', 'Shaxsiy 50" Smart TV'],
      },
      {
        id: 'ste-kids-bedroom',
        name: 'Ikkinchi Yotoqxona (Bolalar / Mehmonlar xonasi)',
        typeLabel: '3-xona (Yotoqxona)',
        size: '16 m²',
        description: 'Ikkita mustaqil qulay karavot, dars yoki ish uchun yozuv stoli va kitob javonlari.',
        image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
        features: ['2 ta alohida Single karavot', 'Bolalar yoki yoshlar uchun ish stoli', 'O‘yinlar va kitoblar burchagi', 'Xavfsiz rozetkalar'],
      },
      {
        id: 'ste-kitchenette',
        name: 'Mini-oshxona & Ovqatlanish hududi (Kitchenette & Dining)',
        typeLabel: 'Oshxona & Oshxona zali',
        size: '12 m²',
        description: 'Mikroto‘lqinli pech, muzlatgich, kofe mashinasi, idish-tovoqlar va 4 kishilik ovqatlanish stoli.',
        image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
        features: ['Mikroto‘lqinli pech va muzlatgich', 'Kapsulali kofe apparati', '4 kishilik tushlik stoli', 'Choynak va to‘liq idishlar'],
      },
      {
        id: 'ste-spa-bathroom',
        name: 'SPA Hammom & Jakuzi Vanna',
        typeLabel: 'SPA Hammom',
        size: '10 m²',
        description: 'Gidromassajli 2 kishilik jakuzi, alohida tropik dush kabinasi va er-xotin uchun juft rakovina.',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
        features: ['Gidromassajli zamonaviy jakuzi', 'Alohida dush zonasi', 'Juft marmar rakovinalar', 'Premium spa tuzlari va ko‘piklari'],
      },
    ],
    amenities: {
      comfort: ['King karavot + 2 ta Single karavot', '3 ta alohida xonada mustaqil konditsionerlar', 'Bolalar uchun xavfsiz jihozlar', 'Ovoz o‘tkazmaydigan eshiklar'],
      bathroom: ['Gidromassajli jakuzi', 'Tropik dush tizimi', 'Butun oila uchun shippak va xalatlar', 'Bolalar uchun maxsus gigiyena to‘plami'],
      technology: ['2 ta Smart TV (65" va 50")', 'Ultra tezkor Wi-Fi 6', 'Kofe mashinasi va elektr choynak', 'Elektron kartali kirish tizimi'],
      services: ['Oilaviy shved stoli nonushtasi', 'Xonaga bepul taom yetkazish (Room service)', 'Kiyim dazmollash va yuvish xizmati', 'Bolalar uchun qo‘shimcha beshik (talab bo‘yicha)'],
    },
  },
  {
    id: 4,
    name: 'Prezident Apartamenti',
    category: 'president',
    categoryLabel: 'Prezident',
    price: 1500000,
    capacity: '4-6 kishilik',
    capacityCount: 6,
    size: '120 m²',
    sizeSquareMeters: 120,
    roomCount: 4,
    roomCountLabel: '4 xonali qirollik apartamenti',
    floor: 5,
    bedType: '2 ta Royal King Size (220x220 sm) + VIP Divanlar',
    view: 'Toshkent shahriga 360 darajali keng panoramik ko‘rinish',
    description: "Eksklyuziv dizayn, yuqori darajadagi xavfsizlik va shaxsiy xizmat ko'rsatuvchi xodim bilan ta'minlangan.",
    fullDescription: "Origin Hotelning eng hashamatli va nufuzli apartamenti. 4 ta alohida xonani o'z ichiga olgan 120 metr kvadratlik bu qasr mehmonlarga mutlaq erkinlik, yuqori darajadagi xavfsizlik, shaxsiy terras va shaxsiy batler xizmatini taqdim etadi. Yuqori martabali mehmonlar, davlat arboblari va lyuks hayot ixlosmandlari uchun ideal tanlov.",
    features: ['Shaxsiy terras', 'Shaxsiy batler', 'Premium spa zonasi', 'Transfer bepul'],
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
    spaces: [
      {
        id: 'prs-grand-hall',
        name: 'Qirollik Grand Zali (Royal Banquet & Living Hall)',
        typeLabel: '1-xona (Katta Zal)',
        size: '45 m²',
        description: 'Katta diplomatik qabulxona zali, hashamatli mebellar, 75" kinoteatr ekrani va shohona marmar kamin.',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        features: ['75" 4K OLED kinoteatr displeyi', '10 kishilik banket va tushlik stoli', 'Marmar kamin burchagi', 'Bang & Olufsen akustika tizimi'],
      },
      {
        id: 'prs-master-suite',
        name: 'Prezident Yotoqxonasi (Master Royal Bedroom)',
        typeLabel: '2-xona (Bosh Yotoqxona)',
        size: '30 m²',
        description: 'Eksklyuziv Royal King karavoti, shaxsiy panoramik ko‘rinish, kiyinish xonasi va maxsus yoritish.',
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
        features: ['Royal King karavot (220x220)', 'Alohida kiyinish xonasi (Walk-in closet)', 'Avtomatik pardalar boshqaruvi', 'Shaxsiy mini-bar'],
      },
      {
        id: 'prs-vip-guest',
        name: 'VIP Mehmonlar Yotoqxonasi (Second VIP Bedroom)',
        typeLabel: '3-xona (Mehmonlar yotoqxonasi)',
        size: '22 m²',
        description: 'Hamrohlar yoki mehmonlar uchun ikkinchi to‘liq jihozlangan King-size yotoqxona va shaxsiy dush.',
        image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
        features: ['King Size to‘shak', 'Alohida sanuzel va dush', '55" 4K Smart TV', 'Shinam dam olish kreslosi'],
      },
      {
        id: 'prs-executive-office',
        name: 'Shaxsiy Ish Kabineti & Kutubxona (Executive Office)',
        typeLabel: '4-xona (Ish kabineti)',
        size: '18 m²',
        description: 'Muzokaralar va muhim biznes qarorlari uchun eman daraxtidan yasalgan stol va charm mebellar.',
        image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
        features: ['Prezident darajasidagi ish stoli', 'Ergonomik charm kreslo', 'Shaxsiy seyf va shifrlangan Wi-Fi', 'Printer va faks qurilmasi'],
      },
      {
        id: 'prs-terrace',
        name: 'Shaxsiy Ochiq Terrasa (Private Sky Terrace)',
        typeLabel: 'Ochiq Terrasa',
        size: '25 m²',
        description: 'Balandlikdan poytaxtning betakror manzarasi, lounge divanlar va kechki ovqat uchun maxsus hudud.',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        features: ['360° shahar panoramasi', 'Ochiq osmon ostidagi lounge mebellar', 'Kechki yoritish chiroqlari', 'Shaxsiy batler xizmati'],
      },
      {
        id: 'prs-spa-bath',
        name: 'VIP SPA & Jakuzi Zali (Luxury Spa Sanctuary)',
        typeLabel: 'SPA & Vanna',
        size: '15 m²',
        description: 'Shahar manzarali katta jakuzi, xususiy fin saunasi va BVLGARI eksklyuziv kosmetika to‘plami.',
        image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80',
        features: ['Katta panoramik jakuzi', 'Fin quruq saunasi', 'Marmar bezaklar', 'BVLGARI parfyumeriya komplekti'],
      },
    ],
    amenities: {
      comfort: ['2 ta Royal King karavot', 'Shaxsiy fin saunasi va terras', 'Aqlli uy tizimi (Smart Home)', 'Zirhlangan xavfsizlik eshiklari'],
      bathroom: ['Panoramik jakuzi va sauna', 'Ipak va paxtali qirollik xalatlari', 'BVLGARI dush va parfyum to‘plami', 'Gidromassajli ko‘p funksiyali dush'],
      technology: ['75" OLED kinoteatr displeyi + 3 ta qo‘shimcha TV', 'Bang & Olufsen audio tizimi', 'Xavfsiz optik tolali 500 Mb/s internet', 'Planshet orqali butun xonani boshqarish'],
      services: ['24/7 Shaxsiy batler (xizmatkor)', 'Aeroportdan VIP Mercedes-Maybach transferi', 'Cheksiz VIP restoran menyusi', 'Shaxsiy avtoturargoh'],
    },
  },
];
