import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Dialog, IconButton, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { Bet } from "@/entities/bet";
import type { EventEditInput, EventStats } from "@/entities/event";
import { EVENT_TIERS } from "@/entities/event";
import {
  getEventNameSuggestions,
  getEventTeamSuggestions,
} from "@/features/bets/lib/formSuggestions";
import EventLogoPicker from "@/features/events/components/EventLogoPicker/EventLogoPicker";
import TeamLogoPicker from "@/features/events/components/TeamLogoPicker/TeamLogoPicker";
import { inferEventTier } from "@/features/events/lib/eventTier";
import { storedEventTitle } from "@/features/events/lib/eventTitle";
import { MAX_EVENT_NAME_LENGTH } from "@/shared/lib/limits";
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
  name: storedEventTitle(event),
  eventName: storedEventTitle(event),
  logoSlug: event.logoSlug,
  date: event.date,
  endDate: event.endDate ?? "",
  size: event.size,
  winnerTeamId: event.winnerTeamId,
  winnerOrganization: event.winnerOrganization,
  winnerLogoSlug: event.winnerLogoSlug,
  prizePool: event.prizePool,
});

const resolveWinnerLogoSlug = (
  teamName: string,
  logos: { id: string }[]
): string | null => {
  const slug = teamLogoSlug(teamName);
  return logos.some((logo) => logo.id === slug) ? slug : null;
};

function hasExtrasData(form: EventEditInput): boolean {
  return Boolean(form.winnerOrganization?.trim());
}

const emptyForm = (): EventEditInput => ({
  name: "",
  eventName: "",
  logoSlug: null,
  date: "",
  endDate: "",
  size: "Small",
  winnerTeamId: null,
  winnerOrganization: null,
  winnerLogoSlug: null,
  prizePool: null,
});

interface EventFormDialogProps {
  open: boolean;
  bets: Bet[];
  title?: string;
  initial?: EventStats;
  onClose: () => void;
  onSubmit: (values: EventEditInput) => Promise<void>;
}

const EventFormDialog = ({
  open,
  bets,
  title,
  initial,
  onClose,
  onSubmit,
}: EventFormDialogProps) => {
  const [form, setForm] = useState<EventEditInput>(() =>
    initial ? eventToFormInput(initial) : emptyForm()
  );
  const [saving, setSaving] = useState(false);
  const [extrasOpen, setExtrasOpen] = useState(() =>
    initial ? hasExtrasData(eventToFormInput(initial)) : false
  );
  const teamLogos = useTeamLogosManifest();
  const dateRef = useRef<DateInputHandle>(null);
  const endDateRef = useRef<DateInputHandle>(null);
  const formInitialized = useRef(false);

  const eventNameOptions = useMemo(() => getEventNameSuggestions(bets, ""), [bets]);

  useEffect(() => {
    if (!open) {
      formInitialized.current = false;
      return;
    }
    if (formInitialized.current) return;
    formInitialized.current = true;

    const next = initial ? eventToFormInput(initial) : emptyForm();
    setForm(next);
    setExtrasOpen(hasExtrasData(next));
  }, [open, initial]);

  const eventName = form.eventName ?? form.name;

  const teamOptions = useMemo(
    () => getEventTeamSuggestions(bets, "", eventName),
    [bets, eventName]
  );

  const update = <K extends keyof EventEditInput>(key: K, value: EventEditInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const canSubmit = eventName.trim() && Boolean(form.logoSlug?.trim());

  const extrasHint = form.winnerOrganization?.trim() ? "победитель" : "необязательно";

  const handleSubmit = async () => {
    if (!canSubmit || saving) return;
    const date = dateRef.current?.commit() ?? form.date;
    const endDate = endDateRef.current?.commit() ?? form.endDate;
    setSaving(true);
    try {
      await onSubmit({
        name: eventName.trim(),
        eventName: eventName.trim(),
        logoSlug: form.logoSlug?.trim() ?? null,
        date,
        endDate,
        size: form.size ?? form.eventTier ?? initial?.size ?? inferEventTier("", eventName.trim()),
        winnerTeamId: form.winnerOrganization?.trim() || null,
        winnerOrganization: form.winnerOrganization?.trim() || null,
        winnerLogoSlug: form.winnerOrganization?.trim()
          ? form.winnerLogoSlug?.trim() || null
          : null,
        prizePool: form.prizePool,
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
                label="Название"
                value={eventName}
                onChange={(v) => {
                  update("eventName", v);
                  update("name", v);
                }}
                options={eventNameOptions}
                maxLength={MAX_EVENT_NAME_LENGTH}
                sx={compactFieldSx}
              />
            </FieldsStack>
          </Section>

          <Section>
            <SectionTitle>Размер</SectionTitle>
            <ToggleButtonGroup
              value={form.size ?? form.eventTier ?? "Small"}
              exclusive
              fullWidth
              size="small"
              onChange={(_, value) => {
                if (value) update("size", value);
              }}
            >
              {EVENT_TIERS.map((tier) => (
                <ToggleButton key={tier} value={tier} sx={{ flex: 1, textTransform: "none" }}>
                  {tier}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <HintText>Major — крупнейшие турниры, Big — значимые, Small — остальные</HintText>
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

          <Section>
            <SectionTitle>Призовой фонд</SectionTitle>
            <TextField
              label="Сумма ($)"
              value={form.prizePool ?? ""}
              onChange={(e) => {
                const raw = e.target.value.replace(/\s/g, "");
                if (!raw) {
                  update("prizePool", null);
                  return;
                }
                const digits = raw.replace(/[^\d]/g, "");
                update("prizePool", digits ? Number(digits) : null);
              }}
              placeholder="Необязательно"
              fullWidth
              size="small"
              sx={compactFieldSx}
              slotProps={{
                htmlInput: { inputMode: "numeric", pattern: "[0-9]*" },
              }}
            />
            <HintText>Указывается в долларах США</HintText>
          </Section>

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
                    teamName={form.winnerOrganization ?? ""}
                    value={form.winnerLogoSlug ?? null}
                    onChange={(slug) => update("winnerLogoSlug", slug)}
                  />
                ) : null}
              </ExtrasContent>
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

export default EventFormDialog;
