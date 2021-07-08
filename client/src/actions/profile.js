import axios from 'axios'
import { setAlert } from './alert';


import {
    GET_PROFILE,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    CLEAR_PROFILE,DELETE_ACCOUNT, GET_PROFILES, GET_REPOS
} from './types'

export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/profiles/me')
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    }
    catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        })
    }
}
//get all profiles
export const getAllProfiles = () => async dispatch => {
    dispatch({
        type:CLEAR_PROFILE
    })
    try {
        const res = await axios.get('/api/profiles');
        dispatch({
            type: GET_PROFILES,
            payload: res.data
        })
    }
    catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload:{msg: err.response.statusText, status: err.response.status}
        })
    }
}

//get a single user profile

export const getProfileById = (userId) => async dispatch => {
    try {
        const res = await axios.get(`/api/profiles/user/${userId}`)
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
    }
    catch (err) {
        console.log("error", err)
        // dispatch({
        //     type: PROFILE_ERROR,
        //     payload:{ msg: err.response.statusText, status: err.response.status}
        // })
    }
}
//GET github repos

export const getGithubRepos = (username) => async dispatch => {
    try {
        const res = await axios.get(`/api/profiles/github/${username}`);
        dispatch({
            type: GET_REPOS,
            payload: res.data
        })
    }
    catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        })
    }
}

//Create or Update profile


export const createProfile = (formData, history, edit = false) => async dispatch => {
    try {
        
        const config = {
            headers: {
               'content-type': 'application/json' 
            }
        }

        const res= await axios.post('/api/profiles', formData, config)
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'))
        
            history.push('/dashboard')
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error=>dispatch(setAlert(err.msg, 'danger')))
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        })
    }
}

// ADD EXPERIENCE

export const addExperience = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        };

        const res = await axios.put('/api/profiles/experience', formData, config)

        dispatch({
            type: UPDATE_PROFILE,
            payload:res.data
        })
        dispatch(setAlert('Experience Added', 'success'))
        history.push('/dashboard')
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error=>dispatch(setAlert(err.msg, 'danger')))
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        })
    }
}

//ADD education

export const addEducation = (formData, history) => async dispatch => {
    try {
        
        const config = {
            headers: {
                'content-type':'application/json'
            }
        }


        const res =await axios.put('/api/profiles/education', formData, config)

        dispatch({
            type: UPDATE_PROFILE,
            payload:res.data
        })
        
        dispatch(setAlert('Education added', 'success'));
        history.push('/dashboard')
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error=>dispatch(setAlert(err.msg, 'danger')))
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        })
    }
}

//delete experience

export const deleteExperience = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profiles/experience/${id}`)
        dispatch({
            type: UPDATE_PROFILE,
            payload:res.data
        })
        dispatch(setAlert('Experience Removed', 'success'))
    }
    catch (err) {
        dispatch(
            {
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            }
        );
    }
}

//delete education

export const deleteEducation = id => async dispatch => {
    try {
        
        const res = await axios.delete(`/api/profiles/education/${id}`)
        dispatch({
            type: UPDATE_PROFILE,
            payload:res.data
        })

        dispatch( setAlert('education removed', 'success'))

    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload:{ msg: err.response.statusText, status:err.response.status}
     })   
    }
}
//delete user account

export const deleteAccount = () => async dispatch => {
    if (window.confirm('Are you sure? This can not be undone')) {
        try {
            await axios.delete('/api/profiles');
            dispatch({type:CLEAR_PROFILE})
            dispatch({
                type: DELETE_ACCOUNT,
            })
            dispatch(setAlert('YOu account has permanently deleted'))
        }
        catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload:{ msg: err.respond.statusText, status: err.response.status}
            })
        }
    }
    
}