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
  DetailLayoutProps,
  DetailLayoutRef,
  DetailLayoutContextValue,
} from './DetailLayout.types';
import {
  detailLayoutVariants,
  detailLayoutMainVariants,
  detailLayoutSidebarVariants,
} from './DetailLayout.variants';

const DetailLayoutContext =
  React.createContext<DetailLayoutContextValue | null>(null);

const useDetailLayoutContext = () => {
  const context = React.useContext(DetailLayoutContext);
  if (!context) {
    throw new Error(
      'DetailLayout components must be used within a DetailLayout'
    );
  }
  return context;
};

const StyledDetailLayout = styled.div<{
  $variant: string;
  $size: string;
  $hasSidebar: boolean;
}>`
  display: flex;
  min-height: 100vh;
  ${({ $variant, $size, $hasSidebar }) =>
    detailLayoutVariants({
      variant: $variant,
      size: $size,
      hasSidebar: $hasSidebar,
    })}
`;

const StyledDetailLayoutMain = styled.main<{
  $variant: string;
  $size: string;
  $hasSidebar: boolean;
}>`
  flex: 1;
  display: flex;
  flex-direction: column;
  ${({ $variant, $size, $hasSidebar }) =>
    detailLayoutMainVariants({
      variant: $variant,
      size: $size,
      hasSidebar: $hasSidebar,
    })}
`;

const StyledDetailLayoutContent = styled.div`
  flex: 1;
  padding: ${getToken('spacing.6')};
  overflow-y: auto;
`;

const StyledDetailLayoutSidebar = styled.aside<{
  $variant: string;
  $size: string;
}>`
  ${({ $variant, $size }) =>
    detailLayoutSidebarVariants({ variant: $variant, size: $size })}
`;

const StyledDetailLayoutBreadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.2')};
  margin-bottom: ${getToken('spacing.6')};
  font-size: ${getToken('typography.fontSize.sm')};
  color: ${getToken('colors.muted.foreground')};
`;

const StyledDetailLayoutPageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${getToken('spacing.6')};
  gap: ${getToken('spacing.4')};
`;

const StyledDetailLayoutPageInfo = styled.div`
  flex: 1;
`;

const StyledDetailLayoutPageTitle = styled.div`
  font-size: ${getToken('typography.fontSize.3xl')};
  font-weight: ${getToken('typography.fontWeight.bold')};
  color: ${getToken('colors.foreground')};
  margin-bottom: ${getToken('spacing.2')};
`;

const StyledDetailLayoutPageSubtitle = styled.div`
  font-size: ${getToken('typography.fontSize.base')};
  color: ${getToken('colors.muted.foreground')};
  margin-bottom: ${getToken('spacing.3')};
`;

const StyledDetailLayoutPageMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.4')};
  flex-wrap: wrap;
`;

const StyledDetailLayoutPageMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.1')};
  font-size: ${getToken('typography.fontSize.sm')};
  color: ${getToken('colors.muted.foreground')};
`;

const StyledDetailLayoutPageActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.3')};
  flex-shrink: 0;
`;

const StyledDetailLayoutContentSection = styled.div`
  margin-bottom: ${getToken('spacing.6')};
`;

const StyledDetailLayoutContentTitle = styled.div`
  font-size: ${getToken('typography.fontSize.lg')};
  font-weight: ${getToken('typography.fontWeight.semibold')};
  color: ${getToken('colors.foreground')};
  margin-bottom: ${getToken('spacing.4')};
`;

const StyledDetailLayoutSidebarContent = styled.div`
  padding: ${getToken('spacing.6')};
  height: 100%;
  overflow-y: auto;
`;

const StyledDetailLayoutSidebarSection = styled.div`
  margin-bottom: ${getToken('spacing.6')};

  &:last-child {
    margin-bottom: 0;
  }
`;

const StyledDetailLayoutSidebarTitle = styled.h3`
  font-size: ${getToken('typography.fontSize.lg')};
  font-weight: ${getToken('typography.fontWeight.semibold')};
  color: ${getToken('colors.foreground')};
  margin-bottom: ${getToken('spacing.3')};
`;

const StyledDetailLayoutStatus = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.2')};
  margin-bottom: ${getToken('spacing.4')};
`;

const DetailLayout = React.forwardRef<DetailLayoutRef, DetailLayoutProps>(
  (
    {
      header,
      footer,
      form,
      sidebar,
      title,
      subtitle,
      breadcrumb,
      status,
      meta = [],
      actions = [],
      variant = 'default',
      size = 'md',
      onActionClick,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const [isEditing, setIsEditing] = useState(false);

    // Handle action click
    const handleActionClick = useCallback(
      (action: any) => {
        if (action.key === 'edit') {
          setIsEditing(true);
        } else if (action.key === 'save') {
          setIsEditing(false);
        } else if (action.key === 'cancel') {
          setIsEditing(false);
        }
        onActionClick?.(action);
      },
      [onActionClick]
    );

    const contextValue: DetailLayoutContextValue = {
      isEditing,
      setIsEditing,
      onActionClick: handleActionClick,
      variant,
      size,
    };

    return (
      <DetailLayoutContext.Provider value={contextValue}>
        <StyledDetailLayout
          ref={ref}
          $variant={variant}
          $size={size}
          $hasSidebar={!!sidebar}
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
          <StyledDetailLayoutMain
            $variant={variant}
            $size={size}
            $hasSidebar={!!sidebar}
          >
            {/* Content */}
            <StyledDetailLayoutContent>
              {/* Breadcrumb */}
              {breadcrumb && (
                <StyledDetailLayoutBreadcrumb>
                  {breadcrumb.map((item, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <Icon name="chevron-right" size="sm" />}
                      <span>{item}</span>
                    </React.Fragment>
                  ))}
                </StyledDetailLayoutBreadcrumb>
              )}

              {/* Page Header */}
              {(title || actions.length > 0) && (
                <StyledDetailLayoutPageHeader>
                  <StyledDetailLayoutPageInfo>
                    {title && (
                      <StyledDetailLayoutPageTitle>
                        {title}
                      </StyledDetailLayoutPageTitle>
                    )}

                    {subtitle && (
                      <StyledDetailLayoutPageSubtitle>
                        {subtitle}
                      </StyledDetailLayoutPageSubtitle>
                    )}

                    {/* Status */}
                    {status && (
                      <StyledDetailLayoutStatus>
                        <Badge variant={status.variant} size="sm">
                          {status.icon && <Icon name={status.icon} size="xs" />}
                          {status.text}
                        </Badge>
                      </StyledDetailLayoutStatus>
                    )}

                    {/* Meta Information */}
                    {meta.length > 0 && (
                      <StyledDetailLayoutPageMeta>
                        {meta.map((item, index) => (
                          <StyledDetailLayoutPageMetaItem key={index}>
                            {item.icon && <Icon name={item.icon} size="sm" />}
                            <span>
                              {item.label}: {item.value}
                            </span>
                          </StyledDetailLayoutPageMetaItem>
                        ))}
                      </StyledDetailLayoutPageMeta>
                    )}
                  </StyledDetailLayoutPageInfo>

                  {/* Actions */}
                  {actions.length > 0 && (
                    <StyledDetailLayoutPageActions>
                      {actions.map((action, index) => (
                        <Button
                          key={index}
                          variant={action.variant || 'default'}
                          size={size}
                          onClick={() => handleActionClick(action)}
                          disabled={action.disabled}
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
                    </StyledDetailLayoutPageActions>
                  )}
                </StyledDetailLayoutPageHeader>
              )}

              {/* Content Sections */}
              <StyledDetailLayoutContentSection>
                {form && (
                  <Form
                    {...form.props}
                    variant={form.props.variant || variant}
                    size={form.props.size || size}
                    disabled={!isEditing}
                  >
                    {form.props.children}
                  </Form>
                )}

                {children}
              </StyledDetailLayoutContentSection>
            </StyledDetailLayoutContent>

            {/* Sidebar */}
            {sidebar && (
              <StyledDetailLayoutSidebar $variant={variant} $size={size}>
                <StyledDetailLayoutSidebarContent>
                  {sidebar.map((section, index) => (
                    <StyledDetailLayoutSidebarSection key={index}>
                      {section.title && (
                        <StyledDetailLayoutSidebarTitle>
                          {section.title}
                        </StyledDetailLayoutSidebarTitle>
                      )}
                      {section.content}
                    </StyledDetailLayoutSidebarSection>
                  ))}
                </StyledDetailLayoutSidebarContent>
              </StyledDetailLayoutSidebar>
            )}
          </StyledDetailLayoutMain>

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
        </StyledDetailLayout>
      </DetailLayoutContext.Provider>
    );
  }
);

DetailLayout.displayName = 'DetailLayout';

export { DetailLayout, useDetailLayoutContext };
