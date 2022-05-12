import { Home, Settings, Package, Codepen } from 'react-feather'

export default [
  {
    id: 'home',
    title: 'Anasayfa',
    icon: <Home size={20} />,
    navLink: '/home'
  },
  {
    id: 'categories',
    title: 'Kategoriler',
    icon: <Codepen size={20} />,
    navLink: '/categories'
  },
  {
    id: 'products',
    title: 'Ürünler',
    icon: <Package size={20} />,
    navLink: '/products'
  },
  {
    id: 'theme-settings',
    title: 'Tema Ayarları',
    icon: <Settings size={20} />,
    navLink: '/theme-settings'
  }
  ,
  {
    id: 'account-settings',
    title: ' İşletme Ayarları',
    icon: <Settings size={20} />,
    navLink: '/account-settings'
  }
]
