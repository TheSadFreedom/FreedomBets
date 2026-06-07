import { useCallback, useEffect, useState } from "react";
import type { Bet } from "@/entities/bet";
import type { EventEditInput, EventIdentity } from "@/entities/event";
import type { EventRecord } from "@/entities/eventRecord";
import type { Match, MatchCreateInput, MatchFormValues } from "@/entities/match";
import {
  createDefaultPickemStages,
  type PickemMajor,
  type PickemStageName,
} from "@/entities/pickem";
import type { ProfileMedal } from "@/entities/medal";
import type { Profile } from "@/entities/profile";
import { todayIsoDateLocal } from "@/shared/lib/date/isoDate";
import { findBetsForEvent, findMatchesForEvent } from "@/features/events/lib/findBetsForEvent";
import { findStoredEvent } from "@/features/events/lib/mergeEventStats";
import { calcWinRate } from "@/features/bets/lib/calculations";
import { normalizeMatch } from "@/features/matches/lib/normalizeMatch";
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
    const res = await httpClient.get<Profile[]>("/profiles");
    const items = (res.data || [])
      .map((item) => {
        try {
          return normalizeProfile(item);
        } catch (err) {
          console.error(err);
          return null;
        }
      })
      .filter((item): item is Profile => item != null);
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
          httpClient.get<EventRecord[]>(`/events?profileId=${activeProfileId}`),
        ]);
      setProfile(normalizeProfile(profileRes.data));
      setBets((betsRes.data || []).map(normalizeBet));
      setAllBets((allBetsRes.data || []).map(normalizeBet));
      setProfiles(
        (profilesRes.data || [])
          .map((item) => {
            try {
              return normalizeProfile(item);
            } catch (err) {
              console.error(err);
              return null;
            }
          })
          .filter((item): item is Profile => item != null)
      );
      setMatches((matchesRes.data || []).map(normalizeMatch));
      setPickems((pickemsRes.data || []).map(normalizePickemMajor));
      setMedals(
        (medalsRes.data || [])
          .map(normalizeMedal)
          .filter((medal) => medal.profileId === activeProfileId),
      );
      setEvents((eventsRes.data || []).map(normalizeEventRecord));
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
    betsList: Bet[],
    balanceDelta: number
  ) => {
    const newBalance = currentProfile.balance + balanceDelta;
    const updated = await httpClient.patch<Profile>(`/profiles/${currentProfile.id}`, {
      balance: newBalance,
      totalBets: betsList.length,
      winRate: calcWinRate(betsList),
    });
    setProfile(normalizeProfile(updated.data));
    return newBalance;
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
    const res = await httpClient.post<Bet>("/bets", { ...data, profileId: profile.id });
    const created = normalizeBet(res.data);
    const nextBets = [...bets, created];
    setBets(nextBets);
    setAllBets((prev) => [...prev, created]);
    await syncProfile(profile, nextBets, -data.amount);
  };

  const updateBet = async (updated: Bet, previous: Bet) => {
    if (!profile) return;
    const res = await httpClient.patch<Bet>(`/bets/${updated.id}`, updated);
    const saved = normalizeBet(res.data);
    const nextBets = bets.map((b) => (b.id === saved.id ? saved : b));

    let balanceDelta = 0;
    if (previous.status === "WAIT" && saved.status === "WAIT") {
      balanceDelta = previous.amount - saved.amount;
    }

    setBets(nextBets);
    setAllBets((prev) => prev.map((item) => (item.id === saved.id ? saved : item)));
    if (balanceDelta !== 0) {
      await syncProfile(profile, nextBets, balanceDelta);
    } else {
      await syncProfile(profile, nextBets, 0);
    }
  };

  const deleteBet = async (bet: Bet) => {
    if (!profile) return;
    await httpClient.delete(`/bets/${bet.id}`);
    const nextBets = bets.filter((b) => b.id !== bet.id);
    const correction =
      bet.status === "WAIT"
        ? bet.amount
        : bet.status === "WIN"
          ? -bet.amount * bet.odds
          : 0;
    setBets(nextBets);
    setAllBets((prev) => prev.filter((item) => item.id !== bet.id));
    await syncProfile(profile, nextBets, correction);
  };

  const settleWin = async (id: string) => {
    if (!profile) return;
    const bet = bets.find((b) => b.id === id);
    if (!bet || bet.status !== "WAIT") return;

    const res = await httpClient.patch<Bet>(`/bets/${id}`, { status: "WIN" });
    const saved = normalizeBet(res.data);
    const nextBets = bets.map((b) => (b.id === id ? saved : b));
    setBets(nextBets);
    setAllBets((prev) => prev.map((item) => (item.id === id ? saved : item)));
    await syncProfile(profile, nextBets, bet.amount * bet.odds);
  };

  const settleLose = async (id: string) => {
    if (!profile) return;
    const bet = bets.find((b) => b.id === id);
    if (!bet || bet.status !== "WAIT") return;

    const res = await httpClient.patch<Bet>(`/bets/${id}`, { status: "LOSE" });
    const saved = normalizeBet(res.data);
    const nextBets = bets.map((b) => (b.id === id ? saved : b));
    setBets(nextBets);
    setAllBets((prev) => prev.map((item) => (item.id === id ? saved : item)));
    await syncProfile(profile, nextBets, 0);
  };

  const revertToPending = async (id: string) => {
    if (!profile) return;
    const bet = bets.find((b) => b.id === id);
    if (!bet || bet.status === "WAIT") return;

    const res = await httpClient.patch<Bet>(`/bets/${id}`, { status: "WAIT" });
    const saved = normalizeBet(res.data);
    const nextBets = bets.map((b) => (b.id === id ? saved : b));
    setBets(nextBets);
    setAllBets((prev) => prev.map((item) => (item.id === id ? saved : item)));

    const balanceDelta = bet.status === "WIN" ? -bet.amount * bet.odds : 0;
    await syncProfile(profile, nextBets, balanceDelta);
  };

  const setBalance = async (balance: number) => {
    if (!profile) return;
    const res = await httpClient.patch<Profile>(`/profiles/${profile.id}`, {
      balance,
      totalBets: bets.length,
      winRate: calcWinRate(bets),
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
    const res = await httpClient.patch<Profile>(`/profiles/${profile.id}`, {
      name: trimmed,
      balance: profile.balance,
      totalBets: bets.length,
      winRate: calcWinRate(bets),
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
      ...events.map((event) => httpClient.delete(`/events/${event.id}`)),
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
    if (!profile) return;
    const res = await httpClient.post<EventRecord>("/events", {
      profileId: profile.id,
      eventOrganization: data.eventOrganization.trim(),
      eventName: data.eventName.trim(),
      date: data.date.trim() || todayIsoDateLocal(),
      endDate: data.endDate.trim(),
      eventTier: data.eventTier,
    });
    const created = normalizeEventRecord(res.data);
    setEvents((prev) => [...prev, created]);
  };

  const updateEvent = async (identity: EventIdentity, data: EventEditInput) => {
    if (!profile) return;

    const nextOrganization = data.eventOrganization.trim();
    const nextName = data.eventName.trim();
    const updateEventDates = !identity.majorStage || identity.allMajorStages;
    const nextDate = data.date.trim() || todayIsoDateLocal();
    const nextEndDate = data.endDate.trim();
    const recordIdentity = { eventOrganization: nextOrganization, eventName: nextName };
    const record = findStoredEvent(recordIdentity, events);

    if (record) {
      const res = await httpClient.patch<EventRecord>(`/events/${record.id}`, {
        ...record,
        eventOrganization: nextOrganization,
        eventName: nextName,
        date: updateEventDates ? nextDate : record.date,
        endDate: updateEventDates ? nextEndDate : record.endDate,
        eventTier: data.eventTier,
      });
      const saved = normalizeEventRecord(res.data);
      setEvents((prev) => prev.map((item) => (item.id === saved.id ? saved : item)));
    } else if (updateEventDates) {
      const res = await httpClient.post<EventRecord>("/events", {
        profileId: profile.id,
        eventOrganization: nextOrganization,
        eventName: nextName,
        date: nextDate,
        endDate: nextEndDate,
        eventTier: data.eventTier,
      });
      const created = normalizeEventRecord(res.data);
      setEvents((prev) => [...prev, created]);
    }

    const matchingBets = findBetsForEvent(identity, bets);
    const matchingMatches = findMatchesForEvent(identity, matches);

    const savedBets = await Promise.all(
      matchingBets.map(async (bet) => {
        const patch = {
          eventOrganization: nextOrganization,
          eventName: nextName,
          date: nextDate,
          eventTier: data.eventTier,
          majorStage: data.eventTier === "Major" ? bet.majorStage : null,
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
          majorStage: data.eventTier === "Major" ? match.majorStage : null,
        };
        const res = await httpClient.patch<Match>(`/matches/${match.id}`, { ...match, ...patch });
        return normalizeMatch(res.data);
      })
    );

    if (savedBets.length > 0) {
      const savedById = new Map(savedBets.map((bet) => [bet.id, bet]));
      const nextBets = bets.map((bet) => savedById.get(bet.id) ?? bet);
      setBets(nextBets);
      await syncProfile(profile, nextBets, 0);
    }

    if (savedMatches.length > 0) {
      const savedById = new Map(savedMatches.map((match) => [match.id, match]));
      setMatches((prev) => prev.map((match) => savedById.get(match.id) ?? match));
    }
  };

  const addPickemMajor = async (eventOrganization: string, eventName: string) => {
    if (!profile) return;
    const res = await httpClient.post<PickemMajor>("/pickems", {
      profileId: profile.id,
      eventOrganization: eventOrganization.trim(),
      eventName: eventName.trim(),
      stages: createDefaultPickemStages(),
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

  const updateMatch = async (match: Match, data: MatchCreateInput) => {
    const payload: MatchFormValues = {
      ...data,
      score1: data.score1 ?? null,
      score2: data.score2 ?? null,
      status: match.status,
    };
    const res = await httpClient.patch<Match>(`/matches/${match.id}`, payload);
    const saved = normalizeMatch(res.data);
    setMatches((prev) => prev.map((m) => (m.id === saved.id ? saved : m)));
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
    deleteMatch,
    addEvent,
    updateEvent,
    addPickemMajor,
    uploadPickemStageImage,
    deletePickemMajor,
    uploadMedal,
    deleteMedal,
  };
}
