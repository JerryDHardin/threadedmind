import fs from "node:fs";
import path from "node:path";

const PROLOGUE_DIR = path.resolve("logs/prologue");
const TEMPLATE_PATH = path.join(PROLOGUE_DIR, "07-02-2025.html");

function die(msg) {
  console.error(msg);
  process.exit(1);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

if (!fs.existsSync(TEMPLATE_PATH)) {
  die(`Template not found: ${TEMPLATE_PATH}`);
}

const template = fs.readFileSync(TEMPLATE_PATH, "utf8");
const startMarker = "<!-- TM_LOG_CONTENT -->";
const endMarker = "<!-- /TM_LOG_CONTENT -->";

const startIdx = template.indexOf(startMarker);
const endIdx = template.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
  die(
    `Template markers not found. Add these inside the <pre> block in ${TEMPLATE_PATH}:\n` +
      `${startMarker}\n{{CONTENT}}\n${endMarker}\n`
  );
}

const files = fs.readdirSync(PROLOGUE_DIR);
const mdFiles = files.filter((f) => f.toLowerCase().endsWith(".md"));

if (!mdFiles.length) die(`No .md files found in ${PROLOGUE_DIR}`);

let converted = 0;

for (const file of mdFiles) {
  const mdPath = path.join(PROLOGUE_DIR, file);
  const base = file.slice(0, -3); // remove .md
  const outHtml = path.join(PROLOGUE_DIR, `${base}.html`);

  // Skip if already exists (keeps your hand-made 07-02-2025.html)
  if (fs.existsSync(outHtml)) continue;

  const rawMd = fs.readFileSync(mdPath, "utf8");

  // Keep it as plain text inside <pre>, but make it safe HTML
  const safeText = escapeHtml(rawMd).replace(/\r\n/g, "\n");

  const out =
    template.slice(0, startIdx + startMarker.length) +
    "\n" +
    safeText +
    "\n" +
    template.slice(endIdx);

  fs.writeFileSync(outHtml, out, "utf8");
  converted++;
}

console.log(`Converted ${converted} prologue .md files to .html`);

const indexPath = path.join(PROLOGUE_DIR, "index.html");
if (fs.existsSync(indexPath)) {
  let indexHtml = fs.readFileSync(indexPath, "utf8");
  indexHtml = indexHtml.replace(/href="([^"]+)\.md"/g, 'href="$1.html"');
  fs.writeFileSync(indexPath, indexHtml, "utf8");
  console.log(`Updated links in ${indexPath}`);
}
