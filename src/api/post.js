import axios from 'axios';

export const postLogin = async (email, password) => {

    try {
        const result = await axios.post('/login', {
            email: email,
            password: password
        })
        return result
    } catch (err) {
        throw new Error('Kullanıcı Bulunamadı!')
    }
}

export const isLogin = async (token) => {
    try {
        const result = await axios.post('/islogin', {
            token: token
        })
        return result
    } catch (err) {
    }
}