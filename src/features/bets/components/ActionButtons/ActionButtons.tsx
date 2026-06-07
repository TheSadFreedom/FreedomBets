import { IconButton, Stack, Tooltip } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import UndoIcon from "@mui/icons-material/Undo";
import type { Bet } from "@/entities/bet";

interface ActionButtonsProps {
  bet: Bet;
  onEdit: (bet: Bet) => void;
  onDelete: (bet: Bet) => void;
  onWin: (id: string) => void;
  onLose: (id: string) => void;
  onRevert: (id: string) => void;
}

const iconSx = { p: 0.5 };

const ActionButtons = ({ bet, onEdit, onDelete, onWin, onLose, onRevert }: ActionButtonsProps) => (
  <Stack direction="row" alignItems="center" sx={{ ml: -0.5 }}>
    {bet.status === "WAIT" && (
      <>
        <Tooltip title="WIN" arrow>
          <IconButton
            size="small"
            color="success"
            sx={iconSx}
            onClick={() => onWin(bet.id)}
            aria-label="WIN"
          >
            <CheckCircleOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="LOSE" arrow>
          <IconButton
            size="small"
            color="error"
            sx={iconSx}
            onClick={() => onLose(bet.id)}
            aria-label="LOSE"
          >
            <HighlightOffIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Редактировать" arrow>
          <IconButton
            size="small"
            color="primary"
            sx={iconSx}
            onClick={() => onEdit(bet)}
            aria-label="Редактировать"
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </>
    )}
    {(bet.status === "WIN" || bet.status === "LOSE") && (
      <Tooltip title="Вернуть в WAIT" arrow>
        <IconButton
          size="small"
          color="warning"
          sx={iconSx}
          onClick={() => onRevert(bet.id)}
          aria-label="Вернуть в WAIT"
        >
          <UndoIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    )}
    <Tooltip title="Удалить" arrow>
      <IconButton
        size="small"
        color="inherit"
        sx={iconSx}
        onClick={() => onDelete(bet)}
        aria-label="Удалить"
      >
        <DeleteOutlineIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  </Stack>
);

export default ActionButtons;
