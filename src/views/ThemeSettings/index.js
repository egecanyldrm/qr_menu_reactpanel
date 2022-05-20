import React, { useEffect, useState } from 'react'
import { Card, Row, Col, CardImg, Spinner, CardText, Button, CardGroup, CardTitle, CardBody, ButtonGroup, CardFooter } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify'

import { unAuthorized } from '../../redux/authentication'
import axios from 'axios';
import { handleSuccess } from '../../extension/basicalert'
import { ErrorToast } from '../../extension/toast';

//Tema resimlerini import edip daha sonra diziye ekle.
import Atlas from '../../assets/images/portrait/Atlas.png'

const themes = [
    {
        name: 'atlas',
        description: [
            'Aşağıya doğru açılır akordiyon tasarımlı tema',
            " Sadece ana kategori tanımlanmalıdır alt kategoriler gözükmeyecektir",
            " <strong>Ürün resimleri kare format olmalıdır.</strong> ",
            " Logonun maksimum yüksekliği 80px olarak kısıtlanmıştır. "
        ],
        imageUrl: Atlas
    },
    {
        name: 'orion',
        description: [
            " Aşağıya doğru açılır akordiyon tasarımlı tema",
            " Ürünler Kare Format Olmalıdır."
        ],
        imageUrl: Atlas
    },
    {
        name: 'vue',
        description: [
            " Aşağıya doğru açılır akordiyon tasarımlı tema",
            " Ürünler Kare Format Olmalıdır."
        ],
        imageUrl: Atlas
    }
    ,
    {
        name: 'vue',
        description: [
            "Aşağıya doğru açılır akordiyon tasarımlı tema",
            "Ürünler Kare Format Olmalıdır."
        ],
        imageUrl: Atlas
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
                        <Button className='mt-3 mb-2' color='primary' block >
                            Temayı Düzenle
                        </Button>
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
        </Row >
    )

}


const index = () => {
    const [data, setData] = useState(null)
    const dispatch = useDispatch();
    useEffect(async () => {

        try {
            const { data } = await axios.get('/admin/theme-settings').catch(err => { throw err.response.status });
            setData(data.themeSettings)
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
                                    <Button className='w-50' color='primary' onClick={() => { onClick(theme.name) }} >
                                        Aktif Et
                                    </Button>
                                    <Button className='ms-1 w-50' color='primary' outline>
                                        Önizle
                                    </Button>
                                </ButtonGroup>
                            </CardFooter>
                        </Card>
                    </Col>
                ))}
            </Row>

        </section>
    )
}

export default index