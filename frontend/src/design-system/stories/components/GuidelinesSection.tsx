import React from 'react';

interface GuidelinesSectionProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  items?: string[];
}

export const GuidelinesSection: React.FC<GuidelinesSectionProps> = ({
  title,
  description,
  children,
  items,
}) => {
  return (
    <div>
      <h5 className="font-semibold text-foreground mb-3 break-words">
        {title}
      </h5>
      {description && (
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      )}
      {children && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {children}
        </div>
      )}
      {items && (
        <ul className="space-y-2 text-sm text-muted-foreground">
          {items.map((item, index) => (
            <li
              key={index}
              className="break-words"
              dangerouslySetInnerHTML={{ __html: item }}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
