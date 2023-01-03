import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import ls from 'localstorage-slim';
import { ToastErrorTopCenter } from '../extension/toast';
require('dotenv').config()


export const checkLogin = createAsyncThunk('checkLogin', async (token) => {
  const response = await axios.post(process.env.REACT_APP_API_URL + '/islogin', { token: token })
  return response.data
}
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLogin: false,
    message: ''
  },
  reducers: {
    logIn(state, action) {
      localStorage.setItem('user', JSON.stringify(action.payload.user))
      localStorage.setItem('token', action.payload.token)
      state.isLogin = true;
      state.user = action.payload.user;
    },
    logOut(state, action) {
      state.isLogin = false
      localStorage.clear()
      ToastErrorTopCenter('Oturumunuz Başarıyla Sonlanmıştır');
    },
    userNotFound(state, action) {
      state.message = 'Aradığınız Kullanıcı Bulunamadı'
      state.title = 'Oops...'
    },
    unAuthorized(state, action) {
      state.isLogin = false
      localStorage.clear();
      state.message = 'Oturum Süreniz Dolmuştur'
      ToastErrorTopCenter('Oturum Süreniz Dolmuştur');
    }
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(checkLogin.pending, (state) => {
      // Add user to the state array
      state.isLogin = true
      state.user = JSON.parse(localStorage.getItem('user'))
    });
    builder.addCase(checkLogin.rejected, (state) => {
      // Add user to the state array
      localStorage.clear()
      state.isLogin = false;
      state.status = 'error';
      state.message = 'Oturum süreniz Dolmuştur';
      state.title = 'Oops...';
    })
  }
}
)

export const { logIn, logOut, userNotFound, unAuthorized } = authSlice.actions
export default authSlice.reducer