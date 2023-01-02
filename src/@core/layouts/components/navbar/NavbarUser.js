// ** React Imports
import { Fragment } from 'react'

// ** Dropdowns Imports
import UserDropdown from './UserDropdown'
import { Button } from 'reactstrap'
// ** Third Party Components
import { Sun, Moon } from 'react-feather'

// ** Reactstrap Imports
import { NavItem, NavLink } from 'reactstrap'
import NotificationDropdown from './NotificationDropdown'
import { useSelector } from 'react-redux'

const NavbarUser = props => {
  // ** Props
  const { skin, setSkin } = props
  const state = useSelector(state => state.auth.user.username)
  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    if (skin === 'dark') {
      return <Sun className='ficon' onClick={() => setSkin('light')} />
    } else {
      return <Moon className='ficon' onClick={() => setSkin('dark')} />
    }
  }

  return (
    <Fragment>

      <div className='bookmark-wrapper d-flex align-items-center'>
        <NavItem className='d-none d-lg-block'>
          <NavLink className='nav-link-style'>
            <ThemeToggler />
          </NavLink>
        </NavItem>
      </div>
      <ul className='nav navbar-nav align-items-center ms-auto'>
        <Button color='primary'  className='me-4 menu-prewiew'  target='_blank' rel='noreferrer' href={process.env.REACT_APP_NEXT_FRONTEND + '/' + state}>
          Site Önizlemesi
        </Button>
        {/* <NotificationDropdown /> */}
        <UserDropdown />
      </ul>
    </Fragment>
  )
}
export default NavbarUser
