import { Download } from "lucide-react";

const CARTA_URL =
  "https://michisushigranada.es/carta_michi_sushi_granada.pdf";

export default function CartaDownloadButton() {
  return (
    <a
      href={CARTA_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Descargar carta (se abre en una pestaña nueva)"
      className="flex items-center"
    >
      <Download className="size-7 text-white hover:scale-105 hover:cursor-pointer hover:text-white" />
    </a>
  );
}
