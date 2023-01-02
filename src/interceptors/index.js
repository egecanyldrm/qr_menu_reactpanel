import axios from 'axios'
import toast from 'react-hot-toast';
const token = localStorage.getItem('token')

//Axios Config
axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
axios.interceptors.response.use(
    response => response,
    error => {
        const { config, response } = error

        if (response && response.status === 401) {
            console.log('unauth edildi')

        }
        if (response && response.status === 400) {
            console.log(response.data.message)
             toast.success('hata')
        }
        if (response && response.status === 404) {
            console.log(response.data.message)
            return toast.error(response.data.message, {
                duration: 4000,
                position: 'top-center'
            })
        }
    }
)
