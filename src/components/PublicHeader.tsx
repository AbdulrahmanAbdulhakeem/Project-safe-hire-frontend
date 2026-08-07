import {useNavigate } from 'react-router';
import { useAuthStore } from '../store/authStore';
import { Button } from '@/components/ui/button';
import { ShieldCheck, LogOut, LayoutDashboard } from 'lucide-react';

export default function PublicHeader() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const dashboardPath =
    user?.role === 'ADMIN'
      ? '/dashboard/admin'
      : user?.role === 'COMPANY'
        ? '/dashboard/company'
        : '/';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">SafeHire</h1>
            <p className="text-xs text-gray-500 -mt-1">Nigeria • Verified Hiring</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Hi, <span className="font-medium text-gray-900">{user?.name}</span>
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(dashboardPath)}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                {user?.role === 'ADMIN' ? 'Admin Dashboard' : 'Company Dashboard'}
              </Button>

              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Button onClick={() => navigate('/login')}>
              Login as Company/Admin
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}