import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-session";
import ProductManager from "./product-manager";

export default async function AdminProductsPage() {
  const admin = await getAdminSession();

  if (!admin) {
    redirect("/admin/login");
  }

  return <ProductManager />;
}