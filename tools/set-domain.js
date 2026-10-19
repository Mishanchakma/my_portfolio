// Usage: node tools/set-domain.js https://your-domain.com
// Replaces YOUR-DOMAIN in index.html, robots.txt and sitemap.xml (needed for Google and link previews).
const fs = require("fs"), path = require("path");
const url = (process.argv[2] || "").replace(/\/+$/, "");
if (!/^https:\/\/[^\s/]+$/.test(url)) { console.error("Give your site address, e.g.  node tools/set-domain.js https://mishan.dev"); process.exit(1); }
const host = url.replace("https://", "");
for (const f of ["index.html", "robots.txt", "sitemap.xml"]) {
  const p = path.join(__dirname, "..", "frontend", f);
  fs.writeFileSync(p, fs.readFileSync(p, "utf8").replace(/https:\/\/YOUR-DOMAIN/g, url).replace(/YOUR-DOMAIN/g, host));
  console.log("updated", f);
}
