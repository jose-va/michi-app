import ProductFormPage from "@/common/components/pages/product/ProductFormPage";
import { UserService } from "@/service/UserService";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Nuevo producto | Panel",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CreateProductDashboard(){
    const user = await UserService.getProfile();
    if (!user || user.role !== "ROLE_ADMIN") redirect("/");

    return <ProductFormPage />;
}
