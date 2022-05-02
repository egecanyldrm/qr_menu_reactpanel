// ** React Imports
import { Fragment, useState } from 'react'
import { useSelector } from 'react-redux';

// ** Reactstrap Imports
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardBody, Form, Row, Col, Label, Input, Button, CardFooter } from 'reactstrap'
import FileUploaderRestrictions from '../../components/FileUploaderRestrictions'
const PillFilled = () => {
  // ** States
  const [active, setActive] = useState('1');
  const state = useSelector(state => state.auth.user);

  const toggle = tab => {
    setActive(tab)
  }
  return (
    <Fragment>
      <Card>
        <CardBody>
          <Nav pills fill>
            <NavItem>
              <NavLink
                active={active === '1'}
                onClick={() => {
                  toggle('1')
                }}
              >
                TR
              </NavLink>

            </NavItem>
            {state.language === true &&
              <NavItem>
                <NavLink
                  active={active === '2'}
                  onClick={() => {
                    toggle('2')
                  }}
                >
                  EN
                </NavLink>
              </NavItem>
            }
            {state.language === true &&

              <NavItem>
                <NavLink
                  active={active === '3'}
                  onClick={() => {
                    toggle('3')
                  }}
                >
                  RU
                </NavLink>
              </NavItem>
            }
          </Nav>
          <TabContent className='py-50' activeTab={active}>
            <TabPane tabId='1'>
              <Form>
                <Row>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='nameVertical'>
                      Ürün Adı
                    </Label>
                    <Input type='text' name='name' id='nameVertical' placeholder='Ürün Adı' />
                  </Col>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='descriptionVertical'>
                      Açıklama
                    </Label>
                    <Input type='textarea' name='description' id='descriptionVertical' placeholder='Açıklama' />
                  </Col>
                </Row>
              </Form>
              <FileUploaderRestrictions />

            </TabPane>
            <TabPane tabId='2'>
              <Form>
                <Row>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='nameVertical'>
                    Ürün Adı
                    </Label>
                    <Input type='text' name='name' id='nameVertical' placeholder='Ürün Adı' />
                  </Col>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='descriptionVertical'>
                      Açıklama
                    </Label>
                    <Input type='textarea' name='description' id='descriptionVertical' placeholder='Açıklama' />
                  </Col>
                </Row>
              </Form>
            </TabPane>
            <TabPane tabId='3'>
              <Form>
                <Row>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='nameVertical'>
                    Ürün Adı
                    </Label>
                    <Input type='text' name='name' id='nameVertical' placeholder='Ürün Adı' />
                  </Col>
                  <Col sm='12' className='mb-1'>
                    <Label className='form-label' for='descriptionVertical'>
                      Açıklama
                    </Label>
                    <Input type='textarea' name='description' id='descriptionVertical' placeholder='Açıklama' />
                  </Col>
                </Row>
              </Form>
            </TabPane>
          </TabContent>
        </CardBody>
        <CardFooter>
          <div className='d-flex'>
            <Button className='me-1' color='primary' type='submit' onClick={e => e.preventDefault()}>
              Kaydet
            </Button>
          </div>
        </CardFooter>

      </Card>

    </Fragment>
  )
}
export default PillFilled