import styled from "styled-components";
import {
  BalanceCard,
  BalanceCardLabel,
  BalanceCardValue,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogHeaderRow,
  DialogShell,
  DialogSubtitle,
  DialogTitle,
  FooterButton,
  HeaderIcon,
  HeaderText,
  HintText,
  PresetChip,
  PresetGrid,
  PreviewCard,
  PreviewLabel,
  PreviewValue,
  fieldSx,
} from "../BalanceDialog/BalanceDialog.styled";

export {
  DialogBody,
  DialogFooter,
  DialogShell,
  FooterButton,
  HintText,
  PresetChip,
  PresetGrid,
  PreviewCard,
  PreviewLabel,
  PreviewValue,
  fieldSx,
};

export const WithdrawDialogHeader = styled(DialogHeader)`
  background:
    radial-gradient(circle at 100% 0%, rgba(239, 83, 80, 0.18) 0%, transparent 52%),
    linear-gradient(180deg, rgba(239, 83, 80, 0.12) 0%, rgba(0, 0, 0, 0.08) 100%);
`;

export const WithdrawHeaderIcon = styled(HeaderIcon)`
  color: #ef9a9a;
  background: linear-gradient(135deg, rgba(239, 83, 80, 0.24) 0%, rgba(198, 40, 40, 0.1) 100%);
  border-color: rgba(239, 83, 80, 0.32);
  box-shadow: 0 4px 14px rgba(239, 83, 80, 0.12);
`;

export const WithdrawBalanceCard = styled(BalanceCard)`
  border-color: rgba(239, 83, 80, 0.24);
`;

export const WithdrawBalanceValue = styled(BalanceCardValue)`
  color: #ef9a9a;
`;

export const WithdrawPreviewCard = styled(PreviewCard)`
  background: rgba(239, 83, 80, 0.08);
  border-color: rgba(239, 83, 80, 0.2);
`;

export const WithdrawPreviewValue = styled(PreviewValue)`
  color: #ef5350;
`;

export const WithdrawFooterButton = styled(FooterButton)<{ $primary?: boolean }>`
  ${({ $primary }) =>
    $primary
      ? `
    color: #2e1515;
    background: linear-gradient(145deg, #ef5350 0%, #e53935 100%);
  `
      : ""}
`;

export { BalanceCardLabel, DialogHeaderRow, DialogSubtitle, DialogTitle, HeaderText };
