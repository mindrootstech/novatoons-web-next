import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit'
import { axiosRequest } from '../http'

const initialState = {
    isSeries: null,
    dataType: null,
    is_mine: null,
    is_available: null,
    is_already_downloaded: false,
    is_paid: false,
    is_downloadable: false,
    is_bought: false,
    is_read: null,
    price: null,
    is_rated: null,
    sub_genres: [],
    author_id: null,
    favorite: {
        is_favourited: false,
        favorite_count: null
    },
    series: {
        seriesId: null,
        seriesdata: null,
        seriesContent: [],
    },
    content: {
        contentData: {}
    },
    previewItem: {
        previewPopup: false,
        previewPopupData: {},
    },
    seriesRearrange: false,
    popup: false,
    croppopup: {
        show: false,
        file: null,
        coverfilename: null
    },
    contenttypeName: null,
    EditSeriesContent: {
        model: false,
        selectedEditContent: {}
    },
    deleteStuff: {
        modelShow: false,
        deleteContent: null,
        index: null,
        isContent: null
    },
    RestoreStuff: {
        modelShow: false,
        restoreContent: null,
        index: null,
        isContent: null
    },
    actionType: null,
    loading: false,
    err: null,
    error_message: null,
}

export const getSeries = createAsyncThunk(
    'mygetseries',
    async (dataMain, { rejectWithValue }) => {
        try {
            let response = await axiosRequest({ sub_url: '/getseries', dataMain })
            if (response.status === 200) {
                return response.data
            }
        } catch (err) {
            if (!err.response) {
                throw err
            }
            return rejectWithValue(err.response.data)
        }
    }
)

export const getContent = createAsyncThunk(
    'mygetcontent',
    async (dataMain, { rejectWithValue }) => {
        try {
            let response = await axiosRequest({ sub_url: '/getcontent', dataMain })
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


export const continueReading = createAsyncThunk(
    'continuereading',
    async (dataMain, { rejectWithValue }) => {
        try {
            let response = await axiosRequest({ sub_url: '/viewcontentpage', dataMain })
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


const editSeriesReducer = createSlice({
    name: "myseries",
    initialState,
    reducers: {
        reArrange: (state, action) => {
            state.seriesRearrange = action.payload
        },
        previewpopup: (state, action) => {
            state.previewPopup = true
            state.previewPopupData = action.payload
        },
        contentTypeName: (state, action) => {
            state.contenttypeName = action.payload.content
        },
        cropPopUp: (state, action) => {
            state.croppopup = action.payload
        },
        selectContentFile: (state, action) => {
            state.series.seriesContent = action.payload
        },
        setNewSeriesContent: (state, action) => {
            let data = [...current(state.series.seriesContent)]
            data = data.map(item => {
                if(item.static_id && item.static_id === action.payload.data.static_id) {
                    return action.payload.data
                } else if (item.id && item.id === action.payload.data.id){
                   return action.payload.data
                }
                 else {
                    return item
                }
            })
            state.series.seriesContent = data
        },
        updateNewSeriesContent: (state, action) => {
            state.series.seriesContent[action.payload.index] = {...state.series.seriesContent[action.payload.index], ...action.payload}
        },
        resetDetails: (state) => {
            state.series.seriesId = null
            state.series.seriesdata = null
            state.dataType = null
            state.series.seriesContent = []
            state.content.contentData = {}
            state.isSeries = null
            state.is_read = null
            state.is_mine = false
            state.is_bought = false
            state.is_paid = false
            state.price = null
            state.croppopup.coverfilename = null
            state.croppopup.show = false
            state.croppopup.file = null
        },
        deleteModel: (state, action) => {
            state.deleteStuff.modelShow = action.payload.showHide
            state.deleteStuff.deleteContent = action.payload.content
            state.deleteStuff.index = action.payload.index
            state.deleteStuff.isContent = action.payload.isContent
        },
        restoreModel: (state, action) => {
            state.RestoreStuff.modelShow = action.payload.modelShow
            state.RestoreStuff.restoreContent = action.payload.content
            state.RestoreStuff.index = action.payload.index
            state.RestoreStuff.isContent = action.payload.isContent
        },
        EditSeries: (state, action) => {
            state.EditSeriesContent.model = action.payload.model
            state.EditSeriesContent.selectedEditContent = action.payload.selectedEditContent
        },
        downloading: (state, action) => {
            state.is_already_downloaded = action.payload
        },
        buyAction: (state, action) => {
            state.actionType = action.payload.actionType
        },
        resetActionTextState: (state, action) => {
            state.is_already_downloaded = action.payload.is_already_downloaded
            state.is_paid = action.payload.is_paid
            state.is_downloadable = action.payload.is_downloadable
            state.is_bought = action.payload.is_bought
            state.price = null
        },
        is_favouritedSet: (state, action) => {
            state.favorite.is_favourited = action.payload.is_favourited
            state.favorite.favorite_count = action.payload.favorite_count
        },
        setRatingContent: (state, action) => {
            const { rating, type } = action.payload
            if (type === "series") {
                state.series.seriesdata.total_rating = rating
                state.is_rated = true
            } else if (type === "content") {
                state.content.contentData.total_rating = rating
                state.is_rated = true
            }
        },
       
        deleteSingleContent: (state, action) => {
            const data = [...state.series.seriesContent]
            data.splice(action.payload, 1)
            state.series.seriesContent = data
        },
        updateStatus: (state, action) => {
            if (action.payload.type === 'series') {
            state.series.seriesdata.status = action.payload.status
            } else {
            state.content.contentData.status = action.payload.status
            }        
        }
    },
    extraReducers: {
        [getSeries.pending]: (state) => {
            state.loading = true
            state.isSeries = true
        },
        [getSeries.rejected]: (state, action) => {
            state.isSeries = false
            state.loading = false
            state.err = true
            state.error_message = action.payload.message
        },
        [getSeries.fulfilled]: (state, { payload: { status, data } }) => {
            if (status === true) {
                state.series.seriesdata = data.series
                state.series.seriesId = data.series.id
                state.series.seriesContent = data.content
                state.content.contentData = {}
                state.isSeries = true
                state.dataType = data.series.content_type
                state.is_mine = data.series.is_mine
                state.is_read = data.content.length > 0 && data.content[0].is_read === 1 ?  true : false 
                state.is_bought = data.content.length > 0 ? data.content[0].is_bought === 1 ? true : false : data.series.is_bought
                state.is_paid = data.series.is_paid
                state.price = data.series.price
                state.is_available = data.content.length > 0 && data.content[0] === "1" ? true : data.content.length > 0 && data.content[0].is_available === "1" ? true : false
                state.favorite.is_favourited = data.series.is_favourited === 1 ? true : false
                state.favorite.favorite_count = data.series.favourite_count
                state.is_rated = data.series.is_rated === 0 ? false : true
                state.genre_name = data.series.genre_name
                state.sub_genres = data.series.sub_genres
                state.author_id = data.series.user_id
            }
            state.loading = false
        },
        [getContent.pending]: (state) => {
            state.loading = true
            state.isSeries = false
        },
        [getContent.rejected]: (state, action) => {
            state.isSeries = true
            state.loading = false
            state.err = true
            state.error_message = action.payload.message
        },
        [getContent.fulfilled]: (state, { payload: { status, data } }) => {
            if (status === true) {
                state.series.seriesId = null
                state.series.seriesdata = null
                state.series.seriesContent = []
                state.dataType = data.content_type
                state.is_mine = data.is_mine
                state.content.contentData = data
                state.isSeries = false
                state.is_paid = data.is_paid === 1 ? true : false
                state.price = data.price
                state.is_bought = data.is_bought === 1 ? true : data.is_paid === 0 ? true : false
                state.is_downloadable = data.is_downloadable === 1 ? true : false
                state.is_already_downloaded = data.is_already_downloaded === 1 ? true : false
                state.is_available = data.is_available === "1" ? true : false
                state.is_read = data.is_read
                state.favorite.is_favourited = data.is_favourited === 1 ? true : false
                state.favorite.favorite_count = data.favourite_count
                state.is_rated = data.is_rated === 0 ? false : true
                state.genre_name = data.genre_name
                state.sub_genres = data.sub_genres
                state.author_id = data.user_id
            }
            state.loading = false
        },
        [continueReading.pending]: (state) => {
            state.is_read = 1
        }
    }
})

export const { 
    reArrange,
    selectContentFile,
    setNewSeriesContent,
    updateNewSeriesContent,
    deleteSingleContent,
    previewpopup, 
    contentTypeName, 
    is_favouritedSet,
    updateStatus, 
    resetDetails, 
    cropPopUp, 
    deleteModel, 
    restoreModel,
    EditSeries, 
    downloading, 
    buyAction, 
    resetActionTextState, 
    setRatingContent, 
    seriesFreeToPaid } = editSeriesReducer.actions
export default editSeriesReducer.reducer