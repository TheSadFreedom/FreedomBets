import { AccordionDetails, AccordionSummary } from "@mui/material";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";


import type { EventStats } from "@/entities/event";

import EventBetsTable from "@/features/bets/components/EventBetsTable/EventBetsTable";

import EventTournamentCardSummary from "@/features/events/components/EventStats/EventTournamentCardSummary";

import MajorStageBadge from "@/features/events/components/MajorStageBadge/MajorStageBadge";

import type { MajorEventGroup } from "@/features/events/lib/majorEventStats";

import { formatMoneySigned } from "@/shared/lib/format/money";

import {

  EventAccordion,

  EventDetailsPanel,

  EventEditButton,

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

  MajorStageEdit,

  StageMeta,

  StageMetaItem,

  StageMetaValue,

  StageWldBadges,

} from "./MajorEventStats.styled";



interface MajorEventGroupCardProps {

  group: MajorEventGroup;

  stages: EventStats[];

  onEditGroup: () => void;

  onDeleteGroup: () => void;

  onEditStage: (stage: EventStats) => void;

}



const StageSummary = ({ stage }: { stage: EventStats }) => {

  const hasSettled = stage.wins + stage.losses > 0;

  const profitPositive = stage.profit >= 0;



  return (

    <StageMeta>
      <StageMetaItem>{stage.totalBets} став.</StageMetaItem>

      {stage.wins + stage.losses + stage.pending > 0 ? (
        <StageWldBadges>
          <WldBadge $variant="win">{stage.wins}</WldBadge>
          <WldBadge $variant="loss">{stage.losses}</WldBadge>
          <WldBadge $variant="pending">{stage.pending}</WldBadge>
        </StageWldBadges>
      ) : null}

      {hasSettled ? (
        <StageMetaValue $color={profitPositive ? "#66bb6a" : "#ef5350"}>
          {formatMoneySigned(stage.profit)}
        </StageMetaValue>
      ) : null}
    </StageMeta>

  );

};



const MajorEventGroupCard = ({

  group,

  stages,

  onEditGroup,

  onDeleteGroup,

  onEditStage,

}: MajorEventGroupCardProps) => (

  <EventAccordion disableGutters>

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

              <MajorStageEdit>
                <EventEditButton
                  type="button"
                  aria-label="Редактировать стадию"
                  onClick={() => onEditStage(stage)}
                  style={{ opacity: 1, flexShrink: 0 }}
                >
                  <EditOutlinedIcon sx={{ fontSize: 15 }} />
                </EventEditButton>
              </MajorStageEdit>

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

