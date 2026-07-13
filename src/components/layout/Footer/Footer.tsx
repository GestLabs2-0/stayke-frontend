import Link from "next/link";
import { footerLegalLinks, footerLinks } from "../../../constants/constants";
import { routes } from "../../../constants/routes";
import { LogoStayke } from "../../Icons/LogoStayke";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#F7F7F7] px-4 py-16 md:px-6 lg:px-20 xl:px-40 2xl:px-60">
      <div className="mx-auto flex w-full md:max-w-[1000px] flex-col gap-8">
        {/* Desktop-left Side & Right Side */}
        <div className="flex flex-col gap-8 lg:flex-row lg:justify-between lg:items-start">
          {/* Left Side */}
          <div className="flex flex-col gap-4 md:items-center lg:items-start lg:max-w-70">
            <Link href={routes.Home} className="w-fit">
              <LogoStayke className="text-[#3B007F] w-32 h-8 lg:w-36 lg:h-9" />
            </Link>

            <span className="font-sans text-sm  leading-relaxed text-[#717171] md:text-center lg:text-left">
              Stayke ofrece una experiencia de reserva sencilla y segura para
              tus próximas vacaciones.
            </span>
          </div>

          {/* Right Side */}
          <div className="flex flex-col gap-8 md:items-center lg:items-start lg:flex-row lg:gap-12">
            {footerLinks.map((group) => (
              <div
                key={group.title}
                className="flex flex-col md:items-center lg:items-start gap-3"
              >
                <h3 className="font-sans text-sm font-bold text-[#222222]">
                  {group.title}
                </h3>
                <ul className="flex flex-col gap-2 md:items-center lg:items-start">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="font-sans text-sm text-[#717171] transition-colors hover:text-[#222222]"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Separator */}
        <hr className="border-[#C3C6D6]" />

        {/* Bottom Bar */}
        <div className="flex flex-col gap-4 items-start md:items-center lg:flex-row lg:items-center lg:justify-between">
          <span className="font-sans text-sm text-[#717171]">
            &copy; {currentYear} Stayke Inc.
          </span>

          <span className="font-sans text-sm text-[#717171]">
            {footerLegalLinks.map((link, index) => (
              <span key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-[#222222]"
                >
                  {link.name}
                </Link>
                {index < footerLegalLinks.length - 1 && " · "}
              </span>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
};
