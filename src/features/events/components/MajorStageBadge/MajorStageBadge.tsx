import { stageStyleFor } from "@/features/events/lib/eventStages";
import styled from "styled-components";

const Badge = styled.span<{ $color: string; $bg: string; $border: string; $compact?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  min-height: ${({ $compact }) => ($compact ? "22px" : "26px")};
  padding: ${({ $compact }) => ($compact ? "0 7px" : "0 8px")};
  border-radius: 999px;
  font-size: ${({ $compact }) => ($compact ? "8px" : "9px")};
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ $color }) => $color};
  background: ${({ $bg }) => $bg};
  border: 1px solid ${({ $border }) => $border};
`;

interface MajorStageBadgeProps {
  stage: string;
  compact?: boolean;
}

const MajorStageBadge = ({ stage, compact = false }: MajorStageBadgeProps) => {
  const style = stageStyleFor(stage);
  return (
    <Badge $compact={compact} $color={style.color} $bg={style.bg} $border={style.border}>
      {stage}
    </Badge>
  );
};

export default MajorStageBadge;
