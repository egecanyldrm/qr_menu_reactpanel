import { Link } from 'react-router-dom'
import Avatar from '@components/avatar'
import { Settings,  HelpCircle, Power } from 'react-feather'
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { logOut } from '../../../../redux/authentication'

const UserDropdown = () => {
  const state = useSelector(state => state.auth.user);
  const dispatch = useDispatch();


  return (
    <UncontrolledDropdown tag='li' className='dropdown-user nav-item'>
      <DropdownToggle href='/' tag='a' className='nav-link dropdown-user-link' onClick={e => e.preventDefault()}>
        <div className='user-nav d-sm-flex d-none'>
          <span className='user-name fw-bold'>{state.name}</span>
          <span className='user-status'>{'Admin'}</span>
        </div>
        <Avatar color='light-primary' content={state.name} initials status='online' />
      </DropdownToggle>
      <DropdownMenu end>

        <Link to='/account-settings'>
          <DropdownItem tag='li' >
            <Settings size={14} className='me-75' />
            <span className='align-middle'>Ayarlar</span>
          </DropdownItem>
        </Link>

        <DropdownItem tag='a' href='/pages/faq' >
          <HelpCircle size={14} className='me-75' />
          <span className='align-middle'>Yardım</span>
        </DropdownItem>
        <DropdownItem tag='a' onClick={() => { dispatch(logOut()) }} >
          <Power size={14} className='me-75' />
          <span className='align-middle'>Çıkış Yap</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown >
  )
}

export default UserDropdown
