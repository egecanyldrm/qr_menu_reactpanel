// ** Router Import
import Router from './router/Router'

import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { checkLogin, unAuthorized } from './redux/authentication'
import axios from 'axios'
import './index.scss'
require('dotenv').config()
//Local Storage package config
import ls from 'localstorage-slim';
import { ToastError } from './extension/toast'
ls.config.encrypt = true;

const App = () => {
    const dispatch = useDispatch();
    const state = useSelector(state => state)
    useEffect(() => {

        // let token = ls.get('token')
        let token = localStorage.getItem('token')
        if (token) dispatch(checkLogin(token))

        //Axios Config
        axios.defaults.baseURL = process.env.REACT_APP_API_URL;
        axios.interceptors.response.use(
            response => response,
            error => {
                const { config, response } = error
                if (response && response.status === 401) dispatch(unAuthorized())
                if (response && response.status === 400) ToastError(response.data.message)
                if (response && response.status === 404) ToastError(response.data.message)

            }
        )

    }, [])

    useEffect(() => {
        // let access_token = ls.get('token')
        let access_token = localStorage.getItem('token')
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    })
    useEffect(() => {
        // let access_token = ls.get('token')
        let access_token = localStorage.getItem('token')
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    }, [state.auth.isLogin])
    console.log(state.auth.isLogin)

    return <Router />


}
export default App
