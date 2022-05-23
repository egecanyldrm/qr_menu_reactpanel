import React, { useState, useEffect } from 'react'
import { Card, Row, CardTitle, CardBody, Col, Button, CardFooter, CardHeader, Label, FormGroup, Input } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form';

import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

import { toast } from 'react-toastify'
import { ErrorToast } from '../../../extension/toast'
import { unAuthorized } from '../../../redux/authentication';
import { useDispatch } from 'react-redux';
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



const General = ({ color }) => {

    const dispatch = useDispatch();
    const [themeColor, setThemeColor] = useState(null);
    const [textColor, setTextColor] = useState(null);

    useEffect(() => {

        if (color) {
            setThemeColor(color.themeColor);
            setTextColor(color.textColor)
        }

    }, [])


    const onSubmit = async () => {
        try {
            await axios.post('/admin/update-theme-settings/color', {
                themeColor: themeColor,
                textColor: textColor
            }).catch(err => { throw err.response.status })
            handleSuccess({ title: 'Kayıt Başarılı', timer: 1200, message: 'Tema başarılı bir şekilde değiştirildi.' });
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
                <form onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit()
                }}>
                    {(themeColor !== null && textColor !== null) &&
                        <CardBody>
                            <Row className='mb-2'>
                                <Label tag='h4' for="exampleColor">
                                    Tema Rengi
                                </Label>
                                <div className="d-flex mt-1">
                                    <input className='form-control w-25 me-2' value={themeColor} onChange={(e) => { setThemeColor(e.target.value) }} />

                                    <Input
                                        id="exampleColor"
                                        name="color"
                                        placeholder="color placeholder"
                                        type="color"
                                        className='shadow-sm h-auto'
                                        value={themeColor}
                                        style={{ width: '6rem' }}
                                        onChange={e => setThemeColor(e.target.value)}
                                    />
                                </div>
                            </Row>
                            <Row >
                                <Label tag='h4' for="exampleColor">
                                    Yazı Rengi
                                </Label>
                                <div className="d-flex mt-1">
                                    <input className='form-control w-25 me-2' value={textColor} onChange={(e) => { setTextColor(e.target.value) }} />
                                    <Input
                                        id="exampleColor"
                                        name="color"
                                        placeholder="color placeholder"
                                        type="color"
                                        className='shadow-sm h-auto'
                                        value={textColor}
                                        style={{ width: '6rem' }}
                                        onChange={e => setTextColor(e.target.value)}
                                    />
                                </div>
                            </Row>

                        </CardBody>
                    }
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

