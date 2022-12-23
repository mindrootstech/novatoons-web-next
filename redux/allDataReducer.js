import { createSlice, createAsyncThunk, current} from '@reduxjs/toolkit'
// import { postRequest } from "../../commonApi";

import { axiosRequest } from '../http'

const initialState = {
    all_data: [],
    filterData: {
        page: 1,
        content_type: '',
        category: '',
        genre_id: '',
        is_paid: '',
        is_mature: '',
        sortby: ''
    },
    categoriesShow: false,
    sortShow: false,
    loading: false,
    load_more: false,
    err: false,
    err_message: null
}

export const getAllData = createAsyncThunk(
    'getAllData',
    async (dataMain, { rejectWithValue }) => {
        try {
            let response = await axiosRequest({ sub_url: '/exploreall', dataMain })
            if (response.status === 200) {
                return { response: response.data, page: dataMain.page }
            }
        } catch (err) {
            if (!err.response) {
                throw err
            }
            return rejectWithValue(err.response.data)
        }
    }
)

const allDataReducer = createSlice({
    name: "ALLDATA",
    initialState,
    reducers: {
        resetalldata: (state) => {
            state.all_data = []
            state.loading = false
        },
        filterGenre: (state, action) => {
            const { genre_id, append } = action.payload
            state.filterData.genre_id = state.filterData.genre_id === "" ? `${genre_id}` : 
            append ? `${state.filterData.genre_id},${genre_id}` :
            state.filterData.genre_id.includes(`${genre_id},`) ? 
            state.filterData.genre_id.replace(`${genre_id},`, '') :
            state.filterData.genre_id.includes(`,${genre_id}`) ?
            state.filterData.genre_id.replace(`,${genre_id}`, '') : ''
        },

        filterContent_type: (state, action) => {
            const { content_type, append } = action.payload
            state.filterData.content_type = state.filterData.content_type === "" ? `${content_type}` : append ? `${state.filterData.content_type},${content_type}` : state.filterData.content_type.includes(`${content_type},`) ? state.filterData.content_type.replace(`${content_type},`, '') : state.filterData.content_type.replace(`${content_type}`, '')
        },
        filterIs_mature: (state, action) => {
            const { is_mature, append } = action.payload
            state.filterData.is_mature = state.filterData.is_mature === "" ? `${is_mature}` : append ? `${state.filterData.is_mature},${is_mature}` : state.filterData.is_mature.includes(`${is_mature},`) ? state.filterData.is_mature.replace(`${is_mature},`, '') : state.filterData.is_mature.replace(`${is_mature}`, '')
        },
        filterIs_paid: (state, action) => {
            const { is_paid, append } = action.payload
            state.filterData.is_paid = state.filterData.is_paid === "" ? 
            `${is_paid}` : 
            append ? `${state.filterData.is_paid},${is_paid}` : 
            state.filterData.is_paid.includes(`${is_paid},`) ? 
            state.filterData.is_paid.replace(`${is_paid},`, '') : 
            state.filterData.is_paid.replace(`${is_paid}`, '')
        },
        filterSortby: (state, action) => {
            state.filterData.sortby = action.payload.sortby
        },
        filterPage: (state, action) => {
            state.filterData.page = action.payload.page
        },
        filterCategory: (state, action) => {
            state.filterData.category = action.payload.category
        },
        categoriesShowDrop: (state, action) => {
            state.categoriesShow = action.payload
        },
        sortShowDrop: (state, action) => {
            state.sortShow = action.payload
        },
        resetFilter: (state, action) => {
            state.filterData.page = 1
            state.filterData.content_type = ''
            state.filterData.category = ''
            state.filterData.genre_id = ''
            state.filterData.is_mature = ''
            state.filterData.is_paid = ''
            state.filterData.sortby = ''
        }
    },
    extraReducers: {
        [getAllData.pending]: (state, action) => {
            state.loading = true
        },
        [getAllData.rejected]: (state, action) => {
            state.loading = false
            state.err = true
            state.err_message = action.payload.message
        },
        [getAllData.fulfilled]: (state, action) => {
            state.loading = false
            state.all_data = action.payload.page === 1 ? action.payload.response.data : [...state.all_data, ...action.payload.response.data]
            state.load_more = action.payload.response.load_more
        }
    }
})
export const {
    categoriesShowDrop,
    sortShowDrop,
    resetalldata,
    filterGenre,
    filterCategory,
    filterPage,
    filterContent_type,
    filterIs_mature,
    filterIs_paid,
    filterSortby,
    resetFilter
} = allDataReducer.actions
export default allDataReducer.reducer