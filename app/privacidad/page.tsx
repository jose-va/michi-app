import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidad | Michi Sushi Granada",
  description:
    "Información provisional sobre los datos tratados al iniciar sesión con Google en Michi Sushi Granada.",
};

export default function PrivacidadPage() {
  return (
    <div className="mx-auto w-full max-w-3xl pb-16">
      <h1 className="text-3xl font-extrabold text-white">
        Política de privacidad
      </h1>
      <p
        role="note"
        className="mt-4 rounded-lg border-l-4 border-primary bg-white/5 px-4 py-3 text-zinc-200"
      >
        Aviso: contenido provisional pendiente de revisión legal definitiva
      </p>
      <div className="mt-6 flex flex-col gap-8 rounded-lg bg-black/60 p-6 text-zinc-100 backdrop-blur-md md:p-8">
        <section aria-labelledby="responsable">
          <h2
            id="responsable"
            className="text-xl font-bold text-white"
          >
            Responsable del tratamiento
          </h2>
          <p className="mt-2">
            El responsable del tratamiento es Michi Sushi Bar, con NIF
            J23882848, domicilio en C. Gutierre Tibón, Santiago Lozano, 8,
            Local 2, 18011 Granada y correo electrónico
            michisushigranada@gmail.com.
          </p>
        </section>
        <section aria-labelledby="datos">
          <h2 id="datos" className="text-xl font-bold text-white">
            Datos que se tratan
          </h2>
          <p className="mt-2">
            Al iniciar sesión con Google tratamos únicamente tu nombre, tu
            correo electrónico y tu imagen de avatar.
          </p>
        </section>
        <section aria-labelledby="finalidades">
          <h2
            id="finalidades"
            className="text-xl font-bold text-white"
          >
            Finalidades
          </h2>
          <p className="mt-2">
            Usamos estos datos solo para mantener tu sesión, mostrar tu perfil
            y gestionar tus reservas. No usamos estos datos para ninguna otra
            finalidad.
          </p>
        </section>
        <section aria-labelledby="base-juridica">
          <h2
            id="base-juridica"
            className="text-xl font-bold text-white"
          >
            Base jurídica
          </h2>
          <p className="mt-2">
            La base jurídica del tratamiento es la ejecución del servicio que
            solicitas al usar la cuenta y tu consentimiento al iniciar sesión
            con Google.
          </p>
        </section>
        <section aria-labelledby="conservacion">
          <h2
            id="conservacion"
            className="text-xl font-bold text-white"
          >
            Conservación
          </h2>
          <p className="mt-2">
            Conservamos los datos solo durante el tiempo necesario para cumplir
            las finalidades descritas en esta página.
          </p>
        </section>
        <section aria-labelledby="derechos">
          <h2 id="derechos" className="text-xl font-bold text-white">
            Derechos
          </h2>
          <p className="mt-2">
            Tienes derecho de acceso, rectificación, supresión, oposición,
            limitación y portabilidad sobre tus datos.
          </p>
          <p className="mt-2">
            Puedes ejercer tus derechos escribiendo a
            michisushigranada@gmail.com.
          </p>
        </section>
        <section aria-labelledby="cesiones">
          <h2 id="cesiones" className="text-xl font-bold text-white">
            Cesiones y encargados
          </h2>
          <p className="mt-2">
            Google actúa como proveedor del servicio de autenticación cuando
            inicias sesión con tu cuenta de Google.
          </p>
          <p className="mt-2">
            Con Uber Eats solo compartimos datos de la carta y del catálogo
            (productos y precios) para mantener actualizada su aplicación. No
            cedemos datos personales de los usuarios a Uber Eats, salvo que
            realices pedidos directamente en la plataforma de Uber Eats, que se
            rige por su propia política de privacidad.
          </p>
        </section>
        <section aria-labelledby="seguridad">
          <h2 id="seguridad" className="text-xl font-bold text-white">
            Seguridad
          </h2>
          <p className="mt-2">
            Aplicamos medidas básicas de protección para evitar la pérdida, el
            uso indebido o el acceso no autorizado a tus datos.
          </p>
        </section>
      </div>
    </div>
  );
}
