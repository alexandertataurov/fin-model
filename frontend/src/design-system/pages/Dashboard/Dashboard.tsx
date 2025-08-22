import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { getToken } from '../../tokens';
import { DashboardLayout } from '../../templates/DashboardLayout';
import { Dashboard } from '../../organisms/Dashboard';
import { DataTable } from '../../organisms/DataTable';
import { SearchBar } from '../../organisms/SearchBar';
import { PaginationControls } from '../../organisms/PaginationControls';
import { Card } from '../../molecules/Card';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';
import { Text } from '../../atoms/Text';
import { DashboardProps, DashboardRef } from './Dashboard.types';

const StyledDashboard = styled.div<{ $variant: string; $size: string }>`
  width: 100%;
  height: 100%;
`;

const StyledDashboardHeader = styled.div`
  margin-bottom: ${getToken('spacing.6')};
`;

const StyledDashboardContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: ${getToken('spacing.6')};
  margin-bottom: ${getToken('spacing.6')};
`;

const StyledMainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${getToken('spacing.6')};
`;

const StyledSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${getToken('spacing.4')};
`;

const StyledQuickStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${getToken('spacing.4')};
  margin-bottom: ${getToken('spacing.6')};
`;

const StyledStatCard = styled.div`
  background-color: ${getToken('colors.background')};
  border: ${getToken('borderWidth.sm')} solid ${getToken('colors.border')};
  border-radius: ${getToken('borderRadius.lg')};
  padding: ${getToken('spacing.4')};
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.3')};
`;

const StyledStatIcon = styled.div<{ $color: string }>`
  width: ${getToken('spacing.10')};
  height: ${getToken('spacing.10')};
  border-radius: ${getToken('borderRadius.lg')};
  background-color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const StyledStatContent = styled.div`
  flex: 1;
`;

const StyledStatValue = styled.div`
  font-size: ${getToken('typography.fontSize.2xl')};
  font-weight: ${getToken('typography.fontWeight.bold')};
  color: ${getToken('colors.foreground')};
  line-height: 1;
`;

const StyledStatLabel = styled.div`
  font-size: ${getToken('typography.fontSize.sm')};
  color: ${getToken('colors.muted.foreground')};
  margin-top: ${getToken('spacing.1')};
`;

const Dashboard = React.forwardRef<DashboardRef, DashboardProps>(
  (
    {
      title = 'Dashboard',
      subtitle = 'Overview of your application',
      variant = 'default',
      size = 'md',
      className,
      style,
      ...props
    },
    ref
  ) => {
    // Mock data for demonstration
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilters, setSelectedFilters] = useState({});
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    // Mock dashboard data
    const dashboardData = useMemo(
      () => ({
        metrics: [
          {
            id: 'total-users',
            label: 'Total Users',
            value: '12,847',
            change: '+12%',
            changeType: 'positive',
            icon: 'users',
            color: getToken('colors.blue.500'),
          },
          {
            id: 'active-sessions',
            label: 'Active Sessions',
            value: '2,341',
            change: '+8%',
            changeType: 'positive',
            icon: 'activity',
            color: getToken('colors.green.500'),
          },
          {
            id: 'revenue',
            label: 'Revenue',
            value: '$45,231',
            change: '+23%',
            changeType: 'positive',
            icon: 'dollar-sign',
            color: getToken('colors.emerald.500'),
          },
          {
            id: 'conversion-rate',
            label: 'Conversion Rate',
            value: '3.2%',
            change: '-2%',
            changeType: 'negative',
            icon: 'trending-up',
            color: getToken('colors.orange.500'),
          },
        ],
        recentActivity: [
          {
            id: '1',
            type: 'user-registered',
            message: 'New user registered: john.doe@example.com',
            timestamp: '2 minutes ago',
            priority: 'low',
          },
          {
            id: '2',
            type: 'payment-received',
            message: 'Payment received: $299.99 from Jane Smith',
            timestamp: '5 minutes ago',
            priority: 'medium',
          },
          {
            id: '3',
            type: 'system-alert',
            message: 'System maintenance scheduled for tonight',
            timestamp: '1 hour ago',
            priority: 'high',
          },
        ],
        tableData: [
          {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            status: 'active',
            lastLogin: '2024-01-15 10:30',
            role: 'admin',
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            status: 'active',
            lastLogin: '2024-01-15 09:15',
            role: 'user',
          },
          {
            id: '3',
            name: 'Bob Johnson',
            email: 'bob.johnson@example.com',
            status: 'inactive',
            lastLogin: '2024-01-14 16:45',
            role: 'user',
          },
        ],
      }),
      []
    );

    // Mock navigation items
    const navigationItems = useMemo(
      () => [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: 'home',
          href: '/dashboard',
          active: true,
        },
        {
          id: 'users',
          label: 'Users',
          icon: 'users',
          href: '/users',
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: 'bar-chart',
          href: '/analytics',
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: 'settings',
          href: '/settings',
        },
      ],
      []
    );

    // Mock breadcrumb items
    const breadcrumbItems = useMemo(
      () => [
        { id: 'home', label: 'Home', href: '/' },
        {
          id: 'dashboard',
          label: 'Dashboard',
          href: '/dashboard',
          active: true,
        },
      ],
      []
    );

    // Mock filter items
    const filterItems = useMemo(
      () => [
        {
          id: 'status',
          label: 'Status',
          type: 'select',
          options: [
            { value: 'all', label: 'All Statuses' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ],
        },
        {
          id: 'role',
          label: 'Role',
          type: 'select',
          options: [
            { value: 'all', label: 'All Roles' },
            { value: 'admin', label: 'Admin' },
            { value: 'user', label: 'User' },
          ],
        },
        {
          id: 'date-range',
          label: 'Date Range',
          type: 'date-range',
        },
      ],
      []
    );

    // Mock actions
    const actions = useMemo(
      () => [
        {
          id: 'add-user',
          label: 'Add User',
          icon: 'plus',
          variant: 'primary',
        },
        {
          id: 'export-data',
          label: 'Export',
          icon: 'download',
          variant: 'secondary',
        },
        {
          id: 'bulk-edit',
          label: 'Bulk Edit',
          icon: 'edit',
          variant: 'secondary',
          disabled: selectedRows.length === 0,
        },
      ],
      [selectedRows]
    );

    // Mock status items
    const statusItems = useMemo(
      () => [
        {
          id: 'system-status',
          label: 'System Status',
          value: 'Healthy',
          status: 'success',
          icon: 'check-circle',
        },
        {
          id: 'last-backup',
          label: 'Last Backup',
          value: '2 hours ago',
          status: 'info',
          icon: 'database',
        },
        {
          id: 'active-users',
          label: 'Active Users',
          value: '2,341',
          status: 'info',
          icon: 'users',
        },
      ],
      []
    );

    // Mock notifications
    const notifications = useMemo(
      () => [
        {
          id: '1',
          title: 'New user registered',
          message: 'John Doe has joined the platform',
          type: 'info',
          timestamp: '2 minutes ago',
          read: false,
        },
        {
          id: '2',
          title: 'Payment received',
          message: 'Payment of $299.99 received from Jane Smith',
          type: 'success',
          timestamp: '5 minutes ago',
          read: false,
        },
        {
          id: '3',
          title: 'System maintenance',
          message: 'Scheduled maintenance tonight at 2 AM',
          type: 'warning',
          timestamp: '1 hour ago',
          read: true,
        },
      ],
      []
    );

    // Mock user data
    const user = useMemo(
      () => ({
        name: 'Admin User',
        email: 'admin@example.com',
        avatar: 'https://via.placeholder.com/32',
        role: 'Administrator',
      }),
      []
    );

    // Event handlers
    const handleSearch = useCallback((query: string) => {
      setSearchQuery(query);
    }, []);

    const handleFilterChange = useCallback((filters: any) => {
      setSelectedFilters(filters);
    }, []);

    const handleActionClick = useCallback((action: any) => {
      console.log('Action clicked:', action);
    }, []);

    const handleRowSelection = useCallback((selectedIds: string[]) => {
      setSelectedRows(selectedIds);
    }, []);

    const handlePageChange = useCallback((page: number) => {
      setCurrentPage(page);
    }, []);

    const handleBreadcrumbClick = useCallback((item: any) => {
      console.log('Breadcrumb clicked:', item);
    }, []);

    return (
      <DashboardLayout
        ref={ref}
        title={title}
        subtitle={subtitle}
        variant={variant}
        size={size}
        navigationItems={navigationItems}
        user={user}
        notifications={notifications}
        statusItems={statusItems}
        actions={actions}
        breadcrumbItems={breadcrumbItems}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onActionClick={handleActionClick}
        onBreadcrumbClick={handleBreadcrumbClick}
        className={className}
        style={style}
        {...props}
      >
        <StyledDashboard $variant={variant} $size={size}>
          {/* Quick Stats */}
          <StyledQuickStats>
            {dashboardData.metrics.map(metric => (
              <StyledStatCard key={metric.id}>
                <StyledStatIcon $color={metric.color}>
                  <Icon name={metric.icon} size="md" />
                </StyledStatIcon>
                <StyledStatContent>
                  <StyledStatValue>{metric.value}</StyledStatValue>
                  <StyledStatLabel>{metric.label}</StyledStatLabel>
                  <Badge
                    variant={
                      metric.changeType === 'positive'
                        ? 'success'
                        : 'destructive'
                    }
                    size="sm"
                  >
                    {metric.change}
                  </Badge>
                </StyledStatContent>
              </StyledStatCard>
            ))}
          </StyledQuickStats>

          {/* Main Content */}
          <StyledDashboardContent>
            <StyledMainContent>
              {/* Search and Filters */}
              <SearchBar
                variant={variant}
                size={size}
                placeholder="Search users, emails, or roles..."
                onSearch={handleSearch}
                filters={filterItems}
                onFilterChange={handleFilterChange}
              />

              {/* Data Table */}
              <Card variant={variant} size={size}>
                <DataTable
                  variant={variant}
                  size={size}
                  data={dashboardData.tableData}
                  columns={[
                    {
                      key: 'name',
                      label: 'Name',
                      sortable: true,
                    },
                    {
                      key: 'email',
                      label: 'Email',
                      sortable: true,
                    },
                    {
                      key: 'status',
                      label: 'Status',
                      render: value => (
                        <Badge
                          variant={value === 'active' ? 'success' : 'secondary'}
                          size="sm"
                        >
                          {value}
                        </Badge>
                      ),
                    },
                    {
                      key: 'role',
                      label: 'Role',
                      sortable: true,
                    },
                    {
                      key: 'lastLogin',
                      label: 'Last Login',
                      sortable: true,
                    },
                  ]}
                  selectable
                  selectedRows={selectedRows}
                  onRowSelection={handleRowSelection}
                  onSort={(key, direction) =>
                    console.log('Sort:', key, direction)
                  }
                />
              </Card>

              {/* Pagination */}
              <PaginationControls
                variant={variant}
                size={size}
                currentPage={currentPage}
                totalPages={10}
                totalItems={100}
                pageSize={10}
                onPageChange={handlePageChange}
              />
            </StyledMainContent>

            <StyledSidebar>
              {/* Recent Activity */}
              <Card variant={variant} size={size}>
                <Text
                  variant="h3"
                  size="lg"
                  style={{ marginBottom: getToken('spacing.4') }}
                >
                  Recent Activity
                </Text>
                {dashboardData.recentActivity.map(activity => (
                  <div
                    key={activity.id}
                    style={{
                      padding: getToken('spacing.3'),
                      borderBottom: `1px solid ${getToken('colors.border')}`,
                    }}
                  >
                    <Text
                      size="sm"
                      style={{ marginBottom: getToken('spacing.1') }}
                    >
                      {activity.message}
                    </Text>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: getToken('spacing.2'),
                      }}
                    >
                      <Badge
                        variant={
                          activity.priority === 'high'
                            ? 'destructive'
                            : activity.priority === 'medium'
                              ? 'warning'
                              : 'secondary'
                        }
                        size="sm"
                      >
                        {activity.priority}
                      </Badge>
                      <Text size="xs" color="muted">
                        {activity.timestamp}
                      </Text>
                    </div>
                  </div>
                ))}
              </Card>

              {/* Quick Actions */}
              <Card variant={variant} size={size}>
                <Text
                  variant="h3"
                  size="lg"
                  style={{ marginBottom: getToken('spacing.4') }}
                >
                  Quick Actions
                </Text>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: getToken('spacing.2'),
                  }}
                >
                  <Button variant="outline" size="sm" fullWidth>
                    <Icon name="plus" size="sm" />
                    Add User
                  </Button>
                  <Button variant="outline" size="sm" fullWidth>
                    <Icon name="download" size="sm" />
                    Export Data
                  </Button>
                  <Button variant="outline" size="sm" fullWidth>
                    <Icon name="settings" size="sm" />
                    Settings
                  </Button>
                </div>
              </Card>
            </StyledSidebar>
          </StyledDashboardContent>
        </StyledDashboard>
      </DashboardLayout>
    );
  }
);

Dashboard.displayName = 'Dashboard';

export { Dashboard };
