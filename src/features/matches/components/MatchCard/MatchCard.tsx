import { useState, type MouseEvent } from "react";
import type { MatchSettlementResult } from "@/features/matches/lib/settleBetsForMatch";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { Bet, BetTeamSide } from "@/entities/bet";
import type { Match } from "@/entities/match";
import { getMatchEffectiveStatus } from "@/features/matches/lib/getMatchEffectiveStatus";
import { hasMatchScore } from "@/features/matches/lib/matchScore";
import { formatIsoDateTimeDots } from "@/shared/lib/date/isoDate";
import MajorStageBadge from "@/features/events/components/MajorStageBadge/MajorStageBadge";
import MatchRelatedBets from "@/features/matches/components/MatchRelatedBets/MatchRelatedBets";
import OrganizationLogo from "@/shared/ui/OrganizationLogo/OrganizationLogo";
import TeamLogo from "@/shared/ui/TeamLogo/TeamLogo";
import {
  BetActionsRow,
  SettlementNote,
  SettleBetsButton,
  SettleBetsRow,
  CardHeader,
  CardHeaderText,
  CardInner,
  CardRoot,
  CardIconButton,
  CardSummary,
  EventLogoWrap,
  EventName,
  EventOrg,
  ExpandChevron,
  ExpandRow,
  ExpandedBody,
  FormatBadge,
  HeaderActions,
  LogoRing,
  MatchupArena,
  MetaChip,
  MetaDot,
  MetaRow,
  StatusBadge,
  TeamBetButton,
  TeamName,
  TeamSlot,
  VsOrb,
} from "./MatchCard.styled";

const STATUS_LABELS: Record<Match["status"], string> = {
  scheduled: "Скоро",
  finished: "Завершён",
};

const stopSummaryToggle = (event: MouseEvent) => {
  event.preventDefault();
  event.stopPropagation();
};

interface MatchCardProps {
  match: Match;
  relatedBets: Bet[];
  profileNameById: Map<number, string>;
  activeProfileId: number;
  /** Меняется по таймеру, чтобы обновлять скоро → завершён */
  statusClock?: number;
  isAdmin?: boolean;
  pendingSettlements?: number;
  onBet: (team: BetTeamSide) => void;
  onEdit: () => void;
  onDelete: () => void;
  onSettleBets?: () => Promise<MatchSettlementResult>;
  onEditBet?: (bet: Bet) => void;
}

const MatchCard = ({
  match,
  relatedBets,
  profileNameById,
  activeProfileId,
  statusClock,
  isAdmin = false,
  pendingSettlements = 0,
  onBet,
  onEdit,
  onDelete,
  onSettleBets,
  onEditBet,
}: MatchCardProps) => {
  void statusClock;
  const [settling, setSettling] = useState(false);
  const [settlementNote, setSettlementNote] = useState<string | null>(null);
  const status = getMatchEffectiveStatus(match);
  const showScore = hasMatchScore(match);
  const team1Leading = showScore && match.score1! > match.score2!;
  const team2Leading = showScore && match.score2! > match.score1!;
  const hasWait = relatedBets.some((bet) => bet.status === "WAIT");
  const [open, setOpen] = useState(hasWait);

  const expandLabel =
    relatedBets.length > 0
      ? `Ставки · ${relatedBets.length}${hasWait ? " · в игре" : ""}${pendingSettlements > 0 ? ` · ${pendingSettlements} к расчёту` : ""}`
      : "Добавить ставку";

  const handleSettleBets = async (event: MouseEvent) => {
    event.stopPropagation();
    if (!onSettleBets || settling) return;
    setSettling(true);
    setSettlementNote(null);
    try {
      const result = await onSettleBets();
      if (result.settled === 0) {
        setSettlementNote("Нет ставок на матч для авто-расчёта (нужен счёт и WAIT).");
      } else {
        const skippedPart =
          result.skipped > 0 ? ` · пропущено ${result.skipped} (карта/пистолет)` : "";
        setSettlementNote(`Рассчитано ${result.settled} ставок${skippedPart}`);
      }
    } finally {
      setSettling(false);
    }
  };

  return (
    <CardRoot
      $status={status}
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <CardSummary>
        <CardInner>
          <CardHeader>
            <EventLogoWrap>
              <OrganizationLogo name={match.eventOrganization || match.eventName} size={24} />
            </EventLogoWrap>

            <CardHeaderText>
              {match.eventOrganization ? <EventOrg>{match.eventOrganization}</EventOrg> : null}
              <EventName>{match.eventName || match.eventOrganization}</EventName>
              <MetaRow>
                <MetaChip>
                  <AccessTimeIcon />
                  {formatIsoDateTimeDots(match.date, match.time)}
                </MetaChip>
                <MetaDot>·</MetaDot>
                <FormatBadge>{match.format}</FormatBadge>
                {match.majorStage ? (
                  <>
                    <MetaDot>·</MetaDot>
                    <MajorStageBadge stage={match.majorStage} />
                  </>
                ) : null}
              </MetaRow>
            </CardHeaderText>

            <HeaderActions>
              <StatusBadge $status={status}>{STATUS_LABELS[status]}</StatusBadge>
              {isAdmin ? (
                <>
                  <CardIconButton
                    type="button"
                    onClick={(event) => {
                      stopSummaryToggle(event);
                      onEdit();
                    }}
                    aria-label="Редактировать матч"
                  >
                    <EditOutlinedIcon sx={{ fontSize: 16 }} />
                  </CardIconButton>
                  <CardIconButton
                    type="button"
                    $danger
                    onClick={(event) => {
                      stopSummaryToggle(event);
                      void onDelete();
                    }}
                    aria-label="Удалить матч"
                  >
                    <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                  </CardIconButton>
                </>
              ) : null}
            </HeaderActions>
          </CardHeader>

          <MatchupArena>
            <TeamSlot $leading={team1Leading}>
              <LogoRing>
                <TeamLogo name={match.organization1} size={28} />
              </LogoRing>
              <TeamName>{match.organization1}</TeamName>
            </TeamSlot>

            <VsOrb $hasScore={showScore}>
              {showScore ? `${match.score1} : ${match.score2}` : "VS"}
            </VsOrb>

            <TeamSlot $leading={team2Leading}>
              <LogoRing>
                <TeamLogo name={match.organization2} size={28} />
              </LogoRing>
              <TeamName>{match.organization2}</TeamName>
            </TeamSlot>
          </MatchupArena>
        </CardInner>

        <ExpandRow>
          <span>{expandLabel}</span>
          <ExpandChevron aria-hidden>
            <ExpandMoreIcon />
          </ExpandChevron>
        </ExpandRow>
      </CardSummary>

      <ExpandedBody>
        <MatchRelatedBets
          bets={relatedBets}
          profileNameById={profileNameById}
          activeProfileId={activeProfileId}
          onEdit={onEditBet}
        />
        {isAdmin && onSettleBets && pendingSettlements > 0 ? (
          <SettleBetsRow>
            <SettleBetsButton
              type="button"
              disabled={settling}
              onClick={(event) => void handleSettleBets(event)}
            >
              {settling
                ? "Расчёт…"
                : `Рассчитать ставки на матч (${pendingSettlements})`}
            </SettleBetsButton>
            {settlementNote ? <SettlementNote>{settlementNote}</SettlementNote> : null}
          </SettleBetsRow>
        ) : null}
        <BetActionsRow>
          <TeamBetButton
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onBet(1);
            }}
            title={`Ставка на ${match.organization1}`}
          >
            <TeamLogo name={match.organization1} size={20} />
            {match.organization1}
          </TeamBetButton>
          <TeamBetButton
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onBet(2);
            }}
            title={`Ставка на ${match.organization2}`}
          >
            <TeamLogo name={match.organization2} size={20} />
            {match.organization2}
          </TeamBetButton>
        </BetActionsRow>
      </ExpandedBody>
    </CardRoot>
  );
};

export default MatchCard;
