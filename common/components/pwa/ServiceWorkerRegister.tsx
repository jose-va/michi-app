"use client";

import { useEffect } from "react";

// Registra el trabajador de servicio una sola vez en el cliente.
// Si falla (navegación privada, almacenamiento lleno), la web sigue
// navegable con red (CL-6): el error se ignora en silencio.
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
  }, []);
  return null;
}
