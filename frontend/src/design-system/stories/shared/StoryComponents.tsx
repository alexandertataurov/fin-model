import React from 'react';
import { Card } from '../components/CoreComponents';

// Lightweight, unified story components for better performance
export interface StoryLayoutProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export interface StoryCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export interface GuidelineItemProps {
  type: 'do' | 'dont';
  title: string;
  items: string[];
}

// Optimized AnimatedBanner with reduced CSS and animations
export const StoryBanner: React.FC<{
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
}> = ({ title, subtitle, icon }) => {
  return (
    <div className="relative rounded-xl bg-gradient-to-r from-primary/8 to-accent/8 border border-primary/15 p-6 mb-6">
      <div className="flex items-start space-x-3">
        {icon && (
          <div className="flex-shrink-0 w-10 h-10 text-primary opacity-80">{icon}</div>
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground mb-1">{title}</h1>
          <p className="text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

// Lightweight section header
export const StorySection: React.FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}> = ({ title, subtitle, children }) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
};

// Optimized story card with minimal styling
export const StoryCard: React.FC<StoryCardProps> = ({ 
  title, 
  description, 
  children, 
  variant = 'default' 
}) => {
  const variantClasses = {
    default: 'border-border',
    success: 'border-green-200 bg-green-50/50',
    warning: 'border-yellow-200 bg-yellow-50/50',
    error: 'border-red-200 bg-red-50/50'
  };

  return (
    <Card className={`p-4 ${variantClasses[variant]}`}>
      <div className="mb-3">
        <h3 className="text-lg font-medium text-foreground">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      <div>{children}</div>
    </Card>
  );
};

// Lightweight guidelines component
export const StoryGuidelines: React.FC<{
  doItems?: string[];
  dontItems?: string[];
}> = ({ doItems = [], dontItems = [] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {doItems.length > 0 && (
        <StoryCard title="✅ Do" variant="success">
          <ul className="space-y-2 text-sm">
            {doItems.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </StoryCard>
      )}
      
      {dontItems.length > 0 && (
        <StoryCard title="❌ Don't" variant="warning">
          <ul className="space-y-2 text-sm">
            {dontItems.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-amber-600 mr-2">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </StoryCard>
      )}
    </div>
  );
};

// Variant showcase component
export const StoryVariants: React.FC<{
  children: React.ReactNode;
  columns?: number;
}> = ({ children, columns = 3 }) => {
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${gridClass[columns as keyof typeof gridClass]} gap-4`}>
      {children}
    </div>
  );
};

// Interactive playground component
export const StoryPlayground: React.FC<{
  children: React.ReactNode;
  description?: string;
}> = ({ children, description }) => {
  return (
    <StoryCard title="Interactive Playground" description={description}>
      <div className="flex items-center justify-center min-h-[120px] bg-background/50 rounded-lg border border-border/50">
        {children}
      </div>
    </StoryCard>
  );
};

// Size showcase component
export const StorySizes: React.FC<{
  items: Array<{
    name: string;
    component: React.ReactNode;
    description?: string;
  }>;
}> = ({ items }) => {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-4 p-3 rounded-lg border border-border/50">
          <div className="flex-shrink-0">
            {item.component}
          </div>
          <div className="flex-1">
            <div className="font-medium text-sm">{item.name}</div>
            {item.description && (
              <div className="text-xs text-muted-foreground">{item.description}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Usage examples component
export const StoryUsage: React.FC<{
  title: string;
  code: string;
  children: React.ReactNode;
}> = ({ title, code, children }) => {
  return (
    <StoryCard title={title}>
      <div className="space-y-3">
        <div className="flex items-center justify-center p-4 bg-background/50 rounded border border-border/50">
          {children}
        </div>
        <details className="text-sm">
          <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
            Show code
          </summary>
          <pre className="mt-2 p-3 bg-muted/50 rounded text-xs overflow-x-auto">
            <code>{code}</code>
          </pre>
        </details>
      </div>
    </StoryCard>
  );
};