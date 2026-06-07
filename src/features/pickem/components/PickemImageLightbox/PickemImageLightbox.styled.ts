import styled from "styled-components";

export const LightboxShell = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LightboxImage = styled.img`
  display: block;
  max-width: min(95vw, 1400px);
  max-height: 90vh;
  width: auto;
  height: auto;
  border-radius: 10px;
  object-fit: contain;
  cursor: zoom-out;
`;
