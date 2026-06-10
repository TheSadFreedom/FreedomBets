import { useState } from "react";
import { Button, TextField } from "@mui/material";
import type { EventTier } from "@/entities/event";
import { getEventStageQuickOptions } from "@/features/events/lib/eventStages";
import { TierLabel } from "@/features/events/components/EventTierSelect/EventTierSelect.styled";
import { fieldSx } from "@/features/matches/components/MatchFormDialog/MatchFormDialog.styled";
import { limitInputLength, MAX_INPUT_LENGTH } from "@/shared/lib/limits";
import {
  AddRow,
  EditorHint,
  EditorRoot,
  QuickAddButton,
  QuickAddRow,
  StageChip,
  StageChipRemove,
  StageChipRow,
} from "./EventStagesEditor.styled";

interface EventStagesEditorProps {
  stages: string[];
  eventTier: EventTier;
  onChange: (stages: string[]) => void;
}

const EventStagesEditor = ({ stages, eventTier, onChange }: EventStagesEditorProps) => {
  const [draft, setDraft] = useState("");

  const addStage = (name: string) => {
    const value = name.trim();
    if (!value || stages.includes(value)) return;
    onChange([...stages, value]);
    setDraft("");
  };

  const removeStage = (name: string) => {
    onChange(stages.filter((stage) => stage !== name));
  };

  const quickOptions = getEventStageQuickOptions(eventTier);

  return (
    <EditorRoot>
      <TierLabel>Стадии турнира</TierLabel>
      <EditorHint>
        Пустой список — турнир без деления на стадии. Добавьте стадии, если у турнира несколько
        этапов.
      </EditorHint>

      <StageChipRow>
        {stages.length === 0 ? (
          <EditorHint>Без стадий</EditorHint>
        ) : (
          stages.map((stage) => (
            <StageChip key={stage}>
              {stage}
              <StageChipRemove type="button" aria-label={`Удалить стадию ${stage}`} onClick={() => removeStage(stage)}>
                ×
              </StageChipRemove>
            </StageChip>
          ))
        )}
      </StageChipRow>

      <AddRow>
        <TextField
          label="Новая стадия"
          value={draft}
          onChange={(e) => setDraft(limitInputLength(e.target.value))}
          slotProps={{ htmlInput: { maxLength: MAX_INPUT_LENGTH } }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addStage(draft);
            }
          }}
          size="small"
          fullWidth
          sx={fieldSx}
        />
        <Button
          type="button"
          variant="outlined"
          size="small"
          onClick={() => addStage(draft)}
          disabled={!draft.trim()}
          sx={{ flexShrink: 0, mt: 0.25 }}
        >
          Добавить
        </Button>
      </AddRow>

      {quickOptions.length > 0 ? (
        <QuickAddRow>
          {quickOptions.map((stage) => (
            <QuickAddButton
              key={stage}
              type="button"
              disabled={stages.includes(stage)}
              onClick={() => addStage(stage)}
            >
              + {stage}
            </QuickAddButton>
          ))}
        </QuickAddRow>
      ) : null}
    </EditorRoot>
  );
};

export default EventStagesEditor;
