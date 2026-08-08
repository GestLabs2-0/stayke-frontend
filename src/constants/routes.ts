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
  Accommodation: "/Accommodation",
  Experiences: "/Experiences",
  AboutUs: "/AboutUs",
  Contact: "/Contact",

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
