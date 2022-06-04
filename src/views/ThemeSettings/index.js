import React, { useEffect, useState } from 'react'
import { Card, Row, Col, CardImg, Spinner, Modal, ModalBody, ModalHeader, CardText, Button, Badge, CardTitle, CardBody, ButtonGroup, CardFooter, UncontrolledTooltip } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify'

import { unAuthorized } from '../../redux/authentication'
import axios from 'axios';
import { handleSuccess } from '../../extension/basicalert'
import { ErrorToast } from '../../extension/toast';
import PricingCards from '../AccountSettings/PricingCards';
import { askSwal } from '../../extension/basicalert';

//Tema resimlerini import edip daha sonra diziye ekle.
import Atlas from '../../assets/images/portrait/Atlas.png'
import { Link } from 'react-router-dom';

const themes = [
    {
        name: 'athena',
        description: [
            " Aşağıya doğru açılır akordiyon tasarımlı tema",
            " Ürünler Kare Format Olmalıdır."
        ],
        imageUrl: Atlas,
        package: ['special']
    },
    {
        name: 'atlas',
        description: [
            'Aşağıya doğru açılır akordiyon tasarımlı tema',
            " Logo işletme adı olarak kullanılacaktır. "
        ],
        imageUrl: Atlas,
        package: ['deluxe']
    },

    {
        name: 'capella',
        description: [
            " Aşağıya doğru açılır akordiyon tasarımlı tema",
            " Ürünler Kare Format Olmalıdır."
        ],
        imageUrl: Atlas,
        package: ['deluxe']
    }
    ,
    {
        name: 'aphrodite',
        description: [
            "Aşağıya doğru açılır akordiyon tasarımlı tema",
            "Ürünler Kare Format Olmalıdır."
        ],
        imageUrl: Atlas,
        package: ['deluxe']
    }
    ,
    {
        name: 'orion',
        description: [
            "Aşağıya doğru açılır akordiyon tasarımlı tema",
            "Ürünler Kare Format Olmalıdır."
        ],
        imageUrl: Atlas,
        package: ['deluxe']
    }
    ,
    {
        name: 'troy',
        description: [
            "Aşağıya doğru açılır akordiyon tasarımlı tema",
            "Ürünler Kare Format Olmalıdır."
        ],
        imageUrl: Atlas,
        package: ['deluxe']
    }


];

const getTheme = (themeName) => {
    const theme = themes.find(theme => theme.name === themeName);
    return (
        <Row>
            <Col>
                <Card lg='6' md='6' >
                    <CardBody>
                        <CardTitle className='text-capitalize' tag='h4'>   {theme.name}</CardTitle>
                        <CardText tag='div'>
                            <ul>
                                {theme.description.map((item, key) => (
                                    <li key={key} dangerouslySetInnerHTML={{ __html: item }} ></li>
                                ))}
                            </ul>
                        </CardText>
                        <div className="d-grid gap-2">
                            <Link to='/theme-settings/design-settings' className='btn btn-primary  mt-3 mb-2'>
                                Temayı Düzenle
                            </Link>
                        </div>
                        <Button color='primary' block outline>
                            Önizle
                        </Button>
                    </CardBody>

                </Card>
            </Col>
            <Col>
                <Card llg='6' md='6' className='shadow-sm'>
                    <CardImg className='shadow' top src={Atlas} alt='Card cap' />
                </Card>
            </Col>
        </Row>
    )

}


const index = () => {
    const [data, setData] = useState(null)
    const [show, setShow] = useState(false)

    const dispatch = useDispatch();
    const reduxUserPackage = useSelector(state => state.auth.user.package)
    const user = useSelector(state => state.auth.user)
    useEffect(async () => {

        try {
            const { data } = await axios.get('/admin/get-theme').catch(err => { throw err.response.status });
            setData(data.theme)
        } catch (err) {
            if (err === 404) {
                toast.error(<ErrorToast message={'Bir Hata Oluştu !'} />, { icon: false, hideProgressBar: true })
            } else if (err === 401) {
                dispatch(unAuthorized())
            }
        }
    }, [])

    const onClick = async (theme) => {
        try {
            await axios.post('/admin/change-theme', { theme: theme }).catch(err => { throw err.response.status })
            handleSuccess({ title: 'Kayıt Başarılı', timer: 1200, message: 'Tema başarılı bir şekilde değiştirildi.' });
            setData({ theme: theme })
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        } catch (err) {
            if (err === 501) {
                toast.error(<ErrorToast message={'İşlem Başarısız oldu.'} />, { icon: false, hideProgressBar: true })
            } else if (err === 401) {
                dispatch(unAuthorized())
            }
        }
    }


    const askPackageUpdate = () => {
        askSwal()
            .then((result) => {
                if (result.isConfirmed) {
                    setShow(true)
                }
            }).catch(err => console.log(err))
    }
    return (
        <section>
            {
                data ?
                    <Card>
                        <CardBody>
                            <CardTitle tag='h4'>Aktif Tema</CardTitle>
                            {getTheme(data.theme)}
                        </CardBody>
                    </Card>
                    :
                    <Spinner>
                        Yükleniyor...
                    </Spinner>

            }

            <h2 className='my-3'>Temalar</h2>
            <Row>
                {themes.map((theme, key) => (
                    <Col lg='4' sm='12' key={key}>
                        <Card className='me-2 flex-nowrap' style={{ minHeight: '40rem' }} >
                            {theme.package.includes('deluxe') &&
                                <Badge color='success' className='badge-glow mb-1 position-absolute' style={{ right: 0 }}>
                                    Premium Konsep Tema
                                </Badge>
                            }
                            <CardImg className='shadow-sm text-capitalize' top src={theme.imageUrl} alt='Image Card' />
                            <CardBody>
                                <CardTitle className='text-capitalize' tag='h4'>{theme.name}</CardTitle>

                                <CardText tag='ul'>
                                    {theme.description.map((item, key) => (
                                        <li key={key} dangerouslySetInnerHTML={{ __html: item }} ></li>
                                    ))}
                                </CardText>
                              
                            </CardBody>
                            <CardFooter>
                                <ButtonGroup className='w-100'>
                                    {theme.package.includes(reduxUserPackage) || reduxUserPackage === 'deluxe' ?
                                        <Button className='w-50' color='primary' onClick={() => { onClick(theme.name) }} >
                                            Aktif Et
                                        </Button>
                                        :
                                        <React.Fragment>
                                            <Button color='gradient-secondary' id='UnControlledExample' onClick={askPackageUpdate} >
                                                Aktif Et
                                            </Button>
                                            <UncontrolledTooltip placement='top' target='UnControlledExample'>
                                                Bu Temayı Etkinleştirmek İçin Delux Pakete Sahip Olmalısınız
                                            </UncontrolledTooltip>
                                        </React.Fragment>

                                    }

                                    <Button className='ms-1 w-50' color='primary' outline>
                                        Önizle
                                    </Button>
                                </ButtonGroup>
                            </CardFooter>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Modal isOpen={show} toggle={() => setShow(!show)} className='modal-dialog-centered modal-xl'>
                <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
                <ModalBody className='px-sm-5 mx-50 pb-5'>
                    <h1 className='text-center mb-1'>Lisans Ve Paketler</h1>

                    <PricingCards userName={user.name} package={user.package} />
                </ModalBody>
            </Modal>
        </section>
    )
}

export default index