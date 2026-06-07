import { AccordionDetails, AccordionSummary, Chip } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { EventStats } from "@/entities/event";
import EventBetsTable from "@/features/bets/components/EventBetsTable/EventBetsTable";
import EventStatsMetrics from "@/features/events/components/EventStats/EventStatsMetrics";
import MajorStageBadge from "@/features/events/components/MajorStageBadge/MajorStageBadge";
import type { MajorEventGroup } from "@/features/events/lib/majorEventStats";
import { formatIsoDateRange } from "@/shared/lib/date/isoDate";
import MajorLogo from "@/shared/ui/MajorLogo/MajorLogo";
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
} from "@/features/events/components/EventStats/EventStats.styled";
import {
  MajorStageBlock,
  MajorStageHeader,
  MajorStageTitle,
} from "./MajorEventStats.styled";

interface MajorEventGroupCardProps {
  group: MajorEventGroup;
  stages: EventStats[];
  showEdit?: boolean;
  onEditGroup: () => void;
  onEditStage: (stage: EventStats) => void;
}

const MajorEventGroupCard = ({
  group,
  stages,
  showEdit = false,
  onEditGroup,
  onEditStage,
}: MajorEventGroupCardProps) => (
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
              <MajorLogo
                eventOrganization={group.eventOrganization}
                eventName={group.eventName}
                size={32}
              />
            </EventLogoWrap>
            <EventTitles>
              <EventTitle
                title={
                  group.eventName
                    ? `${group.eventOrganization} ${group.eventName}`
                    : group.eventOrganization
                }
              >
                <span>{group.eventOrganization}</span>
                {group.eventName ? <EventTitleName> {group.eventName}</EventTitleName> : null}
              </EventTitle>
              <EventDateTime>
                <EventTierBadge $tier="Major">Major</EventTierBadge>
                <AccessTimeIcon />
                {formatIsoDateRange(group.date, group.endDate)}
              </EventDateTime>
            </EventTitles>
            <Chip
              label={`${group.totalBets} ставок · ${stages.length} стад.`}
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
                  onEditGroup();
                }}
              >
                <EditOutlinedIcon sx={{ fontSize: 16 }} />
              </EventEditButton>
            ) : null}
          </EventCardHeader>

          <EventStatsMetrics item={group} />
        </EventCardTop>
      </EventSummaryContent>
    </AccordionSummary>

    <AccordionDetails>
      <EventDetailsPanel>
        <MajorStageTitle>Стадии</MajorStageTitle>
        {stages.map((stage) => (
          <MajorStageBlock key={stage.majorStage ?? "unknown"}>
            <MajorStageHeader>
              {stage.majorStage ? <MajorStageBadge stage={stage.majorStage} /> : null}
              {!stage.majorStage ? <MajorStageTitle>Без стадии</MajorStageTitle> : null}
              <Chip
                label={`${stage.totalBets} ставок`}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: "rgba(76, 175, 80, 0.28)",
                  color: "rgba(255, 255, 255, 0.65)",
                  height: 22,
                  fontSize: 11,
                }}
              />
              {showEdit ? (
                <EventEditButton
                  type="button"
                  aria-label="Редактировать стадию"
                  onClick={() => onEditStage(stage)}
                  style={{ opacity: 1, marginLeft: "auto" }}
                >
                  <EditOutlinedIcon sx={{ fontSize: 16 }} />
                </EventEditButton>
              ) : null}
            </MajorStageHeader>
            <EventStatsMetrics item={stage} />
            <EventBetsTable bets={stage.bets} />
          </MajorStageBlock>
        ))}
      </EventDetailsPanel>
    </AccordionDetails>
  </EventAccordion>
);

export default MajorEventGroupCard;
