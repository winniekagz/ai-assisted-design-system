'use client';

import type { DetectedProjectConfiguration } from '@winniekagendo/componentiq-shared-types';
import { Button, Input, Textarea } from 'componentiq';
import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';
import type { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';

import { StatusCallout, SummaryRows } from '../shared-components';
import type { ConfigurationFormValues } from '../types';

export function ReviewSetupFooterActions({
  isConfirming,
  onClose,
  onConfirm,
}: {
  isConfirming?: boolean;
  onClose(): void;
  onConfirm(): void;
}) {
  return (
    <>
      <Button type='button' variant='outlined' onClick={onClose}>
        Save and review later
      </Button>
      <Button
        type='button'
        disabled={isConfirming}
        onClick={onConfirm}
        startIcon={
          isConfirming ? <Loader2 className='size-4 animate-spin' /> : undefined
        }
      >
        {isConfirming ? 'Confirming' : 'Confirm configuration'}
      </Button>
    </>
  );
}

type ReviewSetupStepProps = {
  detectedConfiguration: DetectedProjectConfiguration | null;
  register: UseFormRegister<ConfigurationFormValues>;
  setValue: UseFormSetValue<ConfigurationFormValues>;
  values: ConfigurationFormValues;
  errors: FieldErrors<ConfigurationFormValues>;
};

export function ReviewSetupStep({
  detectedConfiguration,
  register,
  setValue,
  values,
  errors,
}: ReviewSetupStepProps) {
  const detected = detectedValues(detectedConfiguration);
  const evidence = detectedConfiguration?.setup?.framework.evidence ?? [];
  const warnings = detectedConfiguration?.warnings ?? [];

  function resetField(name: keyof ConfigurationFormValues, value: string) {
    setValue(name, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  return (
    <div className='grid gap-4'>
      <StatusCallout
        tone='info'
        title='Review detected setup'
        detail='Confirm the configuration Component IQ should use for future project analysis. You can correct values that were detected incorrectly.'
      />

      <SummaryRows
        rows={[
          ['Detected at', detectedConfiguration?.analyzedAt ?? 'Not available'],
          ['Detector version', detectedConfiguration?.detectorVersion ?? 'Not available'],
          ['Source snapshot', detectedConfiguration?.sourceSnapshotId ?? 'Not available'],
        ]}
      />

      <div className='grid gap-3'>
        <EditableField
          label='Framework'
          detected={detected.framework}
          current={values.framework}
          edited={values.framework !== detected.framework}
          error={errors.framework?.message}
          onReset={() => resetField('framework', detected.framework)}
        >
          <Input label='Framework value' {...register('framework')} />
        </EditableField>
        <EditableField
          label='Package manager'
          detected={detected.packageManager}
          current={values.packageManager}
          edited={values.packageManager !== detected.packageManager}
          error={errors.packageManager?.message}
          onReset={() => resetField('packageManager', detected.packageManager)}
        >
          <Input label='Package manager value' {...register('packageManager')} />
        </EditableField>
        <EditableField
          label='Styling system'
          detected={detected.stylingSystem}
          current={values.stylingSystem}
          edited={values.stylingSystem !== detected.stylingSystem}
          error={errors.stylingSystem?.message}
          onReset={() => resetField('stylingSystem', detected.stylingSystem)}
        >
          <Input label='Styling system value' {...register('stylingSystem')} />
        </EditableField>
        <EditableField
          label='Project root'
          detected={detected.projectRoot}
          current={values.projectRoot}
          edited={values.projectRoot !== detected.projectRoot}
          error={errors.projectRoot?.message}
          onReset={() => resetField('projectRoot', detected.projectRoot)}
        >
          <Input label='Project root value' {...register('projectRoot')} />
        </EditableField>
        <EditableField
          label='Component paths'
          detected={detected.componentDirectories}
          current={values.componentDirectories}
          edited={values.componentDirectories !== detected.componentDirectories}
          error={errors.componentDirectories?.message}
          onReset={() =>
            resetField('componentDirectories', detected.componentDirectories)
          }
        >
          <Input
            label='Component paths value'
            {...register('componentDirectories')}
          />
        </EditableField>
        <EditableField
          label='Token paths'
          detected={detected.tokenPath}
          current={values.tokenPath}
          edited={values.tokenPath !== detected.tokenPath}
          error={errors.tokenPath?.message}
          onReset={() => resetField('tokenPath', detected.tokenPath)}
        >
          <Input label='Token paths value' {...register('tokenPath')} />
        </EditableField>
        <div className='grid gap-2'>
          <label className='text-sm font-medium text-muted-foreground' htmlFor='configuration-reviewer-notes'>
            Reviewer notes
          </label>
          <Textarea id='configuration-reviewer-notes' {...register('notes')} />
        </div>
      </div>

      {evidence.length > 0 && (
        <details className='rounded-md border border-border bg-background px-4 py-3'>
          <summary className='cursor-pointer text-sm font-semibold text-foreground'>
            Detection evidence
          </summary>
          <ul className='mt-2 grid gap-1 text-xs text-muted-foreground'>
            {evidence.slice(0, 6).map(item => (
              <li key={`${item.type}-${item.path}-${item.detail}`}>
                {item.path}: {item.detail}
              </li>
            ))}
          </ul>
        </details>
      )}

      {warnings.length > 0 && (
        <StatusCallout
          tone='warning'
          title='Review warnings'
          detail={warnings.slice(0, 2).join(' ')}
        />
      )}
    </div>
  );
}

function EditableField({
  label,
  detected,
  current,
  edited,
  error,
  onReset,
  children,
}: {
  label: string;
  detected: string;
  current: string;
  edited: boolean;
  error?: string;
  onReset(): void;
  children: ReactNode;
}) {
  return (
    <section className='grid gap-2 rounded-md border border-border bg-background px-4 py-3'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div>
          <h3 className='text-sm font-semibold text-foreground'>{label}</h3>
          <p className='text-xs text-muted-foreground'>
            Detected: <span className='font-medium'>{detected || 'UNKNOWN'}</span>
          </p>
        </div>
        <div className='flex items-center gap-2'>
          {edited && (
            <span className='rounded-full bg-status-warning-bg px-2 py-0.5 text-xs font-medium text-status-warning'>
              Edited
            </span>
          )}
          <Button type='button' variant='ghost' onClick={onReset}>
            Reset
          </Button>
        </div>
      </div>
      {children}
      <p className='text-xs text-muted-foreground'>
        Confirmed value: <span className='font-medium'>{current || 'Empty'}</span>
      </p>
      {error && <p className='text-xs font-medium text-status-error'>{error}</p>}
    </section>
  );
}

function detectedValues(detected: DetectedProjectConfiguration | null) {
  const setup = detected?.setup;

  return {
    framework: setup?.framework.value ?? detected?.framework ?? 'UNKNOWN',
    packageManager:
      setup?.packageManager.value ?? detected?.packageManager ?? 'UNKNOWN',
    stylingSystem:
      setup?.stylingSystem.value?.[0] ?? detected?.stylingSystem ?? 'UNKNOWN',
    projectRoot: setup?.projectRoot.value ?? detected?.projectRoot ?? '.',
    componentDirectories: (
      setup?.componentPaths.value ??
      detected?.componentPaths ??
      []
    ).join(', '),
    tokenPath: (setup?.tokenPaths.value ?? detected?.tokenPaths ?? []).join(', '),
  };
}
