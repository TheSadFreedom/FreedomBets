import { AccordionDetails, AccordionSummary, Box, Chip } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { EventStats } from "@/entities/event";
import { formatIsoDateRange } from "@/shared/lib/date/isoDate";
import OrganizationLogo from "@/shared/ui/OrganizationLogo/OrganizationLogo";
import EventBetsTable from "@/features/bets/components/EventBetsTable/EventBetsTable";
import EventStatsMetrics from "@/features/events/components/EventStats/EventStatsMetrics";
import MajorStageBadge from "@/features/events/components/MajorStageBadge/MajorStageBadge";
import {
  EventAccordion,
  EventCardHeader,
  EventCardTop,
  EventDateTime,
  EventDetailsPanel,
  EventEditButton,
  EventExpandIcon,
  EventLogoWrap,
  EventSummaryContent,
  EventTierBadge,
  EventTitle,
  EventTitleName,
  EventTitles,
} from "./EventStats.styled";

interface EventStatCardProps {
  item: EventStats;
  showEdit?: boolean;
  onEdit: () => void;
}

const EventStatCard = ({ item, showEdit = false, onEdit }: EventStatCardProps) => (
    <EventAccordion disableGutters>
      <AccordionSummary
        expandIcon={
          <EventExpandIcon>
            <ExpandMoreIcon fontSize="small" />
          </EventExpandIcon>
        }
      >
        <EventSummaryContent>
          <EventCardTop>
            <EventCardHeader>
              <EventLogoWrap>
                <OrganizationLogo name={item.eventOrganization} size={32} />
              </EventLogoWrap>
              <EventTitles>
                <EventTitle
                  title={
                    item.eventName
                      ? `${item.eventOrganization} ${item.eventName}`
                      : item.eventOrganization
                  }
                >
                  <span>{item.eventOrganization}</span>
                  {item.eventName ? (
                    <EventTitleName> {item.eventName}</EventTitleName>
                  ) : null}
                </EventTitle>
                <EventDateTime>
                  <EventTierBadge $tier={item.eventTier}>{item.eventTier}</EventTierBadge>
                  {item.majorStage ? <MajorStageBadge stage={item.majorStage} /> : null}
                  <AccessTimeIcon />
                  {formatIsoDateRange(item.date, item.endDate)}
                </EventDateTime>
              </EventTitles>
              <Chip
                label={`${item.totalBets} ставок`}
                size="small"
                variant="outlined"
                sx={{
                  ml: "auto",
                  flexShrink: 0,
                  borderColor: "rgba(76, 175, 80, 0.35)",
                  color: "rgba(255, 255, 255, 0.75)",
                  display: { xs: "none", sm: "flex" },
                }}
              />
              {showEdit ? (
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
              ) : null}
            </EventCardHeader>

            <EventStatsMetrics item={item} />
          </EventCardTop>
        </EventSummaryContent>
      </AccordionSummary>

      <AccordionDetails>
        <EventDetailsPanel>
          <Box
            component="span"
            sx={{
              display: { xs: "block", sm: "none" },
              fontSize: 12,
              opacity: 0.55,
              mb: 1,
            }}
          >
            {item.totalBets} ставок
          </Box>
          <EventBetsTable bets={item.bets} />
        </EventDetailsPanel>
      </AccordionDetails>
    </EventAccordion>
);

export default EventStatCard;
