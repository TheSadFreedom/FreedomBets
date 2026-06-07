import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import type { Bet } from "@/entities/bet";
import type { EventRecord } from "@/entities/eventRecord";
import type { ProfileMedal } from "@/entities/medal";
import type { PickemMajor } from "@/entities/pickem";
import type { PickemStageName } from "@/entities/pickem";
import PickemMajorCard from "@/features/pickem/components/PickemMajorCard/PickemMajorCard";
import PickemMedalsBlock from "@/features/pickem/components/PickemMedalsBlock/PickemMedalsBlock";
import PickemMajorSelectDialog from "@/features/pickem/components/PickemMajorSelectDialog/PickemMajorSelectDialog";
import { getMajorEventOptions } from "@/features/pickem/lib/majorEventOptions";
import { AddButton, EmptyState, TabRoot, Toolbar } from "./PickemTab.styled";

interface PickemTabProps {
  bets: Bet[];
  events: EventRecord[];
  pickems: PickemMajor[];
  medals: ProfileMedal[];
  onAddMajor: (eventOrganization: string, eventName: string) => Promise<void>;
  onUploadStageImage: (
    major: PickemMajor,
    stage: PickemStageName,
    file: File
  ) => Promise<void>;
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

      <Toolbar>
        <AddButton
          type="button"
          onClick={() => setSelectOpen(true)}
          disabled={availableMajors.length === 0}
        >
          <AddIcon sx={{ fontSize: 18 }} />
          Выбрать major
        </AddButton>
      </Toolbar>

      {pickems.length === 0 ? (
        <EmptyState>
          Нажмите «Выбрать major» — появятся 4 стадии для скриншотов pick&apos;em
        </EmptyState>
      ) : (
        pickems.map((major) => (
          <PickemMajorCard
            key={major.id}
            major={major}
            onDelete={onDeleteMajor}
            onUploadStageImage={onUploadStageImage}
          />
        ))
      )}

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
