import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { getToken } from '../../tokens';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { Progress } from '../../atoms/Progress';
import {
  WizardProps,
  WizardRef,
  WizardContextValue,
} from './Wizard.types';
import {
  wizardVariants,
  wizardHeaderVariants,
  wizardContentVariants,
  wizardFooterVariants,
} from './Wizard.variants';

const WizardContext = React.createContext<WizardContextValue | null>(null);

const useWizardContext = () => {
  const context = React.useContext(WizardContext);
  if (!context) {
    throw new Error('Wizard components must be used within a Wizard');
  }
  return context;
};

const StyledWizard = styled.div<{
  $variant: string;
  $size: string;
  $orientation: string;
}>`
  width: 100%;
  ${({ $variant, $size, $orientation }) =>
    wizardVariants({
      variant: $variant,
      size: $size,
      orientation: $orientation,
    })}
`;

const StyledWizardHeader = styled.div<{ $variant: string; $size: string }>`
  ${({ $variant, $size }) =>
    wizardHeaderVariants({ variant: $variant, size: $size })}
`;

const StyledWizardSteps = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${getToken('spacing.6')};
`;

const StyledWizardStep = styled.div<{
  $variant: string;
  $size: string;
  $active: boolean;
  $completed: boolean;
  $disabled: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${getToken('spacing.2')};
  flex: 1;
  position: relative;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  transition: all ${getToken('motion.duration.normal')}
    ${getToken('motion.easing.inOut')};

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    top: ${getToken('spacing.4')};
    left: 50%;
    width: 100%;
    height: ${getToken('borderWidth.sm')};
    background: ${({ $completed, $active }) =>
      $completed ? getToken('colors.primary') : getToken('colors.border')};
    transform: translateX(50%);
    z-index: 0;
  }
`;

const StyledWizardStepIcon = styled.div<{
  $variant: string;
  $size: string;
  $active: boolean;
  $completed: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${getToken('spacing.8')};
  height: ${getToken('spacing.8')};
  border-radius: 50%;
  background: ${({ $active, $completed }) =>
    $completed
      ? getToken('colors.primary')
      : $active
        ? getToken('colors.primary.muted')
        : getToken('colors.muted')};
  color: ${({ $active, $completed }) =>
    $completed || $active
      ? getToken('colors.primary.foreground')
      : getToken('colors.muted.foreground')};
  border: ${getToken('borderWidth.md')} solid
    ${({ $active, $completed }) =>
      $completed
        ? getToken('colors.primary')
        : $active
          ? getToken('colors.primary')
          : getToken('colors.border')};
  z-index: 1;
  transition: all ${getToken('motion.duration.normal')}
    ${getToken('motion.easing.inOut')};
`;

const StyledWizardStepLabel = styled.div<{
  $variant: string;
  $size: string;
  $active: boolean;
  $completed: boolean;
}>`
  font-size: ${getToken('typography.fontSize.sm')};
  font-weight: ${({ $active, $completed }) =>
    $active || $completed
      ? getToken('typography.fontWeight.medium')
      : getToken('typography.fontWeight.normal')};
  color: ${({ $active, $completed }) =>
    $active || $completed
      ? getToken('colors.foreground')
      : getToken('colors.muted.foreground')};
  text-align: center;
  transition: all ${getToken('motion.duration.normal')}
    ${getToken('motion.easing.inOut')};
`;

const StyledWizardContent = styled.div<{ $variant: string; $size: string }>`
  ${({ $variant, $size }) =>
    wizardContentVariants({ variant: $variant, size: $size })}
`;

const StyledWizardStepContent = styled.div`
  min-height: ${getToken('spacing.32')};
`;

const StyledWizardFooter = styled.div<{ $variant: string; $size: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${getToken('spacing.3')};
  margin-top: ${getToken('spacing.6')};
  padding-top: ${getToken('spacing.4')};
  border-top: ${getToken('borderWidth.sm')} solid ${getToken('colors.border')};

  ${({ $variant, $size }) =>
    wizardFooterVariants({ variant: $variant, size: $size })}
`;

const StyledWizardProgress = styled.div`
  margin-bottom: ${getToken('spacing.4')};
`;

const Wizard = React.forwardRef<WizardRef, WizardProps>(
  (
    {
      steps = [],
      currentStep = 0,
      variant = 'default',
      size = 'md',
      orientation = 'horizontal',
      showProgress = true,
      showStepNumbers = true,
      allowStepNavigation = true,
      onStepChange,
      onComplete,
      onCancel,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const [stepData, setStepData] = useState<Record<number, any>>({});
    const [stepErrors, setStepErrors] = useState<Record<number, string[]>>({});

    // Get current step
    const currentStepData = steps[currentStep];
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === steps.length - 1;
    const progress = ((currentStep + 1) / steps.length) * 100;

    // Handle step navigation
    const handleStepChange = useCallback(
      (newStep: number) => {
        if (newStep >= 0 && newStep < steps.length && allowStepNavigation) {
          onStepChange?.(newStep);
        }
      },
      [steps.length, allowStepNavigation, onStepChange]
    );

    // Handle next step
    const handleNext = useCallback(() => {
      if (!isLastStep) {
        handleStepChange(currentStep + 1);
      } else {
        onComplete?.(stepData);
      }
    }, [isLastStep, currentStep, handleStepChange, onComplete, stepData]);

    // Handle previous step
    const handlePrevious = useCallback(() => {
      if (!isFirstStep) {
        handleStepChange(currentStep - 1);
      }
    }, [isFirstStep, currentStep, handleStepChange]);

    // Handle step data change
    const handleStepDataChange = useCallback((stepIndex: number, data: any) => {
      setStepData(prev => ({ ...prev, [stepIndex]: data }));
    }, []);

    // Handle step validation
    const handleStepValidation = useCallback(
      (stepIndex: number, errors: string[]) => {
        setStepErrors(prev => ({ ...prev, [stepIndex]: errors }));
      },
      []
    );

    // Check if current step is valid
    const isCurrentStepValid = useMemo(() => {
      const currentErrors = stepErrors[currentStep] || [];
      return currentErrors.length === 0;
    }, [stepErrors, currentStep]);

    // Check if step is completed
    const isStepCompleted = useCallback(
      (stepIndex: number) => {
        return stepData[stepIndex] !== undefined;
      },
      [stepData]
    );

    // Check if step is accessible
    const isStepAccessible = useCallback(
      (stepIndex: number) => {
        if (!allowStepNavigation) return false;
        if (stepIndex <= currentStep) return true;

        // Check if all previous steps are completed
        for (let i = 0; i < stepIndex; i++) {
          if (!isStepCompleted(i)) return false;
        }
        return true;
      },
      [allowStepNavigation, currentStep, isStepCompleted]
    );

    const contextValue: WizardContextValue = {
      steps,
      currentStep,
      stepData,
      stepErrors,
      isFirstStep,
      isLastStep,
      progress,
      onStepChange: handleStepChange,
      onStepDataChange: handleStepDataChange,
      onStepValidation: handleStepValidation,
      isStepCompleted,
      isStepAccessible,
      variant,
      size,
    };

    return (
      <WizardContext.Provider value={contextValue}>
        <StyledWizard
          ref={ref}
          $variant={variant}
          $size={size}
          $orientation={orientation}
          className={className}
          style={style}
          {...props}
        >
          {/* Header with Steps */}
          <StyledWizardHeader $variant={variant} $size={size}>
            {showProgress && (
              <StyledWizardProgress>
                <Progress value={progress} variant={variant} size={size} />
              </StyledWizardProgress>
            )}

            <StyledWizardSteps>
              {steps.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = isStepCompleted(index);
                const isAccessible = isStepAccessible(index);

                return (
                  <StyledWizardStep
                    key={index}
                    $variant={variant}
                    $size={size}
                    $active={isActive}
                    $completed={isCompleted}
                    $disabled={!isAccessible}
                    onClick={() => isAccessible && handleStepChange(index)}
                  >
                    <StyledWizardStepIcon
                      $variant={variant}
                      $size={size}
                      $active={isActive}
                      $completed={isCompleted}
                    >
                      {isCompleted ? (
                        <Icon name="check" size="sm" />
                      ) : showStepNumbers ? (
                        <span>{index + 1}</span>
                      ) : (
                        <Icon name={step.icon || 'circle'} size="sm" />
                      )}
                    </StyledWizardStepIcon>

                    <StyledWizardStepLabel
                      $variant={variant}
                      $size={size}
                      $active={isActive}
                      $completed={isCompleted}
                    >
                      {step.title}
                    </StyledWizardStepLabel>
                  </StyledWizardStep>
                );
              })}
            </StyledWizardSteps>
          </StyledWizardHeader>

          {/* Content */}
          <StyledWizardContent $variant={variant} $size={size}>
            <StyledWizardStepContent>
              {currentStepData && (
                <>
                  {currentStepData.title && (
                    <h2 style={{ marginBottom: getToken('spacing.4') }}>
                      {currentStepData.title}
                    </h2>
                  )}

                  {currentStepData.description && (
                    <p
                      style={{
                        marginBottom: getToken('spacing.6'),
                        color: getToken('colors.muted.foreground'),
                      }}
                    >
                      {currentStepData.description}
                    </p>
                  )}

                  {currentStepData.content && (
                    <div>
                      {typeof currentStepData.content === 'function'
                        ? currentStepData.content({
                            data: stepData[currentStep],
                            onChange: (data: any) =>
                              handleStepDataChange(currentStep, data),
                            onValidation: (errors: string[]) =>
                              handleStepValidation(currentStep, errors),
                          })
                        : currentStepData.content}
                    </div>
                  )}
                </>
              )}

              {children}
            </StyledWizardStepContent>
          </StyledWizardContent>

          {/* Footer */}
          <StyledWizardFooter $variant={variant} $size={size}>
            <div>
              {!isFirstStep && (
                <Button variant="outline" size={size} onClick={handlePrevious}>
                  <Icon name="chevron-left" size="sm" />
                  Previous
                </Button>
              )}
            </div>

            <div style={{ display: 'flex', gap: getToken('spacing.2') }}>
              {onCancel && (
                <Button variant="ghost" size={size} onClick={onCancel}>
                  Cancel
                </Button>
              )}

              <Button
                variant={isLastStep ? 'default' : 'default'}
                size={size}
                onClick={handleNext}
                disabled={!isCurrentStepValid}
              >
                {isLastStep ? (
                  <>
                    Complete
                    <Icon name="check" size="sm" />
                  </>
                ) : (
                  <>
                    Next
                    <Icon name="chevron-right" size="sm" />
                  </>
                )}
              </Button>
            </div>
          </StyledWizardFooter>
        </StyledWizard>
      </WizardContext.Provider>
    );
  }
);

Wizard.displayName = 'Wizard';

export { Wizard, useWizardContext };
