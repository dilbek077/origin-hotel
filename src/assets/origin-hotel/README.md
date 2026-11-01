# Origin Hotel photo collection

The supplied `rasm.rar` contained 26 JPEG files: 24 distinct source photographs
and two byte-identical duplicates. `19.jpg` duplicates `17.jpg`; `20.jpg`
duplicates `18.jpg`. Only the 24 distinct sources were processed.

Each source was restored separately with the image tool, preserving its portrait
frame and camera view, improving clarity/exposure and removing the timestamp.
The enhanced result is resampled to 2160 × 3840 and stored as WebP in `collection`.
These are enhanced derivatives of 720 × 1280 originals, not native camera 4K;
fine details can differ after AI restoration.

`collection/manifest.json` records each original filename, source/output SHA-256,
dimensions and its exclusive content placement. `src/data/hotelPhotos.ts` is the
shared registry. All 24 source hashes and all 24 output hashes are distinct.

Room cards, event cards, the dining intro and cards, experience slides, login,
service information and mobile service offers each have distinct photo slots.
Responsive versions of the same room represent the same content. A room/event
can show its own photo again when opened in detail; other cards never reuse it.
Room detail thumbnails exclude the currently displayed photo, and supplementary
views are assigned to only one room. The three Qarshi hero photos are unchanged.

The previous five-photo shared collection and external stock-photo URLs are no
longer used. Existing demo prices and room/service descriptions are unchanged;
photo restoration does not verify those business details or room categories.
