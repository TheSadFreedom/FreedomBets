import { Box, Typography } from "@mui/material";
import type { Bet } from "@/entities/bet";
import ActionButtons from "@/features/bets/components/ActionButtons/ActionButtons";
import BetDescriptionCell from "@/features/bets/components/BetDescriptionCell/BetDescriptionCell";
import MajorStageBadge from "@/features/events/components/MajorStageBadge/MajorStageBadge";
import TeamLogo from "@/shared/ui/TeamLogo/TeamLogo";
import OrganizationLogo from "@/shared/ui/OrganizationLogo/OrganizationLogo";
import { formatIsoDateDots } from "@/shared/lib/date/isoDate";
import {
  MobileBetActions,
  MobileBetCard,
  MobileBetFooter,
  MobileBetHeader,
  MobileBetMain,
  MobileBetMeta,
  MobileBetRow,
  MobileBetTeams,
  MobileBetValue,
  MobileBetValues,
  FormatBadge,
  PayoutValue,
  StatusBadge,
} from "./BetsHistory.styled";

interface BetsHistoryMobileListProps {
  bets: Bet[];
  onEdit: (bet: Bet) => void;
  onDelete: (bet: Bet) => void;
  onWin: (id: string) => void;
  onLose: (id: string) => void;
  onRevert: (id: string) => void;
}

const formatPayout = (bet: Bet) => {
  if (bet.status === "WAIT") {
    return `до ${(bet.amount * bet.odds).toLocaleString("ru-RU", { maximumFractionDigits: 0 })} ₽`;
  }
  if (bet.status === "WIN") {
    return `+${(bet.amount * bet.odds - bet.amount).toLocaleString("ru-RU", { maximumFractionDigits: 0 })} ₽`;
  }
  return `−${bet.amount.toLocaleString("ru-RU")} ₽`;
};

const BetsHistoryMobileList = ({
  bets,
  onEdit,
  onDelete,
  onWin,
  onLose,
  onRevert,
}: BetsHistoryMobileListProps) => (
  <Box display="flex" flexDirection="column" gap={1} px={1} pb={1.5} pt={0.5}>
    {bets.map((bet) => (
      <MobileBetCard key={bet.id}>
        <MobileBetHeader>
          <MobileBetMeta>
            <Typography variant="body2" fontWeight={700} lineHeight={1.3}>
              {formatIsoDateDots(bet.date)} · {bet.time}
            </Typography>
            <FormatBadge>{bet.format}</FormatBadge>
          </MobileBetMeta>
          <StatusBadge $status={bet.status}>{bet.status}</StatusBadge>
        </MobileBetHeader>

        <MobileBetMain>
          <MobileBetRow>
            <OrganizationLogo name={bet.eventOrganization} size={28} />
            <Box minWidth={0} flex={1}>
              <Typography variant="body2" fontWeight={600} lineHeight={1.3}>
                {bet.eventOrganization}
              </Typography>
              {bet.eventName ? (
                <Typography variant="caption" color="text.secondary" display="block" lineHeight={1.3}>
                  {bet.eventName}
                </Typography>
              ) : null}
              {bet.eventTier === "Major" && bet.majorStage ? (
                <Box mt={0.5}>
                  <MajorStageBadge stage={bet.majorStage} />
                </Box>
              ) : null}
            </Box>
          </MobileBetRow>

          <MobileBetTeams>
            <TeamLogo name={bet.organization1} size={24} showName nameWrap />
            <Typography variant="caption" color="text.secondary" sx={{ px: 0.5 }}>
              vs
            </Typography>
            <TeamLogo name={bet.organization2} size={24} showName nameWrap />
          </MobileBetTeams>

          <BetDescriptionCell bet={bet} />
        </MobileBetMain>

        <MobileBetFooter>
          <MobileBetValues>
            <MobileBetValue>
              <span>Сумма</span>
              <strong>{bet.amount.toLocaleString("ru-RU")} ₽</strong>
            </MobileBetValue>
            <MobileBetValue>
              <span>Кэф</span>
              <strong>{bet.odds.toFixed(2)}</strong>
            </MobileBetValue>
            <MobileBetValue>
              <span>Выплата</span>
              <PayoutValue $status={bet.status}>{formatPayout(bet)}</PayoutValue>
            </MobileBetValue>
          </MobileBetValues>
          <MobileBetActions>
            <ActionButtons
              bet={bet}
              onEdit={onEdit}
              onDelete={onDelete}
              onWin={onWin}
              onLose={onLose}
              onRevert={onRevert}
            />
          </MobileBetActions>
        </MobileBetFooter>
      </MobileBetCard>
    ))}
  </Box>
);

export default BetsHistoryMobileList;
