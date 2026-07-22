import { Select, Switch } from 'componentiq';

import {
  type ProjectSettingsForm,
} from '@/features/projects/fixtures/settings';

import { SectionHeading } from '../components';
import type { UpdateProjectSettingsForm } from '../types';

export function AuditSection({
  form,
  onChange,
}: {
  form: ProjectSettingsForm;
  onChange: UpdateProjectSettingsForm;
}) {
  const toggles = [
    ['cliAudits', 'CLI audits', 'Allow local CLI runs to report findings for this project.'],
    ['githubChecks', 'GitHub checks', 'Show audit results on pull requests.'],
    ['prePushHook', 'Pre-push hook', 'Warn contributors before code leaves their machine.'],
    ['ciPipeline', 'CI pipeline', 'Run audit checks during continuous integration.'],
  ] as const;

  return (
    <div>
      <SectionHeading title='Audit' description='Choose where audit signals appear and how severe default findings should be.' />
      <div className='grid gap-4'>
        {toggles.map(([key, label, description]) => (
          <div key={key} className='flex items-start justify-between gap-4 rounded-md border border-border bg-background px-4 py-3'>
            <div>
              <p className='text-sm font-semibold text-foreground'>{label}</p>
              <p className='mt-1 text-xs text-muted-foreground'>{description}</p>
            </div>
            <Switch
              checked={form.audit[key]}
              onCheckedChange={checked =>
                onChange(current => ({
                  ...current,
                  audit: { ...current.audit, [key]: checked },
                }))
              }
              aria-label={label}
            />
          </div>
        ))}
        <Select
          label='Default severity'
          value={form.audit.defaultSeverity}
          helperText='Used when a project-specific rule does not define its own severity.'
          onChange={event =>
            onChange(current => ({
              ...current,
              audit: {
                ...current.audit,
                defaultSeverity: event.target.value as ProjectSettingsForm['audit']['defaultSeverity'],
              },
            }))
          }
        >
          <option value='Blocking'>Blocking</option>
          <option value='Warning'>Warning</option>
          <option value='Advisory'>Advisory</option>
        </Select>
      </div>
    </div>
  );
}
