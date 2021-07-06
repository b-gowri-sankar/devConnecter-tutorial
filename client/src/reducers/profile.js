import { CLEAR_PROFILE, GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE } from "../actions/types";

const intitState = {
    profile: null,
    profiles: [],
    repos: [],
    loading: true,
    error: { }
}

export default function profile(state = intitState, action) {
    const { type, payload } = action;
    switch (type) {
        case GET_PROFILE:
        case UPDATE_PROFILE:
            return {
                ...state,
                profile: payload,
                loading:false
            }
        case PROFILE_ERROR:
            return {
                ...state,
                error: payload,
                loading:false
            };
        case CLEAR_PROFILE:
            return {
                ...state,
                profile: null,
                repost: [],
                loading:false,
            }
        default:
            return state;
    }
}