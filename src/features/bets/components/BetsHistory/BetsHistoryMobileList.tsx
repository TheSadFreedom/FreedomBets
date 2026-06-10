import type { Bet } from "@/entities/bet";
import ActionButtons from "@/features/bets/components/ActionButtons/ActionButtons";
import BetDescriptionCell from "@/features/bets/components/BetDescriptionCell/BetDescriptionCell";
import MajorStageBadge from "@/features/events/components/MajorStageBadge/MajorStageBadge";
import TeamLogo from "@/shared/ui/TeamLogo/TeamLogo";
import type { EventRecord } from "@/entities/eventRecord";
import { resolveEventLogoSlug } from "@/features/events/lib/eventDisplay";
import EventLogo from "@/shared/ui/EventLogo/EventLogo";
import { formatIsoDateDots } from "@/shared/lib/date/isoDate";
import {
  FormatBadge,
  MobileBetActions,
  MobileBetBody,
  MobileBetCard,
  MobileBetDate,
  MobileBetEventName,
  MobileBetEventOrg,
  MobileBetEventStrip,
  MobileBetEventText,
  MobileBetFooter,
  MobileBetList,
  MobileBetMeta,
  MobileBetPayout,
  MobileBetPick,
  MobileBetStageWrap,
  MobileBetTeams,
  MobileBetTop,
  MobileBetTopRight,
  MobileBetVs,
  StatusBadge,
} from "./BetsHistory.styled";

interface BetsHistoryMobileListProps {
  bets: Bet[];
  events?: EventRecord[];
  onEdit: (bet: Bet) => void;
  onDelete: (bet: Bet) => void;
  onWin: (id: string) => void;
  onLose: (id: string) => void;
  onRevert: (id: string) => void;
}

const formatPayout = (bet: Bet) => {
  if (bet.status === "WAIT") {
    return `до ${(bet.amount * bet.odds).toLocaleString("ru-RU", { maximumFractionDigits: 0 })} ₽`;
  }
  if (bet.status === "WIN") {
    return `+${(bet.amount * bet.odds - bet.amount).toLocaleString("ru-RU", { maximumFractionDigits: 0 })} ₽`;
  }
  return `−${bet.amount.toLocaleString("ru-RU")} ₽`;
};

const BetsHistoryMobileList = ({
  bets,
  events = [],
  onEdit,
  onDelete,
  onWin,
  onLose,
  onRevert,
}: BetsHistoryMobileListProps) => (
  <MobileBetList>
    {bets.map((bet) => (
      <MobileBetCard key={bet.id} $status={bet.status}>
        <MobileBetTop>
          <MobileBetDate>
            {formatIsoDateDots(bet.date)} · {bet.time}
          </MobileBetDate>
          <MobileBetTopRight>
            <MobileBetPayout $status={bet.status}>{formatPayout(bet)}</MobileBetPayout>
            <StatusBadge $status={bet.status}>{bet.status}</StatusBadge>
          </MobileBetTopRight>
        </MobileBetTop>

        <MobileBetBody>
          <MobileBetEventStrip>
            <EventLogo
              logoSlug={resolveEventLogoSlug(bet.eventOrganization, bet.eventName, events)}
              label={bet.eventName || bet.eventOrganization}
              size={24}
            />
            <MobileBetEventText>
              <MobileBetEventOrg>{bet.eventOrganization}</MobileBetEventOrg>
              {bet.eventName ? <MobileBetEventName>{bet.eventName}</MobileBetEventName> : null}
              {bet.majorStage ? (
                <MobileBetStageWrap>
                  <MajorStageBadge stage={bet.majorStage} />
                </MobileBetStageWrap>
              ) : null}
            </MobileBetEventText>
            <FormatBadge>{bet.format}</FormatBadge>
          </MobileBetEventStrip>

          <MobileBetTeams>
            <TeamLogo name={bet.organization1} size={20} showName nameWrap />
            <MobileBetVs>vs</MobileBetVs>
            <TeamLogo name={bet.organization2} size={20} showName nameWrap />
          </MobileBetTeams>

          <MobileBetPick>
            <BetDescriptionCell bet={bet} />
          </MobileBetPick>
        </MobileBetBody>

        <MobileBetFooter>
          <MobileBetMeta>
            {bet.amount.toLocaleString("ru-RU")} ₽ · {bet.odds.toFixed(2)}
          </MobileBetMeta>
          <MobileBetActions>
            <ActionButtons
              bet={bet}
              onEdit={onEdit}
              onDelete={onDelete}
              onWin={onWin}
              onLose={onLose}
              onRevert={onRevert}
            />
          </MobileBetActions>
        </MobileBetFooter>
      </MobileBetCard>
    ))}
  </MobileBetList>
);

export default BetsHistoryMobileList;
