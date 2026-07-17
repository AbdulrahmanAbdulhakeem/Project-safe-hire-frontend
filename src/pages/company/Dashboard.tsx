import { useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { useCompanyStore } from "../../store/companyStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Briefcase, LogOut } from "lucide-react";
import MyJobsTable from "./MyJobsTable";
import { useNavigate } from "react-router";

export default function CompanyDashboard() {
  const { user, logout } = useAuthStore();
  const { jobs, fetchMyJobs } =
    useCompanyStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Company Header */}
      <header className="bg-white border-b px-8 py-5 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <Briefcase className="h-8 w-8 text-orange-600" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Company Dashboard
            </h1>
            <p className="text-gray-600">Welcome back, {user?.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate("/dashboard/company/post-job")}
            className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Post New Job
          </Button>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-500">
                Total Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold text-gray-900">{jobs.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-500">
                Active Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold text-green-600">
                {jobs.filter((j) => j.isActive !== false).length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-500">
                Company Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mt-2">
                <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xl font-semibold text-green-700">
                  Verified
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Jobs */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle className="text-2xl">My Posted Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <MyJobsTable jobs={jobs} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
