import { useSelector } from 'react-redux'
import { Card, CardHeader, CardBody, CardTitle, CardText, CardLink, Button, Col } from 'reactstrap'
import { Settings, Package, Codepen, Users } from 'react-feather'
import { Link } from 'react-router-dom'

const Home = () => {
  const state = useSelector(state => state.auth);
  console.log(state)

  if (!state.user.role) {
    return (
      <div className="row">
        <Col lg='6' md='6' sm='12'>
          <Link to='/customer'>
            <Card >
              <CardBody className='text-center'>
                <Users className='font-large-2 mb-1' />
                <CardTitle tag='h5'>Müşteriler </CardTitle>
              </CardBody>
            </Card>
          </Link>
        </Col>
      </div>
    )
  }


  return (
    <div className='row'>
      <Col lg='6' md='6' sm='12'>
        <Link to='/categories'>
          <Card >
            <CardBody className='text-center'>
              <Codepen className='font-large-2 mb-1' />
              <CardTitle tag='h5'>Kategoriler</CardTitle>
            </CardBody>
          </Card>
        </Link>
      </Col>

      <Col lg='6' md='6' sm='12'>
        <Link to='/products'>
          <Card >
            <CardBody className='text-center'>
              <Package className='font-large-2 mb-1' />
              <CardTitle tag='h5'>Ürünler</CardTitle>
            </CardBody>
          </Card>
        </Link>
      </Col>

      <Col lg='6' md='6' sm='12'>
        <Link to='/theme-settings'>
          <Card >
            <CardBody className='text-center'>
              <Settings className='font-large-2 mb-1' />
              <CardTitle tag='h5'>Tema Ayarları</CardTitle>
            </CardBody>
          </Card>
        </Link>
      </Col>

      <Col lg='6' md='6' sm='12'>
        <Link to='/account-settings'>
          <Card >
            <CardBody className='text-center'>
              <Settings className='font-large-2 mb-1' />
              <CardTitle tag='h5'>İşletme Ayarları</CardTitle>
            </CardBody>
          </Card>
        </Link>
      </Col>

    </div>
  )
}

export default Home
