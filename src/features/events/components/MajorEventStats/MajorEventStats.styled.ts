import styled from "styled-components";
import {
  WldBadge,
  WldBadges,
} from "@/features/events/components/EventStats/EventStats.styled";

export const MajorStageBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  padding: 10px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);


  &:not(:first-child) {
  }

`;

export const MajorStageHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  min-width: 0;

`;

export const MajorStageLabel = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  grid-column: 1;
  grid-row: 1;
`;

export const MajorStageTitle = styled.div`
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.55);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  line-height: 1;
`;

export const StageMeta = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  min-width: 0;
  grid-column: 1 / -1;
  grid-row: 2;

`;

export const StageMetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
  color: rgba(255, 255, 255, 0.55);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);

`;

export const StageMetaValue = styled.span<{ $color?: string }>`
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  color: ${({ $color }) => $color ?? "rgba(255, 255, 255, 0.72)"};
  font-weight: 700;
  font-size: 10px;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);

`;

export const StageWldBadges = styled(WldBadges)`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  min-height: 22px;
  padding: 0 6px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.06);

  ${WldBadge} {
    display: inline-grid;
    place-items: center;
    box-sizing: border-box;
    height: 18px;
    min-width: 18px;
    padding: 0 4px;
    line-height: 1;
    font-size: 10px;
    text-align: center;
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
