import React from 'react';

interface ColorPaletteProps {
  title: string;
  subtitle: string;
  colors: Record<string, string>;
  descriptionMap?: Record<string, string>;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({
  title,
  subtitle,
  colors,
  descriptionMap,
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {Object.entries(colors).map(([name, color]) => (
          <div
            key={name}
            className="flex items-center gap-4 p-4 border rounded-lg"
          >
            <div
              className="w-10 h-10 rounded-md border"
              style={{ backgroundColor: color }}
            />
            <div>
              <div className="font-medium">{name}</div>
              <div className="text-xs text-muted-foreground">{color}</div>
              {descriptionMap?.[name] && (
                <div className="text-xs text-muted-foreground mt-1">
                  {descriptionMap[name]}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
