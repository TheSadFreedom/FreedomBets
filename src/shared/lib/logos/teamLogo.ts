import { assetLogoSrc } from "./assetLogo";

export { assetLogoSlug as teamLogoSlug, nextLogoExtensionIndex } from "./assetLogo";

export function teamLogoSrc(name: string, extensionIndex = 0): string {
  return assetLogoSrc("teams", name, extensionIndex);
}
