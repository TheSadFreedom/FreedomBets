import type { Bet } from "@/entities/bet";
import { formatBetDescription, formatBetDescriptionLines } from "@/entities/bet";
import {
  BetDescriptionMarket,
  BetDescriptionStack,
  BetDescriptionTeam,
} from "./BetDescriptionCell.styled";

interface BetDescriptionCellProps {
  bet: Bet;
}

const BetDescriptionCell = ({ bet }: BetDescriptionCellProps) => {
  const { market, team } = formatBetDescriptionLines(bet);

  return (
    <BetDescriptionStack title={formatBetDescription(bet)}>
      <BetDescriptionMarket>{market}</BetDescriptionMarket>
      {team ? <BetDescriptionTeam>{team}</BetDescriptionTeam> : null}
    </BetDescriptionStack>
  );
};

export default BetDescriptionCell;
