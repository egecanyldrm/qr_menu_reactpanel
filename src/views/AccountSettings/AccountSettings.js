// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Third Party Components

// ** Reactstrap Imports
import { Row, Col, TabContent, TabPane } from 'reactstrap'

// ** Demo Components
import Tabs from './Tabs'
import { toast } from 'react-toastify'
import { ErrorToast } from '../../extension/toast'
// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/pages/page-account-settings.scss'
import AccountTabContent from './AccountTabContent'
import SecurityTabContent from './SecurityTabContent'
import BillingTabContent from './BillingTabContent'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { unAuthorized } from '../../redux/authentication'
const AccountSettings = () => {
  // ** States
  const [activeTab, setActiveTab] = useState('1')
  const [resultStatus, setResultStatus] = useState(false);
  const [data, setData] = useState();
  const dispatch = useDispatch()


  const toggleTab = tab => {
    setActiveTab(tab)
  }
  useEffect(async () => {

    try {
      const { data } = await axios.get('/admin/business-detail').catch(err => { throw err.response.status })
      setData(data)
      setResultStatus(true)
    } catch (err) {
      if (err === 501) {
        toast.error(<ErrorToast message={'Kayıt İşlemi Başarısız oldu'} />, { icon: false, hideProgressBar: true })

      } else if (err === 401) {
        dispatch(unAuthorized())
      }
    }

  }, [])
  return (
    <Fragment>
      {
        (resultStatus && data) ?

          <Row>
            <Col xs={12}>
              <Tabs className='mb-2' activeTab={activeTab} toggleTab={toggleTab} />

              <TabContent activeTab={activeTab}>
                <TabPane tabId='1'>
                  <AccountTabContent {...data} />
                </TabPane>
                <TabPane tabId='2'>
                  <SecurityTabContent />
                </TabPane>
                <TabPane tabId='3'>
                  <BillingTabContent {...data} />
                </TabPane>

              </TabContent>
            </Col>
          </Row>
          : <div></div>
      }
    </Fragment>
  )
}

export default AccountSettings


