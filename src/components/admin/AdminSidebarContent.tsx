import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { NAV_ITEMS } from "./AdminConfig";

export const SidebarContent = ({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) => (
  <div className="flex flex-col h-full">
    <div className="px-6 py-5 border-b border-border-low flex items-center gap-2">
      <ShieldCheck className="h-5 w-5 text-primary" />
      <span className="text-sm font-semibold tracking-tight">
        Stayke <span className="text-gradient font-bold">Admin</span>
      </span>
    </div>

    <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
      {NAV_ITEMS.map(({ label, href, icon: Icon, soon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={soon ? "#" : href}
            onClick={!soon ? onNavigate : undefined}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors relative
              ${
                active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-cream hover:text-foreground"
              }
              ${soon ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{label}</span>
            {soon && (
              <span className="ml-auto text-[10px] font-medium border border-border-low rounded px-1.5 py-0.5 text-muted-foreground">
                Soon
              </span>
            )}
            {active && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-primary" />
            )}
          </Link>
        );
      })}
    </nav>

    <div className="px-6 py-4 border-t border-border-low">
      <p className="text-xs text-muted-foreground">Stayke v0.1 · Admin</p>
    </div>
  </div>
);
