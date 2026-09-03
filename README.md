# Dynamic QR Code System

A tiny, self-hosted system for issuing dynamic QR codes: print one QR code per
client, and change where it points to at any time — without reprinting it.

**Cost to run: $0/month.** (Optional: ~$8–12/year for a custom domain so the
link looks trustworthy — not required to launch.)

---

## 1. One-time setup (about 20 minutes)

### a) Create a Supabase project (free database)
1. Go to supabase.com → New project (pick any name/region, free tier).
2. Once it's created, go to **SQL Editor** → New query.
3. Paste the contents of `schema.sql` (included in this project) and click Run.
4. Go to **Project Settings → API**. Copy the **Project URL** and the
   **service_role** secret key — you'll need both shortly.

### b) Push this code to GitHub
1. Create a new empty repo on GitHub.
2. From this folder: `git init`, `git add .`, `git commit -m "init"`,
   then push to your new repo (GitHub will show you the exact commands).

### c) Deploy to Vercel (free hosting)
1. Go to vercel.com → New Project → import your GitHub repo.
2. Before deploying, add these Environment Variables (Settings → Environment Variables):
   - `SUPABASE_URL` — from step (a)
   - `SUPABASE_SERVICE_KEY` — from step (a)
   - `ADMIN_PASSWORD` — make up a strong password, this locks your /admin page
   - `NEXT_PUBLIC_BASE_URL` — your vercel URL, e.g. `https://dynamic-qr-yourname.vercel.app`
     (you can update this later if you add a custom domain)
3. Click Deploy. Done — you now have a live redirect service.

### d) (Optional but recommended) Add a custom domain
A short, brandable domain makes clients trust it more (e.g. `scanmy.biz`
instead of a long vercel.app address).
1. Buy a cheap domain from Porkbun or Namecheap (~$8–12/year).
2. In Vercel: Project → Settings → Domains → add it, follow the DNS steps.
3. Update `NEXT_PUBLIC_BASE_URL` in Vercel's env vars to your new domain, redeploy.

### e) Set up your local `.env.local` (for running the generate script on your computer)
1. Copy `.env.example` to `.env.local`.
2. Fill in the same values you used in Vercel.
3. Run `npm install` once.

---

## 2. Creating a QR code for a new client

One command creates the database record **and** the printable PNG:

```
node scripts/generate-qr.js "Joe's Cafe" joes-cafe https://joescafe.com
```

- `"Joe's Cafe"` — the business name (just for your own records)
- `joes-cafe` — the unique slug (keep it short, lowercase, no spaces)
- `https://joescafe.com` — where the QR should currently point (optional —
  leave it off if you're selling the standee before you know the final link;
  scanning will show a friendly "coming soon" page until you set one)

This creates `output/joes-cafe.png` — a high-resolution QR code ready to drop
into your standee design (Canva, Illustrator, etc.).

---

## 3. Changing a client's destination later ("recoding")

Two ways, pick whichever you like:

**A. Admin dashboard (easiest, no terminal needed)**
Go to `https://yourdomain.com/admin`, enter your admin password, edit the
"Destination URL" field for that client, click Save. Takes effect instantly —
the printed QR code never changes.

**B. Command line**
Re-run the generate script's underlying update via the admin API, or just use
the dashboard — it's built for exactly this.

---

## 4. Suggested business model

- **Setup fee** per standee (covers design + printing + your QR service) —
  e.g. a flat one-time charge.
- **Optional small recurring fee** (monthly/yearly) if you offer ongoing
  "recoding" as a service — e.g. updating their link for seasonal promos,
  new menus, Instagram campaigns, etc. This is the recurring revenue angle:
  the QR stays printed forever, but you keep getting paid to repoint it.
- Track scans per client (`scan_count` column, visible in `/admin`) as a
  value-add you can show clients — "your standee got 340 scans this month."

---

## 5. Notes on security & scale

- The admin password is a single shared secret — fine for a solo operator,
  not meant for a team. If you bring on staff later, add per-user accounts.
- Supabase's free tier comfortably handles thousands of scans/month for this
  use case; you won't need to pay until you're running a real business on it.
- Back up your Supabase table occasionally (Table Editor → Export CSV) once
  you have paying clients depending on it.
