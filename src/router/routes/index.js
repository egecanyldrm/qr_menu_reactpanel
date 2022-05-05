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

export { DefaultRoute, TemplateTitle, Routes }
