import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-session";
import CategoryManager from "./category-manager";

export default async function AdminCategoriesPage() {
  const admin = await getAdminSession();

  if (!admin) {
    redirect("/admin/login");
  }

  return <CategoryManager />;
}