// ** Router Import
import Router from './router/Router'

import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { checkLogin } from './redux/authentication'
import axios from 'axios'
import { handleBasicTitleAlert } from './extension/basicalert'
import './index.scss'
require('dotenv').config()
//Local Storage package config
import ls from 'localstorage-slim';
ls.config.encrypt = true;


const App = () => {
    const dispatch = useDispatch();
    const state = useSelector(state => state.auth);

    useEffect(() => {


        let token = ls.get('token')
        if (token) {
            dispatch(checkLogin(token))
        }
        //Axios Config
        axios.defaults.baseURL = process.env.REACT_APP_API_URL;

    }, [])

    useEffect(() => {
        if (state.isLogin === false) {
            handleBasicTitleAlert(state.message, state.status, state.title)
        }
        let access_token = ls.get('token')
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
        // axios.defaults.headers.common['authorization'] = ;

    })



    return <Router />


}
export default App
