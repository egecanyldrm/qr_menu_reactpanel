// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { Row, Col, Card, Form, Button, CardBody, CardTitle, CardHeader, FormFeedback } from 'reactstrap'
import { handleSuccess } from '../../extension/basicalert';

// ** Third Party Components
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Custom Components
import InputPasswordToggle from '@components/input-password-toggle'
import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { unAuthorized } from '../../redux/authentication';
import axios from 'axios';
import { toast } from 'react-toastify'
import { ErrorToast } from '../../extension/toast'

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
    currentPassword: '',
    retypeNewPassword: ''
}

const SecurityTabContent = () => {

    const dispatch = useDispatch();
    const navigate = useHistory()


    const SignupSchema = yup.object().shape({
        currentPassword: yup
            .string()
            .min(8, obj => showErrors('Şimdiki parola', obj.value.length, obj.min))
            .required(),
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

        try {
            const result = await axios.post(`/admin/change-password`, data).catch(err => { throw err.response.status });
            handleSuccess({ title: 'İşlem Başarılı', timer: 1200, message: 'Güncelleme başarılı bir şekilde yapıldı.' });
            setTimeout(() => {
                navigate.push('/home')
            }, 1200)
        } catch (err) {
            if (err === 404) {
                toast.error(<ErrorToast message={'Güncelleme İşlemi Başarısız Oldu Lütfen Bilgilerinizi Kontrol Ediniz'} />, { icon: false, hideProgressBar: true })

            } else if (err === 401) {
                dispatch(unAuthorized())
            }
        }
    }

    return (
        <Fragment>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Parola Değiştir</CardTitle>
                </CardHeader>
                <CardBody className='pt-1'>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col sm='6' className='mb-1'>
                                <Controller
                                    control={control}
                                    id='currentPassword'
                                    name='currentPassword'
                                    render={({ field }) => (
                                        <InputPasswordToggle
                                            label='Parolanız'
                                            htmlFor='currentPassword'
                                            className='input-group-merge'
                                            invalid={errors.currentPassword && true}
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.currentPassword && (
                                    <FormFeedback className='d-block'>{errors.currentPassword.message}</FormFeedback>
                                )}
                            </Col>
                        </Row>
                        <Row>
                            <Col sm='6' className='mb-1'>
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
                            </Col>
                            <Col sm='6' className='mb-1'>
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
                            </Col>
                            <Col xs={12}>
                                <p className='fw-bolder'>Parola Kuralları:</p>
                                <ul className='ps-1 ms-25'>
                                    <li className='mb-50'>En az 8 karakter</li>
                                    <li className='mb-50'>En az bir büyük ve küçük karakter</li>
                                    <li>En az bir sayı, sembol veya özel karakter (  * , ? vb.) </li>
                                </ul>
                            </Col>
                            <Col className='mt-1' sm='12'>
                                <Button type='submit' className='me-1' color='primary'>
                                    Kaydet
                                </Button>

                            </Col>
                        </Row>
                    </Form>
                </CardBody>
            </Card>
        </Fragment>
    )
}

export default SecurityTabContent