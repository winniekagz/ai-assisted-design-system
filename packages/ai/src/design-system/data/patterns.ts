export const designPatterns = [
  {
    name: 'Filter Bar',
    components: ['Input', 'Select', 'Button', 'Badge'],
    useWhen: 'A data surface needs search, scoped filters, and reset/apply actions.',
  },
  {
    name: 'Settings Form',
    components: ['Card', 'Input', 'Select', 'Button', 'Alert'],
    useWhen: 'A user changes persistent configuration with validation and save states.',
  },
  {
    name: 'Review Panel',
    components: ['Card', 'Badge', 'Tabs', 'Table', 'Button'],
    useWhen: 'A reviewer needs grouped findings, severity, and next actions.',
  },
  {
    name: 'Empty State',
    components: ['Card', 'Button', 'Alert'],
    useWhen: 'A workflow has no data, no matches, or a recoverable failure.',
  },
];
