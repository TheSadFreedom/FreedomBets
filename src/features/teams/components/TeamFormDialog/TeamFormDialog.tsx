import { useEffect, useState } from "react";
import { Dialog, IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import axios from "axios";
import type { Team, TeamEditInput } from "@/entities/team";
import { limitInputLength, MAX_INPUT_LENGTH } from "@/shared/lib/limits";
import { dialogPaperSx } from "@/shared/styles/dialogSx";
import {
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogShell,
  DialogTitle,
  FieldsStack,
  FooterButton,
  HeaderIcon,
  HeaderText,
  HintText,
  Section,
  SectionTitle,
  compactFieldSx,
  dialogBackdropSx,
  fieldSx,
} from "@/features/matches/components/MatchFormDialog/MatchFormDialog.styled";

function synonymsToText(synonyms: string[]): string {
  return synonyms.join("\n");
}

function parseSynonyms(raw: string): string[] {
  return [
    ...new Set(
      raw
        .split(/[\n,;]+/)
        .map((item) => limitInputLength(item.trim()))
        .filter(Boolean)
    ),
  ];
}

interface TeamFormDialogProps {
  open: boolean;
  team: Team | null;
  title?: string;
  submitLabel?: string;
  onClose: () => void;
  onSubmit: (teamId: string, values: TeamEditInput) => Promise<void>;
}

const TeamFormDialog = ({
  open,
  team,
  title = "Редактирование команды",
  submitLabel = "Сохранить",
  onClose,
  onSubmit,
}: TeamFormDialogProps) => {
  const [name, setName] = useState("");
  const [synonymsText, setSynonymsText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !team) return;

    setName(team.name);
    setSynonymsText(synonymsToText(team.synonyms ?? []));
    setError(null);
  }, [open, team]);

  const handleSubmit = async () => {
    if (!team) return;

    const trimmedName = limitInputLength(name.trim());
    if (!trimmedName) return;

    setSaving(true);
    setError(null);
    try {
      await onSubmit(team.id, {
        name: trimmedName,
        synonyms: parseSynonyms(synonymsText),
      });
      onClose();
    } catch (submitError) {
      let message = "Не удалось сохранить команду";
      if (axios.isAxiosError(submitError)) {
        const apiError = submitError.response?.data;
        if (
          apiError &&
          typeof apiError === "object" &&
          "error" in apiError &&
          typeof apiError.error === "string"
        ) {
          message = apiError.error;
        }
      } else if (submitError instanceof Error && submitError.message.trim()) {
        message = submitError.message;
      }
      setError(message);
    } finally {
      setSaving(false);
    }
  };

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
            <GroupsOutlinedIcon />
          </HeaderIcon>
          <HeaderText>
            <DialogTitle>{title}</DialogTitle>
            <HintText>Основное название и синонимы для сопоставления</HintText>
          </HeaderText>
          <IconButton onClick={onClose} aria-label="Закрыть" size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogHeader>

        <DialogBody>
          <FieldsStack>
            <Section>
              <SectionTitle>Основное название команды</SectionTitle>
              <TextField
                fullWidth
                size="small"
                value={name}
                onChange={(event) => setName(limitInputLength(event.target.value))}
                slotProps={{ htmlInput: { maxLength: MAX_INPUT_LENGTH } }}
                sx={fieldSx}
              />
            </Section>

            <Section>
              <SectionTitle>Синонимы</SectionTitle>
              <TextField
                fullWidth
                size="small"
                multiline
                minRows={4}
                placeholder="По одному на строку"
                value={synonymsText}
                onChange={(event) => setSynonymsText(event.target.value)}
                sx={compactFieldSx}
              />
            </Section>
            {error ? <HintText>{error}</HintText> : null}
          </FieldsStack>
        </DialogBody>

        <DialogFooter>
          <FooterButton type="button" onClick={onClose} disabled={saving}>
            Отмена
          </FooterButton>
          <FooterButton
            type="button"
            $primary
            disabled={saving || !name.trim()}
            onClick={() => void handleSubmit()}
          >
            {saving ? "Сохранение…" : submitLabel}
          </FooterButton>
        </DialogFooter>
      </DialogShell>
    </Dialog>
  );
};

export default TeamFormDialog;
