'use client';

import { cn } from '@/lib/utils';
import * as React from 'react';

export interface MenuItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  /** Render a divider line below this item */
  divider?: boolean;
}

export interface MenuProps {
  /** Any React node — becomes the click target that opens the menu */
  trigger: React.ReactNode;
  items: MenuItem[];
  /** Horizontal alignment of the popup relative to the trigger */
  align?: 'start' | 'end' | 'center';
  className?: string;
}

const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
  ({ trigger, items, align = 'start', className }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState(-1);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const menuId = React.useId();

    // Close on outside click
    React.useEffect(() => {
      const handleOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleOutside);
      return () => document.removeEventListener('mousedown', handleOutside);
    }, []);

    // Reset active index when menu opens
    React.useEffect(() => {
      if (!isOpen) setActiveIndex(-1);
    }, [isOpen]);

    const enabledItems = items
      .map((item, i) => (!item.disabled ? i : null))
      .filter((i): i is number => i !== null);

    const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        setActiveIndex(enabledItems[0] ?? 0);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };

    const handleMenuKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const pos = enabledItems.indexOf(activeIndex);
        const next = enabledItems[(pos + 1) % enabledItems.length] ?? enabledItems[0];
        setActiveIndex(next ?? 0);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const pos = enabledItems.indexOf(activeIndex);
        const prev =
          enabledItems[(pos - 1 + enabledItems.length) % enabledItems.length] ??
          enabledItems[enabledItems.length - 1];
        setActiveIndex(prev ?? 0);
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const item = items[activeIndex];
        if (item && !item.disabled) {
          item.onClick?.();
          setIsOpen(false);
        }
      }
    };

    const alignClass =
      align === 'end'
        ? 'right-0'
        : align === 'center'
          ? 'left-1/2 -translate-x-1/2'
          : 'left-0';

    return (
      <div
        ref={node => {
          // Merge forwarded ref with internal ref
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={cn('relative inline-block', className)}
        onKeyDown={handleMenuKeyDown}
      >
        {/* Trigger — wrap in a span so any node becomes keyboard-accessible */}
        <span
          role='button'
          tabIndex={0}
          aria-haspopup='menu'
          aria-expanded={isOpen}
          aria-controls={menuId}
          onClick={() => setIsOpen(prev => !prev)}
          onKeyDown={handleTriggerKeyDown}
          className='inline-flex cursor-pointer select-none focus:outline-none'
        >
          {trigger}
        </span>

        {/* Popup */}
        {isOpen && (
          <ul
            id={menuId}
            role='menu'
            aria-orientation='vertical'
            className={cn(
              'absolute z-50 top-[calc(100%+4px)] min-w-[10rem]',
              alignClass,
              'bg-[color:var(--bg-surface)]',
              'border border-[color:var(--border-subtle)]',
              'rounded-[var(--radius-lg)]',
              'shadow-[var(--shadow-md)]',
              'p-[var(--spacing-xs)]',
              'focus:outline-none'
            )}
            tabIndex={-1}
          >
            {items.map((item, index) => (
              <React.Fragment key={item.key}>
                <li
                  role='menuitem'
                  aria-disabled={item.disabled}
                  tabIndex={item.disabled ? -1 : 0}
                  className={cn(
                    'flex items-center gap-[var(--spacing-sm)]',
                    'px-3 py-[var(--spacing-sm)] rounded-[var(--radius-md)]',
                    'font-[family-name:var(--font-rubik)] text-[length:var(--font-size-body1)]',
                    'cursor-pointer select-none',
                    'transition-colors duration-[var(--duration-fast)]',
                    // Active (keyboard) state
                    activeIndex === index
                      ? 'bg-[color:var(--bg-hover)] text-[color:var(--text-primary)]'
                      : 'text-[color:var(--text-paragraph)]',
                    // Hover state using dynamic token
                    !item.disabled && activeIndex !== index && 'hover:bg-[color:var(--bg-hover)]',
                    item.disabled && 'cursor-not-allowed opacity-40 pointer-events-none',
                    'focus:outline-none focus:bg-[color:var(--bg-hover)]'
                  )}
                  onClick={() => {
                    if (item.disabled) return;
                    item.onClick?.();
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => !item.disabled && setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(-1)}
                >
                  {item.icon && (
                    <span
                      className='shrink-0 text-[color:var(--text-muted)] flex items-center'
                      aria-hidden='true'
                    >
                      {item.icon}
                    </span>
                  )}
                  <span className='flex-1'>{item.label}</span>
                </li>
                {item.divider && (
                  <li
                    role='separator'
                    aria-orientation='horizontal'
                    className='my-[var(--spacing-xs)] h-px bg-[color:var(--border-subtle)]'
                  />
                )}
              </React.Fragment>
            ))}
          </ul>
        )}
      </div>
    );
  }
);

Menu.displayName = 'Menu';

export { Menu };
