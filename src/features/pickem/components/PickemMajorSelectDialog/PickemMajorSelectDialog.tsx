import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { Bet } from "@/entities/bet";
import type { EventRecord } from "@/entities/eventRecord";
import type { PickemMajor } from "@/entities/pickem";
import { getMajorEventOptions } from "@/features/pickem/lib/majorEventOptions";
import MajorLogo from "@/shared/ui/MajorLogo/MajorLogo";
import {
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogShell,
  DialogTitle,
  FooterButton,
  dialogBackdropSx,
} from "@/features/matches/components/MatchFormDialog/MatchFormDialog.styled";
import { resolveDialogPaperSx } from "@/shared/styles/dialogSx";

interface PickemMajorSelectDialogProps {
  open: boolean;
  bets: Bet[];
  events: EventRecord[];
  pickems: PickemMajor[];
  onClose: () => void;
  onSubmit: (eventOrganization: string, eventName: string) => Promise<void>;
}

const PickemMajorSelectDialog = ({
  open,
  bets,
  events,
  pickems,
  onClose,
  onSubmit,
}: PickemMajorSelectDialogProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const options = useMemo(
    () => getMajorEventOptions(bets, pickems, events),
    [bets, pickems, events]
  );
  const [selectedKey, setSelectedKey] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSelectedKey(options[0]?.key ?? "");
  }, [open, options]);

  const selected = options.find((item) => item.key === selectedKey);

  const handleSubmit = async () => {
    if (!selected || saving) return;
    setSaving(true);
    try {
      await onSubmit(selected.eventOrganization, selected.eventName);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      fullScreen={isMobile}
      maxWidth="sm"
      slotProps={{
        backdrop: { sx: dialogBackdropSx },
        paper: { sx: resolveDialogPaperSx(isMobile) },
      }}
    >
      <DialogShell>
        <DialogHeader>
          <DialogTitle>Выбрать major</DialogTitle>
          <IconButton onClick={onClose} aria-label="Закрыть" size="small">
            <CloseIcon />
          </IconButton>
        </DialogHeader>

        <DialogBody>
          {options.length === 0 ? (
            <p style={{ margin: 0, opacity: 0.6, fontSize: 14 }}>
              Нет доступных major — создайте турнир с tier Major или добавьте ставку на major.
            </p>
          ) : (
            <FormControl fullWidth size="small">
              <InputLabel>Major</InputLabel>
              <Select
                value={selectedKey}
                label="Major"
                onChange={(e) => setSelectedKey(e.target.value)}
              >
                {options.map((option) => (
                  <MenuItem key={option.key} value={option.key}>
                    <MajorLogo
                      eventOrganization={option.eventOrganization}
                      eventName={option.eventName}
                      size={24}
                      showName
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogBody>

        <DialogFooter>
          <FooterButton type="button" onClick={onClose}>
            Отмена
          </FooterButton>
          <FooterButton
            type="button"
            $primary
            disabled={!selected || saving}
            onClick={() => void handleSubmit()}
          >
            {saving ? "Добавление…" : "Добавить"}
          </FooterButton>
        </DialogFooter>
      </DialogShell>
    </Dialog>
  );
};

export default PickemMajorSelectDialog;
