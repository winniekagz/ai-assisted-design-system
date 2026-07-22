'use client';

import type { AuditInputType } from '@winniekagendo/componentiq-shared-types';
import {
  Button,
  Select,
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Textarea,
  toast,
} from 'componentiq';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

import { useRunAudit } from '@/features/projects/hooks';

import { errorMessageFromAuditFailure } from './errors';
import { inputTypeOptions, type RunAuditDrawerProps } from './types';

export function RunAuditDrawer({
  open,
  orgSlug,
  organizationId,
  projectId,
  projectName,
  onOpenChange,
}: RunAuditDrawerProps) {
  const [inputType, setInputType] = useState<AuditInputType>('jsx');
  const [content, setContent] = useState('');
  const [contentError, setContentError] = useState('');
  const runAudit = useRunAudit(orgSlug, organizationId, projectId);
  const trimmedContent = content.trim();

  function reset() {
    setInputType('jsx');
    setContent('');
    setContentError('');
    runAudit.reset();
  }

  function requestOpenChange(nextOpen: boolean) {
    if (!nextOpen) reset();
    onOpenChange(nextOpen);
  }

  async function submit() {
    if (runAudit.isPending) return;

    if (!trimmedContent) {
      setContentError('Paste JSX, an implementation plan, or a diff to audit.');
      return;
    }

    setContentError('');

    try {
      const response = await runAudit.mutateAsync({ inputType, content: trimmedContent });
      toast({
        variant: response.status === 'passed' ? 'success' : 'warning',
        title: 'Audit completed',
        description: response.summary,
      });
      requestOpenChange(false);
    } catch (error) {
      toast({
        variant: 'error',
        title: 'Audit could not run',
        description: errorMessageFromAuditFailure(error),
      });
    }
  }

  return (
    <Sheet open={open} onOpenChange={requestOpenChange}>
      <SheetContent side='right' size='md' aria-describedby='run-audit-description'>
        <SheetHeader>
          <SheetTitle>Run audit</SheetTitle>
          <SheetDescription id='run-audit-description'>
            Audit content against {projectName}&apos;s guardrails and component rules.
          </SheetDescription>
        </SheetHeader>

        <SheetBody>
          <form
            className='grid gap-5'
            onSubmit={event => {
              event.preventDefault();
              submit();
            }}
          >
            <Select
              label='Content type'
              value={inputType}
              onChange={event => setInputType(event.target.value as AuditInputType)}
            >
              {inputTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>

            <div className='grid gap-2'>
              <label
                className='text-sm font-medium text-muted-foreground'
                htmlFor='audit-content'
              >
                Content
              </label>
              <Textarea
                id='audit-content'
                rows={12}
                value={content}
                onChange={event => {
                  setContent(event.target.value);
                  setContentError('');
                }}
                placeholder='<button className="icon-btn"><TrashIcon /></button>'
                aria-invalid={Boolean(contentError)}
                aria-describedby='audit-content-help'
              />
              <p
                id='audit-content-help'
                className={contentError ? 'text-sm text-status-error' : 'text-sm text-muted-foreground'}
              >
                {contentError || 'Paste the JSX, plan, or diff you want reviewed.'}
              </p>
            </div>
          </form>
        </SheetBody>

        <SheetFooter>
          <Button
            type='button'
            variant='outlined'
            disabled={runAudit.isPending}
            onClick={() => requestOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type='button'
            disabled={runAudit.isPending}
            onClick={submit}
            startIcon={runAudit.isPending ? <Loader2 className='size-4 animate-spin' /> : undefined}
          >
            {runAudit.isPending ? 'Running audit...' : 'Run audit'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
