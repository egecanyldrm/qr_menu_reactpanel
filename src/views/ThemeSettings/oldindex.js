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

import { Link } from 'react-router-dom';

const themes = [
    {
        name: 'athena',
        description: [
            " İşletme Logosu Kullanılır ",
            " Ürünler resimsiz listelenir "
        ],
        package: ['special']
    },
    {
        name: 'troy',
        description: [
            " İşletme adı logo olarak kullanılır. ",
            " Ürünler resimsiz listelenir "
        ],
        package: ['deluxe']
    }
    ,
    {
        name: 'atlas',
        description: [
            'Aşağıya doğru açılır akordiyon tasarımlı tema',
            " İşletme adı logo olarak kullanılır. ",
            "Ürünler resim ile listelenir"
        ],
        package: ['deluxe']
    },
    {
        name: 'orion',
        description: [
            " İşletme adı logo olarak kullanılır. ",
            " Ürünler resimli listelenir "
        ],
        package: ['deluxe']
    }


];

const getTheme = (themeName, user) => {
    const theme = themes.find(theme => theme.name === themeName);
    return (
        <Row>
            <Col lg='6' md='6'>
                <Card  >
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
                        <Button color='primary' block outline target='_blank' rel='noreferrer' href={process.env.REACT_APP_NEXT_FRONTEND + '/' + user.username}>
                            Önizle
                        </Button>
                    </CardBody>

                </Card>
            </Col>
            <Col lg='6' md='6' className='shadow' >
                <Card  >
                    <iframe src={process.env.REACT_APP_NEXT_FRONTEND + '/' + user.username} style={{ height: '24rem' }} frameBorder="0"></iframe>
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



    return (
        <section>
            {
                data ?
                    <Card>
                        <CardBody>
                            <CardTitle tag='h4'>Aktif Tema</CardTitle>
                            {getTheme(data.theme, user)}
                        </CardBody>
                    </Card>
                    :
                    <Spinner>
                        Yükleniyor...
                    </Spinner>

            }
       
        </section>
    )
}

export default index