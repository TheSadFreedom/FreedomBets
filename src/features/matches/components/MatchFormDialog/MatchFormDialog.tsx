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
import type { Bet } from "@/entities/bet";
import { MATCH_FORMATS, type MatchFormat } from "@/entities/bet";
import type { EventRecord } from "@/entities/eventRecord";
import type { Match, MatchCreateInput } from "@/entities/match";
import { getBetFormSuggestions } from "@/features/bets/lib/formSuggestions";
import MajorStageSelect from "@/features/events/components/MajorStageSelect/MajorStageSelect";
import type { MajorStage } from "@/entities/event";
import {
  eventSelectKey,
  getEventSelectOptions,
} from "@/features/events/lib/eventDisplay";
import { inferEventTier } from "@/features/events/lib/eventTier";
import { normalizeScoreValue } from "@/features/matches/lib/matchScore";
import { todayIsoDateLocal } from "@/shared/lib/date/isoDate";
import DateInput, { type DateInputHandle } from "@/shared/ui/DateInput/DateInput";
import OrganizationLogo from "@/shared/ui/OrganizationLogo/OrganizationLogo";
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
  ScoreLabel,
  ScoreRow,
  ScoreSection,
  ScoreSeparator,
  dialogBackdropSx,
  dialogPaperSx,
  fieldSx,
} from "./MatchFormDialog.styled";

const emptyMatch = (): MatchCreateInput => ({
  date: todayIsoDateLocal(),
  time: "16:00",
  format: "BO3",
  organization1: "",
  organization2: "",
  eventOrganization: "",
  eventName: "",
  majorStage: null,
  score1: null,
  score2: null,
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
  score1: match.score1,
  score2: match.score2,
});

interface MatchFormDialogProps {
  open: boolean;
  bets: Bet[];
  events?: EventRecord[];
  initial?: Match;
  seed?: Partial<MatchCreateInput>;
  onClose: () => void;
  onSubmit: (values: MatchCreateInput) => Promise<void>;
}

const MatchFormDialog = ({
  open,
  bets,
  events = [],
  initial,
  seed,
  onClose,
  onSubmit,
}: MatchFormDialogProps) => {
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
      eventTier: inferEventTier(initial.eventOrganization, initial.eventName),
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
            eventTier: inferEventTier(form.eventOrganization, form.eventName),
            majorStage: form.majorStage,
          },
          true
        )
      : "";
  const isMajorMatch =
    inferEventTier(form.eventOrganization, form.eventName) === "Major" || Boolean(form.majorStage);
  const setScore = (side: 1 | 2, raw: string) => {
    const key = side === 1 ? "score1" : "score2";
    if (raw.trim() === "") {
      update(key, null);
      return;
    }
    const parsed = normalizeScoreValue(raw);
    if (parsed == null) return;
    update(key, parsed);
  };

  useEffect(() => {
    if (!open) return;
    setForm(initial ? matchToFormInput(initial) : { ...emptyMatch(), ...seed });
  }, [open, initial, seed]);

  const update = <K extends keyof MatchCreateInput>(key: K, value: MatchCreateInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const canSubmit =
    form.organization1.trim() &&
    form.organization2.trim() &&
    form.eventOrganization.trim() &&
    form.eventName.trim() &&
    (!isMajorMatch || form.majorStage);

  const handleSubmit = async () => {
    if (!canSubmit || saving) return;
    const date = dateRef.current?.commit() ?? form.date;
    const time = timeRef.current?.commit() ?? form.time;
    const hasBothScores = form.score1 != null && form.score2 != null;
    setSaving(true);
    try {
      await onSubmit({
        ...form,
        date,
        time,
        score1: hasBothScores ? form.score1 : null,
        score2: hasBothScores ? form.score2 : null,
        organization1: form.organization1.trim(),
        organization2: form.organization2.trim(),
        eventOrganization: form.eventOrganization.trim(),
        eventName: form.eventName.trim(),
        majorStage: isMajorMatch ? form.majorStage : null,
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
      maxWidth="sm"
      slotProps={{
        backdrop: { sx: dialogBackdropSx },
        paper: { sx: dialogPaperSx },
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
                onClick={() => update("format", format as MatchFormat)}
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
            <ScoreLabel>Счёт по картам (необязательно)</ScoreLabel>
            <ScoreRow>
              <TextField
                label={form.organization1.trim() || "Команда 1"}
                type="number"
                value={form.score1 ?? ""}
                onChange={(e) => setScore(1, e.target.value)}
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
                value={form.score2 ?? ""}
                onChange={(e) => setScore(2, e.target.value)}
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: { min: 0, step: 1 },
                }}
                fullWidth
                sx={fieldSx}
              />
            </ScoreRow>
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
                  majorStage:
                    option.eventTier === "Major"
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
          {eventOptions.length === 0 ? (
            <Typography variant="caption" color="text.secondary" sx={{ mt: -0.5 }}>
              {initial
                ? "Нет турниров — сначала добавьте ставку с указанием турнира"
                : "Нет активных турниров — завершённые скрыты. Создайте новый турнир или укажите дату окончания."}
            </Typography>
          ) : null}
          {isMajorMatch ? (
            <MajorStageSelect
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
