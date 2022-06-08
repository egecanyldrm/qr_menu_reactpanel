import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import ls from 'localstorage-slim';
require('dotenv').config()


export const checkLogin = createAsyncThunk(
  'checkLogin',
  async (token) => {
    const response = await axios.post(process.env.REACT_APP_API_URL + '/islogin',
      {
        token: token
      }
    )
    return response.data
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLogin: null,
    message: ''
  },
  reducers: {
    logIn(state, action) {
      ls.set('user', JSON.stringify(action.payload.user));
      ls.set('token', action.payload.token);
      state.isLogin = true;
      state.user = action.payload.user;
      // console.log(JSON.parse(localStorage.getItem('user')))
    },
    logOut(state, action) {
      state.isLogin = false
      state.status = 'success'
      state.title = ''
      ls.remove('token');
      ls.remove('user');
      state.message = 'Oturumunuz Başarıyla Sonlanmıştır'
    },
    userNotFound(state, action) {
      state.message = 'Aradığınız Kullanıcı Bulunamadı'
      state.title = 'Oops...'
    },
    unAuthorized(state, action) {
      state.isLogin = false
      ls.remove('token');
      ls.remove('user');
      state.status = 'error'
      state.message = 'Oturum Süreniz Dolmuştur'
      state.title = 'Oops...'
    }
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(checkLogin.pending, (state) => {
      // Add user to the state array
      state.isLogin = true
      state.user = JSON.parse(ls.get('user'))
    });
    builder.addCase(checkLogin.rejected, (state) => {
      // Add user to the state array
      ls.remove('token');
      ls.remove('user');
      state.isLogin = false,
        state.status = 'error'
      state.message = 'Oturum süreniz Dolmuştur'
      state.title = 'Oops...'

    })
  }
}
)

export const { logIn, logOut, userNotFound, unAuthorized } = authSlice.actions
export default authSlice.reducer