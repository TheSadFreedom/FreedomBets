import type { Match } from "@/entities/match";
import { getMapWinner, hasAnyMapData, hasMapRoundScore } from "@/features/matches/lib/matchMaps";
import {
  MapItem,
  MapName,
  MapsSection,
  MapScore,
  MapScoreGroup,
  MapScoreSep,
} from "./MatchCard.styled";

interface MatchCardMapsListProps {
  match: Match;
}

const MatchCardMapsList = ({ match }: MatchCardMapsListProps) => {
  const playedMaps = match.maps.filter(hasAnyMapData);
  if (playedMaps.length === 0) return null;

  return (
    <MapsSection>
      {match.maps.map((map, index) => {
        if (!hasAnyMapData(map)) return null;
        const winner = getMapWinner(map);
        const team1LeadingMap = hasMapRoundScore(map) && winner === 1;
        const team2LeadingMap = hasMapRoundScore(map) && winner === 2;
        return (
          <MapItem key={`${match.id}-map-${index}`}>
            <MapName title={map.name || undefined}>
              {map.name.trim() || `Карта ${index + 1}`}
            </MapName>
            <MapScoreGroup>
              <MapScore $leading={team1LeadingMap}>{map.score1 ?? "—"}</MapScore>
              <MapScoreSep>:</MapScoreSep>
              <MapScore $leading={team2LeadingMap}>{map.score2 ?? "—"}</MapScore>
            </MapScoreGroup>
          </MapItem>
        );
      })}
    </MapsSection>
  );
};

export default MatchCardMapsList;
