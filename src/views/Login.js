import { useSkin } from '@hooks/useSkin'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, GitHub } from 'react-feather'
import InputPasswordToggle from '@components/input-password-toggle'
import { Row, Col, CardTitle, CardText, Form, Label, Input, Button } from 'reactstrap'
import '@styles/react/pages/page-authentication.scss'
import { logIn, logOut, userNotFound } from '../redux/authentication'
import { useDispatch } from 'react-redux'
import { ErrorToast } from '../extension/toast'
import { toast } from 'react-toastify'

import { postLogin } from '../api/post'
import axios from 'axios'
const LoginCover = () => {
  const dispatch = useDispatch();


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data, status } = await axios.post('/login', {
        email: e.target[0].value,
        password: e.target[1].value
      }).catch(err => { throw err.response.status });
      if (status === 200) {
        dispatch(logIn(data));
      }

    } catch (err) {
      if (err === 404) {
        toast.error(<ErrorToast message={'Kullanıcı Bulunamadı !'} />, { icon: false, hideProgressBar: true })
      } else if (err === 400) {
        toast.error(<ErrorToast message={'Kullanıcı adı veya şifreniz hatalı ! Kontrol ediniz'} />, { icon: false, hideProgressBar: true })
      }
    }

  }


  const { skin } = useSkin();

  const illustration = skin === 'dark' ? 'login-v2-dark.svg' : 'login-v2.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default

  return (
    <div className='auth-wrapper auth-cover'>
      <Row className='auth-inner m-0'>
        <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
          <h2 className='brand-text text-primary ms-1'>Dijital Menü</h2>
        </Link>
        <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
            <img className='img-fluid' src={source} alt='Login Cover' />
          </div>
        </Col>
        <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
          <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
            <CardTitle tag='h2' className='fw-bold mb-1'>
              Hoş Geldin 👋
            </CardTitle>
            <CardText className='mb-2'>Please sign-in to your account and start the adventure</CardText>
            <Form autoComplete='on' className='auth-login-form mt-2' onSubmit={e => handleLogin(e)}>
              <div className='mb-1'>
                <Label className='form-label' for='login-email'>
                  Email
                </Label>
                <Input type='email' name='email' id='login-email' placeholder='Mail adresinizi giriniz' autoFocus />
              </div>
              <div className='mb-1'>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for='login-password' >
                    Şifre
                  </Label>
                  <Link to='/forgot-password'>
                    <small>Şifremi Unuttum</small>
                  </Link>
                </div>
                <InputPasswordToggle name='password' className='input-group-merge' id='login-password' />
              </div>
              <div className='form-check mb-1'>
                <Input type='checkbox' id='remember-me' />
                <Label className='form-check-label' for='remember-me'>
                  Beni Hatırla
                </Label>
              </div>
              <Button color='primary' type='submit' block >
                Giriş Yap
              </Button>
            </Form>
            <div className='divider my-2'>
              <div className='divider-text'>Bizi Takip Et</div>
            </div>
            <div className='auth-footer-btn d-flex justify-content-center'>
              <Button color='facebook'>
                <Facebook size={14} />
              </Button>
              <Button color='twitter'>
                <Twitter size={14} />
              </Button>
              <Button className='me-0' color='github'>
                <GitHub size={14} />
              </Button>
            </div>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default LoginCover
