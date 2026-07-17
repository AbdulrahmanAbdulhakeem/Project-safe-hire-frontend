import { Link, useNavigate } from 'react-router';
import { useAuthStore } from '../store/authStore';
import { Button } from '@/components/ui/button';
import { ShieldCheck, LogOut } from 'lucide-react';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-2xl font-bold tracking-tight text-gray-900">SafeHire</span>
            <p className="text-[10px] text-gray-500 -mt-1">Verified Hiring</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium">
            Home
          </Link>
          <Link to="/verify" className="text-gray-600 hover:text-gray-900 font-medium">
            Verify Company
          </Link>
          <Link to="/jobs" className="text-gray-600 hover:text-gray-900 font-medium">
            Browse Jobs
          </Link>
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              <div className="text-sm">
                <span className="text-gray-500">Welcome,</span>{' '}
                <span className="font-medium text-gray-900">{user.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
              {user.role === 'ADMIN' && (
                <Button onClick={() => navigate('/dashboard/admin')}>
                  Admin Dashboard
                </Button>
              )}
              {user.role === 'COMPANY' && (
                <Button onClick={() => navigate('/dashboard/company')}>
                  Company Dashboard
                </Button>
              )}
            </>
          ) : (
            <Button>
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}