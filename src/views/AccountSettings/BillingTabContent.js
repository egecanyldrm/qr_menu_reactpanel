// ** React Imports
import { Fragment, useState, useEffect } from 'react'
// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Badge,
  Alert,
  Modal,
  Input,
  Button,
  CardBody,
  Progress,
  CardTitle,
  ModalBody,
  CardHeader,
  ModalHeader
} from 'reactstrap'

// ** Demo Components
import PricingCard from './PricingCards'

// ** Third Party Components
import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// ** Styles
import '@styles/base/pages/page-pricing.scss'
import '@styles/base/plugins/extensions/ext-component-sweet-alerts.scss'
import PricingCards from './PricingCards'

const MySwal = withReactContent(Swal)

const BillingTabContent = ({ userDetail }) => {
  // ** States
  const [show, setShow] = useState(false)


  const startDate = new Date(userDetail.createdAt);
  const day = startDate.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })
  //Bitiş Düresi
  const OverDate = new Date(userDetail.licenseOverDate);
  const licenseOverDate = OverDate.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });

  const startedDate = new Date(startDate)
  const overDate = new Date(OverDate)
  const difference = new Date(overDate - startedDate);
  const differenceDay = Math.floor(difference / 1000 / 60 / 60 / 24) + 1;
  //Kullanılan  Süre 
  const kalan = new Date(new Date(Date.now()) - startDate);
  const kalanSure = Math.floor(kalan / 1000 / 60 / 60 / 24);
  const progress = (((kalanSure * 100) / differenceDay).toFixed(0))

  return (
    <Fragment>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Lisans Ve Paket Bilgileri</CardTitle>
        </CardHeader>
        <CardBody className='my-2 py-25'>
          <Row>
            <Col md='6'>
              <div className='mb-2 pb-50'>
                <h5>
                  Şuan ki Paketiniz :  <strong className='text-capitalize'> {userDetail.package}</strong>
                </h5>
              </div>
              <div className='mb-2 pb-50'>
                <h5>Lisans Başlama Süreci : <strong>{day}</strong> </h5>
              </div>
              <div className='mb-2 pb-50'>
                <h5>Lisans Bitiş Süreci : <strong>{licenseOverDate}</strong> </h5>
              </div>

            </Col>
            <Col md='6'>
              {(differenceDay - kalanSure) < 30 && <Alert color='warning'>
                <h4 className='alert-heading'>Paket Yenilenmesi Gerekiyor !</h4>
                <div className='alert-body'>Güncel paketinizin lisans süresi yakında sona ericek lütfen yenileyiniz.</div>
              </Alert>}
              <div className='plan-statistics pt-1'>
                <div className='d-flex justify-content-start'>
                  <h5 className='fw-bolder'>{` Kalan süre : ${kalanSure} / ${differenceDay} `}</h5>
                </div>
                <Progress className='mb-50' value={progress} />
              </div>
            </Col>
            <Col xs={12}>
              <Button color='primary' className='me-1 mt-1' onClick={() => setShow(true)}>
                Paketi Yükselt
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Modal isOpen={show} toggle={() => setShow(!show)} className='modal-dialog-centered modal-xl'>
        <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h1 className='text-center mb-1'>Lisans Ve Paketler</h1>

          <PricingCards userName={userDetail.name} package={userDetail.package} />
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default BillingTabContent