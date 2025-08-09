import React from 'react';
import {
  CommandDialog,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from '../components/Command';

const meta = {
  title: 'Design System/Command',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

export const Basic = {
  render: () => (
    <Command className="w-[420px]">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            Calendar
            <CommandShortcut>⌘C</CommandShortcut>
          </CommandItem>
          <CommandItem>Search</CommandItem>
          <CommandItem>Settings</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Projects">
          <CommandItem>FinVision</CommandItem>
          <CommandItem>Design System</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const Dialog = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search commands…" />
        <CommandList>
          <CommandGroup heading="Favorites">
            <CommandItem>Dashboard</CommandItem>
            <CommandItem>Files</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    );
  },
};
