# Portfolio: kibhabe cholabe ar hosting korbe

## Folder
- `frontend/` public site (static). `backend/` Node + MongoDB API. `admin/` React admin panel. `tools/` choto helper script.

## Local-e chalano
1. `backend`: `cp .env.example .env` (MONGO_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD bosao) -> `npm install` (`npm ci` noy, lock file-e nodemailer ekhono nei) -> `npm run seed` -> `npm start`
2. `admin`: `npm install` -> `npm run dev` (http://localhost:5173)
3. `frontend/index.html` open koro (Live Server)

## Admin panel theke ja ja kora jay
- **Site settings > Profile and intro**: profile chobi + CV (PDF) upload. Visitor "Download CV" chaple oi CV namey, "View CV" chaple browser-e khole.
- **Site settings > Typing animation**: lekha add/remove, up-down arrow diye kram thik kora, bhasha onujayi alada lekha, speed, pause, shuffle, cursor, live preview.
- **Projects/Activities/...**: drag kore kram bodlano, "Draft" tick dile site-e dekhay na.
- **Account**: 2FA, password/email bodlano, sign-in activity, backup download, backup restore, unused chobi delete.

## Hosting
1. **Database**: MongoDB Atlas (free). Network access-e shudhu host-er IP/`0.0.0.0/0` + strong password.
2. **Backend** (Render/Railway/Fly): environment variable-e `.env.example`-er moto shob dao. `NODE_ENV=production`, `CLIENT_ORIGINS=https://your-site,https://your-admin`. Build: `npm install`, Start: `npm start`. Prothombar Shell-e `npm run seed`, tarpor `.env`/environment theke **ADMIN_PASSWORD muche dao** (seed ekhon existing password bodlay na; bodlate hole `npm run seed -- --reset-password`).
3. **Frontend**: `frontend/config.js`-e `window.API_URL = "https://your-backend"`. Tarpor `node tools/set-domain.js https://your-domain.com`, `node tools/add-sri.js`. GitHub Pages/Netlify/Cloudflare Pages-e deploy.
4. **Admin**: `admin/.env`-e `VITE_API_URL=https://your-backend`, `npm run build`, `dist/` alada static host-e dao. `admin/public/_headers`-e `YOUR-BACKEND` bodle nijer backend URL dao (Netlify/Cloudflare Pages-e CSP + clickjacking block chalu hoy).
5. Free backend ghumiye thake: prothom load-e 30-60 second lage. Site tokhon `data.js` dekhay (admin-e Account > Download data.js diye update rakho). Keep-alive ping (UptimeRobot) ba paid plan dile thik hoy.

## Phone harale / 2FA atke gele
`cd backend && npm run reset-2fa` (DB-te access thaka kono jayga theke). Tarpor password diye dhuke abar 2FA chalu koro.

## Surokkha: ki ache
Bcrypt password, JWT 2 ghonta, rate limit, login lockout (5 vul = 15 min, IP+email onujayi), **2FA (authenticator + recovery code)**, sign-in log, password/2FA bodlale purono session bondho, Helmet, CORS allowlist, NoSQL injection ar prototype pollution block, upload-er asol type check, image-e strict CSP, frontend-e CSP meta, escape kora output, honeypot.

## Tomar korniyo (code diye hoy na)
- `.env` kokhono GitHub-e dio na (`.gitignore` ache). Secret agey leak hole sob bodlao.
- Admin-e 2FA chalu koro ar recovery code safe jaygay rakho.
- Cloudflare (free) shudhu **frontend/admin**-er samne boshao. Backend API-r samne proxy dile rate-limit/lockout sobar IP ek dekhabe (nijer backend-e `trust proxy` 1 hop dhora ache).
- `TOTP_KEY` (alada secret) dite paro; **2FA chalu hoyar por eta bodle ba prothom bar dile** purono 2FA kaj korbe na, tai age thekei thik kore nao.
- Image storage-e max 40 ta media (Atlas free-er jaygar kotha vebe); Account theke unused chobi delete koro.
- Atlas-e backup on rakho. Admin-e 2FA chalu na korle login-e shudhu password-e vorsha.
- Admin page-ke Google-e dekhate chaio na (`noindex` ache).

## Site-e ekhono tomar nijer deya dorkar (ami banate pari na)
- Admin > Education: institute-er nam, period, CGPA (ekhon faka, site-e dekhay na).
- Activities: ekta example competition `draft` kora ache. Nijer ta add koro, example-ta delete koro.
- `frontend/image/profile.jpeg` ar CV PDF upload (admin > Site settings > Profile and intro).
- Projects-e chobi/video/GitHub link, ar aro projects.
- `node tools/set-domain.js https://your-domain.com` ar `node tools/add-sri.js` deploy-er age chalao (og:image, sitemap, JSON-LD er `YOUR-DOMAIN` bodlay).
