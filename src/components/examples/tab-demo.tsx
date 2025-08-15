import { ReusableTabs, TabItem } from '../ui/tab/tabs';
import { Typography } from '../ui/typography';

const tabItems: TabItem[] = [
  {
    value: 'account',
    label: 'Account',
    content: (
      <div className='space-y-4'>
        <Typography variant='h4'>Account Settings</Typography>
        <Typography variant='body1'>
          Make changes to your account here. This is where you can update your
          profile information, change your email address, and manage your
          account preferences.
        </Typography>
        <div className='p-4 bg-muted rounded-lg'>
          <Typography variant='body2'>
            Account settings content goes here...
          </Typography>
        </div>
      </div>
    ),
  },
  {
    value: 'password',
    label: 'Password',
    content: (
      <div className='space-y-4'>
        <Typography variant='h4'>Password Management</Typography>
        <Typography variant='body1'>
          Change your password here. Make sure to use a strong password that
          includes a mix of letters, numbers, and special characters.
        </Typography>
        <div className='p-4 bg-muted rounded-lg'>
          <Typography variant='body2'>
            Password change form goes here...
          </Typography>
        </div>
      </div>
    ),
  },
  {
    value: 'notifications',
    label: 'Notifications',
    content: (
      <div className='space-y-4'>
        <Typography variant='h4'>Notification Preferences</Typography>
        <Typography variant='body1'>
          Manage your notification settings. Choose which types of notifications
          you want to receive and how you want to receive them.
        </Typography>
        <div className='p-4 bg-muted rounded-lg'>
          <Typography variant='body2'>
            Notification settings form goes here...
          </Typography>
        </div>
      </div>
    ),
  },
];

export function TabDemo() {
  return (
    <div className='space-y-8 p-6'>
      <Typography variant='h3' className='mb-6'>
        Tab Component Variants
      </Typography>

      {/* Underlined Variant (Default) */}
      <div className='space-y-4'>
        <Typography variant='h5'>Underlined Variant (Default)</Typography>
        <ReusableTabs
          items={tabItems}
          variant='underlined'
          defaultValue='account'
          className='max-w-2xl'
        />
      </div>

      {/* Outlined Variant */}
      <div className='space-y-4'>
        <Typography variant='h5'>Outlined Variant</Typography>
        <ReusableTabs
          items={tabItems}
          variant='outlined'
          defaultValue='account'
          className='max-w-2xl'
        />
      </div>

      {/* Contained Variant */}
      <div className='space-y-4'>
        <Typography variant='h5'>Contained Variant</Typography>
        <ReusableTabs
          items={tabItems}
          variant='contained'
          defaultValue='password'
          className='max-w-2xl'
        />
      </div>

      {/* Rounded Variant */}
      <div className='space-y-4'>
        <Typography variant='h5'>Rounded Variant (Badge-like)</Typography>
        <ReusableTabs
          items={tabItems}
          variant='rounded'
          defaultValue='notifications'
          className='max-w-2xl'
        />
      </div>

      {/* Different Sizes */}
      <div className='space-y-4'>
        <Typography variant='h5'>Different Sizes</Typography>
        <div className='space-y-4'>
          <div>
            <Typography variant='body2' className='mb-2'>
              Small Size
            </Typography>
            <ReusableTabs
              items={tabItems}
              variant='outlined'
              size='sm'
              defaultValue='account'
              className='max-w-2xl'
            />
          </div>
          <div>
            <Typography variant='body2' className='mb-2'>
              Default Size
            </Typography>
            <ReusableTabs
              items={tabItems}
              variant='outlined'
              size='default'
              defaultValue='account'
              className='max-w-2xl'
            />
          </div>
          <div>
            <Typography variant='body2' className='mb-2'>
              Large Size
            </Typography>
            <ReusableTabs
              items={tabItems}
              variant='outlined'
              size='lg'
              defaultValue='account'
              className='max-w-2xl'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
