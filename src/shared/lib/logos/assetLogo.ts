/** Логотип сайта — запасной для команд и турниров без своего файла */
export const SITE_LOGO_SRC = "/logo.png";

/** webp первым — большинство логотипов в public/teams и public/organizations */
const LOGO_EXTENSIONS = ["webp", "png", "svg", "jpg", "jpeg"] as const;

/** Имя файла без расширения → канонический slug (опечатки в названиях файлов) */
const LOGO_FILE_ALIASES: Record<string, string> = {
  "thunder-downnunder": "thunder-downunder",
};

export function assetLogoSlug(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9а-яё-]/gi, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return LOGO_FILE_ALIASES[slug] ?? slug;
}

export function assetLogoSrc(
  folder: "teams" | "organizations",
  name: string,
  extensionIndex = 0
): string {
  const slug = assetLogoSlug(name);
  const ext = LOGO_EXTENSIONS[extensionIndex] ?? LOGO_EXTENSIONS[0];
  return `/${folder}/${slug}.${ext}`;
}

export function nextLogoExtensionIndex(current: number): number | null {
  const next = current + 1;
  return next < LOGO_EXTENSIONS.length ? next : null;
}
