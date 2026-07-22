'use client';

import { Button } from 'componentiq';
import { StatusCallout } from '../shared-components';
export function LocalNoDetectStep({
  onUploadAnyway,
  onChooseAnother,
}: {
  onUploadAnyway(): void;
  onChooseAnother(): void;
}) {
  return (
    <div className='grid gap-4'>
      <StatusCallout
        tone='warning'
        title='No recognizable project setup found'
        detail='ComponentIQ could not confidently detect framework or package metadata. You can continue anyway or pick another folder.'
      />
      <div className='flex flex-wrap gap-2'>
        <Button type='button' onClick={onUploadAnyway}>Upload anyway</Button>
        <Button type='button' variant='outlined' onClick={onChooseAnother}>Choose another folder</Button>
      </div>
    </div>
  );
}
