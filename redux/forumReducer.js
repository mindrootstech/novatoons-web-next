import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosRequest } from '../http'

//images
import dummyUser from '../assets/images/avatar/profileimage.png'

const initialState = {
    forumComment: [{
        id: 1,
        is_mine: 1,
        comment: "Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industryLorem Ipsum is simply dummy text of the printing and typesetting industry",
        user_id: 4,
        first_name: 'Rajpreet',
        last_name: 'Giri',
        profile_img: dummyUser,
        create_at: '2022-07-25T12:43:49.000Z'
    },
    {
        id: 2,
        is_mine: 1,
        comment: "Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industryLorem Ipsum is simply dummy text of the printing and typesetting industry",
        user_id: 4,
        first_name: 'Rajpreet',
        last_name: 'Giri',
        profile_img: dummyUser,
        create_at: '2022-07-25T12:43:49.000Z'
    }],
    selectedComment:{
        commentData: {},
        index: null,
        show: false
    },
    seletedForum:{},
    actionType: null,
    load_more: false,
    loading: false,
    error: false,
    error_message: null
}

// Post comment on Forum
export const postForumComment = createAsyncThunk(
    'postForumComment',
    async (dataMain, { rejectWithValue }) => {
        try {
            let response = await axiosRequest({ sub_url: '/', dataMain })
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


const forumReducer = createSlice({
    name: "forums",
    initialState,
    reducers: {
        actionBoxShow: (state, action) => {
            state.selectedComment.show = action.payload.show
            state.selectedComment.commentData = action.payload.commentData
            state.selectedComment.index = action.payload.index
        },
        deleteForumComment: (state, action) => {
            state.forumComment.splice(state.selectedComment.index, 1)
            state.actionType = 'delete'
        },
        editForumComment:(state, action) => {
            state.actionType = 'edit'
        },
        reportForumComment:(state, action) => {
            state.actionType = 'report'
        },
        actionBoxHide: (state, action) => {
            state.selectedComment.show = false
        },
        updateComment: (state, action) => {
            state.forumComment[state.selectedComment.index].comment = action.payload.newComment
        },
        seletedForum: (state, action) => {
            state.seletedForum = action.payload.item
        }

    },
    extraReducers: {
        [postForumComment.pending]: (state) => {
            state.loading = false
        },
        [postForumComment.rejected]: (state, action) => {
            state.loading = false
            state.err = true
            state.error_message = action.payload.message
        },
        [postForumComment.fulfilled]: (state, action) => {
            const {response, dataMain} = action.payload
            if (response.status) {
                state.forumComment = dataMain.page === 1 ? response.data : [...state.forumComment, ...response.data]
            } else {
                state.error = action.payload.response.status
                state.error_message = action.payload.response.message
            }
            state.loading = false
        },
    }
})

export const {
    actionBoxShow,
    editForumComment,
    deleteForumComment,
    actionBoxHide,
    updateComment,
    seletedForum
} = forumReducer.actions

export default forumReducer.reducer