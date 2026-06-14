import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import type { EventStats, EventTier } from "@/entities/event";
import EventStatsMetrics from "@/features/events/components/EventStats/EventStatsMetrics";
import { formatIsoDateRange } from "@/shared/lib/date/isoDate";
import { formatUsdPrizePool } from "@/shared/lib/format/prizePool";
import { formatMoneySigned } from "@/shared/lib/format/money";
import EventLogo from "@/shared/ui/EventLogo/EventLogo";
import {
  CardIconButton,
  EventBody,
  EventDate,
  EventDivider,
  EventEventRow,
  EventLogoWrap,
  EventMetaCol,
  EventMetricsCol,
  EventOrg,
  EventTitle,
  EventTitleGroup,
  EventTopActions,
  EventTopBar,
  PrizeBadge,
  ProfitBadge,
  StagePill,
  TierBadge,
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
  prizePool?: number | null;
  metrics: Pick<EventStats, "wins" | "losses" | "pending" | "winRate" | "profit" | "totalBets">;
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
  prizePool,
  metrics,
  onEdit,
  onDelete,
}: EventTournamentCardSummaryProps) => {
  const displayName = eventName || eventOrganization;
  const hasSettled = metrics.wins + metrics.losses > 0;
  const profitPositive = metrics.profit >= 0;

  return (
    <>
      <EventTopBar>
        <EventEventRow>
          <EventLogoWrap>
            <EventLogo logoSlug={logoSlug} label={displayName} size={28} />
          </EventLogoWrap>
          <EventTitleGroup>
            {eventName ? <EventOrg>{eventOrganization}</EventOrg> : null}
            <EventTitle title={displayName}>{displayName}</EventTitle>
          </EventTitleGroup>
          {majorStage ? <StagePill>{majorStage}</StagePill> : null}
        </EventEventRow>

        <EventTopActions>
          <TierBadge $tier={eventTier}>{eventTier}</TierBadge>
          {prizePool != null && prizePool > 0 ? (
            <PrizeBadge>
              <EmojiEventsOutlinedIcon />
              {formatUsdPrizePool(prizePool)}
            </PrizeBadge>
          ) : null}
          {hasSettled ? (
            <ProfitBadge $positive={profitPositive}>
              {formatMoneySigned(metrics.profit)}
            </ProfitBadge>
          ) : (
            <ProfitBadge $positive={false} $muted>
              —
            </ProfitBadge>
          )}
          <CardIconButton
            type="button"
            aria-label="Редактировать турнир"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <EditOutlinedIcon sx={{ fontSize: 16 }} />
          </CardIconButton>
          <CardIconButton
            type="button"
            $danger
            aria-label="Удалить турнир"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <DeleteOutlineIcon sx={{ fontSize: 16 }} />
          </CardIconButton>
        </EventTopActions>
      </EventTopBar>

      <EventDivider />

      <EventBody>
        <EventMetaCol>
          <EventDate>{formatIsoDateRange(date, endDate)}</EventDate>
        </EventMetaCol>

        <EventMetricsCol>
          <EventStatsMetrics
            item={metrics}
            winnerOrganization={winnerOrganization}
            winnerLogoSlug={winnerLogoSlug}
          />
        </EventMetricsCol>
      </EventBody>
    </>
  );
};

export default EventTournamentCardSummary;
