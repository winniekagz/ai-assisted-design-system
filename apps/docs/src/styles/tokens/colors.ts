export const lightColors = {
  // Primary scale - internal Tailwind compatibility.
  primary: {
    50: '#F8EDE3',
    100: '#EDDDD2',
    200: '#D9B8A6',
    300: '#BC8A76',
    400: '#A56855',
    500: '#8D493A',
    600: '#7A3F33',
    700: '#66352B',
    800: '#4D271F',
    900: '#331812',
    950: '#1A0C09',
  },

  // Secondary scale - internal Tailwind compatibility.
  secondary: {
    50: '#EEF9FB',
    100: '#D7F0F4',
    200: '#B2E0E8',
    300: '#82CAD7',
    400: '#58AEBD',
    500: '#347887', // muted teal complement
    600: '#2F6F7D',
    700: '#285D68',
    800: '#214B54',
    900: '#1C3E45',
    950: '#0D2025',
  },

  // Helper scale - internal Tailwind compatibility.
  error: {
    50: '#FEF3F2',
    100: '#FEE4E2',
    200: '#FECDCA',
    300: '#FDA29B',
    400: '#F97066',
    500: '#B42318', // main
    600: '#912018',
    700: '#7A271A',
    800: '#6B0E0E',
    900: '#460909',
    950: '#230404',
  },

  // Helper scale - internal Tailwind compatibility.
  warning: {
    50: '#FFF4E5',
    100: '#FEF0C7',
    200: '#FEDF89',
    300: '#FEC84B',
    400: '#FDB022',
    500: '#B54708', // main
    600: '#93370D',
    700: '#7A2E0E',
    800: '#742A00',
    900: '#4D1B00',
    950: '#260D00',
  },

  // Helper scale - internal Tailwind compatibility.
  info: {
    50: '#EFF8FF',
    100: '#D1E9FF',
    200: '#B2DDFF',
    300: '#84CAFF',
    400: '#53B1FD',
    500: '#175CD3', // main
    600: '#1849A9',
    700: '#194185',
    800: '#013259',
    900: '#01203A',
    950: '#00101D',
  },

  // Helper scale - internal Tailwind compatibility.
  success: {
    50: '#ECFDF3',
    100: '#D1FADF',
    200: '#A6F4C5',
    300: '#6CE9A6',
    400: '#32D583',
    500: '#067647', // main
    600: '#05603A',
    700: '#054F31',
    800: '#2E7D32',
    900: '#1B5E20',
    950: '#0D2E10',
  },

  // Neutral scale - internal Tailwind compatibility.
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#030712',
  },

  // Background colors
  background: {
    default: '#FDFAF9',
    paper: '#FFFFFF',
    secondary: '#F9FAFB',
  },

  // Text colors
  text: {
    primary: '#111827',
    paragraph: '#374151',
    secondary: '#4B5563',
    muted: '#707683',
    disabled: '#9CA3AF',
    inverse: '#FDFAF9',
  },

  // Border colors
  border: {
    default: '#D1D5DB',
    secondary: '#E5E7EB',
    focus: '#8D493A',
    error: '#B42318',
  },
} as const;

export const darkColors = {
  // Primary scale - internal Tailwind compatibility.
  primary: {
    50: '#1A0C09',
    100: '#331812',
    200: '#4D271F',
    300: '#66352B',
    400: '#7A3F33',
    500: '#D59A86',
    600: '#BC8A76',
    700: '#D9B8A6',
    800: '#EDDDD2',
    900: '#F8EDE3',
    950: '#FDFAF9',
  },

  // Secondary scale - internal Tailwind compatibility.
  secondary: {
    50: '#0D2025',
    100: '#1C3E45',
    200: '#214B54',
    300: '#285D68',
    400: '#2F6F7D',
    500: '#7BC7D8', // main
    600: '#58AEBD',
    700: '#B2E0E8',
    800: '#D7F0F4',
    900: '#EEF9FB',
    950: '#F8FDFF',
  },

  // Helper scale - internal Tailwind compatibility.
  error: {
    50: '#3B1C1A',
    100: '#5D2420',
    200: '#7A271A',
    300: '#912018',
    400: '#D92D20',
    500: '#F97066',
    600: '#FDA29B',
    700: '#FECDCA',
    800: '#FEE4E2',
    900: '#FEF3F2',
    950: '#FFFBFA',
  },

  // Helper scale - internal Tailwind compatibility.
  warning: {
    50: '#3A2A0A',
    100: '#4D1B00',
    200: '#742A00',
    300: '#93370D',
    400: '#DC6803',
    500: '#FDB022',
    600: '#FEC84B',
    700: '#FEDF89',
    800: '#FEF0C7',
    900: '#FFF4E5',
    950: '#FFFCF5',
  },

  // Helper scale - internal Tailwind compatibility.
  info: {
    50: '#102A43',
    100: '#01203A',
    200: '#013259',
    300: '#194185',
    400: '#1849A9',
    500: '#84CAFF',
    600: '#B2DDFF',
    700: '#D1E9FF',
    800: '#EFF8FF',
    900: '#F5FBFF',
    950: '#FCFEFF',
  },

  // Helper scale - internal Tailwind compatibility.
  success: {
    50: '#0B2F22',
    100: '#0D2E10',
    200: '#054F31',
    300: '#05603A',
    400: '#067647',
    500: '#32D583',
    600: '#6CE9A6',
    700: '#A6F4C5',
    800: '#D1FADF',
    900: '#ECFDF3',
    950: '#F6FEF9',
  },

  // Neutral scale - internal Tailwind compatibility.
  neutral: {
    50: '#030712',
    100: '#111827',
    200: '#1F2937',
    300: '#374151',
    400: '#4B5563',
    500: '#6B7280',
    600: '#9CA3AF',
    700: '#D1D5DB',
    800: '#E5E7EB',
    900: '#F3F4F6',
    950: '#F9FAFB',
  },

  // Background colors
  background: {
    default: '#111827',
    paper: '#1F2937',
    secondary: '#374151',
  },

  // Text colors
  text: {
    primary: '#F3F4F6',
    paragraph: '#E5E7EB',
    secondary: '#D1D5DB',
    muted: '#9CA3AF',
    disabled: '#6B7280',
    inverse: '#111827',
  },

  // Border colors
  border: {
    default: '#374151',
    secondary: '#4B5563',
    focus: '#D59A86',
    error: '#F97066',
  },
} as const;

export type ColorToken = typeof lightColors;
export type ColorMode = 'light' | 'dark';
