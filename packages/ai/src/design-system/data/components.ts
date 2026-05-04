export type ComponentStatus = 'stable' | 'beta' | 'needs_docs';
export type ComponentA11yStatus = 'reviewed' | 'needs_review';
export type DocumentationStatus = 'complete' | 'partial' | 'missing';

export interface DesignSystemComponent {
  slug: string;
  name: string;
  category: string;
  description: string;
  status: ComponentStatus;
  accessibilityStatus: ComponentA11yStatus;
  documentationStatus: DocumentationStatus;
  preview: string;
  variants: string[];
  props: Array<{ name: string; type: string; description: string }>;
  usage: string[];
  examples: string[];
  accessibility: string[];
}

export const designSystemComponents: DesignSystemComponent[] = [
  {
    slug: 'button',
    name: 'Button',
    category: 'Actions',
    description: 'Primary, secondary, text, destructive, icon, and loading actions.',
    status: 'stable',
    accessibilityStatus: 'reviewed',
    documentationStatus: 'complete',
    preview: 'Primary action with loading and icon support',
    variants: ['contained', 'outlined', 'text', 'secondary', 'destructive', 'ghost'],
    props: [
      { name: 'variant', type: 'ButtonVariant', description: 'Visual emphasis and intent.' },
      { name: 'loading', type: 'boolean', description: 'Shows progress and disables interaction.' },
      { name: 'startIcon', type: 'ReactNode', description: 'Decorative leading icon.' },
    ],
    usage: ['Use for explicit user actions.', 'Prefer one primary action per surface.'],
    examples: ['<Button startIcon={<Save />}>Save changes</Button>'],
    accessibility: ['Use clear labels.', 'Do not rely on icon-only buttons without aria-label.'],
  },
  {
    slug: 'input',
    name: 'Input',
    category: 'Forms',
    description: 'Single-line text entry with focus and disabled states.',
    status: 'stable',
    accessibilityStatus: 'reviewed',
    documentationStatus: 'complete',
    preview: 'Text field with label and helper text',
    variants: ['default', 'error', 'disabled'],
    props: [
      { name: 'type', type: 'HTMLInputTypeAttribute', description: 'Native input type.' },
      { name: 'placeholder', type: 'string', description: 'Supplemental hint, not a label.' },
    ],
    usage: ['Use with a persistent visible label.', 'Pair validation errors with text.'],
    examples: ['<label>Email<Input type="email" /></label>'],
    accessibility: ['Associate every input with a label.', 'Expose errors with aria-describedby.'],
  },
  {
    slug: 'select',
    name: 'Select',
    category: 'Forms',
    description: 'Native select for constrained option sets.',
    status: 'stable',
    accessibilityStatus: 'reviewed',
    documentationStatus: 'complete',
    preview: 'Dropdown field for context and platform selection',
    variants: ['default', 'error', 'success'],
    props: [
      { name: 'placeholder', type: 'string', description: 'Disabled starter option.' },
      { name: 'onChange', type: 'ChangeEventHandler', description: 'Handles selected option.' },
    ],
    usage: ['Use for 3 or more mutually exclusive options.', 'Keep option labels short.'],
    examples: ['<Select><option>Dashboard</option></Select>'],
    accessibility: ['Use visible labels.', 'Avoid custom selects unless needed.'],
  },
  {
    slug: 'card',
    name: 'Card',
    category: 'Layout',
    description: 'Framed content grouping for repeated or self-contained objects.',
    status: 'stable',
    accessibilityStatus: 'reviewed',
    documentationStatus: 'complete',
    preview: 'Metric, recommendation, proposal, and component cards',
    variants: ['default', 'interactive', 'metric'],
    props: [
      { name: 'className', type: 'string', description: 'Scoped layout and surface styling.' },
    ],
    usage: ['Use for repeated list items or contained tools.', 'Avoid nesting cards.'],
    examples: ['<Card><CardHeader><CardTitle>Audit</CardTitle></CardHeader></Card>'],
    accessibility: ['Use semantic headings inside cards.', 'Ensure interactive cards have focus states.'],
  },
  {
    slug: 'modal',
    name: 'Modal',
    category: 'Overlays',
    description: 'Focused interruptive workflow for confirmation or editing.',
    status: 'beta',
    accessibilityStatus: 'needs_review',
    documentationStatus: 'partial',
    preview: 'Review confirmation and proposal approval dialogs',
    variants: ['default', 'confirmation', 'form'],
    props: [
      { name: 'open', type: 'boolean', description: 'Controls visibility.' },
      { name: 'onOpenChange', type: 'function', description: 'Handles close and open changes.' },
    ],
    usage: ['Use for focused decisions that cannot happen inline.'],
    examples: ['Compose with Radix Dialog before adding a new DS primitive.'],
    accessibility: ['Trap focus.', 'Return focus to the invoking control.'],
  },
  {
    slug: 'table',
    name: 'Table',
    category: 'Data Display',
    description: 'Structured rows, columns, sorting, and pagination patterns.',
    status: 'stable',
    accessibilityStatus: 'reviewed',
    documentationStatus: 'partial',
    preview: 'Audit findings and component inventory',
    variants: ['basic', 'enhanced', 'paginated'],
    props: [
      { name: 'columns', type: 'ColumnDef[]', description: 'Column definitions.' },
      { name: 'data', type: 'T[]', description: 'Rows to render.' },
    ],
    usage: ['Use for comparable structured data.', 'Avoid tables for layout.'],
    examples: ['Use enhanced data table for sortable review queues.'],
    accessibility: ['Use headers and captions where helpful.', 'Keep row actions keyboard reachable.'],
  },
  {
    slug: 'badge',
    name: 'Badge',
    category: 'Status',
    description: 'Compact status, quality, or category indicator.',
    status: 'stable',
    accessibilityStatus: 'reviewed',
    documentationStatus: 'complete',
    preview: 'Stable, reviewed, partial docs',
    variants: ['filled', 'outlined', 'pastel'],
    props: [
      { name: 'status', type: 'string', description: 'Maps to approved badge colors.' },
      { name: 'variant', type: 'filled | outlined | pastel', description: 'Visual treatment.' },
    ],
    usage: ['Use for metadata, not primary actions.'],
    examples: ['<Badge variant="pastel" status="active">Stable</Badge>'],
    accessibility: ['Do not encode meaning by color alone.'],
  },
  {
    slug: 'alert',
    name: 'Alert',
    category: 'Feedback',
    description: 'Inline feedback for important contextual messages.',
    status: 'needs_docs',
    accessibilityStatus: 'needs_review',
    documentationStatus: 'partial',
    preview: 'Warning and review-required notices',
    variants: ['info', 'success', 'warning', 'error'],
    props: [
      { name: 'tone', type: 'AlertTone', description: 'Message severity.' },
    ],
    usage: ['Use for persistent, contextual feedback.'],
    examples: ['Compose with Card/Badge until primitive is formalized.'],
    accessibility: ['Use role=status for passive updates, role=alert for urgent issues.'],
  },
  {
    slug: 'tabs',
    name: 'Tabs',
    category: 'Navigation',
    description: 'Keyboard-friendly grouped sections for sibling content.',
    status: 'stable',
    accessibilityStatus: 'reviewed',
    documentationStatus: 'complete',
    preview: 'Documentation sections and review panels',
    variants: ['underlined', 'outlined', 'contained', 'rounded'],
    props: [
      { name: 'items', type: 'TabItem[]', description: 'Tab labels and panels.' },
      { name: 'defaultValue', type: 'string', description: 'Initial active tab.' },
    ],
    usage: ['Use for related views at the same hierarchy level.'],
    examples: ['<ReusableTabs items={items} />'],
    accessibility: ['Use concise labels.', 'Keep tab content discoverable.'],
  },
  {
    slug: 'toast',
    name: 'Toast',
    category: 'Feedback',
    description: 'Non-blocking temporary feedback after user actions.',
    status: 'needs_docs',
    accessibilityStatus: 'needs_review',
    documentationStatus: 'missing',
    preview: 'Saved recommendation confirmation',
    variants: ['info', 'success', 'warning', 'error'],
    props: [
      { name: 'message', type: 'string', description: 'Concise feedback copy.' },
    ],
    usage: ['Use after low-risk async actions.', 'Do not hide blocking errors in a toast.'],
    examples: ['Use local inline status until toast primitive is implemented.'],
    accessibility: ['Announce updates politely.', 'Keep message visible long enough.'],
  },
  {
    slug: 'tooltip',
    name: 'Tooltip',
    category: 'Overlays',
    description: 'Short supplemental explanation for icon-only or dense controls.',
    status: 'beta',
    accessibilityStatus: 'needs_review',
    documentationStatus: 'partial',
    preview: 'Icon control descriptions',
    variants: ['default'],
    props: [
      { name: 'content', type: 'string', description: 'Brief tooltip text.' },
    ],
    usage: ['Use to clarify, not to hold required information.'],
    examples: ['Prefer visible labels where space allows.'],
    accessibility: ['Ensure keyboard and pointer access.'],
  },
  {
    slug: 'datepicker',
    name: 'DatePicker',
    category: 'Forms',
    description: 'Date selection with calendar affordance.',
    status: 'stable',
    accessibilityStatus: 'reviewed',
    documentationStatus: 'partial',
    preview: 'Filter ranges and scheduling inputs',
    variants: ['single', 'range'],
    props: [
      { name: 'value', type: 'Date | DateRange', description: 'Selected date state.' },
      { name: 'onChange', type: 'function', description: 'Updates selected date.' },
    ],
    usage: ['Use when dates benefit from calendar context.'],
    examples: ['Use RHFDatePicker in validated forms.'],
    accessibility: ['Support keyboard navigation.', 'Provide typed date alternatives where required.'],
  },
];

export const componentNames = designSystemComponents.map(component => component.name);

export function getComponentBySlug(slug: string) {
  return designSystemComponents.find(component => component.slug === slug);
}
