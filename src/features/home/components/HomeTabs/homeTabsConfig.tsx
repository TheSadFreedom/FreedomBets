import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import HowToVoteOutlinedIcon from "@mui/icons-material/HowToVoteOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import type { ReactElement } from "react";

export type HomeTabId =
  | "matches"
  | "bets"
  | "summary"
  | "ranking"
  | "teams"
  | "events"
  | "majors"
  | "pickem";

export interface HomeTabConfig {
  label: string;
  id: HomeTabId;
  icon: ReactElement;
}

const tabIconSxDesktop = { fontSize: 17 } as const;

export const HOME_TABS: HomeTabConfig[] = [
  {
    label: "Матчи",
    id: "matches",
    icon: <SportsEsportsOutlinedIcon sx={tabIconSxDesktop} />,
  },
  {
    label: "История",
    id: "bets",
    icon: <ReceiptLongOutlinedIcon sx={tabIconSxDesktop} />,
  },
  {
    label: "Статистика",
    id: "summary",
    icon: <InsightsOutlinedIcon sx={tabIconSxDesktop} />,
  },
  {
    label: "Топ",
    id: "ranking",
    icon: <EmojiEventsOutlinedIcon sx={tabIconSxDesktop} />,
  },
  {
    label: "Команды",
    id: "teams",
    icon: <GroupsOutlinedIcon sx={tabIconSxDesktop} />,
  },
  {
    label: "Турниры",
    id: "events",
    icon: <EventOutlinedIcon sx={tabIconSxDesktop} />,
  },
  {
    label: "Major",
    id: "majors",
    icon: <WorkspacePremiumOutlinedIcon sx={tabIconSxDesktop} />,
  },
  {
    label: "Pick'em",
    id: "pickem",
    icon: <HowToVoteOutlinedIcon sx={tabIconSxDesktop} />,
  },
];

export const getHomeTabIndex = (id: HomeTabId) => HOME_TABS.findIndex((tab) => tab.id === id);
