import type { MajorStage } from "@/entities/event";
import { MAJOR_STAGES } from "@/entities/event";
import { majorStageStyles } from "@/features/events/lib/majorStage";
import { TierChip, TierChipRow, TierLabel } from "@/features/events/components/EventTierSelect/EventTierSelect.styled";

interface MajorStageSelectProps {
  value: MajorStage | null;
  onChange: (stage: MajorStage) => void;
  label?: string;
}

const MajorStageSelect = ({
  value,
  onChange,
  label = "Стадия Major",
}: MajorStageSelectProps) => (
  <div>
    <TierLabel>{label}</TierLabel>
    <TierChipRow>
      {MAJOR_STAGES.map((stage) => {
        const style = majorStageStyles[stage];
        return (
          <TierChip
            key={stage}
            type="button"
            $tier="Major"
            $active={value === stage}
            onClick={() => onChange(stage)}
            style={
              value === stage
                ? {
                    color: style.color,
                    background: style.bg,
                    borderColor: style.border,
                  }
                : undefined
            }
          >
            {stage}
          </TierChip>
        );
      })}
    </TierChipRow>
  </div>
);

export default MajorStageSelect;
