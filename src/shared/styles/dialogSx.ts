export const dialogPaperSx = {
  p: 0,
  m: 2,
  borderRadius: "18px",
  background:
    "linear-gradient(160deg, rgba(44, 52, 44, 0.98) 0%, rgba(28, 30, 28, 0.99) 42%, rgba(22, 22, 22, 1) 100%)",
  border: "1px solid rgba(76, 175, 80, 0.22)",
  boxShadow: "0 24px 64px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.04) inset",
  overflow: "hidden",
  maxHeight: "92dvh",
} as const;

export const dialogPaperMobileSx = {
  m: 0,
  borderRadius: 0,
  maxHeight: "100dvh",
  height: "100dvh",
} as const;

export const dialogBackdropSx = {
  backdropFilter: "blur(6px)",
  backgroundColor: "rgba(0, 0, 0, 0.65)",
} as const;

export function resolveDialogPaperSx(isMobile: boolean) {
  return isMobile ? { ...dialogPaperSx, ...dialogPaperMobileSx } : dialogPaperSx;
}
