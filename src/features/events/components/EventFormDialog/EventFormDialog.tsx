import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, IconButton, useMediaQuery, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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
import {
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogShell,
  DialogTitle,
  FooterButton,
  dialogBackdropSx,
  fieldSx,
} from "@/features/matches/components/MatchFormDialog/MatchFormDialog.styled";
import { resolveDialogPaperSx } from "@/shared/styles/dialogSx";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
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

    setForm(
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
          <DialogTitle>{title ?? (initial ? "Редактировать турнир" : "Новый турнир")}</DialogTitle>
          <IconButton onClick={onClose} aria-label="Закрыть" size="small">
            <CloseIcon />
          </IconButton>
        </DialogHeader>

        <DialogBody>
          {editEventDates ? (
            <>
              <DateInput
                ref={dateRef}
                label="Дата начала"
                value={form.date}
                onChange={(iso) => update("date", iso)}
                fullWidth
                sx={fieldSx}
              />
              <DateInput
                ref={endDateRef}
                label="Дата окончания"
                value={form.endDate}
                onChange={(iso) => update("endDate", iso)}
                allowEmpty
                fullWidth
                sx={fieldSx}
                helperText="Необязательно"
              />
            </>
          ) : null}
          <SuggestTextField
            label="Организация турнира"
            value={form.eventOrganization}
            onChange={(v) => update("eventOrganization", v)}
            options={suggestions.eventOrganizations}
            sx={fieldSx}
          />
          <SuggestTextField
            label="Название турнира"
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
            sx={fieldSx}
          />
          <EventLogoPicker
            value={form.logoSlug}
            onChange={(slug) => update("logoSlug", slug)}
          />
          <EventTierSelect
            value={form.eventTier}
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
          {editEventDates ? (
            <>
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
                placeholder="Выберите команду"
                sx={fieldSx}
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
            </>
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
