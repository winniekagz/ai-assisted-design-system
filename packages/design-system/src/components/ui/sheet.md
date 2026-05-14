# Sheet / Drawer

Reusable drawer primitive for focused workflows. It is built on Radix Dialog, so focus management, escape key behavior, and overlay dismissal are handled by the underlying accessibility primitive.

## Import

```tsx
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
  SheetClose,
  Drawer,
} from 'componentiq';
```

## Layout Contract

`SheetContent` uses three rows:

- `SheetHeader`: fixed at the top.
- `SheetBody`: scrollable by default.
- `SheetFooter`: fixed at the bottom.

Place long content, tables, and forms inside `SheetBody` so actions remain visible.

## Composable Usage

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button>Open sheet</Button>
  </SheetTrigger>
  <SheetContent side='right' size='lg'>
    <SheetHeader>
      <SheetTitle>Event Details</SheetTitle>
      <SheetDescription>
        Shipment, warehouse and crew related details
      </SheetDescription>
    </SheetHeader>
    <SheetBody>
      <EventDetails />
    </SheetBody>
    <SheetFooter>
      <SheetClose asChild>
        <Button variant='outlined'>Cancel</Button>
      </SheetClose>
      <Button>Save</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

## Convenience Drawer

```tsx
<Drawer
  trigger={<Button>Open drawer</Button>}
  header={<SheetTitle>Assets</SheetTitle>}
  footer={<Button>Export</Button>}
>
  <AssetTable />
</Drawer>
```

## Props

`SheetContent`

- `side`: `top | right | bottom | left`
- `size`: `sm | md | lg | xl | full`
- `showClose`: `boolean`
- `closeLabel`: accessible label for the close button

`Drawer`

- `trigger`: React node rendered through `SheetTrigger asChild`
- `header`: React node rendered in `SheetHeader`
- `footer`: React node rendered in `SheetFooter`
- `children`: React node rendered in the scrollable `SheetBody`

## Side Examples

```tsx
<SheetContent side='top' size='md'>...</SheetContent>
<SheetContent side='bottom' size='md'>...</SheetContent>
<SheetContent side='right' size='md'>...</SheetContent>
<SheetContent side='left' size='md'>...</SheetContent>
```
