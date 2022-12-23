import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { postRequest } from "../commonApi";
import { axiosRequest } from '../http';

const initialState = {
    plans: [],
    cards: [],
    already_bought: null,
    processing: false,
    seletedPlan: {}, 
    toggleForm: {
        reset: null,
        card_id: null
    },
    loading: true,
    err: false,
    error_message: null
}

export const planData = createAsyncThunk(
    'getplandata',
    async (dataMain, { rejectWithValue }) => {
        try {
            let response = await postRequest({ sub_url: '/getplans', dataMain })
            return response
        } catch (err) {
            if (!err.response) {
                throw err
            }
            return rejectWithValue(err.response.data)
        }
    }
)
export const cardData = createAsyncThunk(
    'getcarddata',
    async (dataMain, { rejectWithValue }) => {
        try {
            let response = await axiosRequest({ sub_url: '/getusercards', dataMain })
            if (response.status === 200) {
                return response
            }
        } catch (err) {
            if (!err.response) {
                throw err
            }
            return rejectWithValue(err.response.data)
        }
    }
)


const payoutReducer = createSlice({
    name: "payout",
    initialState,
    reducers: {
        selectingPlan: (state, action) => {
            state.seletedPlan = action.payload.selectPlan
        },
        purchagePlan: (state, action) => {
            state.processing = action.payload
        },
        selectForm: (state, action) => {
            state.toggleForm.reset = "card"
            state.toggleForm.card_id = action.payload.id
        },           
        selectingCard: (state, action) => {
            state.toggleForm.reset = "form"
            state.toggleForm.card_id = action.payload.id
        }
    },
    extraReducers: {
        [planData.pending]: (state) => {
            state.loading = true
        },
        [planData.rejected]: (state, action) => {
            state.loading = false
            state.err = true
            state.error_message = action.payload.message
        },
        [planData.fulfilled]: (state, action) => {
            state.plans = action.payload.data
            state.already_bought = action.payload.already_bought
            state.loading = false
        },
        [cardData.pending]: (state) => {
            state.loading = true
        },
        [cardData.rejected]: (state, action) => {
            state.loading = false
            state.err = true
            state.error_message = action.payload.message
        },
        [cardData.fulfilled]: (state, action) => {
            state.cards = action.payload.data.data
            state.toggleForm.card_id = action.payload.data.data.length > 0 ? action.payload.data.data[0].card_id : null
            state.toggleForm.reset = action.payload.data.data.length > 0 ? "form" : null
            state.loading = false
        }
    }
})

export const { selectingPlan, purchagePlan, selectForm, selectingCard } = payoutReducer.actions
export default payoutReducer.reducer