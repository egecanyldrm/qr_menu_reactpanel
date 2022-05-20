// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Bell, X, Check, AlertTriangle } from 'react-feather'

import axios from 'axios';
import { Button, Badge, Input, DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown } from 'reactstrap'





const NotificationDropdown = () => {

  const [notifications, setNotification] = useState([]);
  const [length, setLength] = useState();

  useEffect(async () => {

    try {
      const { data } = await axios.get('/admin/notifications');
      setNotification(data.notification.reverse())
      const length = data.notification.filter(item => item.isRead === false).length
      setLength(length)
    } catch (err) {

    }
  }, [])
  const isRead = async (id) => {
    try {
      await axios.post('/admin/notification-isread', { id: id });
      const newNotifications = notifications.map((item) => {
        if (item._id === id) {
          item.isRead = true
        }
        return item
      })
      setNotification(newNotifications)
    } catch (err) {

    }
  }

  return (
    <UncontrolledDropdown tag='li' className='dropdown-notification nav-item me-1'>
      <DropdownToggle tag='a' className='nav-link' href='/' onClick={e => e.preventDefault()}>
        <Bell size={21} />
        <Badge pill color='danger' className='badge-up'>
          {length}
        </Badge>
      </DropdownToggle>
      <DropdownMenu end tag='ul' className='dropdown-menu-media mt-0'>
        <li className='dropdown-menu-header'>
          <DropdownItem className='d-flex' tag='div' header>
            <h4 className='notification-title mb-0 me-auto'>Bildirimler</h4>

          </DropdownItem>
        </li>
        {notifications &&

          <PerfectScrollbar
            component='li'
            className='media-list scrollable-container '
            options={{
              wheelPropagation: false
            }}
          >
            {notifications.map((item, index) => {
              return (
                <a key={index} className='d-flex' href='/' onClick={e => {
                  e.preventDefault();
                  if (!item.isRead) {
                    isRead(item._id);
                  }
                }}>
                  <div
                    className='list-item d-flex'
                  >
                    <div className={`list-item-body flex-grow-1 ${!item.isRead && 'fw-bold'}`} >
                      {item.message}
                    </div>
                    <small className='notification-text'>{item.isRead ? 'Okundu' : 'Okunmadı'}</small>
                  </div>
                </a>
              )
            })}
            {
              notifications.length < 1 &&
              <div className='p-1 text-center'>Hiç Bildirim Bulunamadı</div>
            }
          </PerfectScrollbar >

        }
        { /* 
        <li className='dropdown-menu-footer'>
          <Button color='primary' block>
            Hepsini işaretle
          </Button>
        </li> */}
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default NotificationDropdown
