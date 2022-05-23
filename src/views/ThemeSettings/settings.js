import React, { useState, useEffect } from 'react'
import { Card, Label, CardTitle, CardBody, Input, Row, Col, TabContent, TabPane, Spinner } from 'reactstrap'
import Tabs from './Tabs'
import Social from './Tabs/Social'
import Color from './Tabs/Color'
import General from './Tabs/General'
import { useDispatch } from 'react-redux'
import { unAuthorized } from '../../redux/authentication'
import { toast } from 'react-toastify'
import { ErrorToast } from '../../extension/toast'
import axios from 'axios'


const settings = () => {
    const [activeTab, setActiveTab] = useState('1')
    const [data, setData] = useState(null)
    const dispatch = useDispatch()

    useEffect(async () => {

        try {
            const { data } = await axios.get('/admin/theme-settings').catch(err => { throw err.response.status });
            setData(data)
        } catch (err) {
            if (err === 404) {
                toast.error(<ErrorToast message={'Bir Hata Oluştu !'} />, { icon: false, hideProgressBar: true })
            } else if (err === 401) {
                dispatch(unAuthorized())
            }
        }
    }, [])


    const toggleTab = tab => {
        setActiveTab(tab)
    }
    return (
        <section>
            {
                data ?
                    <Row>

                        <Col xs={12}>
                            <Tabs className='mb-2' activeTab={activeTab} toggleTab={toggleTab} />

                            <TabContent activeTab={activeTab}>
                                <TabPane tabId='1'>
                                    <General {...data.themeSettings} />
                                </TabPane>
                                <TabPane tabId='2'>
                                    <Color {...data.themeSettings} />
                                </TabPane>
                                <TabPane tabId='3'>
                                    <Social {...data.themeSettings} />
                                </TabPane>
                            </TabContent>
                        </Col>
                    </Row>

                    :
                    <Spinner>
                        Yükleniyor
                    </Spinner>
            }
        </section>
    )
}

export default settings


/* 

    <Card>
                <CardBody>
                    <CardTitle tag='h4'>Aktif Tema</CardTitle>
                    <div className='d-flex flex-column'>
                        <Label for='switch-success' className='form-check-label mb-50'>
                            Success
                        </Label>
                        <div className='form-switch form-check-success'>
                            <Input type='switch' id='switch-success' name='success' defaultChecked />
                        </div>
                    </div>
                </CardBody>
            </Card>
*/