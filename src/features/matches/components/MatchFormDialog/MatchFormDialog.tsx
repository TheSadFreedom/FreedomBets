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
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import type { Bet } from "@/entities/bet";
import { MATCH_FORMATS, type MatchFormat } from "@/entities/bet";
import type { EventRecord } from "@/entities/eventRecord";
import type { Match, MatchCreateInput, MatchMap } from "@/entities/match";
import { getBetFormSuggestions } from "@/features/bets/lib/formSuggestions";
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
  compactFieldSx,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogShell,
  DialogTitle,
  FieldsGrid,
  FieldsStack,
  FooterButton,
  FormatChip,
  FormatRow,
  HeaderIcon,
  HeaderSubtitle,
  HeaderText,
  HintText,
  MapIndex,
  MapRow,
  MapsList,
  MapsToggle,
  MapsToggleHint,
  MapsToggleLabel,
  ScoreColon,
  ScoreFields,
  Section,
  SectionTitle,
  TeamsRow,
  VsBadge,
  dialogBackdropSx,
  fieldSx,
} from "./MatchFormDialog.styled";
import { dialogPaperSx } from "@/shared/styles/dialogSx";

const emptyMatch = (): MatchCreateInput => ({
  date: todayIsoDateLocal(),
  time: "16:00",
  format: "BO3",
  team1Id: "",
  team2Id: "",
  eventId: "",
  maps: createEmptyMaps("BO3"),
});

const matchToFormInput = (match: Match): MatchCreateInput => ({
  date: match.date,
  time: match.time,
  format: match.format,
  team1Id: match.team1Id,
  team2Id: match.team2Id,
  eventId: match.eventId,
  maps: resizeMapsForFormat(match.maps ?? [], match.format),
});

function mapsHaveData(maps: MatchMap[]): boolean {
  return maps.some(
    (map) =>
      map.name.trim() ||
      map.score1 != null ||
      map.score2 != null
  );
}

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
  const [mapsOpen, setMapsOpen] = useState(false);
  const formInitialized = useRef(false);
  const dateRef = useRef<DateInputHandle>(null);
  const timeRef = useRef<TimeInputHandle>(null);

  const suggestions = useMemo(() => getBetFormSuggestions(bets), [bets]);
  const eventSource = useMemo(() => {
    if (!initial) return null;
    return {
      eventId: initial.eventId,
      eventName: "",
    };
  }, [initial]);
  const eventOptions = useMemo(
    () =>
      getEventSelectOptions(bets, events, eventSource, {
        excludeFinished: !initial,
      }),
    [bets, events, eventSource, initial]
  );
  const selectedEventKey =
    form.eventId.trim()
      ? eventSelectKey({
          eventId: form.eventId,
          eventName: "",
        })
      : "";

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
    if (!open) {
      formInitialized.current = false;
      return;
    }
    if (formInitialized.current) return;
    formInitialized.current = true;
    const nextForm = initial ? matchToFormInput(initial) : { ...emptyMatch(), ...seed };
    setForm(nextForm);
    setMapsOpen(mapsHaveData(nextForm.maps));
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
    form.team1Id.trim() &&
    form.team2Id.trim() &&
    form.eventId.trim();

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
        team1Id: form.team1Id.trim(),
        team2Id: form.team2Id.trim(),
        eventId: form.eventId.trim(),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const filledMapsCount = form.maps.filter(
    (map) => map.name.trim() || map.score1 != null || map.score2 != null
  ).length;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        backdrop: { sx: dialogBackdropSx },
        paper: { sx: dialogPaperSx },
      }}
    >
      <DialogShell>
        <DialogHeader>
          <HeaderIcon>
            <SportsEsportsOutlinedIcon />
          </HeaderIcon>
          <HeaderText>
            <DialogTitle>{initial ? "Редактировать матч" : "Новый матч"}</DialogTitle>
            <HeaderSubtitle>
              {initial ? "Измените данные и сохраните" : "Укажите турнир, команды и время"}
            </HeaderSubtitle>
          </HeaderText>
          <IconButton onClick={onClose} aria-label="Закрыть" size="small" sx={{ mt: -0.5 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogHeader>

        <DialogBody>
          <Section>
            <SectionTitle>Турнир</SectionTitle>
            <FieldsStack>
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
                          label={option.eventName}
                          size={20}
                        />
                        <Typography variant="body2" noWrap sx={{ flex: 1, minWidth: 0, fontSize: 13 }}>
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
                          label={option.eventName}
                          size={22}
                        />
                        <Box minWidth={0}>
                          <Typography variant="body2" noWrap title={option.eventName}>
                            {option.eventName}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {eventOptions.length === 0 ? (
                <HintText>
                  {initial
                    ? "Нет турниров — сначала добавьте ставку с указанием турнира"
                    : "Нет активных турниров. Создайте новый или укажите дату окончания."}
                </HintText>
              ) : null}
            </FieldsStack>
          </Section>

          <Section>
            <SectionTitle>Команды</SectionTitle>
            <TeamsRow>
              <SuggestTextField
                label="Команда 1"
                value={form.team1Id}
                onChange={(v) => update("team1Id", v)}
                options={suggestions.teams}
                logo="team"
                sx={compactFieldSx}
              />
              <VsBadge>VS</VsBadge>
              <SuggestTextField
                label="Команда 2"
                value={form.team2Id}
                onChange={(v) => update("team2Id", v)}
                options={suggestions.teams}
                logo="team"
                sx={compactFieldSx}
              />
            </TeamsRow>
          </Section>

          <Section>
            <SectionTitle>Расписание</SectionTitle>
            <FieldsStack>
              <FieldsGrid $cols={2}>
                <DateInput
                  ref={dateRef}
                  label="Дата"
                  value={form.date}
                  onChange={(iso) => update("date", iso)}
                  fullWidth
                  size="small"
                  sx={compactFieldSx}
                />
                <TimeInput
                  ref={timeRef}
                  label="Время"
                  value={form.time}
                  onChange={(value) => update("time", value)}
                  fullWidth
                  size="small"
                  sx={compactFieldSx}
                />
              </FieldsGrid>
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
            </FieldsStack>
          </Section>

          <Section>
            <MapsToggle type="button" onClick={() => setMapsOpen((open) => !open)}>
              <MapsToggleLabel>Карты и счёт</MapsToggleLabel>
              <Box display="flex" alignItems="center" gap={0.5}>
                <MapsToggleHint>
                  {filledMapsCount > 0 ? `${filledMapsCount} заполн.` : "необязательно"}
                </MapsToggleHint>
                {mapsOpen ? (
                  <ExpandLessIcon sx={{ fontSize: 18, color: "#878787" }} />
                ) : (
                  <ExpandMoreIcon sx={{ fontSize: 18, color: "#878787" }} />
                )}
              </Box>
            </MapsToggle>
            {mapsOpen ? (
              <MapsList>
                {form.maps.map((map, index) => (
                  <MapRow key={`map-${index}`}>
                    <MapIndex>{index + 1}</MapIndex>
                    <SuggestTextField
                      label="Карта"
                      value={map.name}
                      onChange={(value) => updateMap(index, { name: value })}
                      options={[...CS_MAP_NAMES]}
                      sx={compactFieldSx}
                    />
                    <ScoreFields className="map-scores">
                      <TextField
                        label={form.team1Id.trim().slice(0, 8) || "1"}
                        type="number"
                        size="small"
                        value={map.score1 ?? ""}
                        onChange={(e) => setMapScore(index, 1, e.target.value)}
                        slotProps={{
                          inputLabel: { shrink: true },
                          htmlInput: { min: 0, step: 1 },
                        }}
                        sx={compactFieldSx}
                      />
                      <ScoreColon>:</ScoreColon>
                      <TextField
                        label={form.team2Id.trim().slice(0, 8) || "2"}
                        type="number"
                        size="small"
                        value={map.score2 ?? ""}
                        onChange={(e) => setMapScore(index, 2, e.target.value)}
                        slotProps={{
                          inputLabel: { shrink: true },
                          htmlInput: { min: 0, step: 1 },
                        }}
                        sx={compactFieldSx}
                      />
                    </ScoreFields>
                  </MapRow>
                ))}
              </MapsList>
            ) : null}
          </Section>
        </DialogBody>

        <DialogFooter>
          <FooterButton type="button" onClick={onClose}>
            Отмена
          </FooterButton>
          <FooterButton
            type="button"
            $primary
            disabled={!canSubmit || saving}
            onClick={() => void handleSubmit()}
          >
            Сохранить
          </FooterButton>
        </DialogFooter>
      </DialogShell>
    </Dialog>
  );
};

export default MatchFormDialog;
