import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'


export const checkLogin = createAsyncThunk(
  'checkLogin',
  async (token) => {
    const response = await axios.post('http://localhost:4000/islogin',

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
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
      state.isLogin = true;
      state.user = action.payload.user;
      console.log(JSON.parse(localStorage.getItem('user')))
    },
    logOut(state, action) {
      state.isLogin = false
      state.status = 'success'
      state.title = ''
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.message = 'Oturumunuz Başarıyla Sonlanmıştır'
    },
    userNotFound(state, action) {
      state.message = 'Aradığınız Kullanıcı Bulunamadı'
      state.title = 'Oops...'
    },
    unAuthorized(state, action) {
      state.isLogin = false
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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
      state.user = JSON.parse(localStorage.getItem('user'))
    });
    builder.addCase(checkLogin.rejected, (state) => {
      // Add user to the state array
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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