import type { LanguageCode } from '@/i18n';

// Menu captions only; hotel names, room names and stored business data stay intact.
const rows: [string, string, string, string, string][] = [
  ['Ichki yo‘lak', 'Hallway', 'Коридор', 'Couloir', 'Flur'],
  ['Tadbirlar', 'Events', 'Мероприятия', 'Événements', 'Veranstaltungen'],
  ['Mehmonxona haqida', 'About the hotel', 'Об отеле', 'À propos de l’hôtel', 'Über das Hotel'],
  ['Brend', 'Brand', 'Бренд', 'Marque', 'Marke'],
  ['Hudud', 'Region', 'Регион', 'Région', 'Region'],
  ['Oynani yopish', 'Close dialog', 'Закрыть окно', 'Fermer la fenêtre', 'Fenster schließen'],
  ['Biz haqimizda', 'About the Hotel', 'Об отеле', 'À propos', 'Über das Hotel'],
  ['Takliflar', 'Offers', 'Предложения', 'Offres', 'Angebote'],
  ['Xonalar', 'Rooms', 'Номера', 'Chambres', 'Zimmer'],
  ['Restoran', 'Dining', 'Ресторан', 'Restaurant', 'Restaurant'],
  ['Qulayliklar', 'Facilities', 'Удобства', 'Équipements', 'Ausstattung'],
  ['Galereya', 'Gallery', 'Галерея', 'Galerie', 'Galerie'],
  ['Aloqa', 'Contact', 'Контакты', 'Contact', 'Kontakt'],
  ['Kirish', 'Log in', 'Войти', 'Connexion', 'Anmelden'],
  ['Hisobim', 'My account', 'Мой аккаунт', 'Mon compte', 'Mein Konto'],
  ['Bronlarim', 'My reservations', 'Мои бронирования', 'Mes réservations', 'Meine Buchungen'],
  ['Boshqaruv', 'Dashboard', 'Панель управления', 'Tableau de bord', 'Verwaltung'],
  ['Bog‘lanish', 'Contact us', 'Связаться', 'Nous contacter', 'Kontakt aufnehmen'],
  ['Mehmonxona haqida +', 'About the hotel +', 'Об отеле +', 'À propos de l’hôtel +', 'Über das Hotel +'],
  ['Bosh sahifaga qaytish', 'Back to home', 'На главную', 'Retour à l’accueil', 'Zur Startseite'],
  ['Menyu', 'Menu', 'Меню', 'Menu', 'Menü'],
  ['Tilni tanlash', 'Choose language', 'Выбрать язык', 'Choisir la langue', 'Sprache wählen'],
  ['Asosiy menyu', 'Main navigation', 'Основное меню', 'Navigation principale', 'Hauptnavigation'],
  ['Bron qilish', 'Reservation', 'Забронировать', 'Réserver', 'Reservieren'],
  ['Mehmonxona afzalliklari', 'Hotel benefits', 'Преимущества отеля', 'Avantages de l’hôtel', 'Hotelvorteile'],
  ['Xonalar va narxlar', 'Rooms and rates', 'Номера и цены', 'Chambres et tarifs', 'Zimmer und Preise'],
  ['Joylashuv', 'Location', 'Расположение', 'Emplacement', 'Lage'],
  ['Manzil va xarita', 'Address and map', 'Адрес и карта', 'Adresse et plan', 'Adresse und Karte'],
  ['Yo‘l ma’lumotlari', 'Getting here', 'Как добраться', 'Accès', 'Anreise'],
  ['Qabulxona', 'Reception', 'Стойка регистрации', 'Réception', 'Rezeption'],
  ['Qabulxona: 24/7', '24/7 reception', 'Ресепшен: 24/7', 'Réception 24h/24', 'Rezeption: rund um die Uhr'],
  ['Email yuborish', 'Send an email', 'Написать письмо', 'Envoyer un e-mail', 'E-Mail senden'],
  ['Afzalliklar', 'Benefits', 'Преимущества', 'Avantages', 'Vorteile'],
  ['Bepul nonushta', 'Breakfast included', 'Бесплатный завтрак', 'Petit-déjeuner inclus', 'Frühstück inklusive'],
  ['Balkon va mini-bar', 'Balcony and minibar', 'Балкон и мини-бар', 'Balcon et minibar', 'Balkon und Minibar'],
  ['Jakuzi va VIP xizmat', 'Jacuzzi and VIP service', 'Джакузи и VIP-сервис', 'Jacuzzi et service VIP', 'Whirlpool und VIP-Service'],
  ['Shaxsiy terras va batler', 'Private terrace and butler', 'Личная терраса и дворецкий', 'Terrasse privée et majordome', 'Private Terrasse und Butler'],
  ['Restoran haqida', 'About the restaurant', 'О ресторане', 'À propos du restaurant', 'Über das Restaurant'],
  ['Restoran muhiti', 'Restaurant atmosphere', 'Атмосфера ресторана', 'Ambiance du restaurant', 'Restaurantambiente'],
  ['Nonushta', 'Breakfast', 'Завтрак', 'Petit-déjeuner', 'Frühstück'],
  ['Standart xona nonushtasi', 'Standard room breakfast', 'Завтрак для номера Стандарт', 'Petit-déjeuner Standard', 'Frühstück im Standardzimmer'],
  ['Xona tafsilotlari', 'Room details', 'Описание номера', 'Détails de la chambre', 'Zimmerdetails'],
  ['Shved stoli', 'Buffet', 'Шведский стол', 'Buffet', 'Buffet'],
  ['Deluxe xona qulayliklari', 'Deluxe room amenities', 'Удобства номера Делюкс', 'Équipements Deluxe', 'Deluxe-Ausstattung'],
  ['Restoran bilan bog‘lanish', 'Contact the restaurant', 'Связаться с рестораном', 'Contacter le restaurant', 'Restaurant kontaktieren'],
  ['Basseyn', 'Pool', 'Бассейн', 'Piscine', 'Pool'],
  ['Basseyn haqida', 'About the pool', 'О бассейне', 'À propos de la piscine', 'Über den Pool'],
  ['Suratlarni ko‘rish', 'View photos', 'Посмотреть фотографии', 'Voir les photos', 'Fotos ansehen'],
  ['Fitnes', 'Fitness', 'Фитнес', 'Fitness', 'Fitness'],
  ['Fitnes zali', 'Gym', 'Тренажёрный зал', 'Salle de sport', 'Fitnessraum'],
  ['SPA haqida', 'About the spa', 'О SPA', 'À propos du spa', 'Über das Spa'],
  ['Mehmonxona xizmatlari', 'Hotel services', 'Услуги отеля', 'Services de l’hôtel', 'Hotelservices'],
  ['Bepul Wi-Fi', 'Free Wi-Fi', 'Бесплатный Wi-Fi', 'Wi-Fi gratuit', 'Kostenloses WLAN'],
  ['Bepul parking', 'Free parking', 'Бесплатная парковка', 'Parking gratuit', 'Kostenlose Parkplätze'],
  ['Aeroport transferi', 'Airport transfer', 'Трансфер из аэропорта', 'Transfert aéroport', 'Flughafentransfer'],
  ['Tashqi ko‘rinish', 'Hotel exterior', 'Внешний вид', 'Extérieur de l’hôtel', 'Außenansicht'],
];
const columns: Record<LanguageCode, number> = { uz: 0, en: 1, ru: 2, fr: 3, de: 4 };
const captions = new Map(rows.map((row) => [row[0], row]));

export function hotelNavigationText(text: string, language: LanguageCode): string {
  const row = captions.get(text);
  if (row) return row[columns[language]];
  if (text.includes('kishi')) {
    const guests: Record<LanguageCode, string> = { uz: 'kishi', en: 'guests', ru: 'гостя', fr: 'personnes', de: 'Gäste' };
    return text.replace('kishi', guests[language]);
  }
  return text;
}
