import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from '../components/Select';
import React from 'react';

const meta = {
  title: 'Design System/Select',
  component: Select,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

export const Basic = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithLabel = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[240px]">
        <SelectValue placeholder="Choose an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectLabel>Fruits</SelectLabel>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectSeparator />
        <SelectLabel>Vegetables</SelectLabel>
        <SelectItem value="carrot">Carrot</SelectItem>
        <SelectItem value="broccoli">Broccoli</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithGroups = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[260px]">
        <SelectValue placeholder="Select an item" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Popular</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Citrus</SelectLabel>
          <SelectItem value="orange">Orange</SelectItem>
          <SelectItem value="lemon">Lemon</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const Sizes = {
  render: () => (
    <div className="flex items-center gap-3">
      <Select>
        <SelectTrigger size="sm" className="w-[160px]">
          <SelectValue placeholder="Small" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="s1">Option 1</SelectItem>
          <SelectItem value="s2">Option 2</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger size="default" className="w-[180px]">
          <SelectValue placeholder="Default" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="d1">Option 1</SelectItem>
          <SelectItem value="d2">Option 2</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger size="lg" className="w-[200px]">
          <SelectValue placeholder="Large" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="l1">Option 1</SelectItem>
          <SelectItem value="l2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Disabled = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-[200px]" aria-disabled>
        <SelectValue placeholder="Disabled select" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="opt1">Option 1</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Controlled = {
  render: () => {
    const [value, setValue] = React.useState(undefined);
    return (
      <div className="space-y-2 w-[240px]">
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger>
            <SelectValue placeholder="Select value" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="one">One</SelectItem>
            <SelectItem value="two">Two</SelectItem>
            <SelectItem value="three">Three</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-xs text-muted-foreground">
          Selected: {value ?? '—'}
        </div>
      </div>
    );
  },
};
