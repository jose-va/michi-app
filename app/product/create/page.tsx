import ProductFormPage from "@/common/components/pages/product/ProductFormPage";
import { UserService } from "@/service/UserService";
import { redirect } from "next/navigation";

export default async function CreateProductDashboard(){
    const user = await UserService.getProfile();
    if (!user || user.role !== "ROLE_ADMIN") redirect("/");

    return <ProductFormPage />;
}
