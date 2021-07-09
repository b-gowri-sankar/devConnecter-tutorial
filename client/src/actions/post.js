import { GET_POSTS, POST_ERROR } from "./types";
import axios from 'axios'


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


//