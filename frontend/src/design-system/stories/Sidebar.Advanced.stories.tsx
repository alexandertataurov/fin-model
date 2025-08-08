import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '../components/Sidebar';

const meta = {
  title: 'Design System/Sidebar/Advanced',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

function Layout({
  variant,
  collapsible,
}: {
  variant: 'sidebar' | 'floating' | 'inset';
  collapsible?: 'offcanvas' | 'icon' | 'none';
}) {
  return (
    <div className="h-64 rounded-md border overflow-hidden">
      <SidebarProvider>
        <div className="flex h-full">
          <Sidebar variant={variant} collapsible={collapsible}>
            <SidebarHeader />
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Menu</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>Dashboard</SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Reports</SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
          </Sidebar>
          <SidebarInset className="p-3 w-full">
            <div className="text-sm text-muted-foreground">Content area</div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}

export const Floating = { render: () => <Layout variant="floating" /> };
export const Inset = { render: () => <Layout variant="inset" /> };
export const IconOnly = {
  render: () => <Layout variant="sidebar" collapsible="icon" />,
};
