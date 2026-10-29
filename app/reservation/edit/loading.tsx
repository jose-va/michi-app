import { EditLoadingNotice } from "./page";

// RF-8: mientras la ruta `/reservation/edit` obtiene la reserva en el
// servidor, se muestra el mismo indicador de carga en español, no
// interactuable, hasta disponer de los datos.
export default function EditReservationLoading() {
  return <EditLoadingNotice />;
}
