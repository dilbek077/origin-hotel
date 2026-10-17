import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export const LANGUAGES = [
  { code: 'uz', label: 'O‘zbekcha' },
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]['code'];

export const translations: Record<string, Record<LanguageCode, string>> = {
  // Navigation
  'nav.home': { uz: 'Bosh sahifa', ru: 'Главная', en: 'Home', fr: 'Accueil', de: 'Startseite' },
  'nav.rooms': { uz: 'Xonalar', ru: 'Номера', en: 'Rooms', fr: 'Chambres', de: 'Zimmer' },
  'nav.advantages': { uz: 'Afzalliklar', ru: 'Преимущества', en: 'Benefits', fr: 'Avantages', de: 'Vorteile' },
  'nav.reviews': { uz: 'Sharhlar', ru: 'Отзывы', en: 'Reviews', fr: 'Avis', de: 'Bewertungen' },
  'nav.contact': { uz: 'Bog‘lanish', ru: 'Контакты', en: 'Contact', fr: 'Contact', de: 'Kontakt' },
  'nav.login': { uz: 'Tizimga kirish', ru: 'Войти', en: 'Login', fr: 'Connexion', de: 'Anmelden' },
  'nav.dashboard': { uz: 'Dashboard', ru: 'Панель управления', en: 'Dashboard', fr: 'Tableau de bord', de: 'Dashboard' },
  'nav.guests': { uz: 'Mehmonlar', ru: 'Гости', en: 'Guests', fr: 'Invités', de: 'Gäste' },
  'nav.bookings': { uz: 'Bronlar', ru: 'Бронирования', en: 'Bookings', fr: 'Réservations', de: 'Buchungen' },
  'nav.finance': { uz: 'Moliya', ru: 'Финансы', en: 'Finance', fr: 'Finance', de: 'Finanzen' },
  'nav.reports': { uz: 'Hisobotlar', ru: 'Отчеты', en: 'Reports', fr: 'Rapports', de: 'Berichte' },
  'nav.settings': { uz: 'Sozlamalar', ru: 'Настройки', en: 'Settings', fr: 'Paramètres', de: 'Einstellungen' },
  'nav.logout': { uz: 'Chiqish', ru: 'Выйти', en: 'Logout', fr: 'Déconnexion', de: 'Abmelden' },

  // Common
  'common.save': { uz: 'Saqlash', ru: 'Сохранить', en: 'Save', fr: 'Enregistrer', de: 'Speichern' },
  'common.saved': { uz: 'Saqlandi!', ru: 'Сохранено!', en: 'Saved!', fr: 'Enregistré !', de: 'Gespeichert!' },
  'common.cancel': { uz: 'Bekor qilish', ru: 'Отмена', en: 'Cancel', fr: 'Annuler', de: 'Abbrechen' },
  'common.delete': { uz: 'O‘chirish', ru: 'Удалить', en: 'Delete', fr: 'Supprimer', de: 'Löschen' },
  'common.edit': { uz: 'Tahrirlash', ru: 'Редактировать', en: 'Edit', fr: 'Modifier', de: 'Bearbeiten' },
  'common.view': { uz: 'Ko‘rish', ru: 'Просмотр', en: 'View', fr: 'Voir', de: 'Anzeigen' },
  'common.add': { uz: 'Qo‘shish', ru: 'Добавить', en: 'Add', fr: 'Ajouter', de: 'Hinzufügen' },
  'common.search': { uz: 'Qidirish', ru: 'Поиск', en: 'Search', fr: 'Recherche', de: 'Suchen' },
  'common.filter': { uz: 'Filtr', ru: 'Фильтр', en: 'Filter', fr: 'Filtre', de: 'Filter' },
  'common.all': { uz: 'Barchasi', ru: 'Все', en: 'All', fr: 'Tout', de: 'Alle' },
  'common.status': { uz: 'Holati', ru: 'Статус', en: 'Status', fr: 'Statut', de: 'Status' },
  'common.actions': { uz: 'Amallar', ru: 'Действия', en: 'Actions', fr: 'Actions', de: 'Aktionen' },
  'common.close': { uz: 'Yopish', ru: 'Закрыть', en: 'Close', fr: 'Fermer', de: 'Schließen' },
  'common.details': { uz: 'Batafsil', ru: 'Подробнее', en: 'Details', fr: 'Détails', de: 'Details' },
  'common.loading': { uz: 'Yuklanmoqda...', ru: 'Загрузка...', en: 'Loading...', fr: 'Chargement...', de: 'Laden...' },
  'common.perNight': { uz: '1 kecha uchun', ru: 'за 1 ночь', en: 'per night', fr: 'par nuit', de: 'pro Nacht' },
  'common.currency': { uz: 'so‘m', ru: 'сум', en: 'UZS', fr: 'UZS', de: 'UZS' },
  'common.floor': { uz: 'qavat', ru: 'этаж', en: 'floor', fr: 'étage', de: 'Etage' },
  'common.guests': { uz: 'kishi', ru: 'чел.', en: 'guests', fr: 'pers.', de: 'Gäste' },
  'common.date': { uz: 'Sana', ru: 'Дата', en: 'Date', fr: 'Date', de: 'Datum' },
  'common.amount': { uz: 'Summa', ru: 'Сумма', en: 'Amount', fr: 'Montant', de: 'Betrag' },
  'common.category': { uz: 'Kategoriya', ru: 'Категория', en: 'Category', fr: 'Catégorie', de: 'Kategorie' },
  'common.description': { uz: 'Tavsif', ru: 'Описание', en: 'Description', fr: 'Description', de: 'Beschreibung' },
  'common.notes': { uz: 'Izoh / Eslatmalar', ru: 'Примечания / Заметки', en: 'Notes / Remarks', fr: 'Remarques', de: 'Notizen' },
  'common.lightMode': { uz: 'Kunduzgi rejim', ru: 'Светлая тема', en: 'Light mode', fr: 'Mode clair', de: 'Heller Modus' },
  'common.darkMode': { uz: 'Tungi rejim', ru: 'Темная тема', en: 'Dark mode', fr: 'Mode sombre', de: 'Dunkler Modus' },
  'common.language': { uz: 'Til', ru: 'Язык', en: 'Language', fr: 'Langue', de: 'Sprache' },
  'common.user': { uz: 'Foydalanuvchi', ru: 'Пользователь', en: 'User', fr: 'Utilisateur', de: 'Benutzer' },
  'common.yes': { uz: 'Ha', ru: 'Да', en: 'Yes', fr: 'Oui', de: 'Ja' },
  'common.no': { uz: 'Yo‘q', ru: 'Нет', en: 'No', fr: 'Non', de: 'Nein' },
  'common.phone': { uz: 'Telefon', ru: 'Телефон', en: 'Phone', fr: 'Téléphone', de: 'Telefon' },
  'common.address': { uz: 'Manzil', ru: 'Адрес', en: 'Address', fr: 'Adresse', de: 'Adresse' },
  'common.type': { uz: 'Turi', ru: 'Тип', en: 'Type', fr: 'Type', de: 'Typ' },

  // Statuses
  'status.all': { uz: 'Barchasi', ru: 'Все', en: 'All', fr: 'Tout', de: 'Alle' },
  'status.vacant': { uz: 'Bo‘sh', ru: 'Свободно', en: 'Vacant', fr: 'Libre', de: 'Frei' },
  'status.occupied': { uz: 'Band', ru: 'Занято', en: 'Occupied', fr: 'Occupée', de: 'Belegt' },
  'status.cleaning': { uz: 'Tozalashda', ru: 'Уборка', en: 'Cleaning', fr: 'En nettoyage', de: 'In Reinigung' },
  'status.maintenance': { uz: 'Ta\'mirda', ru: 'Ремонт', en: 'Maintenance', fr: 'En maintenance', de: 'In Wartung' },
  'status.pending': { uz: 'Kutilmoqda', ru: 'В ожидании', en: 'Pending', fr: 'En attente', de: 'Ausstehend' },
  'status.confirmed': { uz: 'Tasdiqlangan', ru: 'Подтверждено', en: 'Confirmed', fr: 'Confirmé', de: 'Bestätigt' },
  'status.living': { uz: 'Yashamoqda', ru: 'Проживает', en: 'In-house', fr: 'En séjour', de: 'Im Haus' },
  'status.completed': { uz: 'Tugatilgan', ru: 'Завершено', en: 'Completed', fr: 'Terminé', de: 'Abgeschlossen' },
  'status.cancelled': { uz: 'Bekor', ru: 'Отменено', en: 'Cancelled', fr: 'Annulé', de: 'Storniert' },
  'status.income': { uz: 'Kirim', ru: 'Доход', en: 'Income', fr: 'Revenu', de: 'Einnahme' },
  'status.expense': { uz: 'Chiqim', ru: 'Расход', en: 'Expense', fr: 'Dépense', de: 'Ausgabe' },

  // Room Types
  'roomType.standart': { uz: 'Standart', ru: 'Стандарт', en: 'Standard', fr: 'Standard', de: 'Standard' },
  'roomType.deluxe': { uz: 'Deluxe', ru: 'Делюкс', en: 'Deluxe', fr: 'Deluxe', de: 'Deluxe' },
  'roomType.suite': { uz: 'Suite', ru: 'Люкс (Suite)', en: 'Suite', fr: 'Suite', de: 'Suite' },
  'roomType.president': { uz: 'Prezident', ru: 'Президентский', en: 'Presidential', fr: 'Présidentiel', de: 'Präsidenten-Suite' },

  // Categories for finance
  'category.roomFee': { uz: 'Xona haqi', ru: 'Оплата номера', en: 'Room fee', fr: 'Frais de chambre', de: 'Zimmergebühr' },
  'category.dining': { uz: 'Ovqatlanish', ru: 'Питание', en: 'Dining', fr: 'Restauration', de: 'Verpflegung' },
  'category.services': { uz: 'Qo‘shimcha xizmatlar', ru: 'Доп. услуги', en: 'Additional services', fr: 'Services additionnels', de: 'Zusatzleistungen' },
  'category.rent': { uz: 'Ijara', ru: 'Аренда', en: 'Rent', fr: 'Location', de: 'Miete' },
  'category.otherIncome': { uz: 'Boshqa kirim', ru: 'Прочие доходы', en: 'Other income', fr: 'Autres revenus', de: 'Sonstige Einnahmen' },
  'category.salary': { uz: 'Ish haqi', ru: 'Зарплата', en: 'Salary', fr: 'Salaires', de: 'Gehälter' },
  'category.utilities': { uz: 'Kommunal to‘lovlar', ru: 'Коммунальные услуги', en: 'Utilities', fr: 'Services publics', de: 'Nebenkosten' },
  'category.materials': { uz: 'Material/xaridlar', ru: 'Материалы / закупки', en: 'Supplies & purchases', fr: 'Fournitures et achats', de: 'Material & Einkäufe' },
  'category.repairs': { uz: 'Ta’mirlash', ru: 'Ремонт', en: 'Repairs', fr: 'Réparations', de: 'Reparaturen' },
  'category.otherExpense': { uz: 'Boshqa chiqim', ru: 'Прочие расходы', en: 'Other expenses', fr: 'Autres dépenses', de: 'Sonstige Ausgaben' },

  // Login
  'login.title': { uz: 'Mehmonxona Boshqaruv Tizimi', ru: 'Система управления отелем', en: 'Hotel Management System', fr: 'Système de gestion hôtelière', de: 'Hotel-Management-System' },
  'login.subtitle': { uz: 'Barcha xonalar, mehmonlar va xizmatlarni bir joydan boshqaring.', ru: 'Управляйте всеми номерами, гостями и сервисами в одном месте.', en: 'Manage all rooms, guests, and services in one place.', fr: 'Gérez toutes les chambres, les invités et les services en un seul endroit.', de: 'Verwalten Sie alle Zimmer, Gäste und Dienste an einem Ort.' },
  'login.username': { uz: 'Foydalanuvchi nomi', ru: 'Имя пользователя', en: 'Username', fr: 'Nom d’utilisateur', de: 'Benutzername' },
  'login.password': { uz: 'Parol', ru: 'Пароль', en: 'Password', fr: 'Mot de passe', de: 'Passwort' },
  'login.submit': { uz: 'Kirish', ru: 'Войти', en: 'Sign in', fr: 'Se connecter', de: 'Anmelden' },
  'login.demo': { uz: 'Demo hisoblar (Bosing va sinab ko‘ring):', ru: 'Демо-аккаунты (нажмите и попробуйте):', en: 'Demo accounts (Tap to try):', fr: 'Comptes de démonstration (appuyez pour tester) :', de: 'Demo-Konten (zum Testen antippen):' },
  'login.demoHint': { uz: 'admin yoki staff', ru: 'admin или staff', en: 'admin or staff', fr: 'admin ou staff', de: 'admin oder staff' },
  'login.empty': { uz: "Iltimos, barcha maydonlarni to'ldiring.", ru: 'Пожалуйста, заполните все поля.', en: 'Please fill in all fields.', fr: 'Veuillez remplir tous les champs.', de: 'Bitte füllen Sie alle Felder aus.' },
  'login.invalid': { uz: "Login yoki parol noto'g'ri! (Pastdagi demo hisoblardan tanlang)", ru: 'Неверное имя пользователя или пароль! (Выберите один из демо-аккаунтов ниже)', en: 'Incorrect username or password! (Choose from the demo account below)', fr: 'Nom d’utilisateur ou mot de passe incorrect ! (Choisissez un compte de démonstration ci-dessous)', de: 'Falscher Benutzername oder Passwort! (Wählen Sie unten ein Demo-Konto aus)' },
  'login.showPassword': { uz: 'Parolni ko‘rsatish', ru: 'Показать пароль', en: 'Show password', fr: 'Afficher le mot de passe', de: 'Passwort anzeigen' },
  'login.hidePassword': { uz: 'Parolni yashirish', ru: 'Скрыть пароль', en: 'Hide password', fr: 'Masquer le mot de passe', de: 'Passwort verbergen' },
  'login.welcome': { uz: 'Xush kelibsiz!', ru: 'Добро пожаловать!', en: 'Welcome!', fr: 'Bienvenue !', de: 'Willkommen!' },
  'login.brandTitle': { uz: 'Origin Hotel', ru: 'Origin Hotel', en: 'Origin Hotel', fr: 'Origin Hotel', de: 'Origin Hotel' },
  'login.brandText': { uz: 'Tizimga kirish uchun ma’lumotlaringizni kiriting.', ru: 'Введите свои данные для входа в систему.', en: 'Enter your details to sign in.', fr: 'Saisissez vos informations pour vous connecter.', de: 'Geben Sie Ihre Daten ein, um sich anzumelden.' },
  'login.stats.rooms': { uz: 'Xonalar', ru: 'Номера', en: 'Rooms', fr: 'Chambres', de: 'Zimmer' },
  'login.stats.satisfaction': { uz: 'Mijozlar mamnuniyati', ru: 'Удовлетворенность гостей', en: 'Guest satisfaction', fr: 'Satisfaction client', de: 'Kundenzufriedenheit' },
  'login.stats.service': { uz: 'Xizmat', ru: 'Сервис', en: 'Service', fr: 'Service', de: 'Service' },
  'login.footer': { uz: '© 2026 Origin Hotel. Barcha huquqlar himoyalangan.', ru: '© 2026 Origin Hotel. Все права защищены.', en: '© 2026 Origin Hotel. All rights reserved.', fr: '© 2026 Origin Hotel. Tous droits réservés.', de: '© 2026 Origin Hotel. Alle Rechte vorbehalten.' },

  // Landing Page
  'landing.tagline': { uz: 'Luxury & Comfort', ru: 'Роскошь и комфорт', en: 'Luxury & Comfort', fr: 'Luxe & Confort', de: 'Luxus & Komfort' },
  'landing.hero.title': { uz: 'Origin Hotel bilan betakror qulaylik va xotirjamlikni his eting', ru: 'Ощутите непревзойденный комфорт и спокойствие в Origin Hotel', en: 'Experience unparalleled comfort and tranquility with Origin Hotel', fr: 'Découvrez un confort et une tranquillité inégalés à l’Origin Hotel', de: 'Erleben Sie unvergleichlichen Komfort und Ruhe im Origin Hotel' },
  'landing.hero.subtitle': { uz: 'Sizning maroqli hordig‘ingiz, yuqori darajadagi servis va unutilmas xotiralaringiz uchun zamonaviy sharoitlar yaratilgan.', ru: 'Созданы все условия для комфортного отдыха, высочайшего сервиса и незабываемых впечатлений.', en: 'Modern conditions designed for your relaxing vacation, premium service, and unforgettable memories.', fr: 'Des conditions modernes conçues pour votre détente, un service haut de gamme et des souvenirs inoubliables.', de: 'Moderne Bedingungen für Ihren erholsamen Urlaub, erstklassigen Service und unvergessliche Erinnerungen.' },
  'landing.hero.viewRooms': { uz: 'Xonalarni ko‘rish', ru: 'Посмотреть номера', en: 'View Rooms', fr: 'Voir les chambres', de: 'Zimmer ansehen' },
  'landing.hero.whyUs': { uz: 'Nega aynan biz?', ru: 'Почему именно мы?', en: 'Why Choose Us?', fr: 'Pourquoi nous ?', de: 'Warum wir?' },
  'landing.quick.checkIn': { uz: 'Kirish sanasi', ru: 'Дата заезда', en: 'Check-in date', fr: 'Date d’arrivée', de: 'Anreisedatum' },
  'landing.quick.checkOut': { uz: 'Chiqish sanasi', ru: 'Дата выезда', en: 'Check-out date', fr: 'Date de départ', de: 'Abreisedatum' },
  'landing.quick.guests': { uz: 'Mehmonlar', ru: 'Гости', en: 'Guests', fr: 'Invités', de: 'Gäste' },
  'landing.quick.guests1': { uz: '1 kishi', ru: '1 человек', en: '1 guest', fr: '1 invité', de: '1 Gast' },
  'landing.quick.guests2': { uz: '2 kishi', ru: '2 человека', en: '2 guests', fr: '2 invités', de: '2 Gäste' },
  'landing.quick.guests3': { uz: '3 kishi', ru: '3 человека', en: '3 guests', fr: '3 invités', de: '3 Gäste' },
  'landing.quick.guests4': { uz: '4+ kishi (Oila)', ru: '4+ человека (Семья)', en: '4+ guests (Family)', fr: '4+ invités (Famille)', de: '4+ Gäste (Familie)' },
  'landing.quick.availableRooms': { uz: 'Mavjud xonalar', ru: 'Найти номера', en: 'Available Rooms', fr: 'Chambres disponibles', de: 'Verfügbare Zimmer' },
  'landing.stats.rooms': { uz: 'Shinam xonalar', ru: 'Уютных номеров', en: 'Comfortable rooms', fr: 'Chambres confortables', de: 'Gemütliche Zimmer' },
  'landing.stats.guests': { uz: 'Mamnun mehmonlar', ru: 'Довольных гостей', en: 'Happy guests', fr: 'Invités satisfaits', de: 'Zufriedene Gäste' },
  'landing.stats.rating': { uz: 'Mijozlar bahosi', ru: 'Оценка клиентов', en: 'Guest rating', fr: 'Note des clients', de: 'Kundenbewertung' },
  'landing.stats.security': { uz: 'Xizmat va xavfsizlik', ru: 'Сервис и безопасность', en: 'Service & security', fr: 'Service & sécurité', de: 'Service & Sicherheit' },
  'landing.rooms.badge': { uz: 'Xonalar to‘plami', ru: 'Номерной фонд', en: 'Rooms Collection', fr: 'Collection de chambres', de: 'Zimmerauswahl' },
  'landing.rooms.title': { uz: 'Siz uchun tanlangan xonalarimiz', ru: 'Номера, подобранные для вас', en: 'Rooms Handpicked For You', fr: 'Chambres sélectionnées pour vous', de: 'Ausgewählte Zimmer für Sie' },
  'landing.rooms.subtitle': { uz: 'Har bir xona o‘zgacha dizayn, shinam to‘shaklar va zamonaviy qulayliklar bilan jihozlangan.', ru: 'Каждый номер оснащен эксклюзивным дизайном, уютными кроватями и современными удобствами.', en: 'Each room is equipped with distinctive design, comfortable beds, and modern amenities.', fr: 'Chaque chambre est dotée d’un design soigné, de lits douillets et d’équipements modernes.', de: 'Jedes Zimmer besticht durch exklusives Design, bequeme Betten und moderne Annehmlichkeiten.' },
  'landing.rooms.book': { uz: 'Band qilish', ru: 'Забронировать', en: 'Book Now', fr: 'Réserver', de: 'Buchen' },
  'landing.rooms.booked': { uz: 'Band qilingan', ru: 'Забронировано', en: 'Booked', fr: 'Réservé', de: 'Belegt' },
  'landing.rooms.view': { uz: 'Xonani ko‘rish', ru: 'Посмотреть', en: 'View Room', fr: 'Voir la chambre', de: 'Zimmer ansehen' },
  'landing.adv.title': { uz: 'Nega aynan Origin Hotelni tanlashadi?', ru: 'Почему выбирают Origin Hotel?', en: 'Why Choose Origin Hotel?', fr: 'Pourquoi choisir Origin Hotel ?', de: 'Warum Origin Hotel wählen?' },
  'landing.adv.subtitle': { uz: 'Har bir tafsilot mehmondorchilikning eng oliy mezonlariga muvofiq loyihalashtirilgan.', ru: 'Каждая деталь продумана в соответствии с высшими стандартами гостеприимства.', en: 'Every detail is designed in accordance with the highest hospitality standards.', fr: 'Chaque détail est pensé selon les normes hôtelières les plus exigeantes.', de: 'Jedes Detail wurde nach den höchsten Standards der Gastfreundschaft gestaltet.' },
  'landing.adv.1.title': { uz: 'Markaziy joylashuv', ru: 'Центральное расположение', en: 'Central Location', fr: 'Emplacement central', de: 'Zentrale Lage' },
  'landing.adv.1.desc': { uz: 'Qarshi markazida, metro, restoranlar va diqqatga sazovor joylarga bir necha qadam.', ru: 'В центре Карши, в шаговой доступности от ресторанов и достопримечательностей.', en: 'In the center of Karshi, steps away from restaurants and attractions.', fr: 'Au cœur de Karchi, à quelques pas des restaurants et sites touristiques.', de: 'Im Zentrum von Karschi, wenige Schritte von Restaurants und Sehenswürdigkeiten entfernt.' },
  'landing.adv.2.title': { uz: 'Shved stoli nonushtasi', ru: 'Завтрак "Шведский стол"', en: 'Buffet Breakfast', fr: 'Petit-déjeuner buffet', de: 'Frühstücksbuffet' },
  'landing.adv.2.desc': { uz: 'Har tong yangi pishiriqlar, issiq taomlar va xushbo‘y qahva bepul taqdim etiladi.', ru: 'Каждое утро свежая выпечка, горячие блюда и ароматный кофе бесплатно.', en: 'Fresh pastries, hot dishes, and aromatic coffee served complimentary every morning.', fr: 'Viennoiseries fraîches, plats chauds et café aromatique offerts chaque matin.', de: 'Jeden Morgen frisches Gebäck, warme Speisen und aromatischer Kaffee kostenlos.' },
  'landing.adv.3.title': { uz: '24/7 Xizmat ko‘rsatish', ru: 'Круглосуточный сервис', en: '24/7 Room Service', fr: 'Service 24/7', de: '24/7 Zimmerservice' },
  'landing.adv.3.desc': { uz: 'Kunning istalgan vaqtida xonaga xizmat, tozalik va resepshn xizmatlari faol.', ru: 'В любое время суток обслуживание номеров, уборка и стойка регистрации.', en: 'Around-the-clock room service, housekeeping, and front desk assistance.', fr: 'Service d’étage, ménage et réception à toute heure.', de: 'Rund um die Uhr Zimmerservice, Reinigung und Rezeption.' },
  'landing.adv.4.title': { uz: 'Tezkor bepul Wi-Fi', ru: 'Быстрый бесплатный Wi-Fi', en: 'High-Speed Free Wi-Fi', fr: 'Wi-Fi haut débit gratuit', de: 'Schnelles kostenloses WLAN' },
  'landing.adv.4.desc': { uz: 'Barcha xonalar va mehmonxona hududida cheksiz yuqori tezlikdagi internet.', ru: 'Безлимитный скоростной интернет на всей территории отеля.', en: 'Unlimited high-speed internet throughout all rooms and hotel premises.', fr: 'Internet haut débit illimité dans toutes les chambres et espaces communs.', de: 'Unbegrenztes Highspeed-Internet in allen Zimmern und Hotelbereichen.' },
  'landing.adv.5.title': { uz: 'Restoran & Lounge', ru: 'Ресторан и лаунж', en: 'Restaurant & Lounge', fr: 'Restaurant & Lounge', de: 'Restaurant & Lounge' },
  'landing.adv.5.desc': { uz: 'Sharq va Yevropa oshxonasining sara milliy taomlari tajribali oshpazlarimizdan.', ru: 'Лучшие блюда восточной и европейской кухни от шеф-поваров.', en: 'Exquisite national and European dishes crafted by experienced chefs.', fr: 'Plats raffinés de cuisines orientale et européenne concoctés par nos chefs.', de: 'Feinste orientalische und europäische Spezialitäten von Meisterköchen.' },
  'landing.adv.6.title': { uz: 'Bepul avtoturargoh & Transfer', ru: 'Бесплатная парковка и трансфер', en: 'Free Parking & Transfer', fr: 'Parking gratuit & Transfert', de: 'Kostenlose Parkplätze & Transfer' },
  'landing.adv.6.desc': { uz: 'Xavfsiz avtoturargoh hamda aeroportdan qulay transfer xizmatlari.', ru: 'Охраняемая парковка и комфортный трансфер из аэропорта.', en: 'Secure parking and comfortable airport transfer services.', fr: 'Parking sécurisé et service de transfert aéroport confortable.', de: 'Sicherer Parkplatz und bequemer Flughafentransfer.' },
  'landing.reviews.title': { uz: 'Mehmonlarimiz biz haqimizda nima deyishadi?', ru: 'Что говорят о нас наши гости?', en: 'What Our Guests Say About Us', fr: 'Ce que disent nos clients', de: 'Was unsere Gäste sagen' },
  'landing.reviews.subtitle': { uz: '15 000 dan ortiq mamnun mijozlarimizning samimiy baholari.', ru: 'Искренние отзывы более 15 000 довольных гостей.', en: 'Sincere feedback from more than 15,000 delighted guests.', fr: 'Avis sincères de plus de 15 000 clients satisfaits.', de: 'Ehrliche Bewertungen von über 15.000 zufriedenen Gästen.' },
  'landing.cta.title': { uz: 'Unutilmas dam olish lahzalarini hoziroq rejalashtiring!', ru: 'Запланируйте незабываемый отдых прямо сейчас!', en: 'Plan your unforgettable getaway right now!', fr: 'Planifiez votre séjour inoubliable dès maintenant !', de: 'Planen Sie Ihren unvergesslichen Urlaub noch heute!' },
  'landing.cta.subtitle': { uz: 'Onlayn xona band qiling va kafolatlangan qulay narxlar hamda bepul qo‘shimcha xizmatlardan bahramand bo‘ling.', ru: 'Забронируйте номер онлайн и воспользуйтесь гарантированно лучшими ценами и бесплатными услугами.', en: 'Book a room online to take advantage of guaranteed best rates and complimentary perks.', fr: 'Réservez en ligne pour bénéficier des meilleurs tarifs garantis et de services offerts.', de: 'Buchen Sie online und sichern Sie sich die besten Preise sowie kostenlose Zusatzleistungen.' },
  'landing.cta.btn': { uz: 'Xonani tanlash & Band qilish', ru: 'Выбрать номер и забронировать', en: 'Select Room & Book', fr: 'Choisir une chambre & Réserver', de: 'Zimmer wählen & Buchen' },
  'landing.footer.about': { uz: 'Qarshi markazidagi zamonaviy premium mehmonxona. Haqiqiy mehmondo‘stlik va 5 yulduzli qulaylik maskani.', ru: 'Современный премиум-отель в центре Карши. Настоящее гостеприимство и пятизвездочный комфорт.', en: 'Modern premium hotel in central Karshi. True hospitality and 5-star comfort.', fr: 'Hôtel haut de gamme au centre de Karchi. Hospitalité chaleureuse et confort 5 étoiles.', de: 'Modernes Premium-Hotel im Zentrum von Karschi. Echte Gastfreundschaft und 5-Sterne-Komfort.' },
  'landing.footer.quickLinks': { uz: 'Tezkor havolalar', ru: 'Быстрые ссылки', en: 'Quick Links', fr: 'Liens rapides', de: 'Schnelllinks' },
  'landing.footer.management': { uz: 'Tizim boshqaruvi', ru: 'Управление отелем', en: 'Hotel Management', fr: 'Gestion de l’hôtel', de: 'Hotelverwaltung' },
  'landing.footer.managementDesc': { uz: 'Mehmonxona xodimlari va administratorlar uchun boshqaruv paneliga kirish.', ru: 'Вход в панель управления для персонала и администрации.', en: 'Access to the control panel for staff and management.', fr: 'Accès au tableau de bord pour le personnel et les administrateurs.', de: 'Zugang zum Administrations-Panel für Personal und Verwaltung.' },
  'landing.footer.managementBtn': { uz: 'Boshqaruv tizimiga kirish', ru: 'Перейти в систему', en: 'Open Admin System', fr: 'Accéder au système', de: 'Zum Verwaltungssystem' },
  'landing.footer.privacy': { uz: 'Maxfiylik siyosati', ru: 'Политика конфиденциальности', en: 'Privacy Policy', fr: 'Politique de confidentialité', de: 'Datenschutz' },
  'landing.footer.terms': { uz: 'Foydalanish shartlari', ru: 'Условия использования', en: 'Terms of Service', fr: 'Conditions d’utilisation', de: 'Nutzungsbedingungen' },
  'landing.modal.bookTitle': { uz: 'Xona band qilish', ru: 'Бронирование номера', en: 'Book a Room', fr: 'Réserver une chambre', de: 'Zimmer buchen' },
  'landing.modal.success': { uz: 'Bron muvaffaqiyatli qabul qilindi!', ru: 'Бронь успешно оформлена!', en: 'Booking successfully placed!', fr: 'Réservation validée avec succès !', de: 'Buchung erfolgreich eingegangen!' },
  'landing.modal.successMsg': { uz: 'Rahmat! Qabulxona xodimimiz tez orada raqamingizga qo‘ng‘iroq qilib, buyurtmani tasdiqlaydi.', ru: 'Спасибо! Наш сотрудник свяжется с вами для подтверждения заказа.', en: 'Thank you! Our receptionist will call you shortly to confirm your reservation.', fr: 'Merci ! Notre réception vous contactera très vite pour confirmer la réservation.', de: 'Vielen Dank! Unser Team wird Sie in Kürze zur Bestätigung kontaktieren.' },
  'landing.modal.name': { uz: 'Ism va familiyangiz', ru: 'Ваше имя и фамилия', en: 'Full name', fr: 'Nom et prénom', de: 'Vollständiger Name' },
  'landing.modal.phone': { uz: 'Telefon raqamingiz', ru: 'Номер телефона', en: 'Phone number', fr: 'Numéro de téléphone', de: 'Telefonnummer' },
  'landing.modal.confirm': { uz: 'Buyurtmani tasdiqlash', ru: 'Подтвердить бронь', en: 'Confirm Reservation', fr: 'Confirmer la réservation', de: 'Buchung bestätigen' },
  'landing.modal.alreadyBooked': { uz: 'Bu xona allaqachon band qilingan. Boshqa xona tanlang.', ru: 'Этот номер уже забронирован. Выберите другой номер.', en: 'This room is already booked. Please choose another one.', fr: 'Cette chambre est déjà occupée. Veuillez en choisir une autre.', de: 'Dieses Zimmer ist bereits gebucht. Bitte wählen Sie ein anderes.' },

  // Dashboard
  'dashboard.today': { uz: 'Bugun:', ru: 'Сегодня:', en: 'Today:', fr: 'Aujourd’hui :', de: 'Heute:' },
  'dashboard.newBooking': { uz: 'Yangi bron', ru: 'Новая бронь', en: 'New booking', fr: 'Nouvelle réservation', de: 'Neue Buchung' },
  'dashboard.newGuest': { uz: 'Yangi mehmon', ru: 'Новый гость', en: 'New guest', fr: 'Nouvel invité', de: 'Neuer Gast' },
  'dashboard.totalRooms': { uz: 'Xonalar jami', ru: 'Всего номеров', en: 'Total Rooms', fr: 'Total chambres', de: 'Zimmer gesamt' },
  'dashboard.roomsCount': { uz: 'ta', ru: 'шт.', en: 'rooms', fr: 'ch.', de: 'Zi.' },
  'dashboard.todayInOut': { uz: 'Bugungi kirish/chiqish', ru: 'Заезды / выезды сегодня', en: 'Today\'s Check-in / out', fr: 'Arrivées / départs du jour', de: 'Heutige An- / Abreisen' },
  'dashboard.checkIn': { uz: 'Kirish', ru: 'Заезд', en: 'Check-in', fr: 'Arrivée', de: 'Check-in' },
  'dashboard.checkOut': { uz: 'Chiqish', ru: 'Выезд', en: 'Check-out', fr: 'Départ', de: 'Check-out' },
  'dashboard.totalIncome': { uz: 'Kirim yig‘indisi', ru: 'Сумма доходов', en: 'Total Income', fr: 'Revenus totaux', de: 'Gesamteinnahmen' },
  'dashboard.totalExpense': { uz: 'Chiqim yig‘indisi', ru: 'Сумма расходов', en: 'Total Expenses', fr: 'Dépenses totales', de: 'Gesamtausgaben' },
  'dashboard.allRevenue': { uz: 'Jami tushumlar', ru: 'Все поступления', en: 'All revenues', fr: 'Recettes globales', de: 'Alle Einnahmen' },
  'dashboard.allExpenses': { uz: 'Jami xarajatlar', ru: 'Все затраты', en: 'All expenses', fr: 'Dépenses globales', de: 'Alle Ausgaben' },
  'dashboard.monitoring': { uz: 'Xonalar holati monitoringi', ru: 'Мониторинг состояния номеров', en: 'Room Status Monitoring', fr: 'Suivi de l’état des chambres', de: 'Zimmerstatus-Überwachung' },
  'dashboard.currentOccupancy': { uz: 'Hozirgi bandlik darajasi:', ru: 'Текущий уровень загрузки:', en: 'Current occupancy rate:', fr: 'Taux d’occupation actuel :', de: 'Aktuelle Auslastung:' },
  'dashboard.viewAllRooms': { uz: 'Barcha xonalarni ko‘rish →', ru: 'Все номера →', en: 'View all rooms →', fr: 'Voir toutes les chambres →', de: 'Alle Zimmer anzeigen →' },
  'dashboard.recentBookings': { uz: 'So‘nggi bronlar va mehmonlar', ru: 'Последние бронирования и гости', en: 'Recent Bookings & Guests', fr: 'Dernières réservations et invités', de: 'Neueste Buchungen & Gäste' },
  'dashboard.recentSub': { uz: 'Mehmonxonadagi so‘nggi harakatlar', ru: 'Последняя активность в отеле', en: 'Latest activity in the hotel', fr: 'Dernières activités dans l’hôtel', de: 'Neueste Hotel-Aktivitäten' },
  'dashboard.viewAll': { uz: 'Barchasini ko‘rish →', ru: 'Посмотреть все →', en: 'View all →', fr: 'Voir tout →', de: 'Alle anzeigen →' },
  'dashboard.guest': { uz: 'Mehmon', ru: 'Гость', en: 'Guest', fr: 'Invité', de: 'Gast' },
  'dashboard.room': { uz: 'Xona', ru: 'Номер', en: 'Room', fr: 'Chambre', de: 'Zimmer' },
  'dashboard.duration': { uz: 'Muddat', ru: 'Период', en: 'Period', fr: 'Période', de: 'Zeitraum' },
  'dashboard.confirmCheckIn': { uz: 'Mehmonni ro‘yxatga olish (Check-in) va xonani Band qilishni tasdiqlaysizmi?', ru: 'Подтверждаете заселение гостя и занятость номера?', en: 'Confirm guest check-in and mark room as occupied?', fr: 'Confirmer l’arrivée du client et occuper la chambre ?', de: 'Check-in des Gastes bestätigen und Zimmer belegen?' },
  'dashboard.confirmCheckOut': { uz: 'Mehmonni chiqarish (Check-out) va xonani tozalashga o‘tkazishni tasdiqlaysizmi?', ru: 'Подтверждаете выезд гостя и отправку номера на уборку?', en: 'Confirm guest check-out and send room to cleaning?', fr: 'Confirmer le départ du client et nettoyer la chambre ?', de: 'Check-out des Gastes bestätigen und Zimmer reinigen?' },

  // Rooms Page
  'rooms.total': { uz: 'Jami {n} ta xona', ru: 'Всего {n} номеров', en: 'Total {n} rooms', fr: '{n} chambres au total', de: 'Insgesamt {n} Zimmer' },
  'rooms.new': { uz: 'Yangi xona qo‘shish', ru: 'Добавить номер', en: 'Add New Room', fr: 'Ajouter une chambre', de: 'Zimmer hinzufügen' },
  'rooms.searchPlaceholder': { uz: 'Xona raqami yoki turi...', ru: 'Номер или тип комнаты...', en: 'Room number or type...', fr: 'Numéro ou type de chambre...', de: 'Zimmernummer oder Typ...' },
  'rooms.notFound': { uz: 'Xona topilmadi', ru: 'Номера не найдены', en: 'No rooms found', fr: 'Aucune chambre trouvée', de: 'Keine Zimmer gefunden' },
  'rooms.notFoundDesc': { uz: 'Qidiruv yoki filtr mezonlarini o‘zgartiring', ru: 'Измените параметры поиска или фильтра', en: 'Try changing search or filter parameters', fr: 'Modifiez vos critères de recherche ou de filtre', de: 'Such- oder Filterkriterien anpassen' },
  'rooms.number': { uz: 'Xona raqami', ru: 'Номер комнаты', en: 'Room Number', fr: 'Numéro de chambre', de: 'Zimmernummer' },
  'rooms.type': { uz: 'Xona turi', ru: 'Тип номера', en: 'Room Type', fr: 'Type de chambre', de: 'Zimmertyp' },
  'rooms.price': { uz: 'Bir kecha narxi (so‘m)', ru: 'Цена за сутки (сум)', en: 'Price per night (UZS)', fr: 'Prix par nuit (UZS)', de: 'Preis pro Nacht (UZS)' },
  'rooms.capacity': { uz: 'Sig‘imi (masalan: 2 kishilik)', ru: 'Вместимость (напр. 2 чел.)', en: 'Capacity (e.g. 2 guests)', fr: 'Capacité (ex. 2 pers.)', de: 'Kapazität (z.B. 2 Pers.)' },
  'rooms.floor': { uz: 'Qavat', ru: 'Этаж', en: 'Floor', fr: 'Étage', de: 'Etage' },
  'rooms.deleteConfirm': { uz: 'Haqiqatan ham bu xonani o‘chirmoqchimisiz?', ru: 'Вы уверены, что хотите удалить этот номер?', en: 'Are you sure you want to delete this room?', fr: 'Voulez-vous vraiment supprimer cette chambre ?', de: 'Möchten Sie dieses Zimmer wirklich löschen?' },
  'rooms.detailsTitle': { uz: 'Xona ma’lumotlari', ru: 'Детали номера', en: 'Room Details', fr: 'Détails de la chambre', de: 'Zimmerdetails' },

  // Bookings Page
  'bookings.total': { uz: 'Jami {n} ta bron', ru: 'Всего {n} бронирований', en: 'Total {n} bookings', fr: '{n} réservations au total', de: 'Insgesamt {n} Buchungen' },
  'bookings.new': { uz: 'Yangi bron qo‘shish', ru: 'Новое бронирование', en: 'Add Booking', fr: 'Ajouter une réservation', de: 'Buchung hinzufügen' },
  'bookings.searchPlaceholder': { uz: 'Bronlar bo‘yicha qidirish...', ru: 'Поиск по бронированиям...', en: 'Search bookings...', fr: 'Rechercher des réservations...', de: 'Buchungen durchsuchen...' },
  'bookings.id': { uz: 'ID', ru: 'ID', en: 'ID', fr: 'ID', de: 'ID' },
  'bookings.nights': { uz: 'Kun', ru: 'Суток', en: 'Nights', fr: 'Nuits', de: 'Nächte' },
  'bookings.totalSum': { uz: 'Umumiy summa', ru: 'Общая сумма', en: 'Total Price', fr: 'Montant total', de: 'Gesamtpreis' },
  'bookings.selectGuest': { uz: 'Mehmonni tanlang', ru: 'Выберите гостя', en: 'Select Guest', fr: 'Sélectionner l’invité', de: 'Gast auswählen' },
  'bookings.selectRoom': { uz: 'Xonani tanlang', ru: 'Выберите номер', en: 'Select Room', fr: 'Sélectionner la chambre', de: 'Zimmer auswählen' },
  'bookings.checkIn': { uz: 'Kirish sanasi', ru: 'Дата заезда', en: 'Check-in date', fr: 'Date d’arrivée', de: 'Anreisedatum' },
  'bookings.checkOut': { uz: 'Chiqish sanasi', ru: 'Дата выезда', en: 'Check-out date', fr: 'Date de départ', de: 'Abreisedatum' },
  'bookings.customPrice': { uz: 'Maxsus narx (ixtiyoriy, so‘m)', ru: 'Спеццена (необязательно, сум)', en: 'Custom price (optional, UZS)', fr: 'Prix personnalisé (facultatif, UZS)', de: 'Sonderpreis (optional, UZS)' },
  'bookings.deleteConfirm': { uz: 'Haqiqatan ham bu bronni o‘chirmoqchimisiz?', ru: 'Вы уверены, что хотите удалить эту бронь?', en: 'Are you sure you want to delete this booking?', fr: 'Voulez-vous vraiment supprimer cette réservation ?', de: 'Möchten Sie diese Buchung wirklich löschen?' },
  'bookings.detailsTitle': { uz: 'Bron ma’lumotlari', ru: 'Информация о бронировании', en: 'Booking Details', fr: 'Détails de la réservation', de: 'Buchungsdetails' },

  // Guests Page
  'guests.total': { uz: 'Jami {n} ta mehmon ro‘yxatda', ru: 'Всего {n} гостей в списке', en: 'Total {n} guests in directory', fr: '{n} invités enregistrés', de: 'Insgesamt {n} Gäste registriert' },
  'guests.new': { uz: 'Yangi mehmon qo‘shish', ru: 'Добавить гостя', en: 'Add New Guest', fr: 'Ajouter un invité', de: 'Neuen Gast anlegen' },
  'guests.searchPlaceholder': { uz: 'Ism, telefon, passport yoki izoh bo‘yicha...', ru: 'По имени, телефону, паспорту или заметкам...', en: 'Search by name, phone, passport, or notes...', fr: 'Recherche par nom, téléphone, passeport ou note...', de: 'Suche nach Name, Telefon, Pass oder Notiz...' },
  'guests.name': { uz: 'F.I.O (Ism-Familiya)', ru: 'Ф.И.О.', en: 'Full Name', fr: 'Nom & Prénom', de: 'Vollständiger Name' },
  'guests.passport': { uz: 'Passport', ru: 'Паспорт', en: 'Passport', fr: 'Passeport', de: 'Reisepass' },
  'guests.deleteConfirm': { uz: 'Haqiqatan ham bu mehmonni o‘chirmoqchimisiz?', ru: 'Вы уверены, что хотите удалить этого гостя?', en: 'Are you sure you want to delete this guest?', fr: 'Voulez-vous vraiment supprimer cet invité ?', de: 'Möchten Sie diesen Gast wirklich löschen?' },
  'guests.detailsTitle': { uz: 'Mehmon ma’lumotlari', ru: 'Карточка гостя', en: 'Guest Profile', fr: 'Profil de l’invité', de: 'Gästeprofil' },

  // Finance Page
  'finance.subtitle': { uz: 'Mehmonxonaning to‘liq moliyaviy hisob-kitoblari va kassa amallari', ru: 'Полный финансовый учет и кассовые операции отеля', en: 'Complete hotel financial records and cashflow operations', fr: 'Comptabilité financière et flux de trésorerie de l’hôtel', de: 'Vollständige Hotel-Finanzbuchhaltung und Kassenbewegungen' },
  'finance.addIncome': { uz: '+ Kirim qo‘shish', ru: '+ Добавить доход', en: '+ Add Income', fr: '+ Ajouter revenu', de: '+ Einnahme buchen' },
  'finance.addExpense': { uz: '- Chiqim qo‘shish', ru: '- Добавить расход', en: '- Add Expense', fr: '- Ajouter dépense', de: '- Ausgabe buchen' },
  'finance.incomeTotal': { uz: 'Jami daromad (Kirim)', ru: 'Общий доход (Приход)', en: 'Total Revenue (Income)', fr: 'Revenu total (Entrées)', de: 'Gesamterlös (Einnahmen)' },
  'finance.expenseTotal': { uz: 'Jami xarajat (Chiqim)', ru: 'Общие расходы (Расход)', en: 'Total Costs (Expense)', fr: 'Charges totales (Dépenses)', de: 'Gesamtkosten (Ausgaben)' },
  'finance.netProfit': { uz: 'Sof foyda', ru: 'Чистая прибыль', en: 'Net Profit', fr: 'Bénéfice net', de: 'Nettogewinn' },
  'finance.tabAll': { uz: 'Barcha amallar', ru: 'Все операции', en: 'All transactions', fr: 'Toutes les opérations', de: 'Alle Transaktionen' },
  'finance.tabIncome': { uz: 'Faqat kirimlar', ru: 'Только доходы', en: 'Income only', fr: 'Revenus uniquement', de: 'Nur Einnahmen' },
  'finance.tabExpense': { uz: 'Faqat chiqimlar', ru: 'Только расходы', en: 'Expenses only', fr: 'Dépenses uniquement', de: 'Nur Ausgaben' },
  'finance.deleteConfirm': { uz: 'Haqiqatan ham bu yozuvni o‘chirmoqchimisiz?', ru: 'Вы уверены, что хотите удалить эту запись?', en: 'Are you sure you want to delete this record?', fr: 'Voulez-vous vraiment supprimer cet enregistrement ?', de: 'Möchten Sie diese Buchung wirklich löschen?' },

  // Reports Page
  'reports.subtitle': { uz: 'Mehmonxonaning moliyaviy va operatsion tahlili', ru: 'Финансово-операционная аналитика отеля', en: 'Financial and operational analytics of the hotel', fr: 'Analytique financière et opérationnelle de l’hôtel', de: 'Finanz- und Betriebsanalytik des Hotels' },
  'reports.from': { uz: 'Boshlanish sanasi', ru: 'Дата начала', en: 'Start date', fr: 'Date de début', de: 'Startdatum' },
  'reports.to': { uz: 'Tugash sanasi', ru: 'Дата окончания', en: 'End date', fr: 'Date de fin', de: 'Enddatum' },
  'reports.export': { uz: 'CSV yuklab olish', ru: 'Экспорт в CSV', en: 'Export CSV', fr: 'Exporter CSV', de: 'CSV exportieren' },
  'reports.periodIncome': { uz: 'Davr bo‘yicha kirim', ru: 'Доход за период', en: 'Period Income', fr: 'Revenu de la période', de: 'Perioden-Einnahmen' },
  'reports.periodExpense': { uz: 'Davr bo‘yicha chiqim', ru: 'Расход за период', en: 'Period Expenses', fr: 'Dépenses de la période', de: 'Perioden-Ausgaben' },
  'reports.periodNet': { uz: 'Davr bo‘yicha sof foyda', ru: 'Чистая прибыль за период', en: 'Period Net Profit', fr: 'Bénéfice net de la période', de: 'Perioden-Reingewinn' },
  'reports.occupancy': { uz: 'O‘rtacha bandlik', ru: 'Средняя загрузка', en: 'Average Occupancy', fr: 'Taux d’occupation moyen', de: 'Durchschnittliche Belegung' },
  'reports.incomeBreakdown': { uz: 'Kirimlar tarkibi (Kategoriyalar bo‘yicha)', ru: 'Структура доходов по категориям', en: 'Income Breakdown by Category', fr: 'Répartition des revenus par catégorie', de: 'Einnahmenaufteilung nach Kategorie' },
  'reports.expenseBreakdown': { uz: 'Chiqimlar tarkibi (Kategoriyalar bo‘yicha)', ru: 'Структура расходов по категориям', en: 'Expense Breakdown by Category', fr: 'Répartition des dépenses par catégorie', de: 'Ausgabenaufteilung nach Kategorie' },
  'reports.history': { uz: 'Davrdagi barcha moliyaviy operatsiyalar', ru: 'Все финансовые операции за период', en: 'All financial operations for the period', fr: 'Toutes les opérations de la période', de: 'Alle Finanztransaktionen im Zeitraum' },

  // Settings Page
  'settings.subtitle': { uz: 'Mehmonxona va foydalanuvchi ma\'lumotlarini boshqarish', ru: 'Управление параметрами отеля и учетной записью', en: 'Manage hotel configuration and account credentials', fr: 'Gérer la configuration de l’hôtel et les informations de compte', de: 'Hotelkonfiguration und Kontodaten verwalten' },
  'settings.hotelInfo': { uz: 'Hotel Ma\'lumotlari', ru: 'Информация об отеле', en: 'Hotel Information', fr: 'Informations sur l’hôtel', de: 'Hotel-Informationen' },
  'settings.hotelSub': { uz: 'Asosiy mehmonxona konfiguratsiyasi', ru: 'Основные настройки отеля', en: 'Core hotel profile & contact details', fr: 'Profil principal de l’hôtel et contacts', de: 'Hauptkonfiguration des Hotels' },
  'settings.hotelName': { uz: 'Mehmonxona nomi', ru: 'Название отеля', en: 'Hotel Name', fr: 'Nom de l’hôtel', de: 'Hotelname' },
  'settings.address': { uz: 'Manzil', ru: 'Адрес', en: 'Address', fr: 'Adresse', de: 'Adresse' },
  'settings.phone': { uz: 'Telefon', ru: 'Телефон', en: 'Phone', fr: 'Téléphone', de: 'Telefon' },
  'settings.email': { uz: 'Email', ru: 'Электронная почта', en: 'Email', fr: 'E-mail', de: 'E-Mail' },
  'settings.userInfo': { uz: 'Foydalanuvchi Ma\'lumotlari', ru: 'Данные пользователя', en: 'User Account', fr: 'Compte utilisateur', de: 'Benutzerkonto' },
  'settings.userSub': { uz: 'Shaxsiy ma\'lumotlar va parol', ru: 'Персональные данные и безопасность', en: 'Personal profile and password security', fr: 'Profil personnel et sécurité du mot de passe', de: 'Persönliche Angaben und Passwort' },
  'settings.fullName': { uz: 'To\'liq ism', ru: 'Полное имя', en: 'Full Name', fr: 'Nom complet', de: 'Vollständiger Name' },
  'settings.currentPassword': { uz: 'Joriy parol', ru: 'Текущий пароль', en: 'Current Password', fr: 'Mot de passe actuel', de: 'Aktuelles Passwort' },
  'settings.newPassword': { uz: 'Yangi parol', ru: 'Новый пароль', en: 'New Password', fr: 'Nouveau mot de passe', de: 'Neues Passwort' },
  'settings.passwordHint': { uz: 'Kamida 8 ta belgi, raqam va harf', ru: 'Минимум 8 знаков, буквы и цифры', en: 'At least 8 characters, letters and numbers', fr: 'Au moins 8 caractères, lettres et chiffres', de: 'Mindestens 8 Zeichen, Buchstaben und Ziffern' },
  'settings.role': { uz: 'Lavozim', ru: 'Роль', en: 'Role', fr: 'Rôle', de: 'Rolle' },
};

export function translateStatus(status: string, locale: LanguageCode): string {
  const map: Record<string, string> = {
    "Bo'sh": 'status.vacant',
    'Bo‘sh': 'status.vacant',
    Band: 'status.occupied',
    Tozalashda: 'status.cleaning',
    "Ta'mirda": 'status.maintenance',
    "Ta’mirda": 'status.maintenance',
    Kutilmoqda: 'status.pending',
    Tasdiqlangan: 'status.confirmed',
    Yashamoqda: 'status.living',
    Tugatilgan: 'status.completed',
    Bekor: 'status.cancelled',
    'Bekor qilingan': 'status.cancelled',
    income: 'status.income',
    expense: 'status.expense',
    Kirim: 'status.income',
    Chiqim: 'status.expense',
    Barchasi: 'status.all',
  };

  const key = map[status];
  if (key && translations[key]?.[locale]) {
    return translations[key][locale];
  }
  return status;
}

export function translateRoomType(type: string, locale: LanguageCode): string {
  const map: Record<string, string> = {
    Standart: 'roomType.standart',
    standart: 'roomType.standart',
    Deluxe: 'roomType.deluxe',
    deluxe: 'roomType.deluxe',
    Suite: 'roomType.suite',
    suite: 'roomType.suite',
    President: 'roomType.president',
    president: 'roomType.president',
    Prezident: 'roomType.president',
  };

  const key = map[type];
  if (key && translations[key]?.[locale]) {
    return translations[key][locale];
  }
  return type;
}

export function translateCategory(category: string, locale: LanguageCode): string {
  const map: Record<string, string> = {
    'Xona haqi': 'category.roomFee',
    Ovqatlanish: 'category.dining',
    'Qo‘shimcha xizmatlar': 'category.services',
    Ijara: 'category.rent',
    'Boshqa kirim': 'category.otherIncome',
    'Ish haqi': 'category.salary',
    'Kommunal to‘lovlar': 'category.utilities',
    'Material/xaridlar': 'category.materials',
    'Ta’mirlash': 'category.repairs',
    'Ta\'mirlash': 'category.repairs',
    'Boshqa chiqim': 'category.otherExpense',
  };

  const key = map[category];
  if (key && translations[key]?.[locale]) {
    return translations[key][locale];
  }
  return category;
}

interface LanguageContextType {
  locale: LanguageCode;
  setLocale: (value: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  translateStatus: (status: string) => string;
  translateRoomType: (type: string) => string;
  translateCategory: (category: string) => string;
  languages: typeof LANGUAGES;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getInitialLocale(): LanguageCode {
  if (typeof window === 'undefined') return 'uz';

  const saved = window.localStorage.getItem('origin-hotel-language');
  if (saved && LANGUAGES.some((language) => language.code === saved)) {
    return saved as LanguageCode;
  }

  return 'uz';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<LanguageCode>(getInitialLocale);

  useEffect(() => {
    window.localStorage.setItem('origin-hotel-language', locale);
    document.documentElement.lang = locale;

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'origin-hotel-language' && e.newValue) {
        if (LANGUAGES.some((l) => l.code === e.newValue)) {
          setLocale(e.newValue as LanguageCode);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      languages: LANGUAGES,
      t: (key: string, fallback?: string) => {
        const item = translations[key];
        if (item && item[locale]) {
          return item[locale];
        }
        return fallback !== undefined ? fallback : key;
      },
      translateStatus: (status: string) => translateStatus(status, locale),
      translateRoomType: (type: string) => translateRoomType(type, locale),
      translateCategory: (category: string) => translateCategory(category, locale),
    }),
    [locale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useTranslation() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useTranslation must be used inside LanguageProvider');
  }

  return context;
}
