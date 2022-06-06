// ** React Imports
import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'

// ** Icons Imports
import { Disc, X, Circle } from 'react-feather'
// ** Config
import themeConfig from '@configs/themeConfig'
import { useSelector } from 'react-redux'
import DarkLogo from '../../../../../assets/images/logo/kreatifbeyaz.png'

const VerticalMenuHeader = props => {

  const state = useSelector(state => state.layout)
  // ** Props
  const { menuCollapsed, setMenuCollapsed, setMenuVisibility, setGroupOpen, menuHover } = props
  // ** Reset open group
  useEffect(() => {
    if (!menuHover && menuCollapsed) setGroupOpen([])
  }, [menuHover, menuCollapsed])

  // ** Menu toggler component
  const Toggler = () => {
    if (!menuCollapsed) {
      return (
        <Disc
          size={20}
          data-tour='toggle-icon'
          className='text-primary toggle-icon d-none d-xl-block'
          onClick={() => setMenuCollapsed(true)}
        />
      )
    } else {
      return (
        <Circle
          size={20}
          data-tour='toggle-icon'
          className='text-primary toggle-icon d-none d-xl-block'
          onClick={() => setMenuCollapsed(false)}
        />
      )
    }
  }

  return (
    <div className='navbar-header pe-3 ps-2 pb-1 '>
      <NavLink to='/' className='navbar-brand '>
        {state.skin === 'light' ?
          <img src={themeConfig.app.appLogoImage} alt='logo' className='img-fluid' />
          :
          <img src={DarkLogo} alt='logo' className='img-fluid' />
        }
      </NavLink>
    </div>
  )
}

export default VerticalMenuHeader
