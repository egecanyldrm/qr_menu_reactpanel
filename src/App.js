// ** Router Import
import Router from './router/Router'
import { isLogin } from './api/post'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { checkLogin } from './redux/authentication'
import axios from 'axios'
import { handleBasicTitleAlert } from './extension/basicalert'
const App = () => {

    const dispatch = useDispatch();
    const state = useSelector(state => state.auth);



    useEffect(() => {


        const token = localStorage.getItem('token')
        if (token) {
            dispatch(checkLogin(token))
        }
        //Axios Config
        axios.defaults.baseURL = 'http://localhost:4000';

    }, [])

    useEffect(() => {
        if (state.isLogin === false) {
            axios.defaults.headers.common['authorization'] = localStorage.getItem('token');

            handleBasicTitleAlert(state.message, state.status, state.title)
        }
    })

 

    return <Router />


}
export default App
