import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    series: {
        coverData: {
            title: ""
        },
        newSeriesContent: []
    },
    loading: false,
    error: false,
    error_message: null
}


const seriesReducer = createSlice({
    name: "SERIESCREATE",
    initialState,
    reducers: {
        // selectContentFile: (state, action) => {
        //     state.series.newSeriesContent = action.payload
        // },
        // setNewSeriesContent: (state, action) => {
        //     state.series.newSeriesContent[action.payload.index] = action.payload.data
        // }
    }
})

// export const { selectContentFile, setNewSeriesContent } = seriesReducer.actions
export default seriesReducer.reducer