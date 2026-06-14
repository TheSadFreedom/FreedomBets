import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import HowToVoteOutlinedIcon from "@mui/icons-material/HowToVoteOutlined";
import type { Bet } from "@/entities/bet";
import type { EventRecord } from "@/entities/eventRecord";
import type { ProfileMedal } from "@/entities/medal";
import type { PickemMajor, PickemStageName, PickemStagePresetId } from "@/entities/pickem";
import PickemMajorCard from "@/features/pickem/components/PickemMajorCard/PickemMajorCard";
import PickemMedalsBlock from "@/features/pickem/components/PickemMedalsBlock/PickemMedalsBlock";
import PickemMajorSelectDialog from "@/features/pickem/components/PickemMajorSelectDialog/PickemMajorSelectDialog";
import { getMajorEventOptions } from "@/features/pickem/lib/majorEventOptions";
import {
  AddButton,
  EmptyState,
  EmptyStateHint,
  HeroContent,
  HeroGlow,
  HeroHint,
  HeroIcon,
  HeroLeft,
  HeroText,
  HeroTitle,
  PickemHeroCard,
  PickemMajorsList,
  PickemSection,
  PickemSectionCount,
  PickemSectionHeader,
  PickemSectionTitle,
  TabRoot,
} from "./PickemTab.styled";

interface PickemTabProps {
  bets: Bet[];
  events: EventRecord[];
  pickems: PickemMajor[];
  medals: ProfileMedal[];
  onAddMajor: (eventName: string) => Promise<void>;
  onConfigureStages: (major: PickemMajor, presetId: PickemStagePresetId) => Promise<void>;
  onUploadStageImage: (major: PickemMajor, stage: PickemStageName, file: File) => Promise<void>;
  onDeleteMajor: (major: PickemMajor) => Promise<void>;
  onUploadMedal: (imageData: string) => Promise<void>;
  onDeleteMedal: (medal: ProfileMedal) => Promise<void>;
}

const PickemTab = ({
  bets,
  events,
  pickems,
  medals,
  onAddMajor,
  onConfigureStages,
  onUploadStageImage,
  onDeleteMajor,
  onUploadMedal,
  onDeleteMedal,
}: PickemTabProps) => {
  const [selectOpen, setSelectOpen] = useState(false);
  const availableMajors = useMemo(
    () => getMajorEventOptions(bets, pickems, events),
    [bets, pickems, events]
  );

  return (
    <TabRoot>
      <PickemMedalsBlock medals={medals} onUpload={onUploadMedal} onDelete={onDeleteMedal} />

      <PickemHeroCard>
        <HeroGlow aria-hidden />
        <HeroContent>
          <HeroLeft>
            <HeroIcon aria-hidden>
              <HowToVoteOutlinedIcon sx={{ fontSize: 22 }} />
            </HeroIcon>
            <HeroText>
              <HeroTitle>Pick&apos;em</HeroTitle>
              <HeroHint>скриншоты pick&apos;em по стадиям major-турнира</HeroHint>
            </HeroText>
          </HeroLeft>
          <AddButton
            type="button"
            onClick={() => setSelectOpen(true)}
            disabled={availableMajors.length === 0}
          >
            <AddIcon sx={{ fontSize: 18 }} />
            Выбрать major
          </AddButton>
        </HeroContent>
      </PickemHeroCard>

      <PickemSection>
        {pickems.length > 0 ? (
          <PickemSectionHeader>
            <PickemSectionTitle>Турниры</PickemSectionTitle>
            <PickemSectionCount>
              {pickems.length}{" "}
              {pickems.length === 1
                ? "турнир"
                : pickems.length < 5
                  ? "турнира"
                  : "турниров"}
            </PickemSectionCount>
          </PickemSectionHeader>
        ) : null}

        {pickems.length === 0 ? (
          <EmptyState>
            Пока нет pick&apos;em
            <EmptyStateHint>
              Нажмите «Выбрать major» — затем выберите формат стадий и загрузите скрины
            </EmptyStateHint>
          </EmptyState>
        ) : (
          <PickemMajorsList>
            {pickems.map((major, index) => (
              <PickemMajorCard
                key={major.id}
                major={major}
                events={events}
                defaultExpanded={index === 0}
                onDelete={onDeleteMajor}
                onConfigureStages={onConfigureStages}
                onUploadStageImage={onUploadStageImage}
              />
            ))}
          </PickemMajorsList>
        )}
      </PickemSection>

      <PickemMajorSelectDialog
        open={selectOpen}
        bets={bets}
        events={events}
        pickems={pickems}
        onClose={() => setSelectOpen(false)}
        onSubmit={onAddMajor}
      />
    </TabRoot>
  );
};

export default PickemTab;
