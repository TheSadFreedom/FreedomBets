const GQL_URL = "https://cyber.sports.ru/gql/graphql/";

const SERIES_QUERY = `query SportsRuSeries($id: ID!) {
  cyberStat {
    series(id: $id) {
      id
      hru
      status
      state
      scheduledAt
      type
      league { title shortTitle }
      stage { title }
      substage { title }
      team1 { teamScore team { name } }
      team2 { teamScore team { name } }
      summary {
        ... on CSSeriesSummary {
          maps {
            map { name }
            status
            winner
            team1 { score team { name } }
            team2 { score team { name } }
          }
        }
      }
    }
  }
}`;

export async function fetchSportsRuSeries(seriesId) {
  const response = await fetch(GQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      Referer: "https://cyber.sports.ru/cs/match/",
    },
    body: JSON.stringify({
      query: SERIES_QUERY,
      variables: { id: seriesId },
    }),
  });

  const payload = await response.json();
  if (!response.ok || payload.errors?.length) {
    const message = payload.errors?.[0]?.message ?? `GraphQL HTTP ${response.status}`;
    const error = new Error(message);
    error.code = "GQL_ERROR";
    throw error;
  }

  return payload.data?.cyberStat?.series ?? null;
}
