import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
  MdScience,
  MdControlPoint,
  MdControlCamera,
  MdSystemUpdate,
  MdDisplaySettings,
  MdAutoAwesome,
} from 'react-icons/md';

// Admin Imports
// import MainDashboard from './pages/admin/default';
// import NFTMarketplace from './pages/admin/nft-marketplace';
// import Profile from './pages/admin/profile';
// import DataTables from './pages/admin/data-tables';
// import RTL from './pages/rtl/rtl-default';

// Auth Imports
// import SignInCentered from './pages/auth/sign-in';
import { IRoute } from 'types/navigation';

const routes: IRoute[] = [
  {
    name: 'Production Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} mt='6px' width="20px" height="20px" color="inherit" />,
  },
  {
    name: 'Simulation',
    layout: '/admin',
    path: '/prediction/form',
    icon: <Icon as={MdScience} mt='6px' width="20px" height="20px" color="inherit" />,
  },
  {
    name: 'Data Analysis',
    layout: '/admin',
    icon: <Icon as={MdBarChart} mt='6px' width="20px" height="20px" color="inherit" />,
    path: '/data-tables',
  },
  {
    name: 'Virtual Assistant',
    layout: '/admin',
    icon: <Icon as={MdAutoAwesome} mt='6px' width="20px" height="20px" color="inherit" />,
    path: '/chat-ui',
  },
  {
    name: 'Port Control',
    layout: '/admin',
    path: '/portcontrol',
    icon: (
      <Icon
        mt='6px' as={MdDisplaySettings}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    secondary: true,
  },
  {
    name: 'Profile',
    layout: '/admin',
    path: '/profile',
    icon: <Icon mt='6px' as={MdPerson} width="20px" height="20px" color="inherit" />,
  },
  {
    name: 'Sign Out',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon mt='6px' as={MdLock} width="20px" height="20px" color="inherit" />,
  },
];

export default routes;