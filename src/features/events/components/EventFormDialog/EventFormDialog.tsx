import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { Bet } from "@/entities/bet";
import type { EventEditInput, EventStats } from "@/entities/event";
import {
  getBetFormSuggestions,
  getEventNameOrganizationMap,
  getEventNameSuggestions,
} from "@/features/bets/lib/formSuggestions";
import EventTierSelect from "@/features/events/components/EventTierSelect/EventTierSelect";
import { inferEventTier } from "@/features/events/lib/eventTier";
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
  dialogPaperSx,
  fieldSx,
} from "@/features/matches/components/MatchFormDialog/MatchFormDialog.styled";

const eventToFormInput = (event: EventStats): EventEditInput => ({
  eventOrganization: event.eventOrganization,
  eventName: event.eventName,
  date: event.date,
  endDate: event.endDate ?? "",
  eventTier: event.eventTier,
  majorStage: event.majorStage,
});

interface EventFormDialogProps {
  open: boolean;
  bets: Bet[];
  title?: string;
  initial?: EventStats;
  /** Показывать и сохранять даты ивента (не стадии major) */
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
          date: "",
          endDate: "",
          eventTier: "Small",
          majorStage: null,
        }
  );
  const [saving, setSaving] = useState(false);
  const dateRef = useRef<DateInputHandle>(null);
  const endDateRef = useRef<DateInputHandle>(null);
  const formInitialized = useRef(false);

  const suggestions = useMemo(() => getBetFormSuggestions(bets), [bets]);
  const eventNameOrgMap = useMemo(() => getEventNameOrganizationMap(bets), [bets]);
  const eventNameOptions = useMemo(
    () => getEventNameSuggestions(bets, form.eventOrganization),
    [bets, form.eventOrganization]
  );
  const eventNameLogo = (eventName: string) =>
    eventNameOrgMap.get(eventName.trim()) ?? form.eventOrganization;

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
            date: "",
            endDate: "",
            eventTier: "Small",
            majorStage: null,
          }
    );
  }, [open, initial]);

  const update = <K extends keyof EventEditInput>(key: K, value: EventEditInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const canSubmit = form.eventOrganization.trim() && form.eventName.trim();

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
        date,
        endDate,
        eventTier: form.eventTier,
        majorStage: null,
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
          <DialogTitle>{title ?? (initial ? "Редактировать ивент" : "Новый ивент")}</DialogTitle>
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
            logo="organization"
            sx={fieldSx}
          />
          <SuggestTextField
            label="Название ивента"
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
            logo="organization"
            getLogoName={eventNameLogo}
            sx={fieldSx}
          />
          <EventTierSelect
            value={form.eventTier}
            onChange={(tier) => {
              setForm((prev) => ({
                ...prev,
                eventTier: tier,
                majorStage: null,
              }));
            }}
          />
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
