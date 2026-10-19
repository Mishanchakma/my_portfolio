// Usage: node tools/add-sri.js        (needs internet, Node 18+)
// Adds integrity="sha384-..." to the CDN <script>/<link> tags in frontend/index.html, so a hacked CDN cannot change your code.
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const file = path.join(__dirname, "..", "frontend", "index.html");
(async () => {
  let html = fs.readFileSync(file, "utf8");
  const re = /<(link|script)\b[^>]*?(?:href|src)="(https:\/\/(?:cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com)[^"]+)"[^>]*>/g;
  for (const m of [...html.matchAll(re)]) {
    if (/integrity=/.test(m[0])) continue;
    const buf = Buffer.from(await (await fetch(m[2])).arrayBuffer());
    const hash = "sha384-" + crypto.createHash("sha384").update(buf).digest("base64");
    html = html.replace(m[0], m[0].replace(/\s*\/?>$/, (e) => ` integrity="${hash}" crossorigin="anonymous"${e.trim()}`));
    console.log("SRI added:", m[2]);
  }
  fs.writeFileSync(file, html);
})();
