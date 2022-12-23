import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { postRequest } from '../commonApi'

const initialState = {
    credits:{
        plans:[],
        package_id: null
    },
    show: false,
    error: false,
    loading: false
}

export const Getcreditpackages = createAsyncThunk(
    'getcreditpackages',
    async (dataMain) => {
        let response = await postRequest({ sub_url: '/getcreditpackages', dataMain })
        return response
    }
)

const creditReducer = createSlice({
    name: "credit",
    initialState,
    reducers: {
        addBalancePopoup:(state, action) => {
            state.show = action.payload.showHide
        },
        selectPackage:(state, action) => {
            state.credits.package_id = action.payload
        }
    },
    extraReducers: {
        [Getcreditpackages.pending] : (state, action) => {
            state.loading = true
        },
        [Getcreditpackages.rejected] : (state, action) => {
            state.loading = false
            state.err = true
        },
        [Getcreditpackages.fulfilled] : (state, action) => {
            if(action.payload.status === true){
                state.credits.plans = action.payload.data
            }else {
                state.err = true
            }
            state.loading = false
        },
    }
})

export const { addBalancePopoup, selectPackage } = creditReducer.actions
export default creditReducer.reducer