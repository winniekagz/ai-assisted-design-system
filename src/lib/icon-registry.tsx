import React from 'react';

// Import all SVG icons
import ArrowForwardFilled from '@/assets/icons/arrow-forward-filled.svg';
import BackIconImg from '@/assets/icons/backIcon.png';
import Building from '@/assets/icons/building.svg';
import ChevronDownFilled from '@/assets/icons/ChevronDownFilled.svg';
import ChevronRight from '@/assets/icons/ChevronRight.svg';
import ChooseWhatToShare from '@/assets/icons/chooseWhatToShare.svg';
import Close from '@/assets/icons/close.svg';
import DataPrivacyEncryption from '@/assets/icons/dataPrivacyEncryption.svg';
import DetailsSubmitted from '@/assets/icons/detailsSubmitted.svg';
import Download from '@/assets/icons/download.svg';
import GrayProfile from '@/assets/icons/gray-profile.svg';
import HandsUp from '@/assets/icons/handsUp.svg';
import Handwrite from '@/assets/icons/handwrite.svg';
import LejaLogo from '@/assets/icons/LejaLogo.svg';
import LoadingIcon from '@/assets/icons/loadingIcon.svg';
import LockAndKey from '@/assets/icons/lockandkey.svg';
import LogoIcon from '@/assets/icons/logo-icon.svg';
import LogoTextIcon from '@/assets/icons/logo-text-icon.svg';
import Logo from '@/assets/icons/Logo.svg';
import Mail from '@/assets/icons/mail.svg';
import MenuHoverIcon from '@/assets/icons/menu-hover-icon.svg';
import Monitor from '@/assets/icons/monitor.svg';
import Mpesa from '@/assets/icons/mpesa.svg';
import Notification from '@/assets/icons/notification.svg';
import ReceiptIcon from '@/assets/icons/receiptIcon.svg';
import ReceiptOutline from '@/assets/icons/receiptOutline.svg';
import Search from '@/assets/icons/Search.svg';
import SendIcon from '@/assets/icons/sendIcon.svg';
import Support from '@/assets/icons/support.svg';
import UnLock from '@/assets/icons/unLock.svg';
import Updates from '@/assets/icons/updates.svg';
import VeryfyingIcon from '@/assets/icons/veryfyingIcon.svg';
import Wallet from '@/assets/icons/wallet.svg';

// Import PNG icons
import IconImg from '@/assets/icons/_Icon_.png';
import AddUsersImg from '@/assets/icons/addUsers.png';
import AdornmentEndImg from '@/assets/icons/AdornmentEnd.png';
import DashboardImg from '@/assets/icons/Dashboard.png';
import FourtwonineImg from '@/assets/icons/fourtwonine.png';
import GoogleImg from '@/assets/icons/google.png';
import KeyImg from '@/assets/icons/key.png';
import ListRoundedImg from '@/assets/icons/ListRounded.png';
import LogoPngImg from '@/assets/icons/logo.png';
import MembersImg from '@/assets/icons/Members.png';
import PeopleFilledImg from '@/assets/icons/PeopleFilled.png';
import SettingsImg from '@/assets/icons/settings.png';
import UsersImg from '@/assets/icons/users.png';
import VectorImg from '@/assets/icons/Vector.png';
import ViewQuiltRoundedImg from '@/assets/icons/ViewQuiltRounded (1).png';

// Import new SVG icons from backup
import AdornStartContainer from '@/assets/icons/AdornStartContainer.svg';
import AdornStartContainer1 from '@/assets/icons/AdornStartContainer1.svg';
import IconButton from '@/assets/icons/IconButton.svg';
import IconButton1 from '@/assets/icons/IconButton1.svg';
import IconButton2 from '@/assets/icons/IconButton2.svg';
import Vector from '@/assets/icons/Vector.svg';

export interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

// Icon registry object
export const Icons = {
  // SVG Icons
  ArrowForwardFilled: (props: IconProps) => <ArrowForwardFilled {...props} />,
  Building: (props: IconProps) => <Building {...props} />,
  ChevronDownFilled: (props: IconProps) => <ChevronDownFilled {...props} />,
  ChevronRight: (props: IconProps) => <ChevronRight {...props} />,
  ChooseWhatToShare: (props: IconProps) => <ChooseWhatToShare {...props} />,
  Close: (props: IconProps) => <Close {...props} />,
  DataPrivacyEncryption: (props: IconProps) => (
    <DataPrivacyEncryption {...props} />
  ),
  DetailsSubmitted: (props: IconProps) => <DetailsSubmitted {...props} />,
  Download: (props: IconProps) => <Download {...props} />,
  GrayProfile: (props: IconProps) => <GrayProfile {...props} />,
  HandsUp: (props: IconProps) => <HandsUp {...props} />,
  Handwrite: (props: IconProps) => <Handwrite {...props} />,
  LejaLogo: (props: IconProps) => <LejaLogo {...props} />,
  LoadingIcon: (props: IconProps) => <LoadingIcon {...props} />,
  LockAndKey: (props: IconProps) => <LockAndKey {...props} />,
  Logo: (props: IconProps) => <Logo {...props} />,
  LogoIcon: (props: IconProps) => <LogoIcon {...props} />,
  LogoTextIcon: (props: IconProps) => <LogoTextIcon {...props} />,
  Mail: (props: IconProps) => <Mail {...props} />,
  MenuHoverIcon: (props: IconProps) => <MenuHoverIcon {...props} />,
  Monitor: (props: IconProps) => <Monitor {...props} />,
  Mpesa: (props: IconProps) => <Mpesa {...props} />,
  Notification: (props: IconProps) => <Notification {...props} />,
  ReceiptIcon: (props: IconProps) => <ReceiptIcon {...props} />,
  ReceiptOutline: (props: IconProps) => <ReceiptOutline {...props} />,
  Search: (props: IconProps) => <Search {...props} />,
  SendIcon: (props: IconProps) => <SendIcon {...props} />,
  Support: (props: IconProps) => <Support {...props} />,
  UnLock: (props: IconProps) => <UnLock {...props} />,
  Updates: (props: IconProps) => <Updates {...props} />,
  VeryfyingIcon: (props: IconProps) => <VeryfyingIcon {...props} />,
  Wallet: (props: IconProps) => <Wallet {...props} />,

  // New SVG icons from backup
  AdornStartContainer: (props: IconProps) => <AdornStartContainer {...props} />,
  AdornStartContainer1: (props: IconProps) => (
    <AdornStartContainer1 {...props} />
  ),
  IconButton: (props: IconProps) => <IconButton {...props} />,
  IconButton1: (props: IconProps) => <IconButton1 {...props} />,
  IconButton2: (props: IconProps) => <IconButton2 {...props} />,
  Vector: (props: IconProps) => <Vector {...props} />,

  // PNG Icons
  AdornmentEnd: (props: IconProps) => (
    <img src={AdornmentEndImg.src} alt='AdornmentEnd' {...props} />
  ),
  AddUsers: (props: IconProps) => (
    <img src={AddUsersImg.src} alt='AddUsers' {...props} />
  ),
  BackIcon: (props: IconProps) => (
    <img src={BackIconImg.src} alt='BackIcon' {...props} />
  ),
  Dashboard: (props: IconProps) => (
    <img src={DashboardImg.src} alt='Dashboard' {...props} />
  ),
  Fourtwonine: (props: IconProps) => (
    <img src={FourtwonineImg.src} alt='Fourtwonine' {...props} />
  ),
  Google: (props: IconProps) => (
    <img src={GoogleImg.src} alt='Google' {...props} />
  ),
  Icon: (props: IconProps) => <img src={IconImg.src} alt='Icon' {...props} />,
  Key: (props: IconProps) => <img src={KeyImg.src} alt='Key' {...props} />,
  ListRounded: (props: IconProps) => (
    <img src={ListRoundedImg.src} alt='ListRounded' {...props} />
  ),
  LogoPng: (props: IconProps) => (
    <img src={LogoPngImg.src} alt='Logo' {...props} />
  ),
  Members: (props: IconProps) => (
    <img src={MembersImg.src} alt='Members' {...props} />
  ),
  PeopleFilled: (props: IconProps) => (
    <img src={PeopleFilledImg.src} alt='PeopleFilled' {...props} />
  ),
  Settings: (props: IconProps) => (
    <img src={SettingsImg.src} alt='Settings' {...props} />
  ),
  Users: (props: IconProps) => (
    <img src={UsersImg.src} alt='Users' {...props} />
  ),
  VectorPng: (props: IconProps) => (
    <img src={VectorImg.src} alt='Vector' {...props} />
  ),
  ViewQuiltRounded: (props: IconProps) => (
    <img src={ViewQuiltRoundedImg.src} alt='ViewQuiltRounded' {...props} />
  ),
};

// Type for icon names
export type IconName = keyof typeof Icons;

// Icon component that accepts icon name as prop
export interface IconComponentProps extends IconProps {
  name: IconName;
}

export const Icon: React.FC<IconComponentProps> = ({ name, ...props }) => {
  const IconComponent = Icons[name];
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in registry`);
    return null;
  }
  return <IconComponent {...props} />;
};

// Export individual icons for direct use
export {
  AdornStartContainer,
  AdornStartContainer1,
  ArrowForwardFilled,
  Building,
  ChevronDownFilled,
  ChevronRight,
  ChooseWhatToShare,
  Close,
  DataPrivacyEncryption,
  DetailsSubmitted,
  Download,
  GrayProfile,
  HandsUp,
  Handwrite,
  IconButton,
  IconButton1,
  IconButton2,
  LejaLogo,
  LoadingIcon,
  LockAndKey,
  Logo,
  LogoIcon,
  LogoTextIcon,
  Mail,
  MenuHoverIcon,
  Monitor,
  Mpesa,
  Notification,
  ReceiptIcon,
  ReceiptOutline,
  Search,
  SendIcon,
  Support,
  UnLock,
  Updates,
  Vector,
  VeryfyingIcon,
  Wallet,
};
