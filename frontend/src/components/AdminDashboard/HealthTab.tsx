import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/design-system/components/Card';
import { useAdminStore } from '@/stores/adminStore';
import { tokens } from '@/design-system/tokens';
import { applyTypographyStyle } from '@/design-system/stories/components';

const HealthTab: React.FC = () => {
  // Design system helper functions
  const applyDesignSystemSpacing = (size: keyof typeof tokens.spacing) => tokens.spacing[size];
  const applyDesignSystemRadius = (size: keyof typeof tokens.borderRadius) => tokens.borderRadius[size];
  const applyDesignSystemShadow = (size: keyof typeof tokens.shadows) => tokens.shadows[size];
  const applyDesignSystemMotion = (type: 'duration' | 'easing', value: string) => 
      type === 'duration' ? tokens.motion.duration[value] : tokens.motion.easing[value];

  const { systemHealth, databaseHealth } = useAdminStore();

  return (
    <div 
      className="space-y-4"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: applyDesignSystemSpacing(4)
      }}
    >
      <Card
        style={{
          background: tokens.colors.background,
          borderRadius: applyDesignSystemRadius('xl'),
          boxShadow: applyDesignSystemShadow('md'),
          border: `${tokens.borderWidth.base} solid ${tokens.colors.border}`,
          transition: `all ${applyDesignSystemMotion('duration', 'normal')} ${applyDesignSystemMotion('easing', 'smooth')}`
        }}
      >
        <CardHeader
          style={{
            padding: applyDesignSystemSpacing(6)
          }}
        >
          <CardTitle
            style={{
              ...applyTypographyStyle('title'),
              color: tokens.colors.foreground
            }}
          >
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent
          style={{
            padding: applyDesignSystemSpacing(6)
          }}
        >
          {systemHealth.data ? (
            <div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(1, 1fr)',
                gap: applyDesignSystemSpacing(4),
                fontSize: tokens.typography.fontSize.sm,
                '@media (min-width: 768px)': {
                  gridTemplateColumns: 'repeat(2, 1fr)'
                }
              }}
            >
              <div 
                className="flex items-center justify-between"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span 
                  className="text-muted-foreground"
                  style={{
                    color: tokens.colors.secondary[500]
                  }}
                >
                  Status
                </span>
                <span 
                  className="font-medium"
                  style={{
                    fontWeight: tokens.typography.fontWeight.medium,
                    color: tokens.colors.foreground
                  }}
                >
                  {String(systemHealth.data.status).toUpperCase()}
                </span>
              </div>
              <div 
                className="flex items-center justify-between"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span 
                  className="text-muted-foreground"
                  style={{
                    color: tokens.colors.secondary[500]
                  }}
                >
                  Timestamp
                </span>
                <span 
                  className="font-medium"
                  style={{
                    fontWeight: tokens.typography.fontWeight.medium,
                    color: tokens.colors.foreground
                  }}
                >
                  {new Date().toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <div 
              className="text-muted-foreground"
              style={{
                color: tokens.colors.secondary[500],
                ...applyTypographyStyle('body')
              }}
            >
              No system health data.
            </div>
          )}
        </CardContent>
      </Card>

      <Card
        style={{
          background: tokens.colors.background,
          borderRadius: applyDesignSystemRadius('xl'),
          boxShadow: applyDesignSystemShadow('md'),
          border: `${tokens.borderWidth.base} solid ${tokens.colors.border}`,
          transition: `all ${applyDesignSystemMotion('duration', 'normal')} ${applyDesignSystemMotion('easing', 'smooth')}`
        }}
      >
        <CardHeader
          style={{
            padding: applyDesignSystemSpacing(6)
          }}
        >
          <CardTitle
            style={{
              ...applyTypographyStyle('title'),
              color: tokens.colors.foreground
            }}
          >
            Database Health
          </CardTitle>
        </CardHeader>
        <CardContent
          style={{
            padding: applyDesignSystemSpacing(6)
          }}
        >
          {databaseHealth.data ? (
            <div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(1, 1fr)',
                gap: applyDesignSystemSpacing(4),
                fontSize: tokens.typography.fontSize.sm,
                '@media (min-width: 768px)': {
                  gridTemplateColumns: 'repeat(2, 1fr)'
                }
              }}
            >
              <div 
                className="flex items-center justify-between"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span 
                  className="text-muted-foreground"
                  style={{
                    color: tokens.colors.secondary[500]
                  }}
                >
                  Status
                </span>
                <span 
                  className="font-medium"
                  style={{
                    fontWeight: tokens.typography.fontWeight.medium,
                    color: tokens.colors.foreground
                  }}
                >
                  {String(databaseHealth.data.status || 'unknown').toUpperCase()}
                </span>
              </div>
            </div>
          ) : (
            <div 
              className="text-muted-foreground"
              style={{
                color: tokens.colors.secondary[500],
                ...applyTypographyStyle('body')
              }}
            >
              No database health data.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthTab;
