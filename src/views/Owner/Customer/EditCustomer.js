// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { ErrorToast } from '../../../extension/toast'
import { unAuthorized } from '../../../redux/authentication';
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux';
// ** Reactstrap Imports
import { Row, Col, Form, Card, Label, Button, CardBody, CardTitle, CardHeader, Alert, FormFeedback } from 'reactstrap'
import { handleSuccess } from '../../../extension/basicalert';
import axios from 'axios';
import { useHistory, useParams } from "react-router-dom";
import qs from 'qs';

const EditCustomer = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const navigate = useHistory()
    const params = useParams()
    const [imageUrl, setImageUrl] = useState(null);
    const [image, setQrCodeImage] = useState(null);
    const [customer, setCustomer] = useState(null)
    const setImage = (e) => {
        if (e.target) {
            setQrCodeImage(e.target.files[0])
            const imageUrl = URL.createObjectURL(e.target.files[0]);
            setImageUrl(imageUrl)
        }
    }

    const onSubmit = async (data) => {
        const formData = new FormData();
        data._id = params.customerid;
        if (image) {
            formData.append('image', image, image.name);
        }
        formData.set('user', qs.stringify(data));

        try {
            await axios.post(`/owner/update-customer`, formData).catch(err => { throw err.response.status });

            handleSuccess({ title: 'İşlem Başarılı', timer: 1500, message: 'Kayıt başarılı bir şekilde yapıldı.' });
            setTimeout(() => {
                navigate.push('/customer')
            }, 1500)
        } catch (err) {
            if (err === 501) {
                toast.error(<ErrorToast message={'Kayıt İşlemi Başarısız Oldu Kullanıcı adını kontrol ediniz !'} />, { icon: false, hideProgressBar: true })
            } else if (err === 401) {
                dispatch(unAuthorized())
            } else if (err === 500) {
                toast.error(<ErrorToast message={'Email Daha önceden Kayıt Edilmiş'} />, { icon: false, hideProgressBar: true })

            }
        }

    }

    useEffect(async () => {
        try {
            const { data } = await axios.post('/owner/get-customer', { customerId: params.customerid }).catch(err => { throw err.response.status });
            setCustomer(data)
        } catch (error) {
        }

    }, [])


    return (
        <Fragment>
            {customer ?
                <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>İşletme Ayarları</CardTitle>
                    </CardHeader>
                    <CardBody className='py-2 my-25'>
                        <Form className='mt-2 pt-50' onSubmit={() => {
                            handleSubmit(onSubmit)(event).catch((error) => {
                               
                            })
                        }} >

                            <Row className='mt-2'>
                                <Col sm='6' className='mb-1'>
                                    <Label className='form-label' > Ad Soyadı  </Label>
                                    <input className='form-control' defaultValue={customer.name}  {...register("name", { required: true })} />
                                </Col>
                                <Col sm='6' className='mb-1'>
                                    <Label className='form-label' > Kullanıcı adı  </Label>
                                    <input className='form-control' defaultValue={customer.username} {...register("username", { required: true })} />
                                </Col>
                                <Col sm='6' className='mb-1'>
                                    <Label className='form-label' > E-mail </Label>
                                    <input className='form-control' defaultValue={customer.contact.email} type='email'  {...register("contact.email", { required: true })} />
                                </Col>

                                <Col sm='6' className='mb-1'>
                                    <Label className='form-label' >  İşletme Adı  </Label>
                                    <input className='form-control' defaultValue={customer.companyName} {...register("companyName", { required: true })} />
                                </Col>
                                <Col sm='6' className='mb-1'>
                                    <Label className='form-label' >  Paket  </Label>
                                    <select className="form-select" defaultValue={customer.package}  {...register("package", { required: true })}>
                                        <option value="special">Special</option>
                                        <option value="deluxe">Deluxe</option>
                                    </select>
                                </Col>
                                <Col sm='6' className='mb-1'>
                                    <Label className='form-label' > Telefon Numarası </Label>
                                    <input className='form-control' defaultValue={customer.contact.phone} type='number'  {...register("contact.phone", { required: true })} />
                                </Col>
                                <Col sm='6' className='mb-1'>
                                    <Label className='form-label' > Adres</Label>
                                    <input className='form-control' defaultValue={customer.contact.address} {...register("contact.address", { required: true })} />
                                </Col>
                                <Col sm='6' className='mb-1'>
                                    <Label className='form-label' > Yıllık Ücret</Label>
                                    <input className='form-control' defaultValue={customer.yearlyPrice} {...register("yearlyPrice")} />
                                </Col>
                                <Col className='d-flex'>
                                    <div className='me-25'>
                                        {
                                            imageUrl ?
                                                <img className='rounded me-50' src={imageUrl} alt='İşletmeye ait logo ' height='100' width='100' />
                                                :
                                                <img className='rounded me-50' src={customer.qrcode} alt='İşletmeye ait logo ' height='100' width='100' />
                                        }
                                    </div>
                                    <div className='d-flex align-items-end mt-75 ms-1'>
                                        <div>
                                            <Button tag={Label} className='mb-75 me-75' size='sm' color='primary'>
                                                Yükle
                                                <input className='form-control' type='file' hidden accept='image/*' onChange={setImage} />
                                            </Button>
                                            <p className='mb-0'> Kullanıcı adı değiştirildiğinde qr code değiştirilmelidir.</p>
                                        </div>
                                    </div>
                                </Col>
                                <Col className='mt-2' sm='12'>
                                    <Button type='submit' className='me-1' color='primary'>
                                        Kaydet
                                    </Button>
                                </Col>
                                <Col className='mt-5'>
                                    {errors.hasOwnProperty('name', 'contact', 'username', 'password', 'companyName') &&
                                        <Alert color="danger p-1"> Lütfen Bütün Alanları Doldurunuz !</Alert>}
                                </Col>
                            </Row>
                        </Form>
                    </CardBody>
                </Card>
                : <div></div>
            }

        </Fragment >
    )
}

export default EditCustomer