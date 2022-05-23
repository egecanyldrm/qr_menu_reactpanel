// ** React Imports
import { Link, useParams } from 'react-router-dom'

// ** Icons Imports
import { ChevronLeft } from 'react-feather'

// ** Custom Components
import InputPassword from '@components/input-password-toggle'

// ** Reactstrap Imports
import { Card, CardBody, CardTitle, Col, CardText, Form, Label, Button, FormFeedback } from 'reactstrap'
import { useHistory } from "react-router-dom";
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import InputPasswordToggle from '@components/input-password-toggle'
import { toast } from 'react-toastify'
import axios from 'axios';
import { ErrorToast } from '../../extension/toast'
import { handleSuccess } from '../../extension/basicalert';
// ** Styles
import '@styles/react/pages/page-authentication.scss'

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} alanı zorunludur`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field}  ${min} karakterden oluşmalı`
  } else {
    return ''
  }
}

const defaultValues = {
  newPassword: '',
  retypeNewPassword: ''
}


const ResetPasswordBasic = () => {

  const navigate = useHistory()
  const params = useParams()

  const SignupSchema = yup.object().shape({
    newPassword: yup
      .string()
      .min(8, obj => showErrors('Yeni parola', obj.value.length, obj.min))
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "8 Karakter, Bir Büyük Harf, Bir Küçük Harf, Bir Rakam ve Bir Özel Harf Karakteri İçermelidir"
      )
      .required(),
    retypeNewPassword: yup
      .string()
      .min(8, obj => showErrors('Yeni parola tekrar', obj.value.length, obj.min))
      .required()
      .oneOf([yup.ref(`newPassword`), null], 'Parolalar eşleşmek zorunda')
  })
  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    resolver: yupResolver(SignupSchema)
  })

  const onSubmit = async (data) => {
    data.token = params.token

    try {
      const result = await axios.post(`/reset-password`, data).catch(err => { throw err.response.status });
      handleSuccess({ title: 'İşlem Başarılı', timer: 1500, message: 'Güncelleme başarılı bir şekilde yapıldı.' });
      setTimeout(() => {
        navigate.push('/login')
      }, 1500)
    } catch (err) {
      if (err === 404) {
        toast.error(<ErrorToast message={'Güncelleme İşlemi Başarısız Oldu Lütfen Bilgilerinizi Kontrol Ediniz'} />, { icon: false, hideProgressBar: true })
      } else if (err === 401) {
        toast.error(<ErrorToast message={'Şifre Güncelleme İşlemi Süresi Dolmuştur'} />, { icon: false, hideProgressBar: true })
      }
    }
  }


  return (
    <div className='auth-wrapper auth-basic px-2'>
      <div className='auth-inner my-2'>
        <Card className='mb-0'>
          <CardBody>

            <CardTitle tag='h4' className='mb-1'>
              Parolayı Değiştir 🔒
            </CardTitle>
            <CardText className='mb-2'>Lütfen Yeni Parolanızı Giriniz </CardText>
            <Form className='auth-reset-password-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-1'>
                <Controller
                  control={control}
                  id='newPassword'
                  name='newPassword'
                  render={({ field }) => (
                    <InputPasswordToggle
                      label='Yeni Parola'
                      htmlFor='newPassword'
                      className='input-group-merge'
                      invalid={errors.newPassword && true}
                      {...field}
                    />
                  )}
                />
                {errors.newPassword && <FormFeedback className='d-block'>{errors.newPassword.message}</FormFeedback>}

              </div>
              <div className='mb-1'>
                <Controller
                  control={control}
                  id='retypeNewPassword'
                  name='retypeNewPassword'
                  render={({ field }) => (
                    <InputPasswordToggle
                      label='Yeni Parola Tekrar'
                      htmlFor='retypeNewPassword'
                      className='input-group-merge'
                      invalid={errors.newPassword && true}
                      {...field}
                    />
                  )}
                />
                {errors.retypeNewPassword && (
                  <FormFeedback className='d-block'>{errors.retypeNewPassword.message}</FormFeedback>
                )}

                <div className='my-2'>
                  <p className='fw-bolder'>Parola Kuralları:</p>
                  <ul className='ps-1 ms-25'>
                    <li className='mb-50'>En az 8 karakter</li>
                    <li className='mb-50'>En az bir büyük ve küçük karakter</li>
                    <li>En az bir sayı, sembol veya özel karakter (  * , ? vb.) </li>
                  </ul>
                </div>

              </div>
              <Button type='submit' color='primary' block>
                Parolayı Yenile
              </Button>
            </Form>
            <p className='text-center mt-2'>
              <Link to='/login'>
                <ChevronLeft className='rotate-rtl me-25' size={14} />
                <span className='align-middle'>Girişe Geri Dön</span>
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default ResetPasswordBasic
