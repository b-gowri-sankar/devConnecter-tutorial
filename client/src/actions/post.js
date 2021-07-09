import { GET_POSTS, POST_ERROR, UPDATE_LIKES, DELETE_POST } from "./types";
import axios from 'axios'
import { setAlert } from './alert'

//get posts

export const getPosts = () => async dispatch =>{
    try {
        const res = await axios.get('/api/posts')
        dispatch({
            type: GET_POSTS,
            payload: res.data
        })
    }
    catch (err) {
        if (err.response) {
            dispatch({
                type: POST_ERROR,
                payload:{msg:err.response.statusText, status: err.response.status}
            })
        }
        else {
            dispatch({
                type: POST_ERROR,
                payload:{msg: err.message, status:'check the action code'}
            })
        }
    }
}


//ADD Like

export const addLike = (id) => async dispatch => {
    try {
        
        const res = await axios.put(`/api/posts/like/${id}`);
        dispatch({
            type: UPDATE_LIKES,
            payload:{ id, likes:res.data}
        })

    } catch (err) {
        if (err.response) {
            dispatch({
                type: POST_ERROR,
                payload:{msg:err.response.statusText, status: err.response.status}
            })
        }
        else {
            dispatch({
                type: POST_ERROR,
                payload:{msg:err.message, status:'Just Check the action code for error'}
            })
        }
    }
}

//unlike post
export const removeLike = (id) => async dispatch => {
    try {

        const res = await axios.put(`/api/posts/unlike/${id}`)
        dispatch({
            type: UPDATE_LIKES,
            payload:{ id, likes:res.data}
        })
        
    } catch (err) {
        if (err.response) {
            dispatch({
                type: POST_ERROR,
                payload:{msg:err.response.statusText, status: err.response.status}
            })
        }
        else {
            dispatch({
                type: POST_ERROR,
                payload:{msg:err.message, status:'Just Check the action code for error'}
            })
        }
    }
}


//DELETE POST

export const deletePost = id => async dispatch => {
    try {
        await axios.delete(`/api/posts/${id}`)

        dispatch({
            type: DELETE_POST,
            payload:id
        })
        dispatch(setAlert('post removed', 'success'))
    }
    catch (err) {
        if (err.response) {
            dispatch({
                type: POST_ERROR,
                payload:{msg:err.response.statusText, status: err.response.status}
            })
        }
        else {
            dispatch({
                type: POST_ERROR,
                payload:{msg:err.message, status:'Just Check the action code for error'}
            })
        }
    }
}