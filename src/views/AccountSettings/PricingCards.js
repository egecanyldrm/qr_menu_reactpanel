
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { unAuthorized } from '../../redux/authentication'
import { Row, Col, Card, CardBody, CardText, Badge, ListGroup, ListGroupItem, Button } from 'reactstrap'
import { toast } from 'react-toastify'
import { ErrorToast } from '../../extension/toast'
import { handleSuccess } from '../../extension/basicalert'

const PricingCards = (props) => {
  const dispatch = useDispatch()

  const pushNatification = async (paket) => {
    try {
      const result = await axios.post('/admin/push-notification', { message: `${props.userName} adlı müşteri paketini ${paket}'e yükseltmek istiyor` }).catch(err => { throw err.response.status })
      handleSuccess({ title: 'İstek Başarıyla Gönderildi', timer: 2200, message: 'En kısa sürede dönüş yapılacaktır.' });
    } catch (err) {
      if (err === 501) {
        toast.error(<ErrorToast message={'Talep İşlemi Başarısız oldu'} />, { icon: false, hideProgressBar: true })

      } else if (err === 401) {
        dispatch(unAuthorized())
      }
    }
  }
  return (
    <Row className='mt-4'>
      <Col className='text-center  shadow-none basic-pricing-card ' >
        <Card  >
          <CardBody>
            <h3 className='mt-2'>Special Paket </h3>
            <CardText>Küçük İşletmeler için</CardText>
            <div className='annual-plan'>
              <div className='plan-price mt-2'>
                <sup className='font-medium-1 fw-bold text-primary me-25'>TL</sup>
                <span className='pricing-basic-value fw-bolder text-primary' style={{ fontSize: '3.5rem', lineHeight: .8 }}>
                  750 TL
                </span>
                <span className='pricing-duration text-body font-medium-1 h1 fw-bold ms-25'>/Yıllık</span>
              </div>
            </div>
            <ListGroup tag='ul' className='list-group-circle text-start mb-2'>
              <ListGroupItem tag='li'>
                İçerik Yönetim Paneli (Telefon, Tablet, Bilgisayar)
              </ListGroupItem>
              <ListGroupItem tag='li'>
                Sınırsız Ürün Girişi
              </ListGroupItem>
              <ListGroupItem tag='li'>
                Sınırsız Kategori Girişi
              </ListGroupItem>
              <ListGroupItem tag='li'>
                Tema  Özelleştirme
              </ListGroupItem>

            </ListGroup>
            <Button onClick={() => {
              if (props.package === 'deluxe') {
                pushNatification('special')
              }
            }} block outline={props.package === 'special'} color={props.package === 'special' ? 'success' : 'primary'}>
              {props.package === 'special' ? 'Şimdiki Planın' : 'Yükselt'}

            </Button>
          </CardBody>
        </Card>
      </Col>
      <Col className='text-center  shadow-none basic-pricing-card' >
        <Card  >
          <CardBody>
            <div className='pricing-badge text-end'>
              <Badge color='light-primary' pill>
                Popüler
              </Badge>
            </div>

            <h3>Deluxe  Paket </h3>
            <CardText>Büyük İşletmeler için</CardText>
            <div className='annual-plan'>
              <div className='plan-price mt-2'>
                <sup className='font-medium-1 fw-bold text-primary me-25'>TL</sup>
                <span className={`pricing fw-bolder text-primary`} style={{ fontSize: '3.5rem', lineHeight: .8 }}>
                  1000 TL
                </span>
                <span className='pricing-duration text-body font-medium-1 fw-bold ms-25'>/Yıllık</span>
              </div>
            </div>
            <ListGroup tag='ul' className='list-group-circle text-start mb-2'>
              <ListGroupItem tag='li'>
                İçerik Yönetim Paneli (Telefon, Tablet, Bilgisayar)
              </ListGroupItem>
              <ListGroupItem tag='li'>
                Sınırsız Ürün Girişi
              </ListGroupItem>
              <ListGroupItem tag='li'>
                Sınırsız Kategori Girişi
              </ListGroupItem>
              <ListGroupItem tag='li'>
                Tema  Özelleştirme
              </ListGroupItem>
              <ListGroupItem tag='li'>
                Premium Konsept Temalar
              </ListGroupItem>
              <ListGroupItem tag='li'>
               Otomatik Dil Algıma 
              </ListGroupItem>
              <ListGroupItem tag='li'>
                İngilizce, Rusça, Almanca, Fransızca ve Arapça  Dil Seçeneği
              </ListGroupItem>
            </ListGroup>
            <Button
              onClick={() => {
                if (props.package === 'special') {
                  pushNatification('deluxe')
                }
              }}
              block outline={props.package === 'deluxe'} color={props.package === 'deluxe' ? 'success' : 'primary'}>
              {props.package === 'deluxe' ? 'Şimdiki Planın' : 'Yükselt'}
            </Button>
          </CardBody>
        </Card>
      </Col>
    </Row >

  )
}

export default PricingCards