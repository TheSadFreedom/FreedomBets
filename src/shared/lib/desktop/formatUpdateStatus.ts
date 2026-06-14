import type { DesktopUpdateStatus } from "@/shared/lib/desktop/desktopApp";

function shortenUpdateError(message: string): string {
  const text = message.trim();
  if (!text) return "Ошибка проверки обновлений";

  if (text.includes("latest.yml")) {
    return "В GitHub Release нет latest.yml. Переопубликуйте: npm run desktop:publish";
  }

  if (text.includes("404") || text.includes("Not Found")) {
    return "Релиз на GitHub не найден или опубликован не полностью";
  }

  const firstLine = text.split("\n")[0]?.trim() ?? text;
  if (firstLine.length > 120) {
    return `${firstLine.slice(0, 117)}…`;
  }

  return firstLine;
}

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
      return shortenUpdateError(status.message ?? "Ошибка проверки обновлений");
    default:
      return `Версия ${currentVersion}`;
  }
}
