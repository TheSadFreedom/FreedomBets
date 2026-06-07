import { IconButton, Stack, Tooltip, useMediaQuery, useTheme } from "@mui/material";
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

const ActionButtons = ({ bet, onEdit, onDelete, onWin, onLose, onRevert }: ActionButtonsProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const iconSx = {
    p: isMobile ? 0.75 : 0.5,
    minWidth: isMobile ? 40 : undefined,
    minHeight: isMobile ? 40 : undefined,
  };

  return (
  <Stack
    direction="row"
    alignItems="center"
    flexWrap="wrap"
    justifyContent={isMobile ? "flex-end" : "flex-start"}
    sx={{ ml: isMobile ? 0 : -0.5, gap: isMobile ? 0.25 : 0 }}
  >
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
};

export default ActionButtons;
