import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/design-system/components/Button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/design-system/components/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/design-system/components/DropdownMenu';
import { Separator } from '@/design-system/components/Separator';
import { Menu, LogOut, Home, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Caption, textStyles } from '@/design-system/utils/typography';
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
      balance: { label: 'Balance Sheet' },
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
              style={textStyles.nav}
              className="text-muted-foreground hover:text-foreground transition-colors"
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
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center gap-4 px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSidebarToggle}
              className="lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>

            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-1 text-sm">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Home className="h-4 w-4" />
                <span style={textStyles.nav}>Home</span>
              </button>
              {getBreadcrumbs().length > 0 && (
                <>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <div className="flex items-center space-x-1">
                    {getBreadcrumbs()}
                  </div>
                </>
              )}
            </nav>

            <div className="flex-1" />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || undefined} alt={fullName} />
                    <AvatarFallback>{userInitial}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <Caption className="font-medium">{fullName}</Caption>
                    <Caption className="w-[200px] truncate text-muted-foreground">
                      {user?.email}
                    </Caption>
                  </div>
                </div>
                <Separator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <ThemeToggle />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
