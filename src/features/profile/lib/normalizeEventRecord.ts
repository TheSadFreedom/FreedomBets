import type { Tournament, TournamentSize } from "@/entities/eventRecord";
import { isEventTier } from "@/entities/event";
import { inferEventTier } from "@/features/events/lib/eventTier";
import { limitInputLength, MAX_EVENT_NAME_LENGTH } from "@/shared/lib/limits";
import { parsePrizePool } from "@/shared/lib/format/prizePool";

function resolveSize(data: Tournament & { eventName?: string }): TournamentSize {
  const title = String(data.name ?? data.eventName ?? "");
  if (isEventTier(data.size)) return data.size;
  if (isEventTier(data.eventTier)) return data.eventTier;
  return inferEventTier("", title);
}

export function normalizeTournament(
  data: Tournament & { profileId?: unknown; eventName?: string }
): Tournament {
  const name = limitInputLength(
    String(data.name ?? data.eventName ?? "").trim(),
    MAX_EVENT_NAME_LENGTH
  );

  return {
    id: String(data.id),
    name,
    date: String(data.date ?? "").trim(),
    endDate: String(data.endDate ?? "").trim(),
    logoSlug: typeof data.logoSlug === "string" && data.logoSlug.trim() ? data.logoSlug.trim() : null,
    size: resolveSize({ ...data, name }),
    winnerTeamId:
      typeof data.winnerTeamId === "string" && data.winnerTeamId.trim()
        ? data.winnerTeamId.trim()
        : null,
    prizePool: parsePrizePool(data.prizePool),
  };
}

/** @deprecated */
export const normalizeEventRecord = normalizeTournament;
