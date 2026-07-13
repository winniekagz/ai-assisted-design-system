/**
 * Maps ComponentIQ design tokens onto Clerk's <SignIn>/<SignUp> widgets so
 * they inherit the brand instead of shipping Clerk's defaults. The `card`
 * element is made transparent/borderless on purpose: the widget sits inside
 * AuthLayout's right pane, which already provides the surface, padding, and
 * the brand rail beside it.
 *
 * Untyped (not `Appearance` from '@clerk/types') because that package isn't
 * installed as a direct dependency here; @clerk/nextjs's `appearance` prop
 * still accepts this shape structurally.
 */
export const clerkAuthAppearance = {
  variables: {
    colorPrimary: '#8D493A',
    colorText: '#111827',
    colorTextSecondary: '#6B7280',
    colorBackground: '#FFFFFF',
    colorInputBackground: '#FFFFFF',
    colorInputText: '#111827',
    colorDanger: '#B42318',
    colorSuccess: '#067647',
    colorWarning: '#B54708',
    colorNeutral: '#111827',
    borderRadius: '0.5rem',
    fontFamily: "'Rubik', ui-sans-serif, system-ui, sans-serif",
    fontSize: '0.875rem',
  },
  elements: {
    rootBox: 'w-full',
    cardBox: 'w-full shadow-none',
    card: 'bg-transparent shadow-none border-0 p-0 w-full',
    header: 'text-left',
    headerTitle: 'text-[20px] font-bold tracking-tight text-foreground',
    headerSubtitle: 'text-[13px] text-muted-foreground',

    formButtonPrimary:
      'bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground ' +
      'text-sm font-medium normal-case shadow-none h-10 rounded-md ' +
      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',

    formFieldLabel: 'text-[12.5px] font-medium text-foreground',
    formFieldInput:
      'h-10 rounded-md border border-input bg-background text-sm text-foreground ' +
      'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    formFieldInputShowPasswordButton: 'text-primary',

    socialButtonsBlockButton:
      'h-10 rounded-md border border-border bg-background text-sm font-medium text-foreground ' +
      'hover:bg-accent hover:text-accent-foreground',
    socialButtonsBlockButtonText: 'font-medium',

    dividerLine: 'bg-border',
    dividerText: 'text-[11.5px] text-muted-foreground',

    footerActionLink: 'text-primary hover:text-primary/90 font-medium',
    formResendCodeLink: 'text-primary',
    identityPreviewEditButton: 'text-primary',

    footer: 'text-[11px] text-muted-foreground',
  },
  layout: {
    socialButtonsPlacement: 'top',
    showOptionalFields: true,
  },
};
