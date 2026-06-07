import type { PickemStageName, PickemStageResult } from "./constants";

export interface PickemStageData {
  stage: PickemStageName;
  imageUrl: string | null;
  result: PickemStageResult | null;
}

export interface PickemMajor {
  id: string;
  profileId: number;
  eventOrganization: string;
  eventName: string;
  stages: PickemStageData[];
}

export type PickemMajorCreateInput = Pick<PickemMajor, "eventOrganization" | "eventName">;
