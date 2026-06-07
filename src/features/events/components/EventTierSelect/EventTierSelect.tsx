import type { EventTier } from "@/entities/event";
import { EVENT_TIERS } from "@/entities/event";
import { TierChip, TierChipRow, TierLabel } from "./EventTierSelect.styled";

interface EventTierSelectProps {
  value: EventTier;
  onChange: (tier: EventTier) => void;
  label?: string;
}

const EventTierSelect = ({ value, onChange, label = "Статус турнира" }: EventTierSelectProps) => (
  <div>
    <TierLabel>{label}</TierLabel>
    <TierChipRow>
      {EVENT_TIERS.map((tier) => (
        <TierChip
          key={tier}
          type="button"
          $tier={tier}
          $active={value === tier}
          onClick={() => onChange(tier)}
        >
          {tier}
        </TierChip>
      ))}
    </TierChipRow>
  </div>
);

export default EventTierSelect;
