import { useCallback, useEffect, useState } from "react";
import type { Bet } from "@/entities/bet";
import type { EventEditInput, EventIdentity } from "@/entities/event";
import type { EventRecord } from "@/entities/eventRecord";
import type { Match, MatchCreateInput, MatchFormValues } from "@/entities/match";
import {
  createPickemStages,
  type PickemMajor,
  type PickemStageName,
} from "@/entities/pickem";
import { resolvePickemStageNames } from "@/features/pickem/lib/resolvePickemStages";
import type { ProfileMedal } from "@/entities/medal";
import type { Profile } from "@/entities/profile";
import { todayIsoDateLocal } from "@/shared/lib/date/isoDate";
import { dedupeEventRecords } from "@/features/events/lib/dedupeEventRecords";
import { findBetsForEvent, findMatchesForEvent } from "@/features/events/lib/findBetsForEvent";
import { findStoredEvent } from "@/features/events/lib/mergeEventStats";
import { balanceBaseForTarget } from "@/features/bets/lib/calculations";
import {
  enrichProfileWithBets,
  enrichProfilesWithBets,
  profileNeedsBalanceSync,
} from "@/features/profile/lib/profileBalance";
import { normalizeMatch } from "@/features/matches/lib/normalizeMatch";
import {
  getMatchSeriesWinner,
  planMatchBetSettlements,
  countSkippedWaitBets,
  type MatchSettlementResult,
} from "@/features/matches/lib/settleBetsForMatch";
import { httpClient } from "@/shared/api/httpClient";
import {
  clearActiveProfileId,
  readActiveProfileId,
  writeActiveProfileId,
} from "../lib/activeProfileStorage";
import { normalizeBet } from "../lib/normalizeBet";
import { normalizeEventRecord } from "../lib/normalizeEventRecord";
import { normalizeMedal } from "../lib/normalizeMedal";
import { normalizePickemMajor } from "../lib/normalizePickem";
import { getNextProfileId } from "../lib/profileId";
import { normalizeProfile } from "../lib/normalizeProfile";
import { clampBalance, clampBetAmount } from "@/shared/lib/limits";

export function useProfileBets() {
  const [activeProfileId, setActiveProfileId] = useState<number | null>(() =>
    readActiveProfileId()
  );
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bets, setBets] = useState<Bet[]>([]);
  const [allBets, setAllBets] = useState<Bet[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [pickems, setPickems] = useState<PickemMajor[]>([]);
  const [medals, setMedals] = useState<ProfileMedal[]>([]);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfiles = useCallback(async () => {
    const [profilesRes, allBetsRes] = await Promise.all([
      httpClient.get<Profile[]>("/profiles"),
      httpClient.get<Bet[]>("/bets"),
    ]);
    const loadedAllBets = (allBetsRes.data || []).map(normalizeBet);
    const items = enrichProfilesWithBets(
      (profilesRes.data || [])
        .map((item) => {
          try {
            return normalizeProfile(item);
          } catch (err) {
            console.error(err);
            return null;
          }
        })
        .filter((item): item is Profile => item != null),
      loadedAllBets
    );
    setAllBets(loadedAllBets);
    setProfiles(items);
    return items;
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeProfileId == null) {
        await loadProfiles();
        setProfile(null);
        setBets([]);
        setAllBets([]);
        setMatches([]);
        setPickems([]);
        setMedals([]);
        setEvents([]);
        return;
      }

      const [profileRes, betsRes, allBetsRes, profilesRes, matchesRes, pickemsRes, medalsRes, eventsRes] =
        await Promise.all([
          httpClient.get<Profile>(`/profiles/${activeProfileId}`),
          httpClient.get<Bet[]>(`/bets?profileId=${activeProfileId}`),
          httpClient.get<Bet[]>("/bets"),
          httpClient.get<Profile[]>("/profiles"),
          httpClient.get<Match[]>("/matches"),
          httpClient.get<PickemMajor[]>(`/pickems?profileId=${activeProfileId}`),
          httpClient.get<ProfileMedal[]>(`/medals?profileId=${activeProfileId}`),
          httpClient.get<EventRecord[]>("/events"),
        ]);
      const loadedBets = (betsRes.data || []).map(normalizeBet);
      const loadedAllBets = (allBetsRes.data || []).map(normalizeBet);
      const loadedProfiles = (profilesRes.data || [])
        .map((item) => {
          try {
            return normalizeProfile(item);
          } catch (err) {
            console.error(err);
            return null;
          }
        })
        .filter((item): item is Profile => item != null);

      const rawProfile = normalizeProfile(profileRes.data);
      const enrichedProfile = enrichProfileWithBets(rawProfile, loadedAllBets);
      const enrichedProfiles = enrichProfilesWithBets(loadedProfiles, loadedAllBets);

      if (profileNeedsBalanceSync(rawProfile, loadedAllBets)) {
        const res = await httpClient.patch<Profile>(`/profiles/${rawProfile.id}`, {
          name: enrichedProfile.name,
          balance: enrichedProfile.balance,
          balanceBase: enrichedProfile.balanceBase,
          totalBets: enrichedProfile.totalBets,
          winRate: enrichedProfile.winRate,
        });
        setProfile(normalizeProfile(res.data));
      } else {
        setProfile(enrichedProfile);
      }

      setBets(loadedBets);
      setAllBets(loadedAllBets);
      setProfiles(enrichedProfiles);
      setMatches((matchesRes.data || []).map(normalizeMatch));
      setPickems((pickemsRes.data || []).map(normalizePickemMajor));
      setMedals(
        (medalsRes.data || [])
          .map(normalizeMedal)
          .filter((medal) => medal.profileId === activeProfileId),
      );
      setEvents(
        dedupeEventRecords((eventsRes.data || []).map(normalizeEventRecord))
      );
    } catch (err) {
      console.error(err);
      if (activeProfileId != null) {
        clearActiveProfileId();
        setActiveProfileId(null);
        try {
          await loadProfiles();
        } catch (listErr) {
          console.error(listErr);
          setError("Не удалось загрузить данные");
        }
      } else {
        setError("Не удалось загрузить данные");
      }
    } finally {
      setLoading(false);
    }
  }, [activeProfileId, loadProfiles]);

  useEffect(() => {
    void load();
  }, [load]);

  const syncProfile = async (
    currentProfile: Profile,
    allBetsList: Bet[],
    balanceBase = currentProfile.balanceBase ?? 0
  ) => {
    const enriched = enrichProfileWithBets(
      { ...currentProfile, balanceBase },
      allBetsList
    );
    const updated = await httpClient.patch<Profile>(`/profiles/${currentProfile.id}`, {
      name: enriched.name,
      balance: enriched.balance,
      balanceBase: enriched.balanceBase,
      totalBets: enriched.totalBets,
      winRate: enriched.winRate,
    });
    const saved = normalizeProfile(updated.data);
    setProfile(saved);
    setProfiles((prev) => prev.map((item) => (item.id === saved.id ? saved : item)));
    return saved.balance;
  };

  const syncProfilesForBets = async (
    profileIds: Iterable<number>,
    allBetsList: Bet[],
    profilesList: Profile[]
  ) => {
    const updatedProfiles = new Map<number, Profile>();

    for (const profileId of profileIds) {
      const current = profilesList.find((item) => item.id === profileId);
      if (!current) continue;
      const enriched = enrichProfileWithBets(current, allBetsList);
      const res = await httpClient.patch<Profile>(`/profiles/${profileId}`, {
        name: enriched.name,
        balance: enriched.balance,
        balanceBase: enriched.balanceBase,
        totalBets: enriched.totalBets,
        winRate: enriched.winRate,
      });
      updatedProfiles.set(profileId, normalizeProfile(res.data));
    }

    if (updatedProfiles.size === 0) return;

    setProfiles((prev) => prev.map((item) => updatedProfiles.get(item.id) ?? item));
    if (profile && updatedProfiles.has(profile.id)) {
      setProfile(updatedProfiles.get(profile.id)!);
    }
  };

  const selectProfile = (id: number) => {
    if (!Number.isFinite(id) || id <= 0) return;
    writeActiveProfileId(id);
    setActiveProfileId(id);
  };

  const createProfile = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const currentProfiles = await loadProfiles();
    const nextId = getNextProfileId(currentProfiles);
    const res = await httpClient.post<Profile>("/profiles", {
      id: String(nextId),
      name: trimmed,
      balance: 0,
      balanceBase: 0,
      totalBets: 0,
      winRate: 0,
    });
    const created = normalizeProfile(res.data);
    setProfiles((prev) => [...prev.filter((item) => item.id !== created.id), created]);
    writeActiveProfileId(created.id);
    setActiveProfileId(created.id);
  };

  const exitProfile = () => {
    clearActiveProfileId();
    setActiveProfileId(null);
  };

  const addBet = async (data: Omit<Bet, "id">) => {
    if (!profile) return;
    const amount = clampBetAmount(data.amount);
    if (amount <= 0) return;
    const res = await httpClient.post<Bet>("/bets", { ...data, amount, profileId: profile.id });
    const created = normalizeBet(res.data);
    const nextBets = [...bets, created];
    const nextAllBets = [...allBets, created];
    setBets(nextBets);
    setAllBets(nextAllBets);
    await syncProfile(profile, nextAllBets);
  };

  const updateBet = async (updated: Bet, _previous: Bet) => {
    if (!profile) return;
    const savedPayload = { ...updated, amount: clampBetAmount(updated.amount) };
    if (savedPayload.amount <= 0) return;
    const res = await httpClient.patch<Bet>(`/bets/${updated.id}`, savedPayload);
    const saved = normalizeBet(res.data);
    const nextBets = bets.map((b) => (b.id === saved.id ? saved : b));
    const nextAllBets = allBets.map((item) => (item.id === saved.id ? saved : item));

    setBets(nextBets);
    setAllBets(nextAllBets);
    await syncProfile(profile, nextAllBets);
  };

  const deleteBet = async (bet: Bet) => {
    if (!profile) return;
    await httpClient.delete(`/bets/${bet.id}`);
    const nextBets = bets.filter((b) => b.id !== bet.id);
    const nextAllBets = allBets.filter((item) => item.id !== bet.id);
    setBets(nextBets);
    setAllBets(nextAllBets);
    await syncProfile(profile, nextAllBets);
  };

  const settleWin = async (id: string) => {
    if (!profile) return;
    const bet = bets.find((b) => b.id === id);
    if (!bet || bet.status !== "WAIT") return;

    const res = await httpClient.patch<Bet>(`/bets/${id}`, { status: "WIN" });
    const saved = normalizeBet(res.data);
    const nextBets = bets.map((b) => (b.id === id ? saved : b));
    const nextAllBets = allBets.map((item) => (item.id === id ? saved : item));
    setBets(nextBets);
    setAllBets(nextAllBets);
    await syncProfile(profile, nextAllBets);
  };

  const settleLose = async (id: string) => {
    if (!profile) return;
    const bet = bets.find((b) => b.id === id);
    if (!bet || bet.status !== "WAIT") return;

    const res = await httpClient.patch<Bet>(`/bets/${id}`, { status: "LOSE" });
    const saved = normalizeBet(res.data);
    const nextBets = bets.map((b) => (b.id === id ? saved : b));
    const nextAllBets = allBets.map((item) => (item.id === id ? saved : item));
    setBets(nextBets);
    setAllBets(nextAllBets);
    await syncProfile(profile, nextAllBets);
  };

  const revertToPending = async (id: string) => {
    if (!profile) return;
    const bet = bets.find((b) => b.id === id);
    if (!bet || bet.status === "WAIT") return;

    const res = await httpClient.patch<Bet>(`/bets/${id}`, { status: "WAIT" });
    const saved = normalizeBet(res.data);
    const nextBets = bets.map((b) => (b.id === id ? saved : b));
    const nextAllBets = allBets.map((item) => (item.id === id ? saved : item));
    setBets(nextBets);
    setAllBets(nextAllBets);
    await syncProfile(profile, nextAllBets);
  };

  const setBalance = async (balance: number) => {
    if (!profile) return;
    const balanceBase = balanceBaseForTarget(clampBalance(balance), bets);
    const enriched = enrichProfileWithBets({ ...profile, balanceBase }, allBets);
    const res = await httpClient.patch<Profile>(`/profiles/${profile.id}`, {
      name: enriched.name,
      balance: enriched.balance,
      balanceBase: enriched.balanceBase,
      totalBets: enriched.totalBets,
      winRate: enriched.winRate,
    });
    setProfile(normalizeProfile(res.data));
    setProfiles((prev) =>
      prev.map((item) => (item.id === profile.id ? normalizeProfile(res.data) : item))
    );
  };

  const updateProfileName = async (name: string) => {
    if (!profile) return;
    const trimmed = name.trim();
    if (!trimmed) return;
    const enriched = enrichProfileWithBets(profile, allBets);
    const res = await httpClient.patch<Profile>(`/profiles/${profile.id}`, {
      name: trimmed,
      balance: enriched.balance,
      balanceBase: enriched.balanceBase,
      totalBets: enriched.totalBets,
      winRate: enriched.winRate,
    });
    const saved = normalizeProfile(res.data);
    setProfile(saved);
    setProfiles((prev) => prev.map((item) => (item.id === saved.id ? saved : item)));
  };

  const deleteProfile = async () => {
    if (!profile) return;
    await Promise.all([
      ...bets.map((bet) => httpClient.delete(`/bets/${bet.id}`)),
      ...pickems.flatMap((pickem) => [
        httpClient.delete(`/uploads/pickems/${pickem.id}`).catch(() => undefined),
        httpClient.delete(`/pickems/${pickem.id}`),
      ]),
      ...medals.map((medal) => httpClient.delete(`/medals/${medal.id}`)),
    ]);
    await httpClient.delete(`/profiles/${profile.id}`);
    clearActiveProfileId();
    setActiveProfileId(null);
  };

  const addMatch = async (data: MatchCreateInput) => {
    const payload: MatchFormValues = {
      ...data,
      score1: data.score1 ?? null,
      score2: data.score2 ?? null,
      status: "scheduled",
    };
    const res = await httpClient.post<Match>("/matches", payload);
    const created = normalizeMatch(res.data);
    setMatches((prev) => [...prev, created]);
  };

  const deleteMatch = async (match: Match) => {
    await httpClient.delete(`/matches/${match.id}`);
    setMatches((prev) => prev.filter((m) => m.id !== match.id));
  };

  const addEvent = async (data: EventEditInput) => {
    const organization = data.eventOrganization.trim();
    const name = data.eventName.trim();
    const existing = findStoredEvent({ eventOrganization: organization, eventName: name }, events);
    if (existing) return;

    const res = await httpClient.post<EventRecord>("/events", {
      eventOrganization: organization,
      eventName: name,
      logoSlug: data.logoSlug?.trim() ?? null,
      date: data.date.trim() || todayIsoDateLocal(),
      endDate: data.endDate.trim(),
      eventTier: data.eventTier,
      stages: data.stages,
      winnerOrganization: data.winnerOrganization?.trim() || null,
      winnerLogoSlug: data.winnerLogoSlug?.trim() || null,
    });
    const created = normalizeEventRecord(res.data);
    setEvents((prev) => dedupeEventRecords([...prev, created]));
  };

  const updateEvent = async (identity: EventIdentity, data: EventEditInput) => {
    const nextOrganization = data.eventOrganization.trim();
    const nextName = data.eventName.trim();
    const updateEventDates = !identity.majorStage || identity.allMajorStages;
    const nextDate = data.date.trim() || todayIsoDateLocal();
    const nextEndDate = data.endDate.trim();
    const record = findStoredEvent(
      {
        eventOrganization: identity.eventOrganization,
        eventName: identity.eventName,
      },
      events
    );

    if (record) {
      const res = await httpClient.patch<EventRecord>(`/events/${record.id}`, {
        eventOrganization: nextOrganization,
        eventName: nextName,
        logoSlug: data.logoSlug?.trim() ?? null,
        date: updateEventDates ? nextDate : record.date,
        endDate: updateEventDates ? nextEndDate : record.endDate,
        eventTier: data.eventTier,
        stages: data.stages,
        winnerOrganization: updateEventDates
          ? data.winnerOrganization?.trim() || null
          : record.winnerOrganization,
        winnerLogoSlug: updateEventDates
          ? data.winnerLogoSlug?.trim() || null
          : record.winnerLogoSlug,
      });
      const saved = normalizeEventRecord(res.data);
      setEvents((prev) =>
        dedupeEventRecords(prev.map((item) => (item.id === saved.id ? saved : item)))
      );
    } else if (updateEventDates) {
      const res = await httpClient.post<EventRecord>("/events", {
        eventOrganization: nextOrganization,
        eventName: nextName,
        logoSlug: data.logoSlug?.trim() ?? null,
        date: nextDate,
        endDate: nextEndDate,
        eventTier: data.eventTier,
        stages: data.stages,
        winnerOrganization: data.winnerOrganization?.trim() || null,
        winnerLogoSlug: data.winnerLogoSlug?.trim() || null,
      });
      const created = normalizeEventRecord(res.data);
      setEvents((prev) => dedupeEventRecords([...prev, created]));
    }

    const matchingBets = findBetsForEvent(identity, allBets, events);
    const matchingMatches = findMatchesForEvent(identity, matches);

    const savedBets = await Promise.all(
      matchingBets.map(async (bet) => {
        const patch = {
          eventOrganization: nextOrganization,
          eventName: nextName,
          majorStage: bet.majorStage,
        };
        const res = await httpClient.patch<Bet>(`/bets/${bet.id}`, { ...bet, ...patch });
        return normalizeBet(res.data);
      })
    );

    const savedMatches = await Promise.all(
      matchingMatches.map(async (match) => {
        const patch = {
          eventOrganization: nextOrganization,
          eventName: nextName,
          majorStage: match.majorStage,
        };
        const res = await httpClient.patch<Match>(`/matches/${match.id}`, { ...match, ...patch });
        return normalizeMatch(res.data);
      })
    );

    if (savedBets.length > 0) {
      const savedById = new Map(savedBets.map((bet) => [bet.id, bet]));
      const nextAllBets = allBets.map((bet) => savedById.get(bet.id) ?? bet);
      setAllBets(nextAllBets);
      if (profile) {
        const nextBets = nextAllBets.filter((bet) => bet.profileId === profile.id);
        setBets(nextBets);
        await syncProfile(profile, nextAllBets);
      }
    }

    if (savedMatches.length > 0) {
      const savedById = new Map(savedMatches.map((match) => [match.id, match]));
      setMatches((prev) => prev.map((match) => savedById.get(match.id) ?? match));
    }
  };

  const deleteEvent = async (identity: EventIdentity) => {
    const matchingBets = findBetsForEvent(identity, allBets, events);
    const matchingMatches = findMatchesForEvent(identity, matches);
    const deletedBetIds = new Set(matchingBets.map((bet) => bet.id));
    const deletedMatchIds = new Set(matchingMatches.map((match) => match.id));

    await Promise.all([
      ...matchingBets.map((bet) => httpClient.delete(`/bets/${bet.id}`)),
      ...matchingMatches.map((match) => httpClient.delete(`/matches/${match.id}`)),
    ]);

    const nextAllBets = allBets.filter((bet) => !deletedBetIds.has(bet.id));
    setAllBets(nextAllBets);
    setMatches((prev) => prev.filter((match) => !deletedMatchIds.has(match.id)));

    const affectedProfileIds = new Set(matchingBets.map((bet) => bet.profileId));
    await syncProfilesForBets(affectedProfileIds, nextAllBets, profiles);

    if (profile) {
      setBets(nextAllBets.filter((item) => item.profileId === profile.id));
    }

    const record = findStoredEvent(identity, events);
    if (record) {
      await httpClient.delete(`/events/${record.id}`);
      setEvents((prev) => prev.filter((item) => item.id !== record.id));
    }

    const org = identity.eventOrganization.trim();
    const name = identity.eventName.trim();
    const relatedPickems = pickems.filter(
      (item) => item.eventOrganization.trim() === org && item.eventName.trim() === name
    );
    for (const pickem of relatedPickems) {
      await httpClient.delete(`/uploads/pickems/${pickem.id}`).catch(() => undefined);
      await httpClient.delete(`/pickems/${pickem.id}`);
    }
    if (relatedPickems.length > 0) {
      const deletedPickemIds = new Set(relatedPickems.map((item) => item.id));
      setPickems((prev) => prev.filter((item) => !deletedPickemIds.has(item.id)));
    }
  };

  const addPickemMajor = async (eventOrganization: string, eventName: string) => {
    if (!profile) return;
    const org = eventOrganization.trim();
    const name = eventName.trim();
    const stageNames = resolvePickemStageNames(org, name, events);
    const res = await httpClient.post<PickemMajor>("/pickems", {
      profileId: profile.id,
      eventOrganization: org,
      eventName: name,
      stages: createPickemStages(stageNames),
    });
    const created = normalizePickemMajor(res.data);
    setPickems((prev) => [...prev, created]);
  };

  const uploadPickemStageImage = async (
    major: PickemMajor,
    stage: PickemStageName,
    file: File
  ) => {
    const formData = new FormData();
    formData.append("stage", stage);
    formData.append("file", file);

    const res = await httpClient.post<PickemMajor>(`/pickems/${major.id}/stage-image`, formData);
    const saved = normalizePickemMajor(res.data);
    setPickems((prev) => prev.map((item) => (item.id === saved.id ? saved : item)));
  };

  const deletePickemMajor = async (major: PickemMajor) => {
    await httpClient.delete(`/uploads/pickems/${major.id}`).catch(() => undefined);
    await httpClient.delete(`/pickems/${major.id}`);
    setPickems((prev) => prev.filter((item) => item.id !== major.id));
  };

  const uploadMedal = async (imageData: string) => {
    if (!profile) return;
    const res = await httpClient.post<ProfileMedal>("/medals", {
      profileId: profile.id,
      imageData,
      createdAt: todayIsoDateLocal(),
    });
    const created = normalizeMedal(res.data);
    if (created.profileId !== profile.id) return;
    setMedals((prev) => [...prev, created]);
  };

  const deleteMedal = async (medal: ProfileMedal) => {
    if (!profile || medal.profileId !== profile.id) return;
    await httpClient.delete(`/medals/${medal.id}`);
    setMedals((prev) => prev.filter((item) => item.id !== medal.id));
  };

  const settleMatchBets = async (match: Match): Promise<MatchSettlementResult> => {
    const plan = planMatchBetSettlements(match, allBets);
    const skipped = countSkippedWaitBets(match, allBets);
    if (plan.length === 0) {
      return { settled: 0, skipped };
    }

    const savedBets = await Promise.all(
      plan.map(async ({ bet, nextStatus }) => {
        const res = await httpClient.patch<Bet>(`/bets/${bet.id}`, { ...bet, status: nextStatus });
        return normalizeBet(res.data);
      })
    );

    const savedById = new Map(savedBets.map((item) => [item.id, item]));
    const nextAllBets = allBets.map((item) => savedById.get(item.id) ?? item);
    setAllBets(nextAllBets);

    const affectedProfileIds = new Set(plan.map(({ bet }) => bet.profileId));
    await syncProfilesForBets(affectedProfileIds, nextAllBets, profiles);

    if (profile && affectedProfileIds.has(profile.id)) {
      setBets(nextAllBets.filter((item) => item.profileId === profile.id));
    }

    return { settled: plan.length, skipped };
  };

  const updateMatch = async (match: Match, data: MatchCreateInput) => {
    const hasWinner = getMatchSeriesWinner({
      score1: data.score1 ?? null,
      score2: data.score2 ?? null,
    });
    const payload: MatchFormValues = {
      ...data,
      score1: data.score1 ?? null,
      score2: data.score2 ?? null,
      status: hasWinner ? "finished" : match.status,
    };
    const res = await httpClient.patch<Match>(`/matches/${match.id}`, payload);
    const saved = normalizeMatch(res.data);
    setMatches((prev) => prev.map((m) => (m.id === saved.id ? saved : m)));

    if (hasWinner) {
      await settleMatchBets(saved);
    }
  };

  return {
    profile,
    profiles,
    bets,
    allBets,
    matches,
    pickems,
    medals,
    events,
    loading,
    error,
    reload: load,
    selectProfile,
    createProfile,
    exitProfile,
    addBet,
    updateBet,
    deleteBet,
    settleWin,
    settleLose,
    revertToPending,
    setBalance,
    updateProfileName,
    deleteProfile,
    addMatch,
    updateMatch,
    settleMatchBets,
    deleteMatch,
    addEvent,
    updateEvent,
    deleteEvent,
    addPickemMajor,
    uploadPickemStageImage,
    deletePickemMajor,
    uploadMedal,
    deleteMedal,
  };
}
