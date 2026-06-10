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
import type { Bet } from "@/entities/bet";
import { MATCH_FORMATS, type MatchFormat } from "@/entities/bet";
import type { EventRecord } from "@/entities/eventRecord";
import type { Match, MatchCreateInput, MatchMap } from "@/entities/match";
import { getBetFormSuggestions } from "@/features/bets/lib/formSuggestions";
import EventStageSelect from "@/features/events/components/EventStageSelect/EventStageSelect";
import { collectEventStages, pickEventStage } from "@/features/events/lib/eventStages";
import {
  eventSelectKey,
  getEventSelectOptions,
} from "@/features/events/lib/eventDisplay";
import {
  CS_MAP_NAMES,
  createEmptyMaps,
  resizeMapsForFormat,
  sanitizeMapsForSave,
} from "@/features/matches/lib/matchMaps";
import { normalizeScoreValue } from "@/features/matches/lib/matchScore";
import { todayIsoDateLocal } from "@/shared/lib/date/isoDate";
import DateInput, { type DateInputHandle } from "@/shared/ui/DateInput/DateInput";
import EventLogo from "@/shared/ui/EventLogo/EventLogo";
import SuggestTextField from "@/shared/ui/SuggestTextField/SuggestTextField";
import TimeInput, { type TimeInputHandle } from "@/shared/ui/TimeInput/TimeInput";
import {
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogShell,
  DialogTitle,
  FooterButton,
  FormatChip,
  FormatRow,
  MapBlock,
  MapBlockTitle,
  ScoreLabel,
  ScoreRow,
  ScoreSection,
  ScoreSeparator,
  dialogBackdropSx,
  fieldSx,
} from "./MatchFormDialog.styled";
import { resolveDialogPaperSx } from "@/shared/styles/dialogSx";

const emptyMatch = (): MatchCreateInput => ({
  date: todayIsoDateLocal(),
  time: "16:00",
  format: "BO3",
  organization1: "",
  organization2: "",
  eventOrganization: "",
  eventName: "",
  majorStage: null,
  maps: createEmptyMaps("BO3"),
});

const matchToFormInput = (match: Match): MatchCreateInput => ({
  date: match.date,
  time: match.time,
  format: match.format,
  organization1: match.organization1,
  organization2: match.organization2,
  eventOrganization: match.eventOrganization,
  eventName: match.eventName,
  majorStage: match.majorStage,
  maps: resizeMapsForFormat(match.maps ?? [], match.format),
});

interface MatchFormDialogProps {
  open: boolean;
  bets: Bet[];
  allBets?: Bet[];
  matches?: Match[];
  events?: EventRecord[];
  initial?: Match;
  seed?: Partial<MatchCreateInput>;
  onClose: () => void;
  onSubmit: (values: MatchCreateInput) => Promise<void>;
}

const MatchFormDialog = ({
  open,
  bets,
  allBets,
  matches = [],
  events = [],
  initial,
  seed,
  onClose,
  onSubmit,
}: MatchFormDialogProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [form, setForm] = useState<MatchCreateInput>(emptyMatch);
  const [saving, setSaving] = useState(false);
  const dateRef = useRef<DateInputHandle>(null);
  const timeRef = useRef<TimeInputHandle>(null);

  const suggestions = useMemo(() => getBetFormSuggestions(bets), [bets]);
  const eventSource = useMemo(() => {
    if (!initial) return null;
    return {
      eventOrganization: initial.eventOrganization,
      eventName: initial.eventName,
      majorStage: initial.majorStage,
    };
  }, [initial]);
  const eventOptions = useMemo(
    () =>
      getEventSelectOptions(bets, events, eventSource, {
        excludeFinished: !initial,
        collapseMajorStages: true,
      }),
    [bets, events, eventSource, initial]
  );
  const selectedEventKey =
    form.eventOrganization.trim() || form.eventName.trim()
      ? eventSelectKey(
          {
            eventOrganization: form.eventOrganization,
            eventName: form.eventName,
            majorStage: form.majorStage,
          },
          events,
          true
        )
      : "";
  const selectedEventStages = useMemo(
    () =>
      collectEventStages(form.eventOrganization, form.eventName, events, {
        currentStage: form.majorStage,
        bets: allBets ?? bets,
        matches,
      }),
    [
      allBets,
      bets,
      events,
      form.eventOrganization,
      form.eventName,
      form.majorStage,
      matches,
    ]
  );
  const eventRequiresStage = selectedEventStages.length > 0;

  const updateMap = (index: number, patch: Partial<MatchMap>) => {
    setForm((prev) => ({
      ...prev,
      maps: prev.maps.map((map, mapIndex) =>
        mapIndex === index ? { ...map, ...patch } : map
      ),
    }));
  };

  const setMapScore = (index: number, side: 1 | 2, raw: string) => {
    const key = side === 1 ? "score1" : "score2";
    if (raw.trim() === "") {
      updateMap(index, { [key]: null });
      return;
    }
    const parsed = normalizeScoreValue(raw);
    if (parsed == null) return;
    updateMap(index, { [key]: parsed });
  };

  useEffect(() => {
    if (!open) return;
    setForm(initial ? matchToFormInput(initial) : { ...emptyMatch(), ...seed });
  }, [open, initial, seed]);

  const update = <K extends keyof MatchCreateInput>(key: K, value: MatchCreateInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setFormat = (format: MatchFormat) => {
    setForm((prev) => ({
      ...prev,
      format,
      maps: resizeMapsForFormat(prev.maps, format),
    }));
  };

  const canSubmit =
    form.organization1.trim() &&
    form.organization2.trim() &&
    form.eventOrganization.trim() &&
    form.eventName.trim() &&
    (!eventRequiresStage || form.majorStage);

  const handleSubmit = async () => {
    if (!canSubmit || saving) return;
    const date = dateRef.current?.commit() ?? form.date;
    const time = timeRef.current?.commit() ?? form.time;
    setSaving(true);
    try {
      await onSubmit({
        ...form,
        date,
        time,
        maps: sanitizeMapsForSave(form.maps, form.format),
        organization1: form.organization1.trim(),
        organization2: form.organization2.trim(),
        eventOrganization: form.eventOrganization.trim(),
        eventName: form.eventName.trim(),
        majorStage: eventRequiresStage ? form.majorStage : null,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      fullScreen={isMobile}
      maxWidth="sm"
      slotProps={{
        backdrop: { sx: dialogBackdropSx },
        paper: { sx: resolveDialogPaperSx(isMobile) },
      }}
    >
      <DialogShell>
        <DialogHeader>
          <DialogTitle>{initial ? "Редактировать матч" : "Новый матч"}</DialogTitle>
          <IconButton onClick={onClose} aria-label="Закрыть" size="small">
            <CloseIcon />
          </IconButton>
        </DialogHeader>

        <DialogBody>
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

          <FormatRow>
            {MATCH_FORMATS.map((format) => (
              <FormatChip
                key={format}
                type="button"
                $active={form.format === format}
                onClick={() => setFormat(format as MatchFormat)}
              >
                {format}
              </FormatChip>
            ))}
          </FormatRow>

          <SuggestTextField
            label="Команда 1"
            value={form.organization1}
            onChange={(v) => update("organization1", v)}
            options={suggestions.teams}
            logo="team"
            sx={fieldSx}
          />
          <SuggestTextField
            label="Команда 2"
            value={form.organization2}
            onChange={(v) => update("organization2", v)}
            options={suggestions.teams}
            logo="team"
            sx={fieldSx}
          />

          <ScoreSection>
            <ScoreLabel>Карты и счёт раундов (необязательно)</ScoreLabel>
            {form.maps.map((map, index) => (
              <MapBlock key={`map-${index}`}>
                <MapBlockTitle>Карта {index + 1}</MapBlockTitle>
                <SuggestTextField
                  label="Название карты"
                  value={map.name}
                  onChange={(value) => updateMap(index, { name: value })}
                  options={[...CS_MAP_NAMES]}
                  sx={fieldSx}
                />
                <ScoreRow>
                  <TextField
                    label={form.organization1.trim() || "Команда 1"}
                    type="number"
                    value={map.score1 ?? ""}
                    onChange={(e) => setMapScore(index, 1, e.target.value)}
                    slotProps={{
                      inputLabel: { shrink: true },
                      htmlInput: { min: 0, step: 1 },
                    }}
                    fullWidth
                    sx={fieldSx}
                  />
                  <ScoreSeparator>:</ScoreSeparator>
                  <TextField
                    label={form.organization2.trim() || "Команда 2"}
                    type="number"
                    value={map.score2 ?? ""}
                    onChange={(e) => setMapScore(index, 2, e.target.value)}
                    slotProps={{
                      inputLabel: { shrink: true },
                      htmlInput: { min: 0, step: 1 },
                    }}
                    fullWidth
                    sx={fieldSx}
                  />
                </ScoreRow>
              </MapBlock>
            ))}
          </ScoreSection>

          <FormControl fullWidth size="small" sx={fieldSx} disabled={eventOptions.length === 0}>
            <InputLabel>Турнир</InputLabel>
            <Select
              value={selectedEventKey}
              label="Турнир"
              onChange={(e) => {
                const option = eventOptions.find((item) => item.key === e.target.value);
                if (!option) return;
                setForm((prev) => ({
                  ...prev,
                  eventOrganization: option.eventOrganization,
                  eventName: option.eventName,
                  majorStage: pickEventStage(
                    option.eventOrganization,
                    option.eventName,
                    events,
                    prev.majorStage
                  ),
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
          {eventOptions.length === 0 ? (
            <Typography variant="caption" color="text.secondary" sx={{ mt: -0.5 }}>
              {initial
                ? "Нет турниров — сначала добавьте ставку с указанием турнира"
                : "Нет активных турниров — завершённые скрыты. Создайте новый турнир или укажите дату окончания."}
            </Typography>
          ) : null}
          {eventRequiresStage ? (
            <EventStageSelect
              stages={selectedEventStages}
              value={form.majorStage}
              onChange={(stage) => update("majorStage", stage)}
            />
          ) : null}
        </DialogBody>

        <DialogFooter>
          <FooterButton type="button" onClick={onClose}>
            Отмена
          </FooterButton>
          <FooterButton type="button" $primary disabled={!canSubmit || saving} onClick={() => void handleSubmit()}>
            Сохранить
          </FooterButton>
        </DialogFooter>
      </DialogShell>
    </Dialog>
  );
};

export default MatchFormDialog;
