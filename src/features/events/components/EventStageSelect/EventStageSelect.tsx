import { StageChip, StageChipRow, StageLabel } from "./EventStageSelect.styled";

interface EventStageSelectProps {
  stages: string[];
  value: string | null;
  onChange: (stage: string) => void;
  label?: string;
}

const EventStageSelect = ({
  stages,
  value,
  onChange,
  label = "Стадия",
}: EventStageSelectProps) => {
  if (stages.length === 0) return null;

  return (
    <div>
      <StageLabel>{label}</StageLabel>
      <StageChipRow>
        {stages.map((stage) => (
          <StageChip
            key={stage}
            type="button"
            $active={value === stage}
            onClick={() => onChange(stage)}
          >
            {stage}
          </StageChip>
        ))}
      </StageChipRow>
    </div>
  );
};

export default EventStageSelect;
