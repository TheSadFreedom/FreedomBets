import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import HowToVoteOutlinedIcon from "@mui/icons-material/HowToVoteOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
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
  shortLabel?: string;
  id: HomeTabId;
  icon: ReactElement;
}

const tabIconSx = { fontSize: 22 } as const;
const tabIconSxDesktop = { fontSize: 17 } as const;

export const HOME_TABS: HomeTabConfig[] = [
  {
    label: "Матчи",
    id: "matches",
    icon: <SportsEsportsOutlinedIcon sx={tabIconSxDesktop} />,
  },
  {
    label: "История",
    shortLabel: "Истр.",
    id: "bets",
    icon: <ReceiptLongOutlinedIcon sx={tabIconSxDesktop} />,
  },
  {
    label: "Статистика",
    shortLabel: "Стат.",
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

export const MOBILE_PRIMARY_TAB_IDS: HomeTabId[] = ["matches", "bets", "summary"];

export const MOBILE_MORE_TAB_IDS: HomeTabId[] = [
  "events",
  "ranking",
  "teams",
  "majors",
  "pickem",
];

export const getHomeTabIndex = (id: HomeTabId) => HOME_TABS.findIndex((tab) => tab.id === id);

export const getMobileTabIcon = (id: HomeTabId) => {
  switch (id) {
    case "matches":
      return <SportsEsportsOutlinedIcon sx={tabIconSx} />;
    case "bets":
      return <ReceiptLongOutlinedIcon sx={tabIconSx} />;
    case "summary":
      return <InsightsOutlinedIcon sx={tabIconSx} />;
    case "ranking":
      return <EmojiEventsOutlinedIcon sx={tabIconSx} />;
    case "teams":
      return <GroupsOutlinedIcon sx={tabIconSx} />;
    case "events":
      return <EventOutlinedIcon sx={tabIconSx} />;
    case "majors":
      return <WorkspacePremiumOutlinedIcon sx={tabIconSx} />;
    case "pickem":
      return <HowToVoteOutlinedIcon sx={tabIconSx} />;
    default:
      return <MoreHorizOutlinedIcon sx={tabIconSx} />;
  }
};
