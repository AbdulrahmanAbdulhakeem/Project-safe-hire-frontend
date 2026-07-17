import { Link } from 'react-router';
import { useAuthStore } from '../store/authStore';
import { Button } from '@/components/ui/button';
import { ShieldCheck, LogOut } from 'lucide-react';

export default function PublicHeader() {
  const { user, isAuthenticated, logout } = useAuthStore();

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
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Button>
              <Link to="/login">Login as Company/Admin</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}