import styled from "styled-components";
import { media } from "@/shared/styles/breakpoints";
import { mobilePageBackdrop } from "@/shared/styles/mobileTokens";

/** Общая ширина контента header + main */
const CONTENT_MAX_WIDTH = "1720px";

export const LayoutRoot = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.header`
  padding: 0 max(12px, env(safe-area-inset-right)) 0 max(12px, env(safe-area-inset-left));
  overflow: visible;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: #181818;

  ${media.down("md")} {
    display: none;
  }
`;

export const HeaderInner = styled.div`
  max-width: ${CONTENT_MAX_WIDTH};
  width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px 24px;

  ${media.down("md")} {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
    gap: 10px;
    padding: 4px 0 8px;
  }

  ${media.down("xs")} {
    gap: 8px;
    padding: 2px 0 6px;
  }
`;

export const HeaderLeft = styled.nav`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-self: start;
  padding: 8px 0;

  ${media.down("md")} {
    justify-self: center;
    order: 2;
    gap: 8px;
  }
`;

export const HeaderLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  text-decoration: none;
  background: transparent;
  border: none;
  border-radius: 6px;
  opacity: 0.88;
  transition: opacity 0.18s ease, transform 0.18s ease;

  &:hover {
    opacity: 1;
    transform: scale(1.04);
  }

  &:focus-visible {
    outline: 2px solid #66bb6a;
    outline-offset: 3px;
  }
`;

export const HeaderLinkLogo = styled.img`
  display: block;
  height: 28px;
  width: auto;
  max-width: 110px;
  object-fit: contain;
  object-position: center;

  ${media.down("xs")} {
    height: 24px;
    max-width: 88px;
  }
`;

export const HeaderCenter = styled.div`
  display: block;
  line-height: 0;
  padding: 0;
  margin: 0;
  justify-self: center;

  ${media.down("md")} {
    order: 1;
  }
`;

export const LogoButton = styled.button`
  display: block;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  line-height: 0;
  border-radius: 12px;
  transition: transform 0.18s ease, filter 0.18s ease;

  &:hover {
    transform: scale(1.04);
    filter: brightness(1.08);
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid #66bb6a;
    outline-offset: 4px;
  }
`;

export const LogoMark = styled.img`
  display: block;
  width: 75px;
  height: 75px;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  box-shadow: none;
  object-fit: contain;
  vertical-align: top;
  pointer-events: none;

  ${media.down("sm")} {
    width: 58px;
    height: 58px;
  }

  ${media.down("xs")} {
    width: 48px;
    height: 48px;
  }
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  justify-self: end;
  min-width: 0;
  padding: 8px 0;

  ${media.down("md")} {
    justify-self: center;
    order: 3;
    width: 100%;
    justify-content: center;
    padding-bottom: 4px;
  }
`;

export const Main = styled.main`
  flex: 1;
  max-width: ${CONTENT_MAX_WIDTH};
  width: 100%;
  margin: 0 auto;
  padding: 20px 20px max(32px, env(safe-area-inset-bottom));
  box-sizing: border-box;
  min-width: 0;
  ${mobilePageBackdrop};

  ${media.down("md")} {
    padding: max(12px, env(safe-area-inset-top)) 12px 0;
  }

  ${media.down("xs")} {
    padding: max(12px, env(safe-area-inset-top)) 10px 0;
  }
`;
