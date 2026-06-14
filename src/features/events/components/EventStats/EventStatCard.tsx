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
  <EventAccordion disableGutters $tier={item.size}>
    <AccordionSummary expandIcon={false}>
      <EventSummaryContent>
        <EventTournamentCardSummary
          logoSlug={item.logoSlug}
          eventOrganization={item.id}
          eventName={item.name}
          size={item.size}
          date={item.date}
          endDate={item.endDate}
          winnerOrganization={item.winnerTeamId}
          winnerLogoSlug={null}
          prizePool={item.prizePool}
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
