import { Link } from 'react-router-dom'
import Avatar from '@components/avatar'
import { Settings, HelpCircle, Power, Eye } from 'react-feather'
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem, Button } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { logOut } from '../../../../redux/authentication'

const UserDropdown = () => {
  const state = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const username = useSelector(state => state.auth.user.username)


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

        <DropdownItem tag='a' href={process.env.REACT_APP_NEXT_FRONTEND + '/' + username}  >
          <Eye size={14} className='me-75' />
          <span className='align-middle'>Site Önizlemesi</span>
        </DropdownItem>

        <Link to='/account-settings'>
          <DropdownItem tag='span' >
            <Settings size={14} className='me-75' />
            <span className='align-middle'>Ayarlar</span>
          </DropdownItem>
        </Link>
        <DropdownItem tag='a' onClick={() => { dispatch(logOut()) }} >
          <Power size={14} className='me-75' />
          <span className='align-middle'>Çıkış Yap</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown
