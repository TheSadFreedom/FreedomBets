import { useRef, useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import type { PickemMajor } from "@/entities/pickem";
import type { PickemStageName } from "@/entities/pickem";
import PickemImageLightbox from "@/features/pickem/components/PickemImageLightbox/PickemImageLightbox";
import MajorStageBadge from "@/features/events/components/MajorStageBadge/MajorStageBadge";
import MajorLogo from "@/shared/ui/MajorLogo/MajorLogo";
import {
  DeleteMajorButton,
  PickemCard,
  PickemCardHeader,
  PickemCardTitle,
  PickemName,
  PickemOrg,
  ReplaceImageButton,
  StageCard,
  StageImage,
  StageImageButton,
  StageUploadButton,
  StagesGrid,
} from "@/features/pickem/components/PickemTab/PickemTab.styled";

interface PickemMajorCardProps {
  major: PickemMajor;
  onDelete: (major: PickemMajor) => void;
  onUploadStageImage: (
    major: PickemMajor,
    stage: PickemStageName,
    file: File
  ) => Promise<void>;
}

const PickemMajorCard = ({
  major,
  onDelete,
  onUploadStageImage,
}: PickemMajorCardProps) => {
  const fileInputs = useRef<Partial<Record<PickemStageName, HTMLInputElement | null>>>({});
  const [expandedImage, setExpandedImage] = useState<{ src: string; alt: string } | null>(null);
  const [uploadingStage, setUploadingStage] = useState<PickemStageName | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const openFilePicker = (stage: PickemStageName) => {
    fileInputs.current[stage]?.click();
  };

  const handleFileChange = async (stage: PickemStageName, fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    setUploadingStage(stage);
    setUploadError(null);
    try {
      await onUploadStageImage(major, stage, file);
    } catch {
      setUploadError("Не удалось загрузить картинку. Проверьте, что запущен npm run server.");
    } finally {
      setUploadingStage(null);
      if (fileInputs.current[stage]) fileInputs.current[stage]!.value = "";
    }
  };

  return (
    <PickemCard>
      <PickemCardHeader>
        <MajorLogo
          eventOrganization={major.eventOrganization}
          eventName={major.eventName}
          size={32}
        />
        <PickemCardTitle>
          <PickemOrg>{major.eventOrganization}</PickemOrg>
          <PickemName>{major.eventName || major.eventOrganization}</PickemName>
        </PickemCardTitle>
        <DeleteMajorButton
          type="button"
          aria-label="Удалить major"
          onClick={() => void onDelete(major)}
        >
          <DeleteOutlineIcon sx={{ fontSize: 18 }} />
        </DeleteMajorButton>
      </PickemCardHeader>

      {uploadError ? (
        <p style={{ margin: 0, fontSize: 13, color: "#ef9a9a" }}>{uploadError}</p>
      ) : null}

      <StagesGrid>
        {major.stages.map((stageData) => (
          <StageCard key={stageData.stage} $hasImage={Boolean(stageData.imageUrl)}>
            <MajorStageBadge stage={stageData.stage} />

            <input
              ref={(node) => {
                fileInputs.current[stageData.stage] = node;
              }}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => void handleFileChange(stageData.stage, e.target.files)}
            />

            {!stageData.imageUrl ? (
              <StageUploadButton
                type="button"
                disabled={uploadingStage === stageData.stage}
                onClick={() => openFilePicker(stageData.stage)}
              >
                <UploadFileOutlinedIcon sx={{ fontSize: 28, opacity: 0.75 }} />
                {uploadingStage === stageData.stage ? "Загрузка…" : "Загрузить pick'em"}
              </StageUploadButton>
            ) : (
              <>
                <StageImageButton
                  type="button"
                  aria-label={`Развернуть pick'em ${stageData.stage}`}
                  onClick={() =>
                    setExpandedImage({
                      src: stageData.imageUrl!,
                      alt: `Pick'em ${stageData.stage}`,
                    })
                  }
                >
                  <StageImage src={stageData.imageUrl} alt={`Pick'em ${stageData.stage}`} />
                </StageImageButton>
                <ReplaceImageButton
                  type="button"
                  disabled={uploadingStage === stageData.stage}
                  onClick={() => openFilePicker(stageData.stage)}
                >
                  {uploadingStage === stageData.stage ? "Загрузка…" : "Заменить картинку"}
                </ReplaceImageButton>
              </>
            )}
          </StageCard>
        ))}
      </StagesGrid>

      <PickemImageLightbox
        open={Boolean(expandedImage)}
        src={expandedImage?.src ?? ""}
        alt={expandedImage?.alt ?? ""}
        onClose={() => setExpandedImage(null)}
      />
    </PickemCard>
  );
};

export default PickemMajorCard;
