import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { postRequest } from "../commonApi";

const initialState = {
    isSeries:null,
    series: {
        seriesId: null,
        seriesdata: null,
        seriesContent: [],
    },
    cover_image_dimention:{
        width: null,
        height: null,
        ratio: false,
    },
    content:{
        contentData:{}
    },
    previewItem: {
        previewPopup:false,
        previewPopupData: {},
    },
    popup: false,
    is_duplicate: null,
    contenttypeName: null,
    valueReset: false,
    loading: false
}
export const getSeries = createAsyncThunk(
    'mygetseries',
    async (dataMain) => {
        let response = await postRequest({ sub_url: '/getseries', dataMain })
        return response
    }
)

export const is_content_duplicate = createAsyncThunk(
    'isduplicate',
    async (dataMain) => {
        let response = await postRequest({ sub_url: '/checkcontentfile', dataMain })
        return response
    }
)


const seriesReducer = createSlice({
    name: "series",
    initialState,
    reducers: {
        resetSeries: (state, action) => {
            state.series.seriesdata = null
            state.series.seriesId = null
            state.popup = false
        },
        seriesIdandPopup: (state, action) => {
            state.series.seriesId = action.payload.seriesId
            state.popup = action.payload.popupvalue
        },
        closepopup : (state) => {
            state.popup = false
        },
        previewpopup : (state, action) => {
            state.previewItem.previewPopup = true
            state.previewItem.previewPopupData = action.payload
        },
        closepreviewpopup : (state) => {
            state.previewItem.previewPopup = false
        },
        contentTypeName: (state, action)=>{
            state.contenttypeName= action.payload.content
        },
        resetPage : (state, action)=> {
            state.series.seriesdata = null
            state.series.seriesId = null
            state.popup = false
            state.series.seriesContent = []
            state.valueReset = action.payload
        },
        cover_image_ratio : (state, action) => {
            state.cover_image_dimention = action.payload
        }
    },
    extraReducers: {
        [getSeries.pending]: (state) => {
            state.loading = true
            state.isSeries = true
        },
        [getSeries.rejected]: (state) => {
            state.loading = true
            state.isSeries = false
        },
        [getSeries.fulfilled]: (state, { payload: { status, data } }) => {
            if (status === true) {
                state.series.seriesdata = data.series
                state.series.seriesContent = data.content
                state.series.seriesId = data.series.id
                state.loading = false
                state.content.contentData = {}
                state.isSeries = true
            }
        },
        [is_content_duplicate.pending]: (state) => {
            state.loading = true
        },
        [is_content_duplicate.rejected]: (state) => {
            state.loading = false
        },
        [is_content_duplicate.fulfilled]: (state, action) => {
            state.loading = false
            state.is_duplicate = action.payload
        },
    }
})

export const { resetSeries, seriesIdandPopup, closepopup, previewpopup, closepreviewpopup, resetPage, contentTypeName, cover_image_ratio } = seriesReducer.actions
export default seriesReducer.reducer