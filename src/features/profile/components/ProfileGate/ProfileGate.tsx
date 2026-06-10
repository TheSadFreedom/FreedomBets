import { useState } from "react";
import { TextField } from "@mui/material";
import type { Profile } from "@/entities/profile";
import { limitInputLength, MAX_INPUT_LENGTH } from "@/shared/lib/limits";
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
        </GateBody>
      </GateCard>
    </GateRoot>
  );
};

export default ProfileGate;
