import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { postRequest } from "../commonApi";

const initialState = {
    tags: [],
    genres:[],
    filteredGenre: {},
    filteredTags: [],
    filterSubGenre: [],
    loading: true,
    error: null
}

export const getTags = createAsyncThunk(
    'gettags',
    async (dataMain) => {
        let response = await postRequest({ sub_url: '/gettags', dataMain })
        const labling = response.data.map(i => {
            i["label"] = i.tag
            i["value"] = i.tag
            return i
          })
        response.data = labling
        return response
    }
)

export const getGenre = createAsyncThunk(
    'getgenres',
    async (dataMain) => {
        let response = await postRequest({ sub_url: '/getgenres', dataMain })
        const labling = response.data.map(i => {
            i["label"] = i.genre
            i["value"] = i.genre
            return i
          })
        response.data = labling
        return response
    }
)

const tagReducer = createSlice({
    name: "tags",
    initialState,
    reducers: {
        resetTags: (state, action) => {
            state.tags = []
            state.genres = []
        },
        filterationTagsGenre : (state, action) => {
            state.filteredGenre = action.payload.filteredGenre
            state.filteredTags = action.payload.filteredTags
        },
        selectGenre : (state, action) => {
            state.filteredGenre = action.payload.genreSelected
            state.filteredTags = []
        },
        filterSubGenresAction: (state, action) => {
            state.filterSubGenre = action.payload.data
        },
        resetSelected : (state, action) => {
            state.filteredGenre = {}
            state.filteredTags = []
        }
    },
    extraReducers: {
        [getTags.pending]: (state, action) => {
            state.loading = true
        },
        [getTags.rejected]: (state, action) => {
            state.loading = false
        },
        [getTags.fulfilled]: (state, { payload: { status, data } }) => {
            
            if (status === true) {
                state.tags = data
                state.loading = false
            }
        },
        [getGenre.pending]: (state, action) => {
            state.loading = true
        },
        [getGenre.rejected]: (state, action) => {
            state.loading = false
            state.error = "Something went wrong! please try again later"
        },
        [getGenre.fulfilled]: (state, { payload: { status, data } }) => {
            if (status === true) {
                state.genres = data
                state.loading = false
            }
        }
    }
})

export const { resetTags, filterationTagsGenre, resetSelected, selectGenre, filterSubGenresAction } = tagReducer.actions
export default tagReducer.reducer