export const routes = {
  // Navbar routes
  Home: "/",
  Profile: {
    index: "/profile",
    bookings: {
      index: "/profile/bookings",
    },
    disputes: {
      index: "/profile/disputes",
    },
    properties: {
      index: "/profile/properties",
      create: "/profile/properties/create",
    },
  },
  Accommodation: "/accommodation",
  Experiences: "/experiences",
  AboutUs: "/about-us",
  Contact: "/contact",

  // Auth routes
  Register: "/register",

  // Footer routes
  HelpCenter: "/help-center",
  AirCover: "/aircover",
  AntiDiscrimination: "/anti-discrimination",
  HostHome: "/host",
  HostAirCover: "/host-aircover",
  HostResources: "/host-resources",
  PressRoom: "/press-room",
  NewFeatures: "/new-features",
  Privacy: "/privacy",
  Terms: "/terms",
  Sitemap: "/sitemap",
} as const;

/** Builds the booking URL for an accommodation, with optional preselected dates. */
export function accommodationBookPath(
  id: string,
  dates?: { checkIn?: Date | null; checkOut?: Date | null },
) {
  const params = new URLSearchParams();
  if (dates?.checkIn) params.set("checkIn", toDateParam(dates.checkIn));
  if (dates?.checkOut) params.set("checkOut", toDateParam(dates.checkOut));
  const query = params.toString();
  return `/accommodation/${id}/book${query ? `?${query}` : ""}`;
}

function toDateParam(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}
