import React from 'react';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '../components/NavigationMenu';

const meta = {
  title: 'Design System/NavigationMenu',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

export const Basic = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="p-4 w-64">
              <a className="block rounded-md p-2 hover:bg-accent" href="#">
                Analytics
              </a>
              <a className="block rounded-md p-2 hover:bg-accent" href="#">
                Monitoring
              </a>
              <a className="block rounded-md p-2 hover:bg-accent" href="#">
                Reporting
              </a>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="px-4 py-2">
            Docs
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};
