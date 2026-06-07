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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import GpsFixedOutlinedIcon from "@mui/icons-material/GpsFixedOutlined";
import type { Bet, BetMarket, BetTeamSide, MatchFormat } from "@/entities/bet";
import type { EventRecord } from "@/entities/eventRecord";
import type { Match } from "@/entities/match";
import { todayIsoDateLocal } from "@/shared/lib/date/isoDate";
import DateInput, { type DateInputHandle } from "@/shared/ui/DateInput/DateInput";
import {
  BET_MARKET_LABELS,
  BET_MARKETS,
  MATCH_FORMATS,
  PISTOL_ROUNDS_PER_MAP,
  formatBetDescription,
  getMapCount,
  normalizeBetTargets,
} from "@/entities/bet";
import {
  BET_AMOUNT_PERCENT_PRESETS,
  betAmountFromBalancePercent,
} from "@/features/bets/lib/amountPresets";
import { getBetFormSuggestions } from "@/features/bets/lib/formSuggestions";
import EventTierSelect from "@/features/events/components/EventTierSelect/EventTierSelect";
import MajorStageSelect from "@/features/events/components/MajorStageSelect/MajorStageSelect";
import type { MajorStage } from "@/entities/event";
import { eventKeyFromBet, getEventSelectOptions } from "@/features/events/lib/eventDisplay";
import { findEventTier, inferEventTier } from "@/features/events/lib/eventTier";
import {
  findMatchForBetFields,
  formatMatchSecondaryLabel,
  formatMatchTeamsLabel,
  getMatchSelectOptions,
} from "@/features/matches/lib/matchDisplay";
import OrganizationLogo from "@/shared/ui/OrganizationLogo/OrganizationLogo";
import SuggestTextField from "@/shared/ui/SuggestTextField/SuggestTextField";
import TimeInput, { type TimeInputHandle } from "@/shared/ui/TimeInput/TimeInput";
import TeamLogo from "@/shared/ui/TeamLogo/TeamLogo";
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
  dialogPaperMobileSx,
  dialogPaperSx,
  fieldSx,
} from "./BetFormDialog.styled";

const normalizeFormat = (value: string): MatchFormat =>
  MATCH_FORMATS.includes(value as MatchFormat) ? (value as MatchFormat) : "BO3";

const MARKET_ICONS: Record<BetMarket, typeof EmojiEventsOutlinedIcon> = {
  match: EmojiEventsOutlinedIcon,
  map: MapOutlinedIcon,
  pistol: GpsFixedOutlinedIcon,
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
    | "eventTier"
    | "majorStage"
    | "betMarket"
    | "betTeam"
    | "mapNumber"
    | "pistolRound"
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
    date: todayIsoDateLocal(),
    time: "12:00",
    format: "BO3",
    organization1: "",
    organization2: "",
    betMarket: "match",
    betTeam: 1,
    mapNumber: null,
    pistolRound: null,
    betType: "",
    amount: 100,
    odds: 1.5,
    eventOrganization: "",
    eventName: "",
    eventTier: "Small",
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
    | Pick<Bet, "eventOrganization" | "eventName" | "eventTier" | "majorStage">
    | null => {
    if (initial) return initial;
    if (seed?.eventOrganization?.trim() || seed?.eventName?.trim()) {
      return {
        eventOrganization: seed.eventOrganization ?? "",
        eventName: seed.eventName ?? "",
        eventTier:
          seed.eventTier ??
          inferEventTier(seed.eventOrganization ?? "", seed.eventName ?? ""),
        majorStage: seed.majorStage ?? null,
      };
    }
    return null;
  }, [initial, seed]);
  const eventOptions = useMemo(
    () => getEventSelectOptions(bets, events, eventSource),
    [bets, events, eventSource]
  );
  const selectedEventKey =
    form.eventOrganization.trim() || form.eventName.trim() ? eventKeyFromBet(form) : "";
  const matchOptions = useMemo(() => {
    const includeIds = [...new Set([seed?.matchId, selectedMatchId].filter(Boolean))] as string[];
    const options = getMatchSelectOptions(matches, {
      onDate: todayIsoDateLocal(),
      includeIds: includeIds.length > 0 ? includeIds : undefined,
    });
    if (!seed?.eventOrganization?.trim() && !seed?.eventName?.trim()) return options;
    const org = (seed.eventOrganization ?? "").trim().toLowerCase();
    const name = (seed.eventName ?? "").trim().toLowerCase();
    return options.filter(
      ({ match }) =>
        match.eventOrganization.trim().toLowerCase() === org &&
        match.eventName.trim().toLowerCase() === name
    );
  }, [matches, seed, selectedMatchId]);
  const selectedMatchOption = useMemo(
    () => matchOptions.find((item) => item.id === selectedMatchId),
    [matchOptions, selectedMatchId]
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
    const tier =
      findEventTier(bets, match.eventOrganization, match.eventName) ??
      inferEventTier(match.eventOrganization, match.eventName);
    setForm((prev) => {
      const next: BetFormValues = {
        ...prev,
        date: match.date,
        time: match.time,
        format: match.format,
        organization1: match.organization1,
        organization2: match.organization2,
        eventOrganization: match.eventOrganization,
        eventName: match.eventName,
        eventTier: tier,
        majorStage: tier === "Major" ? match.majorStage ?? ("Stage 1" as MajorStage) : null,
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
      setSelectedMatchId("");
      const format = normalizeFormat(initial.format);
      const draft: BetFormValues = {
        profileId: initial.profileId,
        date: initial.date,
        time: initial.time,
        format,
        organization1: initial.organization1,
        organization2: initial.organization2,
        betMarket: initial.betMarket,
        betTeam: initial.betTeam,
        mapNumber: initial.mapNumber,
        pistolRound: initial.pistolRound,
        betType: initial.betType,
        amount: initial.amount,
        odds: initial.odds,
        eventOrganization: initial.eventOrganization,
        eventName: initial.eventName,
        eventTier: initial.eventTier,
        majorStage: initial.majorStage,
        status: initial.status,
      };
      const targets = normalizeBetTargets(draft);
      const merged = {
        ...draft,
        ...targets,
        betType: formatBetDescription({ ...draft, ...targets }),
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
        const tier =
          findEventTier(bets, seededMatch.eventOrganization, seededMatch.eventName) ??
          inferEventTier(seededMatch.eventOrganization, seededMatch.eventName);
        Object.assign(draft, {
          date: seededMatch.date,
          time: seededMatch.time,
          format: normalizeFormat(seededMatch.format),
          organization1: seededMatch.organization1,
          organization2: seededMatch.organization2,
          eventOrganization: seededMatch.eventOrganization,
          eventName: seededMatch.eventName,
          eventTier: tier,
          majorStage:
            tier === "Major" ? seededMatch.majorStage ?? ("Stage 1" as MajorStage) : null,
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
  }, [open, initial, seed, profileId, matches, bets]);

  const update = <K extends keyof BetFormValues>(key: K, value: BetFormValues[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "format") {
        const targets = normalizeBetTargets({
          ...next,
          format: value as MatchFormat,
        });
        return {
          ...next,
          ...targets,
          betType: formatBetDescription({ ...next, ...targets }),
        };
      }
      if (
        key === "betMarket" ||
        key === "betTeam" ||
        key === "mapNumber" ||
        key === "pistolRound" ||
        key === "organization1" ||
        key === "organization2"
      ) {
        const targets = normalizeBetTargets(next);
        return {
          ...next,
          ...targets,
          betType: formatBetDescription({ ...next, ...targets }),
        };
      }
      return next;
    });
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
    return {
      ...merged,
      betType: formatBetDescription(merged),
    };
  };

  const handleSubmit = async () => {
    const payload = buildPayload();
    if (
      !Number.isFinite(payload.amount) ||
      payload.amount <= 0 ||
      !Number.isFinite(payload.odds) ||
      payload.odds <= 0 ||
      !payload.eventOrganization.trim() ||
      !payload.eventName.trim()
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
    parsedAmount > 0 &&
    parsedOdds > 0 &&
    form.eventOrganization.trim() &&
    form.eventName.trim() &&
    form.organization1.trim() &&
    form.organization2.trim() &&
    (isEdit || Boolean(selectedMatchId)) &&
    (form.eventTier !== "Major" || Boolean(form.majorStage)) &&
    (form.betMarket === "match" ||
      (form.mapNumber != null && form.mapNumber >= 1 && form.mapNumber <= mapCount)) &&
    (form.betMarket !== "pistol" || form.pistolRound === 1 || form.pistolRound === 2);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      slotProps={{
        paper: { sx: isMobile ? { ...dialogPaperSx, ...dialogPaperMobileSx } : dialogPaperSx },
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
                    onChange={(iso) => update("date", iso)}
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
                        const tier =
                          findEventTier(bets, option.eventOrganization, option.eventName) ??
                          inferEventTier(option.eventOrganization, option.eventName);
                    setForm((prev) => ({
                      ...prev,
                      eventOrganization: option.eventOrganization,
                      eventName: option.eventName,
                      eventTier: tier,
                      majorStage:
                        tier === "Major"
                          ? option.majorStage ?? prev.majorStage ?? ("Stage 1" as MajorStage)
                          : null,
                    }));
                  }}
                  renderValue={(value) => {
                    if (!value) return "";
                    const option = eventOptions.find((item) => item.key === value);
                    if (!option) return value;
                    return (
                      <Box display="flex" alignItems="center" gap={1} minWidth={0}>
                        <OrganizationLogo name={option.eventOrganization} size={22} />
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
                        <OrganizationLogo name={option.eventOrganization} size={24} />
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
              <EventTierSelect
                value={form.eventTier}
                onChange={(tier) => {
                  setForm((prev) => ({
                    ...prev,
                    eventTier: tier,
                    majorStage:
                      tier === "Major" ? prev.majorStage ?? ("Stage 1" as MajorStage) : null,
                  }));
                }}
              />
              {form.eventTier === "Major" ? (
                <MajorStageSelect
                  value={form.majorStage}
                  onChange={(stage) => update("majorStage", stage)}
                />
              ) : null}
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
            <Section>
              <SectionTitle>Матч</SectionTitle>
              <FieldsStack>
                <FormControl
                  fullWidth
                  size="small"
                  sx={fieldSx}
                  disabled={matchOptions.length === 0}
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
                          <TeamLogo name={option.match.organization1} size={22} />
                          <Typography variant="body2" noWrap sx={{ flexShrink: 0 }}>
                            vs
                          </Typography>
                          <TeamLogo name={option.match.organization2} size={22} />
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
                          <TeamLogo name={option.match.organization1} size={24} />
                          <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
                            vs
                          </Typography>
                          <TeamLogo name={option.match.organization2} size={24} />
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
                {matchOptions.length === 0 ? (
                  <SectionHint>
                    Нет доступных матчей на сегодня — создайте матч кнопкой «Новый матч»
                  </SectionHint>
                ) : selectedMatchOption ? (
                  <>
                    <SectionHint>
                      {formatMatchSecondaryLabel(selectedMatchOption.match)}
                    </SectionHint>
                    <EventTierSelect
                      value={form.eventTier}
                      onChange={(tier) => {
                        setForm((prev) => ({
                          ...prev,
                          eventTier: tier,
                          majorStage:
                            tier === "Major"
                              ? prev.majorStage ?? ("Stage 1" as MajorStage)
                              : null,
                        }));
                      }}
                    />
                    {form.eventTier === "Major" ? (
                      <MajorStageSelect
                        value={form.majorStage}
                        onChange={(stage) => update("majorStage", stage)}
                      />
                    ) : null}
                    <SectionHint>
                      На каждой карте по {PISTOL_ROUNDS_PER_MAP} пистолетных раунда.
                    </SectionHint>
                  </>
                ) : null}
              </FieldsStack>
            </Section>
          )}

          <Section>
            <SectionTitle>Тип ставки</SectionTitle>
            <FieldsStack>
              <ChipRow>
                {BET_MARKETS.map((market) => {
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
              </ChipRow>

              <SectionTitle style={{ marginTop: 4, marginBottom: 8 }}>
                На кого
              </SectionTitle>
              <TeamPickRow>
                <TeamPickButton
                  type="button"
                  $active={form.betTeam === 1}
                  onClick={() => update("betTeam", 1 as BetTeamSide)}
                >
                  <TeamPickLogoWrap>
                    {team1Name ? (
                      <TeamLogo name={team1Name} size={40} />
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
                      <TeamLogo name={team2Name} size={40} />
                    ) : (
                      <TeamPickPlaceholder>2</TeamPickPlaceholder>
                    )}
                  </TeamPickLogoWrap>
                  <TeamPickName>{team2Label}</TeamPickName>
                </TeamPickButton>
              </TeamPickRow>

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
                ₽ — быстрый выбор доли от баланса
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
                    if (v === "" || /^\d+$/.test(v)) setAmountInput(v);
                  }}
                  fullWidth
                  sx={fieldSx}
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
