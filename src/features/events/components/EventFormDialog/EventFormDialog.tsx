import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Dialog, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { Bet } from "@/entities/bet";
import type { EventEditInput, EventStats } from "@/entities/event";
import {
  getBetFormSuggestions,
  getEventNameSuggestions,
  getEventTeamSuggestions,
} from "@/features/bets/lib/formSuggestions";
import EventLogoPicker from "@/features/events/components/EventLogoPicker/EventLogoPicker";
import EventStagesEditor from "@/features/events/components/EventStagesEditor/EventStagesEditor";
import EventTierSelect from "@/features/events/components/EventTierSelect/EventTierSelect";
import TeamLogoPicker from "@/features/events/components/TeamLogoPicker/TeamLogoPicker";
import { defaultStagesForTier } from "@/features/events/lib/eventStages";
import { inferEventTier } from "@/features/events/lib/eventTier";
import { useTeamLogosManifest } from "@/shared/hooks/useTeamLogosManifest";
import { teamLogoSlug } from "@/shared/lib/logos/teamLogo";
import DateInput, { type DateInputHandle } from "@/shared/ui/DateInput/DateInput";
import SuggestTextField from "@/shared/ui/SuggestTextField/SuggestTextField";
import { dialogPaperSx } from "@/shared/styles/dialogSx";
import {
  DialogBody,
  DialogFooter,
  DialogShell,
  DialogTitle,
  EventDialogHeader,
  EventHeaderIcon,
  FieldsGrid,
  FieldsStack,
  ExtrasContent,
  FooterButton,
  HeaderSubtitle,
  HeaderText,
  HintText,
  MapsToggle,
  MapsToggleHint,
  MapsToggleLabel,
  Section,
  SectionTitle,
  compactFieldSx,
  dialogBackdropSx,
} from "./EventFormDialog.styled";

const eventToFormInput = (event: EventStats): EventEditInput => ({
  eventOrganization: event.eventOrganization,
  eventName: event.eventName,
  logoSlug: event.logoSlug,
  date: event.date,
  endDate: event.endDate ?? "",
  eventTier: event.eventTier,
  majorStage: event.majorStage,
  stages: event.stages ?? [],
  winnerOrganization: event.winnerOrganization,
  winnerLogoSlug: event.winnerLogoSlug,
});

const resolveWinnerLogoSlug = (
  teamName: string,
  logos: { id: string }[]
): string | null => {
  const slug = teamLogoSlug(teamName);
  return logos.some((logo) => logo.id === slug) ? slug : null;
};

function hasExtrasData(form: EventEditInput): boolean {
  return Boolean(
    form.winnerOrganization?.trim() || form.stages.length > 0
  );
}

interface EventFormDialogProps {
  open: boolean;
  bets: Bet[];
  title?: string;
  initial?: EventStats;
  /** Показывать и сохранять даты турнира (не стадии major) */
  editEventDates?: boolean;
  onClose: () => void;
  onSubmit: (values: EventEditInput) => Promise<void>;
}

const EventFormDialog = ({
  open,
  bets,
  title,
  initial,
  editEventDates = true,
  onClose,
  onSubmit,
}: EventFormDialogProps) => {
  const [form, setForm] = useState<EventEditInput>(() =>
    initial
      ? eventToFormInput(initial)
      : {
          eventOrganization: "",
          eventName: "",
          logoSlug: null,
          date: "",
          endDate: "",
          eventTier: "Small",
          majorStage: null,
          stages: [],
          winnerOrganization: null,
          winnerLogoSlug: null,
        }
  );
  const [saving, setSaving] = useState(false);
  const [extrasOpen, setExtrasOpen] = useState(() =>
    initial ? hasExtrasData(eventToFormInput(initial)) : false
  );
  const teamLogos = useTeamLogosManifest();
  const dateRef = useRef<DateInputHandle>(null);
  const endDateRef = useRef<DateInputHandle>(null);
  const formInitialized = useRef(false);

  const suggestions = useMemo(() => getBetFormSuggestions(bets), [bets]);
  const eventNameOptions = useMemo(
    () => getEventNameSuggestions(bets, form.eventOrganization),
    [bets, form.eventOrganization]
  );

  useEffect(() => {
    if (!open) {
      formInitialized.current = false;
      return;
    }
    if (formInitialized.current) return;
    formInitialized.current = true;

    const next = initial
      ? eventToFormInput(initial)
      : {
          eventOrganization: "",
          eventName: "",
          logoSlug: null,
          date: "",
          endDate: "",
          eventTier: "Small" as const,
          majorStage: null,
          stages: [],
          winnerOrganization: null,
          winnerLogoSlug: null,
        };

    setForm(next);
    setExtrasOpen(hasExtrasData(next));
  }, [open, initial]);

  const teamOptions = useMemo(
    () => getEventTeamSuggestions(bets, form.eventOrganization, form.eventName),
    [bets, form.eventOrganization, form.eventName]
  );

  const update = <K extends keyof EventEditInput>(key: K, value: EventEditInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const canSubmit =
    form.eventOrganization.trim() && form.eventName.trim() && Boolean(form.logoSlug?.trim());

  const extrasHint = useMemo(() => {
    const parts: string[] = [];
    if (form.winnerOrganization?.trim()) parts.push("победитель");
    if (form.stages.length > 0) parts.push(`${form.stages.length} стад.`);
    return parts.length > 0 ? parts.join(", ") : "необязательно";
  }, [form.winnerOrganization, form.stages.length]);

  const handleSubmit = async () => {
    if (!canSubmit || saving) return;
    const date = editEventDates
      ? (dateRef.current?.commit() ?? form.date)
      : (initial?.date ?? form.date);
    const endDate = editEventDates
      ? (endDateRef.current?.commit() ?? form.endDate)
      : (initial?.endDate ?? form.endDate);
    setSaving(true);
    try {
      await onSubmit({
        eventOrganization: form.eventOrganization.trim(),
        eventName: form.eventName.trim(),
        logoSlug: form.logoSlug?.trim() ?? null,
        date,
        endDate,
        eventTier: form.eventTier,
        majorStage: null,
        stages: form.stages,
        winnerOrganization: editEventDates
          ? form.winnerOrganization?.trim() || null
          : (initial?.winnerOrganization ?? null),
        winnerLogoSlug: editEventDates
          ? form.winnerOrganization?.trim()
            ? form.winnerLogoSlug?.trim() || null
            : null
          : (initial?.winnerLogoSlug ?? null),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const dialogTitle = title ?? (initial ? "Редактировать турнир" : "Новый турнир");

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
        <EventDialogHeader>
          <EventHeaderIcon>
            <EmojiEventsOutlinedIcon />
          </EventHeaderIcon>
          <HeaderText>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <HeaderSubtitle>
              {initial
                ? "Измените данные и сохраните"
                : "Название, логотип и даты турнира"}
            </HeaderSubtitle>
          </HeaderText>
          <IconButton onClick={onClose} aria-label="Закрыть" size="small" sx={{ mt: -0.5 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </EventDialogHeader>

        <DialogBody>
          <Section>
            <SectionTitle>Турнир</SectionTitle>
            <FieldsStack>
              <SuggestTextField
                label="Организация"
                value={form.eventOrganization}
                onChange={(v) => update("eventOrganization", v)}
                options={suggestions.eventOrganizations}
                sx={compactFieldSx}
              />
              <SuggestTextField
                label="Название"
                value={form.eventName}
                onChange={(v) => {
                  setForm((prev) => ({
                    ...prev,
                    eventName: v,
                    ...(initial
                      ? {}
                      : { eventTier: inferEventTier(prev.eventOrganization, v), majorStage: null }),
                  }));
                }}
                options={eventNameOptions}
                sx={compactFieldSx}
              />
              <EventTierSelect
                value={form.eventTier}
                hideLabel
                onChange={(tier) => {
                  setForm((prev) => ({
                    ...prev,
                    eventTier: tier,
                    majorStage: null,
                    stages:
                      prev.stages.length > 0
                        ? prev.stages
                        : tier === "Major"
                          ? defaultStagesForTier("Major")
                          : [],
                  }));
                }}
              />
            </FieldsStack>
          </Section>

          <Section>
            <SectionTitle>Логотип</SectionTitle>
            <EventLogoPicker
              value={form.logoSlug}
              onChange={(slug) => update("logoSlug", slug)}
              compact
            />
            {!form.logoSlug ? (
              <HintText>Выберите логотип из public/events</HintText>
            ) : null}
          </Section>

          {editEventDates ? (
            <Section>
              <SectionTitle>Даты</SectionTitle>
              <FieldsGrid $cols={2}>
                <DateInput
                  ref={dateRef}
                  label="Начало"
                  value={form.date}
                  onChange={(iso) => update("date", iso)}
                  fullWidth
                  size="small"
                  sx={compactFieldSx}
                />
                <DateInput
                  ref={endDateRef}
                  label="Окончание"
                  value={form.endDate}
                  onChange={(iso) => update("endDate", iso)}
                  allowEmpty
                  fullWidth
                  size="small"
                  sx={compactFieldSx}
                />
              </FieldsGrid>
              <HintText>Дата окончания необязательна</HintText>
            </Section>
          ) : null}

          {editEventDates ? (
            <Section>
              <MapsToggle type="button" onClick={() => setExtrasOpen((open) => !open)}>
                <MapsToggleLabel>Дополнительно</MapsToggleLabel>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <MapsToggleHint>{extrasHint}</MapsToggleHint>
                  {extrasOpen ? (
                    <ExpandLessIcon sx={{ fontSize: 18, color: "rgba(255,255,255,0.45)" }} />
                  ) : (
                    <ExpandMoreIcon sx={{ fontSize: 18, color: "rgba(255,255,255,0.45)" }} />
                  )}
                </Box>
              </MapsToggle>
              {extrasOpen ? (
                <ExtrasContent>
                  <SuggestTextField
                    label="Победитель"
                    value={form.winnerOrganization ?? ""}
                    onChange={(value) => {
                      const trimmed = value.trim();
                      setForm((prev) => ({
                        ...prev,
                        winnerOrganization: trimmed || null,
                        winnerLogoSlug: trimmed ? resolveWinnerLogoSlug(trimmed, teamLogos) : null,
                      }));
                    }}
                    options={teamOptions}
                    logo="team"
                    placeholder="Необязательно"
                    sx={compactFieldSx}
                  />
                  {form.winnerOrganization ? (
                    <TeamLogoPicker
                      teamName={form.winnerOrganization}
                      value={form.winnerLogoSlug}
                      onChange={(slug) => update("winnerLogoSlug", slug)}
                    />
                  ) : null}
                  <EventStagesEditor
                    stages={form.stages}
                    eventTier={form.eventTier}
                    onChange={(stages) => update("stages", stages)}
                  />
                </ExtrasContent>
              ) : null}
            </Section>
          ) : null}
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

export default EventFormDialog;
