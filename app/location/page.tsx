import { Suspense } from "react";
import LocationPage from "@/common/components/pages/location/LocationPage";
import ReviewsSection from "@/common/components/ui/location/ReviewsSection";
import { ReviewsEnrichmentService } from "@/service/ReviewsEnrichmentService";
import type { PublicView } from "@/common/utils/reviews-content";

// Spec 004 T7 — Hueco asíncrono solo-servidor (RF-11, RNF-2): resuelve el
// enriquecimiento sin bloquear la 003. La página es síncrona, así que la
// cabecera, el mapa y el panel forman el shell estático que se envía de
// inmediato; la sección solo se añade debajo cuando hay vista pública.
// Sin clave o con fallo → vista nula → omisión en silencio (RF-9/RF-10).
async function ReviewsSlot() {
  let view: PublicView | null = null;
  try {
    view = await ReviewsEnrichmentService.getPublicView();
  } catch {
    view = null;
  }
  return <ReviewsSection view={view} />;
}

export default function LocationDashboard() {
  return (
    <LocationPage
      reviewsSlot={
        <Suspense fallback={null}>
          <ReviewsSlot />
        </Suspense>
      }
    />
  );
}
