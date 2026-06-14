import type { PickemStageName, PickemStageResult } from "./constants";

export interface PickemStage {
  stage: PickemStageName;
  imageUrl: string | null;
  result?: PickemStageResult | null;
}

export interface Pickem {
  id: string;
  profileId: number;
  eventName: string;
  stages: PickemStage[];
  /** @deprecated legacy single image */
  imageUrl?: string | null;
  /** @deprecated legacy field */
  eventOrganization?: string;
}

export type PickemMajor = Pickem;

export type PickemCreateInput = Pick<Pickem, "eventName" | "stages">;

export type PickemMajorCreateInput = PickemCreateInput;
