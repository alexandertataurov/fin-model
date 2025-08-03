import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserPlus, Users, Wifi, WifiOff } from 'lucide-react';
import {
  Collaborator,
  CollaborationPermission,
} from '@/types/template-builder';

interface CollaborationBarProps {
  templateId: string;
  collaborators: Collaborator[];
  isConnected: boolean;
  onInviteCollaborator: () => void;
}

export const CollaborationBar: React.FC<CollaborationBarProps> = ({
  _templateId,
  collaborators,
  isConnected,
  onInviteCollaborator,
}) => {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePermission, setInvitePermission] =
    useState<CollaborationPermission>(CollaborationPermission.EDIT);
  const [isInviting, setIsInviting] = useState(false);

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;

    setIsInviting(true);
    try {
      // In a real implementation, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      // Reset form
      setInviteEmail('');
      setInvitePermission(CollaborationPermission.EDIT);
      setIsInviteDialogOpen(false);

      onInviteCollaborator();
    } catch (error) {
      console.error('Failed to invite collaborator:', error);
    } finally {
      setIsInviting(false);
    }
  };

  const activeCollaborators = collaborators.filter(c => c.isActive);
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 border-b">
      <div className="flex items-center space-x-3">
        {/* Connection status */}
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <Wifi className="h-4 w-4 text-green-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-500" />
          )}
          <span className="text-sm text-gray-600">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {/* Active collaborators count */}
        {activeCollaborators.length > 0 && (
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {activeCollaborators.length} active
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-3">
        {/* Collaborator avatars */}
        <div className="flex -space-x-2">
          {activeCollaborators.slice(0, 5).map(collaborator => (
            <Avatar
              key={collaborator.id}
              className="w-8 h-8 border-2 border-white"
            >
              <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
              <AvatarFallback className="text-xs">
                {collaborator.initials || getInitials(collaborator.name)}
              </AvatarFallback>
            </Avatar>
          ))}
          {activeCollaborators.length > 5 && (
            <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
              <span className="text-xs text-gray-600">
                +{activeCollaborators.length - 5}
              </span>
            </div>
          )}
        </div>

        {/* Invite button */}
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Collaborator</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="invite-email">Email Address</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="invite-permission">Permission Level</Label>
                <Select
                  value={invitePermission}
                  onValueChange={value =>
                    setInvitePermission(value as CollaborationPermission)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CollaborationPermission.VIEW}>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">View</Badge>
                        <span>Can view the report template</span>
                      </div>
                    </SelectItem>
                    <SelectItem value={CollaborationPermission.EDIT}>
                      <div className="flex items-center space-x-2">
                        <Badge variant="default">Edit</Badge>
                        <span>Can view and edit the report template</span>
                      </div>
                    </SelectItem>
                    <SelectItem value={CollaborationPermission.ADMIN}>
                      <div className="flex items-center space-x-2">
                        <Badge variant="destructive">Admin</Badge>
                        <span>Full access including sharing settings</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsInviteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleInvite}
                  disabled={!inviteEmail.trim() || isInviting}
                >
                  {isInviting ? 'Inviting...' : 'Send Invitation'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CollaborationBar;
