# Contact & Booking System + Admin Portfolio Management

## What we're building

**1. Public `/contact` page** — a 3-step booking flow:
- **Step 1 — Service picker**: Choose service (GFX / VFX / Custom), category, add-ons, urgency. A live **estimated price range** updates as they configure.
- **Step 2 — Calendar**: Pick an available day from a calendar. Unavailable/blocked days are greyed out. Each day shows remaining slots.
- **Step 3 — Chat channel**:
  - **Website** → creates a temporary "hold" booking (`status: pending`, tied to that calendar day) and opens an in-site chat thread with a short **ticket code** (e.g. `TCK-4F2A`).
  - **Discord** → shows the same ticket code + the Discord invite, and instructs them to paste the code in Discord. No booking row is created until they claim it there (webhook fires on selection so owner knows to expect them).

**2. Admin — Calendar management** (new tab in `/dashboard`)
- Month view of the calendar with all bookings.
- Click a day to: block/unblock it, set max slots per day, add notes, view/edit/delete bookings on that day.
- Bulk-block weekends or custom date ranges.

**3. Admin — GFX & VFX management** (new tabs in `/dashboard`)
- Add / edit / delete portfolio pieces from the admin panel (previously hardcoded in `src/config/gfxData.ts` and `galleryData.ts`).
- Fields per piece: title, category (GFX/VFX), main image/video URL, thumbnail, description, attributes (font, palette, mood, format), featured flag, order.
- Public `/gfx` and `/portfolio` pages read from the database instead of static config.

## Technical details

### Database (new tables)

- **`bookings`** — `id, ticket_code (unique), user_id?, customer_name, customer_email, discord_handle?, service, category, addons (jsonb), estimated_price_min, estimated_price_max, booking_date (date), channel ('website'|'discord'), status ('pending'|'confirmed'|'discord_claimed'|'cancelled'|'completed'), notes, created_at`
- **`booking_messages`** — chat thread for website-channel bookings (mirrors `order_messages` shape).
- **`calendar_days`** — `date (pk), max_slots (default 3), is_blocked (bool), note`. A day without a row = default availability.
- **`portfolio_items`** — `id, kind ('gfx'|'vfx'), title, slug, description, cover_url, media_url, attributes (jsonb: {font, palette[], mood, format, ...}), featured, sort_order, created_at`.

### RLS
- `bookings`: anon can INSERT (create pending booking); owner (matched by `ticket_code` in localStorage or `user_id`) can read own; admins read/write all.
- `booking_messages`: same pattern as `order_messages`.
- `calendar_days`: public SELECT; admin write.
- `portfolio_items`: public SELECT; admin write.

### Edge functions
- `create-booking` — validates input, generates `ticket_code`, inserts row, fires Discord webhook ("📅 New booking").
- Reuse `discord-activity` webhook for booking events.

### Frontend
- `src/pages/Contact.tsx` — 3-step flow using shadcn `Calendar`, existing motion/glow styling.
- `src/lib/priceEstimator.ts` — reuse/extend `PriceEstimator` logic for the estimate.
- `src/components/admin/AdminCalendar.tsx` — month grid + day drawer.
- `src/components/admin/AdminPortfolio.tsx` — CRUD table for GFX/VFX (single component, `kind` filter).
- Update `AdminDashboard.tsx` to add **Calendar** and **Portfolio** tabs.
- `src/pages/GfxPortfolio.tsx` and `src/pages/Portfolio.tsx` — swap static imports for a Supabase query.

### Nav
- Add "Book" (or "Contact") link to `Navigation.tsx`.

## Questions before I build

1. **Default daily slot count** for the calendar — 3 bookings/day okay, or different?
2. **Discord ticket flow** — should selecting Discord *also* create a `pending` booking (so it shows in your admin queue), or truly create nothing until you claim it in Discord?
3. **GFX/VFX media** — you want URL fields only (paste image/video links), or should I add a Supabase Storage bucket + uploader in the admin panel?
