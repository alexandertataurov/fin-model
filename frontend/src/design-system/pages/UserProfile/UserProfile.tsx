import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { getToken } from '../../tokens';
import { DetailLayout } from '../../templates/DetailLayout';
import { Form } from '../../organisms/Form';
import { Card } from '../../molecules/Card';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';
import { Text } from '../../atoms/Text';
import { Avatar } from '../../atoms/Avatar';
import { UserProfileProps, UserProfileRef } from './UserProfile.types';

const StyledUserProfile = styled.div<{ $variant: string; $size: string }>`
  width: 100%;
  height: 100%;
`;

const StyledProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.6')};
  margin-bottom: ${getToken('spacing.8')};
  padding: ${getToken('spacing.6')};
  background-color: ${getToken('colors.background')};
  border: ${getToken('borderWidth.sm')} solid ${getToken('colors.border')};
  border-radius: ${getToken('borderRadius.lg')};
`;

const StyledProfileAvatar = styled.div`
  position: relative;
`;

const StyledProfileInfo = styled.div`
  flex: 1;
`;

const StyledProfileName = styled.div`
  font-size: ${getToken('typography.fontSize.2xl')};
  font-weight: ${getToken('typography.fontWeight.bold')};
  color: ${getToken('colors.foreground')};
  margin-bottom: ${getToken('spacing.2')};
`;

const StyledProfileEmail = styled.div`
  font-size: ${getToken('typography.fontSize.base')};
  color: ${getToken('colors.muted.foreground')};
  margin-bottom: ${getToken('spacing.3')};
`;

const StyledProfileMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.4')};
`;

const StyledProfileActions = styled.div`
  display: flex;
  gap: ${getToken('spacing.3')};
`;

const StyledProfileContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${getToken('spacing.6')};
`;

const StyledMainSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${getToken('spacing.6')};
`;

const StyledSideSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${getToken('spacing.4')};
`;

const StyledStatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.2')};
`;

const StyledActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.3')};
  padding: ${getToken('spacing.3')};
  border-bottom: ${getToken('borderWidth.sm')} solid
    ${getToken('colors.border')};

  &:last-child {
    border-bottom: none;
  }
`;

const StyledActivityIcon = styled.div<{ $color: string }>`
  width: ${getToken('spacing.8')};
  height: ${getToken('spacing.8')};
  border-radius: ${getToken('borderRadius.full')};
  background-color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const UserProfile = React.forwardRef<UserProfileRef, UserProfileProps>(
  (
    {
      userId = '1',
      title = 'User Profile',
      subtitle = 'Manage user information and settings',
      variant = 'default',
      size = 'md',
      className,
      style,
      ...props
    },
    ref
  ) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      role: 'admin',
      department: 'Engineering',
      location: 'San Francisco, CA',
      bio: 'Senior software engineer with 8+ years of experience in full-stack development.',
    });

    // Mock user data
    const userData = useMemo(
      () => ({
        id: userId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        avatar: 'https://via.placeholder.com/120',
        role: 'Administrator',
        department: 'Engineering',
        location: 'San Francisco, CA',
        status: 'active',
        joinDate: '2023-01-15',
        lastLogin: '2024-01-15 10:30',
        bio: 'Senior software engineer with 8+ years of experience in full-stack development.',
        skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
        recentActivity: [
          {
            id: '1',
            type: 'login',
            message: 'Logged in from San Francisco',
            timestamp: '2 hours ago',
            icon: 'log-in',
            color: getToken('colors.blue.500'),
          },
          {
            id: '2',
            type: 'profile-update',
            message: 'Updated profile information',
            timestamp: '1 day ago',
            icon: 'edit',
            color: getToken('colors.green.500'),
          },
          {
            id: '3',
            type: 'password-change',
            message: 'Changed password',
            timestamp: '3 days ago',
            icon: 'lock',
            color: getToken('colors.orange.500'),
          },
        ],
      }),
      [userId]
    );

    // Form fields configuration
    const formFields = useMemo(
      () => [
        {
          name: 'firstName',
          label: 'First Name',
          type: 'text',
          required: true,
          placeholder: 'Enter first name',
        },
        {
          name: 'lastName',
          label: 'Last Name',
          type: 'text',
          required: true,
          placeholder: 'Enter last name',
        },
        {
          name: 'email',
          label: 'Email Address',
          type: 'email',
          required: true,
          placeholder: 'Enter email address',
        },
        {
          name: 'phone',
          label: 'Phone Number',
          type: 'tel',
          placeholder: 'Enter phone number',
        },
        {
          name: 'role',
          label: 'Role',
          type: 'select',
          required: true,
          options: [
            { value: 'admin', label: 'Administrator' },
            { value: 'manager', label: 'Manager' },
            { value: 'user', label: 'User' },
          ],
        },
        {
          name: 'department',
          label: 'Department',
          type: 'select',
          options: [
            { value: 'engineering', label: 'Engineering' },
            { value: 'marketing', label: 'Marketing' },
            { value: 'sales', label: 'Sales' },
            { value: 'hr', label: 'Human Resources' },
          ],
        },
        {
          name: 'location',
          label: 'Location',
          type: 'text',
          placeholder: 'Enter location',
        },
        {
          name: 'bio',
          label: 'Bio',
          type: 'textarea',
          placeholder: 'Tell us about yourself',
          rows: 4,
        },
      ],
      []
    );

    // Mock breadcrumb items
    const breadcrumbItems = useMemo(
      () => [
        { id: 'home', label: 'Home', href: '/' },
        { id: 'users', label: 'Users', href: '/users' },
        {
          id: 'profile',
          label: `${userData.firstName} ${userData.lastName}`,
          href: `/users/${userId}`,
          active: true,
        },
      ],
      [userData.firstName, userData.lastName, userId]
    );

    // Mock actions
    const actions = useMemo(
      () => [
        {
          id: 'edit',
          label: isEditing ? 'Save Changes' : 'Edit Profile',
          icon: isEditing ? 'save' : 'edit',
          variant: 'primary',
          onClick: () => setIsEditing(!isEditing),
        },
        {
          id: 'reset-password',
          label: 'Reset Password',
          icon: 'lock',
          variant: 'secondary',
        },
        {
          id: 'deactivate',
          label: 'Deactivate User',
          icon: 'user-x',
          variant: 'destructive',
        },
      ],
      [isEditing]
    );

    // Event handlers
    const handleFormSubmit = useCallback((data: any) => {
      setFormData(data);
      setIsEditing(false);
      console.log('Form submitted:', data);
    }, []);

    const handleFormReset = useCallback(() => {
      setIsEditing(false);
      console.log('Form reset');
    }, []);

    const handleActionClick = useCallback((action: any) => {
      console.log('Action clicked:', action);
    }, []);

    const handleBreadcrumbClick = useCallback((item: any) => {
      console.log('Breadcrumb clicked:', item);
    }, []);

    return (
      <DetailLayout
        ref={ref}
        title={title}
        subtitle={subtitle}
        variant={variant}
        size={size}
        breadcrumbItems={breadcrumbItems}
        actions={actions}
        onActionClick={handleActionClick}
        onBreadcrumbClick={handleBreadcrumbClick}
        className={className}
        style={style}
        {...props}
      >
        <StyledUserProfile $variant={variant} $size={size}>
          {/* Profile Header */}
          <StyledProfileHeader>
            <StyledProfileAvatar>
              <Avatar
                src={userData.avatar}
                alt={`${userData.firstName} ${userData.lastName}`}
                size="xl"
              />
            </StyledProfileAvatar>

            <StyledProfileInfo>
              <StyledProfileName>
                {userData.firstName} {userData.lastName}
              </StyledProfileName>
              <StyledProfileEmail>{userData.email}</StyledProfileEmail>
              <StyledProfileMeta>
                <StyledStatusBadge>
                  <Badge
                    variant={
                      userData.status === 'active' ? 'success' : 'secondary'
                    }
                    size="sm"
                  >
                    {userData.status}
                  </Badge>
                </StyledStatusBadge>
                <Text size="sm" color="muted">
                  Member since{' '}
                  {new Date(userData.joinDate).toLocaleDateString()}
                </Text>
                <Text size="sm" color="muted">
                  Last login: {userData.lastLogin}
                </Text>
              </StyledProfileMeta>
            </StyledProfileInfo>

            <StyledProfileActions>
              <Button
                variant={isEditing ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Icon name={isEditing ? 'save' : 'edit'} size="sm" />
                {isEditing ? 'Save' : 'Edit'}
              </Button>
              <Button variant="outline" size="sm">
                <Icon name="mail" size="sm" />
                Message
              </Button>
            </StyledProfileActions>
          </StyledProfileHeader>

          {/* Profile Content */}
          <StyledProfileContent>
            <StyledMainSection>
              {/* Personal Information */}
              <Card variant={variant} size={size}>
                <Text
                  variant="h3"
                  size="lg"
                  style={{ marginBottom: getToken('spacing.4') }}
                >
                  Personal Information
                </Text>
                <Form
                  variant={variant}
                  size={size}
                  fields={formFields}
                  data={formData}
                  onSubmit={handleFormSubmit}
                  onReset={handleFormReset}
                  disabled={!isEditing}
                  layout="vertical"
                  showActions={isEditing}
                  submitLabel="Save Changes"
                  resetLabel="Cancel"
                />
              </Card>

              {/* Skills */}
              <Card variant={variant} size={size}>
                <Text
                  variant="h3"
                  size="lg"
                  style={{ marginBottom: getToken('spacing.4') }}
                >
                  Skills
                </Text>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: getToken('spacing.2'),
                  }}
                >
                  {userData.skills.map(skill => (
                    <Badge key={skill} variant="secondary" size="sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>
            </StyledMainSection>

            <StyledSideSection>
              {/* Recent Activity */}
              <Card variant={variant} size={size}>
                <Text
                  variant="h3"
                  size="lg"
                  style={{ marginBottom: getToken('spacing.4') }}
                >
                  Recent Activity
                </Text>
                {userData.recentActivity.map(activity => (
                  <StyledActivityItem key={activity.id}>
                    <StyledActivityIcon $color={activity.color}>
                      <Icon name={activity.icon} size="sm" />
                    </StyledActivityIcon>
                    <div style={{ flex: 1 }}>
                      <Text
                        size="sm"
                        style={{ marginBottom: getToken('spacing.1') }}
                      >
                        {activity.message}
                      </Text>
                      <Text size="xs" color="muted">
                        {activity.timestamp}
                      </Text>
                    </div>
                  </StyledActivityItem>
                ))}
              </Card>

              {/* Quick Stats */}
              <Card variant={variant} size={size}>
                <Text
                  variant="h3"
                  size="lg"
                  style={{ marginBottom: getToken('spacing.4') }}
                >
                  Quick Stats
                </Text>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: getToken('spacing.3'),
                  }}
                >
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Text size="sm">Projects</Text>
                    <Text size="sm" weight="medium">
                      12
                    </Text>
                  </div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Text size="sm">Tasks Completed</Text>
                    <Text size="sm" weight="medium">
                      156
                    </Text>
                  </div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Text size="sm">Hours Logged</Text>
                    <Text size="sm" weight="medium">
                      1,247
                    </Text>
                  </div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Text size="sm">Team Members</Text>
                    <Text size="sm" weight="medium">
                      8
                    </Text>
                  </div>
                </div>
              </Card>
            </StyledSideSection>
          </StyledProfileContent>
        </StyledUserProfile>
      </DetailLayout>
    );
  }
);

UserProfile.displayName = 'UserProfile';

export { UserProfile };
