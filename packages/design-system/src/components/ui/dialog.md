# Dialog / Modal

Reusable centered dialog primitive for confirmations, forms, and focused decisions. It is built on Radix Dialog for focus management, escape key behavior, and accessible labeling.

## Import

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
  Modal,
} from 'componentiq';
```

## Layout Contract

`DialogContent` uses three rows:

- `DialogHeader`: fixed at the top.
- `DialogBody`: scrollable by default.
- `DialogFooter`: fixed at the bottom.

Place long content and forms inside `DialogBody` so actions remain visible.

## Composable Usage

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open dialog</Button>
  </DialogTrigger>
  <DialogContent size='md'>
    <DialogHeader>
      <DialogTitle>Delete project?</DialogTitle>
      <DialogDescription>This action cannot be undone.</DialogDescription>
    </DialogHeader>
    <DialogBody>
      <p>All related settings and saved views will be removed.</p>
    </DialogBody>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant='outlined'>Cancel</Button>
      </DialogClose>
      <Button variant='destructive'>Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Convenience Modal

```tsx
<Modal
  trigger={<Button>Edit profile</Button>}
  header={<DialogTitle>Edit profile</DialogTitle>}
  footer={<Button>Save</Button>}
>
  <ProfileForm />
</Modal>
```

## Props

`DialogContent`

- `size`: `sm | md | lg | xl | full`
- `showClose`: `boolean`
- `closeLabel`: accessible label for the close button

`Modal`

- `trigger`: React node rendered through `DialogTrigger asChild`
- `header`: React node rendered in `DialogHeader`
- `footer`: React node rendered in `DialogFooter`
- `children`: React node rendered in the scrollable `DialogBody`
