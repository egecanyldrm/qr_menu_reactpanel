import { lazy } from 'react'

// ** Document title
const TemplateTitle = '%s - Vuexy React Admin Template'

// ** Default Route
const DefaultRoute = '/home'

// ** Merge Routes
const Routes = [
  {
    path: '/home',
    component: lazy(() => import('../../views/Home'))
  },
  {
    path: '/products',
    component: lazy(() => import('../../views/Products/index'))
  },
  {
    path: '/categories',
    component: lazy(() => import('../../views/Categories/index'))
  },
  {
    path: '/add-category',
    component: lazy(() => import('../../views/Categories/addCategory'))
  },
  {
    path: '/edit-category/:categoryid',
    component: lazy(() => import('../../views/Categories/editCategory'))
  },
  {
    path: '/edit-product/:productid',
    component: lazy(() => import('../../views/Products/editProduct'))
  },
  {
    path: '/add-product',
    component: lazy(() => import('../../views/Products/addProduct'))
  },
  {
    path: '/account-settings',
    component: lazy(() => import('../../views/AccountSettings/AccountSettings'))
  },
  {
    path: '/theme-settings',
    component: lazy(() => import('../../views/ThemeSettings/index'))
  },
  {
    path: '/login',
    component: lazy(() => import('../../views/Login')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/error',
    component: lazy(() => import('../../views/Error')),
    layout: 'BlankLayout'
  }
]

const AdminRoutes = [
  {
    path: '/home',
    component: lazy(() => import('../../views/Home'))
  },
  {
    path: '/customer',
    component: lazy(() => import('../../views/Owner/Customer/index'))
  },
  {
    path: '/add-customer',
    component: lazy(() => import('../../views/Owner/Customer/AddCustomer'))
  }
  ,
  {
    path: '/edit-customer/:customerid',
    component: lazy(() => import('../../views/Owner/Customer/EditCustomer'))
  }
]

export { DefaultRoute, TemplateTitle, AdminRoutes, Routes }
