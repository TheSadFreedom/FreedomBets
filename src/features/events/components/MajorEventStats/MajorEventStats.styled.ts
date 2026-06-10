import styled from "styled-components";
import { media } from "@/shared/styles/breakpoints";
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

  ${media.up("md")} {
    padding: 8px 0 0;
    border-radius: 0;
    background: transparent;
    border: none;
  }

  &:not(:first-child) {
    ${media.up("md")} {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }
  }

  ${media.down("md")} {
    &:not(:first-child) {
      margin-top: 4px;
    }
  }
`;

export const MajorStageHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  min-width: 0;

  ${media.up("md")} {
    grid-template-columns: auto 1fr;
    gap: 8px 10px;
  }
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

  ${media.up("md")} {
    grid-column: 2;
    grid-row: 1;
    justify-content: flex-end;
    flex-wrap: nowrap;
    gap: 8px;
  }
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

  ${media.up("md")} {
    min-height: 26px;
    padding: 0;
    border-radius: 0;
    background: transparent;
    border: none;
    font-size: 11px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.5);
  }
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

  ${media.up("md")} {
    min-height: 26px;
    padding: 0;
    border-radius: 0;
    background: transparent;
    border: none;
    font-size: 11px;
    font-weight: 600;
  }
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

  ${media.up("md")} {
    min-height: 26px;
    padding: 0;
    border-radius: 0;
    background: transparent;
    border: none;

    ${WldBadge} {
      display: inline-grid;
      place-items: center;
      box-sizing: border-box;
      height: 20px;
      min-width: 20px;
      padding: 0 5px;
      text-align: center;
    }
  }
`;

export const StageEmptyNote = styled.p`
  margin: 0;
  padding: 8px 0 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.38);
  text-align: center;

  ${media.up("md")} {
    padding: 4px 0;
    text-align: left;
  }
`;

export const StageBetsWrap = styled.div`
  min-width: 0;
`;
