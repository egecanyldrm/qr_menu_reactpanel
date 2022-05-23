// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { ErrorToast } from '../../../extension/toast'
import { unAuthorized } from '../../../redux/authentication';
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux';
// ** Reactstrap Imports
import { handleSuccess } from '../../../extension/basicalert';
import axios from 'axios';
import { Row, Col, Form, Card, Label, UncontrolledTooltip, Button, CardBody, CardTitle, CardHeader, Alert, FormFeedback } from 'reactstrap'
import { AlertCircle } from 'react-feather';
const Social = ({ social }) => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const dispatch = useDispatch();


    const onSubmit = async (data) => {
        try {
            await axios.post(`/admin/update-theme-settings/social`, data).catch(err => { throw err.response.status });
            handleSuccess({ title: 'İşlem Başarılı', timer: 1200, message: 'Güncelleme başarılı bir şekilde yapıldı.' });
        } catch (err) {
            if (err === 404) {
                toast.error(<ErrorToast message={'Kayıt İşlemi Başarısız oldu'} />, { icon: false, hideProgressBar: true })

            } else if (err === 401) {
                dispatch(unAuthorized())
            }
        }

    }

    return (
        <Fragment>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Sosyal Medya Hesapları</CardTitle>
                </CardHeader>
                <CardBody className='py-2 my-25'>
                    <Form className='mt-2 pt-50' onSubmit={() => {
                        handleSubmit(onSubmit)(event).catch((error) => {
                        })
                    }} >


                        <Row className='mb-1 w-25 '>
                            <Label className='form-label' >  İnstagram  </Label>
                            <div className='d-flex align-items-center'>
                                <input className='form-control me-2' defaultValue={social.instagram}  {...register("instagram", { required: false })} />
                                <a id='instagram'>
                                    <AlertCircle />
                                </a>
                                <UncontrolledTooltip
                                    placement='right' target='instagram'
                                >
                                    Bu alan boş bırakıldığında gözükmeyecektir.
                                </UncontrolledTooltip>
                            </div>

                        </Row>
                        <Row className='mb-1 w-25 '>
                            <Label className='form-label' >  Facebook  </Label>
                            <div className='d-flex align-items-center'>
                                <input className='form-control me-2' defaultValue={social.facebook} {...register("facebook", { required: false })} />
                                <a id='facebook'>
                                    <AlertCircle />
                                </a>
                                <UncontrolledTooltip
                                    placement='right' target='facebook'
                                >
                                    Bu alan boş bırakıldığında gözükmeyecektir.
                                </UncontrolledTooltip>
                            </div>

                        </Row>
                        <Row className='mb-1 w-25 '>
                            <Label className='form-label' >  Twitter  </Label>
                            <div className='d-flex align-items-center'>
                                <input className='form-control me-2' defaultValue={social.twitter} {...register("twitter", { required: false })} />
                                <a id='twitter'>
                                    <AlertCircle />
                                </a>
                                <UncontrolledTooltip
                                    placement='right' target='twitter'
                                >
                                    Bu alan boş bırakıldığında gözükmeyecektir.
                                </UncontrolledTooltip>
                            </div>

                        </Row>
                        <Row className='mb-1 w-25 '>
                            <Label className='form-label' >  Youtube  </Label>
                            <div className='d-flex align-items-center'>
                                <input className='form-control me-2' defaultValue={social.youtube} {...register("youtube", { required: false })} />
                                <a id='youtube'>
                                    <AlertCircle />
                                </a>
                                <UncontrolledTooltip
                                    placement='right' target='youtube'
                                >
                                    Bu alan boş bırakıldığında gözükmeyecektir.
                                </UncontrolledTooltip>
                            </div>

                        </Row>



                        <Col className='mt-2' sm='12'>
                            <Button type='submit' className='me-1' color='primary'>
                                Kaydet
                            </Button>
                        </Col>

                    </Form>
                </CardBody>
            </Card>
        </Fragment>
    )
}

export default Social