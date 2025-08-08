import React, { useState, useEffect } from 'react';
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
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { Input } from '@/design-system/components/Input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/design-system/components/Table';
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/design-system/components/Select';
import { Checkbox } from '@/design-system/components/Checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Textarea } from '@/design-system/components/Textarea';
import AdminApiService, { UserWithRoles } from '@/services/adminApi';
import { toast } from 'sonner';

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

const UserManagement: React.FC<UserManagementProps> = ({ onUserUpdated }) => {
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

  // Load users
  const loadUsers = async () => {
    try {
      setLoading(true);
      const userList = await AdminApiService.listUsers(0, 100);
      setUsers(userList);
      setFilteredUsers(userList);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(user => user.is_active);
      } else if (statusFilter === 'inactive') {
        filtered = filtered.filter(user => !user.is_active);
      } else if (statusFilter === 'verified') {
        filtered = filtered.filter(user => user.is_verified);
      } else if (statusFilter === 'unverified') {
        filtered = filtered.filter(user => !user.is_verified);
      }
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.roles.includes(roleFilter));
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, statusFilter, roleFilter]);

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
  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'verify' | 'send_reminder') => {
    if (selectedUsers.length === 0) {
      toast.error('No users selected');
      return;
    }

    try {
      const result = await AdminApiService.bulkUserAction(selectedUsers, action);
      toast.success(result.message);
      setSelectedUsers([]);
      await loadUsers();
      onUserUpdated?.();
    } catch (error) {
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
      await AdminApiService.updateUser(editingUser.id, editUserData);
      toast.success('User updated successfully');
      setShowEditDialog(false);
      setEditingUser(null);
      await loadUsers();
      onUserUpdated?.();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await AdminApiService.deleteUser(userToDelete.id);
      toast.success('User deactivated successfully');
      setShowDeleteDialog(false);
      setUserToDelete(null);
      await loadUsers();
      onUserUpdated?.();
    } catch (error) {
      toast.error('Failed to deactivate user');
    }
  };

  // Role management
  const handleAssignRole = async (userId: number, role: string) => {
    try {
      await AdminApiService.assignRole(userId, role);
      toast.success(`Role ${role} assigned successfully`);
      await loadUsers();
    } catch (error) {
      toast.error(`Failed to assign role ${role}`);
    }
  };

  const handleRemoveRole = async (userId: number, role: string) => {
    try {
      await AdminApiService.removeRole(userId, role);
      toast.success(`Role ${role} removed successfully`);
      await loadUsers();
    } catch (error) {
      toast.error(`Failed to remove role ${role}`);
    }
  };

  // Export users
  const handleExportUsers = () => {
    const csvContent = [
      ['Username', 'Email', 'First Name', 'Last Name', 'Status', 'Verified', 'Roles', 'Created At'],
      ...filteredUsers.map(user => [
        user.username,
        user.email,
        user.first_name,
        user.last_name,
        user.is_active ? 'Active' : 'Inactive',
        user.is_verified ? 'Verified' : 'Unverified',
        user.roles.join('; '),
        new Date(user.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

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

  // Load users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">Manage user accounts, roles, and permissions</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={handleExportUsers}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Filters and search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {uniqueRoles.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk actions */}
      {selectedUsers.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {selectedUsers.length} user(s) selected
              </span>
              <div className="flex items-center space-x-2">
                <Button 
                  size="sm" 
                  onClick={() => handleBulkAction('activate')}
                >
                  <UserCheck className="h-4 w-4 mr-1" />
                  Activate
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleBulkAction('deactivate')}
                >
                  <UserX className="h-4 w-4 mr-1" />
                  Deactivate
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleBulkAction('verify')}
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Verify
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">Loading users...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={(checked) => handleUserSelection(user.id, checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium">
                            {user.first_name?.[0]?.toUpperCase() || user.username[0]?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{user.username}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.first_name} {user.last_name}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{user.email}</div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(user)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map(role => (
                          <Badge key={role} variant="outline" className="text-xs">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {user.last_login_at ? 
                        new Date(user.last_login_at).toLocaleDateString() : 
                        'Never'
                      }
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(user.created_at).toLocaleDateString()}
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
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
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
                  onChange={(e) => setEditUserData(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editUserData.email}
                  onChange={(e) => setEditUserData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={editUserData.first_name}
                  onChange={(e) => setEditUserData(prev => ({ ...prev, first_name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={editUserData.last_name}
                  onChange={(e) => setEditUserData(prev => ({ ...prev, last_name: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={editUserData.is_active}
                onCheckedChange={(checked) => setEditUserData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate User</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate {userToDelete?.username}? This will disable their access to the application.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;