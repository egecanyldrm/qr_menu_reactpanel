// ** React Imports
import { Link, useHistory } from 'react-router-dom'

// ** Icons Imports
import { ChevronLeft } from 'react-feather'

// ** Reactstrap Imports
import { Card, CardBody, CardTitle, CardText, Form, Label, Button, Alert } from 'reactstrap'
import { useForm } from "react-hook-form";
// ** Styles
import '@styles/react/pages/page-authentication.scss'
import axios from 'axios';
import { handleSuccess, handleWarning } from '../../extension/basicalert';

const ForgotPasswordBasic = () => {

  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useHistory()
  const onSubmit = async (data) => {
    try {
      await axios.post('/forgot-password', data).catch(err => { throw err.response });
      handleSuccess({ title: 'İşlem Başarılı', timer: 1500, message: 'E-posta adresinizi kontrol ediniz.' });
      setTimeout(() => {
        navigate.push('/login')
      }, 1500)
    } catch (error) {
      handleWarning({ title: error.data.title, timer: 1500, message: error.data.message });
    }
  }

  return (
    <div className='auth-wrapper auth-basic px-2'>
      <div className='auth-inner my-2'>
        <Card className='mb-0'>
          <CardBody>

            <CardTitle tag='h4' className='mb-1'>
              Şifreni mi Unuttun ? 🔒
            </CardTitle>
            <CardText className='mb-2'>
              Şifrenizi sıfırlamak için  E-posta adresinizi giriniz
            </CardText>
            <Form className='auth-forgot-password-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-1'>
                <Label className='form-label' for='login-email'>
                  E-Posta
                </Label>
                <input autoFocus className='form-control' type='email'  {...register("email", { required: true })} />
              </div>

              {errors.hasOwnProperty('email') &&
                <Alert color="danger p-1"> Lütfen Email Adresi Giriniz !</Alert>}

              <Button color='primary' block>
                Gönder
              </Button>
            </Form>
            <p className='text-center mt-2'>
              <Link to='/login'>
                <ChevronLeft className='rotate-rtl me-25' size={14} />
                <span className='align-middle'>Giriş'e Geri Dön</span>
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default ForgotPasswordBasic
