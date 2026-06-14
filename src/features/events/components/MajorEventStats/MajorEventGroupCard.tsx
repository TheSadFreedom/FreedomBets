import { AccordionDetails, AccordionSummary } from "@mui/material";

import type { EventStats } from "@/entities/event";

import EventBetsTable from "@/features/bets/components/EventBetsTable/EventBetsTable";

import EventTournamentCardSummary from "@/features/events/components/EventStats/EventTournamentCardSummary";

import MajorStageBadge from "@/features/events/components/MajorStageBadge/MajorStageBadge";

import type { MajorEventGroup } from "@/features/events/lib/majorEventStats";

import { formatMoneySigned } from "@/shared/lib/format/money";

import {

  EventAccordion,

  EventDetailsPanel,

  EventSummaryContent,

  WldBadge,

} from "@/features/events/components/EventStats/EventStats.styled";

import {

  MajorStageBlock,

  MajorStageHeader,

  MajorStageLabel,

  MajorStageTitle,

  StageBetsWrap,

  StageEmptyNote,

  StageMeta,

  StageMetaPanel,

  StageMetaItem,

  StageMetaValue,

  StageWldBadges,

} from "./MajorEventStats.styled";



interface MajorEventGroupCardProps {

  group: MajorEventGroup;

  stages: EventStats[];

  onEditGroup: () => void;

  onDeleteGroup: () => void;

}



const StageSummary = ({ stage }: { stage: EventStats }) => {

  const hasSettled = stage.wins + stage.losses > 0;

  const profitPositive = stage.profit >= 0;



  return (
    <StageMeta>
      <StageMetaPanel>
        <StageMetaItem>{stage.totalBets} став.</StageMetaItem>
      </StageMetaPanel>

      {stage.wins + stage.losses + stage.pending > 0 ? (
        <StageMetaPanel>
          <StageWldBadges>
            <WldBadge $variant="win">{stage.wins}</WldBadge>
            <WldBadge $variant="loss">{stage.losses}</WldBadge>
            <WldBadge $variant="pending">{stage.pending}</WldBadge>
          </StageWldBadges>
        </StageMetaPanel>
      ) : null}

      {hasSettled ? (
        <StageMetaPanel $leading={profitPositive}>
          <StageMetaValue $color={profitPositive ? "#66bb6a" : "#ef5350"}>
            {formatMoneySigned(stage.profit)}
          </StageMetaValue>
        </StageMetaPanel>
      ) : null}
    </StageMeta>
  );

};



const MajorEventGroupCard = ({

  group,

  stages,

  onEditGroup,

  onDeleteGroup,

}: MajorEventGroupCardProps) => (

  <EventAccordion disableGutters $tier={group.eventTier}>

    <AccordionSummary expandIcon={false}>

      <EventSummaryContent>

        <EventTournamentCardSummary

          logoSlug={group.logoSlug}

          eventOrganization={group.eventOrganization}

          eventName={group.eventName}

          eventTier={group.eventTier}

          date={group.date}

          endDate={group.endDate}
          winnerOrganization={group.winnerOrganization}
          winnerLogoSlug={group.winnerLogoSlug}
          prizePool={group.prizePool}
          metrics={group}
          onEdit={onEditGroup}
          onDelete={onDeleteGroup}

        />

      </EventSummaryContent>

    </AccordionSummary>



    <AccordionDetails>

      <EventDetailsPanel>

        {stages.map((stage) => (

          <MajorStageBlock key={stage.majorStage ?? "unknown"}>

            <MajorStageHeader>
              <MajorStageLabel>
                {stage.majorStage ? (
                  <MajorStageBadge stage={stage.majorStage} />
                ) : (
                  <MajorStageTitle>Без стадии</MajorStageTitle>
                )}
              </MajorStageLabel>

              <StageSummary stage={stage} />

            </MajorStageHeader>

            <StageBetsWrap>

              {stage.totalBets > 0 ? (

                <EventBetsTable bets={stage.bets} />

              ) : (

                <StageEmptyNote>Нет ставок</StageEmptyNote>

              )}

            </StageBetsWrap>

          </MajorStageBlock>

        ))}

      </EventDetailsPanel>

    </AccordionDetails>

  </EventAccordion>

);



export default MajorEventGroupCard;

