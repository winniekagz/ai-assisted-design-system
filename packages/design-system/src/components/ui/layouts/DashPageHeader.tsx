import React from 'react';
import { Typography, TypographyVariantProps } from '../typography';

export default function DashPageHeader({
  title,
  subtitle,
  titleVariant = 'display1',
  subTitleVariant = 'body1',
  titleClassName,
  subtitleClassName,
}: {
  title: string;
  subtitle?: string;
  titleVariant?: TypographyVariantProps;
  subTitleVariant?: TypographyVariantProps;
  titleClassName?: string;
  subtitleClassName?: string;
}) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-col  gap-1'>
        <Typography variant={titleVariant} className={titleClassName}>
          {title}
        </Typography>
        <Typography variant={subTitleVariant} className={subtitleClassName}>
          {subtitle}
        </Typography>
      </div>
    </div>
  );
}
