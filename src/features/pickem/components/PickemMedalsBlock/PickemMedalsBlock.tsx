import { useRef, useState } from "react";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import CloseIcon from "@mui/icons-material/Close";
import type { ProfileMedal } from "@/entities/medal";
import PickemImageLightbox from "@/features/pickem/components/PickemImageLightbox/PickemImageLightbox";
import ConfirmDialog from "@/shared/ui/ConfirmDialog/ConfirmDialog";
import {
  DeleteMedalButton,
  MedalImageButton,
  MedalsBlock,
  MedalsGrid,
  MedalsHeader,
  MedalsHint,
  MedalsIcon,
  MedalsSubtitle,
  MedalsTitle,
  MedalsTitleRow,
  UploadMedalButton,
  UserMedalTile,
} from "./PickemMedalsBlock.styled";

interface PickemMedalsBlockProps {
  medals: ProfileMedal[];
  onUpload: (imageData: string) => Promise<void>;
  onDelete: (medal: ProfileMedal) => Promise<void>;
}

const readImageFile = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const PickemMedalsBlock = ({ medals, onUpload, onDelete }: PickemMedalsBlockProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [expandedImage, setExpandedImage] = useState<{ src: string; alt: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProfileMedal | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleUpload = async (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    setUploading(true);
    try {
      const imageData = await readImageFile(file);
      await onUpload(imageData);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <MedalsBlock>
      <MedalsHeader>
        <MedalsTitleRow>
          <MedalsIcon aria-hidden>
            <EmojiEventsOutlinedIcon sx={{ fontSize: 18 }} />
          </MedalsIcon>
          <div>
            <MedalsTitle>Медали</MedalsTitle>
            <MedalsSubtitle>только для этого профиля</MedalsSubtitle>
          </div>
        </MedalsTitleRow>
        <UploadMedalButton
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadFileOutlinedIcon sx={{ fontSize: 16 }} />
          {uploading ? "Загрузка…" : "Загрузить"}
        </UploadMedalButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => void handleUpload(e.target.files)}
        />
      </MedalsHeader>

      {medals.length === 0 ? (
        <MedalsHint>Загрузите изображение медали — оно появится в вашей коллекции.</MedalsHint>
      ) : null}

      <MedalsGrid>
        {medals.map((medal) => (
          <UserMedalTile key={medal.id}>
            <DeleteMedalButton
              type="button"
              aria-label="Удалить медаль"
              onClick={() => setDeleteTarget(medal)}
            >
              <CloseIcon sx={{ fontSize: 14 }} />
            </DeleteMedalButton>
            <MedalImageButton
              type="button"
              aria-label="Развернуть медаль"
              onClick={() =>
                setExpandedImage({ src: medal.imageUrl, alt: "Загруженная медаль" })
              }
            >
              <img src={medal.imageUrl} alt="" />
            </MedalImageButton>
          </UserMedalTile>
        ))}
      </MedalsGrid>

      <PickemImageLightbox
        open={Boolean(expandedImage)}
        src={expandedImage?.src ?? ""}
        alt={expandedImage?.alt ?? ""}
        onClose={() => setExpandedImage(null)}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Удалить медаль?"
        message="Медаль будет удалена из профиля без возможности восстановления."
        confirming={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          setDeleting(true);
          try {
            await onDelete(deleteTarget);
            setDeleteTarget(null);
          } finally {
            setDeleting(false);
          }
        }}
      />
    </MedalsBlock>
  );
};

export default PickemMedalsBlock;
