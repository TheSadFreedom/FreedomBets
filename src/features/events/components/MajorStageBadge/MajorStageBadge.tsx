import type { MajorStage } from "@/entities/event";
import { majorStageStyles } from "@/features/events/lib/majorStage";
import styled from "styled-components";

const Badge = styled.span<{ $stage: MajorStage }>`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ $stage }) => majorStageStyles[$stage].color};
  background: ${({ $stage }) => majorStageStyles[$stage].bg};
  border: 1px solid ${({ $stage }) => majorStageStyles[$stage].border};
`;

interface MajorStageBadgeProps {
  stage: MajorStage;
}

const MajorStageBadge = ({ stage }: MajorStageBadgeProps) => (
  <Badge $stage={stage}>{stage}</Badge>
);

export default MajorStageBadge;
