// ** Reactstrap Imports
import { Nav, NavItem, NavLink } from 'reactstrap'

// ** Icons Imports
import { User, Lock, Bookmark, Settings, Sliders, Tool, Instagram, ThumbsUp, PenTool } from 'react-feather'

const Tabs = ({ activeTab, toggleTab }) => {
  return (
    <Nav pills className='mb-2'>
      <NavItem>
        <NavLink active={activeTab === '1'} onClick={() => toggleTab('1')}>
          <Sliders size={18} className='me-50' />
          <span className='fw-bold'>Genel Ayarlar</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === '2'} onClick={() => toggleTab('2')}>
          <PenTool size={18} className='me-50' />
          <span className='fw-bold'>Renk Ayarları</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === '3'} onClick={() => toggleTab('3')}>
          <ThumbsUp size={18} className='me-50' />
          <span className='fw-bold'>Sosyal Ağlar </span>
        </NavLink>
      </NavItem>
    </Nav>
  )
}

export default Tabs