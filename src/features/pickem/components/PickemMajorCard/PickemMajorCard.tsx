import { useMemo, useRef, useState, type MouseEvent } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import { AccordionDetails, AccordionSummary } from "@mui/material";
import type { PickemMajor } from "@/entities/pickem";
import PickemImageLightbox from "@/features/pickem/components/PickemImageLightbox/PickemImageLightbox";
import MajorStageBadge from "@/features/events/components/MajorStageBadge/MajorStageBadge";
import type { EventRecord } from "@/entities/eventRecord";
import { resolveEventLogoSlug } from "@/features/events/lib/eventDisplay";
import { stageStyleFor } from "@/features/events/lib/eventStages";
import { resolvePickemStagesForMajor } from "@/features/pickem/lib/resolvePickemStages";
import EventLogo from "@/shared/ui/EventLogo/EventLogo";
import ConfirmDialog from "@/shared/ui/ConfirmDialog/ConfirmDialog";
import {
  DeleteMajorButton,
  EventLogoWrap,
  PickemAccordion,
  PickemCardHeader,
  PickemCardTitle,
  PickemHeaderMeta,
  PickemName,
  PickemOrg,
  PickemProgressFill,
  PickemProgressTrack,
  PickemStagesBadge,
  PickemUploadError,
  ReplaceImageButton,
  StageActions,
  StageCard,
  StageCardBody,
  StageCardHeader,
  StageCardStatus,
  StageImage,
  StageImageButton,
  StageUploadButton,
  StagesGrid,
} from "@/features/pickem/components/PickemTab/PickemTab.styled";

interface PickemMajorCardProps {
  major: PickemMajor;
  events?: EventRecord[];
  defaultExpanded?: boolean;
  onDelete: (major: PickemMajor) => void;
  onUploadStageImage: (major: PickemMajor, stage: string, file: File) => Promise<void>;
}

const stopSummaryToggle = (event: MouseEvent) => {
  event.preventDefault();
  event.stopPropagation();
};

const PickemMajorCard = ({
  major,
  events = [],
  defaultExpanded = false,
  onDelete,
  onUploadStageImage,
}: PickemMajorCardProps) => {
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [expandedImage, setExpandedImage] = useState<{ src: string; alt: string } | null>(null);
  const [uploadingStage, setUploadingStage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const stages = useMemo(
    () => resolvePickemStagesForMajor(major, events),
    [major, events]
  );

  const uploadedCount = stages.filter((stage) => Boolean(stage.imageUrl)).length;
  const totalStages = stages.length;
  const isComplete = uploadedCount === totalStages && totalStages > 0;
  const progress = totalStages > 0 ? uploadedCount / totalStages : 0;

  const openFilePicker = (stage: string) => {
    fileInputs.current[stage]?.click();
  };

  const handleFileChange = async (stage: string, fileList: FileList | null) => {
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
    <PickemAccordion
      disableGutters
      $complete={isComplete}
      expanded={expanded}
      onChange={(_, nextExpanded) => setExpanded(nextExpanded)}
    >
      <AccordionSummary expandIcon={false}>
        <PickemCardHeader>
          <EventLogoWrap>
            <EventLogo
              logoSlug={resolveEventLogoSlug(major.eventOrganization, major.eventName, events)}
              label={major.eventName || major.eventOrganization}
              size={28}
            />
          </EventLogoWrap>
          <PickemCardTitle>
            <PickemOrg>{major.eventOrganization}</PickemOrg>
            <PickemName>{major.eventName || major.eventOrganization}</PickemName>
          </PickemCardTitle>
          <PickemHeaderMeta>
            <PickemProgressTrack>
              <PickemProgressFill $value={progress} $complete={isComplete} />
            </PickemProgressTrack>
            <PickemStagesBadge $complete={isComplete}>
              {uploadedCount}/{totalStages}
            </PickemStagesBadge>
            <DeleteMajorButton
              type="button"
              aria-label="Удалить major"
              onClick={(event) => {
                stopSummaryToggle(event);
                setDeleteOpen(true);
              }}
            >
              <DeleteOutlineIcon sx={{ fontSize: 16 }} />
            </DeleteMajorButton>
          </PickemHeaderMeta>
        </PickemCardHeader>
      </AccordionSummary>

      <AccordionDetails>
        {uploadError ? <PickemUploadError>{uploadError}</PickemUploadError> : null}

        <StagesGrid>
          {stages.map((stageData) => {
            const hasImage = Boolean(stageData.imageUrl);
            const accent = stageStyleFor(stageData.stage).border;

            return (
              <StageCard key={stageData.stage} $hasImage={hasImage} $accent={accent}>
                <StageCardHeader>
                  <MajorStageBadge stage={stageData.stage} />
                  <StageCardStatus $uploaded={hasImage}>
                    {hasImage ? "Готово" : "Пусто"}
                  </StageCardStatus>
                </StageCardHeader>

                <StageCardBody>
                  <input
                    ref={(node) => {
                      fileInputs.current[stageData.stage] = node;
                    }}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => void handleFileChange(stageData.stage, e.target.files)}
                  />

                  {!hasImage ? (
                    <StageUploadButton
                      type="button"
                      disabled={uploadingStage === stageData.stage}
                      onClick={() => openFilePicker(stageData.stage)}
                    >
                      <UploadFileOutlinedIcon sx={{ fontSize: 30, opacity: 0.8 }} />
                      {uploadingStage === stageData.stage ? "Загрузка…" : "Загрузить скрин"}
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
                        <StageImage src={stageData.imageUrl!} alt={`Pick'em ${stageData.stage}`} />
                      </StageImageButton>
                      <StageActions>
                        <ReplaceImageButton
                          type="button"
                          disabled={uploadingStage === stageData.stage}
                          onClick={() => openFilePicker(stageData.stage)}
                        >
                          {uploadingStage === stageData.stage ? "Загрузка…" : "Заменить"}
                        </ReplaceImageButton>
                      </StageActions>
                    </>
                  )}
                </StageCardBody>
              </StageCard>
            );
          })}
        </StagesGrid>
      </AccordionDetails>

      <PickemImageLightbox
        open={Boolean(expandedImage)}
        src={expandedImage?.src ?? ""}
        alt={expandedImage?.alt ?? ""}
        onClose={() => setExpandedImage(null)}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Удалить pick'em?"
        message={`Турнир «${major.eventName || major.eventOrganization}» и все загруженные картинки будут удалены.`}
        confirming={deleting}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          setDeleting(true);
          try {
            await onDelete(major);
            setDeleteOpen(false);
          } finally {
            setDeleting(false);
          }
        }}
      />
    </PickemAccordion>
  );
};

export default PickemMajorCard;
