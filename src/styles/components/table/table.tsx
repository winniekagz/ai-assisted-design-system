export const variantClasses = {
  default: 'border border-border',
  bordered: 'border-2 border-border',
  striped: '[&_tr:nth-child(even)]:bg-muted/30',
  compact: 'text-sm',
};

export const sizeClasses = {
  sm: '[&_td]:p-2 [&_th]:p-2',
  default: '[&_td]:p-4 [&_th]:p-4',
  lg: '[&_td]:p-6 [&_th]:p-6',
};
