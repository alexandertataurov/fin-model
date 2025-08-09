import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/utils/cn";

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          // DESIGN_FIX: use border and background tokens instead of hex colors
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='var(--border)']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='var(--border)']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='var(--border)']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='var(--background)']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='var(--background)']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer width="100%" height="100%">
          {children as any}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color,
  );

  if (!colorConfig.length) {
    return null;
  }

  const styles = Object.entries(THEMES)
    .map(
      ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
        .map(([key, itemConfig]) => {
          const color =
            itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
            itemConfig.color;
          return color ? `  --color-${key}: ${color};` : null;
        })
        .join("\n")}
}
`
    )
    .join("\n");
  return <style>{styles}</style>;
};

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<"div"> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
  }) {
  const { config } = useChart();

  if (!active || !payload) {
    return null;
  }

  const payloadConfig = getPayloadConfigFromPayload(
    config,
    payload,
    nameKey || "name",
  );

  return (
    <div
      data-slot="chart-tooltip-content"
      className={cn(
        "rounded-lg border bg-background p-2 text-sm shadow-sm",
        className,
      )}
    >
      {!hideLabel && (
        <div
          data-slot="chart-tooltip-label"
          className={cn("font-medium", labelClassName)}
        >
          {labelFormatter ? labelFormatter(label, payload as any) : label}
        </div>
      )}
      <div data-slot="chart-tooltip-items" className="mt-1 space-y-1">
        {payload.map((item, index) => {
          const itemConfig = payloadConfig[item.dataKey as string];
          const itemColor = itemConfig?.color || item.color || color;

          return (
            <div
              key={index}
              data-slot="chart-tooltip-item"
              className="flex items-center gap-2"
            >
              {!hideIndicator && (
                <div
                  data-slot="chart-tooltip-indicator"
                  className={cn(
                    "h-2 w-2 rounded-full",
                    indicator === "line" && "h-0.5",
                    indicator === "dashed" && "h-0.5 border-t border-dashed",
                  )}
                  style={{
                    backgroundColor: itemColor,
                    borderColor: itemColor,
                  }}
                />
              )}
              <span
                data-slot="chart-tooltip-name"
                className="text-muted-foreground"
              >
                {itemConfig?.label || item.name}:
              </span>
              <span
                data-slot="chart-tooltip-value"
                className="font-medium"
                style={{ color: itemColor }}
              >
                {formatter
                  ? formatter(
                    (item.value ?? '') as any,
                    (item.name ?? '') as any,
                    item as any,
                    index,
                    payload as any,
                  )
                  : (item.value ?? '')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: React.ComponentProps<"div"> &
  Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
    hideIcon?: boolean;
    nameKey?: string;
  }) {
  const { config } = useChart();

  if (!payload) {
    return null;
  }

  const payloadConfig = getPayloadConfigFromPayload(
    config,
    payload,
    nameKey || "value",
  );

  return (
    <div
      data-slot="chart-legend-content"
      className={cn(
        "flex items-center gap-2",
        verticalAlign === "top" && "justify-start",
        verticalAlign === "bottom" && "justify-start",
        className,
      )}
    >
      {payload.map((item, index) => {
        const itemConfig = payloadConfig[item.value as string];
        const itemColor = itemConfig?.color || item.color;

        return (
          <div
            key={index}
            data-slot="chart-legend-item"
            className="flex items-center gap-1.5"
          >
            {!hideIcon && (
              <div
                data-slot="chart-legend-icon"
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: itemColor }}
              />
            )}
            <span
              data-slot="chart-legend-label"
              className="text-xs text-muted-foreground"
            >
              {itemConfig?.label || item.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string,
) {
  if (!Array.isArray(payload)) {
    return {};
  }

  return payload.reduce((acc, item) => {
    const itemKey = item[key as keyof typeof item] as string;
    if (itemKey && config[itemKey]) {
      acc[itemKey] = config[itemKey];
    }
    return acc;
  }, {} as ChartConfig);
}

export {
  ChartContainer,
  ChartLegendContent,
  ChartTooltipContent,
  useChart,
};
