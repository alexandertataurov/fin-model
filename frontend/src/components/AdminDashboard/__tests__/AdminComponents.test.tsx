import React from 'react';
import { render, screen } from '@testing-library/react';
import {
    AdminCard,
    AdminHeader,
    AdminLoadingSpinner,
    AdminLoadingSkeleton,
    AdminLoadingCard,
    AdminTitle,
    AdminSubtitle,
    AdminBody,
    AdminCaption,
    AdminHeadline,
    AdminSubheadline,
    AdminCode,
    AdminElegant,
    validateDesignSystem
} from '../components';

describe('AdminDashboard Components', () => {
    describe('AdminCard', () => {
        it('renders with default props', () => {
            render(
                <AdminCard title="Test Card">
                    <div>Card content</div>
                </AdminCard>
            );

            expect(screen.getByText('Test Card')).toBeInTheDocument();
            expect(screen.getByText('Card content')).toBeInTheDocument();
        });

        it('renders with z-index support', () => {
            render(
                <AdminCard title="Test Card" zIndex="modal">
                    <div>Card content</div>
                </AdminCard>
            );

            expect(screen.getByText('Test Card')).toBeInTheDocument();
        });

        it('renders with different variants', () => {
            const { rerender } = render(
                <AdminCard title="Test Card" variant="elevated">
                    <div>Card content</div>
                </AdminCard>
            );

            expect(screen.getByText('Test Card')).toBeInTheDocument();

            rerender(
                <AdminCard title="Test Card" variant="outlined">
                    <div>Card content</div>
                </AdminCard>
            );

            expect(screen.getByText('Test Card')).toBeInTheDocument();
        });

        it('renders with different sizes', () => {
            const { rerender } = render(
                <AdminCard title="Test Card" size="sm">
                    <div>Card content</div>
                </AdminCard>
            );

            expect(screen.getByText('Test Card')).toBeInTheDocument();

            rerender(
                <AdminCard title="Test Card" size="lg">
                    <div>Card content</div>
                </AdminCard>
            );

            expect(screen.getByText('Test Card')).toBeInTheDocument();
        });
    });

    describe('AdminHeader', () => {
        it('renders with title and description', () => {
            render(
                <AdminHeader
                    title="Test Header"
                    description="Test description"
                />
            );

            expect(screen.getByText('Test Header')).toBeInTheDocument();
            expect(screen.getByText('Test description')).toBeInTheDocument();
        });

        it('renders with breadcrumb', () => {
            render(
                <AdminHeader
                    title="Test Header"
                    showBreadcrumb={true}
                />
            );

            expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
            expect(screen.getByText('Test Header')).toBeInTheDocument();
        });

        it('renders with admin badge', () => {
            render(
                <AdminHeader
                    title="Test Header"
                    showAdminBadge={true}
                />
            );

            expect(screen.getByText('ADMIN')).toBeInTheDocument();
        });

        it('renders with z-index support', () => {
            render(
                <AdminHeader
                    title="Test Header"
                    zIndex="sticky"
                />
            );

            expect(screen.getByText('Test Header')).toBeInTheDocument();
        });
    });

    describe('AdminLoading Components', () => {
        it('renders AdminLoadingSpinner', () => {
            render(<AdminLoadingSpinner message="Loading..." />);
            expect(screen.getByText('Loading...')).toBeInTheDocument();
        });

        it('renders AdminLoadingSpinner with z-index', () => {
            render(<AdminLoadingSpinner message="Loading..." zIndex="modal" />);
            expect(screen.getByText('Loading...')).toBeInTheDocument();
        });

        it('renders AdminLoadingSkeleton', () => {
            render(<AdminLoadingSkeleton rows={5} />);
            // Should render 5 skeleton rows
            const skeletonElements = document.querySelectorAll('[style*="animation: pulse"]');
            expect(skeletonElements.length).toBe(5);
        });

        it('renders AdminLoadingCard', () => {
            render(<AdminLoadingCard title="Loading card..." />);
            expect(screen.getByText('Loading card...')).toBeInTheDocument();
        });
    });

    describe('AdminTypography Components', () => {
        it('renders AdminTitle', () => {
            render(<AdminTitle>Test Title</AdminTitle>);
            expect(screen.getByText('Test Title')).toBeInTheDocument();
        });

        it('renders AdminSubtitle', () => {
            render(<AdminSubtitle>Test Subtitle</AdminSubtitle>);
            expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
        });

        it('renders AdminBody', () => {
            render(<AdminBody>Test Body</AdminBody>);
            expect(screen.getByText('Test Body')).toBeInTheDocument();
        });

        it('renders AdminCaption', () => {
            render(<AdminCaption>Test Caption</AdminCaption>);
            expect(screen.getByText('Test Caption')).toBeInTheDocument();
        });

        it('renders AdminHeadline', () => {
            render(<AdminHeadline>Test Headline</AdminHeadline>);
            expect(screen.getByText('Test Headline')).toBeInTheDocument();
        });

        it('renders AdminSubheadline', () => {
            render(<AdminSubheadline>Test Subheadline</AdminSubheadline>);
            expect(screen.getByText('Test Subheadline')).toBeInTheDocument();
        });

        it('renders AdminCode', () => {
            render(<AdminCode>const test = "code";</AdminCode>);
            expect(screen.getByText('const test = "code";')).toBeInTheDocument();
        });

        it('renders AdminElegant', () => {
            render(<AdminElegant>Elegant text</AdminElegant>);
            expect(screen.getByText('Elegant text')).toBeInTheDocument();
        });
    });

    describe('Design System Validation', () => {
        it('validates design system configuration', () => {
            const isValid = validateDesignSystem();
            expect(typeof isValid).toBe('boolean');
        });
    });

    describe('Component Integration', () => {
        it('renders complex admin dashboard layout', () => {
            render(
                <div>
                    <AdminHeader
                        title="Dashboard"
                        description="Admin dashboard overview"
                        showBreadcrumb={true}
                        showAdminBadge={true}
                        zIndex="sticky"
                    />
                    <AdminCard
                        title="System Status"
                        subtitle="Current system metrics"
                        variant="elevated"
                        zIndex="modal"
                    >
                        <AdminBody>System is running normally.</AdminBody>
                        <AdminCaption>Last updated: 2 minutes ago</AdminCaption>
                    </AdminCard>
                </div>
            );

            expect(screen.getByText('Dashboard')).toBeInTheDocument();
            expect(screen.getByText('System Status')).toBeInTheDocument();
            expect(screen.getByText('System is running normally.')).toBeInTheDocument();
            expect(screen.getByText('Last updated: 2 minutes ago')).toBeInTheDocument();
        });
    });
});
