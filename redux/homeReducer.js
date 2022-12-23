import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postRequest } from "../commonApi";
import { axiosRequest } from "../http";

const initialState = {
  feature_content: [],
  like_content: {
    data: [],
    load_more: false,
  },
  top_creators: [],
  loading: false,
  err: false,
  err_message: null,
};

export const getHomeData = createAsyncThunk("gethomedata", async (dataMain) => {
  let response = await postRequest({ sub_url: "/home", dataMain });
  return response;
});


export const getYoumaylikeData = createAsyncThunk(
  "getyoumaylikeData",
  async (dataMain, { rejectWithValue }) => {
    try {
        let response = await axiosRequest({ sub_url: "/youmaylike", dataMain });
        return { response: response.data, dataMain };
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
);

const homeReducer = createSlice({
  name: "home",
  initialState,
  reducers: {},
  extraReducers: {
    [getHomeData.pending]: (state, action) => {
      state.loading = true;
    },
    [getHomeData.rejected]: (state, action) => {
      state.loading = false;
      state.err_message = action.payload.message;
    },
    [getHomeData.fulfilled]: (state, action) => {
      if (action.payload.status === true) {
        state.feature_content = action.payload.featured_content;
        state.top_creators = action.payload.top_creators;
      } else {
        state.err = true;
        state.err_message = action.payload.message;
      }
      state.loading = false;
    },
    [getYoumaylikeData.pending]: (state) => {
      state.loading = true;
    },
    [getYoumaylikeData.rejected]: (state, action) => {
      state.loading = false;
      state.err_message = action.payload.message;
    },
    [getYoumaylikeData.fulfilled]: (state, action) => {
        state.like_content.data = action.payload.dataMain.page === 1 ? action.payload.response.data : [...state.like_content.data, ...action.payload.response.data];
        state.like_content.load_more = action.payload.response.load_more;
        state.loading = false;
    },
  },
});

export default homeReducer.reducer;
