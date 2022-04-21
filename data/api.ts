import { fetch } from "@remix-run/node";
import invariant from "tiny-invariant";

export namespace TBA {
  export type Team = {
    key: string;
    team_number: number;
    nickname: string | null;
    name: string;
    school_name: string | null;
    city: string;
    state_prov: string;
    country: string;
    address: string | null;
    postal_code: string | null;
    gmaps_place_id: string | null;
    gmaps_url: string | null;
    lat: number | null;
    lng: number | null;
    location_name: string | null;
    website: string | null;
    rookie_year: number;
    motto: string | null;
    home_championship: Record<string, string>;
  };

  export type EventSimple = {
    key: string;
    name: string;
    event_code: string;
    event_type: number;
    district:
      | {
          abbreviation: string;
          display_name: string;
          key: string;
          year: number;
        }[]
      | null;
    city: string | null;
    state_prov: string | null;
    country: string | null;
    start_date: string;
    end_date: string;
    year: number;
  };

  const API_URL = "https://www.thebluealliance.com/api/v3";

  async function _get<T>(path: string): Promise<T> {
    invariant(process.env.TBA_AUTH_KEY, "TBA_AUTH_KEY must be set");

    return await fetch(`${API_URL}${path}`, {
      method: "GET",
      headers: {
        "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY,
      },
    }).then((response) => {
      if (response.status !== 200) {
        throw response;
      }

      return response.json();
    });
  }

  export async function teams(pageNum: number): Promise<Team[]> {
    return (await _get<Team[]>(`/teams/${pageNum}`)).filter(
      (team) =>
        !(
          team.city === null ||
          team.state_prov === null ||
          team.country === null ||
          team.rookie_year === null
        )
    );
  }

  export async function eventsSimple(year: number): Promise<EventSimple[]> {
    return _get<EventSimple[]>(`/events/${year}/simple`);
  }

  export async function eventTeamKeys(eventKey: string): Promise<string[]> {
    return _get<string[]>(`/event/${eventKey}/teams/keys`);
  }

  export type EventMatchSimple = {
    key: string;
    comp_level: string;
    set_number: number;
    match_number: number;
    alliances: {
      red: {
        score: number;
        team_keys: string[];
        surrogate_team_keys: string[];
        dq_team_keys: string[];
      };
      blue: {
        score: number;
        team_keys: string[];
        surrogate_team_keys: string[];
        dq_team_keys: string[];
      };
    };
    winning_alliance: string;
    event_key: string;
    time: number;
    predicted_time: number;
    actual_time: number;
  };

  export async function eventMatchesSimple(
    eventKey: string
  ): Promise<EventMatchSimple[]> {
    return _get<EventMatchSimple[]>(`/event/${eventKey}/matches/simple`);
  }

  export type Ranking = {
    matches_played: number;
    qual_average: number;
    extra_stats: number[];
    sort_orders: number[];
    record: {
      losses: number;
      wins: number;
      ties: number;
    };
    rank: number;
    dq: number;
    team_key: string;
  };

  export async function eventRankings(eventKey: string): Promise<Ranking[]> {
    return _get<{ rankings: Ranking[] }>(`/event/${eventKey}/rankings`).then(
      ({ rankings }) => rankings
    );
  }

  export type Alliance = {
    name: string;
    backup: {
      in: string;
      out: string;
    };
    declines: string[];
    picks: string[];
    status: {
      playoff_average: number;
      level: string;
      record: {
        losses: number;
        wins: number;
        ties: number;
      };
      current_level_record: {
        losses: number;
        wins: number;
        ties: number;
      };
      status: string;
    };
  };

  export async function eventAlliances(eventKey: string): Promise<Alliance[]> {
    return _get<Alliance[]>(`/event/${eventKey}/alliances`);
  }
}
