import * as React from 'react';

export type WizardVariant = 'default' | 'outline' | 'filled';
export type WizardSize = 'sm' | 'md' | 'lg';
export type WizardOrientation = 'horizontal' | 'vertical';

export interface WizardStep {
  title: string;
  description?: string;
  icon?: string;
  content?:
    | React.ReactNode
    | ((props: WizardStepContentProps) => React.ReactNode);
  validation?: (data: any) => string[] | null;
}

export interface WizardStepContentProps {
  data: any;
  onChange: (data: any) => void;
  onValidation: (errors: string[]) => void;
}

export interface WizardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Wizard steps */
  steps?: WizardStep[];

  /** Current step index */
  currentStep?: number;

  /** Visual variant of the wizard */
  variant?: WizardVariant;

  /** Size of the wizard */
  size?: WizardSize;

  /** Orientation of the wizard */
  orientation?: WizardOrientation;

  /** Whether to show progress bar */
  showProgress?: boolean;

  /** Whether to show step numbers */
  showStepNumbers?: boolean;

  /** Whether to allow step navigation */
  allowStepNavigation?: boolean;

  /** Callback when step changes */
  onStepChange?: (stepIndex: number) => void;

  /** Callback when wizard is completed */
  onComplete?: (data: Record<number, any>) => void;

  /** Callback when wizard is cancelled */
  onCancel?: () => void;

  /** Custom className */
  className?: string;

  /** Custom style */
  style?: React.CSSProperties;

  /** Children components */
  children?: React.ReactNode;
}

export interface WizardContextValue {
  /** Wizard steps */
  steps: WizardStep[];

  /** Current step index */
  currentStep: number;

  /** Step data */
  stepData: Record<number, any>;

  /** Step errors */
  stepErrors: Record<number, string[]>;

  /** Whether this is the first step */
  isFirstStep: boolean;

  /** Whether this is the last step */
  isLastStep: boolean;

  /** Progress percentage */
  progress: number;

  /** Step change handler */
  onStepChange: (stepIndex: number) => void;

  /** Step data change handler */
  onStepDataChange: (stepIndex: number, data: any) => void;

  /** Step validation handler */
  onStepValidation: (stepIndex: number, errors: string[]) => void;

  /** Check if step is completed */
  isStepCompleted: (stepIndex: number) => boolean;

  /** Check if step is accessible */
  isStepAccessible: (stepIndex: number) => boolean;

  /** Visual variant */
  variant: WizardVariant;

  /** Size */
  size: WizardSize;
}

// Ref types
export type WizardRef = HTMLDivElement;
