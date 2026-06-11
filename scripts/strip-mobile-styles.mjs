import fs from "node:fs";
import path from "node:path";

const SRC = path.join(process.cwd(), "src");

function findBalancedBraceEnd(text, openIndex) {
  let depth = 0;
  for (let i = openIndex; i < text.length; i++) {
    const ch = text[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return i + 1;
    }
  }
  return text.length;
}

function stripTemplateMediaBlocks(text) {
  let result = "";
  let i = 0;

  while (i < text.length) {
    const mediaIdx = text.indexOf("${media.", i);
    const atMediaIdx = text.indexOf("@media", i);

    let nextIdx = -1;
    let kind = null;

    if (mediaIdx !== -1 && (atMediaIdx === -1 || mediaIdx < atMediaIdx)) {
      nextIdx = mediaIdx;
      kind = "template";
    } else if (atMediaIdx !== -1) {
      nextIdx = atMediaIdx;
      kind = "atmedia";
    }

    if (nextIdx === -1) {
      result += text.slice(i);
      break;
    }

    result += text.slice(i, nextIdx);

    if (kind === "template") {
      const braceStart = text.indexOf("{", nextIdx);
      if (braceStart === -1) {
        result += text.slice(nextIdx);
        break;
      }
      i = findBalancedBraceEnd(text, braceStart);
      continue;
    }

    const braceStart = text.indexOf("{", nextIdx);
    if (braceStart === -1) {
      result += text.slice(nextIdx);
      break;
    }
    const block = text.slice(nextIdx, braceStart);
    if (!block.includes("media.down") && !block.includes("media.up")) {
      result += text.slice(nextIdx, braceStart);
      i = braceStart;
      continue;
    }
    i = findBalancedBraceEnd(text, braceStart);
  }

  return result;
}

function stripBracketMedia(text) {
  let result = "";
  let i = 0;

  while (i < text.length) {
    const idx = text.indexOf("[media.", i);
    if (idx === -1) {
      result += text.slice(i);
      break;
    }

    result += text.slice(i, idx);
    const braceStart = text.indexOf("{", idx);
    if (braceStart === -1) {
      result += text.slice(idx);
      break;
    }
    let end = findBalancedBraceEnd(text, braceStart);
    if (text[end] === ",") end++;
    while (text[end] === " " || text[end] === "\n") end++;
    i = end;
  }

  return result;
}

function cleanupImports(text) {
  if (!text.includes("media.down") && !text.includes("media.up") && !text.includes("[media.")) {
    text = text.replace(
      /^import\s+\{\s*media\s*\}\s+from\s+["'][^"']+["'];\s*\n?/m,
      "",
    );
  }
  return text
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+\n/g, "\n");
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(styled\.ts|styled\.tsx|global\.styled\.ts)$/.test(entry.name)) files.push(full);
  }
  return files;
}

const files = walk(SRC);
let changed = 0;

for (const file of files) {
  const original = fs.readFileSync(file, "utf8");
  let next = stripBracketMedia(stripTemplateMediaBlocks(original));
  next = cleanupImports(next);
  if (next !== original) {
    fs.writeFileSync(file, next);
    changed++;
    console.log("updated:", path.relative(process.cwd(), file));
  }
}

console.log(`Done. ${changed} files updated.`);
