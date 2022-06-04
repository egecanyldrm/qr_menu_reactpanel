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
import LoginImage from '../assets/images/pages/login_image.jpg'
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

  return (
    <div className='auth-wrapper auth-cover'>
      <Row className='auth-inner m-0'>
        <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
          <h2 className='brand-text text-primary ms-1'>{process.env.REACT_APP_COMPANY_NAME}</h2>
        </Link>
        <Col className=' d-none d-lg-block p-0 m-0' lg='8' sm='12'>
          <img className='img-fluid h-100' style={{ objectFit: 'cover' }} src={LoginImage} alt='Login Image' />
        </Col>
        <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
          <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
            <CardTitle tag='h2' className='fw-bold mb-1'>
              Hoş Geldin 👋
            </CardTitle>
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
           
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default LoginCover
