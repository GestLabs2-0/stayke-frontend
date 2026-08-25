import { CheckIcon } from "@/icons";

interface AmenitiesListProps {
  amenities: string[];
}

export function AmenitiesList({ amenities }: AmenitiesListProps) {
  return (
    <section className="card-white">
      <h2 className="font-montserrat text-xl font-bold text-zinc-900">
        Amenities
      </h2>

      {amenities.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">
          Los amenities de este alojamiento se publican pronto.
        </p>
      ) : (
        <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {amenities.map((amenity) => (
            <li
              key={amenity}
              className="flex items-center gap-2.5 rounded-xl bg-surface/50 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-surface"
            >
              <span className="flex shrink-0 items-center text-accent-warm">
                <CheckIcon />
              </span>
              {amenity}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
