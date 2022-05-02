import { Mail, Home } from 'react-feather'

export default [
  {
    id: 'anasayfa',
    title: 'Anasayfa',
    icon: <Home size={20} />,
    navLink: '/home'
  },
  {
    id: 'categories',
    title: 'Categoriler',
    icon: <Mail size={20} />,
    navLink: '/second-page'
  }
]
