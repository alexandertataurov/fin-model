import React, { useState, useCallback } from 'react';
import { cn } from '../../../utils/cn'; // Assuming cn is available
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms'; // Import Icon atom

import {
  CalendarProps,
  CalendarDayProps,
  CalendarHeaderProps,
} from './Calendar.types';

import {
  calendarVariants,
  calendarHeaderVariants,
  calendarTitleVariants,
  calendarNavVariants,
  calendarGridVariants,
  calendarDayHeaderVariants,
  calendarDayVariants,
} from './Calendar.variants';

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
  onCurrentMonth,
}) => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <div className={cn(calendarHeaderVariants())}>
      <div className={cn(calendarNavVariants())}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onPreviousMonth}
          aria-label="Previous month"
        >
          <Icon name="ChevronLeft" size="sm" /> {/* Use Icon atom */}
        </Button>
      </div>

      <button className={cn(calendarTitleVariants())} onClick={onCurrentMonth}>
        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
      </button>

      <div className={cn(calendarNavVariants())}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onNextMonth}
          aria-label="Next month"
        >
          <Icon name="ChevronRight" size="sm" /> {/* Use Icon atom */}
        </Button>
      </div>
    </div>
  );
};

const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  isSelected,
  isToday,
  isOutsideMonth,
  isDisabled,
  isInRange,
  isRangeStart,
  isRangeEnd,
  onClick,
}) => {
  const handleClick = () => {
    if (!isDisabled) {
      onClick(date);
    }
  };

  return (
    <button
      className={cn(
        calendarDayVariants({
          isSelected,
          isToday,
          isOutsideMonth,
          isDisabled,
          isInRange,
          isRangeStart,
          isRangeEnd,
        })
      )}
      onClick={handleClick}
      disabled={isDisabled}
      aria-label={date.toLocaleDateString()}
      aria-selected={isSelected}
    >
      {date.getDate()}
    </button>
  );
};

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onValueChange,
      mode = 'single',
      selected: controlledSelected,
      onSelect,
      disabled = false,
      disabledDays,
      minDate,
      maxDate,
      showOutsideDays = true,
      className,
      ...props
    },
    ref
  ) => {
    const [currentMonth, setCurrentMonth] = useState(() => {
      const initialDate = controlledValue || defaultValue || new Date();
      return new Date(initialDate.getFullYear(), initialDate.getMonth(), 1);
    });

    const [internalValue, setInternalValue] = useState(defaultValue);
    const [internalSelected, setInternalSelected] =
      useState(controlledSelected);

    const value =
      controlledValue !== undefined ? controlledValue : internalValue;
    const selected =
      controlledSelected !== undefined ? controlledSelected : internalSelected;

    const isDateDisabled = useCallback(
      (date: Date): boolean => {
        if (disabled) return true;

        if (minDate && date < minDate) return true;
        if (maxDate && date > maxDate) return true;

        if (disabledDays) {
          if (Array.isArray(disabledDays)) {
            return disabledDays.some(
              disabledDate =>
                disabledDate.toDateString() === date.toDateString()
            );
          } else {
            return disabledDays(date);
          }
        }

        return false;
      },
      [disabled, minDate, maxDate, disabledDays]
    );

    const handleDateClick = useCallback(
      (date: Date) => {
        if (isDateDisabled(date)) return;

        if (mode === 'single') {
          const newValue = date;
          if (controlledValue === undefined) {
            setInternalValue(newValue);
          }
          onValueChange?.(newValue);
          onSelect?.(newValue);
        } else if (mode === 'multiple') {
          const currentSelected = Array.isArray(selected) ? selected : [];
          const dateString = date.toDateString();
          const isAlreadySelected = currentSelected.some(
            d => d.toDateString() === dateString
          );

          let newSelected: Date[];
          if (isAlreadySelected) {
            newSelected = currentSelected.filter(
              d => d.toDateString() !== dateString
            );
          } else {
            newSelected = [...currentSelected, date];
          }

          if (controlledSelected === undefined) {
            setInternalSelected(newSelected);
          }
          onSelect?.(newSelected);
        } else if (mode === 'range') {
          const currentRange = selected as { from: Date; to: Date } | undefined;

          if (
            !currentRange ||
            !currentRange.from ||
            (currentRange.from && currentRange.to)
          ) {
            // Start new range
            const newRange = { from: date, to: undefined };
            if (controlledSelected === undefined) {
              setInternalSelected(newRange);
            }
            onSelect?.(newRange);
          } else {
            // Complete range
            const newRange = {
              from: currentRange.from < date ? currentRange.from : date,
              to: currentRange.from < date ? date : currentRange.from,
            };
            if (controlledSelected === undefined) {
              setInternalSelected(newRange);
            }
            onSelect?.(newRange);
          }
        }
      },
      [
        mode,
        selected,
        controlledValue,
        controlledSelected,
        onValueChange,
        onSelect,
        isDateDisabled,
      ]
    );

    const handlePreviousMonth = () => {
      setCurrentMonth(
        prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
      );
    };

    const handleNextMonth = () => {
      setCurrentMonth(
        prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
      );
    };

    const handleCurrentMonth = () => {
      setCurrentMonth(new Date());
    };

    const getDaysInMonth = (year: number, month: number) => {
      return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
      return new Date(year, month, 1).getDay();
    };

    const generateCalendarDays = () => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const daysInMonth = getDaysInMonth(year, month);
      const firstDayOfMonth = getFirstDayOfMonth(year, month);

      const days: Date[] = [];

      // Add days from previous month
      if (showOutsideDays) {
        const prevMonth = month === 0 ? 11 : month - 1;
        const prevYear = month === 0 ? year - 1 : year;
        const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
          days.push(new Date(prevYear, prevMonth, daysInPrevMonth - i));
        }
      }

      // Add days from current month
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day));
      }

      // Add days from next month
      if (showOutsideDays) {
        const nextMonth = month === 11 ? 0 : month + 1;
        const nextYear = month === 11 ? year + 1 : year;
        const remainingDays = 42 - days.length; // 6 rows * 7 days

        for (let day = 1; day <= remainingDays; day++) {
          days.push(new Date(nextYear, nextMonth, day));
        }
      }

      return days;
    };

    const isDateSelected = (date: Date): boolean => {
      if (mode === 'single') {
        return value?.toDateString() === date.toDateString() || false;
      } else if (mode === 'multiple') {
        return (
          Array.isArray(selected) &&
          selected.some(d => d.toDateString() === date.toDateString())
        );
      } else if (mode === 'range') {
        const range = selected as { from: Date; to: Date } | undefined;
        if (!range?.from) return false;
        if (!range.to) return range.from.toDateString() === date.toDateString();
        return date >= range.from && date <= range.to;
      }
      return false;
    };

    const isDateInRange = (date: Date): boolean => {
      if (mode !== 'range') return false;
      const range = selected as { from: Date; to: Date } | undefined;
      if (!range?.from || !range.to) return false;
      return date > range.from && date < range.to;
    };

    const isDateRangeStart = (date: Date): boolean => {
      if (mode !== 'range') return false;
      const range = selected as { from: Date; to: Date } | undefined;
      return range?.from?.toDateString() === date.toDateString() || false;
    };

    const isDateRangeEnd = (date: Date): boolean => {
      if (mode !== 'range') return false;
      const range = selected as { from: Date; to: Date } | undefined;
      return range?.to?.toDateString() === date.toDateString() || false;
    };

    const calendarDays = generateCalendarDays();
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div ref={ref} className={cn(calendarVariants(), className)} {...props}>
        <CalendarHeader
          currentMonth={currentMonth}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
          onCurrentMonth={handleCurrentMonth}
        />

        <div className={cn(calendarGridVariants())}>
          {dayHeaders.map(header => (
            <div key={header} className={cn(calendarDayHeaderVariants())}>
              {header}
            </div>
          ))}

          {calendarDays.map((date, index) => {
            const isOutsideMonth = date.getMonth() !== currentMonth.getMonth();
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = isDateSelected(date);
            const isDisabled = isDateDisabled(date);
            const isInRange = isDateInRange(date);
            const isRangeStart = isDateRangeStart(date);
            const isRangeEnd = isDateRangeEnd(date);

            return (
              <CalendarDay
                key={index}
                date={date}
                isSelected={isSelected}
                isToday={isToday}
                isOutsideMonth={isOutsideMonth}
                isDisabled={isDisabled}
                isInRange={isInRange}
                isRangeStart={isRangeStart}
                isRangeEnd={isRangeEnd}
                onClick={handleDateClick}
              />
            );
          })}
        </div>
      </div>
    );
  }
);

Calendar.displayName = 'Calendar';
