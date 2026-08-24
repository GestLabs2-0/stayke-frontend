import { Suspense } from "react";

import { DestinysExplorer } from "@/components/destinys/DestinysExplorer";

function DestinosLoading() {
  return (
    <div className="w-full px-6 py-12 flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4 text-purple-700">
        <span className="size-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
        <p className="text-sm font-semibold">Cargando destinos...</p>
      </div>
    </div>
  );
}

export default function DestinosPage() {
  return (
    <Suspense fallback={<DestinosLoading />}>
      <DestinysExplorer />
    </Suspense>
  );
}
