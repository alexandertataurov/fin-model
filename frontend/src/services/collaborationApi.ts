import { apiClient } from './api';

export interface Collaborator {
  id: number;
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  role: 'owner' | 'editor' | 'viewer' | 'commentor';
  permissions: {
    can_edit: boolean;
    can_comment: boolean;
    can_view_history: boolean;
    can_invite_others: boolean;
    can_manage_permissions: boolean;
  };
  joined_at: string;
  last_active: string;
  is_online: boolean;
  cursor_position?: {
    line: number;
    column: number;
    selection_start?: number;
    selection_end?: number;
  };
  current_section?: string;
}

export interface CollaborationInvitation {
  id: number;
  template_id: number;
  inviter_id: number;
  inviter_name: string;
  invited_email: string;
  invited_user_id?: number;
  role: 'editor' | 'viewer' | 'commentor';
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expires_at: string;
  created_at: string;
  accepted_at?: string;
  token: string;
}

export interface CollaborationSession {
  id: string;
  template_id: number;
  user_id: number;
  username: string;
  started_at: string;
  last_activity: string;
  is_active: boolean;
  client_info: {
    browser: string;
    os: string;
    ip_address: string;
  };
  current_document?: string;
  cursor_position?: {
    line: number;
    column: number;
  };
}

export interface EditHistoryEntry {
  id: number;
  template_id: number;
  user_id: number;
  username: string;
  operation: 'create' | 'update' | 'delete' | 'move' | 'comment';
  section: string;
  details: {
    before?: any;
    after?: any;
    description: string;
  };
  timestamp: string;
  is_system_generated: boolean;
}

export interface CollaborativeEdit {
  id: string;
  template_id: number;
  user_id: number;
  operation: 'insert' | 'delete' | 'replace' | 'format';
  position: {
    start: number;
    end: number;
    line?: number;
    column?: number;
  };
  content: string;
  timestamp: string;
  applied: boolean;
  conflicts?: string[];
}

export interface AIInsight {
  id: number;
  template_id: number;
  type: 'suggestion' | 'error_detection' | 'optimization' | 'best_practice' | 'data_anomaly';
  title: string;
  description: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  section: string;
  suggested_changes?: Array<{
    field: string;
    current_value: any;
    suggested_value: any;
    reason: string;
  }>;
  context: {
    related_parameters?: string[];
    affected_calculations?: string[];
    historical_data?: any;
  };
  status: 'pending' | 'applied' | 'dismissed' | 'reviewing';
  created_at: string;
  created_by: 'system' | number;
  applied_by?: number;
  applied_at?: string;
}

export interface SmartRecommendation {
  id: string;
  template_id: number;
  type: 'parameter_optimization' | 'model_improvement' | 'data_validation' | 'performance_enhancement';
  title: string;
  description: string;
  impact_score: number;
  implementation_effort: 'low' | 'medium' | 'high';
  category: string;
  recommendations: Array<{
    action: string;
    description: string;
    expected_benefit: string;
    implementation_steps: string[];
  }>;
  supporting_data: {
    metrics: Record<string, number>;
    comparisons: Array<{
      scenario: string;
      current_value: number;
      recommended_value: number;
      improvement: number;
    }>;
  };
  created_at: string;
  expires_at?: string;
}

export interface CollaborationComment {
  id: number;
  template_id: number;
  user_id: number;
  username: string;
  avatar_url?: string;
  section: string;
  position?: {
    line: number;
    column: number;
  };
  content: string;
  parent_comment_id?: number;
  replies: CollaborationComment[];
  is_resolved: boolean;
  resolved_by?: number;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface WebSocketMessage {
  type: 'user_joined' | 'user_left' | 'edit_operation' | 'cursor_update' | 'comment_added' | 'system_message';
  data: any;
  user_id: number;
  username: string;
  timestamp: string;
}

export interface CollaborationInviteRequest {
  email: string;
  role: 'editor' | 'viewer' | 'commentor';
  message?: string;
  expires_in_hours?: number;
}

export const collaborationApi = {
  /**
   * Invite collaborator to template
   */
  async inviteCollaborator(templateId: number, invitation: CollaborationInviteRequest): Promise<CollaborationInvitation> {
    const response = await apiClient.post(`/collaboration/templates/${templateId}/invite`, invitation);
    return response.data;
  },

  /**
   * Accept collaboration invitation
   */
  async acceptInvitation(invitationId: number, token?: string): Promise<{ success: boolean; template_id: number }> {
    const response = await apiClient.post(`/collaboration/invitations/${invitationId}/accept`, { token });
    return response.data;
  },

  /**
   * Decline collaboration invitation
   */
  async declineInvitation(invitationId: number, token?: string): Promise<{ success: boolean }> {
    const response = await apiClient.post(`/collaboration/invitations/${invitationId}/decline`, { token });
    return response.data;
  },

  /**
   * Get collaborators for a template
   */
  async getCollaborators(templateId: number): Promise<Collaborator[]> {
    const response = await apiClient.get(`/collaboration/templates/${templateId}/collaborators`);
    return response.data;
  },

  /**
   * Update collaborator permissions
   */
  async updateCollaboratorPermissions(templateId: number, userId: number, permissions: {
    role?: 'owner' | 'editor' | 'viewer' | 'commentor';
    can_edit?: boolean;
    can_comment?: boolean;
    can_view_history?: boolean;
    can_invite_others?: boolean;
    can_manage_permissions?: boolean;
  }): Promise<Collaborator> {
    const response = await apiClient.put(`/collaboration/templates/${templateId}/collaborators/${userId}`, permissions);
    return response.data;
  },

  /**
   * Remove collaborator from template
   */
  async removeCollaborator(templateId: number, userId: number): Promise<{ success: boolean }> {
    const response = await apiClient.delete(`/collaboration/templates/${templateId}/collaborators/${userId}`);
    return response.data;
  },

  /**
   * Get active collaboration sessions
   */
  async getActiveSessions(templateId: number): Promise<CollaborationSession[]> {
    const response = await apiClient.get(`/collaboration/templates/${templateId}/sessions`);
    return response.data;
  },

  /**
   * Get edit history for template
   */
  async getEditHistory(templateId: number, filters?: {
    user_id?: number;
    operation?: string;
    section?: string;
    start_date?: string;
    end_date?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ history: EditHistoryEntry[]; total_count: number }> {
    const response = await apiClient.get(`/collaboration/templates/${templateId}/history`, { params: filters });
    return response.data;
  },

  /**
   * Generate AI insights for template
   */
  async generateAIInsights(templateId: number, options?: {
    sections?: string[];
    insight_types?: string[];
    force_refresh?: boolean;
  }): Promise<{ insight_id: string; status: 'generating' | 'completed'; insights?: AIInsight[] }> {
    const response = await apiClient.post(`/collaboration/templates/${templateId}/ai-insights/generate`, options);
    return response.data;
  },

  /**
   * Get AI insights for template
   */
  async getAIInsights(templateId: number, filters?: {
    type?: string;
    status?: string;
    section?: string;
    priority?: string;
    limit?: number;
  }): Promise<AIInsight[]> {
    const response = await apiClient.get(`/collaboration/templates/${templateId}/ai-insights`, { params: filters });
    return response.data;
  },

  /**
   * Apply AI insight suggestion
   */
  async applyAIInsight(insightId: number, changes?: any): Promise<{ success: boolean; applied_changes: any[] }> {
    const response = await apiClient.post(`/collaboration/ai-insights/${insightId}/apply`, { changes });
    return response.data;
  },

  /**
   * Dismiss AI insight
   */
  async dismissAIInsight(insightId: number, reason?: string): Promise<{ success: boolean }> {
    const response = await apiClient.post(`/collaboration/ai-insights/${insightId}/dismiss`, { reason });
    return response.data;
  },

  /**
   * Submit feedback on AI insight
   */
  async submitAIInsightFeedback(insightId: number, feedback: {
    helpful: boolean;
    accuracy: number; // 1-5 scale
    comment?: string;
  }): Promise<{ success: boolean }> {
    const response = await apiClient.post(`/collaboration/ai-insights/${insightId}/feedback`, feedback);
    return response.data;
  },

  /**
   * Get smart recommendations for template
   */
  async getSmartRecommendations(templateId: number): Promise<SmartRecommendation[]> {
    const response = await apiClient.post(`/collaboration/templates/${templateId}/smart-recommendations`);
    return response.data;
  },

  /**
   * Add comment to template section
   */
  async addComment(templateId: number, comment: {
    section: string;
    content: string;
    position?: { line: number; column: number };
    parent_comment_id?: number;
  }): Promise<CollaborationComment> {
    const response = await apiClient.post(`/collaboration/templates/${templateId}/comments`, comment);
    return response.data;
  },

  /**
   * Get comments for template
   */
  async getComments(templateId: number, filters?: {
    section?: string;
    is_resolved?: boolean;
    user_id?: number;
  }): Promise<CollaborationComment[]> {
    const response = await apiClient.get(`/collaboration/templates/${templateId}/comments`, { params: filters });
    return response.data;
  },

  /**
   * Update comment
   */
  async updateComment(commentId: number, updates: {
    content?: string;
    is_resolved?: boolean;
  }): Promise<CollaborationComment> {
    const response = await apiClient.put(`/collaboration/comments/${commentId}`, updates);
    return response.data;
  },

  /**
   * Delete comment
   */
  async deleteComment(commentId: number): Promise<{ success: boolean }> {
    const response = await apiClient.delete(`/collaboration/comments/${commentId}`);
    return response.data;
  },

  /**
   * Get my collaboration invitations
   */
  async getMyInvitations(status?: 'pending' | 'accepted' | 'declined'): Promise<CollaborationInvitation[]> {
    const response = await apiClient.get('/collaboration/invitations/mine', {
      params: status ? { status } : undefined,
    });
    return response.data;
  },

  /**
   * Get templates I'm collaborating on
   */
  async getMyCollaborations(): Promise<Array<{
    template_id: number;
    template_name: string;
    my_role: string;
    last_activity: string;
    active_collaborators: number;
    owner_name: string;
  }>> {
    const response = await apiClient.get('/collaboration/my-collaborations');
    return response.data;
  },
};

/**
 * WebSocket collaboration manager
 */
export class CollaborationWebSocket {
  private ws: WebSocket | null = null;
  private templateId: number;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor(templateId: number) {
    this.templateId = templateId;
  }

  /**
   * Connect to collaboration WebSocket
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        reject(new Error('No authentication token'));
        return;
      }

      const wsUrl = `wss://fin-model-production.up.railway.app/api/v1/collaboration/ws/template/${this.templateId}?token=${token}`;
      
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('Collaboration WebSocket connected');
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        resolve();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('Collaboration WebSocket disconnected:', event.code, event.reason);
        this.stopHeartbeat();
        
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.error('Collaboration WebSocket error:', error);
        reject(error);
      };
    });
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    this.stopHeartbeat();
  }

  /**
   * Send edit operation to other collaborators
   */
  sendEditOperation(operation: Omit<CollaborativeEdit, 'id' | 'timestamp' | 'applied'>): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'edit_operation',
        data: operation,
      }));
    }
  }

  /**
   * Send cursor position update
   */
  sendCursorUpdate(position: { line: number; column: number; section?: string }): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'cursor_update',
        data: position,
      }));
    }
  }

  /**
   * Send comment notification
   */
  sendCommentNotification(comment: CollaborationComment): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'comment_added',
        data: comment,
      }));
    }
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(message: WebSocketMessage): void {
    const event = new CustomEvent('collaborationMessage', { detail: message });
    window.dispatchEvent(event);
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    setTimeout(() => {
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      this.connect().catch(() => {
        // Reconnection failed, will try again if attempts remaining
      });
    }, delay);
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // 30 seconds
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
}

/**
 * Collaboration utility functions
 */
export const collaborationUtils = {
  /**
   * Get role color
   */
  getRoleColor(role: string): string {
    const colors: Record<string, string> = {
      owner: '#DC2626',
      editor: '#059669',
      commentor: '#3B82F6',
      viewer: '#6B7280',
    };
    return colors[role] || '#9CA3AF';
  },

  /**
   * Get role permissions
   */
  getRolePermissions(role: string): Collaborator['permissions'] {
    const permissions: Record<string, Collaborator['permissions']> = {
      owner: {
        can_edit: true,
        can_comment: true,
        can_view_history: true,
        can_invite_others: true,
        can_manage_permissions: true,
      },
      editor: {
        can_edit: true,
        can_comment: true,
        can_view_history: true,
        can_invite_others: true,
        can_manage_permissions: false,
      },
      commentor: {
        can_edit: false,
        can_comment: true,
        can_view_history: true,
        can_invite_others: false,
        can_manage_permissions: false,
      },
      viewer: {
        can_edit: false,
        can_comment: false,
        can_view_history: true,
        can_invite_others: false,
        can_manage_permissions: false,
      },
    };
    
    return permissions[role] || permissions.viewer;
  },

  /**
   * Get AI insight priority color
   */
  getInsightPriorityColor(priority: string): string {
    const colors: Record<string, string> = {
      low: '#6B7280',
      medium: '#F59E0B',
      high: '#EF4444',
      critical: '#DC2626',
    };
    return colors[priority] || '#9CA3AF';
  },

  /**
   * Format confidence score
   */
  formatConfidence(confidence: number): { percentage: string; level: string; color: string } {
    const percentage = `${Math.round(confidence * 100)}%`;
    
    if (confidence >= 0.9) {
      return { percentage, level: 'Very High', color: '#059669' };
    } else if (confidence >= 0.7) {
      return { percentage, level: 'High', color: '#10B981' };
    } else if (confidence >= 0.5) {
      return { percentage, level: 'Medium', color: '#F59E0B' };
    } else {
      return { percentage, level: 'Low', color: '#EF4444' };
    }
  },

  /**
   * Generate user avatar initials
   */
  generateInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  },

  /**
   * Get user presence status
   */
  getPresenceStatus(lastActive: string): { status: 'online' | 'away' | 'offline'; label: string; color: string } {
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const diffMinutes = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60));

    if (diffMinutes < 5) {
      return { status: 'online', label: 'Online', color: '#10B981' };
    } else if (diffMinutes < 30) {
      return { status: 'away', label: 'Away', color: '#F59E0B' };
    } else {
      return { status: 'offline', label: 'Offline', color: '#6B7280' };
    }
  },

  /**
   * Format edit operation for display
   */
  formatEditOperation(operation: EditHistoryEntry): string {
    const { operation: op, details } = operation;
    
    switch (op) {
      case 'create':
        return `Created ${details.description}`;
      case 'update':
        return `Updated ${details.description}`;
      case 'delete':
        return `Deleted ${details.description}`;
      case 'move':
        return `Moved ${details.description}`;
      case 'comment':
        return `Commented on ${details.description}`;
      default:
        return details.description || 'Unknown operation';
    }
  },

  /**
   * Apply operational transform for concurrent editing
   */
  applyOperationalTransform(localOp: CollaborativeEdit, remoteOp: CollaborativeEdit): CollaborativeEdit {
    // Simple operational transform for text operations
    // In a production system, this would be more sophisticated
    
    if (localOp.position.start <= remoteOp.position.start) {
      // Local operation comes before remote operation
      return localOp;
    } else {
      // Adjust local operation position based on remote operation
      const adjustedOp = { ...localOp };
      
      if (remoteOp.operation === 'insert') {
        adjustedOp.position.start += remoteOp.content.length;
        adjustedOp.position.end += remoteOp.content.length;
      } else if (remoteOp.operation === 'delete') {
        const deleteLength = remoteOp.position.end - remoteOp.position.start;
        adjustedOp.position.start -= deleteLength;
        adjustedOp.position.end -= deleteLength;
      }
      
      return adjustedOp;
    }
  },

  /**
   * Detect conflicts in concurrent edits
   */
  detectConflicts(localOp: CollaborativeEdit, remoteOp: CollaborativeEdit): string[] {
    const conflicts: string[] = [];
    
    // Check for overlapping positions
    if (
      (localOp.position.start < remoteOp.position.end && localOp.position.end > remoteOp.position.start) ||
      (remoteOp.position.start < localOp.position.end && remoteOp.position.end > localOp.position.start)
    ) {
      conflicts.push('Overlapping edits detected');
    }
    
    // Check for simultaneous edits in same section
    if (localOp.position.line === remoteOp.position.line) {
      conflicts.push('Simultaneous edits on same line');
    }
    
    return conflicts;
  },
};

export default collaborationApi;