import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { postRequest } from "../commonApi";

const initialState = {
    authordata: {},
    authorposts: {
        posts: [],
        load_more: false
    },
    loading: true,
    err: false,
    err_message: null
}

export const getAuthor = createAsyncThunk(
    'getauthor',
    async (dataMain) => {
        let response = await postRequest({ sub_url: '/getauthor', dataMain })
        return response
    }
)
export const getAuthorPosts = createAsyncThunk(
    'getauthorposts',
    async (dataMain) => {
        let response = await postRequest({ sub_url: '/getauthorposts', dataMain })
        return {response, dataMain}
    }
)

const authorReducer = createSlice({
    name: "payout",
    initialState,
    reducers: {
        resetAuthor: (state) => {
            state.authordata = {}
            state.loading = false
            state.err = false
            state.err_message = null
        },
        resetAuthorPosts: (state) => {
            state.authorposts.posts = []
            state.authorposts.load_more = false
        } 
    },
    extraReducers: {
        [getAuthor.pending]: (state) => {
            state.loading = true
        },
        [getAuthor.rejected]: (state) => {
            state.loading = false
            state.err = true
        },
        [getAuthor.fulfilled]: (state, action) => {
            if(action.payload.status === true) {
                state.loading = false
                state.authordata = action.payload.data 
            } else {
                state.loading = false
                state.err = true
                state.err_message = action.payload.message
            }
        },
        [getAuthorPosts.pending]: (state) => {
            state.loading = true
        },
        [getAuthorPosts.rejected]: (state, action) => {
            state.loading = false
            state.err = true
            state.err_message = action.payload.message
        },
        [getAuthorPosts.fulfilled]: (state, action) => {
            if(action.payload.response.status === true) {
                state.loading = false
                state.authorposts.posts = action.payload.dataMain.page === 1 ? action.payload.response.data : [...state.authorposts.posts, ...action.payload.response.data]
                state.authorposts.load_more = action.payload.response.load_more  
            } else {
                state.loading = false
                state.err = true
                state.err_message = action.payload.message
            }
        }
    }
})

export const { resetAuthor, resetAuthorPosts } = authorReducer.actions
export default authorReducer.reducer