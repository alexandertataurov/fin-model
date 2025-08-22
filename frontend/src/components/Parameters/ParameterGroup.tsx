import { ParameterControl } from './ParameterControl';
import type { Parameter } from './ParameterPanel';

interface ParameterGroupProps {
  parameters: Parameter[];
  onParameterChange: (parameterId: string, value: number) => void;
  validationErrors: Record<string, string>;
  pendingChanges: Record<string, number>;
  readOnly?: boolean;
  onShowImpact?: (parameter: Parameter) => void;
  onShowHistory?: (parameter: Parameter) => void;
}

export function ParameterGroup({
  parameters,
  onParameterChange,
  validationErrors,
  pendingChanges,
  readOnly = false,
  onShowImpact,
  onShowHistory,
}: ParameterGroupProps) {
  if (parameters.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No parameters found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {parameters.map(parameter => (
        <ParameterControl
          key={parameter.id}
          parameter={parameter}
          value={pendingChanges[parameter.id] ?? parameter.value}
          onChange={value => onParameterChange(parameter.id, value)}
          error={validationErrors[parameter.id]}
          readOnly={readOnly}
          onShowImpact={() => onShowImpact?.(parameter)}
          onShowHistory={() => onShowHistory?.(parameter)}
        />
      ))}
    </div>
  );
}
