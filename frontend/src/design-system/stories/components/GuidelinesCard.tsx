import React from 'react';

interface GuidelinesCardProps {
  title: string;
  items: string[];
  icon?: React.ReactNode;
  variant?: 'default' | 'warning' | 'success' | 'info';
}

export const GuidelinesCard: React.FC<GuidelinesCardProps> = ({
  title,
  items,
  icon,
  variant = 'default',
}) => {
  const variantStyles = {
    default: 'border-primary/20 bg-primary/5',
    warning: 'border-warning/20 bg-warning/5',
    success: 'border-success/20 bg-success/5',
    info: 'border-info/20 bg-info/5',
  };

  const iconColors = {
    default: 'text-primary',
    warning: 'text-warning',
    success: 'text-success',
    info: 'text-info',
  };

  return (
    <div
      className={`p-6 rounded-xl border ${variantStyles[variant]} space-y-4`}
    >
      <div className="flex items-start space-x-3">
        {icon && (
          <div className={`flex-shrink-0 w-6 h-6 ${iconColors[variant]}`}>
            {icon}
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-semibold text-lg text-gray-900 mb-4">{title}</h4>
          <ul className="text-base text-gray-600 space-y-2 leading-relaxed">
            {items.map((item, index) => (
              <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
