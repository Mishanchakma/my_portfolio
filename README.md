# Portfolio: How to Run and Host

## Folder
- `frontend/` public site (static). `backend/` Node + MongoDB API. `admin/` React admin panel. `tools/` small helper scripts.

## Running Locally
1. `backend`: `cp .env.example .env` (fill in MONGO_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD) -> `npm install` (not `npm ci`, lock file does not have nodemailer yet) -> `npm run seed` -> `npm start`
2. `admin`: `npm install` -> `npm run dev` (http://localhost:5173)
3. Open `frontend/index.html` (Live Server)

## What Can Be Done From Admin Panel
- **Site settings > Profile and intro**: Profile picture + CV (PDF) upload. When visitors click "Download CV", that CV downloads; when clicking "View CV", it opens in the browser.
- **Site settings > Typing animation**: Add/remove text, adjust order using up-down arrows, set separate text based on language, speed, pause, shuffle, cursor, live preview.
- **Projects/Activities/...**: Change order by dragging, checking "Draft" hides it from showing on the site.
- **Account**: 2FA, change password/email, sign-in activity, backup download, backup restore, delete unused images.

## Hosting
1. **Database**: MongoDB Atlas (free). In Network Access, allow only the host's IP/`0.0.0.0/0` + strong password.
2. **Backend** (Render/Railway/Fly): In environment variables, enter everything like `.env.example`. `NODE_ENV=production`, `CLIENT_ORIGINS=https://your-site,https://your-admin`. Build: `npm install`, Start: `npm start`. First time in Shell, run `npm run seed`, then **delete ADMIN_PASSWORD** from `.env`/environment (seed currently does not change an existing password; to change it, run `npm run seed -- --reset-password`).
3. **Frontend**: In `frontend/config.js`, set `window.API_URL = "https://your-backend"`. Then run `node tools/set-domain.js https://your-domain.com`, `node tools/add-sri.js`. Deploy on GitHub Pages/Netlify/Cloudflare Pages.
4. **Admin**: In `admin/.env`, set `VITE_API_URL=https://your-backend`, `npm run build`, put `dist/` on a separate static host. In `admin/public/_headers`, change `YOUR-BACKEND` to your own backend URL (Netlify/Cloudflare Pages will enable CSP + clickjacking block).
5. Free backend goes to sleep: First load takes 30-60 seconds. The site then shows `data.js` (keep it updated via Account > Download data.js in admin). Keep-alive ping (UptimeRobot) or paid plan fixes this.

## Phone Lost / Stuck on 2FA
`cd backend && npm run reset-2fa` (from anywhere with DB access). Then log in with your password and enable 2FA again.

## Security: What Is Included
Bcrypt password, JWT 2 hours, rate limit, login lockout (5 errors = 15 min, based on IP+email), **2FA (authenticator + recovery code)**, sign-in log, old session closes upon password/2FA change, Helmet, CORS allowlist, NoSQL injection and prototype pollution block, upload real type check, strict CSP on images, CSP meta on frontend, escaped output, honeypot.

## Your Responsibility (Cannot Be Done via Code)
- Never upload `.env` to GitHub (`.gitignore` is present). If secret leaks previously, change everything.
- Enable 2FA in Admin and keep recovery codes in a safe place.
- Place Cloudflare (free) **only in front of frontend/admin**. Putting a proxy in front of backend API will make everyone's IP appear identical for rate-limit/lockout (`trust proxy` is set to 1 hop in your backend).
- You can provide `TOTP_KEY` (separate secret); **if changed after enabling 2FA or set for the first time**, old 2FA will not work, so finalize it beforehand.
- Maximum 40 media items in image storage (considering Atlas free space); delete unused images from Account.
- Keep backup enabled in Atlas. If 2FA is not enabled in Admin, login relies solely on the password.
- Do not make Admin page indexable on Google (`noindex` is present).

## What You Still Need to Provide on the Site Yourself (I Cannot Create These)
- Admin > Education: Institute name, period, CGPA (currently blank, not shown on site).
- Activities: One example competition is set to `draft`. Add your own and delete the example.
- Upload `frontend/image/profile.jpeg` and CV PDF (admin > Site settings > Profile and intro).
- Images/videos/GitHub links in Projects, and more projects.
- Run `node tools/set-domain.js https://your-domain.com` and `node tools/add-sri.js` before deploying (changes `YOUR-DOMAIN` in og:image, sitemap, JSON-LD).