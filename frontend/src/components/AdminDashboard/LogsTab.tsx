import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/design-system/components/Card';
import { useLogFilters } from '@/hooks/useLogFilters';
import LogFilterForm from './LogFilterForm';
import type { LogEntry } from '@/services/adminApi';
import { tokens } from '@/design-system/tokens';
import { applyTypographyStyle } from '@/design-system/stories/components';

const LogsTab: React.FC = () => {
  // Design system helper functions
  const applyDesignSystemSpacing = (size: keyof typeof tokens.spacing) => tokens.spacing[size];
  const applyDesignSystemRadius = (size: keyof typeof tokens.borderRadius) => tokens.borderRadius[size];
  const applyDesignSystemShadow = (size: keyof typeof tokens.shadows) => tokens.shadows[size];
  const applyDesignSystemMotion = (type: 'duration' | 'easing', value: string) => 
      type === 'duration' ? tokens.motion.duration[value] : tokens.motion.easing[value];

  const { logs, handleFilterChange, handlePrev, handleNext, handleRefresh } =
    useLogFilters();
  const { items, total, skip, limit, level, from, to, search } = logs;

  return (
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
          System Logs
        </CardTitle>
      </CardHeader>
      <CardContent
        style={{
          padding: applyDesignSystemSpacing(6)
        }}
      >
        <LogFilterForm
          level={level}
          limit={limit}
          from={from}
          to={to}
          search={search}
          skip={skip}
          total={total}
          onChange={handleFilterChange}
          onRefresh={handleRefresh}
          onPrev={handlePrev}
          onNext={handleNext}
        />
        <div 
          className="border rounded"
          style={{
            border: `${tokens.borderWidth.base} solid ${tokens.colors.border}`,
            borderRadius: applyDesignSystemRadius('lg'),
            marginTop: applyDesignSystemSpacing(6)
          }}
        >
          <div 
            className="max-h-96 overflow-auto text-xs font-mono"
            style={{
              maxHeight: '24rem',
              overflow: 'auto',
              fontSize: tokens.typography.fontSize.xs,
              fontFamily: tokens.typography.fontFamily.mono.join(', ')
            }}
          >
            {items.length > 0 ? (
              items.map((log: LogEntry, idx: number) => (
                <div 
                  key={idx} 
                  className="px-3 py-2 border-b"
                  style={{
                    padding: `${applyDesignSystemSpacing(2)} ${applyDesignSystemSpacing(3)}`,
                    borderBottom: `${tokens.borderWidth.base} solid ${tokens.colors.border}`,
                    transition: `all ${applyDesignSystemMotion('duration', 'normal')} ${applyDesignSystemMotion('easing', 'smooth')}`
                  }}
                >
                  <div 
                    className="flex items-center justify-between"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: applyDesignSystemSpacing(1)
                    }}
                  >
                    <span 
                      className="font-semibold"
                      style={{
                        fontWeight: tokens.typography.fontWeight.semibold,
                        color: tokens.colors.foreground
                      }}
                    >
                      [{log.level}] {log.module}
                    </span>
                    <span 
                      className="text-muted-foreground"
                      style={{
                        color: tokens.colors.secondary[500]
                      }}
                    >
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div
                    style={{
                      color: tokens.colors.foreground
                    }}
                  >
                    {log.message}
                  </div>
                </div>
              ))
            ) : (
              <div 
                className="p-4 text-muted-foreground"
                style={{
                  padding: applyDesignSystemSpacing(4),
                  color: tokens.colors.secondary[500],
                  textAlign: 'center'
                }}
              >
                No logs.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogsTab;
