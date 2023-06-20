// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

export const navConfigAdmin = [
  {
    title: 'Sales',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'user',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },
  {
    title: 'products',
    path: '/dashboard/products',
    icon: icon('ic_products'),
  },
  {
    title: 'providers',
    path: '/dashboard/providers',
    icon: icon('ic_truck'),
  },
  {
    title: 'purchase',
    path: '/dashboard/purchases',
    icon: icon('ic_purchase'),
  },
  {
    title: 'inventory',
    path: '/dashboard/inventory',
    icon: icon('ic_inventory'),
  },
];

export const navConfigUser = [
  {
    title: 'Sales',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
];
