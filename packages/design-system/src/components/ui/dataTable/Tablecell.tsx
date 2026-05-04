import { cn } from '../../../lib/utils';
import { BadgeStatus } from '../../../types/badgw';
import { Badge } from '../badge/badge';
import { Typography } from '../typography';

export interface TableCellProps {
  content: string | React.ReactNode;
  subContent?: string | React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'default' | 'badge' | 'status';
  status?: BadgeStatus;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export function TableCell({
  content,
  subContent,
  icon,
  variant = 'default',
  status = 'neutral',
  align = 'left',
  className,
}: TableCellProps) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  if (variant === 'badge') {
    return (
      <div className={cn(alignClasses[align], className)}>
        <Badge status={status} variant='filled' size='sm'>
          {content}
        </Badge>
      </div>
    );
  }

  if (variant === 'status') {
    return (
      <div
        className={cn(
          'flex items-center gap-2',
          alignClasses[align],
          className
        )}
      >
        <div
          className={cn('h-2 w-2 rounded-full', {
            'bg-success': status === 'success',
            'bg-warning': status === 'pending',
            'bg-error': status === 'error',
            'bg-info': status === 'completed',
            'bg-muted': status === 'neutral',
          })}
        />
        <span className='text-sm font-medium'>{content}</span>
      </div>
    );
  }

  return (
    <div
      className={cn('flex items-center gap-2', alignClasses[align], className)}
    >
      {icon && <div className='flex-shrink-0'>{icon}</div>}
      <div className='flex flex-col'>
        <Typography variant={'body1'}>{content}</Typography>
        {subContent && (
          <Typography variant={'body2'} className='text-neutral-500'>
            {subContent}
          </Typography>
        )}
      </div>
    </div>
  );
}
