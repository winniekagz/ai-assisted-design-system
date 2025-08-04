import { NavigationItem } from '../dashboard-layout';
import { SidebarNavItem } from './SidebarNavItem';

export const RenderNavigationItem = ({
  item,
  level = 0,
  handleItemClick,
  isCollapsed,
  activeItem,
  expandedItems,
}: {
  item: NavigationItem;
  level: number;
  handleItemClick: (item: NavigationItem) => void;
  isCollapsed: boolean;
  activeItem: string;
  expandedItems: Set<string>;
}) => {
  const isActive = activeItem === item.id;
  const isExpanded = expandedItems.has(item.id);
  const hasChildren = item.children && item.children.length > 0;
  console.log('sidebarIttem', item);

  return (
    <div key={item.id} className='w-full '>
      <SidebarNavItem
        icon={item.icon}
        title={item.title}
        active={isActive}
        disabled={item.disabled}
        level={level}
        expandable={hasChildren}
        expanded={isExpanded}
        onClick={() => !item.disabled && handleItemClick(item)}
      />

      {hasChildren && isExpanded && !isCollapsed && (
        <ul className='ml-2 space-y-1'>
          {item.children!.map(child => (
            <RenderNavigationItem
              key={child.id}
              item={child}
              level={level + 1}
              handleItemClick={handleItemClick}
              isCollapsed={isCollapsed}
              activeItem={activeItem}
              expandedItems={expandedItems}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
