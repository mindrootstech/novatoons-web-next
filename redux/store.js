import { configureStore } from '@reduxjs/toolkit'
import headerReducer from './headerReducer'
import tagReducer from './tagReducer'
import seriesReducer from './ContentSeriesReducer'
import userReducer from './userReducer'
import creditReducer from './creditReducer'
import editSeriesReducer from './editContentSeriesReducer'
import commonReducer from './commonReducer'
import homeReducer from './homeReducer'
import pdfReducer from './pdfReducer'
import commentReducer from './commentsReducer';
import allDataReducer from './allDataReducer'
import payoutReducer from './payoutReducer'
import authorReducer from './authorReducer'
import modelReducer from './modelReducer'
import forumReducer from './forumReducer'
import newseriesReducer from './seriesReducer'

export const store = configureStore({
  reducer: {
    headerReducer,
    homeReducer,
    newseriesReducer,
    forumReducer,
    tagReducer,
    seriesReducer,
    userReducer,
    creditReducer,
    editSeriesReducer,
    commonReducer,
    pdfReducer,
    allDataReducer,
    commentReducer,
    payoutReducer,
    authorReducer,
    modelReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false})
})