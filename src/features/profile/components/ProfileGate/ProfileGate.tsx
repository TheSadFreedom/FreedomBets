import { useState } from "react";
import SystemUpdateAltOutlinedIcon from "@mui/icons-material/SystemUpdateAltOutlined";
import { TextField } from "@mui/material";
import type { Profile } from "@/entities/profile";
import { limitInputLength, MAX_INPUT_LENGTH } from "@/shared/lib/limits";
import { useDesktopUpdates } from "@/shared/lib/desktop/useDesktopUpdates";
import { formatDesktopUpdateStatus } from "@/shared/lib/desktop/formatUpdateStatus";
import {
  CreateButton,
  CreateRow,
  EmptyHint,
  GateBody,
  GateCard,
  GateDivider,
  GateHero,
  GateRoot,
  GateSectionTitle,
  GateSubtitle,
  GateTitle,
  GateUpdateButton,
  GateUpdateHint,
  GateUpdateRow,
  ProfileAvatar,
  ProfileList,
  ProfileListBalance,
  ProfileListInfo,
  ProfileListItem,
  ProfileListMeta,
  ProfileListName,
} from "./ProfileGate.styled";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: "10px",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#81c784",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(102, 187, 106, 0.6)",
  },
} as const;

interface ProfileGateProps {
  profiles: Profile[];
  onSelect: (id: number) => void;
  onCreate: (name: string) => Promise<void>;
}

const profileInitial = (name: string) => {
  const trimmed = name.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
};

const ProfileGate = ({ profiles, onSelect, onCreate }: ProfileGateProps) => {
  const {
    bridgeState,
    currentVersion,
    status: updateStatus,
    checking: checkingUpdates,
    canInstall: canInstallUpdate,
    checkForUpdates,
    installUpdate,
  } = useDesktopUpdates();
  const [nameInput, setNameInput] = useState("");
  const [creating, setCreating] = useState(false);
  const trimmed = nameInput.trim();
  const canCreate = trimmed.length > 0 && !creating;

  const handleCreate = async () => {
    if (!canCreate) return;
    setCreating(true);
    try {
      await onCreate(trimmed);
      setNameInput("");
    } finally {
      setCreating(false);
    }
  };

  return (
    <GateRoot>
      <GateCard>
        <GateHero>
          <GateTitle>Профили</GateTitle>
          <GateSubtitle>
            Выберите профиль или создайте новый — без пароля, всё локально на устройстве.
          </GateSubtitle>
        </GateHero>

        <GateBody>
          <section>
            <GateSectionTitle>Сохранённые</GateSectionTitle>
            {profiles.length > 0 ? (
              <ProfileList>
                {profiles.map((item) => (
                  <ProfileListItem key={item.id} type="button" onClick={() => onSelect(item.id)}>
                    <ProfileAvatar>{profileInitial(item.name)}</ProfileAvatar>
                    <ProfileListInfo>
                      <ProfileListName>{item.name}</ProfileListName>
                      <ProfileListMeta>{item.totalBets} ставок</ProfileListMeta>
                    </ProfileListInfo>
                    <ProfileListBalance $positive={item.balance >= 0}>
                      {item.balance.toLocaleString("ru-RU", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}{" "}
                      ₽
                    </ProfileListBalance>
                  </ProfileListItem>
                ))}
              </ProfileList>
            ) : (
              <EmptyHint>Пока нет профилей — создайте первый ниже.</EmptyHint>
            )}
          </section>

          <GateDivider />

          <section>
            <GateSectionTitle>Новый профиль</GateSectionTitle>
            <CreateRow>
              <TextField
                label="Имя профиля"
                value={nameInput}
                onChange={(e) => setNameInput(limitInputLength(e.target.value))}
                fullWidth
                autoFocus
                sx={fieldSx}
                slotProps={{ htmlInput: { maxLength: MAX_INPUT_LENGTH } }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void handleCreate();
                }}
              />
              <CreateButton type="button" onClick={() => void handleCreate()} disabled={!canCreate}>
                {creating ? "Создание…" : "Создать профиль"}
              </CreateButton>
            </CreateRow>
          </section>

          <GateDivider />

          <section>
            <GateSectionTitle>Обновления</GateSectionTitle>
            <GateUpdateRow>
              <GateUpdateHint>
                {bridgeState === "ready"
                  ? formatDesktopUpdateStatus(updateStatus, currentVersion)
                  : bridgeState === "broken"
                    ? "Не удалось подключить desktop API. Переустановите приложение."
                    : "Доступно в установленном приложении FreedomBets"}
              </GateUpdateHint>
              {bridgeState === "ready" && canInstallUpdate ? (
                <GateUpdateButton type="button" onClick={installUpdate}>
                  <SystemUpdateAltOutlinedIcon sx={{ fontSize: 18 }} />
                  Перезапустить и обновить
                </GateUpdateButton>
              ) : (
                <GateUpdateButton
                  type="button"
                  onClick={() => void checkForUpdates()}
                  disabled={bridgeState !== "ready" || checkingUpdates}
                >
                  <SystemUpdateAltOutlinedIcon sx={{ fontSize: 18 }} />
                  {checkingUpdates ? "Проверка…" : "Проверить обновления"}
                </GateUpdateButton>
              )}
            </GateUpdateRow>
          </section>
        </GateBody>
      </GateCard>
    </GateRoot>
  );
};

export default ProfileGate;
