import photo01 from '@/assets/origin-hotel/collection/photo-01-4k.webp';
import photo02 from '@/assets/origin-hotel/collection/photo-02-4k.webp';
import photo03 from '@/assets/origin-hotel/collection/photo-03-4k.webp';
import photo04 from '@/assets/origin-hotel/collection/photo-04-4k.webp';
import photo05 from '@/assets/origin-hotel/collection/photo-05-4k.webp';
import photo06 from '@/assets/origin-hotel/collection/photo-06-4k.webp';
import photo07 from '@/assets/origin-hotel/collection/photo-07-4k.webp';
import photo08 from '@/assets/origin-hotel/collection/photo-08-4k.webp';
import photo09 from '@/assets/origin-hotel/collection/photo-09-4k.webp';
import photo10 from '@/assets/origin-hotel/collection/photo-10-4k.webp';
import photo11 from '@/assets/origin-hotel/collection/photo-11-4k.webp';
import photo12 from '@/assets/origin-hotel/collection/photo-12-4k.webp';
import photo13 from '@/assets/origin-hotel/collection/photo-13-4k.webp';
import photo14 from '@/assets/origin-hotel/collection/photo-14-4k.webp';
import photo15 from '@/assets/origin-hotel/collection/photo-15-4k.webp';
import photo16 from '@/assets/origin-hotel/collection/photo-16-4k.webp';
import photo17 from '@/assets/origin-hotel/collection/photo-17-4k.webp';
import photo18 from '@/assets/origin-hotel/collection/photo-18-4k.webp';
import photo21 from '@/assets/origin-hotel/collection/photo-21-4k.webp';
import photo22 from '@/assets/origin-hotel/collection/photo-22-4k.webp';
import photo23 from '@/assets/origin-hotel/collection/photo-23-4k.webp';
import photo24 from '@/assets/origin-hotel/collection/photo-24-4k.webp';
import photo26 from '@/assets/origin-hotel/collection/photo-26-4k.webp';
import photo27 from '@/assets/origin-hotel/collection/photo-27-4k.webp';

// One source photograph per content placement; responsive views share only
// the same room's content. Qarshi hero photographs are intentionally separate.
export const HOTEL_PHOTOS = {
  twinRoom: photo04,
  doubleRoom: photo01,
  singleRoom: photo03,
  presidentialRoom: photo27,
  roomSeating: photo02,
  exterior: photo07,
  loginExterior: photo06,
  eventRestaurant: photo12,
  eventRelax: photo21,
  eventFamily: photo26,
  diningMain: photo11,
  diningFirst: photo10,
  diningBreakfast: photo13,
  diningBuffet: photo14,
  galleryReception: photo16,
  galleryCorridor: photo18,
  poolInformation: photo08,
  spaInformation: photo24,
  fitnessInformation: photo22,
  mobilePool: photo09,
  mobileSpa: photo17,
  mobileFitness: photo23,
};

// Additional hotel views are exclusive to one room's detail gallery.
export const HOTEL_ROOM_DETAIL_PHOTOS: Record<string, string[]> = {
  Standart: [photo02],
  Deluxe: [photo15],
  Suite: [photo05],
  Presidential: [],
};

export const HOTEL_PHOTO_COLLECTION = [
  { id: '01', src: photo01, original: '1.jpg' },
  { id: '02', src: photo02, original: '2.jpg' },
  { id: '03', src: photo03, original: '3.jpg' },
  { id: '04', src: photo04, original: '4.jpg' },
  { id: '05', src: photo05, original: '5.jpg' },
  { id: '06', src: photo06, original: '6.jpg' },
  { id: '07', src: photo07, original: '7.jpg' },
  { id: '08', src: photo08, original: '8.jpg' },
  { id: '09', src: photo09, original: '9.jpg' },
  { id: '10', src: photo10, original: '10.jpg' },
  { id: '11', src: photo11, original: '11.jpg' },
  { id: '12', src: photo12, original: '12.jpg' },
  { id: '13', src: photo13, original: '13.jpg' },
  { id: '14', src: photo14, original: '14.jpg' },
  { id: '15', src: photo15, original: '15.jpg' },
  { id: '16', src: photo16, original: '16.jpg' },
  { id: '17', src: photo17, original: '17.jpg' },
  { id: '18', src: photo18, original: '18.jpg' },
  { id: '21', src: photo21, original: '21.jpg' },
  { id: '22', src: photo22, original: '22.jpg' },
  { id: '23', src: photo23, original: '23.jpg' },
  { id: '24', src: photo24, original: '24.jpg' },
  { id: '26', src: photo26, original: '26.jpg' },
  { id: '27', src: photo27, original: '27.jpg' },
];
