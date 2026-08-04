import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-session";
import PromoManager from "./promo-manager";

export default async function AdminPromosPage() {
  const admin = await getAdminSession();

  if (!admin) {
    redirect("/admin/login");
  }

  return <PromoManager />;
}