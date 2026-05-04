import * as React$1 from 'react';
import React__default, { ReactNode } from 'react';
import { VariantProps } from 'class-variance-authority';
import { LucideIcon } from 'lucide-react';
import * as class_variance_authority_types from 'class-variance-authority/types';
import { DayPicker } from 'react-day-picker';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Tabs } from '@radix-ui/react-tabs';
import { ColumnDef, SortingState, ColumnFiltersState, VisibilityState, RowSelectionState, PaginationState } from '@tanstack/react-table';
import { ClassValue } from 'clsx';

interface AvatarProps extends React$1.HTMLAttributes<HTMLDivElement> {
    src?: string;
    alt?: string;
    fallback?: React$1.ReactNode;
}
declare const Avatar: React$1.ForwardRefExoticComponent<AvatarProps & React$1.RefAttributes<HTMLDivElement>>;
declare const AvatarImage: React$1.ForwardRefExoticComponent<React$1.ImgHTMLAttributes<HTMLImageElement> & React$1.RefAttributes<HTMLImageElement>>;
declare const AvatarFallback: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;

declare const badgeVariants: (props?: ({
    variant?: "filled" | "outlined" | "pastel" | null | undefined;
    size?: "sm" | "md" | "lg" | "xl" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;

interface BadgeVariants {
    filled: string;
    outlined: string;
    pastel: string;
}
interface BadgeStatusDefinition {
    label: string;
    colors: BadgeVariants;
}
type BadgeStatus = 'success' | 'pending' | 'error' | 'completed' | 'neutral';
interface BadgeVariantColors {
    bg: string;
    text: string;
    border?: string;
}
interface BadgeColors {
    filled?: BadgeVariantColors;
    outlined?: BadgeVariantColors;
    pastel?: BadgeVariantColors;
}
type FilledColors = {
    bg: string;
    text: string;
};
type OutlinedColors = {
    bg: string;
    text: string;
    border: string;
};
type PastelColors = {
    bg: string;
    text: string;
};
interface BadgeStatusOptions {
    label?: string;
    colors?: BadgeColors;
}
type BadgeStatusConfig = Partial<Record<BadgeStatus, BadgeStatusOptions>> & Record<string, BadgeStatusOptions>;
interface BadgeProps$1 extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
    status?: BadgeStatus | string;
    statusConfig?: BadgeStatusConfig;
    colorStatus?: BadgeStatus | string;
    icon?: LucideIcon;
    iconPosition?: 'start' | 'end';
    children?: React.ReactNode;
}

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    status?: BadgeStatus | string;
    variant?: 'filled' | 'outlined' | 'pastel';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    icon?: React.ElementType;
    iconPosition?: 'start' | 'end';
    statusConfig?: BadgeStatusConfig;
    colorStatus?: BadgeStatus | string;
    children?: React.ReactNode;
}
declare function Badge({ className, variant, size, status, statusConfig, colorStatus, // New prop to specify color status
icon: Icon, iconPosition, children, ...props }: BadgeProps): React$1.JSX.Element;

declare const defaultBadgeStatusConfig: {
    readonly success: {
        readonly label: "Success";
        readonly colors: {
            readonly filled: "bg-success-500 dark:bg-success-600 text-white";
            readonly outlined: "bg-transparent text-success-500 dark:text-success-600 border-success-500 dark:border-success-600";
            readonly pastel: "bg-success-50 text-success-500";
        };
    };
    readonly pending: {
        readonly label: "Pending";
        readonly colors: {
            readonly filled: "bg-warning-500 dark:bg-warning-600 text-white";
            readonly outlined: "bg-transparent text-warning-500 dark:text-warning-600 border-warning-500 dark:border-warning-600";
            readonly pastel: "bg-warning-50 text-warning-500";
        };
    };
    readonly error: {
        readonly label: "Error";
        readonly colors: {
            readonly filled: "bg-error-500 dark:bg-error-600 text-white";
            readonly outlined: "bg-transparent text-error-500 dark:text-error-600 border-error-500 dark:border-error-600";
            readonly pastel: "bg-error-50 text-error-500";
        };
    };
    readonly completed: {
        readonly label: "Completed";
        readonly colors: {
            readonly filled: "bg-info-500 dark:bg-info-600 text-white";
            readonly outlined: "bg-transparent text-info-500 dark:text-info-600 border-info-500 dark:border-info-600";
            readonly pastel: "bg-info-50 text-info-500";
        };
    };
    readonly neutral: {
        readonly label: "Neutral";
        readonly colors: {
            readonly filled: "bg-neutral-500 dark:bg-neutral-600 text-white";
            readonly outlined: "bg-transparent text-neutral-500 dark:text-neutral-600 border-neutral-500 dark:border-neutral-600";
            readonly pastel: "bg-neutral-50 text-neutral-500";
        };
    };
};
declare const makeCustomColors: (colorName: string, status: string) => BadgeVariants;

declare const buttonVariants: (props?: ({
    variant?: "link" | "text" | "outlined" | "contained" | "destructive" | "secondary" | "ghost" | null | undefined;
    size?: "default" | "sm" | "lg" | "xl" | "icon" | null | undefined;
    fullWidth?: boolean | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface ButtonProps extends React$1.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    loading?: boolean;
    startIcon?: React$1.ReactNode;
    endIcon?: React$1.ReactNode;
    leftIcon?: React$1.ReactNode;
    rightIcon?: React$1.ReactNode;
    children: React$1.ReactNode;
    fullWidth?: boolean;
}
declare const Button: React$1.ForwardRefExoticComponent<ButtonProps & React$1.RefAttributes<HTMLButtonElement>>;

type CalendarProps = React$1.ComponentProps<typeof DayPicker>;
declare function Calendar({ className, classNames, showOutsideDays, ...props }: CalendarProps): React$1.JSX.Element;
declare namespace Calendar {
    var displayName: string;
}

declare function Card({ className, ...props }: React$1.ComponentProps<'div'>): React$1.JSX.Element;
declare function CardHeader({ className, ...props }: React$1.ComponentProps<'div'>): React$1.JSX.Element;
declare function CardTitle({ className, ...props }: React$1.ComponentProps<'div'>): React$1.JSX.Element;
declare function CardDescription({ className, ...props }: React$1.ComponentProps<'div'>): React$1.JSX.Element;
declare function CardAction({ className, ...props }: React$1.ComponentProps<'div'>): React$1.JSX.Element;
declare function CardContent({ className, ...props }: React$1.ComponentProps<'div'>): React$1.JSX.Element;
declare function CardFooter({ className, ...props }: React$1.ComponentProps<'div'>): React$1.JSX.Element;

interface ContainerProps extends React$1.ComponentProps<'div'> {
    /**
     * The content to be rendered inside the container
     */
    children?: React$1.ReactNode;
    /**
     * The width variant of the container
     * @default "fit"
     */
    width?: 'full' | 'fit';
    /**
     * The background color variant
     * @default "white"
     */
    variant?: 'white' | 'transparent' | 'gray' | 'primary' | 'secondary';
    /**
     * The gap between child elements in pixels
     * @default 16
     */
    gap?: number;
    /**
     * The padding in pixels
     * @default 2
     */
    padding?: number;
    /**
     * The border radius in pixels
     * @default 10
     */
    radius?: number;
    /**
     * Whether to show a border
     * @default false
     */
    bordered?: boolean;
    /**
     * Whether to show a shadow
     * @default false
     */
    shadowed?: boolean;
    /**
     * Additional CSS classes
     */
    className?: string;
}
declare function Container({ children, width, variant, gap, padding, radius, bordered, shadowed, className, ...props }: ContainerProps): React$1.JSX.Element;

declare function DropdownMenu({ ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.Root>): React$1.JSX.Element;
declare function DropdownMenuPortal({ ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.Portal>): React$1.JSX.Element;
declare function DropdownMenuTrigger({ ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.Trigger>): React$1.JSX.Element;
declare function DropdownMenuContent({ className, sideOffset, ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.Content>): React$1.JSX.Element;
declare function DropdownMenuGroup({ ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.Group>): React$1.JSX.Element;
declare function DropdownMenuItem({ className, inset, variant, ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
    variant?: 'default' | 'destructive';
}): React$1.JSX.Element;
declare function DropdownMenuCheckboxItem({ className, children, checked, ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>): React$1.JSX.Element;
declare function DropdownMenuRadioGroup({ ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>): React$1.JSX.Element;
declare function DropdownMenuRadioItem({ className, children, ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>): React$1.JSX.Element;
declare function DropdownMenuLabel({ className, inset, ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
}): React$1.JSX.Element;
declare function DropdownMenuSeparator({ className, ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.Separator>): React$1.JSX.Element;
declare function DropdownMenuShortcut({ className, ...props }: React$1.ComponentProps<'span'>): React$1.JSX.Element;
declare function DropdownMenuSub({ ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.Sub>): React$1.JSX.Element;
declare function DropdownMenuSubTrigger({ className, inset, children, ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
}): React$1.JSX.Element;
declare function DropdownMenuSubContent({ className, ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.SubContent>): React$1.JSX.Element;

interface InputProps$1 extends React$1.InputHTMLAttributes<HTMLInputElement> {
}
declare const Input$1: React$1.ForwardRefExoticComponent<InputProps$1 & React$1.RefAttributes<HTMLInputElement>>;

interface NavigationMenuProps extends React$1.HTMLAttributes<HTMLElement> {
    children: React$1.ReactNode;
}
declare const NavigationMenu: React$1.ForwardRefExoticComponent<NavigationMenuProps & React$1.RefAttributes<HTMLElement>>;
interface NavigationMenuItemProps extends React$1.HTMLAttributes<HTMLLIElement> {
    children: React$1.ReactNode;
}
declare const NavigationMenuItem: React$1.ForwardRefExoticComponent<NavigationMenuItemProps & React$1.RefAttributes<HTMLLIElement>>;
interface NavigationMenuLinkProps extends React$1.HTMLAttributes<HTMLAnchorElement> {
    children: React$1.ReactNode;
    href?: string;
    active?: boolean;
}
declare const NavigationMenuLink: React$1.ForwardRefExoticComponent<NavigationMenuLinkProps & React$1.RefAttributes<HTMLAnchorElement>>;

declare const Pagination: ({ className, ...props }: React$1.ComponentProps<"nav">) => React$1.JSX.Element;
declare const PaginationContent: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLUListElement>, HTMLUListElement>, "ref"> & React$1.RefAttributes<HTMLUListElement>>;
declare const PaginationItem: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>, "ref"> & React$1.RefAttributes<HTMLLIElement>>;
type PaginationLinkProps = {
    isActive?: boolean;
} & Pick<ButtonProps, 'size'> & React$1.ComponentProps<'a'>;
declare const PaginationLink: {
    ({ className, isActive, size, ...props }: PaginationLinkProps): React$1.JSX.Element;
    displayName: string;
};
declare const PaginationPrevious: {
    ({ className, ...props }: React$1.ComponentProps<typeof PaginationLink>): React$1.JSX.Element;
    displayName: string;
};
declare const PaginationNext: {
    ({ className, ...props }: React$1.ComponentProps<typeof PaginationLink>): React$1.JSX.Element;
    displayName: string;
};
declare const PaginationEllipsis: {
    ({ className, ...props }: React$1.ComponentProps<"span">): React$1.JSX.Element;
    displayName: string;
};

interface DataTablePaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    pageSizeOptions: number[];
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    className?: string;
    showPageSizeSelector?: boolean;
    showItemCount?: boolean;
    siblingCount?: number;
    boundaryCount?: number;
}
declare function DataTablePagination({ currentPage, totalPages, pageSize, totalItems, pageSizeOptions, onPageChange, onPageSizeChange, className, showPageSizeSelector, showItemCount, siblingCount, boundaryCount, }: DataTablePaginationProps): React$1.JSX.Element;

interface UseEnhancedPaginationProps {
    totalItems: number;
    initialPageSize?: number;
    initialPage?: number;
    siblingCount?: number;
    boundaryCount?: number;
    pageSizeOptions?: number[];
}
type PaginationItemValue$1 = number | 'ellipsis';
interface UseEnhancedPaginationReturn {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    startItem: number;
    endItem: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number;
    previousPage: number;
    paginationItems: PaginationItemValue$1[];
    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
    goToNextPage: () => void;
    goToPreviousPage: () => void;
    goToFirstPage: () => void;
    goToLastPage: () => void;
    pageSizeOptions: number[];
    paginationState: {
        pageIndex: number;
        pageSize: number;
    };
    setPaginationState: (state: {
        pageIndex: number;
        pageSize: number;
    }) => void;
}
declare function useEnhancedPagination({ totalItems, initialPageSize, initialPage, siblingCount, boundaryCount, pageSizeOptions, }: UseEnhancedPaginationProps): UseEnhancedPaginationReturn;

interface EnhancedPaginationProps {
    totalItems: number;
    initialPageSize?: number;
    initialPage?: number;
    siblingCount?: number;
    boundaryCount?: number;
    pageSizeOptions?: number[];
    className?: string;
    showPageSizeSelector?: boolean;
    showItemCount?: boolean;
    showPageInfo?: boolean;
    variant?: 'default' | 'compact' | 'minimal';
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    children?: React__default.ReactNode;
}
declare function EnhancedPagination({ totalItems, initialPageSize, initialPage, siblingCount, boundaryCount, pageSizeOptions, className, showPageSizeSelector, showItemCount, showPageInfo, variant, onPageChange, onPageSizeChange, children, }: EnhancedPaginationProps): React__default.JSX.Element;

declare const Popover: React$1.FC<PopoverPrimitive.PopoverProps>;
declare const PopoverTrigger: React$1.ForwardRefExoticComponent<PopoverPrimitive.PopoverTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const PopoverContent: React$1.ForwardRefExoticComponent<Omit<PopoverPrimitive.PopoverContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

interface ScrollAreaProps extends React$1.HTMLAttributes<HTMLDivElement> {
    orientation?: 'vertical' | 'horizontal';
    scrollHideDelay?: number;
}
declare const ScrollArea: React$1.ForwardRefExoticComponent<ScrollAreaProps & React$1.RefAttributes<HTMLDivElement>>;

interface SeparatorProps extends React$1.HTMLAttributes<HTMLDivElement> {
    orientation?: 'horizontal' | 'vertical';
    decorative?: boolean;
}
declare const Separator: React$1.ForwardRefExoticComponent<SeparatorProps & React$1.RefAttributes<HTMLDivElement>>;

interface SidebarProps extends React$1.HTMLAttributes<HTMLDivElement> {
    children: React$1.ReactNode;
}
declare const Sidebar: React$1.ForwardRefExoticComponent<SidebarProps & React$1.RefAttributes<HTMLDivElement>>;
interface SidebarHeaderProps extends React$1.HTMLAttributes<HTMLDivElement> {
    children: React$1.ReactNode;
}
declare const SidebarHeader: React$1.ForwardRefExoticComponent<SidebarHeaderProps & React$1.RefAttributes<HTMLDivElement>>;
interface SidebarContentProps extends React$1.HTMLAttributes<HTMLDivElement> {
    children: React$1.ReactNode;
}
declare const SidebarContent: React$1.ForwardRefExoticComponent<SidebarContentProps & React$1.RefAttributes<HTMLDivElement>>;
interface SidebarFooterProps extends React$1.HTMLAttributes<HTMLDivElement> {
    children: React$1.ReactNode;
}
declare const SidebarFooter: React$1.ForwardRefExoticComponent<SidebarFooterProps & React$1.RefAttributes<HTMLDivElement>>;

declare function Skeleton({ className, ...props }: React__default.HTMLAttributes<HTMLDivElement>): React__default.JSX.Element;

declare const tabTriggerVariants: (props?: ({
    variant?: "outlined" | "contained" | "underlined" | "rounded" | null | undefined;
    size?: "default" | "sm" | "lg" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare const tabListVariants: (props?: ({
    variant?: "outlined" | "contained" | "underlined" | "rounded" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface TabItem {
    value: string;
    label: string;
    content: React$1.ReactNode;
}
interface ReusableTabsProps extends React$1.ComponentPropsWithoutRef<typeof Tabs>, VariantProps<typeof tabTriggerVariants> {
    items: TabItem[];
    defaultValue?: string;
    className?: string;
    triggerClassName?: string;
    contentClassName?: string;
}
declare const ReusableTabs: React$1.ForwardRefExoticComponent<ReusableTabsProps & React$1.RefAttributes<HTMLDivElement>>;

declare const typographyVariants: (props?: ({
    variant?: "link" | "small" | "caption" | "code" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "pre" | "body1" | "body2" | "display1" | "display2" | "display3" | null | undefined;
    textColor?: "default" | "success" | "destructive" | "secondary" | "primary" | "muted" | "warning" | "info" | null | undefined;
    weight?: "bold" | "normal" | "medium" | "semibold" | null | undefined;
    align?: "center" | "left" | "right" | "justify" | null | undefined;
    truncate?: boolean | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface TypographyProps extends Omit<React$1.HTMLAttributes<HTMLElement>, 'color'>, VariantProps<typeof typographyVariants> {
    asChild?: boolean;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'code' | 'pre' | 'label' | 'a';
    children: React$1.ReactNode;
    href?: string;
    target?: string;
    rel?: string;
}
declare const Typography: React$1.ForwardRefExoticComponent<TypographyProps & React$1.RefAttributes<any>>;

declare const autocompleteVariants: (props?: ({
    variant?: "default" | "success" | "error" | null | undefined;
    size?: "default" | "sm" | "lg" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface AutocompleteOption$1 {
    value: string;
    label: string;
}
interface AutocompleteProps extends Omit<React$1.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange' | 'onSelect'>, VariantProps<typeof autocompleteVariants> {
    error?: boolean;
    success?: boolean;
    placeholder?: string;
    options: AutocompleteOption$1[];
    value?: string;
    onChange?: (value: string) => void;
    onSelect?: (option: AutocompleteOption$1) => void;
    multiple?: boolean;
    selectedValues?: string[];
    onSelectedValuesChange?: (values: string[]) => void;
}
declare const Autocomplete: React$1.ForwardRefExoticComponent<AutocompleteProps & React$1.RefAttributes<HTMLInputElement>>;

declare const checkboxVariants: (props?: ({
    variant?: "default" | "success" | "error" | null | undefined;
    size?: "default" | "sm" | "lg" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface CheckboxProps extends Omit<React$1.InputHTMLAttributes<HTMLInputElement>, 'size'>, VariantProps<typeof checkboxVariants> {
    error?: boolean;
    success?: boolean;
    label?: string;
    required?: boolean;
}
declare const Checkbox: React$1.ForwardRefExoticComponent<CheckboxProps & React$1.RefAttributes<HTMLInputElement>>;

interface DatePickerValue {
    startDate: Date | null;
    endDate: Date | null;
}
interface DatePickerProps {
    value: DatePickerValue;
    onChange: (value: DatePickerValue) => void;
    variant?: 'single' | 'range';
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    minDate?: Date;
    maxDate?: Date;
    format?: string;
    displayFormat?: string;
    readOnly?: boolean;
    calendarProps?: any;
}
declare const ComponentIqDatePicker: React$1.FC<DatePickerProps>;

declare const inputVariants: (props?: ({
    variant?: "default" | "text" | "success" | "error" | "outline" | null | undefined;
    size?: "default" | "sm" | "lg" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface InputProps extends Omit<React$1.InputHTMLAttributes<HTMLInputElement>, 'size'>, VariantProps<typeof inputVariants> {
    error?: boolean;
    success?: boolean;
    startIcon?: React$1.ReactNode;
    endIcon?: React$1.ReactNode;
    onStartIconClick?: () => void;
    onEndIconClick?: () => void;
}
declare const Input: React$1.ForwardRefExoticComponent<InputProps & React$1.RefAttributes<HTMLInputElement>>;

declare const radioVariants: (props?: ({
    variant?: "default" | "success" | "error" | null | undefined;
    size?: "default" | "sm" | "lg" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface RadioProps extends Omit<React$1.InputHTMLAttributes<HTMLInputElement>, 'size'>, VariantProps<typeof radioVariants> {
    error?: boolean;
    success?: boolean;
    label?: string;
    required?: boolean;
}
declare const Radio: React$1.ForwardRefExoticComponent<RadioProps & React$1.RefAttributes<HTMLInputElement>>;

declare const selectVariants: (props?: ({
    variant?: "default" | "success" | "error" | null | undefined;
    size?: "default" | "sm" | "lg" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface SelectProps extends Omit<React$1.SelectHTMLAttributes<HTMLSelectElement>, 'size'>, VariantProps<typeof selectVariants> {
    error?: boolean;
    success?: boolean;
    placeholder?: string;
}
declare const Select: React$1.ForwardRefExoticComponent<SelectProps & React$1.RefAttributes<HTMLSelectElement>>;

declare const textareaVariants: (props?: ({
    variant?: "default" | "success" | "error" | null | undefined;
    size?: "default" | "sm" | "lg" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface TextareaProps extends Omit<React$1.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>, VariantProps<typeof textareaVariants> {
    error?: boolean;
    success?: boolean;
    autoGrow?: boolean;
    startIcon?: React$1.ReactNode;
    endIcon?: React$1.ReactNode;
    onStartIconClick?: () => void;
    onEndIconClick?: () => void;
}
declare const Textarea: React$1.ForwardRefExoticComponent<TextareaProps & React$1.RefAttributes<HTMLTextAreaElement>>;

type TablevariantProps = 'default' | 'bordered' | 'striped' | 'compact';
type TableSizeProps = 'sm' | 'default' | 'lg';
interface DataTableColumnProps<T> {
    id: string;
    header: string;
    accessorKey: keyof T;
    cell?: (value: any, row: T) => React.ReactNode;
    sortable?: boolean;
    filterable?: boolean;
    width?: string;
    align?: 'left' | 'center' | 'right';
}
interface DataTableStateProps<T> {
    searchQuery: string;
    sortColumn: string | null;
    sortDirection: 'asc' | 'desc';
    selectedRows: Set<string>;
    expandedRows: Set<string>;
    currentPage: number;
    pageSize: number;
}
interface EnhancedDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    title?: string;
    variant?: TablevariantProps;
    size?: TableSizeProps;
    enableSearch?: boolean;
    enableSorting?: boolean;
    enableRowSelection?: boolean;
    enablePagination?: boolean;
    enableRowNumbers?: boolean;
    enableActions?: boolean;
    enableColumnVisibility?: boolean;
    searchPlaceholder?: string;
    emptyMessage?: string;
    loading?: boolean;
    pageSize?: number;
    pageSizeOptions?: number[];
    onRowClick?: (row: TData) => void;
    onRowSelectionChange?: (selectedRows: TData[]) => void;
    renderRowActions?: (row: TData) => React.ReactNode;
    className?: string;
}

declare function EnhancedDataTable<TData, TValue>({ columns, data, title, variant, size, enableSearch, enableSorting, enableRowSelection, enablePagination, enableRowNumbers, enableActions, searchPlaceholder, emptyMessage, loading, pageSize, pageSizeOptions, onRowClick, onRowSelectionChange, renderRowActions, className, }: EnhancedDataTableProps<TData, TValue>): React$1.JSX.Element;

interface TableCellProps {
    content: string | React.ReactNode;
    subContent?: string | React.ReactNode;
    icon?: React.ReactNode;
    variant?: 'default' | 'badge' | 'status';
    status?: BadgeStatus;
    align?: 'left' | 'center' | 'right';
    className?: string;
}
declare function TableCell({ content, subContent, icon, variant, status, align, className, }: TableCellProps): React$1.JSX.Element;

interface SelectOption {
    value: string;
    label: string;
}
interface AutocompleteOption {
    value: string;
    label: string;
}
interface BaseRHFProps {
    name: string;
    label?: string;
    formError?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
}

interface RHFAutocompleteProps extends Omit<React$1.ComponentProps<typeof Autocomplete>, 'name' | 'onChange' | 'onSelect'>, BaseRHFProps {
    options: AutocompleteOption[];
    placeholder?: string;
    multiple?: boolean;
}
declare const RHFAutocomplete: React$1.ForwardRefExoticComponent<Omit<RHFAutocompleteProps, "ref"> & React$1.RefAttributes<HTMLInputElement>>;

interface RHFCheckboxProps extends Omit<React$1.ComponentProps<typeof Checkbox>, 'name'>, BaseRHFProps {
}
declare const RHFCheckbox: React$1.ForwardRefExoticComponent<Omit<RHFCheckboxProps, "ref"> & React$1.RefAttributes<HTMLInputElement>>;

interface RHFDDatePickerProps extends Omit<DatePickerProps, 'value' | 'onChange'> {
    name: string;
    label?: string;
    required?: boolean;
    helperText?: string;
    error?: boolean;
}
declare const RHFDDatePicker: React__default.FC<RHFDDatePickerProps>;

interface RHFInputProps extends Omit<React$1.ComponentProps<typeof Input>, 'name'>, BaseRHFProps {
    startIcon?: React$1.ReactNode;
    endIcon?: React$1.ReactNode;
    onStartIconClick?: () => void;
    onEndIconClick?: () => void;
}
declare const RHFInput: React$1.ForwardRefExoticComponent<Omit<RHFInputProps, "ref"> & React$1.RefAttributes<HTMLInputElement>>;

interface RHFRadioProps extends Omit<React$1.ComponentProps<typeof Radio>, 'name'>, BaseRHFProps {
}
declare const RHFRadio: React$1.ForwardRefExoticComponent<Omit<RHFRadioProps, "ref"> & React$1.RefAttributes<HTMLInputElement>>;

interface RHFSelectProps extends Omit<React$1.ComponentProps<typeof Select>, 'name'>, BaseRHFProps {
    options: SelectOption[];
    placeholder?: string;
}
declare const RHFSelect: React$1.ForwardRefExoticComponent<Omit<RHFSelectProps, "ref"> & React$1.RefAttributes<HTMLSelectElement>>;

interface RHFTextareaProps extends Omit<React$1.ComponentProps<typeof Textarea>, 'name'>, BaseRHFProps {
    startIcon?: React$1.ReactNode;
    endIcon?: React$1.ReactNode;
    onStartIconClick?: () => void;
    onEndIconClick?: () => void;
    autoGrow?: boolean;
}
declare const RHFTextarea: React$1.ForwardRefExoticComponent<Omit<RHFTextareaProps, "ref"> & React$1.RefAttributes<HTMLTextAreaElement>>;

interface BrandingData {
    logo?: React__default.ComponentType<React__default.SVGProps<SVGSVGElement>> | (() => React__default.ReactElement);
    title: string;
    subtitle?: string;
    user?: {
        name: string;
        email?: string;
        avatar?: string;
    };
    company?: {
        name: string;
        logo?: string;
    };
}
interface BrandingComponentProps {
    data: BrandingData;
    className?: string;
    showUserInfo?: boolean;
    showCompanyInfo?: boolean;
    onLogoClick?: () => void;
    onUserClick?: () => void;
}
declare const BrandingComponent: React__default.FC<BrandingComponentProps>;
declare const BrandingComponentSkeleton: React__default.FC<{
    className?: string;
}>;

interface NavigationItem {
    id: string;
    title: string;
    href?: string;
    icon?: ReactNode;
    children?: NavigationItem[];
    disabled?: boolean;
    external?: boolean;
}
interface SidebarFooterItem {
    id: string;
    title: string;
    icon?: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}
interface BrandingProps {
    logo: ReactNode;
    title?: string;
    subtitle?: string;
    homeUrl?: string;
}
interface DashboardLayoutProps {
    children: ReactNode;
    navigation: {
        navigation: NavigationItem[];
    };
    sidebarFooter?: SidebarFooterItem[];
    branding: BrandingProps;
    className?: string;
    showTopNav?: boolean;
    onNavigationChange?: (item: NavigationItem) => void;
}
declare const DashboardLayout: React__default.FC<DashboardLayoutProps>;

declare const defaultNavigation: NavigationItem[];
declare const defaultFooterItems: SidebarFooterItem[];
declare class NavigationBuilder {
    private items;
    private footerItems;
    addItem(item: NavigationItem): NavigationBuilder;
    addFooterItem(item: SidebarFooterItem): NavigationBuilder;
    addSection(title: string, items: NavigationItem[]): NavigationBuilder;
    build(): {
        navigation: NavigationItem[];
        footer: SidebarFooterItem[];
    };
}

declare function useMenu(): {
    open: boolean;
    anchorEl: HTMLElement | null;
    handleOpen: (event: React.MouseEvent<HTMLElement>) => void;
    handleClose: () => void;
};

interface UsePaginationProps {
    currentPage: number;
    totalPages: number;
    siblingCount?: number;
    boundaryCount?: number;
}
type PaginationItemValue = number | 'ellipsis';
interface UsePaginationReturn {
    items: PaginationItemValue[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number;
    previousPage: number;
    startPage: number;
    endPage: number;
}
declare function usePagination({ currentPage, totalPages, siblingCount, boundaryCount, }: UsePaginationProps): UsePaginationReturn;

declare function useTableState(): {
    sorting: SortingState;
    setSorting: React$1.Dispatch<React$1.SetStateAction<SortingState>>;
    columnFilters: ColumnFiltersState;
    setColumnFilters: React$1.Dispatch<React$1.SetStateAction<ColumnFiltersState>>;
    columnVisibility: VisibilityState;
    setColumnVisibility: React$1.Dispatch<React$1.SetStateAction<VisibilityState>>;
    rowSelection: RowSelectionState;
    setRowSelection: React$1.Dispatch<React$1.SetStateAction<RowSelectionState>>;
    globalFilter: string;
    setGlobalFilter: React$1.Dispatch<React$1.SetStateAction<string>>;
    pagination: PaginationState;
    setPagination: React$1.Dispatch<React$1.SetStateAction<PaginationState>>;
};

declare function createCustomButtonVariants(customVariants?: Record<string, string>, customSizes?: Record<string, string>): {
    variants: {
        variant: {
            contained: string;
            outlined: string;
            text: string;
            destructive: string;
            secondary: string;
            ghost: string;
            link: string;
        };
        size: {
            sm: string;
            default: string;
            lg: string;
            xl: string;
            icon: string;
        };
        fullWidth: {
            true: string;
            false: string;
        };
    };
    defaultVariants: {
        variant: string;
        size: string;
        fullWidth: boolean;
    };
};
declare function getButtonStyles(variant?: VariantProps<typeof buttonVariants>['variant'], size?: VariantProps<typeof buttonVariants>['size'], fullWidth?: boolean, className?: string): string;
declare const buttonPresets: {
    readonly primary: {
        readonly variant: "contained";
        readonly size: "default";
    };
    readonly secondary: {
        readonly variant: "outlined";
        readonly size: "default";
    };
    readonly danger: {
        readonly variant: "destructive";
        readonly size: "default";
    };
    readonly small: {
        readonly variant: "contained";
        readonly size: "sm";
    };
    readonly large: {
        readonly variant: "contained";
        readonly size: "lg";
    };
    readonly icon: {
        readonly variant: "ghost";
        readonly size: "icon";
    };
    readonly link: {
        readonly variant: "link";
        readonly size: "default";
    };
};
declare function validateButtonProps(props: {
    variant?: string;
    size?: string;
    fullWidth?: boolean;
    loading?: boolean;
    disabled?: boolean;
}): string[];
declare function generateThemeButtonVariants(theme?: 'light' | 'dark'): {
    contained: string;
    outlined: string;
    text: string;
    destructive: string;
};
declare function createResponsiveButtonVariants(): {
    sm: string;
    default: string;
    lg: string;
};

declare function cn(...inputs: ClassValue[]): string;

export { Autocomplete, Avatar, AvatarFallback, AvatarImage, Badge, type BadgeColors, type BadgeProps$1 as BadgeProps, type BadgeStatus, type BadgeStatusConfig, type BadgeStatusDefinition, type BadgeStatusOptions, type BadgeVariantColors, type BadgeVariants, Input$1 as BaseInput, type InputProps$1 as BaseInputProps, BrandingComponent, type BrandingComponentProps, BrandingComponentSkeleton, type BrandingData, type BrandingProps, Button, type ButtonProps, Calendar, type CalendarProps, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Checkbox, Container, type ContainerProps, DashboardLayout, type DashboardLayoutProps, type DataTableColumnProps, DataTablePagination, type DataTablePaginationProps, type DataTableStateProps, ComponentIqDatePicker as DatePicker, type DatePickerProps, type DatePickerValue, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, EnhancedDataTable, type EnhancedDataTableProps, EnhancedPagination, type EnhancedPaginationProps, type FilledColors, Input, NavigationBuilder, type NavigationItem, NavigationMenu, NavigationMenuItem, NavigationMenuLink, type OutlinedColors, Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, type PastelColors, Popover, PopoverContent, PopoverTrigger, RHFAutocomplete, RHFCheckbox, RHFDDatePicker, RHFInput, RHFRadio, RHFSelect, RHFTextarea, Radio, ReusableTabs, type ReusableTabsProps, ScrollArea, Select, type SelectOption, Separator, Sidebar, SidebarContent, SidebarFooter, type SidebarFooterItem, SidebarHeader, Skeleton, type TabItem, TableCell, type TableCellProps, type TableSizeProps, type TablevariantProps, Textarea, Typography, type TypographyProps, badgeVariants, buttonPresets, buttonVariants, cn, createCustomButtonVariants, createResponsiveButtonVariants, defaultBadgeStatusConfig, defaultFooterItems, defaultNavigation, generateThemeButtonVariants, getButtonStyles, makeCustomColors, tabListVariants, tabTriggerVariants, typographyVariants, useEnhancedPagination, useEnhancedPagination as useEnhancedPaginationState, useMenu, usePagination, useTableState, validateButtonProps };
