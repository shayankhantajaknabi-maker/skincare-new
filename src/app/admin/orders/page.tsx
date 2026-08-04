import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-session";
import OrderManager from "./order-manager";

export default async function AdminOrdersPage() {
  const admin = await getAdminSession();

  if (!admin) {
    redirect("/admin/login");
  }

  return <OrderManager />;
}