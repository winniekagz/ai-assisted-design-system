export interface DesignToken {
  name: string;
  category: 'color' | 'spacing' | 'radius' | 'typography' | 'state';
  value: string;
  usage: string;
}

export const designTokens: DesignToken[] = [
  // Text
  { name: 'text-title',        category: 'color', value: '#331812', usage: 'Headings and display text — maximum contrast.' },
  { name: 'text-paragraph',    category: 'color', value: '#331812', usage: 'Body copy and default readable text.' },
  { name: 'text-muted',        category: 'color', value: '#7A5F57', usage: 'Metadata, placeholders, supporting copy.' },
  { name: 'text-brand',        category: 'color', value: '#8D493A', usage: 'Links, active labels, brand emphasis.' },
  // Backgrounds
  { name: 'bg-default',        category: 'color', value: '#FDFAF9', usage: 'Page background.' },
  { name: 'bg-surface',        category: 'color', value: '#F8EDE3', usage: 'Cards, popovers, modals.' },
  { name: 'bg-secondary',      category: 'color', value: '#DFD3C3', usage: 'Inset panels, secondary sections.' },
  { name: 'bg-hover',          category: 'color', value: '#F8EDE3', usage: 'Hover state on page background.' },
  { name: 'bg-card-active',    category: 'color', value: '#DFD3C3', usage: 'Selected / active card state.' },
  // Borders
  { name: 'border-default',    category: 'color', value: '#D0B8A8', usage: 'Input strokes, card outlines.' },
  { name: 'border-subtle',     category: 'color', value: '#DFD3C3', usage: 'Light dividers between sections.' },
  { name: 'border-focus',      category: 'color', value: '#8D493A', usage: 'Keyboard focus ring.' },
  // Brand
  { name: 'color-primary',     category: 'color', value: '#8D493A', usage: 'Primary actions, CTAs, key interactive elements.' },
  { name: 'color-secondary',   category: 'color', value: '#647A58', usage: 'Secondary brand accent — warm sage complement.' },
  // Status
  { name: 'status-error',      category: 'color', value: '#C62828', usage: 'Validation errors and destructive states.' },
  { name: 'status-warning',    category: 'color', value: '#E65100', usage: 'Warnings that need attention.' },
  { name: 'status-success',    category: 'color', value: '#2E7D32', usage: 'Positive status and success feedback.' },
  { name: 'status-info',       category: 'color', value: '#0277BD', usage: 'Informational status and neutral guidance.' },
  { name: 'status-error-bg',   category: 'color', value: '#FDECEA', usage: 'Error banner / badge background.' },
  { name: 'status-warning-bg', category: 'color', value: '#FEF0E7', usage: 'Warning banner / badge background.' },
  { name: 'status-success-bg', category: 'color', value: '#EBF5EB', usage: 'Success banner / badge background.' },
  { name: 'status-info-bg',    category: 'color', value: '#EAF4FB', usage: 'Info banner / badge background.' },
  { name: 'spacing-2', category: 'spacing', value: '0.5rem', usage: 'Tight inline spacing.' },
  { name: 'spacing-3', category: 'spacing', value: '0.75rem', usage: 'Compact control and card gaps.' },
  { name: 'spacing-4', category: 'spacing', value: '1rem', usage: 'Default stack and grid spacing.' },
  { name: 'spacing-6', category: 'spacing', value: '1.5rem', usage: 'Section and card interior spacing.' },
  { name: 'radius-md', category: 'radius', value: '0.625rem', usage: 'Default control radius.' },
  { name: 'font-size-sm', category: 'typography', value: '0.875rem', usage: 'Metadata and compact UI text.' },
  { name: 'font-size-base', category: 'typography', value: '1rem', usage: 'Default body and form text.' },
  { name: 'focus-ring', category: 'state', value: 'ring-2 ring-ring', usage: 'Keyboard focus visibility.' },
];

export const tokenNames = designTokens.map(token => token.name);
