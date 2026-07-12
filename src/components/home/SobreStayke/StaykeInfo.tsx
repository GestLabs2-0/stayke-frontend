import { partnersData } from "./mocks";

export const StaykeInfo = () => {
  return (
    <div className="space-y-4">
      <h2 className="font-montserrat text-[32px] font-semibold text-zinc-900 leading-tight">
        Sobre Stayke
      </h2>
      <p className="font-sans text-base text-zinc-600 leading-relaxed max-w-[512px]">
        En Stayke, creemos que viajar es mucho m&aacute;s que visitar un
        destino; se trata de vivirlo. Conectamos a viajeros con espacios
        extraordinarios para crear experiencias aut&eacute;nticas,
        permiti&eacute;ndote sentirte como en casa en los rincones m&aacute;s
        fascinantes del mundo.
      </p>

      {/* Partner logos */}
      <div className="flex items-center gap-8 bg-white py-1 max-[800px]:hidden">
        {partnersData.map((partner) => (
          <span
            key={partner.name}
            className="font-sans text-xl font-bold text-zinc-900 tracking-tight"
          >
            {partner.name}
          </span>
        ))}
      </div>
    </div>
  );
};
