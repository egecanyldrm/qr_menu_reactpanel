import { Home, ArrowRight, Package, Codepen } from 'react-feather'

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
    id: 'business',
    title: 'İşletme',
    icon: <Codepen size={20} />,
    navLink: '/business'
  }
]
