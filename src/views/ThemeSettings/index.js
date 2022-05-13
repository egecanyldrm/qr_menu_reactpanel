import React from 'react'
import { Card, Row, Col, CardImg, CardText, Button, CardTitle, CardBody, ButtonGroup } from 'reactstrap'
import Atlas from '../../assets/images/portrait/Atlas.png'
const themes = [
    { name: 'Atlas', imageUrl: Atlas },
    { name: 'Atlas', imageUrl: Atlas },
    { name: 'Atlas', imageUrl: Atlas }
];


const index = () => {
    return (
        <section>
            <Card>
                <CardBody>
                    <CardTitle tag='h4'>Aktif Tema</CardTitle>
                    <Row>
                        <Col>
                            <Card lg='6' md='6' >
                                <CardBody>
                                    <CardTitle tag='h4'>  Atlas</CardTitle>
                                    <CardText>
                                        Atlas
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
                                <CardImg top src={Atlas} alt='Card cap' />
                                <CardBody>
                                    <CardTitle tag='h4'>  Atlas</CardTitle>
                                    <CardText>
                                        Atlas
                                    </CardText>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                </CardBody>
            </Card>
            <Row>
                <h2 className='my-3'>Temalar</h2>
                {themes.map(theme => (
                    <Col lg='4' md='6'>
                        <Card >
                            <CardImg className='shadow-sm' top src={theme.imageUrl} alt='Card cap' />
                            <CardBody>
                                <CardTitle tag='h4'>{theme.name}</CardTitle>
                                <CardText>
                                    {theme.name}
                                </CardText>
                                <ButtonGroup>
                                    <Button color='primary' >
                                        Aktif Et
                                    </Button>
                                    <Button color='primary' outline>
                                        Önizle
                                    </Button>
                                </ButtonGroup>
                            </CardBody>

                        </Card>
                    </Col>
                ))}
            </Row>
        </section>
    )
}

export default index