import { destinosData } from "./mocks";

export const DestinationMenu = () => {
  return (
    <div>
      <p className="text-xs font-semibold text-zinc-500 mb-4">
        Destinaciones Sugeridas
      </p>
      <div className="space-y-1">
        {destinosData.map((destino) => (
          <div
            key={destino.ciudad}
            className="group flex items-center gap-3 cursor-pointer rounded-xl px-2 -mx-2 py-3 transition-colors duration-150 hover:bg-zinc-50"
          >
            <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center transition-all duration-150 group-hover:bg-purple-200 group-hover:scale-110">
              <div className="w-5 h-5 text-purple-500 shrink-0">
                <destino.icon />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-800">
                {destino.ciudad}
              </p>
              <p className="text-xs text-zinc-500">{destino.descripcion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
