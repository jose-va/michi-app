import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de cookies | Michi Sushi Granada",
  description:
    "Información provisional sobre las cookies utilizadas en Michi Sushi Granada.",
};

export default function CookiesPage() {
  return (
    <div className="mx-auto w-full max-w-3xl pb-16">
      <h1 className="text-3xl font-extrabold text-white">
        Política de cookies
      </h1>
      <p
        role="note"
        className="mt-4 rounded-lg border-l-4 border-primary bg-white/5 px-4 py-3 text-zinc-200"
      >
        Aviso: contenido provisional pendiente de revisión legal definitiva
      </p>
      <div className="mt-6 flex flex-col gap-8 rounded-lg bg-black/60 p-6 text-zinc-100 backdrop-blur-md md:p-8">
        <section aria-labelledby="que-son">
          <h2 id="que-son" className="text-xl font-bold text-white">
            Qué son las cookies
          </h2>
          <p className="mt-2">
            Las cookies son pequeños archivos que se guardan en tu navegador
            para que el sitio web recuerde información básica de tu visita.
          </p>
        </section>
        <section aria-labelledby="tipos">
          <h2 id="tipos" className="text-xl font-bold text-white">
            Tipos utilizados
          </h2>
          <p className="mt-2">
            Este sitio web usa únicamente cookies técnicas de sesión y de inicio
            de sesión, necesarias para mantener tu sesión y mostrar tu perfil.
          </p>
          <p className="mt-2">
            Este sitio web no usa cookies de analítica ni de publicidad.
          </p>
        </section>
        <section aria-labelledby="gestion">
          <h2 id="gestion" className="text-xl font-bold text-white">
            Cómo gestionar o desactivar las cookies en el navegador
          </h2>
          <p className="mt-2">
            Puedes gestionar o desactivar las cookies desde la configuración de
            tu navegador, donde encontrarás la opción para borrarlas o
            bloquearlas.
          </p>
        </section>
      </div>
    </div>
  );
}
