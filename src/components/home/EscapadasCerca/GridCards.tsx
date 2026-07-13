import type { PropertyCard as PropertyCardType } from "@/types/property-cards";
import { PropertyCard } from "./PropertyCard";

type GridCardsProps = {
  properties: PropertyCardType[];
};

export const GridCards = ({ properties }: GridCardsProps) => {
  if (properties.length === 0) return null;

  const featured = properties[0];
  const secondary = properties.slice(1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Card destacada */}
      {featured && (
        <div>
          <PropertyCard property={featured} />
        </div>
      )}

      {/* Cards secundarias lado a lado */}
      {secondary.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {secondary.map((property, index) => (
            <div
              key={property.id}
              className={
                index === 1
                  ? "max-[1020px]:hidden lg:[--card-aspect:737/796]"
                  : "lg:[--card-aspect:737/796]"
              }
            >
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
