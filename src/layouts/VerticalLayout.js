// ** Core Layout Import
// !Do not remove the Layout import
import Layout from '@layouts/VerticalLayout'

// ** Menu Items Array
import { customer, owner } from '@src/navigation/vertical'
import { useSelector } from 'react-redux'

const VerticalLayout = props => {

  const state = useSelector(state => state.auth)
  if (!state.user.role) {
    return (
      <Layout menuData={owner} {...props}>
        {props.children}
      </Layout>
    )
  }
  return (
    <Layout menuData={customer} {...props}>
      {props.children}
    </Layout>
  )
}

export default VerticalLayout
