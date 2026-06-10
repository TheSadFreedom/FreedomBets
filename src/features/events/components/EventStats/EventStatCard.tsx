import { AccordionDetails, AccordionSummary, Box } from "@mui/material";
import type { EventStats } from "@/entities/event";
import EventBetsTable from "@/features/bets/components/EventBetsTable/EventBetsTable";
import EventTournamentCardSummary from "@/features/events/components/EventStats/EventTournamentCardSummary";
import {
  EventAccordion,
  EventDetailsPanel,
  EventSummaryContent,
} from "./EventStats.styled";

interface EventStatCardProps {
  item: EventStats;
  onEdit: () => void;
  onDelete: () => void;
}

const EventStatCard = ({ item, onEdit, onDelete }: EventStatCardProps) => (
  <EventAccordion disableGutters>
    <AccordionSummary expandIcon={false}>
      <EventSummaryContent>
        <EventTournamentCardSummary
          logoSlug={item.logoSlug}
          eventOrganization={item.eventOrganization}
          eventName={item.eventName}
          eventTier={item.eventTier}
          date={item.date}
          endDate={item.endDate}
          majorStage={item.majorStage}
          winnerOrganization={item.majorStage ? null : item.winnerOrganization}
          winnerLogoSlug={item.majorStage ? null : item.winnerLogoSlug}
          metrics={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </EventSummaryContent>
    </AccordionSummary>

    <AccordionDetails>
      <EventDetailsPanel>
        {item.totalBets > 0 ? (
          <EventBetsTable bets={item.bets} />
        ) : (
          <Box component="p" sx={{ m: 0, py: 1, fontSize: 13, color: "rgba(255,255,255,0.38)" }}>
            Нет ставок
          </Box>
        )}
      </EventDetailsPanel>
    </AccordionDetails>
  </EventAccordion>
);

export default EventStatCard;
