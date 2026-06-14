import type { DesktopUpdateStatus } from "@/shared/lib/desktop/desktopApp";

export function formatDesktopUpdateStatus(
  status: DesktopUpdateStatus | null,
  currentVersion: string
): string {
  if (!status) {
    return `Версия ${currentVersion}`;
  }

  switch (status.state) {
    case "checking":
      return "Проверка обновлений…";
    case "available":
      return `Доступна версия ${status.version ?? "новее"}`;
    case "downloading":
      return `Загрузка ${Math.round(status.percent ?? 0)}%`;
    case "downloaded":
      return `Версия ${status.version ?? ""} готова к установке`;
    case "not-available":
      return "Установлена последняя версия";
    case "error":
      return status.message ?? "Ошибка проверки обновлений";
    default:
      return `Версия ${currentVersion}`;
  }
}
