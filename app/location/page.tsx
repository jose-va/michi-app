import { Suspense } from "react";
import LocationPage from "@/common/components/pages/location/LocationPage";
import ReviewsSection from "@/common/components/ui/location/ReviewsSection";
import { ReviewsEnrichmentService } from "@/service/ReviewsEnrichmentService";
import type { PublicView } from "@/common/utils/reviews-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ubicación",
  alternates: { canonical: "/location" },
};

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
