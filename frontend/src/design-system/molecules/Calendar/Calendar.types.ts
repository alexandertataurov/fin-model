import React from 'react';

export interface CalendarProps extends React.ComponentPropsWithoutRef<'div'> {
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date | undefined) => void;
  mode?: 'single' | 'multiple' | 'range';
  selected?: Date | Date[] | { from: Date; to: Date };
  onSelect?: (
    date: Date | Date[] | { from: Date; to: Date } | undefined
  ) => void;
  disabled?: boolean;
  disabledDays?: Date[] | ((date: Date) => boolean);
  minDate?: Date;
  maxDate?: Date;
  showOutsideDays?: boolean;
  className?: string;
}

export interface CalendarDayProps {
  date: Date;
  isSelected: boolean;
  isToday: boolean;
  isOutsideMonth: boolean;
  isDisabled: boolean;
  isInRange?: boolean;
  isRangeStart?: boolean;
  isRangeEnd?: boolean;
  onClick: (date: Date) => void;
}

export interface CalendarHeaderProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onCurrentMonth: () => void;
}

export interface CalendarRange {
  from: Date;
  to?: Date;
}

export interface CalendarRef extends HTMLDivElement {}
