import axios from "axios";

const NOMINATIN_API_URL = "https://nominatim.openstreetmap.org";

export interface Locations {
  place_id: number;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  boundingbox: [string, string, string, string];
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    country_code?: string;
    road?: string;
    suburb?: string;
    [key: string]: string | undefined;
  };
}

function buildReqUrl(uri: string, queries: URLSearchParams): string {
  queries.append("format", "json");
  return `${NOMINATIN_API_URL}/${uri}?${queries.toString()}`;
}

export async function searchByLocation(
  q: string,
  limit = 5,
): Promise<Locations[]> {
  if (!q || !q.trim()) return [];
  const queries = new URLSearchParams();
  queries.append("q", q.trim());
  queries.append("limit", String(limit));
  queries.append("addressdetails", "1");

  const { data } = await axios.get<Locations[]>(
    buildReqUrl("search", queries),
    {
      headers: {
        "Accept-Language": "es,en",
      },
    },
  );

  return data;
}

export async function searchByLatLong(
  lat: string,
  long: string,
): Promise<Locations> {
  const queries = new URLSearchParams();
  queries.append("lat", lat);
  queries.append("lon", long);
  queries.append("zoom", "10");
  queries.append("addressdetails", "1");

  const { data } = await axios.get<Locations>(buildReqUrl("reverse", queries), {
    headers: {
      "Accept-Language": "es,en",
    },
  });

  return data;
}
