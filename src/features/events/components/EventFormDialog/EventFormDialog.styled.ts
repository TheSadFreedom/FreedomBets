import styled from "styled-components";
import {
  DialogHeader,
  HeaderIcon,
} from "@/features/matches/components/MatchFormDialog/MatchFormDialog.styled";

export {
  DialogBody,
  DialogFooter,
  DialogShell,
  DialogTitle,
  FieldsGrid,
  FieldsStack,
  FooterButton,
  HeaderSubtitle,
  HeaderText,
  HintText,
  MapsToggle,
  MapsToggleHint,
  MapsToggleLabel,
  Section,
  SectionTitle,
  compactFieldSx,
  dialogBackdropSx,
  fieldSx,
} from "@/features/matches/components/MatchFormDialog/MatchFormDialog.styled";

export const EventDialogHeader = styled(DialogHeader)`
  background: linear-gradient(
    180deg,
    rgba(255, 167, 38, 0.1) 0%,
    rgba(255, 167, 38, 0.03) 100%
  );
`;

export const EventHeaderIcon = styled(HeaderIcon)`
  background: linear-gradient(
    145deg,
    rgba(255, 167, 38, 0.28) 0%,
    rgba(255, 167, 38, 0.14) 100%
  );
  border: 1px solid rgba(255, 167, 38, 0.35);

  svg {
    color: #ffcc80;
  }
`;

export const ExtrasContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
`;
