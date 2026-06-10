import { useState, type MouseEvent } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { AccordionDetails, AccordionSummary } from "@mui/material";
import type { Bet, BetTeamSide } from "@/entities/bet";
import type { EventRecord } from "@/entities/eventRecord";
import type { Match } from "@/entities/match";
import MajorStageBadge from "@/features/events/components/MajorStageBadge/MajorStageBadge";
import { resolveEventLogoSlug } from "@/features/events/lib/eventDisplay";
import MatchRelatedBets from "@/features/matches/components/MatchRelatedBets/MatchRelatedBets";
import { getMatchEffectiveStatus } from "@/features/matches/lib/getMatchEffectiveStatus";
import { hasMatchScore } from "@/features/matches/lib/matchScore";
import type { MatchSettlementResult } from "@/features/matches/lib/settleBetsForMatch";
import { formatIsoDateTimeDots } from "@/shared/lib/date/isoDate";
import ConfirmDialog from "@/shared/ui/ConfirmDialog/ConfirmDialog";
import EventLogo from "@/shared/ui/EventLogo/EventLogo";
import TeamLogo from "@/shared/ui/TeamLogo/TeamLogo";
import {
  ActionsBlock,
  CardGrid,
  CardIconButton,
  EventBlock,
  EventLogoWrap,
  EventName,
  EventOrg,
  EventText,
  FormatBadge,
  MetaFormatChip,
  LogoRing,
  MatchAccordion,
  MatchDetailsPanel,
  MatchSummaryContent,
  MatchupBlock,
  MetaBar,
  MetaChip,
  MetaDot,
  MetaRow,
  SettleBetsButton,
  SettleBetsRow,
  SettlementNote,
  StatusBadge,
  TeamName,
  TeamSlot,
  VsOrb,
} from "./MatchCard.styled";

const STATUS_LABELS: Record<Match["status"], string> = {
  scheduled: "Скоро",
  live: "Live",
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
  /** Меняется по таймеру, чтобы обновлять скоро → live → завершён */
  statusClock?: number;
  pendingSettlements?: number;
  onBet: (team: BetTeamSide) => void;
  onEdit: () => void;
  onDelete: () => void | Promise<void>;
  onSettleBets?: () => Promise<MatchSettlementResult>;
  onEditBet?: (bet: Bet) => void;
  events?: EventRecord[];
}

const MatchCard = ({
  match,
  relatedBets,
  profileNameById,
  activeProfileId,
  statusClock,
  pendingSettlements = 0,
  onBet,
  onEdit,
  onDelete,
  onSettleBets,
  onEditBet,
  events = [],
}: MatchCardProps) => {
  void statusClock;

  const eventLogoSlug = resolveEventLogoSlug(
    match.eventOrganization,
    match.eventName,
    events
  );

  const [expanded, setExpanded] = useState(false);
  const [settling, setSettling] = useState(false);
  const [settlementNote, setSettlementNote] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const status = getMatchEffectiveStatus(match);
  const showScore = hasMatchScore(match);
  const team1Leading = showScore && match.score1! > match.score2!;
  const team2Leading = showScore && match.score2! > match.score1!;
  const hasBets = relatedBets.length > 0;

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await onDelete();
      setDeleteOpen(false);
    } finally {
      setDeleting(false);
    }
  };

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
    <>
      <MatchAccordion
        disableGutters
        $status={status}
        expanded={hasBets && expanded}
        onChange={(_, nextExpanded) => {
          if (hasBets) setExpanded(nextExpanded);
        }}
      >
        <AccordionSummary expandIcon={false}>
          <MatchSummaryContent>
            <CardGrid>
              <EventBlock>
                <EventLogoWrap>
                  <EventLogo
                    logoSlug={eventLogoSlug}
                    label={match.eventName || match.eventOrganization}
                    size={32}
                  />
                </EventLogoWrap>
                <EventText>
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
                </EventText>
              </EventBlock>

              <MetaBar>
                <MetaChip>
                  <AccessTimeIcon />
                  {formatIsoDateTimeDots(match.date, match.time)}
                </MetaChip>
                <MetaFormatChip>{match.format}</MetaFormatChip>
                {match.majorStage ? (
                  <MajorStageBadge stage={match.majorStage} compact />
                ) : null}
                <StatusBadge $status={status} $inMetaBar>
                  {STATUS_LABELS[status]}
                </StatusBadge>
              </MetaBar>

              <ActionsBlock>
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
                    setDeleteOpen(true);
                  }}
                  aria-label="Удалить матч"
                >
                  <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                </CardIconButton>
                <StatusBadge $status={status}>{STATUS_LABELS[status]}</StatusBadge>
              </ActionsBlock>

              <MatchupBlock>
                <TeamSlot
                  type="button"
                  $leading={team1Leading}
                  title={`Ставка на ${match.organization1}`}
                  aria-label={`Ставка на ${match.organization1}`}
                  onClick={(event) => {
                    stopSummaryToggle(event);
                    onBet(1);
                  }}
                >
                  <LogoRing>
                    <TeamLogo name={match.organization1} size={32} />
                  </LogoRing>
                  <TeamName>{match.organization1}</TeamName>
                </TeamSlot>

                <VsOrb $hasScore={showScore}>
                  {showScore ? `${match.score1} : ${match.score2}` : "VS"}
                </VsOrb>

                <TeamSlot
                  type="button"
                  $leading={team2Leading}
                  title={`Ставка на ${match.organization2}`}
                  aria-label={`Ставка на ${match.organization2}`}
                  onClick={(event) => {
                    stopSummaryToggle(event);
                    onBet(2);
                  }}
                >
                  <LogoRing>
                    <TeamLogo name={match.organization2} size={32} />
                  </LogoRing>
                  <TeamName>{match.organization2}</TeamName>
                </TeamSlot>
              </MatchupBlock>
            </CardGrid>
          </MatchSummaryContent>
        </AccordionSummary>

        {hasBets ? (
          <AccordionDetails>
            <MatchDetailsPanel>
              <MatchRelatedBets
                bets={relatedBets}
                profileNameById={profileNameById}
                activeProfileId={activeProfileId}
                onEdit={onEditBet}
              />
              {onSettleBets && pendingSettlements > 0 ? (
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
            </MatchDetailsPanel>
          </AccordionDetails>
        ) : null}
      </MatchAccordion>

      <ConfirmDialog
        open={deleteOpen}
        title="Удалить матч?"
        message={`Матч ${match.organization1} vs ${match.organization2} будет удалён без возможности восстановления.`}
        confirming={deleting}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default MatchCard;
