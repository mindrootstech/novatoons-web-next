import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {axiosRequest} from '../http'

const initialState = {
    getpdfData: [],
    scrolled: 1,
    selectedContent: {},
    highlightedText: [],
    count: null,
    pdfState: false,
    slider: {
        image_id: 1,
        direction: "next"
    },
    mode: { pdf: "vertical", highlighter: "Horizontal" },
    bookmark: {},
    comic: { image_id: null },
    imageLoading : false,
    err: false,
    error_message: null,
    statusCode: null, 
    loading: false,
    load_more: false,
}

export const getpdfImages = createAsyncThunk(
    'getpdfimages',
    async (dataMain, { rejectWithValue }) => {
        dataMain.isPaginate = 0
        try {
            let response = await axiosRequest({ sub_url: '/fileimages', dataMain })
            if (response.status === 200) {
                return { response: response.data, selectedContent: dataMain.selectedContent, page: dataMain.page, scrollDirection: dataMain.scrollDirection }
            }
        } catch (err) {
            if(err.response.status === 401) {
                return rejectWithValue(err.response)
            }
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

const pdfReducer = createSlice({
    name: "PDFIMAGES",
    initialState,
    reducers: {
        resetpdf: (state) => {
            state.getpdfData = []
            state.count = null
            state.loading = false
            state.load_more = false
            state.selectedContent = {}
            state.err = false
            state.error_message = null
            state.statusCode = null
        },
        resetImageID:(state) =>{
            state.comic.image_id = 1
        },
        changeMode: (state, action) => {
            if (action.payload.pdf) {
                state.mode.pdf = action.payload.pdf
                return;
            }
            state.mode.highlighter = action.payload.highlighter
        },
        changeBookmark: (state, action) => {
            state.bookmark = action.payload
        },
        comicImageId: (state, action) => {
            state.comic.image_id = action.payload.image_id
        },
        sliderLoadMoreImage: (state, action) => {
            state.slider.image_id = action.payload.img_id
        },
        sliderDirection: (state, action) => {
            state.slider.direction = action.payload.direction
        },
        resetErr: (state) => {
            state.err = false
            state.statusCode = null
            state.error_message = null
        },
        imageLoadingAction : (state, action) => {
            state.imageLoading = action.payload
        },
        scrolledPdf: (state, action) => {
            state.scrolled = action.payload
        }
    },
    extraReducers: {
        [getpdfImages.pending]: (state) => {
            state.loading = true
        },
        [getpdfImages.rejected]: (state, action) => {
            state.loading = false
            state.err = true
            state.statusCode = action.payload.statusText === "Unauthorized" ? 401 : 400
            state.error_message = action.payload.statusText === "Unauthorized" ?  action.payload.data.message : action.payload.message
        },
        [getpdfImages.fulfilled]: (state, action) => {
            if (action.payload.response.status === true) {
                state.selectedContent = action.payload.selectedContent
                if (action.payload.scrollDirection === undefined) {
                    state.getpdfData = action.payload.page === 1 ? action.payload.response.data : [...state.getpdfData, ...action.payload.response.data]
                } else if (action.payload.scrollDirection === 'up') {
                    state.getpdfData = [...action.payload.response.data, ...state.getpdfData]
                } else if (action.payload.scrollDirection === 'down') {
                    state.getpdfData = action.payload.page === 1 ? action.payload.response.data : [...state.getpdfData, ...action.payload.response.data]
                }
                state.scrolled = action.payload.response.scrolled
                state.load_more = action.payload.response.load_more
                state.count = action.payload.response.total_images
                state.highlightedText = action.payload.response.highlight
                state.bookmark = action.payload.response?.bookmarks
            } else {
                state.pdfState = "Processing"
            }
            state.loading = false
        }
    }
})
export const { resetpdf, imageLoadingAction, changeMode, changeBookmark, comicImageId, resetImageID, sliderLoadMoreImage, sliderDirection, resetErr, scrolledPdf } = pdfReducer.actions
export default pdfReducer.reducer