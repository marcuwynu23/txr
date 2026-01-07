
import { getAdminStats } from "@/actions/admin";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();
  
  if (!stats) {
    return <div className="p-8 text-center text-gray-500">Failed to load statistics. Access denied.</div>;
  }

  return <AdminDashboardClient stats={stats} />;
}
