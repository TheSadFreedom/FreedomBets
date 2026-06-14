import styled from "styled-components";
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  padding-bottom: calc(76px + env(safe-area-inset-bottom, 0px));
`;
