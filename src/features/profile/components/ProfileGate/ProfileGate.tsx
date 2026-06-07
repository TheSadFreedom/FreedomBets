import { useState } from "react";
import { TextField } from "@mui/material";
import type { Profile } from "@/entities/profile";
import {
  CreateButton,
  CreateRow,
  EmptyHint,
  GateCard,
  GateRoot,
  GateSubtitle,
  GateTitle,
  ProfileList,
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
        <GateTitle>Профили</GateTitle>
        <GateSubtitle>Выберите существующий профиль или создайте новый — пароль не нужен.</GateSubtitle>

        {profiles.length > 0 ? (
          <ProfileList>
            {profiles.map((item) => (
              <ProfileListItem key={item.id} type="button" onClick={() => onSelect(item.id)}>
                <ProfileListName>{item.name}</ProfileListName>
                <ProfileListMeta>
                  {item.balance.toLocaleString("ru-RU", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}{" "}
                  ₽
                </ProfileListMeta>
              </ProfileListItem>
            ))}
          </ProfileList>
        ) : (
          <EmptyHint>Пока нет профилей — создайте первый ниже.</EmptyHint>
        )}
      </GateCard>

      <GateCard>
        <GateTitle>Новый профиль</GateTitle>
        <GateSubtitle>Введите имя и нажмите «Создать».</GateSubtitle>
        <CreateRow>
          <TextField
            label="Имя профиля"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            fullWidth
            autoFocus
            sx={fieldSx}
            onKeyDown={(e) => {
              if (e.key === "Enter") void handleCreate();
            }}
          />
          <CreateButton type="button" onClick={() => void handleCreate()} disabled={!canCreate}>
            {creating ? "Создание…" : "Создать профиль"}
          </CreateButton>
        </CreateRow>
      </GateCard>
    </GateRoot>
  );
};

export default ProfileGate;
