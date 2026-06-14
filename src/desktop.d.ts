import type { DesktopAppApi } from "@/shared/lib/desktop/desktopApp";

declare global {
  interface Window {
    desktopApp?: DesktopAppApi;
  }
}

export {};
