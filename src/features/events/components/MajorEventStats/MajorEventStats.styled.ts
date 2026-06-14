import styled from "styled-components";
import {
  EventMetricPanel,
  EventMetricValue,
  WldBadge,
  WldBadges,
} from "@/features/events/components/EventStats/EventStats.styled";

export const MajorStageBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  padding: 12px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

export const MajorStageHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-width: 0;
`;

export const MajorStageLabel = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
`;

export const MajorStageTitle = styled.div`
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.55);
  text-transform: lowercase;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const StageMeta = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
`;

export const StageMetaPanel = styled(EventMetricPanel)`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 8px 12px;
  flex: 0 1 auto;
`;

export const StageMetaItem = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.62);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
`;

export const StageMetaValue = styled(EventMetricValue)`
  font-size: 13px;
`;

export const StageWldBadges = styled(WldBadges)`
  gap: 3px;

  ${WldBadge} {
    height: 18px;
    min-width: 18px;
    font-size: 10px;
  }
`;

export const StageEmptyNote = styled.p`
  margin: 0;
  padding: 8px 0 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.38);
  text-align: center;
`;

export const StageBetsWrap = styled.div`
  min-width: 0;
`;
