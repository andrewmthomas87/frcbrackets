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
}
