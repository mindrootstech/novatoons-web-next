import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postRequest } from "../commonApi";

const initBookmarkState = {
    loading: false,
    error: false,
    message: '',
    data: {},
};

export const setBookmark = createAsyncThunk("setBookmark",
    async (data) => {
        let config = {
            sub_url: "/bookmarkcontent",
            dataMain: data.dataMain
        }
        const response = await postRequest(config);
        return response;
    }
)

const bookmarkReducer = createSlice({
    name: "bookmark",
    initialState: initBookmarkState,
    extraReducers: {
        [setBookmark.pending]: (state) => {
            state.loading = true;
            state.error = '';
        },
        [setBookmark.fulfilled]: (state, action) => {
            state.loading = false;
            if (action.payload.status) {
                state.data = action.payload.data;
            } else {
                state.message = action.payload.message;
            }
        }
    }
})


export default bookmarkReducer.reducer