import AdminReservations from "@/common/components/pages/reservation/AdminReservations";
import SkeletonCards from "@/common/components/skeletons/SkeletonCards";
import { UserService } from "@/service/UserService";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function ReservationPreview() {
  const user = await UserService.getProfile();
  if (!user) redirect("/");

  if (user.role === "ROLE_ADMIN") {
    return (
      <Suspense fallback={<SkeletonCards />} key={user}>
        <AdminReservations user={user} />
      </Suspense>
    );
  }
  if (user.role === "ROLE_USER") redirect("/reservation");
}
