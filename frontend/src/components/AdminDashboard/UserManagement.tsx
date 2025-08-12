import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Edit,
  Trash2,
  Shield,
  Mail,
  Search,
  Filter,
  MoreHorizontal,
  UserCheck,
  UserX,
  Eye,
  Download,
  Calendar,
  Clock,
  Activity,
  // TrendingUp,
  AlertCircle,
  CheckCircle,
  X,
  // Plus,
  // BarChart3,
  // Globe,
  // MapPin,
  // Smartphone,
  Bell,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { Input } from '@/design-system/components/Input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/design-system/components/Table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/design-system/components/Select';
import { Checkbox } from '@/design-system/components/Checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from '@/design-system/components/Dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/design-system/components/DropdownMenu';
import { Label } from '@/design-system/components/Label';
// import { Textarea } from '@/design-system/components/Textarea';
import * as AdminApi from '@/services/admin';
import type { UserWithRoles } from '@/services/admin';
import { toast } from 'sonner';
import { tokens } from '@/design-system/tokens';
import { applyTypographyStyle } from '@/design-system/stories/components';

interface UserManagementProps {
  onUserUpdated?: () => void;
}

interface EditUserData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
}

const UserManagement: React.FC<UserManagementProps> = memo(({ onUserUpdated }) => {

  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithRoles[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editingUser, setEditingUser] = useState<UserWithRoles | null>(null);
  const [editUserData, setEditUserData] = useState<EditUserData>({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    is_active: true,
  });
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserWithRoles | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newUserData, setNewUserData] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    role: 'viewer' as 'admin' | 'analyst' | 'viewer' | 'editor',
  });
  const [creating, setCreating] = useState(false);

  const [showRolesDialog, setShowRolesDialog] = useState(false);
  const [roleUser, setRoleUser] = useState<UserWithRoles | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const [page, setPage] = useState(0);
  const rowsPerPage = 20;
  const [total, setTotal] = useState(0);

  // Memoized computed values
  const paginatedUsers = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredUsers.slice(start, end);
  }, [filteredUsers, page, rowsPerPage]);

  const totalPages = useMemo(() => Math.ceil(total / rowsPerPage), [total, rowsPerPage]);
  const hasSelectedUsers = useMemo(() => selectedUsers.length > 0, [selectedUsers.length]);

  // Load users
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {
        search: searchTerm || undefined,
        is_active:
          statusFilter === 'active'
            ? true
            : statusFilter === 'inactive'
              ? false
              : undefined,
        is_verified:
          statusFilter === 'verified'
            ? true
            : statusFilter === 'unverified'
              ? false
              : undefined,
        is_admin: roleFilter === 'admin' ? true : undefined,
      };

      const resp = await AdminApi.listUsers(
        page * rowsPerPage,
        rowsPerPage,
        true,
        params
      );

      const env = resp as any;
      let list = (env?.items as UserWithRoles[]) || (resp as UserWithRoles[]);
      if (roleFilter !== 'all' && roleFilter !== 'admin') {
        list = list.filter(user => user.roles.includes(roleFilter));
      }
      setUsers(list);
      setFilteredUsers(list);
      setTotal(env?.pagination?.total ?? list.length);
    } catch (_error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, statusFilter, roleFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Handle user selection
  const handleUserSelection = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  // Bulk actions
  const handleBulkAction = async (
    action: 'activate' | 'deactivate' | 'verify' | 'send_reminder'
  ) => {
    if (selectedUsers.length === 0) {
      toast.error('No users selected');
      return;
    }

    try {
      const result = await AdminApi.bulkUserAction(
        selectedUsers,
        action
      );
      toast.success(result.message);
      setSelectedUsers([]);
      await loadUsers();
      onUserUpdated?.();
    } catch (_error) {
      toast.error(`Failed to ${action} users`);
    }
  };

  // Edit user
  const handleEditUser = (user: UserWithRoles) => {
    setEditingUser(user);
    setEditUserData({
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      is_active: user.is_active,
    });
    setShowEditDialog(true);
  };

  // Save user changes
  const handleSaveUser = async () => {
    if (!editingUser) return;

    try {
      await AdminApi.updateUser(editingUser.id, editUserData);
      toast.success('User updated successfully');
      setShowEditDialog(false);
      setEditingUser(null);
      await loadUsers();
      onUserUpdated?.();
    } catch (_error) {
      toast.error('Failed to update user');
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await AdminApi.deleteUser(userToDelete.id);
      toast.success('User deactivated successfully');
      setShowDeleteDialog(false);
      setUserToDelete(null);
      await loadUsers();
      onUserUpdated?.();
    } catch (_error) {
      toast.error('Failed to deactivate user');
    }
  };

  // Create user
  const handleCreateUser = async () => {
    try {
      setCreating(true);
      await AdminApi.createUser(newUserData);
      toast.success('User created successfully');
      setShowAddDialog(false);
      setNewUserData({
        email: '',
        username: '',
        first_name: '',
        last_name: '',
        password: '',
        role: 'viewer',
      });
      await loadUsers();
      onUserUpdated?.();
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  // Role management

  // Manage roles dialog
  const openRolesDialog = (user: UserWithRoles) => {
    setRoleUser(user);
    setSelectedRoles(user.roles);
    setShowRolesDialog(true);
  };

  const toggleRoleSelection = (role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const saveRoles = async () => {
    if (!roleUser) return;
    const roles = ['admin', 'analyst', 'viewer', 'editor'];
    const toAssign = roles.filter(
      r => selectedRoles.includes(r) && !roleUser.roles.includes(r)
    );
    const toRemove = roles.filter(
      r => !selectedRoles.includes(r) && roleUser.roles.includes(r)
    );

    try {
      await Promise.all([
        ...toAssign.map(r => AdminApi.assignRole(roleUser.id, r)),
        ...toRemove.map(r => AdminApi.removeRole(roleUser.id, r)),
      ]);
      toast.success('Roles updated');
      setShowRolesDialog(false);
      setRoleUser(null);
      await loadUsers();
    } catch (_error) {
      toast.error('Failed to update roles');
    }
  };

  // Export users
  const handleExportUsers = () => {
    const csvContent = [
      [
        'Username',
        'Email',
        'First Name',
        'Last Name',
        'Status',
        'Verified',
        'Roles',
        'Created At',
      ],
      ...filteredUsers.map(user => [
        user.username,
        user.email,
        user.first_name,
        user.last_name,
        user.is_active ? 'Active' : 'Inactive',
        user.is_verified ? 'Verified' : 'Unverified',
        user.roles.join('; '),
        new Date(user.created_at).toLocaleDateString(),
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get status badge
  const getStatusBadge = (user: UserWithRoles) => {
    if (!user.is_active) return <Badge variant="destructive">Inactive</Badge>;
    if (!user.is_verified) return <Badge variant="secondary">Unverified</Badge>;
    return <Badge variant="default">Active</Badge>;
  };

  // Get unique roles for filter
  const uniqueRoles = Array.from(new Set(users.flatMap(user => user.roles)));

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={handleExportUsers}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button size="sm" onClick={() => setShowAddDialog(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* User Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2 text-blue-500" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {total}
            </div>
            <div className="flex items-center mt-2">
              <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full"
                  style={{
                    width: `${total > 0
                      ? (users.filter(u => u.is_active).length /
                        total) *
                      100
                      : 0
                      }%`,
                  }}
                ></div>
              </div>
              <span className="text-xs text-muted-foreground ml-2">
                {total > 0
                  ? Math.round(
                    (users.filter(u => u.is_active).length / total) * 100
                  )
                  : 0}
                % active
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.is_active).length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {users.filter(u => u.is_active && u.is_verified).length} verified
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Mail className="h-4 w-4 mr-2 text-purple-500" />
              Verification Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {users.filter(u => u.is_verified).length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {users.filter(u => !u.is_verified).length} pending verification
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Shield className="h-4 w-4 mr-2 text-orange-500" />
              User Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {uniqueRoles.length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {users.filter(u => u.roles.length > 0).length} users with roles
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Search & Filter Users
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or username..."
                  value={searchTerm}
                  onChange={e => {
                    setSearchTerm(e.target.value);
                    setPage(0);
                  }}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={v => {
                setStatusFilter(v);
                setPage(0);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Active
                  </div>
                </SelectItem>
                <SelectItem value="inactive">
                  <div className="flex items-center">
                    <X className="h-4 w-4 mr-2 text-red-500" />
                    Inactive
                  </div>
                </SelectItem>
                <SelectItem value="verified">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-blue-500" />
                    Verified
                  </div>
                </SelectItem>
                <SelectItem value="unverified">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
                    Unverified
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Role Filter */}
            <Select
              value={roleFilter}
              onValueChange={v => {
                setRoleFilter(v);
                setPage(0);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {uniqueRoles.map(role => (
                  <SelectItem key={role} value={role}>
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-orange-500" />
                      {role}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filter Summary */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>
                Showing {page * rowsPerPage + 1}-{Math.min(
                  (page + 1) * rowsPerPage,
                  total
                )} of {total} users
              </span>
              {(searchTerm ||
                statusFilter !== 'all' ||
                roleFilter !== 'all') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setRoleFilter('all');
                      setPage(0);
                    }}
                    className="h-auto p-1 text-xs"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear filters
                  </Button>
                )}
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                <Activity className="h-3 w-3 mr-1" />
                {users.filter(u => u.is_active).length} active
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Mail className="h-3 w-3 mr-1" />
                {users.filter(u => u.is_verified).length} verified
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Bulk Actions */}
      {selectedUsers.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="font-medium text-primary">
                    {selectedUsers.length} user
                    {selectedUsers.length > 1 ? 's' : ''} selected
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedUsers([])}
                  className="h-auto p-1"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => handleBulkAction('activate')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <UserCheck className="h-4 w-4 mr-1" />
                  Activate (
                  {
                    selectedUsers.filter(
                      id => !users.find(u => u.id === id)?.is_active
                    ).length
                  }
                  )
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('deactivate')}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <UserX className="h-4 w-4 mr-1" />
                  Deactivate (
                  {
                    selectedUsers.filter(
                      id => users.find(u => u.id === id)?.is_active
                    ).length
                  }
                  )
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('verify')}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Verify (
                  {
                    selectedUsers.filter(
                      id => !users.find(u => u.id === id)?.is_verified
                    ).length
                  }
                  )
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('send_reminder')}
                  className="border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  <Bell className="h-4 w-4 mr-1" />
                  Send Reminder
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              User Directory
              <Badge variant="secondary" className="ml-2">
                {total} users
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Page {page + 1} of {Math.max(1, Math.ceil(total / rowsPerPage))}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No users found</p>
              <p className="text-sm">
                Try adjusting your search filters or add new users.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedUsers.length === filteredUsers.length &&
                        filteredUsers.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="font-semibold">
                    User Information
                  </TableHead>
                  <TableHead className="font-semibold">Contact</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">
                    Roles & Permissions
                  </TableHead>
                  <TableHead className="font-semibold">Activity</TableHead>
                  <TableHead className="w-12 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map(user => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={checked =>
                          handleUserSelection(user.id, checked === true)
                        }
                      />
                    </TableCell>

                    {/* User Information */}
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${user.is_active
                            ? 'bg-primary/10 text-primary'
                            : 'bg-gray-100 text-gray-500'
                            }`}
                        >
                          <span className="text-sm font-medium">
                            {user.first_name?.[0]?.toUpperCase() ||
                              user.username[0]?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium flex items-center">
                            {user.username}
                            {user.is_verified && (
                              <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.first_name && user.last_name
                              ? `${user.first_name} ${user.last_name}`
                              : 'No name provided'}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            Joined{' '}
                            {new Date(user.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Contact Information */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                          <span className="truncate max-w-[200px]">
                            {user.email}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Email {user.is_verified ? 'verified' : 'not verified'}
                        </div>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <div className="space-y-1">
                        {getStatusBadge(user)}
                        <div className="text-xs text-muted-foreground">
                          {user.is_active ? (
                            <span className="flex items-center text-green-600">
                              <Activity className="h-3 w-3 mr-1" />
                              Active account
                            </span>
                          ) : (
                            <span className="flex items-center text-red-600">
                              <X className="h-3 w-3 mr-1" />
                              Inactive account
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Roles & Permissions */}
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {user.roles.length > 0 ? (
                            user.roles.map(role => (
                              <Badge
                                key={role}
                                variant="outline"
                                className="text-xs"
                              >
                                <Shield className="h-3 w-3 mr-1" />
                                {role}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              No roles assigned
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {user.roles.length} role
                          {user.roles.length !== 1 ? 's' : ''} assigned
                        </div>
                      </div>
                    </TableCell>

                    {/* Activity */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Clock className="h-3 w-3 mr-2 text-muted-foreground" />
                          {user.last_login ? (
                            <span>
                              {new Date(user.last_login).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">
                              Never logged in
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Last login
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openRolesDialog(user)}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Manage Roles
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Activity
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setUserToDelete(user);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          Showing {page * rowsPerPage + 1} to {Math.min(
            (page + 1) * rowsPerPage,
            total
          )} of {total} users
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 0 || loading}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {page + 1} of {Math.max(1, Math.ceil(total / rowsPerPage))}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={(page + 1) * rowsPerPage >= total || loading}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to the user account information.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={editUserData.username}
                  onChange={e =>
                    setEditUserData(prev => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editUserData.email}
                  onChange={e =>
                    setEditUserData(prev => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={editUserData.first_name}
                  onChange={e =>
                    setEditUserData(prev => ({
                      ...prev,
                      first_name: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={editUserData.last_name}
                  onChange={e =>
                    setEditUserData(prev => ({
                      ...prev,
                      last_name: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={editUserData.is_active}
                onCheckedChange={checked =>
                  setEditUserData(prev => ({ ...prev, is_active: checked === true }))
                }
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate User</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate {userToDelete?.username}? This
              will disable their access to the application.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>Create a new user account</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="add-username">Username</Label>
                <Input
                  id="add-username"
                  value={newUserData.username}
                  onChange={e =>
                    setNewUserData(prev => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="add-email">Email</Label>
                <Input
                  id="add-email"
                  type="email"
                  value={newUserData.email}
                  onChange={e =>
                    setNewUserData(prev => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="add-first">First Name</Label>
                <Input
                  id="add-first"
                  value={newUserData.first_name}
                  onChange={e =>
                    setNewUserData(prev => ({
                      ...prev,
                      first_name: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="add-last">Last Name</Label>
                <Input
                  id="add-last"
                  value={newUserData.last_name}
                  onChange={e =>
                    setNewUserData(prev => ({
                      ...prev,
                      last_name: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="add-pass">Password</Label>
              <Input
                id="add-pass"
                type="password"
                value={newUserData.password}
                onChange={e =>
                  setNewUserData(prev => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label>Role</Label>
              <Select
                value={newUserData.role}
                onValueChange={v =>
                  setNewUserData(prev => ({ ...prev, role: v as any }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {['admin', 'analyst', 'viewer', 'editor'].map(r => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser} disabled={creating}>
              {creating ? 'Creating...' : 'Create User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Roles Dialog */}
      <Dialog open={showRolesDialog} onOpenChange={setShowRolesDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Roles</DialogTitle>
            <DialogDescription>
              Assign or remove roles for {roleUser?.username}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {['admin', 'analyst', 'viewer', 'editor'].map(role => (
              <div key={role} className="flex items-center space-x-2">
                <Checkbox
                  id={`role-${role}`}
                  checked={selectedRoles.includes(role)}
                  onCheckedChange={() => toggleRoleSelection(role)}
                />
                <Label htmlFor={`role-${role}`} className="capitalize">
                  {role}
                </Label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRolesDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveRoles}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});

UserManagement.displayName = 'UserManagement';

export default UserManagement;
