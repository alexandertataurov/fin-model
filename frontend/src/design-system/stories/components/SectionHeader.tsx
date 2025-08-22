import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="space-y-4 mb-8">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>
      {children && <div>{children}</div>}
    </div>
  );
};
