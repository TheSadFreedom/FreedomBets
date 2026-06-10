import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import type { EventStats, EventTier } from "@/entities/event";
import EventStatsMetrics from "@/features/events/components/EventStats/EventStatsMetrics";
import MajorStageBadge from "@/features/events/components/MajorStageBadge/MajorStageBadge";
import { formatIsoDateRange } from "@/shared/lib/date/isoDate";
import EventLogo from "@/shared/ui/EventLogo/EventLogo";
import TeamLogo from "@/shared/ui/TeamLogo/TeamLogo";
import {
  EventCardActions,
  EventCardHead,
  EventCardIdentity,
  EventCardLayout,
  EventCardName,
  EventCardOrg,
  EventCardStats,
  EventCardTags,
  EventDateChip,
  EventEditButton,
  EventLogoWrap,
  EventTierBadge,
  EventWinnerChip,
} from "./EventStats.styled";

type EventTournamentCardSummaryProps = {
  logoSlug: string | null;
  eventOrganization: string;
  eventName: string;
  eventTier: EventTier;
  date: string;
  endDate: string;
  majorStage?: string | null;
  winnerOrganization?: string | null;
  winnerLogoSlug?: string | null;
  metrics: Pick<EventStats, "wins" | "losses" | "pending" | "winRate" | "profit">;
  onEdit: () => void;
  onDelete: () => void;
};

const EventTournamentCardSummary = ({
  logoSlug,
  eventOrganization,
  eventName,
  eventTier,
  date,
  endDate,
  majorStage,
  winnerOrganization,
  winnerLogoSlug,
  metrics,
  onEdit,
  onDelete,
}: EventTournamentCardSummaryProps) => {
  const displayName = eventName || eventOrganization;

  return (
    <EventCardLayout>
      <EventCardHead>
        <EventLogoWrap>
          <EventLogo logoSlug={logoSlug} label={displayName} size={32} />
        </EventLogoWrap>
        <EventCardIdentity>
          {eventName ? <EventCardOrg>{eventOrganization}</EventCardOrg> : null}
          <EventCardName title={displayName}>{displayName}</EventCardName>
        </EventCardIdentity>
        <EventCardActions>
          <EventEditButton
            type="button"
            aria-label="Редактировать турнир"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <EditOutlinedIcon sx={{ fontSize: 16 }} />
          </EventEditButton>
          <EventEditButton
            type="button"
            $danger
            aria-label="Удалить турнир"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <DeleteOutlineIcon sx={{ fontSize: 16 }} />
          </EventEditButton>
        </EventCardActions>
      </EventCardHead>

      <EventCardTags>
        <EventTierBadge $tier={eventTier}>{eventTier}</EventTierBadge>
        {majorStage ? <MajorStageBadge stage={majorStage} compact /> : null}
        {winnerOrganization ? (
          <EventWinnerChip title={`Победитель: ${winnerOrganization}`}>
            <TeamLogo name={winnerOrganization} logoSlug={winnerLogoSlug} size={16} />
            <span>{winnerOrganization}</span>
          </EventWinnerChip>
        ) : null}
        <EventDateChip>
          <AccessTimeIcon />
          {formatIsoDateRange(date, endDate)}
        </EventDateChip>
      </EventCardTags>

      <EventCardStats>
        <EventStatsMetrics item={metrics} />
      </EventCardStats>
    </EventCardLayout>
  );
};

export default EventTournamentCardSummary;
