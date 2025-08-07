import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Collaborator,
  CollaborationMessage,
  ReportElement,
} from '@/types/template-builder';

interface UseCollaborationProps {
  templateId: string;
  userId: string;
  onElementUpdate?: (element: ReportElement) => void;
  onTemplateUpdate?: (changes: any) => void;
}

export const useCollaboration = ({
  templateId,
  userId,
  onElementUpdate,
  onTemplateUpdate,
}: UseCollaborationProps) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'disconnected'
  >('disconnected');
  const [lastActivity, setLastActivity] = useState<Date | null>(null);

  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = useRef(1000);

  const sendMessage = useCallback(
    (message: Partial<CollaborationMessage>) => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(
          JSON.stringify({
            ...message,
            sender_id: userId,
            timestamp: new Date().toISOString(),
          })
        );
        return true;
      }
      return false;
    },
    [userId]
  );

  const handleCollaborationMessage = useCallback(
    (message: CollaborationMessage) => {
      switch (message.type) {
        case 'template_edit':
          if (message.sender_id !== userId) {
            const editData = message.data;

            switch (editData.edit_type) {
              case 'element_update':
                if (onElementUpdate && editData.element_id) {
                  onElementUpdate(editData.changes);
                }
                break;
              case 'element_add':
                if (onTemplateUpdate) {
                  onTemplateUpdate({
                    type: 'add_element',
                    element: editData.changes,
                  });
                }
                break;
              case 'element_delete':
                if (onTemplateUpdate) {
                  onTemplateUpdate({
                    type: 'delete_element',
                    elementId: editData.element_id,
                  });
                }
                break;
              case 'template_update':
                if (onTemplateUpdate) {
                  onTemplateUpdate({
                    type: 'template_update',
                    changes: editData.changes,
                  });
                }
                break;
            }
          }
          break;

        case 'user_presence': {
          const { user_id, action } = message.data;
          setCollaborators(prev => {
            const existing = prev.find(c => c.id === user_id);

            if (action === 'joined') {
              if (!existing) {
                // In a real app, you'd fetch user details from an API
                return [
                  ...prev,
                  {
                    id: user_id,
                    name: 'Unknown User',
                    email: '',
                    initials: 'U',
                    permission: 'edit' as any,
                    isActive: true,
                  },
                ];
              } else {
                return prev.map(c =>
                  c.id === user_id ? { ...c, isActive: true } : c
                );
              }
            } else if (action === 'left') {
              return prev.map(c =>
                c.id === user_id ? { ...c, isActive: false } : c
              );
            }

            return prev;
          });
          break;
        }

        case 'cursor_move':
          // Handle cursor position updates from other users
          // This could be used to show cursor positions on the canvas
          break;
      }
    },
    [userId, onElementUpdate, onTemplateUpdate]
  );

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    setConnectionStatus('connecting');

    const token = localStorage.getItem('authToken');
    const wsUrl = `wss://fin-model-production.up.railway.app/ws/collaboration/ws/template/${templateId}?token=${token}`;

    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      // WebSocket connected for template
      setIsConnected(true);
      setConnectionStatus('connected');
      reconnectAttempts.current = 0;
      reconnectDelay.current = 1000;
      // Send initial presence
      sendMessage({
        type: 'user_presence',
        data: { action: 'joined' },
      });
    };

    ws.current.onclose = event => {
      // WebSocket disconnected
      setIsConnected(false);
      setConnectionStatus('disconnected');
      // Attempt to reconnect if not manually closed
      if (
        event.code !== 1000 &&
        reconnectAttempts.current < maxReconnectAttempts
      ) {
        setTimeout(() => {
          reconnectAttempts.current++;
          reconnectDelay.current *= 2; // Exponential backoff
          connect();
        }, reconnectDelay.current);
      }
    };

    ws.current.onerror = error => {
      console.error('WebSocket error:', error);
      setConnectionStatus('disconnected');
    };

    ws.current.onmessage = event => {
      try {
        const message: CollaborationMessage = JSON.parse(event.data);
        handleCollaborationMessage(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };
  }, [templateId, handleCollaborationMessage, sendMessage]);

  const disconnect = useCallback(() => {
    if (ws.current) {
      ws.current.close(1000, 'Manual disconnect');
      ws.current = null;
    }
    setIsConnected(false);
    setConnectionStatus('disconnected');
  }, []);

  const sendEdit = useCallback(
    (editData: { edit_type: string; element_id?: string; changes: any }) => {
      const success = sendMessage({
        type: 'template_edit',
        data: editData,
      });

      if (success) {
        setLastActivity(new Date());
      }

      return success;
    },
    [sendMessage]
  );

  const sendCursorMove = useCallback(
    (position: { x: number; y: number; elementId?: string }) => {
      sendMessage({
        type: 'cursor_move',
        data: position,
      });
    },
    [sendMessage]
  );

  // Send periodic activity updates
  useEffect(() => {
    if (!isConnected) return;

    const activityInterval = setInterval(() => {
      sendMessage({
        type: 'user_presence',
        data: { action: 'active' },
      });
    }, 30000); // Every 30 seconds

    return () => clearInterval(activityInterval);
  }, [isConnected, sendMessage]);

  // Auto-connect when component mounts
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, reduce activity
      } else {
        // Page is visible, resume normal activity
        if (!isConnected) {
          connect();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isConnected, connect]);

  return {
    collaborators: collaborators.filter(c => c.isActive),
    isConnected,
    connectionStatus,
    lastActivity,
    connect,
    disconnect,
    sendEdit,
    sendCursorMove,
    sendMessage,
  };
};
