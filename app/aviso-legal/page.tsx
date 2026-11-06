import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso legal | Michi Sushi Granada",
  description:
    "Información sobre la titularidad y el contacto de Michi Sushi Granada.",
};

export default function AvisoLegalPage() {
  return (
    <article className="w-full bg-black/60 px-4 py-12 backdrop-blur-md md:py-16">
      <div className="mx-auto w-full max-w-3xl pb-16">
        <h1 className="text-3xl font-extrabold text-white">Aviso legal</h1>
        <div className="mt-8 flex flex-col gap-10 text-zinc-100">
          <section aria-labelledby="identificacion">
            <h2 id="identificacion" className="text-xl font-bold text-white">
              Identificación del titular
            </h2>
            <p className="mt-3 leading-relaxed font-extralight">
              El titular de este sitio web es Michi Sushi Bar, con NIF
              J23882848, domicilio en C. Gutierre Tibón, Santiago Lozano, 8,
              Local 2, 18011 Granada y correo electrónico
              michisushigranada@gmail.com.
            </p>
          </section>
          <section aria-labelledby="objeto">
            <h2 id="objeto" className="text-xl font-bold text-white">
              Objeto del sitio
            </h2>
            <p className="mt-3 leading-relaxed font-extralight">
              Este sitio web ofrece información sobre la carta, la ubicación y
              las reservas de Michi Sushi Granada.
            </p>
          </section>
          <section aria-labelledby="condiciones">
            <h2 id="condiciones" className="text-xl font-bold text-white">
              Condiciones de uso
            </h2>
            <p className="mt-3 leading-relaxed font-extralight">
              Al usar este sitio web te comprometes a hacer un uso adecuado de
              sus contenidos y a no emplearlos para actividades contrarias a la
              ley.
            </p>
          </section>
          <section aria-labelledby="propiedad">
            <h2 id="propiedad" className="text-xl font-bold text-white">
              Propiedad intelectual
            </h2>
            <p className="mt-3 leading-relaxed font-extralight">
              Los contenidos de este sitio web, incluidos textos, imágenes y
              logotipos, pertenecen a Michi Sushi Bar salvo que se indique lo
              contrario y no pueden reproducirse sin su autorización.
            </p>
          </section>
          <section aria-labelledby="enlaces">
            <h2 id="enlaces" className="text-xl font-bold text-white">
              Enlaces
            </h2>
            <p className="mt-3 leading-relaxed font-extralight">
              Este sitio web puede incluir enlaces a servicios de terceros, como
              Google o Uber Eats, que se rigen por sus propias condiciones y
              políticas.
            </p>
          </section>
          <section aria-labelledby="responsabilidad">
            <h2 id="responsabilidad" className="text-xl font-bold text-white">
              Responsabilidad
            </h2>
            <p className="mt-3 leading-relaxed font-extralight">
              La información de este sitio web tiene carácter general; Michi
              Sushi Bar no garantiza que esté siempre actualizada.
            </p>
          </section>
          <section aria-labelledby="legislacion">
            <h2 id="legislacion" className="text-xl font-bold text-white">
              Legislación aplicable
            </h2>
            <p className="mt-3 leading-relaxed font-extralight">
              Este aviso legal se rige por la legislación española que resulte
              de aplicación.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
