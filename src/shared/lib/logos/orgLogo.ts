import { assetLogoSrc } from "./assetLogo";

export { assetLogoSlug as orgLogoSlug, nextLogoExtensionIndex } from "./assetLogo";

export function orgLogoSrc(name: string, extensionIndex = 0): string {
  return assetLogoSrc("organizations", name, extensionIndex);
}
