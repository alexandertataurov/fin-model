import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { getToken } from '../../tokens';
import { Header } from '../../organisms/Header';
import { Footer } from '../../organisms/Footer';
import { Form } from '../../organisms/Form';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';
import {
  FormLayoutProps,
  FormLayoutRef,
  FormLayoutContextValue,
} from './FormLayout.types';
import {
  formLayoutVariants,
  formLayoutMainVariants,
  formLayoutSidebarVariants,
} from './FormLayout.variants';

const FormLayoutContext = React.createContext<FormLayoutContextValue | null>(
  null
);

const useFormLayoutContext = () => {
  const context = React.useContext(FormLayoutContext);
  if (!context) {
    throw new Error('FormLayout components must be used within a FormLayout');
  }
  return context;
};

const StyledFormLayout = styled.div<{
  $variant: string;
  $size: string;
  $layout: string;
}>`
  display: flex;
  min-height: 100vh;
  ${({ $variant, $size, $layout }) =>
    formLayoutVariants({ variant: $variant, size: $size, layout: $layout })}
`;

const StyledFormLayoutMain = styled.main<{
  $variant: string;
  $size: string;
  $hasSidebar: boolean;
}>`
  flex: 1;
  display: flex;
  flex-direction: column;
  ${({ $variant, $size, $hasSidebar }) =>
    formLayoutMainVariants({
      variant: $variant,
      size: $size,
      hasSidebar: $hasSidebar,
    })}
`;

const StyledFormLayoutContent = styled.div`
  flex: 1;
  padding: ${getToken('spacing.6')};
  overflow-y: auto;
`;

const StyledFormLayoutSidebar = styled.aside<{
  $variant: string;
  $size: string;
}>`
  ${({ $variant, $size }) =>
    formLayoutSidebarVariants({ variant: $variant, size: $size })}
`;

const StyledFormLayoutBreadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.2')};
  margin-bottom: ${getToken('spacing.6')};
  font-size: ${getToken('typography.fontSize.sm')};
  color: ${getToken('colors.muted.foreground')};
`;

const StyledFormLayoutPageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${getToken('spacing.6')};
  gap: ${getToken('spacing.4')};
`;

const StyledFormLayoutPageTitle = styled.div`
  font-size: ${getToken('typography.fontSize.2xl')};
  font-weight: ${getToken('typography.fontWeight.bold')};
  color: ${getToken('colors.foreground')};
`;

const StyledFormLayoutPageActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.3')};
`;

const StyledFormLayoutFormContainer = styled.div`
  max-width: ${getToken('spacing.4xl')};
  margin: 0 auto;
  width: 100%;
`;

const StyledFormLayoutSidebarContent = styled.div`
  padding: ${getToken('spacing.6')};
  height: 100%;
  overflow-y: auto;
`;

const StyledFormLayoutSidebarSection = styled.div`
  margin-bottom: ${getToken('spacing.6')};

  &:last-child {
    margin-bottom: 0;
  }
`;

const StyledFormLayoutSidebarTitle = styled.h3`
  font-size: ${getToken('typography.fontSize.lg')};
  font-weight: ${getToken('typography.fontWeight.semibold')};
  color: ${getToken('colors.foreground')};
  margin-bottom: ${getToken('spacing.3')};
`;

const FormLayout = React.forwardRef<FormLayoutRef, FormLayoutProps>(
  (
    {
      header,
      footer,
      form,
      sidebar,
      title,
      breadcrumb,
      actions = [],
      variant = 'default',
      size = 'md',
      layout = 'centered',
      onFormSubmit,
      onFormReset,
      onCancel,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle form submission
    const handleFormSubmit = useCallback(
      async (data: Record<string, any>) => {
        setIsSubmitting(true);
        try {
          await onFormSubmit?.(data);
        } catch (error) {
          console.error('Form submission error:', error);
        } finally {
          setIsSubmitting(false);
        }
      },
      [onFormSubmit]
    );

    // Handle form reset
    const handleFormReset = useCallback(() => {
      setFormData({});
      setFormErrors({});
      onFormReset?.();
    }, [onFormReset]);

    // Handle cancel
    const handleCancel = useCallback(() => {
      onCancel?.();
    }, [onCancel]);

    const contextValue: FormLayoutContextValue = {
      formData,
      setFormData,
      formErrors,
      setFormErrors,
      isSubmitting,
      variant,
      size,
      onFormSubmit: handleFormSubmit,
      onFormReset: handleFormReset,
      onCancel: handleCancel,
    };

    return (
      <FormLayoutContext.Provider value={contextValue}>
        <StyledFormLayout
          ref={ref}
          $variant={variant}
          $size={size}
          $layout={layout}
          className={className}
          style={style}
          {...props}
        >
          {/* Header */}
          {header && (
            <Header
              {...header.props}
              variant={header.props.variant || variant}
              size={header.props.size || size}
            >
              {header.props.children}
            </Header>
          )}

          {/* Main Content */}
          <StyledFormLayoutMain
            $variant={variant}
            $size={size}
            $hasSidebar={!!sidebar}
          >
            {/* Content */}
            <StyledFormLayoutContent>
              {/* Breadcrumb */}
              {breadcrumb && (
                <StyledFormLayoutBreadcrumb>
                  {breadcrumb.map((item, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <Icon name="chevron-right" size="sm" />}
                      <span>{item}</span>
                    </React.Fragment>
                  ))}
                </StyledFormLayoutBreadcrumb>
              )}

              {/* Page Header */}
              {(title || actions.length > 0) && (
                <StyledFormLayoutPageHeader>
                  {title && (
                    <StyledFormLayoutPageTitle>
                      {title}
                    </StyledFormLayoutPageTitle>
                  )}

                  {actions.length > 0 && (
                    <StyledFormLayoutPageActions>
                      {actions.map((action, index) => (
                        <Button
                          key={index}
                          variant={action.variant || 'default'}
                          size={size}
                          onClick={action.onClick}
                          disabled={action.disabled || isSubmitting}
                        >
                          {action.icon && <Icon name={action.icon} size="sm" />}
                          {action.label}
                          {action.badge && (
                            <Badge variant={action.badge.variant} size="sm">
                              {action.badge.text}
                            </Badge>
                          )}
                        </Button>
                      ))}
                    </StyledFormLayoutPageActions>
                  )}
                </StyledFormLayoutPageHeader>
              )}

              {/* Form Container */}
              <StyledFormLayoutFormContainer>
                {form && (
                  <Form
                    {...form.props}
                    variant={form.props.variant || variant}
                    size={form.props.size || size}
                    loading={isSubmitting}
                    onSubmit={handleFormSubmit}
                    onReset={handleFormReset}
                  >
                    {form.props.children}
                  </Form>
                )}

                {children}
              </StyledFormLayoutFormContainer>
            </StyledFormLayoutContent>

            {/* Sidebar */}
            {sidebar && (
              <StyledFormLayoutSidebar $variant={variant} $size={size}>
                <StyledFormLayoutSidebarContent>
                  {sidebar.map((section, index) => (
                    <StyledFormLayoutSidebarSection key={index}>
                      {section.title && (
                        <StyledFormLayoutSidebarTitle>
                          {section.title}
                        </StyledFormLayoutSidebarTitle>
                      )}
                      {section.content}
                    </StyledFormLayoutSidebarSection>
                  ))}
                </StyledFormLayoutSidebarContent>
              </StyledFormLayoutSidebar>
            )}
          </StyledFormLayoutMain>

          {/* Footer */}
          {footer && (
            <Footer
              {...footer.props}
              variant={footer.props.variant || variant}
              size={footer.props.size || size}
            >
              {footer.props.children}
            </Footer>
          )}
        </StyledFormLayout>
      </FormLayoutContext.Provider>
    );
  }
);

FormLayout.displayName = 'FormLayout';

export { FormLayout, useFormLayoutContext };
