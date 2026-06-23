import type { PropertyCard as PropertyCardType } from "@/types/property-cards";
import { PropertyCard } from "./PropertyCard";

type EscapadasCercaProps = {
  properties: PropertyCardType[];
  periodLabel?: string;
};

export const EscapadasCerca = ({
  properties,
  periodLabel = "Se muestran ofertas para este periodo",
}: EscapadasCercaProps) => {
  if (properties.length === 0) return null;

  // Primera del array = destacada, resto = secundarias
  const featured = properties[0];
  const secondary = properties.slice(1);

  return (
    <section className="w-full max-w-[1600px] mx-auto px-6 py-12 md:px-10 lg:px-12">
      {/* Encabezado */}
      <div className="mb-6 ml-13 flex flex-col gap-1">
        <h2 className="text-3xl font-semibold text-zinc-900 tracking-tight">
          Escapadas cerca de tu ubicación
        </h2>
        <p className="text-base text-zinc-500">{periodLabel}</p>
      </div>

      {/* Grilla de cards */}
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-6">
        {/* Card destacada (50%) */}
        {featured && (
          <div className="lg:w-1/2">
            <PropertyCard property={featured} />
          </div>
        )}

        {/* Cards secundarias (50%, side-by-side) */}
        {secondary.length > 0 && (
          <div className="flex flex-1 flex-col gap-6 sm:flex-row items-stretch">
            {secondary.map((property) => (
              <div key={property.id} className="flex-1">
                <PropertyCard property={property} expandImage />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
