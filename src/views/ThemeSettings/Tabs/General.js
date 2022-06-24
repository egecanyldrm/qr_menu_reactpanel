import React, { useState } from 'react'
import { Card, Row, CardTitle, CardBody, Col, Button, CardFooter, CardHeader } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form';

import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

import { toast } from 'react-toastify'
import { ErrorToast } from '../../../extension/toast'
import { unAuthorized } from '../../../redux/authentication';
import { useDispatch, useSelector } from 'react-redux';
// ** Reactstrap Imports
import { handleSuccess } from '../../../extension/basicalert';

import axios from 'axios';

const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
                opacity: 1,
                border: 0
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5
            }
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff'
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color:
                theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[600]
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: theme.palette.mode === 'light' ? 0.7 : 0.3
        }
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 22,
        height: 22
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500
        })
    }
}));



const General = ({ general }) => {

    const dispatch = useDispatch();
    const state = useSelector(state => state.auth.user.package)
    const defaultValues = {
        ...general
    };
    const { handleSubmit, reset, setValue, control } = useForm({ defaultValues });

    const onSubmit = async (data) => {
        try {
            await axios.post('/admin/update-theme-settings/general', data).catch(err => { throw err.response.status })
            handleSuccess({ title: 'Kayıt Başarılı', timer: 1000, message: 'Tema başarılı bir şekilde değiştirildi.' });
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
            <Card>
                <form onSubmit={() => {
                    handleSubmit(onSubmit)(event).catch((error) => {
                        console.log(error)
                    })
                }}>
                    <CardBody>
                        <CardTitle className='mt-2' tag='h5'> Dil  Ayarları</CardTitle>
                        <Row>
                            <Col >
                                <label className='fw-bold'>İngilizce     :</label>
                                {state === 'deluxe' ?
                                    <Controller
                                        name="english"
                                        control={control}
                                        render={({ field }) => (
                                            <IOSSwitch sx={{ m: 1 }}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                                checked={field.value}
                                            />
                                        )}
                                    />
                                    :
                                    <Controller
                                        name="english"
                                        control={control}
                                        render={({ field }) => (
                                            <IOSSwitch sx={{ m: 1 }}
                                                disabled
                                                onChange={(e) => field.onChange(e.target.checked)}
                                                checked={field.value}
                                            />
                                        )}
                                    />
                                }
                            </Col>
                            <Col>
                                <label className='fw-bold'>Rusça     :</label>
                                {state === 'deluxe' ?
                                    <Controller
                                        name="russian"
                                        control={control}
                                        render={({ field }) => (
                                            <IOSSwitch sx={{ m: 1 }}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                                checked={field.value}
                                            />
                                        )}
                                    />
                                    :
                                    <Controller
                                        name="russian"
                                        control={control}
                                        render={({ field }) => (
                                            <IOSSwitch sx={{ m: 1 }}
                                                disabled
                                                onChange={(e) => field.onChange(e.target.checked)}
                                                checked={field.value}
                                            />
                                        )}
                                    />
                                }
                            </Col>
                            <Col>
                                <label className='fw-bold'>Fransızca     :</label>
                                {state === 'deluxe' ?
                                    <Controller
                                        name="french"
                                        control={control}
                                        render={({ field }) => (
                                            <IOSSwitch sx={{ m: 1 }}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                                checked={field.value}
                                            />
                                        )}
                                    />
                                    :
                                    <Controller
                                        name="french"
                                        control={control}
                                        render={({ field }) => (
                                            <IOSSwitch sx={{ m: 1 }}
                                                disabled
                                                onChange={(e) => field.onChange(e.target.checked)}
                                                checked={field.value}
                                            />
                                        )}
                                    />
                                }
                            </Col>
                            <Col>
                                <label className='fw-bold'>Almanca     :</label>
                                {state === 'deluxe' ?
                                    <Controller
                                        name="germany"
                                        control={control}
                                        render={({ field }) => (
                                            <IOSSwitch sx={{ m: 1 }}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                                checked={field.value}
                                            />
                                        )}
                                    />
                                    :
                                    <Controller
                                        name="germany"
                                        control={control}
                                        render={({ field }) => (
                                            <IOSSwitch sx={{ m: 1 }}
                                                disabled
                                                onChange={(e) => field.onChange(e.target.checked)}
                                                checked={field.value}
                                            />
                                        )}
                                    />
                                }
                            </Col>
                            <Col>
                                <label className='fw-bold'>Arapça     :</label>
                                {state === 'deluxe' ?
                                    <Controller
                                        name="arab"
                                        control={control}
                                        render={({ field }) => (
                                            <IOSSwitch sx={{ m: 1 }}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                                checked={field.value}
                                            />
                                        )}
                                    />
                                    :
                                    <Controller
                                        name="arab"
                                        control={control}
                                        render={({ field }) => (
                                            <IOSSwitch sx={{ m: 1 }}
                                                disabled
                                                onChange={(e) => field.onChange(e.target.checked)}
                                                checked={field.value}
                                            />
                                        )}
                                    />
                                }
                            </Col>
                        </Row>
                        <Row className='mt-2'>
                            <Col>
                                <label className='fw-bold'>Otomatik Dil Algılama </label>
                                {state === 'deluxe' ?
                                    <Controller
                                        name="autoLocaleDetection"
                                        control={control}
                                        render={({ field }) => (
                                            <IOSSwitch sx={{ m: 1 }}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                                checked={field.value}
                                            />
                                        )}
                                    />
                                    :
                                    <Controller
                                        name="autoLocaleDetection"
                                        control={control}
                                        render={({ field }) => (
                                            <IOSSwitch sx={{ m: 1 }}
                                                disabled
                                                onChange={(e) => field.onChange(e.target.checked)}
                                                checked={field.value}
                                            />
                                        )}
                                    />
                                }
                            </Col>
                        </Row>
                        <Row>
                            <CardTitle className='mt-2' tag='h5'>Footer  Ayarları</CardTitle>
                            <Col>
                                <label className='fw-bold'>Sosyal Medya :</label>
                                <Controller
                                    name="footerSocial"
                                    control={control}
                                    render={({ field }) => (
                                        <IOSSwitch sx={{ m: 1 }}
                                            onChange={(e) => field.onChange(e.target.checked)}
                                            checked={field.value}
                                        />
                                    )}
                                />
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter>
                        <div className='d-flex'>
                            <Button className='me-1' color='primary' type='submit' >
                                Kaydet
                            </Button>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </section>
    )
}

export default General

