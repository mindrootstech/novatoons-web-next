import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { postRequest } from '../commonApi'
import { axiosRequest } from '../http'

const initialState = {
    promotianPackage: [],
    supportMesssage: {
        data: [],
        load_more: false,
        page: 1
    },
    filteredData: [],
    load_more: false,
    processing: false,
    progress: 0,
    contentReqStats: {
        processing: false,
        reqProgress: 0
    },
    loading: false,
    error: false,
    err_message: null,
    forgotPassModel: false,
    searching: false,
    page: 0
}

export const searchData = createAsyncThunk(
    'searchdata',
    async (dataMain) => {
        let response = await postRequest({ sub_url: '/searchall', dataMain })
        response.page = dataMain.page
        return response
    }
)

export const getPromotionpackages = createAsyncThunk(
    'getpromotionpackages',
    async (dataMain, { rejectWithValue }) => {
        
        try {
            let response = await axiosRequest({ sub_url: '/promotionpackages', dataMain })
            if (response.status === 200) {
                return response.data
            }
        } catch (err) {
            if (err.response.data.logout) {
                localStorage.clear()
                sessionStorage.clear()
            }
            if (!err.response) {
                throw err
            }
            return rejectWithValue(err.response.data)
        }
    }
)

export const getSupportMessage = createAsyncThunk(
    'getsupportmessage',
    async (dataMain, { rejectWithValue }) => {
        try {
            let response = await axiosRequest({ sub_url: '/supportMessages', dataMain })
            if (response.status === 200) {
                return {response: response.data, dataMain}
            }
        } catch (err) {
            if (err.response.data.logout) {
                localStorage.clear()
                sessionStorage.clear()
            }
            if (!err.response) {
                throw err
            }
            return rejectWithValue(err.response.data)
        }
    }

)

const commonReducer = createSlice({
    name: "common",
    initialState,
    reducers: {
        processLoader: (state, action) => {
            state.processing = action.payload
        },
        progressBar: (state, action) => {
            state.progress = action.payload
        },
        contentRequest: (state, action) => {
            state.contentReqStats.processing = action.payload.start
            state.contentReqStats.reqProgress = action.payload.progress
            state.contentReqStats.nextContent = action.payload.nextContent
        },
        resetFilterd: (state) => {
            state.filteredData = []
            state.searching = false
        },
        supportMesssageMore: (state, action) => {
            state.filteredData.page = action.payload
        },
        forgotPass: (state, action) => {
            state.forgotPassModel = action.payload
        },
        resetPromotionPackage: (state, action) => {
            state.promotianPackage = []
        }
    },
    extraReducers: {
        [searchData.pending]: (state, action) => {
            state.loading = true
            state.searching = true
        },
        [searchData.rejected]: (state, action) => {
            state.loading = false
        },
        [searchData.fulfilled]: (state, action) => {
            state.loading = false
            state.searching = true
            state.filteredData = action.payload.page === 1 ? action.payload.data : [...state.filteredData, ...action.payload.data]
            state.load_more = action.payload.load_more
            state.page = action.payload.page
        },
        [getPromotionpackages.pending]: (state, action) => {
            state.loading = true
        },
        [getPromotionpackages.rejected]: (state, action) => {
            state.error = true
            state.error_message = action.payload.message
            state.loading = false
        },
        [getPromotionpackages.fulfilled]: (state, action) => {
            if (action.payload.status === true) {
                state.promotianPackage = action.payload.data
            } else {
                state.error = true
                state.err_message = action.payload.message
            }
            state.loading = false
        },
        // supoort message
        [getSupportMessage.pending]: (state) => {
            state.loading = true
        },
        [getSupportMessage.rejected]: (state, action) => {
            state.error = true
            state.error_message = action.payload.message
            state.loading = false
        },
        [getSupportMessage.fulfilled]: (state, action) => {
            const { response, dataMain } = action.payload
            if (response.status === true) {
                state.supportMesssage.data = dataMain.page === 1 ? response.data : [...state.supportMesssage.data, ...response.data]
                state.supportMesssage.load_more = response.load_more
            } else {
                state.error = true
                state.err_message = action.payload.message
            }
            state.loading = false
        }
    }
})

export const { processLoader, progressBar, contentRequest, resetFilterd, supportMesssageMore, forgotPass, resetPromotionPackage } = commonReducer.actions
export default commonReducer.reducer