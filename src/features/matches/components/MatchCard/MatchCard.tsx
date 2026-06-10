import { useMemo, useRef, useState, type MouseEvent } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import { AccordionDetails, AccordionSummary, Fade, Popper } from "@mui/material";
import type { Bet, BetTeamSide } from "@/entities/bet";
import type { EventRecord } from "@/entities/eventRecord";
import type { Match } from "@/entities/match";
import { resolveEventLogoSlug } from "@/features/events/lib/eventDisplay";
import MatchRelatedBets from "@/features/matches/components/MatchRelatedBets/MatchRelatedBets";
import { getMatchEffectiveStatus } from "@/features/matches/lib/getMatchEffectiveStatus";
import {
  getMapWinner,
  getMatchSeriesScore,
  hasAnyMapData,
  hasMapRoundScore,
} from "@/features/matches/lib/matchMaps";
import { hasMatchScore } from "@/features/matches/lib/matchScore";
import type { MatchSettlementResult } from "@/features/matches/lib/settleBetsForMatch";
import { getTeamRecentMatches } from "@/features/matches/lib/getTeamRecentMatches";
import TeamRecentFormPopover from "@/features/matches/components/TeamRecentFormPopover/TeamRecentFormPopover";
import { formatIsoDateDots } from "@/shared/lib/date/isoDate";
import ConfirmDialog from "@/shared/ui/ConfirmDialog/ConfirmDialog";
import EventLogo from "@/shared/ui/EventLogo/EventLogo";
import TeamLogo from "@/shared/ui/TeamLogo/TeamLogo";
import {
  CardIconButton,
  EventLogoWrap,
  FormatPill,
  LogoRing,
  MapItem,
  MapName,
  MapsSection,
  MapScore,
  MapScoreGroup,
  MapScoreSep,
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
  StagePill,
  StatusBadge,
  TeamName,
  TeamPanel,
  TeamPanelWrap,
} from "./MatchCard.styled";

const STATUS_LABELS: Record<Match["status"], string> = {
  scheduled: "скоро",
  live: "live",
  finished: "завершён",
};

const stopSummaryToggle = (event: MouseEvent) => {
  event.preventDefault();
  event.stopPropagation();
};

function formatEventTitle(match: Match): string {
  const org = match.eventOrganization.trim();
  const name = match.eventName.trim();
  if (org && name) return `${org} ${name}`;
  return org || name;
}

function scoreTone(
  side: 1 | 2,
  leadingSide: 1 | 2 | null,
  hasScores: boolean
): "win" | "lose" | "neutral" {
  if (!hasScores || leadingSide == null) return "neutral";
  return side === leadingSide ? "win" : "lose";
}

interface MatchCardProps {
  match: Match;
  allMatches: Match[];
  relatedBets: Bet[];
  profileNameById: Map<number, string>;
  activeProfileId: number;
  statusClock?: number;
  pendingSettlements?: number;
  onBet: (team: BetTeamSide) => void;
  onEdit: () => void;
  onDelete: () => void | Promise<void>;
  onSettleBets?: () => Promise<MatchSettlementResult>;
  onEditBet?: (bet: Bet) => void;
  events?: EventRecord[];
  readOnly?: boolean;
  externalUrl?: string;
}

const HOVER_HIDE_DELAY_MS = 140;

const MatchCard = ({
  match,
  allMatches,
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
  readOnly = false,
  externalUrl,
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
  const [hoveredTeam, setHoveredTeam] = useState<1 | 2 | null>(null);
  const hideHoverTimerRef = useRef<number | null>(null);
  const team1AnchorRef = useRef<HTMLDivElement>(null);
  const team2AnchorRef = useRef<HTMLDivElement>(null);

  const team1RecentMatches = useMemo(
    () => getTeamRecentMatches(allMatches, match.organization1, match.id),
    [allMatches, match.id, match.organization1],
  );
  const team2RecentMatches = useMemo(
    () => getTeamRecentMatches(allMatches, match.organization2, match.id),
    [allMatches, match.id, match.organization2],
  );

  const showTeamHover = (team: 1 | 2) => {
    if (hideHoverTimerRef.current != null) {
      window.clearTimeout(hideHoverTimerRef.current);
      hideHoverTimerRef.current = null;
    }
    setHoveredTeam(team);
  };

  const scheduleHideTeamHover = () => {
    hideHoverTimerRef.current = window.setTimeout(() => {
      setHoveredTeam(null);
      hideHoverTimerRef.current = null;
    }, HOVER_HIDE_DELAY_MS);
  };

  const status = getMatchEffectiveStatus(match);
  const seriesScore = getMatchSeriesScore(match);
  const hasScores = hasMatchScore(match);
  const team1Leading =
    seriesScore != null ? seriesScore.score1 > seriesScore.score2 : false;
  const team2Leading =
    seriesScore != null ? seriesScore.score2 > seriesScore.score1 : false;
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
                    label={match.eventName || match.eventOrganization}
                    size={28}
                  />
                </EventLogoWrap>
                <MatchEventTitle title={formatEventTitle(match)}>
                  {formatEventTitle(match)}
                </MatchEventTitle>
                {match.majorStage ? <StagePill>{match.majorStage}</StagePill> : null}
              </MatchEventRow>

              <MatchTopActions>
                <StatusBadge $status={status}>{STATUS_LABELS[status]}</StatusBadge>
                {readOnly ? (
                  externalUrl ? (
                    <CardIconButton
                      as="a"
                      href={externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={stopSummaryToggle}
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
                <TeamPanelWrap
                  ref={team1AnchorRef}
                  onMouseEnter={() => showTeamHover(1)}
                  onMouseLeave={scheduleHideTeamHover}
                >
                  <TeamPanel
                    as={readOnly ? "div" : "button"}
                    type={readOnly ? undefined : "button"}
                    $align="end"
                    $leading={team1Leading}
                    $readOnly={readOnly}
                    title={readOnly ? match.organization1 : `Ставка на ${match.organization1}`}
                    aria-label={readOnly ? match.organization1 : `Ставка на ${match.organization1}`}
                    onClick={
                      readOnly
                        ? undefined
                        : (event: MouseEvent) => {
                            stopSummaryToggle(event);
                            onBet(1);
                          }
                    }
                  >
                    <TeamName>{match.organization1}</TeamName>
                    <LogoRing>
                      <TeamLogo name={match.organization1} size={36} />
                    </LogoRing>
                  </TeamPanel>
                </TeamPanelWrap>

                <MatchScoreCenter>
                  {hasScores && seriesScore ? (
                    <ScoreLine>
                      <ScorePrimary $tone={scoreTone(1, seriesLeader, hasScores)}>
                        {seriesScore.score1}
                      </ScorePrimary>
                      <ScoreVsLabel>vs</ScoreVsLabel>
                      <ScorePrimary $tone={scoreTone(2, seriesLeader, hasScores)}>
                        {seriesScore.score2}
                      </ScorePrimary>
                    </ScoreLine>
                  ) : (
                    <ScoreVsLabel>vs</ScoreVsLabel>
                  )}
                </MatchScoreCenter>

                <TeamPanelWrap
                  ref={team2AnchorRef}
                  onMouseEnter={() => showTeamHover(2)}
                  onMouseLeave={scheduleHideTeamHover}
                >
                  <TeamPanel
                    as={readOnly ? "div" : "button"}
                    type={readOnly ? undefined : "button"}
                    $align="start"
                    $leading={team2Leading}
                    $readOnly={readOnly}
                    title={readOnly ? match.organization2 : `Ставка на ${match.organization2}`}
                    aria-label={readOnly ? match.organization2 : `Ставка на ${match.organization2}`}
                    onClick={
                      readOnly
                        ? undefined
                        : (event: MouseEvent) => {
                            stopSummaryToggle(event);
                            onBet(2);
                          }
                    }
                  >
                    <LogoRing>
                      <TeamLogo name={match.organization2} size={36} />
                    </LogoRing>
                    <TeamName>{match.organization2}</TeamName>
                  </TeamPanel>
                </TeamPanelWrap>
              </MatchTeamsCol>

              <Popper
                open={hoveredTeam === 1}
                anchorEl={team1AnchorRef.current}
                placement="bottom-end"
                transition
                modifiers={[{ name: "offset", options: { offset: [0, 6] } }]}
                sx={{ zIndex: 1400 }}
              >
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={160}>
                    <div onMouseEnter={() => showTeamHover(1)} onMouseLeave={scheduleHideTeamHover}>
                      <TeamRecentFormPopover
                        teamName={match.organization1}
                        items={team1RecentMatches}
                      />
                    </div>
                  </Fade>
                )}
              </Popper>
              <Popper
                open={hoveredTeam === 2}
                anchorEl={team2AnchorRef.current}
                placement="bottom-start"
                transition
                modifiers={[{ name: "offset", options: { offset: [0, 6] } }]}
                sx={{ zIndex: 1400 }}
              >
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={160}>
                    <div onMouseEnter={() => showTeamHover(2)} onMouseLeave={scheduleHideTeamHover}>
                      <TeamRecentFormPopover
                        teamName={match.organization2}
                        items={team2RecentMatches}
                      />
                    </div>
                  </Fade>
                )}
              </Popper>
            </MatchBody>
          </MatchSummaryContent>
        </AccordionSummary>

        {canExpand ? (
          <AccordionDetails>
            <MatchDetailsPanel>
              {playedMaps.length > 0 ? (
                <MapsSection>
                  {match.maps.map((map, index) => {
                    if (!hasAnyMapData(map)) return null;
                    const winner = getMapWinner(map);
                    const team1LeadingMap = hasMapRoundScore(map) && winner === 1;
                    const team2LeadingMap = hasMapRoundScore(map) && winner === 2;
                    return (
                      <MapItem key={`${match.id}-map-${index}`}>
                        <MapName title={map.name || undefined}>
                          {map.name.trim() || `Карта ${index + 1}`}
                        </MapName>
                        <MapScoreGroup>
                          <MapScore $leading={team1LeadingMap}>
                            {map.score1 ?? "—"}
                          </MapScore>
                          <MapScoreSep>:</MapScoreSep>
                          <MapScore $leading={team2LeadingMap}>
                            {map.score2 ?? "—"}
                          </MapScore>
                        </MapScoreGroup>
                      </MapItem>
                    );
                  })}
                </MapsSection>
              ) : null}
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
          message={`Матч ${match.organization1} vs ${match.organization2} будет удалён без возможности восстановления.`}
          confirming={deleting}
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleDeleteConfirm}
        />
      ) : null}
    </>
  );
};

export default MatchCard;
