'use client';

import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'componentiq';
import { ChevronDown } from 'lucide-react';

type ProjectFilterValue = string;

export function ProjectMenuFilter({
  label,
  value,
  options,
  onSelect,
}: {
  label: string;
  value: ProjectFilterValue;
  options: ProjectFilterValue[];
  // eslint-disable-next-line no-unused-vars
  onSelect(value: ProjectFilterValue): void;
}) {
  const displayValue = value === 'all' ? 'All' : value;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type='button' variant='outlined' size='sm' endIcon={<ChevronDown className='size-4' />}>
          {label}: {displayValue}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-64'>
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={value === 'all'} onCheckedChange={() => onSelect('all')}>
          All
        </DropdownMenuCheckboxItem>
        {options.map(option => (
          <DropdownMenuCheckboxItem
            key={option}
            checked={value === option}
            onCheckedChange={() => onSelect(option)}
          >
            {option}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
