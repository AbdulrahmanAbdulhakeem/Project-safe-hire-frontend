import { useEffect } from "react";
import { useAdminStore } from "../../store/adminStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, UserCheck, Plus } from "lucide-react";
import CompaniesTable from "./CompaniesTable";
import AddCompanyModal from "./AddCompanyModal";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router";

export default function AdminDashboard() {
  const { companies, stats, fetchAllCompanies, fetchStats } = useAdminStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllCompanies();
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Platform Overview</p>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="mr-2 h-5 w-5" />
            Onboard Company
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              useAuthStore.getState().logout();
              navigate("/login");
            }}
          >
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm text-gray-500">
                Total Companies
              </CardTitle>
              <Users className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold">
                {stats?.totalCompanies || companies.length}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm text-gray-500">
                Total Jobs
              </CardTitle>
              <Briefcase className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold">{stats?.totalJobs || 0}</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm text-gray-500">
                Active Admins
              </CardTitle>
              <UserCheck className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold">{stats?.totalAdmins || 1}</p>
            </CardContent>
          </Card>
        </div>

        {/* Companies Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Registered Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <CompaniesTable companies={companies} />
          </CardContent>
        </Card>
      </div>

      <AddCompanyModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}
