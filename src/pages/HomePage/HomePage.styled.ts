import styled from "styled-components";
import { media } from "@/shared/styles/breakpoints";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;

  ${media.down("md")} {
    gap: 10px;
    padding-bottom: 4px;
  }
`;
