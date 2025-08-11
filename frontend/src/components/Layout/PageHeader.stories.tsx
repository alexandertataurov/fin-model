import type { Meta, StoryObj } from '@storybook/react';
import { PageHeader } from './PageHeader';

const meta: Meta<typeof PageHeader> = {
    title: 'Layout/PageHeader',
    component: PageHeader,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'Page header component for consistent page layout and navigation.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        children: {
            control: false,
        },
        className: {
            control: 'text',
        },
    },
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

// DEFAULT STORIES
export const Default: Story = {
    args: {
        children: (
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Page Title</h1>
                <p className="text-gray-600 mt-1">Page description goes here</p>
            </div>
        ),
    },
};

// CONTENT STORIES
export const WithBreadcrumbs: Story = {
    args: {
        children: (
            <div>
                <nav className="flex" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-4">
                        <li>
                            <a href="#" className="text-gray-400 hover:text-gray-500">
                                Home
                            </a>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                                <a href="#" className="ml-4 text-gray-400 hover:text-gray-500">
                                    Admin
                                </a>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="ml-4 text-gray-500">Dashboard</span>
                            </div>
                        </li>
                    </ol>
                </nav>
                <div className="mt-4">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-1">Monitor and manage system performance</p>
                </div>
            </div>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the page header with breadcrumb navigation.',
            },
        },
    },
};

export const WithActions: Story = {
    args: {
        children: (
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Export
                    </button>
                    <button className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700">
                        Add User
                    </button>
                </div>
            </div>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the page header with action buttons.',
            },
        },
    },
};

export const WithStats: Story = {
    args: {
        children: (
            <div>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                        <p className="text-gray-600 mt-1">Real-time system analytics and metrics</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Last updated</p>
                        <p className="text-sm font-medium text-gray-900">2 minutes ago</p>
                    </div>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                                        <dd className="text-lg font-medium text-gray-900">1,234</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Active Users</dt>
                                        <dd className="text-lg font-medium text-gray-900">987</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the page header with statistics cards.',
            },
        },
    },
};

export const WithTabs: Story = {
    args: {
        children: (
            <div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600 mt-1">Manage your account and application settings</p>
                </div>
                <div className="mt-6">
                    <nav className="flex space-x-8">
                        <a href="#" className="border-blue-500 text-gray-900 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                            Profile
                        </a>
                        <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                            Security
                        </a>
                        <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                            Notifications
                        </a>
                        <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                            Billing
                        </a>
                    </nav>
                </div>
            </div>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the page header with tab navigation.',
            },
        },
    },
};

// RESPONSIVE DESIGN STORIES
export const MobileResponsive: Story = {
    args: {
        children: (
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Mobile Dashboard</h1>
                    <p className="text-sm text-gray-600 mt-1">Optimized for mobile devices</p>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        ),
    },
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
        docs: {
            description: {
                story: 'Shows how the page header adapts to mobile screen sizes.',
            },
        },
    },
};

export const TabletResponsive: Story = {
    args: {
        children: (
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tablet Dashboard</h1>
                    <p className="text-gray-600 mt-1">Optimized for tablet devices</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Settings
                    </button>
                    <button className="px-3 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700">
                        New Item
                    </button>
                </div>
            </div>
        ),
    },
    parameters: {
        viewport: {
            defaultViewport: 'tablet',
        },
        docs: {
            description: {
                story: 'Shows how the page header adapts to tablet screen sizes.',
            },
        },
    },
};

export const DesktopWide: Story = {
    args: {
        children: (
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Desktop Dashboard</h1>
                    <p className="text-lg text-gray-600 mt-2">Full-featured dashboard for desktop users</p>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Export Data
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Settings
                    </button>
                    <button className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700">
                        Create New
                    </button>
                </div>
            </div>
        ),
    },
    parameters: {
        viewport: {
            defaultViewport: 'desktop',
        },
        docs: {
            description: {
                story: 'Shows the page header on wide desktop screens.',
            },
        },
    },
};

// ACCESSIBILITY STORIES
export const AccessibilityFocused: Story = {
    args: {
        children: (
            <div>
                <nav className="flex" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-4">
                        <li>
                            <a href="#" className="text-gray-400 hover:text-gray-500" aria-label="Go to home page">
                                Home
                            </a>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                                <a href="#" className="ml-4 text-gray-400 hover:text-gray-500" aria-label="Go to admin section">
                                    Admin
                                </a>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="ml-4 text-gray-500" aria-current="page">Dashboard</span>
                            </div>
                        </li>
                    </ol>
                </nav>
                <div className="mt-4">
                    <h1 className="text-2xl font-bold text-gray-900">Accessible Dashboard</h1>
                    <p className="text-gray-600 mt-1">Page header with proper accessibility features</p>
                </div>
            </div>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the page header with accessibility features highlighted for testing.',
            },
        },
        a11y: {
            config: {
                rules: [
                    {
                        id: 'color-contrast',
                        enabled: true,
                    },
                    {
                        id: 'heading-order',
                        enabled: true,
                    },
                    {
                        id: 'link-name',
                        enabled: true,
                    },
                ],
            },
        },
    },
};

// THEME STORIES
export const DarkTheme: Story = {
    args: {
        children: (
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dark Theme Header</h1>
                    <p className="text-gray-300 mt-1">Page header with dark theme styling</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700">
                        Settings
                    </button>
                    <button className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700">
                        Action
                    </button>
                </div>
            </div>
        ),
        className: "bg-gray-900 border-gray-700",
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the page header with dark theme styling.',
            },
        },
    },
};

// CUSTOM STYLING STORIES
export const WithCustomStyling: Story = {
    args: {
        children: (
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-purple-900">Custom Styled Header</h1>
                    <p className="text-purple-600 mt-1">Page header with custom purple theme</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 border border-purple-300 rounded-md text-sm font-medium text-purple-700 hover:bg-purple-50">
                        Settings
                    </button>
                    <button className="px-4 py-2 bg-purple-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-purple-700">
                        Action
                    </button>
                </div>
            </div>
        ),
        className: "bg-purple-50 border-purple-200",
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the page header with custom styling applied.',
            },
        },
    },
};

// INTEGRATION STORIES
export const WithSearchBar: Story = {
    args: {
        children: (
            <div>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Search Dashboard</h1>
                        <p className="text-gray-600 mt-1">Find what you're looking for</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Filters
                        </button>
                        <button className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700">
                            Advanced Search
                        </button>
                    </div>
                </div>
                <div className="mt-4">
                    <div className="max-w-lg">
                        <label htmlFor="search" className="sr-only">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                id="search"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Search..."
                                type="search"
                            />
                        </div>
                    </div>
                </div>
            </div>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the page header integrated with a search bar.',
            },
        },
    },
};
