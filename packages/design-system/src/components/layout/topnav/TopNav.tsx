import { Bell, Menu, Search, User } from 'lucide-react';
import { Button } from '../../ui/button';
import { BrandingProps } from '../dashboard-layout';

interface TopNavProps {
  branding: BrandingProps;
  onMenuToggle: () => void;
  showMenuButton?: boolean;
}

const TopNav: React.FC<TopNavProps> = ({
  onMenuToggle,
  showMenuButton = true,
}) => {
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-none'>
      <div className='container flex h-14 items-center'>
        {showMenuButton && (
          <Button
            variant='ghost'
            size='sm'
            onClick={onMenuToggle}
            className='mr-2 h-8 w-8 p-0'
          >
            <Menu className='h-4 w-4' />
          </Button>
        )}

        <div className='ml-auto flex items-center space-x-4'>
          <Button variant='ghost' size='sm'>
            <Search className='h-4 w-4' />
          </Button>
          <Button variant='ghost' size='sm'>
            <Bell className='h-4 w-4' />
          </Button>
          <Button variant='ghost' size='sm'>
            <User className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </header>
  );
};
export default TopNav;
