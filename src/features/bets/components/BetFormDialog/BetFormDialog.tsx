import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Dialog,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import GpsFixedOutlinedIcon from "@mui/icons-material/GpsFixedOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import LooksOneOutlinedIcon from "@mui/icons-material/LooksOneOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import ScoreboardOutlinedIcon from "@mui/icons-material/ScoreboardOutlined";
import type { Bet, BetMarket, BetTeamSide, MatchFormat } from "@/entities/bet";
import type { EventRecord } from "@/entities/eventRecord";
import type { Match } from "@/entities/match";
import { parseIsoDate } from "@/shared/lib/date/isoDate";
import DateInput, { type DateInputHandle } from "@/shared/ui/DateInput/DateInput";
import {
  AT_LEAST_ONE_MAP_LABELS,
  BET_MARKET_LABELS,
  BET_MARKETS,
  BO3_EXACT_SCORES,
  MAPS_TOTAL_SIDE_LABELS,
  MATCH_FORMATS,
  PISTOL_ROUNDS_PER_MAP,
  exactScoreWinnerSide,
  customBetText,
  formatBetDescription,
  formatExactScoreLabel,
  getMapCount,
  isCustomBetType,
  normalizeBetTargets,
} from "@/entities/bet";
import {
  BET_AMOUNT_PERCENT_PRESETS,
  betAmountFromBalancePercent,
} from "@/features/bets/lib/amountPresets";
import { getBetFormSuggestions } from "@/features/bets/lib/formSuggestions";
import { eventSelectKey, getEventSelectOptions } from "@/features/events/lib/eventDisplay";
import {
  findMatchForBetFields,
  formatMatchSecondaryLabel,
  formatMatchTeamsLabel,
  getMatchSelectOptions,
} from "@/features/matches/lib/matchDisplay";
import EventLogo from "@/shared/ui/EventLogo/EventLogo";
import SuggestTextField from "@/shared/ui/SuggestTextField/SuggestTextField";
import TimeInput, { type TimeInputHandle } from "@/shared/ui/TimeInput/TimeInput";
import TeamLogo from "@/shared/ui/TeamLogo/TeamLogo";
import { isValidBetAmount, MAX_BET_AMOUNT } from "@/shared/lib/limits";
import {
  AmountPresetChip,
  ChipRow,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogShell,
  FieldsGrid,
  FieldsStack,
  FooterButtonPrimary,
  FooterButtonSecondary,
  FormatChip,
  HeaderIcon,
  HeaderSubtitle,
  HeaderText,
  HeaderTitle,
  MarketChip,
  MarketChipGrid,
  PreviewCard,
  PreviewLabel,
  PreviewMeta,
  PreviewText,
  Section,
  SectionHint,
  SectionTitle,
  TeamPickButton,
  TeamPickLogoWrap,
  TeamPickName,
  TeamPickPlaceholder,
  TeamPickRow,
  dialogBackdropSx,
  dialogPaperSx,
  fieldSx,
} from "./BetFormDialog.styled";

const normalizeFormat = (value: string): MatchFormat =>
  MATCH_FORMATS.includes(value as MatchFormat) ? (value as MatchFormat) : "BO3";

const MAX_CUSTOM_BET_TYPE_LENGTH = 80;

const MARKET_ICONS: Record<BetMarket, typeof EmojiEventsOutlinedIcon> = {
  match: EmojiEventsOutlinedIcon,
  map: MapOutlinedIcon,
  pistol: GpsFixedOutlinedIcon,
  mapsTotal: FilterListOutlinedIcon,
  atLeastOneMap: LooksOneOutlinedIcon,
  exactScore: ScoreboardOutlinedIcon,
  custom: EditNoteOutlinedIcon,
};

const isCustomMarket = (market: BetMarket) => market === "custom";

const isMapsTotalMarket = (market: BetMarket) => market === "mapsTotal";
const isAtLeastOneMapMarket = (market: BetMarket) => market === "atLeastOneMap";
const isExactScoreMarket = (market: BetMarket) => market === "exactScore";
const isMultiMapFormat = (format: MatchFormat) => format === "BO3" || format === "BO5";

const marketForFormat = (format: MatchFormat, market: BetMarket): BetMarket => {
  if (format !== "BO3" && (isMapsTotalMarket(market) || isExactScoreMarket(market))) {
    return "match";
  }
  if (!isMultiMapFormat(format) && isAtLeastOneMapMarket(market)) return "match";
  return market;
};

const toAmountInput = (value: number) => (value > 0 ? String(value) : "");
const toOddsInput = (value: number) => (value > 0 ? String(value) : "");

const parseAmountInput = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return NaN;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : NaN;
};

const parseOddsInput = (value: string) => {
  const trimmed = value.trim().replace(",", ".");
  if (!trimmed) return NaN;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : NaN;
};

export type BetFormValues = Omit<Bet, "id">;

export type BetFormSeed = Partial<
  Pick<
    BetFormValues,
    | "date"
    | "time"
    | "format"
    | "organization1"
    | "organization2"
    | "eventOrganization"
    | "eventName"
    | "majorStage"
    | "betMarket"
    | "betTeam"
    | "mapNumber"
    | "pistolRound"
    | "yesNo"
    | "exactScore1"
    | "exactScore2"
    | "amount"
    | "odds"
  >
> & {
  matchId?: string;
};

interface BetFormDialogProps {
  open: boolean;
  title: string;
  initial?: Bet;
  seed?: BetFormSeed;
  profileId: number;
  balance: number;
  bets: Bet[];
  events?: EventRecord[];
  matches?: Match[];
  onClose: () => void;
  onSubmit: (values: BetFormValues) => void | Promise<void>;
}

const emptyForm = (profileId: number): BetFormValues => {
  const base: BetFormValues = {
    profileId,
    matchId: "",
    date: "",
    time: "12:00",
    format: "BO3",
    team1Id: "",
    team2Id: "",
    organization1: "",
    organization2: "",
    eventId: "",
    eventName: "",
    betMarket: "match",
    betTeam: 1,
    betTeamId: null,
    mapNumber: null,
    pistolRound: null,
    yesNo: null,
    exactScore1: null,
    exactScore2: null,
    betType: "",
    amount: 100,
    odds: 1.5,
    eventOrganization: "",
    majorStage: null,
    status: "WAIT",
  };
  const targets = normalizeBetTargets(base);
  const merged = { ...base, ...targets };
  return { ...merged, betType: formatBetDescription(merged) };
};

const BetFormDialog = ({
  open,
  title,
  initial,
  seed,
  profileId,
  balance,
  bets,
  events = [],
  matches = [],
  onClose,
  onSubmit,
}: BetFormDialogProps) => {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState<BetFormValues>(() => emptyForm(profileId));
  const [selectedMatchId, setSelectedMatchId] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [oddsInput, setOddsInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const dateRef = useRef<DateInputHandle>(null);
  const timeRef = useRef<TimeInputHandle>(null);
  const formInitialized = useRef(false);

  const suggestions = useMemo(() => getBetFormSuggestions(bets), [bets]);
  const eventSource = useMemo(():
    | Pick<Bet, "eventId" | "eventName">
    | null => {
    if (initial) return initial;
    if (seed?.eventName?.trim()) {
      return {
        eventId: "",
        eventName: seed.eventName ?? "",
      };
    }
    return null;
  }, [initial, seed]);
  const eventOptions = useMemo(
    () =>
      getEventSelectOptions(bets, events, eventSource),
    [bets, events, eventSource]
  );
  const selectedEventKey =
    form.eventId.trim() || form.eventName.trim()
      ? eventSelectKey(form)
      : "";
  const matchOptions = useMemo(() => {
    const includeIds = [...new Set([seed?.matchId, selectedMatchId].filter(Boolean))] as string[];
    const options = getMatchSelectOptions(matches, {
      ...(form.date.trim() ? { onDate: form.date.trim() } : {}),
      includeIds: includeIds.length > 0 ? includeIds : undefined,
    });
    if (!seed?.eventName?.trim()) return options;
    const name = (seed.eventName ?? "").trim().toLowerCase();
    return options.filter(
      ({ match }) =>
        (match.eventName ?? "").trim().toLowerCase() === name
    );
  }, [matches, seed, selectedMatchId, form.date]);
  const selectedMatchOption = useMemo(
    () => matchOptions.find((item) => item.id === selectedMatchId),
    [matchOptions, selectedMatchId]
  );

  const presetMarkets = useMemo(
    () =>
      BET_MARKETS.filter((market) => {
        if (market === "custom") return false;
        if (market === "mapsTotal" || market === "exactScore") return form.format === "BO3";
        if (market === "atLeastOneMap") return isMultiMapFormat(form.format);
        return true;
      }),
    [form.format]
  );
  const mapCount = getMapCount(form.format);
  const mapOptions = useMemo(
    () => Array.from({ length: mapCount }, (_, i) => i + 1),
    [mapCount]
  );

  const description = formatBetDescription(form);
  const parsedAmount = parseAmountInput(amountInput);
  const parsedOdds = parseOddsInput(oddsInput);
  const potentialWin =
    parsedAmount > 0 && parsedOdds > 0 ? Math.round(parsedAmount * parsedOdds) : null;

  const applyMatch = (match: Match) => {
    setForm((prev) => {
      const next: BetFormValues = {
        ...prev,
        matchId: match.id,
        date: match.date,
        time: match.time,
        format: match.format,
        team1Id: match.team1Id,
        team2Id: match.team2Id,
        organization1: match.organization1 ?? "",
        organization2: match.organization2 ?? "",
        eventId: match.eventId,
        eventName: match.eventName ?? "",
        eventOrganization: match.eventName ?? "",
        majorStage: null,
        betMarket: marketForFormat(match.format, prev.betMarket),
      };
      const targets = normalizeBetTargets(next);
      return {
        ...next,
        ...targets,
        betType: formatBetDescription({ ...next, ...targets }),
      };
    });
  };

  useEffect(() => {
    if (!open) {
      formInitialized.current = false;
      return;
    }
    if (formInitialized.current) return;
    formInitialized.current = true;

    if (initial) {
      setSelectedMatchId(initial.matchId?.trim() ?? "");
      const format = normalizeFormat(initial.format);
      const isCustom =
        initial.betMarket === "custom" || isCustomBetType(initial.betType ?? "");
      const draft: BetFormValues = {
        profileId: initial.profileId,
        matchId: initial.matchId?.trim() ?? "",
        date: initial.date,
        time: initial.time,
        format,
        team1Id: initial.team1Id,
        team2Id: initial.team2Id,
        organization1: initial.organization1,
        organization2: initial.organization2,
        eventId: initial.eventId,
        eventName: initial.eventName,
        betTeamId: initial.betTeamId,
        betMarket: isCustom ? "custom" : initial.betMarket,
        betTeam: initial.betTeam,
        mapNumber: initial.mapNumber,
        pistolRound: initial.pistolRound,
        yesNo: initial.yesNo,
        exactScore1: initial.exactScore1,
        exactScore2: initial.exactScore2,
        betType: isCustom ? customBetText(initial.betType ?? "") : initial.betType,
        amount: initial.amount,
        odds: initial.odds,
        eventOrganization: initial.eventOrganization,
        majorStage: initial.majorStage,
        status: initial.status,
      };
      const targets = normalizeBetTargets(draft);
      const merged = {
        ...draft,
        ...targets,
        betType: isCustom
          ? draft.betType
          : formatBetDescription({ ...draft, ...targets }),
      };
      setForm(merged);
      setAmountInput(toAmountInput(merged.amount));
      setOddsInput(toOddsInput(merged.odds));
    } else {
      const empty = emptyForm(profileId);
      const draft = seed ? { ...empty, ...seed } : empty;
      const seededMatch = seed?.matchId
        ? matches.find((match) => match.id === seed.matchId)
        : findMatchForBetFields(seed ?? draft, matches);
      if (seededMatch) {
        Object.assign(draft, {
          matchId: seededMatch.id,
          team1Id: seededMatch.team1Id,
          team2Id: seededMatch.team2Id,
          eventId: seededMatch.eventId,
          date: seededMatch.date,
          time: seededMatch.time,
          format: normalizeFormat(seededMatch.format),
          organization1: seededMatch.organization1 ?? "",
          organization2: seededMatch.organization2 ?? "",
          eventOrganization: seededMatch.eventName ?? "",
          eventName: seededMatch.eventName ?? "",
          majorStage: null,
        });
      }
      const targets = normalizeBetTargets(draft);
      const merged = {
        ...draft,
        ...targets,
        betType: formatBetDescription({ ...draft, ...targets }),
      };
      setForm(merged);
      setAmountInput(toAmountInput(merged.amount));
      setOddsInput(toOddsInput(merged.odds));
      setSelectedMatchId(seededMatch?.id ?? "");
    }
  }, [open, initial, seed, profileId, matches, events]);

  const pickExactScore = (score1: number, score2: number) => {
    setForm((prev) => {
      const next = {
        ...prev,
        exactScore1: score1,
        exactScore2: score2,
        betTeam: exactScoreWinnerSide(score1, score2),
      };
      const targets = normalizeBetTargets(next);
      return {
        ...next,
        ...targets,
        betType: formatBetDescription({ ...next, ...targets }),
      };
    });
  };

  const update = <K extends keyof BetFormValues>(key: K, value: BetFormValues[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "betMarket") {
        const market = value as BetMarket;
        if (market === "custom") {
          const targets = normalizeBetTargets({ ...next, betMarket: "custom" });
          return {
            ...next,
            betMarket: "custom",
            ...targets,
            betType: customBetText(next.betType) || "",
          };
        }
      }
      if (key === "betType" && next.betMarket === "custom") {
        return { ...next, betType: String(value).trim() };
      }
      if (key === "format") {
        const format = value as MatchFormat;
        const withFormat = {
          ...next,
          format,
          betMarket: marketForFormat(format, next.betMarket),
        };
        const targets = normalizeBetTargets(withFormat);
        return {
          ...withFormat,
          ...targets,
          betType: formatBetDescription({ ...withFormat, ...targets }),
        };
      }
      if (
        key === "betMarket" ||
        key === "betTeam" ||
        key === "mapNumber" ||
        key === "pistolRound" ||
        key === "yesNo" ||
        key === "organization1" ||
        key === "organization2"
      ) {
        if (next.betMarket === "custom") {
          return next;
        }
        const targets = normalizeBetTargets(next);
        const merged = { ...next, ...targets };
        if (
          merged.betMarket === "exactScore" &&
          merged.exactScore1 != null &&
          merged.exactScore2 != null
        ) {
          merged.betTeam = exactScoreWinnerSide(merged.exactScore1, merged.exactScore2);
        }
        return {
          ...merged,
          betType: formatBetDescription(merged),
        };
      }
      return next;
    });
  };

  const handleDateChange = (iso: string) => {
    update("date", iso);
    if (!selectedMatchId) return;
    const match = matches.find((item) => item.id === selectedMatchId);
    if (match && iso && match.date !== iso) {
      setSelectedMatchId("");
    }
  };

  const buildPayload = (): BetFormValues => {
    const date = dateRef.current?.commit() ?? form.date;
    const time = timeRef.current?.commit() ?? form.time;
    const targets = normalizeBetTargets(form);
    const merged = {
      ...form,
      date,
      time,
      ...targets,
      amount: parsedAmount,
      odds: parsedOdds,
    };
    const matchId =
      selectedMatchId.trim() || seed?.matchId?.trim() || form.matchId.trim() || "";
    return {
      ...merged,
      matchId,
      betType: formatBetDescription(merged),
    };
  };

  const handleSubmit = async () => {
    const payload = buildPayload();
    if (
      !isValidBetAmount(payload.amount) ||
      !Number.isFinite(payload.odds) ||
      payload.odds <= 0 ||
      !payload.eventName.trim() ||
      (!isEdit && !parseIsoDate(payload.date.trim()))
    ) {
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(payload);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const team1Name = form.organization1.trim();
  const team2Name = form.organization2.trim();
  const team1Label = team1Name || "Команда 1";
  const team2Label = team2Name || "Команда 2";

  const valid =
    isValidBetAmount(parsedAmount) &&
    parsedOdds > 0 &&
    form.eventName.trim() &&
    form.organization1.trim() &&
    form.organization2.trim() &&
    (isEdit || (Boolean(parseIsoDate(form.date.trim())) && Boolean(selectedMatchId))) &&
    (isCustomMarket(form.betMarket)
      ? Boolean(form.betType.trim())
      : (isMapsTotalMarket(form.betMarket) ||
          form.betMarket === "match" ||
          isAtLeastOneMapMarket(form.betMarket) ||
          isExactScoreMarket(form.betMarket) ||
          (form.mapNumber != null && form.mapNumber >= 1 && form.mapNumber <= mapCount)) &&
        (form.betMarket !== "pistol" || form.pistolRound === 1 || form.pistolRound === 2));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: { sx: dialogPaperSx },
        backdrop: { sx: dialogBackdropSx },
      }}
    >
      <DialogShell>
        <DialogHeader>
          <HeaderIcon>{isEdit ? <EditOutlinedIcon /> : <PostAddOutlinedIcon />}</HeaderIcon>
          <HeaderText>
            <HeaderTitle>{title}</HeaderTitle>
            <HeaderSubtitle>
              {isEdit
                ? "Измените параметры — описание обновится автоматически"
                : "Выберите матч и тип ставки"}
            </HeaderSubtitle>
          </HeaderText>
          <IconButton
            onClick={onClose}
            aria-label="Закрыть"
            size="small"
            sx={{ color: "rgba(255,255,255,0.5)", mt: -0.5 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogHeader>

        <DialogBody>
          <PreviewCard>
            <PreviewLabel>Итоговая ставка</PreviewLabel>
            <PreviewText>{description}</PreviewText>
            <PreviewMeta>
              Выплата при выигрыше:{" "}
              <strong>
                {potentialWin != null
                  ? `${potentialWin.toLocaleString("ru-RU")} ₽`
                  : "—"}
              </strong>
              {" · "}
              {form.format}
            </PreviewMeta>
          </PreviewCard>

          {isEdit ? (
            <>
              <Section>
                <SectionTitle>Когда</SectionTitle>
                <FieldsGrid $twoCol>
                  <DateInput
                    ref={dateRef}
                    label="Дата"
                    value={form.date}
                    onChange={handleDateChange}
                    fullWidth
                    sx={fieldSx}
                  />
                  <TimeInput
                    ref={timeRef}
                    label="Время"
                    value={form.time}
                    onChange={(value) => update("time", value)}
                    fullWidth
                    sx={fieldSx}
                  />
                </FieldsGrid>
              </Section>

              <Section>
                <SectionTitle>Турнир и формат</SectionTitle>
                <FieldsStack>
                  <ChipRow>
                    {MATCH_FORMATS.map((fmt) => (
                      <FormatChip
                        key={fmt}
                        type="button"
                        $format={fmt}
                        $active={form.format === fmt}
                        onClick={() => update("format", fmt)}
                      >
                        {fmt}
                      </FormatChip>
                    ))}
                  </ChipRow>
                  <FormControl
                    fullWidth
                    size="small"
                    sx={fieldSx}
                    disabled={eventOptions.length === 0}
                  >
                    <InputLabel>Турнир</InputLabel>
                    <Select
                      value={selectedEventKey}
                      label="Турнир"
                      onChange={(e) => {
                        const option = eventOptions.find((item) => item.key === e.target.value);
                        if (!option) return;
                    setForm((prev) => ({
                      ...prev,
                      eventId: option.eventId,
                      eventName: option.eventName,
                      eventOrganization: option.eventName,
                    }));
                  }}
                  renderValue={(value) => {
                    if (!value) return "";
                    const option = eventOptions.find((item) => item.key === value);
                    if (!option) return value;
                    return (
                      <Box display="flex" alignItems="center" gap={1} minWidth={0}>
                        <EventLogo
                          logoSlug={option.logoSlug}
                          label={option.eventOrganization}
                          size={22}
                        />
                        <Typography variant="body2" noWrap sx={{ flex: 1, minWidth: 0 }}>
                          {option.label}
                        </Typography>
                      </Box>
                    );
                  }}
                >
                  {eventOptions.map((option) => (
                    <MenuItem key={option.key} value={option.key} sx={{ py: 0.75 }}>
                      <Box display="flex" alignItems="center" gap={1.25} minWidth={0}>
                        <EventLogo
                          logoSlug={option.logoSlug}
                          label={option.eventOrganization}
                          size={24}
                        />
                        <Box minWidth={0}>
                          <Typography variant="body2" noWrap title={option.eventOrganization}>
                            {option.eventOrganization}
                          </Typography>
                          {option.eventName ? (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              noWrap
                              display="block"
                              title={option.eventName}
                            >
                              {option.eventName}
                            </Typography>
                          ) : null}
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
                  <SectionHint>
                    На каждой карте по {PISTOL_ROUNDS_PER_MAP} пистолетных раунда.
                  </SectionHint>
                </FieldsStack>
              </Section>

              <Section>
                <SectionTitle>Команды</SectionTitle>
                <FieldsGrid $twoCol>
                  <SuggestTextField
                    label="Команда 1"
                    value={form.organization1}
                    options={suggestions.teams}
                    onChange={(value) => update("organization1", value)}
                    logo="team"
                    sx={fieldSx}
                  />
                  <SuggestTextField
                    label="Команда 2"
                    value={form.organization2}
                    options={suggestions.teams}
                    onChange={(value) => update("organization2", value)}
                    logo="team"
                    sx={fieldSx}
                  />
                </FieldsGrid>
              </Section>
            </>
          ) : (
            <>
              <Section>
                <SectionTitle>Когда</SectionTitle>
                <FieldsGrid $twoCol>
                  <DateInput
                    ref={dateRef}
                    label="Дата"
                    value={form.date}
                    onChange={handleDateChange}
                    allowEmpty
                    fullWidth
                    sx={fieldSx}
                  />
                  <TimeInput
                    ref={timeRef}
                    label="Время"
                    value={form.time}
                    onChange={(value) => update("time", value)}
                    fullWidth
                    sx={fieldSx}
                  />
                </FieldsGrid>
              </Section>

              <Section>
                <SectionTitle>Матч</SectionTitle>
                <FieldsStack>
                  <FormControl
                    fullWidth
                    size="small"
                    sx={fieldSx}
                    disabled={!form.date.trim() || matchOptions.length === 0}
                  >
                  <InputLabel>Матч</InputLabel>
                  <Select
                    value={selectedMatchId}
                    label="Матч"
                    onChange={(e) => {
                      const id = e.target.value;
                      const option = matchOptions.find((item) => item.id === id);
                      if (!option) return;
                      setSelectedMatchId(id);
                      applyMatch(option.match);
                    }}
                    renderValue={(value) => {
                      if (!value) return "";
                      const option = matchOptions.find((item) => item.id === value);
                      if (!option) return value;
                      return (
                        <Box display="flex" alignItems="center" gap={1} minWidth={0}>
                          <TeamLogo name={option.match.organization1 ?? ""} size={22} />
                          <Typography variant="body2" noWrap sx={{ flexShrink: 0 }}>
                            vs
                          </Typography>
                          <TeamLogo name={option.match.organization2 ?? ""} size={22} />
                          <Typography variant="body2" noWrap sx={{ flex: 1, minWidth: 0, ml: 0.5 }}>
                            {formatMatchTeamsLabel(option.match)}
                          </Typography>
                        </Box>
                      );
                    }}
                  >
                    {matchOptions.map((option) => (
                      <MenuItem key={option.id} value={option.id} sx={{ py: 0.75 }}>
                        <Box display="flex" alignItems="center" gap={1.25} minWidth={0} width="100%">
                          <TeamLogo name={option.match.organization1 ?? ""} size={24} />
                          <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
                            vs
                          </Typography>
                          <TeamLogo name={option.match.organization2 ?? ""} size={24} />
                          <Box minWidth={0} flex={1}>
                            <Typography variant="body2" noWrap title={option.primary}>
                              {option.primary}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              noWrap
                              display="block"
                              title={option.secondary}
                            >
                              {option.secondary}
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {!form.date.trim() ? (
                  <SectionHint>Выберите дату — покажем матчи на этот день</SectionHint>
                ) : matchOptions.length === 0 ? (
                  <SectionHint>
                    Нет матчей на выбранную дату — создайте матч кнопкой «Новый матч»
                  </SectionHint>
                ) : selectedMatchOption ? (
                  <>
                    <SectionHint>
                      {formatMatchSecondaryLabel(selectedMatchOption.match)}
                    </SectionHint>
                  </>
                ) : null}
                </FieldsStack>
              </Section>
            </>
          )}

          <Section>
            <SectionTitle>Тип ставки</SectionTitle>
            <FieldsStack>
              <MarketChipGrid>
                {presetMarkets.map((market) => {
                  const Icon = MARKET_ICONS[market];
                  return (
                    <MarketChip
                      key={market}
                      type="button"
                      $market={market}
                      $active={form.betMarket === market}
                      onClick={() => update("betMarket", market)}
                    >
                      <Icon />
                      {BET_MARKET_LABELS[market]}
                    </MarketChip>
                  );
                })}
                <MarketChip
                  type="button"
                  $market="custom"
                  $fullWidth
                  $active={form.betMarket === "custom"}
                  onClick={() => update("betMarket", "custom")}
                >
                  <EditNoteOutlinedIcon />
                  {BET_MARKET_LABELS.custom}
                </MarketChip>
              </MarketChipGrid>

              {isCustomMarket(form.betMarket) ? (
                <TextField
                  label="Описание ставки"
                  placeholder="Например: тотал раундов больше 26"
                  value={form.betType}
                  onChange={(e) => update("betType", e.target.value)}
                  fullWidth
                  sx={fieldSx}
                  slotProps={{
                    htmlInput: { maxLength: MAX_CUSTOM_BET_TYPE_LENGTH },
                  }}
                />
              ) : isMapsTotalMarket(form.betMarket) ? (
                <>
                  <SectionTitle style={{ marginTop: 4, marginBottom: 8 }}>
                    Вариант
                  </SectionTitle>
                  <TeamPickRow>
                    <TeamPickButton
                      type="button"
                      $active={form.betTeam === 1}
                      onClick={() => update("betTeam", 1 as BetTeamSide)}
                    >
                      <TeamPickName>{MAPS_TOTAL_SIDE_LABELS.under}</TeamPickName>
                    </TeamPickButton>
                    <TeamPickButton
                      type="button"
                      $active={form.betTeam === 2}
                      onClick={() => update("betTeam", 2 as BetTeamSide)}
                    >
                      <TeamPickName>{MAPS_TOTAL_SIDE_LABELS.over}</TeamPickName>
                    </TeamPickButton>
                  </TeamPickRow>
                  <SectionHint>2-0 — меньше 2,5 · 2-1 — больше 2,5</SectionHint>
                </>
              ) : isExactScoreMarket(form.betMarket) ? (
                <>
                  <SectionTitle style={{ marginTop: 4, marginBottom: 8 }}>
                    Счёт серии
                  </SectionTitle>
                  <TeamPickRow>
                    {BO3_EXACT_SCORES.map((score) => {
                      const active =
                        form.exactScore1 === score.score1 && form.exactScore2 === score.score2;
                      const winnerIsTeam1 = score.score1 > score.score2;
                      const winnerLabel = winnerIsTeam1 ? team1Label : team2Label;
                      return (
                        <TeamPickButton
                          key={`${score.score1}-${score.score2}`}
                          type="button"
                          $active={active}
                          onClick={() => pickExactScore(score.score1, score.score2)}
                        >
                          <TeamPickName>
                            {formatExactScoreLabel(score.score1, score.score2)}
                          </TeamPickName>
                          <SectionHint style={{ margin: 0, fontSize: "0.7rem" }}>
                            {winnerLabel}
                          </SectionHint>
                        </TeamPickButton>
                      );
                    })}
                  </TeamPickRow>
                  <SectionHint>Только для BO3: 2:0, 2:1, 0:2, 1:2</SectionHint>
                </>
              ) : (
                <>
                  <SectionTitle style={{ marginTop: 4, marginBottom: 8 }}>
                    {isAtLeastOneMapMarket(form.betMarket) ? "Команда" : "На кого"}
                  </SectionTitle>
                  <TeamPickRow>
                    <TeamPickButton
                      type="button"
                      $active={form.betTeam === 1}
                      onClick={() => update("betTeam", 1 as BetTeamSide)}
                    >
                      <TeamPickLogoWrap>
                        {team1Name ? (
                          <TeamLogo name={team1Name} size={32} />
                        ) : (
                          <TeamPickPlaceholder>1</TeamPickPlaceholder>
                        )}
                      </TeamPickLogoWrap>
                      <TeamPickName>{team1Label}</TeamPickName>
                    </TeamPickButton>
                    <TeamPickButton
                      type="button"
                      $active={form.betTeam === 2}
                      onClick={() => update("betTeam", 2 as BetTeamSide)}
                    >
                      <TeamPickLogoWrap>
                        {team2Name ? (
                          <TeamLogo name={team2Name} size={32} />
                        ) : (
                          <TeamPickPlaceholder>2</TeamPickPlaceholder>
                        )}
                      </TeamPickLogoWrap>
                      <TeamPickName>{team2Label}</TeamPickName>
                    </TeamPickButton>
                  </TeamPickRow>
                  {isAtLeastOneMapMarket(form.betMarket) ? (
                    <>
                      <SectionTitle style={{ marginTop: 4, marginBottom: 8 }}>
                        Возьмёт карту
                      </SectionTitle>
                      <TeamPickRow>
                        <TeamPickButton
                          type="button"
                          $active={form.yesNo === true}
                          onClick={() => update("yesNo", true)}
                        >
                          <TeamPickName>{AT_LEAST_ONE_MAP_LABELS.yes}</TeamPickName>
                        </TeamPickButton>
                        <TeamPickButton
                          type="button"
                          $active={form.yesNo === false}
                          onClick={() => update("yesNo", false)}
                        >
                          <TeamPickName>{AT_LEAST_ONE_MAP_LABELS.no}</TeamPickName>
                        </TeamPickButton>
                      </TeamPickRow>
                      <SectionHint>
                        0-2 или 0-3 — «Нет» · хотя бы одна карта в серии — «Да»
                      </SectionHint>
                    </>
                  ) : null}
                </>
              )}

              {(form.betMarket === "map" || form.betMarket === "pistol") && (
                <FieldsGrid $twoCol={form.betMarket === "pistol"}>
                  <FormControl fullWidth sx={fieldSx}>
                    <InputLabel>Карта</InputLabel>
                    <Select
                      label="Карта"
                      value={form.mapNumber ?? 1}
                      onChange={(e) => update("mapNumber", Number(e.target.value))}
                    >
                      {mapOptions.map((n) => (
                        <MenuItem key={n} value={n}>
                          Карта {n}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {form.betMarket === "pistol" && (
                    <FormControl fullWidth sx={fieldSx}>
                      <InputLabel>Пистолетный раунд</InputLabel>
                      <Select
                        label="Пистолетный раунд"
                        value={form.pistolRound ?? 1}
                        onChange={(e) =>
                          update("pistolRound", Number(e.target.value) as 1 | 2)
                        }
                      >
                        <MenuItem value={1}>Раунд 1</MenuItem>
                        <MenuItem value={2}>Раунд 2</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                </FieldsGrid>
              )}
            </FieldsStack>
          </Section>

          <Section>
            <SectionTitle>Сумма и коэффициент</SectionTitle>
            <FieldsStack>
              <SectionHint>
                Баланс:{" "}
                {balance.toLocaleString("ru-RU", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}{" "}
                ₽ — быстрый выбор доли от баланса. Максимум ставки:{" "}
                {MAX_BET_AMOUNT.toLocaleString("ru-RU")} ₽
              </SectionHint>
              <ChipRow>
                {BET_AMOUNT_PERCENT_PRESETS.map((percent) => {
                  const presetAmount = betAmountFromBalancePercent(balance, percent);
                  const isActive =
                    Number.isFinite(parsedAmount) && parsedAmount === presetAmount;
                  return (
                    <AmountPresetChip
                      key={percent}
                      type="button"
                      $active={isActive}
                      title={`${presetAmount.toLocaleString("ru-RU")} ₽`}
                      onClick={() => {
                        setAmountInput(String(presetAmount));
                        update("amount", presetAmount);
                      }}
                    >
                      {percent}%
                    </AmountPresetChip>
                  );
                })}
              </ChipRow>
              <FieldsGrid $twoCol>
                <TextField
                  label="Сумма, ₽"
                  type="text"
                  inputMode="numeric"
                  value={amountInput}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "") {
                      setAmountInput(v);
                      return;
                    }
                    if (!/^\d+$/.test(v)) return;
                    const next = Number(v);
                    if (next > MAX_BET_AMOUNT) {
                      setAmountInput(String(MAX_BET_AMOUNT));
                      update("amount", MAX_BET_AMOUNT);
                      return;
                    }
                    setAmountInput(v);
                  }}
                  fullWidth
                  sx={fieldSx}
                  helperText={
                    parsedAmount > MAX_BET_AMOUNT
                      ? `Максимум ${MAX_BET_AMOUNT.toLocaleString("ru-RU")} ₽`
                      : undefined
                  }
                  error={Number.isFinite(parsedAmount) && parsedAmount > MAX_BET_AMOUNT}
                />
                <TextField
                  label="Коэффициент"
                  type="text"
                  inputMode="decimal"
                  value={oddsInput}
                  onChange={(e) => {
                    const v = e.target.value.replace(",", ".");
                    if (v === "" || /^\d*\.?\d*$/.test(v)) setOddsInput(v);
                  }}
                  fullWidth
                  sx={fieldSx}
                />
              </FieldsGrid>
            </FieldsStack>
          </Section>
        </DialogBody>

        <DialogFooter>
          <FooterButtonSecondary type="button" onClick={onClose} disabled={submitting}>
            Отмена
          </FooterButtonSecondary>
          <FooterButtonPrimary
            type="button"
            onClick={handleSubmit}
            disabled={!valid || submitting}
          >
            {submitting ? "Сохранение…" : isEdit ? "Сохранить изменения" : "Добавить ставку"}
          </FooterButtonPrimary>
        </DialogFooter>
      </DialogShell>
    </Dialog>
  );
};

export default BetFormDialog;
