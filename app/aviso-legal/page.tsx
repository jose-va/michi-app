import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso legal | Michi Sushi Granada",
  description:
    "Información provisional sobre la titularidad y el contacto de Michi Sushi Granada.",
};

export default function AvisoLegalPage() {
  return (
    <div className="mx-auto w-full max-w-3xl pb-16">
      <h1 className="text-3xl font-extrabold text-white">Aviso legal</h1>
      <div className="mt-6 flex flex-col gap-8 rounded-lg bg-black/60 p-6 text-zinc-100 backdrop-blur-md md:p-8">
        <section aria-labelledby="identificacion">
          <h2 id="identificacion" className="text-xl font-bold text-white">
            Identificación del titular
          </h2>
          <p className="mt-2">
            El titular de este sitio web es Michi Sushi Bar, con NIF J23882848,
            domicilio en C. Gutierre Tibón, Santiago Lozano, 8, Local 2, 18011
            Granada y correo electrónico michisushigranada@gmail.com.
          </p>
        </section>
        <section aria-labelledby="objeto">
          <h2 id="objeto" className="text-xl font-bold text-white">
            Objeto del sitio
          </h2>
          <p className="mt-2">
            Este sitio web ofrece información provisional sobre la carta, la
            ubicación y las reservas de Michi Sushi Granada.
          </p>
        </section>
        <section aria-labelledby="condiciones">
          <h2 id="condiciones" className="text-xl font-bold text-white">
            Condiciones de uso
          </h2>
          <p className="mt-2">
            Al usar este sitio web te comprometes a hacer un uso adecuado de sus
            contenidos y a no emplearlos para actividades contrarias a la ley.
          </p>
        </section>
        <section aria-labelledby="propiedad">
          <h2 id="propiedad" className="text-xl font-bold text-white">
            Propiedad intelectual
          </h2>
          <p className="mt-2">
            Los contenidos de este sitio web, incluidos textos, imágenes y
            logotipos, pertenecen a Michi Sushi Bar salvo que se indique lo
            contrario y no pueden reproducirse sin su autorización.
          </p>
        </section>
        <section aria-labelledby="enlaces">
          <h2 id="enlaces" className="text-xl font-bold text-white">
            Enlaces
          </h2>
          <p className="mt-2">
            Este sitio web puede incluir enlaces a servicios de terceros, como
            Google o Uber Eats, que se rigen por sus propias condiciones y
            políticas.
          </p>
        </section>
        <section aria-labelledby="responsabilidad">
          <h2 id="responsabilidad" className="text-xl font-bold text-white">
            Responsabilidad
          </h2>
          <p className="mt-2">
            Este contenido es provisional y se ofrece a título orientativo;
            Michi Sushi Bar no garantiza que la información esté siempre
            actualizada hasta su revisión legal definitiva.
          </p>
        </section>
        <section aria-labelledby="legislacion">
          <h2 id="legislacion" className="text-xl font-bold text-white">
            Legislación aplicable
          </h2>
          <p className="mt-2">
            Este aviso legal se rige provisionalmente por la legislación
            española que resulte de aplicación.
          </p>
        </section>
      </div>
    </div>
  );
}
