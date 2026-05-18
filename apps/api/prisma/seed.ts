import { PrismaClient, GuardrailCategory, Severity } from '@prisma/client';

const prisma = new PrismaClient();

const slug = 'componentiq-demo';

async function main() {
  const organization = await prisma.organization.upsert({
    where: { slug },
    update: {},
    create: {
      name: 'ComponentIQ Demo',
      slug,
    },
  });

  const components = [
    {
      name: 'Button',
      description:
        'Shared action component for buttons and destructive actions.',
      category: 'Actions',
      docsUrl: '/components/button',
      status: 'ACTIVE',
      rules: [
        'Use for actions.',
        'Do not use for navigation; use Link.',
        'Use danger variant for destructive actions.',
      ],
    },
    {
      name: 'Modal',
      description:
        'Blocking dialog for decisions and destructive confirmations.',
      category: 'Overlays',
      docsUrl: '/components/modal',
      status: 'ACTIVE',
      rules: [
        'Use for blocking decisions and destructive confirmations.',
        'Do not use for non-blocking side tasks.',
        'Must support focus management.',
      ],
    },
    {
      name: 'Drawer',
      description: 'Panel for secondary workflows while keeping page context.',
      category: 'Overlays',
      docsUrl: '/components/drawer',
      status: 'ACTIVE',
      rules: [
        'Use for secondary tasks where users should keep page context.',
        'Do not use for critical blocking confirmations.',
      ],
    },
    {
      name: 'DataState',
      description:
        'State wrapper for API-driven loading, error, empty, and success UI.',
      category: 'Feedback',
      docsUrl: '/components/data-state',
      status: 'ACTIVE',
      rules: [
        'Use for loading, error, empty, and success states around API-driven UI.',
      ],
    },
    {
      name: 'Card',
      description: 'Container for grouped content and repeated items.',
      category: 'Layout',
      docsUrl: '/components/card',
      status: 'ACTIVE',
      rules: [],
    },
    {
      name: 'Toast',
      description: 'Temporary notification for non-blocking feedback.',
      category: 'Feedback',
      docsUrl: '/components/toast',
      status: 'ACTIVE',
      rules: [],
    },
  ];

  for (const item of components) {
    const component = await prisma.component.upsert({
      where: {
        organizationId_name: {
          organizationId: organization.id,
          name: item.name,
        },
      },
      update: {
        description: item.description,
        category: item.category,
        docsUrl: item.docsUrl,
        status: item.status,
      },
      create: {
        organizationId: organization.id,
        name: item.name,
        description: item.description,
        category: item.category,
        docsUrl: item.docsUrl,
        status: item.status,
      },
    });

    for (const ruleText of item.rules) {
      const existing = await prisma.componentRule.findFirst({
        where: { componentId: component.id, ruleText },
      });

      if (!existing) {
        await prisma.componentRule.create({
          data: {
            componentId: component.id,
            ruleType: 'USAGE',
            ruleText,
            severity: Severity.MEDIUM,
          },
        });
      }
    }
  }

  const guardrails = [
    {
      category: GuardrailCategory.COMPONENT_USAGE,
      title: 'Prefer existing components',
      ruleText: 'Use existing components before creating custom UI.',
      severity: Severity.HIGH,
    },
    {
      category: GuardrailCategory.DESIGN_TOKENS,
      title: 'No raw hex colors',
      ruleText: 'Do not use raw hex colors outside token files.',
      severity: Severity.HIGH,
    },
    {
      category: GuardrailCategory.ACCESSIBILITY,
      title: 'Icon button labels',
      ruleText: 'Icon-only buttons require aria-label.',
      severity: Severity.HIGH,
    },
    {
      category: GuardrailCategory.ACCESSIBILITY,
      title: 'Modal focus trap',
      ruleText: 'Modals must trap focus.',
      severity: Severity.CRITICAL,
    },
    {
      category: GuardrailCategory.UI_STATES,
      title: 'API state coverage',
      ruleText:
        'API-driven UI should include loading, error, empty, and success states.',
      severity: Severity.MEDIUM,
    },
    {
      category: GuardrailCategory.AI_SAFETY,
      title: 'Review-only AI',
      ruleText: 'AI suggestions are review-only and cannot approve PRs.',
      severity: Severity.CRITICAL,
    },
  ];

  for (const guardrail of guardrails) {
    const existing = await prisma.guardrail.findFirst({
      where: {
        organizationId: organization.id,
        title: guardrail.title,
      },
    });

    if (!existing) {
      await prisma.guardrail.create({
        data: {
          organizationId: organization.id,
          ...guardrail,
          enabled: true,
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async error => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
