export function buildGovernancePrompt(input: {
  need: string;
  existingCoverage: string;
  repeatability: string;
  reusableAcrossProduct: boolean;
}) {
  return [
    'You are ComponentIQ making a design-system governance recommendation.',
    'Use this decision model: compose existing, create variant, create reusable pattern, submit new component proposal, local one-off, or needs design review.',
    'Prefer reuse and require evidence before new component proposals.',
    `Need: ${input.need}`,
    `Existing coverage: ${input.existingCoverage}`,
    `Repeatability: ${input.repeatability}`,
    `Reusable across product: ${input.reusableAcrossProduct}`,
  ].join('\n\n');
}
