export const routes = {
  // Navbar routes
  Home: "/",
  Profile: {
    index: "/profile",
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
