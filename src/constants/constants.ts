import type { FooterLink, FooterLinkGroup } from "../types/FooterTypes";
import { routes } from "./routes";

export const linkNavegation = [
  { link: routes.Home, name: "Inicio" },
  { link: routes.Destinys, name: "Destinos" },
  { link: routes.Experiences, name: "Experiencias" },
  // { link: routes.AboutUs, name: "Sobre Nosotros" },
  // { link: routes.Contact, name: "Contacto" },
];

export const footerLinks: FooterLinkGroup[] = [
  {
    title: "Asistencia",
    links: [
      { name: "Centro de ayuda", href: routes.HelpCenter },
      { name: "AirCover", href: routes.AirCover },
      { name: "Antidiscriminación", href: routes.AntiDiscrimination },
    ],
  },
  {
    title: "Anfitrión",
    links: [
      { name: "Pon tu casa en Stayke", href: routes.HostHome },
      { name: "AirCover para anfitriones", href: routes.HostAirCover },
      { name: "Recursos para anfitriones", href: routes.HostResources },
    ],
  },
  {
    title: "Stayke",
    links: [
      { name: "Sala de prensa", href: routes.PressRoom },
      { name: "Nuevas funciones", href: routes.NewFeatures },
    ],
  },
];

export const footerLegalLinks: FooterLink[] = [
  { name: "Privacidad", href: routes.Privacy },
  { name: "Términos", href: routes.Terms },
  { name: "Mapa del sitio", href: routes.Sitemap },
];
