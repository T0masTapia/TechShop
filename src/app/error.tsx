'use client'

import { useEffect } from "react";
import { parseAppError } from "@/lib/errorHandler";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Detalle técnico capturado por boundary:", error);
  }, [error]);

  const userFriendlyMessage = parseAppError(error);

  return (
    <div className="min-h-[55vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 shadow-lg shadow-amber-950/20">
        <AlertTriangle size={28} />
      </div>

      <h2 className="text-white font-bold text-lg mb-2">
        No se pudo cargar la información
      </h2>

      <p className="text-sm text-gray-400 max-w-md mb-6 leading-relaxed">
        {userFriendlyMessage}
      </p>

      <button
        onClick={() => reset()}
        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-900/30 active:scale-95"
      >
        <RefreshCw size={15} />
        Reintentar conexión
      </button>
    </div>
  );
}