import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit'
import { axiosRequest } from '../http'

const initialState = {
    data: [],
    load_more: false,
    selectedComment: {
        action_open: false,
        comment: {},
        is_child: null,
        reply_open: false
    },
    singleComment: {
        show: false,
        comment: {},
        dataFound: null,
        index: null,
        loading: false
    },
    lastComment: null,
    lastLikedComment: null,
    loading: false,
    error: false,
    error_message: null,
    like_count: 0,
}


// Get comments
export const getComments = createAsyncThunk(
    'getcomments',
    async (dataMain, { rejectWithValue }) => {
        try {
            let response = await axiosRequest({ sub_url: '/getcomments', dataMain })
            if (response.status === 200) {
                return { response: response.data, dataMain }
            }
        } catch (err) {
            if (!err.response) {
                throw err
            }
            return rejectWithValue(err.response.data)
        }
    }
)

// Post comment
export const postComment = createAsyncThunk(
    'postComment',
    async (dataMain, { rejectWithValue }) => {
        try {
            let response = await axiosRequest({ sub_url: '/postcomment', dataMain })
            if (response.status === 200) {
               
                return { response: response.data, dataMain}
            }
        } catch (err) {
            if (!err.response) {
                throw err
            }
            return rejectWithValue(err.response.data)
        }
    }
)

// Like comment
export const likeComment = createAsyncThunk(
    'likeComment',
    async (dataMain, { rejectWithValue }) => {
        try {
            let response = await axiosRequest({ sub_url: '/likecomment', dataMain })
            if (response.status === 200) {
                return { response: response.data, dataMain }
            }
        } catch (err) {
            if (!err.response) {
                throw err
            }
            return rejectWithValue(err.response.data)
        }
    }
)

// delete comment
export const deleteComment = createAsyncThunk(
    'deleteComment',
    async (dataMain, { rejectWithValue }) => {
        try {
            let response = await axiosRequest({ sub_url: '/deletecomment', dataMain })
            if (response.status === 200) {
               
                 return { response: response, dataMain }
            }
        } catch (err) {
            if (!err.response) {
                throw err
            }
            return rejectWithValue(err.response.data)
        }
    }
)

// single comment
export const getSingleComment = createAsyncThunk(
    'singleComment',
    async (dataMain, { rejectWithValue }) => {
        try {
            let response = await axiosRequest({ sub_url: '/getsinglecomment', dataMain })
            if (response.status === 200) {
                return { response: response.data, dataMain }
            }
        } catch (err) {
            if (!err.response) {
                throw err
            }
            return rejectWithValue(err.response.data)
        }
    }
)


const commentReducer = createSlice({
    name: "comments",
    initialState,
    reducers: {
        openActionMenu: (state, action) => {
            state.selectedComment.action_open = action.payload.action_open
            state.selectedComment.comment = action.payload.comment
            state.selectedComment.is_child = action.payload.is_child
            state.selectedComment.reply_open = false
        },
        openReplyInput: (state, action) => {
            state.selectedComment.action_open = false
            state.selectedComment.comment = action.payload.comment
            state.selectedComment.is_child = action.payload.is_child
            state.selectedComment.reply_open = action.payload.reply_open
            
        },
        likeCounter: (state, action) => {
            if(action.payload.singleComment === '1') {
                if (action.payload.is_child) {
                    if (action.payload.increment) {
                        state.singleComment.comment.reply[action.payload.index].like_count++ 
                        state.singleComment.comment.reply[action.payload.index].is_liked = 1
                    }
                    else {  
                        state.singleComment.comment.reply[action.payload.index].like_count--
                        state.singleComment.comment.reply[action.payload.index].is_liked = 0
                    }
                } else {
                    if (action.payload.increment) {
                        state.singleComment.comment.like_count++
                        state.singleComment.comment.is_liked = 1
                    }
                    else {
                        state.singleComment.comment.like_count--
                        state.singleComment.comment.is_liked = 0
                    }
                }
            } else {
            if (action.payload.is_child) {
                if (action.payload.increment) {
                    state.data[action.payload.parentIndex].reply[action.payload.index].like_count++
                    state.data[action.payload.parentIndex].reply[action.payload.index].is_liked = 1
                }
                else {
                    state.data[action.payload.parentIndex].reply[action.payload.index].like_count--
                    state.data[action.payload.parentIndex].reply[action.payload.index].is_liked = 0
                }
            } else {
                if (action.payload.increment) {
                    state.data[action.payload.index].like_count++
                    state.data[action.payload.index].is_liked = 1
                }
                else {
                    state.data[action.payload.index].like_count--
                    state.data[action.payload.index].is_liked = 0
                }
            }
        }
            },
        resetSelected: (state) => {
            state.selectedComment.action_open = false
            state.selectedComment.comment = {}
            state.selectedComment.is_child = null
            state.selectedComment.reply_open = false
        },
        actionClose: (state) => {
            state.selectedComment.action_open = false
        },
        setLoadMore: (state, action) => {
            state.load_more = action.payload 
        },
        singleCommentShow: (state, action) => {
            state.singleComment.show = action.payload 
        },
        setSingleCommentData: (state, action) => {
            state.lastComment = action.payload
            if (action.payload.dataMain.is_child) {
                if(action.payload.dataMain.singleComment === '1'){
                    state.singleComment.comment.reply =[...state.singleComment.comment.reply, { ...action.payload.response.body[0], is_mine: 1 } ];
                } else {
                state.data[action.payload.dataMain.parentIndex].message = action.payload.response.message
                state.data[action.payload.dataMain.parentIndex].reply = [...state.data[action.payload.dataMain.parentIndex].reply, { ...action.payload.response.body[0], is_mine: 1 }];
                state.selectedComment.reply_open = false
                }
            } else {
                if (action.payload.response.status) {
                    state.data = action.payload.dataMain.comment_parent_id === 0 ? [...state.data, { ...action.payload.response.body[0], reply: [] }] : null
                    
                } else {
                    state.error = action.payload.response.status
                    state.error_message = action.payload.response.message
                }
            }
                
            state.loading = false
        },
    },
    extraReducers: {
        [getComments.pending]: (state) => {
            state.loading = true
        },
        [getComments.rejected]: (state, action) => {
            state.loading = false
            state.err = true
            state.error_message = action.payload.message
        },
        [getComments.fulfilled]: (state, action) => {
            if (action.payload.response.status) {
                state.data = action.payload.response.body
                state.load_more = action.payload.response.load_more
            } else {
                state.error = action.payload.response.status
                state.error_message = action.payload.response.message
            }
            state.loading = false
        },
        [postComment.pending]: (state) => {
            state.loading = false
        },
        [postComment.rejected]: (state, action) => {
            state.loading = false
            state.err = true
        },
        [postComment.fulfilled]: (state, action) => {
            state.lastComment = action.payload
            if (action.payload.dataMain.is_child) {
                if(action.payload.dataMain.singleComment === '1'){
                    state.singleComment.comment.reply =[...state.singleComment.comment.reply, { ...action.payload.response.body[0], is_mine: 1 } ];
                } else {
                state.data[action.payload.dataMain.parentIndex].message = action.payload.response.message
                state.data[action.payload.dataMain.parentIndex].reply = [...state.data[action.payload.dataMain.parentIndex].reply, { ...action.payload.response.body[0], is_mine: 1 }];
                state.selectedComment.reply_open = false
                }
            } else {
                if (action.payload.response.status) {
                    state.data = action.payload.dataMain.comment_parent_id === 0 ? [...state.data, { ...action.payload.response.body[0], reply: [] }] : null
                    
                } else {
                    state.error = action.payload.response.status
                    state.error_message = action.payload.response.message
                }
            }
                
            state.loading = false
        },
        [deleteComment.rejected]: (state, action) => {
            state.loading = false
            state.err = true
            state.error_message = action.payload.message
        },
        [deleteComment.fulfilled]: (state, action) => {
            const {dataMain} = action.payload
            if (action.payload.response.status) {
                if(!dataMain.is_childComment) {
                    if(action.payload.dataMain.singleComment === '1'){
                        state.singleComment.comment = {}
                        state.singleComment.show = false
                    }else {
                    state.data.splice(dataMain.myIndex, 1) 
                    }
                } else {
                    if(action.payload.dataMain.singleComment === '1'){
                        state.singleComment.comment.reply.splice(dataMain.myIndex, 1)

                    }else {
                        state.data[dataMain.parentComment].reply.splice(dataMain.myIndex, 1)

                    }
                }
            } else {
                state.error = action.payload.response.status
                state.error_message = action.payload.response.message
            }
            state.loading = false
        },
        [getSingleComment.pending]: (state) => {
            state.singleComment.loading = true
        },
        [getSingleComment.rejected]: (state) => {
            state.singleComment.loading = false
            state.singleComment.dataFound = false
            state.singleComment.show = true
        },
        [getSingleComment.fulfilled]: (state, action) => {
            state.singleComment.show = true
            state.singleComment.comment = action.payload.response.data
            state.singleComment.loading = false  
            state.singleComment.dataFound = true
        },
        [likeComment.pending]: (state) => {
            state.loading = false
        },
        [likeComment.rejected]: (state) => {
            state.loading = false
            state.err = true
        },
        [likeComment.fulfilled]: (state, action) => {
            state.lastLikedComment = action.payload
        },
    },
})

export default commentReducer.reducer
export const { openActionMenu,setSingleCommentData,singleCommentShow, likeCounter, resetSelected, openReplyInput,setLoadMore, actionClose } = commentReducer.actions