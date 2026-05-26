import { montserrat } from "@/app/fonts/font";
import FavoritePage from "@/common/components/pages/product/FavoritePage";
import { UserService } from "@/service/UserService";
import { redirect } from "next/navigation";

export default async function FavoritesDashboard() {
  const user = await UserService.getProfile();
  if (!user) redirect("/");

  return (
    <section className="flex flex-col gap-2">
      <span
        className={`${montserrat.className} mx-auto flex text-3xl font-bold md:text-4xl text-white/90`}
      >
        Favoritos
      </span>
      <FavoritePage favorites={user.favoriteProducts} />
    </section>
  );
}
