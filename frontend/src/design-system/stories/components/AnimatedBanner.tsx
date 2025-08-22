import React from 'react';

interface AnimatedBannerProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
}

export const AnimatedBanner: React.FC<AnimatedBannerProps> = ({
  title,
  subtitle,
  icon,
}) => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border border-primary/20 p-8 mb-8">
      <div className="flex items-start space-x-4">
        {icon && (
          <div className="flex-shrink-0 w-12 h-12 text-primary">{icon}</div>
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
    </div>
  );
};
