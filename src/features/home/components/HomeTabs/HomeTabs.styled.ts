import styled from "styled-components";
import { media } from "@/shared/styles/breakpoints";

export const TabsRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;

  ${media.down("sm")} {
    gap: 12px;
  }
`;

export const TabLabel = styled.span`
  display: inline-flex;
  align-items: center;
  line-height: 1;
  min-height: 18px;
`;

export const TabsBar = styled.div`
  position: relative;
  padding: 6px;
  border-radius: 16px;
  background:
    radial-gradient(circle at 0% 0%, rgba(76, 175, 80, 0.1) 0%, transparent 42%),
    linear-gradient(145deg, rgba(42, 42, 42, 0.98) 0%, rgba(24, 24, 24, 0.99) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 2px 16px rgba(0, 0, 0, 0.24),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  overflow: hidden;

  .MuiTabs-root {
    display: flex;
    align-items: center;
    width: 100%;
    min-height: unset;
  }

  .MuiTabs-scroller {
    width: 100%;
    overflow: visible !important;
  }

  .MuiTabs-flexContainer {
    display: grid !important;
    width: 100%;
    align-items: center;
    gap: 4px;
    grid-auto-rows: 40px;
    grid-template-columns: repeat(8, minmax(0, 1fr));

    ${media.down("lg")} {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    ${media.down("xs")} {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  .MuiTabs-indicator {
    display: none;
  }

  .MuiTabs-scrollButtons {
    display: none !important;
  }

  .MuiTab-root {
    display: inline-flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 6px;
    width: 100%;
    max-width: 100%;
    height: 40px !important;
    min-height: 40px !important;
    max-height: 40px !important;
    min-width: 0;
    margin: 0 !important;
    padding: 0 8px !important;
    border-radius: 12px;
    border: 1px solid transparent;
    box-sizing: border-box;
    font-size: 13px;
    font-weight: 600;
    line-height: 1 !important;
    letter-spacing: 0.01em;
    text-transform: none;
    color: rgba(255, 255, 255, 0.52);
    flex: unset !important;
    transition:
      color 0.18s ease,
      background 0.18s ease,
      border-color 0.18s ease,
      box-shadow 0.18s ease;
    z-index: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    &.MuiTab-labelIcon {
      flex-direction: row !important;
      min-height: 40px !important;
    }

    .MuiTab-iconWrapper {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 18px;
      height: 18px;
      margin: 0 !important;
      margin-bottom: 0 !important;
      padding: 0 !important;
      flex-shrink: 0;
      transition: color 0.18s ease;

      svg {
        display: block;
        width: 17px;
        height: 17px;
      }
    }

    &:hover {
      color: rgba(255, 255, 255, 0.88);
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.06);
    }

    &.Mui-selected {
      color: rgba(255, 255, 255, 0.96);
      background: linear-gradient(
        135deg,
        rgba(76, 175, 80, 0.28) 0%,
        rgba(56, 142, 60, 0.14) 100%
      );
      border-color: rgba(102, 187, 106, 0.38);
      box-shadow:
        0 4px 14px rgba(76, 175, 80, 0.14),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);

      .MuiTab-iconWrapper {
        color: #a5d6a7;
      }
    }

    &.Mui-focusVisible {
      outline: 2px solid rgba(129, 199, 132, 0.65);
      outline-offset: 2px;
    }
  }

  ${media.down("md")} {
    .MuiTab-root {
      font-size: 12px;
      gap: 5px;
      padding: 0 6px;
    }
  }

  ${media.down("xs")} {
    padding: 5px;

    .MuiTabs-flexContainer {
      grid-auto-rows: 38px;
    }

    .MuiTab-root {
      height: 38px !important;
      min-height: 38px !important;
      max-height: 38px !important;
      font-size: 11px;
      border-radius: 10px;

      &.MuiTab-labelIcon {
        min-height: 38px !important;
      }
    }
  }
`;

export const TabsPanel = styled.div`
  min-width: 0;

  &[hidden] {
    display: none;
  }
`;
