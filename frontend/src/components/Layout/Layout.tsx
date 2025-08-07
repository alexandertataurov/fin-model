import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Menu, LogOut, Home, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
// import { HelpButton } from '../ui';
import { ThemeToggle } from '../theme-toggle';
import Sidebar from './Sidebar';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const userInitial =
    user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U';
  const fullName = user
    ? `${user.first_name} ${user.last_name}`.trim() || user.username
    : '';

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSidebarToggle = () => {
    setSidebarOpen(prev => !prev);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);

    const breadcrumbMap: Record<string, { label: string }> = {
      dashboard: { label: 'Dashboard' },
      dashboards: { label: 'Financial Dashboards' },
      pl: { label: 'P&L Dashboard' },
      cashflow: { label: 'Cash Flow' },
      'balance-sheet': { label: 'Balance Sheet' },
      files: { label: 'File Upload' },
      reports: { label: 'Reports' },
      scenarios: { label: 'Scenario Modeling' },
      analytics: { label: 'Analytics' },
      admin: { label: 'Admin Panel' },
    };

    return segments
      .map((segment, index) => {
        const path = `/${segments.slice(0, index + 1).join('/')}`;
        const breadcrumb = breadcrumbMap[segment];

        if (!breadcrumb) return null;

        return (
          <React.Fragment key={path}>
            <button
              onClick={() => navigate(path)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {breadcrumb.label}
            </button>
            {index < segments.length - 1 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </React.Fragment>
        );
      })
      .filter(Boolean);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onToggle={handleSidebarToggle} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center gap-4 px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSidebarToggle}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm">
              <Home className="h-4 w-4 text-muted-foreground" />
              {getBreadcrumbs()}
            </div>

            <div className="ml-auto flex items-center gap-4">
              <ThemeToggle />
              {/* <HelpButton /> */}

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={fullName} />
                      <AvatarFallback>
                        {userInitial.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {fullName && <p className="font-medium">{fullName}</p>}
                      {user?.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <Separator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
