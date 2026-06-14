import { useMemo, useState, type MouseEvent } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import { AccordionDetails, AccordionSummary } from "@mui/material";
import type { Bet, BetTeamSide } from "@/entities/bet";
import type { EventRecord } from "@/entities/eventRecord";
import type { RankingBaseline } from "@/entities/ranking";
import type { Match } from "@/entities/match";
import { resolveEventLogoSlug } from "@/features/events/lib/eventDisplay";
import MatchRelatedBets from "@/features/matches/components/MatchRelatedBets/MatchRelatedBets";
import { getMatchEffectiveStatus } from "@/features/matches/lib/getMatchEffectiveStatus";
import { getMatchSeriesScore, hasAnyMapData } from "@/features/matches/lib/matchMaps";
import { hasMatchScore } from "@/features/matches/lib/matchScore";
import type { MatchSettlementResult } from "@/features/matches/lib/settleBetsForMatch";
import { getTeamRecentMatches } from "@/features/matches/lib/getTeamRecentMatches";
import { formatIsoDateDots } from "@/shared/lib/date/isoDate";
import ConfirmDialog from "@/shared/ui/ConfirmDialog/ConfirmDialog";
import EventLogo from "@/shared/ui/EventLogo/EventLogo";
import MatchCardMapsList from "./MatchCardMapsList";
import MatchCardTeamPanel from "./MatchCardTeamPanel";
import {
  formatMatchEventTitle,
  MATCH_STATUS_LABELS,
  matchScoreTone,
  stopAccordionToggle,
} from "./matchCardHelpers";
import { useTeamHoverPopover } from "./useTeamHoverPopover";
import {
  BetsCountPill,
  CardIconButton,
  EventLogoWrap,
  FormatPill,
  MatchAccordion,
  MatchBody,
  MatchDate,
  MatchDateCol,
  MatchDetailsPanel,
  MatchDivider,
  MatchEventRow,
  MatchEventTitle,
  MatchScoreCenter,
  MatchSummaryContent,
  MatchTeamsCol,
  MatchTime,
  MatchTopActions,
  MatchTopBar,
  ScoreLine,
  ScorePrimary,
  ScoreVsLabel,
  SettleBetsButton,
  SettleBetsRow,
  SettlementNote,
  StatusBadge,
} from "./MatchCard.styled";

function formatBetCount(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} ставка`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${count} ставки`;
  return `${count} ставок`;
}

interface MatchCardProps {
  match: Match;
  allMatches: Match[];
  relatedBets: Bet[];
  profileNameById: Map<number, string>;
  activeProfileId: number;
  pendingSettlements?: number;
  onBet: (team: BetTeamSide) => void;
  onEdit: () => void;
  onDelete: () => void | Promise<void>;
  onSettleBets?: () => Promise<MatchSettlementResult>;
  onEditBet?: (bet: Bet) => void;
  events?: EventRecord[];
  rankingBaseline?: RankingBaseline | null;
  readOnly?: boolean;
  externalUrl?: string;
}

const MatchCard = ({
  match,
  allMatches,
  relatedBets,
  profileNameById,
  activeProfileId,
  pendingSettlements = 0,
  onBet,
  onEdit,
  onDelete,
  onSettleBets,
  onEditBet,
  events = [],
  rankingBaseline = null,
  readOnly = false,
  externalUrl,
}: MatchCardProps) => {
  const team1Name = match.organization1 ?? "";
  const team2Name = match.organization2 ?? "";

  const eventLogoSlug = resolveEventLogoSlug(
    match.eventId,
    match.eventName ?? "",
    events,
  );
  const eventTitle = formatMatchEventTitle(match);

  const [expanded, setExpanded] = useState(false);
  const [settling, setSettling] = useState(false);
  const [settlementNote, setSettlementNote] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    hoveredTeam,
    team1AnchorEl,
    team2AnchorEl,
    team1AnchorRef,
    team2AnchorRef,
    showTeamHover,
    scheduleHideTeamHover,
  } = useTeamHoverPopover();

  const team1RecentMatches = useMemo(
    () => getTeamRecentMatches(allMatches, team1Name, match.id),
    [allMatches, match.id, team1Name],
  );
  const team2RecentMatches = useMemo(
    () => getTeamRecentMatches(allMatches, team2Name, match.id),
    [allMatches, match.id, team2Name],
  );

  const status = getMatchEffectiveStatus(match);
  const seriesScore = getMatchSeriesScore(match);
  const hasScores = hasMatchScore(match);
  const team1Leading = seriesScore != null ? seriesScore.score1 > seriesScore.score2 : false;
  const team2Leading = seriesScore != null ? seriesScore.score2 > seriesScore.score1 : false;
  const seriesLeader = team1Leading ? 1 : team2Leading ? 2 : null;
  const playedMaps = match.maps.filter(hasAnyMapData);
  const hasBets = relatedBets.length > 0;
  const canExpand = hasBets || playedMaps.length > 0;

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
          result.skipped > 0 ? ` · пропущено ${result.skipped} (пистолет)` : "";
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
        expanded={canExpand && expanded}
        onChange={(_, nextExpanded) => {
          if (canExpand) setExpanded(nextExpanded);
        }}
      >
        <AccordionSummary expandIcon={false}>
          <MatchSummaryContent>
            <MatchTopBar>
              <MatchEventRow>
                <EventLogoWrap>
                  <EventLogo
                    logoSlug={eventLogoSlug}
                    label={match.eventName ?? ""}
                    size={28}
                  />
                </EventLogoWrap>
                <MatchEventTitle title={eventTitle}>{eventTitle}</MatchEventTitle>
              </MatchEventRow>

              <MatchTopActions>
                {hasBets ? <BetsCountPill>{formatBetCount(relatedBets.length)}</BetsCountPill> : null}
                <StatusBadge $status={status}>{MATCH_STATUS_LABELS[status]}</StatusBadge>
                {readOnly ? (
                  externalUrl ? (
                    <CardIconButton
                      as="a"
                      href={externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={stopAccordionToggle}
                      aria-label="Открыть на Sports.ru"
                    >
                      <OpenInNewOutlinedIcon sx={{ fontSize: 16 }} />
                    </CardIconButton>
                  ) : null
                ) : (
                  <>
                    <CardIconButton
                      type="button"
                      onClick={(event) => {
                        stopAccordionToggle(event);
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
                        stopAccordionToggle(event);
                        setDeleteOpen(true);
                      }}
                      aria-label="Удалить матч"
                    >
                      <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                    </CardIconButton>
                  </>
                )}
              </MatchTopActions>
            </MatchTopBar>

            <MatchDivider />

            <MatchBody>
              <MatchDateCol>
                <MatchDate>{formatIsoDateDots(match.date)}</MatchDate>
                <MatchTime>{match.time}</MatchTime>
                <FormatPill>{match.format}</FormatPill>
              </MatchDateCol>

              <MatchTeamsCol>
                <MatchCardTeamPanel
                  team={1}
                  teamName={team1Name}
                  leading={team1Leading}
                  readOnly={readOnly}
                  placement="bottom-end"
                  align="end"
                  anchorRef={team1AnchorRef}
                  anchorEl={team1AnchorEl}
                  hovered={hoveredTeam === 1}
                  recentMatches={team1RecentMatches}
                  rankingBaseline={rankingBaseline}
                  onShowHover={() => showTeamHover(1)}
                  onScheduleHideHover={scheduleHideTeamHover}
                  onBet={onBet}
                />

                <MatchScoreCenter>
                  {hasScores && seriesScore ? (
                    <ScoreLine>
                      <ScorePrimary $tone={matchScoreTone(1, seriesLeader, hasScores)}>
                        {seriesScore.score1}
                      </ScorePrimary>
                      <ScoreVsLabel>vs</ScoreVsLabel>
                      <ScorePrimary $tone={matchScoreTone(2, seriesLeader, hasScores)}>
                        {seriesScore.score2}
                      </ScorePrimary>
                    </ScoreLine>
                  ) : (
                    <ScoreVsLabel>vs</ScoreVsLabel>
                  )}
                </MatchScoreCenter>

                <MatchCardTeamPanel
                  team={2}
                  teamName={team2Name}
                  leading={team2Leading}
                  readOnly={readOnly}
                  placement="bottom-start"
                  align="start"
                  anchorRef={team2AnchorRef}
                  anchorEl={team2AnchorEl}
                  hovered={hoveredTeam === 2}
                  recentMatches={team2RecentMatches}
                  rankingBaseline={rankingBaseline}
                  onShowHover={() => showTeamHover(2)}
                  onScheduleHideHover={scheduleHideTeamHover}
                  onBet={onBet}
                />
              </MatchTeamsCol>
            </MatchBody>
          </MatchSummaryContent>
        </AccordionSummary>

        {canExpand ? (
          <AccordionDetails>
            <MatchDetailsPanel>
              <MatchCardMapsList match={match} />
              {hasBets ? (
                <MatchRelatedBets
                  bets={relatedBets}
                  profileNameById={profileNameById}
                  activeProfileId={activeProfileId}
                  onEdit={onEditBet}
                />
              ) : null}
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

      {!readOnly ? (
        <ConfirmDialog
          open={deleteOpen}
          title="Удалить матч?"
          message={`Матч ${team1Name} vs ${team2Name} будет удалён без возможности восстановления.`}
          confirming={deleting}
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleDeleteConfirm}
        />
      ) : null}
    </>
  );
};

export default MatchCard;
