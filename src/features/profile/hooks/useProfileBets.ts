import { useCallback, useEffect, useState } from "react";
import type { Bet } from "@/entities/bet";
import type { EventEditInput, EventIdentity } from "@/entities/event";
import type { EventRecord } from "@/entities/eventRecord";
import type { Match, MatchCreateInput } from "@/entities/match";
import type { PickemMajor, PickemStageName } from "@/entities/pickem";
import { createPickemStagesForPreset } from "@/features/pickem/lib/pickemStages";
import type { PickemStagePresetId } from "@/entities/pickem";
import type { ProfileMedal } from "@/entities/medal";
import type { Profile } from "@/entities/profile";
import { todayIsoDateLocal } from "@/shared/lib/date/isoDate";
import { dedupeEventRecords } from "@/features/events/lib/dedupeEventRecords";
import { findBetsForEvent, findMatchesForEvent } from "@/features/events/lib/findBetsForEvent";
import { findStoredEvent } from "@/features/events/lib/mergeEventStats";
import {
  enrichProfileWithBets,
  enrichProfilesWithBets,
  profileNeedsBalanceSync,
  resolveBalanceTotals,
} from "@/features/profile/lib/profileBalance";
import { normalizeMatch } from "@/features/matches/lib/normalizeMatch";
import {
  planMatchBetRecalculations,
  countSkippedWaitBets,
  type MatchSettlementResult,
} from "@/features/matches/lib/settleBetsForMatch";
import type { RankingBaseline } from "@/entities/ranking";
import type { Team, TeamEditInput } from "@/entities/team";
import {
  fetchRankingBaseline,
  importRankingBaseline,
} from "@/features/rankings/api/rankingsApi";
import { syncSportsRuMatches } from "@/features/sportsru/api/syncSportsRuMatches";
import { httpClient } from "@/shared/api/httpClient";
import {
  clearActiveProfileId,
  readActiveProfileId,
  writeActiveProfileId,
} from "../lib/activeProfileStorage";
import { prepareBetPayload } from "@/features/bets/lib/prepareBetPayload";
import { prepareMatchPayload } from "@/features/matches/lib/prepareMatchPayload";
import { normalizeEventRecord } from "../lib/normalizeEventRecord";
import { normalizePickemMajor } from "../lib/normalizePickem";
import { getNextProfileId } from "../lib/profileId";
import { normalizeProfile } from "../lib/normalizeProfile";
import { clampBalance, clampBetAmount, roundMoney } from "@/shared/lib/limits";
import {
  patchBetStatus,
  replaceBetInLists,
} from "./lib/betStatusApi";
import {
  executeBetSettlementPlan,
  mergeSavedBets,
} from "./lib/executeBetSettlement";
import { normalizeTeam } from "@/features/teams/lib/normalizeTeam";
import { applyDbTeamSynonyms } from "@/shared/lib/teams/teamNames";
import { normalizeProfileList } from "./lib/normalizeProfileList";
import { profilePatchPayload } from "./lib/profilePatchPayload";
import {
  enrichAllBets,
  enrichAllMatches,
  normalizeStoredBets,
  prepareDbContext,
} from "@/shared/lib/db/dbContext";
import { enrichBet } from "@/shared/lib/db/enrichBet";
import { enrichMatch } from "@/shared/lib/db/enrichMatch";

async function fetchTeams(): Promise<Team[]> {
  try {
    const res = await httpClient.get<Team[]>("/teams");
    return (res.data || []).map(normalizeTeam);
  } catch {
    return [];
  }
}

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
  const [rankingBaseline, setRankingBaseline] = useState<RankingBaseline | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    applyDbTeamSynonyms(teams);
  }, [teams]);

  const ensureRankingBaseline = useCallback(async () => {
    let baseline = await fetchRankingBaseline();
    if (!baseline) {
      const result = await importRankingBaseline();
      baseline = result.baseline;
    }
    setRankingBaseline(baseline);
    return baseline;
  }, []);

  const loadProfiles = useCallback(async () => {
    const [profilesRes, allBetsRes, matchesRes, eventsRes, loadedTeams] = await Promise.all([
      httpClient.get<Profile[]>("/profiles"),
      httpClient.get<Bet[]>("/bets"),
      httpClient.get<Match[]>("/matches"),
      httpClient.get<EventRecord[]>("/events"),
      fetchTeams(),
    ]);
    const loadedEvents = dedupeEventRecords((eventsRes.data || []).map(normalizeEventRecord));
    const ctx = prepareDbContext(matchesRes.data || [], loadedEvents, loadedTeams);
    const loadedAllBets = enrichAllBets(normalizeStoredBets(allBetsRes.data || []), ctx);
    const items = enrichProfilesWithBets(
      normalizeProfileList(profilesRes.data || []),
      loadedAllBets,
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
        setTeams([]);
        return;
      }

      const [profileRes, allBetsRes, profilesRes, matchesRes, pickemsRes, eventsRes, baseline, loadedTeams] =
        await Promise.all([
          httpClient.get<Profile>(`/profiles/${activeProfileId}`),
          httpClient.get<Bet[]>("/bets"),
          httpClient.get<Profile[]>("/profiles"),
          httpClient.get<Match[]>("/matches"),
          httpClient.get<PickemMajor[]>(`/pickems?profileId=${activeProfileId}`),
          httpClient.get<EventRecord[]>("/events"),
          ensureRankingBaseline(),
          fetchTeams(),
        ]);
      const loadedEvents = dedupeEventRecords((eventsRes.data || []).map(normalizeEventRecord));
      const ctx = prepareDbContext(matchesRes.data || [], loadedEvents, loadedTeams);
      const loadedAllBets = enrichAllBets(normalizeStoredBets(allBetsRes.data || []), ctx);
      const loadedBets = loadedAllBets.filter((bet) => bet.profileId === activeProfileId);
      const loadedProfiles = normalizeProfileList(profilesRes.data || []);

      const rawProfile = normalizeProfile(profileRes.data);
      const enrichedProfile = enrichProfileWithBets(rawProfile, loadedAllBets);
      const enrichedProfiles = enrichProfilesWithBets(loadedProfiles, loadedAllBets);

      if (profileNeedsBalanceSync(rawProfile, loadedAllBets)) {
        const res = await httpClient.patch<Profile>(
          `/profiles/${rawProfile.id}`,
          profilePatchPayload(enrichedProfile),
        );
        setProfile(normalizeProfile(res.data));
      } else {
        setProfile(enrichedProfile);
      }

      const loadedMatches = enrichAllMatches(ctx);
      setBets(loadedBets);
      setAllBets(loadedAllBets);
      setProfiles(enrichedProfiles);
      setMatches(loadedMatches);
      setPickems((pickemsRes.data || []).map(normalizePickemMajor));
      setMedals(enrichedProfile.medals ?? []);
      setEvents(loadedEvents);
      setRankingBaseline(baseline);
      setTeams(loadedTeams);
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
  }, [activeProfileId, ensureRankingBaseline, loadProfiles]);

  useEffect(() => {
    void load();
  }, [load]);

  const syncProfile = async (currentProfile: Profile, allBetsList: Bet[]) => {
    const enriched = enrichProfileWithBets(currentProfile, allBetsList);
    const updated = await httpClient.patch<Profile>(
      `/profiles/${currentProfile.id}`,
      profilePatchPayload(enriched),
    );
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
      const res = await httpClient.patch<Profile>(
        `/profiles/${profileId}`,
        profilePatchPayload(enriched),
      );
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
      totalDeposited: 0,
      totalWithdrawn: 0,
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
    const res = await httpClient.post<Bet>(
      "/bets",
      prepareBetPayload({ ...data, amount, profileId: profile.id }),
    );
    const saved = res.data;
    if (!saved?.id || !saved.matchId?.trim() || !saved.betType?.trim() || !saved.amount) {
      throw new Error(
        "Сервер вернул неполную ставку. Закройте приложение и запустите npm start из папки проекта или переустановите FreedomBets.",
      );
    }
    await reloadMatchesAndBets();
  };

  const updateBet = async (updated: Bet) => {
    if (!profile) return;
    const savedPayload = { ...updated, amount: clampBetAmount(updated.amount) };
    if (savedPayload.amount <= 0) return;
    await httpClient.patch<Bet>(`/bets/${updated.id}`, prepareBetPayload(savedPayload));
    await reloadMatchesAndBets();
  };

  const deleteBet = async (bet: Bet) => {
    if (!profile) return;
    await httpClient.delete(`/bets/${bet.id}`);
    await reloadMatchesAndBets();
  };

  const applyBetStatusChange = async (id: string, status: Bet["status"]) => {
    if (!profile) return;
    const previous = allBets.find((item) => item.id === id) ?? bets.find((item) => item.id === id);
    if (!previous) return;
    const saved = await patchBetStatus(id, status, previous);
    const { nextBets, nextAllBets } = replaceBetInLists(bets, allBets, saved);
    setBets(nextBets);
    setAllBets(nextAllBets);
    await syncProfile(profile, nextAllBets);
  };

  const settleWin = async (id: string) => {
    const bet = bets.find((item) => item.id === id);
    if (!bet || bet.status !== "WAIT") return;
    await applyBetStatusChange(id, "WIN");
  };

  const settleLose = async (id: string) => {
    const bet = bets.find((item) => item.id === id);
    if (!bet || bet.status !== "WAIT") return;
    await applyBetStatusChange(id, "LOSE");
  };

  const revertToPending = async (id: string) => {
    const bet = bets.find((item) => item.id === id);
    if (!bet || bet.status === "WAIT") return;
    await applyBetStatusChange(id, "WAIT");
  };

  const setBalance = async (balance: number) => {
    if (!profile) return;
    const newBalance = clampBalance(balance);
    const delta = roundMoney(newBalance - profile.balance);
    const { totalDeposited, totalWithdrawn } = resolveBalanceTotals(profile);
    const nextTotals =
      delta > 0
        ? { totalDeposited: roundMoney(totalDeposited + delta), totalWithdrawn }
        : delta < 0
          ? { totalDeposited, totalWithdrawn: roundMoney(totalWithdrawn + Math.abs(delta)) }
          : { totalDeposited, totalWithdrawn };
    const enriched = enrichProfileWithBets(
      { ...profile, ...nextTotals },
      allBets,
    );
    const res = await httpClient.patch<Profile>(
      `/profiles/${profile.id}`,
      profilePatchPayload(enriched),
    );
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
      ...profilePatchPayload(enriched),
      name: trimmed,
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
    ]);
    await httpClient.delete(`/profiles/${profile.id}`);
    clearActiveProfileId();
    setActiveProfileId(null);
  };

  const addMatch = async (data: MatchCreateInput) => {
    const payload = prepareMatchPayload(data);
    const res = await httpClient.post<Match>("/matches", payload);
    const created = normalizeMatch(res.data);
    setMatches((prev) => [...prev, created]);
  };

  const deleteMatch = async (match: Match) => {
    await httpClient.delete(`/matches/${match.id}`);
    setMatches((prev) => prev.filter((m) => m.id !== match.id));
  };

  const addEvent = async (data: EventEditInput) => {
    const name = (data.name ?? data.eventName ?? "").trim();
    const existing = events.find((item) => item.name.trim().toLowerCase() === name.toLowerCase());
    if (existing) return;

    const size = data.size ?? data.eventTier ?? "Small";
    const res = await httpClient.post<EventRecord>("/events", {
      name,
      logoSlug: data.logoSlug?.trim() ?? null,
      date: data.date.trim() || todayIsoDateLocal(),
      endDate: data.endDate.trim(),
      size,
      winnerTeamId: data.winnerTeamId?.trim() || null,
      prizePool: data.prizePool,
    });
    const created = normalizeEventRecord(res.data);
    setEvents((prev) => dedupeEventRecords([...prev, created]));
  };

  const updateEvent = async (identity: EventIdentity, data: EventEditInput) => {
    const nextName = (data.name ?? data.eventName ?? "").trim();
    const nextDate = data.date.trim() || todayIsoDateLocal();
    const nextEndDate = data.endDate.trim();
    const record = findStoredEvent({ id: identity.id, name: nextName }, events);

    if (record) {
      const size = data.size ?? data.eventTier ?? record.size ?? "Small";
      const res = await httpClient.patch<EventRecord>(`/events/${record.id}`, {
        name: nextName,
        logoSlug: data.logoSlug?.trim() ?? null,
        date: nextDate,
        endDate: nextEndDate,
        size,
        winnerTeamId: data.winnerTeamId?.trim() || null,
        prizePool: data.prizePool,
      });
      const saved = normalizeEventRecord(res.data);
      setEvents((prev) =>
        dedupeEventRecords(prev.map((item) => (item.id === saved.id ? saved : item)))
      );
    } else {
      const size = data.size ?? data.eventTier ?? "Small";
      const res = await httpClient.post<EventRecord>("/events", {
        name: nextName,
        logoSlug: data.logoSlug?.trim() ?? null,
        date: nextDate,
        endDate: nextEndDate,
        size,
        winnerTeamId: data.winnerTeamId?.trim() || null,
        prizePool: data.prizePool,
      });
      const created = normalizeEventRecord(res.data);
      setEvents((prev) => dedupeEventRecords([...prev, created]));
    }
    await reloadMatchesAndBets();
  };

  const deleteEvent = async (identity: EventIdentity) => {
    const matchingBets = findBetsForEvent(identity, allBets, events, matches);
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

    const record = findStoredEvent({ id: identity.id }, events);
    if (record) {
      await httpClient.delete(`/events/${record.id}`);
      setEvents((prev) => prev.filter((item) => item.id !== record.id));
    }

    const name = record?.name.trim() ?? "";
    const relatedPickems = pickems.filter(
      (item) => item.eventName.trim() === name
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

  const addPickemMajor = async (eventName: string) => {
    if (!profile) return;
    const name = eventName.trim();
    const res = await httpClient.post<PickemMajor>("/pickems", {
      profileId: profile.id,
      eventName: name,
      stages: [],
    });
    const created = normalizePickemMajor(res.data);
    setPickems((prev) => [...prev, created]);
  };

  const configurePickemStages = async (major: PickemMajor, presetId: PickemStagePresetId) => {
    const stages = createPickemStagesForPreset(presetId);
    const res = await httpClient.patch<PickemMajor>(`/pickems/${major.id}`, { stages });
    const saved = normalizePickemMajor(res.data);
    setPickems((prev) => prev.map((item) => (item.id === saved.id ? saved : item)));
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
    const medal: ProfileMedal = {
      id: crypto.randomUUID(),
      imageUrl: imageData,
      createdAt: todayIsoDateLocal(),
    };
    const nextMedals = [...(profile.medals ?? []), medal];
    const res = await httpClient.patch<Profile>(`/profiles/${profile.id}`, { medals: nextMedals });
    const saved = normalizeProfile(res.data);
    setProfile(saved);
    setMedals(saved.medals ?? []);
  };

  const deleteMedal = async (medal: ProfileMedal) => {
    if (!profile) return;
    const nextMedals = (profile.medals ?? []).filter((item) => item.id !== medal.id);
    const res = await httpClient.patch<Profile>(`/profiles/${profile.id}`, { medals: nextMedals });
    const saved = normalizeProfile(res.data);
    setProfile(saved);
    setMedals(saved.medals ?? []);
  };

  const applyBetSettlements = async (
    matchList: Match[],
    betsSource: Bet[],
  ): Promise<MatchSettlementResult> => {
    const plan = matchList.flatMap((item) =>
      planMatchBetRecalculations(item, betsSource, matchList),
    );
    const skipped = matchList.reduce(
      (sum, item) => sum + countSkippedWaitBets(item, betsSource, matchList),
      0,
    );
    if (plan.length === 0) {
      return { settled: 0, skipped };
    }

    const savedBets = await executeBetSettlementPlan(plan);
    const nextAllBets = mergeSavedBets(betsSource, savedBets);
    setAllBets(nextAllBets);

    const affectedProfileIds = new Set(plan.map(({ bet }) => bet.profileId));
    await syncProfilesForBets(affectedProfileIds, nextAllBets, profiles);

    if (profile && affectedProfileIds.has(profile.id)) {
      setBets(nextAllBets.filter((item) => item.profileId === profile.id));
    }

    return { settled: plan.length, skipped };
  };

  const settleMatchBets = async (match: Match): Promise<MatchSettlementResult> =>
    applyBetSettlements([match], allBets);

  const reloadMatchesAndBets = async () => {
    const [matchesRes, betsRes, profilesRes, eventsRes, reloadedTeams] = await Promise.all([
      httpClient.get<Match[]>("/matches"),
      httpClient.get<Bet[]>("/bets"),
      httpClient.get<Profile[]>("/profiles"),
      httpClient.get<EventRecord[]>("/events"),
      fetchTeams(),
    ]);
    const reloadedEvents = dedupeEventRecords((eventsRes.data || []).map((event) => normalizeEventRecord(event)));
    const ctx = prepareDbContext(matchesRes.data || [], reloadedEvents, reloadedTeams);
    const normalizedMatches = enrichAllMatches(ctx);
    const reloadedAllBets = enrichAllBets(normalizeStoredBets(betsRes.data || []), ctx);
    const reloadedProfiles = normalizeProfileList(profilesRes.data || []);
    const enrichedProfiles = enrichProfilesWithBets(reloadedProfiles, reloadedAllBets);

    setMatches(normalizedMatches);
    setAllBets(reloadedAllBets);
    setProfiles(enrichedProfiles);
    setEvents(reloadedEvents);
    setTeams(reloadedTeams);
    if (profile) {
      setBets(reloadedAllBets.filter((item) => item.profileId === profile.id));
      const current = enrichedProfiles.find((item) => item.id === profile.id);
      if (current) {
        setProfile(current);
        setMedals(current.medals ?? []);
      }
    }

    return { normalizedMatches, reloadedAllBets };
  };

  const syncSportsRuMatchesFromServer = async (options?: { force?: boolean; dates?: string[] }) => {
    await syncSportsRuMatches({ force: true, ...options });
    await reloadMatchesAndBets();
  };

  const refreshRankingBaseline = async (force = false) => {
    const result = await importRankingBaseline(force);
    setRankingBaseline(result.baseline);

    if (result.imported) {
      const loadedTeams = await fetchTeams();
      applyDbTeamSynonyms(loadedTeams);
      setTeams(loadedTeams);
    }

    return result.baseline;
  };

  const updateTeam = async (teamId: string, data: TeamEditInput) => {
    const res = await httpClient.patch<Team>(`/teams/${teamId}`, data);
    const saved = normalizeTeam(res.data);
    const nextTeams = (() => {
      const index = teams.findIndex((item) => item.id === saved.id);
      if (index < 0) {
        return [...teams, saved].sort((left, right) =>
          left.name.localeCompare(right.name, "ru")
        );
      }
      return teams.map((item) => (item.id === saved.id ? saved : item));
    })();

    applyDbTeamSynonyms(nextTeams);
    const teamsById = new Map(nextTeams.map((item) => [item.id, item]));
    const tournamentsById = new Map(events.map((item) => [item.id, item]));
    const nextMatches = matches.map((item) =>
      enrichMatch(item, teamsById, tournamentsById, events)
    );
    setTeams(nextTeams);
    setMatches(nextMatches);
    setAllBets((prev) =>
      prev.map((item) => {
        const match = nextMatches.find((entry) => entry.id === item.matchId) ?? null;
        return enrichBet(item, match, teamsById, tournamentsById, events);
      })
    );
    if (profile) {
      setBets((prev) =>
        prev.map((item) => {
          const match = nextMatches.find((entry) => entry.id === item.matchId) ?? null;
          return enrichBet(item, match, teamsById, tournamentsById, events);
        })
      );
    }
  };

  const updateMatch = async (match: Match, data: MatchCreateInput) => {
    const payload = prepareMatchPayload({
      ...data,
      maps: data.maps,
    });
    const res = await httpClient.patch<Match>(`/matches/${match.id}`, payload);
    const saved = normalizeMatch(res.data);
    applyDbTeamSynonyms(teams);
    const enriched = enrichMatch(
      saved,
      new Map(teams.map((item) => [item.id, item])),
      new Map(events.map((item) => [item.id, item])),
      events
    );
    setMatches((prev) => prev.map((m) => (m.id === saved.id ? enriched : m)));

    await applyBetSettlements([enriched], allBets);
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
    rankingBaseline,
    teams,
    refreshRankingBaseline,
    updateTeam,
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
    syncSportsRuMatches: syncSportsRuMatchesFromServer,
    settleMatchBets,
    deleteMatch,
    addEvent,
    updateEvent,
    deleteEvent,
    addPickemMajor,
    configurePickemStages,
    uploadPickemStageImage,
    deletePickemMajor,
    uploadMedal,
    deleteMedal,
  };
}
