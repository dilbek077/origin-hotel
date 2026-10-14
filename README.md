# Zarafshon Grand Hotel — React + TypeScript sayt

Mehmonxona uchun zamonaviy bir sahifali sayt (Vite + React + TSX).

## Ishga tushirish

```bash
npm install
npm run dev      # development server
npm run build    # production build (dist/ papkasiga)
npm run preview  # build natijasini ko'rish
```

Node.js 18 yoki undan yangisi kerak.

## Tuzilma

```
src/
  main.tsx           # kirish nuqtasi
  App.tsx            # sahifa bo'limlarini birlashtiradi
  data.ts            # xonalar, qulayliklar, galereya, sharhlar
  styles.css         # barcha uslublar
  components/
    Header, Hero, About, Rooms, Amenities,
    Gallery, Booking, Reviews, Contact, Footer
```

## Moslashtirish

- Mehmonxona nomi: `index.html`, `Header.tsx`, `Footer.tsx`
- Xonalar va narxlar: `src/data.ts`
- Telefon, manzil, email: `src/components/Contact.tsx`
- Ranglar: `src/styles.css` boshidagi `:root` o'zgaruvchilari
- Band qilish formasi hozircha serverga ulanmagan: `Booking.tsx` ichidagi `onSubmit` da so'rovni o'z API'ngizga yuborishingiz mumkin.
- Rasmlar Unsplash'dan olingan, o'zingizning rasmlaringizga almashtiring.
# origin-hotel
