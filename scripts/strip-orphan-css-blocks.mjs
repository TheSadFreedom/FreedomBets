import fs from "node:fs";
import path from "node:path";

const SRC = path.join(process.cwd(), "src");

function findBalancedBraceEnd(text, openIndex) {
  let depth = 0;
  for (let i = openIndex; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}") {
      depth--;
      if (depth === 0) return i + 1;
    }
  }
  return text.length;
}

function stripOrphanBlocks(text) {
  const normalized = text.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  let result = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (/^\s+\{\s*$/.test(line)) {
      const startOffset = result.join("\n").length + (result.length > 0 ? 1 : 0);
      const rest = lines.slice(i).join("\n");
      const braceStart = rest.indexOf("{");
      const blockEnd = findBalancedBraceEnd(rest, braceStart);
      const consumed = rest.slice(0, blockEnd).split("\n").length;
      i += consumed;
      continue;
    }
    result.push(line);
    i++;
  }

  let out = result.join("\n");
  if (text.endsWith("\r\n") && !out.endsWith("\r\n")) {
    out = out.replace(/\n/g, "\r\n");
  }
  return out.replace(/\n{3,}/g, "\n\n");
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(styled\.ts|styled\.tsx|global\.styled\.ts)$/.test(entry.name)) files.push(full);
  }
  return files;
}

let changed = 0;
for (const file of walk(SRC)) {
  try {
    const original = fs.readFileSync(file, "utf8");
    const next = stripOrphanBlocks(original);
    if (next !== original) {
      fs.writeFileSync(file, next);
      changed++;
      console.log("cleaned:", path.relative(process.cwd(), file));
    }
  } catch (err) {
    console.error("failed:", file, err.message);
  }
}

console.log(`Done. ${changed} files cleaned.`);
