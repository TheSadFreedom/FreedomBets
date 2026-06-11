import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { Bet } from "@/entities/bet";
import BetDescriptionCell from "@/features/bets/components/BetDescriptionCell/BetDescriptionCell";
import TeamLogo from "@/shared/ui/TeamLogo/TeamLogo";
import { BetsTableWrap } from "./EventBetsTable.styled";

interface EventBetsTableProps {
  bets: Bet[];
}

const statusColor: Record<Bet["status"], "warning" | "success" | "error"> = {
  WAIT: "warning",
  WIN: "success",
  LOSE: "error",
};

const wrapTextSx = {
  wordBreak: "break-word",
  overflowWrap: "anywhere",
} as const;

const tableSx = {
  tableLayout: "fixed",
  width: "100%",
  minWidth: 1192,
} as const;

const col = {
  date: { width: 108 },
  team: { width: 300 },
  betType: { width: 160 },
  amount: { width: 88 },
  odds: { width: 56 },
  payout: { width: 96 },
  status: { width: 84 },
} as const;

const textCellSx = {
  minWidth: 0,
  whiteSpace: "normal" as const,
  ...wrapTextSx,
};

const formatPayout = (bet: Bet) => {
  if (bet.status === "WAIT") {
    return `до ${(bet.amount * bet.odds).toLocaleString("ru-RU", { maximumFractionDigits: 0 })} ₽`;
  }
  if (bet.status === "WIN") {
    return `+${(bet.amount * bet.odds - bet.amount).toLocaleString("ru-RU", { maximumFractionDigits: 0 })} ₽`;
  }
  return `−${bet.amount.toLocaleString("ru-RU")} ₽`;
};

const EventBetsTable = ({ bets }: EventBetsTableProps) => {
  if (bets.length === 0) return null;

  return (
    <BetsTableWrap>
      <TableContainer>
        <Table size="small" sx={tableSx}>
          <colgroup>
            <col style={{ width: col.date.width }} />
            <col style={{ width: col.team.width }} />
            <col style={{ width: col.team.width }} />
            <col style={{ width: col.betType.width }} />
            <col style={{ width: col.amount.width }} />
            <col style={{ width: col.odds.width }} />
            <col style={{ width: col.payout.width }} />
            <col style={{ width: col.status.width }} />
          </colgroup>
          <TableHead>
            <TableRow>
              <TableCell sx={{ whiteSpace: "nowrap" }}>Дата</TableCell>
              <TableCell sx={textCellSx}>Команда 1</TableCell>
              <TableCell sx={textCellSx}>Команда 2</TableCell>
              <TableCell sx={textCellSx}>Тип</TableCell>
              <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                Сумма
              </TableCell>
              <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                Кэф
              </TableCell>
              <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                Результат
              </TableCell>
              <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                Статус
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bets.map((bet) => (
              <TableRow key={bet.id} hover>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  <Typography variant="body2" lineHeight={1.3}>
                    {bet.date}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {bet.time} · {bet.format}
                  </Typography>
                </TableCell>
                <TableCell sx={textCellSx}>
                  <TeamLogo name={bet.organization1} size={26} showName nameWrap />
                </TableCell>
                <TableCell sx={textCellSx}>
                  <TeamLogo name={bet.organization2} size={26} showName nameWrap />
                </TableCell>
                <TableCell sx={textCellSx}>
                  <BetDescriptionCell bet={bet} />
                </TableCell>
                <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                  {bet.amount.toLocaleString("ru-RU")} ₽
                </TableCell>
                <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                  {bet.odds.toFixed(2)}
                </TableCell>
                <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                  {formatPayout(bet)}
                </TableCell>
                <TableCell align="center">
                  <Chip label={bet.status} color={statusColor[bet.status]} size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </BetsTableWrap>
  );
};

export default EventBetsTable;
