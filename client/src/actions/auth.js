import axios from 'axios'
import { REGISTER_FAIL, REGISTER_SUCCESS, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, CLEAR_PROFILE } from './types'
import { setAlert } from './alert'
import setAuthToken from '../utils/setAuthToken'
//Register user
//load the user
export const loadUser = () =>async dispatch => {
    if (localStorage.token) {
        setAuthToken(localStorage.token)
    }

    try {
        // console.log('loadUser fucions is called')
        const res = await axios.get('/api/auth');
        dispatch({
            type: USER_LOADED,
            payload:res.data
        })
    } catch (err) {
        dispatch({
            type: AUTH_ERROR,
        })
    }
}

export const register = ({ name, email, password }) => async dispatch => {
    const config = {
        Headers: {
            'content-type': 'application/json'
        }
    }
    try {
        const res = await axios.post('/api/users', { name, email, password}, config);
        // console.log("this is response", res)
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        })
        dispatch(loadUser())
    }
    catch (err) {
        console.log(err.response.data.err)
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type: REGISTER_FAIL
        });
    }
}

export const login = ({ email, password }) => async dispatch => {
    const config = {
        headers: {
            'content-type':'application/json'
        }
    }
    try {
        
        const res =await axios.post('/api/auth', { email, password }, config)
        console.log(res.PromiseResult)
        dispatch({
            type: LOGIN_SUCCESS,
            payload:res.data
        })
        dispatch(loadUser())
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error=>dispatch(setAlert(err.msg, 'danger')))
        }
        // console.log('error in login', err.message)
        dispatch({
            type: LOGIN_FAIL
        })
    }
}

//loutout //clear profile

export const logout = () => dispatch => {
    dispatch({ type: CLEAR_PROFILE})
    dispatch({ type: LOGOUT })   
}
