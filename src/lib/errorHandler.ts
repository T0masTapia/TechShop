// lib/errorHandler.ts

export function parseAppError(error: any): string {
  if (!error) return "Ocurrió un error desconocido.";

  const message = error.message || error.toString() || "";
  const status = error.status || error.statusCode || error.code;

  // 1. Errores de Red / Supabase pausado o reiniciando
  if (
    message.includes("fetch failed") ||
    message.includes("Failed to fetch") ||
    error.cause?.code === "ENOTFOUND" ||
    error.cause?.code === "ECONNREFUSED"
  ) {
    if (process.env.NODE_ENV === "development") {
      return "La base de datos se está iniciando o hay un problema de conexión (Supabase pausado). Reintenta en un momento.";
    }

    return "No pudimos conectar con el catálogo en este momento. Por favor, verifica tu conexión o intenta nuevamente en unos segundos.";
  }

  // 2. Errores HTTP Comunes
  if (status === 401 || message.includes("JWT") || message.includes("auth")) {
    return "Tu sesión ha expirado o no estás autenticado. Por favor, inicia sesión.";
  }

  if (status === 403) {
    return "No tienes permisos para realizar esta acción.";
  }

  if (status === 404) {
    return "El recurso o producto solicitado no fue encontrado.";
  }

  if (status >= 500) {
    return "Error en el servidor. Estamos trabajando para solucionarlo.";
  }

  // 3. Errores específicos de Postgres / Supabase
  if (error.code === "PGRST116") {
    return "No se encontraron datos para la consulta solicitada.";
  }

  return message || "Ocurrió un problema al procesar la solicitud.";
}
