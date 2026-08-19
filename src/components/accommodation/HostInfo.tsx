import { CheckIcon } from "@/icons";
import type { PropertyHost } from "@/types/api/propertyDetail";

interface HostInfoProps {
  host: PropertyHost;
  city?: string;
}

const getInitials = (name: string, lastName: string) =>
  `${name.trim().charAt(0)}${lastName.trim().charAt(0)}`.toUpperCase();

export function HostInfo({ host, city }: HostInfoProps) {
  const metaParts = [
    city,
    host.country,
    host.listings === 1 ? "1 publicación" : `${host.listings} publicaciones`,
  ].filter(Boolean);

  return (
    <section className="card-white">
      <h2 className="text-xl font-semibold text-zinc-900">Anfitrión</h2>

      <div className="mt-4 flex items-center gap-4">
        <span
          aria-hidden="true"
          className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white"
        >
          {getInitials(host.name, host.lastName)}
        </span>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-lg font-semibold text-zinc-900">
              {host.name} {host.lastName}
            </p>
            {host.isVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                <span className="flex items-center [&>svg]:size-3.5">
                  <CheckIcon />
                </span>
                Verificado
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-zinc-500">{metaParts.join(" · ")}</p>
        </div>
      </div>
    </section>
  );
}
