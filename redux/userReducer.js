import {
    createSlice,
    createAsyncThunk,
    current
} from '@reduxjs/toolkit'
import {
    axiosRequest
} from '../http'

const initialState = {
    loading: false,
    userData: {},
    uploadedData: [],
    library: {
        data: [],
        load_more: false,
        activeTab: null,
        loading: false
    },
    notifications: {
        data: [],
        ref: null, // 0 for content, 1 for series
        loading: false
    },
    transaction: {
        load_more: false,
        data: [],
        filter: {
            type: "",
            sortby: "",
            page: 1,
        }
    },
    revenueTransaction: {
        load_more: false,
        data: [],
        filter: {
            type: "",
            sortby: "",
            page: 1,
        }
    },
    filter_show: false,
    sortbyShow: false,
    selectedPromtion: {
        show: false,
        id: null,
        price: null,
        content_id: null
    },
    payoutTransaction: {
        data: [],
        load_more: false,
    },
    favoritesList: {
        data: [],
        load_more: false,
        favoriteLoading: false
    },
    recaptchaV3: false,
    load_more: false,
    error: false,
    error_message: "",
    popup: false,
}

// verifyUser
export const verifyUser = createAsyncThunk(
    'verifyuser',
    async (dataMain, { rejectWithValue }) => {
        try {
            let response = await axiosRequest({sub_url: '/verifytoken', dataMain })
            if (response.status === 200) {
                // localStorage.clear()
                // sessionStorage.clear()
                return response.data
            }
            if(response.status === false){
                localStorage.clear()
                sessionStorage.clear()
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

export const getUser = createAsyncThunk(
    'getuser',
    async (dataMain, { rejectWithValue }) => {
        try {
            let response = await axiosRequest({ sub_url: '/getuser', dataMain })
            if (response.status === 200) {
                if(localStorage.getItem('userData')) {
                    localStorage.setItem('userData', JSON.stringify(response.data.data))
                } else {
                    sessionStorage.setItem('userData', JSON.stringify(response.data.data))
                }
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

export const updateProfileImage = createAsyncThunk(
    'updateProfile',
    async (dataMain, { rejectWithValue }) => {
        try {
            let response = await axiosRequest({ sub_url: '/updateprofileimg', dataMain })

            if (response.status === 200) {
                if (localStorage.getItem('token')) {
                    localStorage.setItem('userData', JSON.stringify(response.data.body.profile))
                } else {
                    sessionStorage.setItem('userData', JSON.stringify(response.data.body.profile))
                }
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

export const myUploadsData = createAsyncThunk(
    'useruploads',
    async (dataMain, {
        rejectWithValue
    }) => {
        try {
            let response = await axiosRequest({
                sub_url: '/myuploads',
                dataMain
            })
            if (response.status === 200) {
                return {
                    response: response.data,
                    load_more_item: dataMain.LoadMore
                }
            }
        } catch (err) {
            if (!err.response) {
                throw err
            }
            return rejectWithValue(err.response.data)
        }
    }
)

export const getUserTransation = createAsyncThunk(
    'getallTransaction',
    async (dataMain, { rejectWithValue }) => {
        try {
            let response = await axiosRequest({ sub_url: '/myTransactions', dataMain })
            if (response.status === 200) {
                return {response: response.data, dataMain}
            }
        } catch (err) {
            if (!err.response) {
                throw err
            }
            return rejectWithValue(err.response.data)
        }
    }
)

export const getRevenueTransation = createAsyncThunk(
    'getRevenueTransaction',
    async (dataMain, { rejectWithValue }) => {
        try {
            let response = await axiosRequest({
                sub_url: '/myrevenuetransactions',
                dataMain
            })
            return {response: response.data, dataMain}
            
        } catch (err) {
            if (!err.response) {
                throw err
            }
            return rejectWithValue(err.response.data)
        }
    }
)

export const getPayoutTransaction = createAsyncThunk(
    'getpayouttrans',
    async (dataMain, {
        rejectWithValue
    }) => {
        try {
            let response = await axiosRequest({
                sub_url: '/getpayouttrans',
                dataMain
            })
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

export const getFavoriteList = createAsyncThunk(
    'getfavoriteslist',
    async (dataMain, {
        rejectWithValue
    }) => {
        try {
            let response = await axiosRequest({
                sub_url: '/myfavouriteposts',
                dataMain
            })
            if (response.status === 200) {
                return {
                    response: response.data,
                    dataMain
                }
            }
        } catch (err) {
            if (!err.response) {
                throw err
            }
            return rejectWithValue(err.response.data)
        }
    }
)

export const getLibrary = createAsyncThunk('getLibraryList',
    async (dataMain, { rejectWithValue }) => {
        try {
            if (dataMain.tab === 'Most Recent') {
                let response = await axiosRequest({ sub_url: '/recentContent', dataMain })
                if (response.status === 200) {
                    return {
                        response: response.data,
                        dataMain
                    }
                }
            } else if (dataMain.tab === 'Downloaded' || dataMain.tab === 'Purchased') {
                let response = await axiosRequest({
                    sub_url: '/mydownloads',
                    dataMain
                })
                if (response.status === 200) {
                    return {
                        response: response.data,
                        dataMain
                    }
                }
            }
        } catch (err) {
            if (!err.response) {
                throw err
            }
            return rejectWithValue(err.response.data)
        }
    }
)

export const getNotifications = createAsyncThunk(
    'getusernotfications',
    async (dataMain, { rejectWithValue }) => {
        try {
        const response = await axiosRequest({sub_url: '/getnotification', dataMain})
        return {response: response.data}
        } catch (err) {
            if (!err.response) {
                throw err
            }
            return rejectWithValue(err.response)
        }
    }
)


const userReducer = createSlice({
    name: "user",
    initialState,
    reducers: {
        appendNotifications: (state, action) => {
            state.notifications.data.unshift(action.payload)
        },
        myUploadsDataReset: (state) => {
            state.uploadedData = []
        },
        verifyCaptcha: (state, action) => {
            state.recaptchaV3 = action.payload
        },
        resetUserData: (state) => {
            state.userData = {}
        },
        openpopup: (state) => {
            state.popup = true
        },
        resetError: (state, action) => {
            state.error = false
            state.error_message = ""
        },
        resetUserBalance: (state , action) => {
         state.userData.total_amount = action.payload.total_amount
         state.userData.total_credits = action.payload.total_credits


        },
        closepopup: (state) => {
            state.popup = false
        },
        setTransactionSortby: (state, action) => {
            state.transaction.filter.sortby = action.payload.sortby
        },
        setTransactionFilter: (state, action) => {
            state.transaction.filter.type = action.payload.type
        },
        setTransactionPage: (state, action) => {
            state.transaction.filter.page = action.payload.page
        },
        setTransactionFiltersShow: (state, action) => {
            state.filter_show = action.payload
        },
        setTransactionSort_Show: (state, action) => {
            state.sortbyShow = action.payload
        },
        setRevenueTransactionFilter: (state, action) => {
            state.revenueTransaction.filter.type = action.payload.type
        },
        setRevenueTransactionPage: (state, action) => {
            state.revenueTransaction.filter.page = action.payload.page
        },
        setRevenueTransactionFiltersShow: (state, action) => {
            state.filter_show = action.payload
        },
        setRevenueTransactionSort_Show: (state, action) => {
            state.sortbyShow = action.payload
        },
        resetTransaction: (state) => {
            state.transaction.load_more = false
            state.transaction.data = []
        },
        resetFilterTransaction : (state) => {
            state.transaction.filter.page = 1
            state.transaction.filter.sortby = ""
            state.transaction.filter.type = ""
        },
        resetRevenueTransaction:(state) => {
            state.revenueTransaction.load_more = false
            state.revenueTransaction.data = []
            state.revenueTransaction.filter.page = 1
            state.revenueTransaction.filter.sortby = ""
            state.revenueTransaction.filter.type = ""
        },
        selectPromotion_id: (state, action) => {
            state.selectedPromtion.id = action.payload.selected
            state.selectedPromtion.show = action.payload.show
            state.selectedPromtion.content_id = action.payload.content_id
            state.selectedPromtion.price = action.payload.price
        },
        setUserData: (state, action) => {
            state.userData = action.payload
        },
        setRating: (state, action) => {
            state.library.data[action.payload.index].total_ratings = action.payload.rating
        },
        setSupportMessageStatus: (state, action) => {
            state.userData.support_message = action.payload
        },
        notificationStatusUpdate: (state, action) => {
          if (state.notifications.data[action.payload.index]) {
            state.notifications.data[action.payload.index].status = 1
          } 
        },
        setNotifications:  (state, action) => {
            state.notifications.data.push(action.payload.data) 
        },
    },
    extraReducers: {
        [verifyUser.pending]: (state) => {
            state.loading = true
        },
        [verifyUser.rejected]: (state, action) => {
            state.error = true
            state.error_message = action.payload.message
            state.loading = false
        },
        [verifyUser.fulfilled]: (state, action) => {
            const status = action.payload.status
            const message = action.payload.message

            if (status === true) {
                state.loading = false
                state.userData.newverify = true
                state.userData.message = message
                state.userData.is_verified = "1"
            }
        },
        [getUser.pending]: (state) => {
            state.loading = true
        },
        [getUser.rejected]: (state, action) => {
            state.error = true
            state.error_message = action.payload.message
            state.loading = false
        },
        [getUser.fulfilled]: (state, { payload: { status, data } }) => {
            if (status === true) {
                state.userData = data
                state.loading = false
            }
        },
        //upload user profile image 
        [updateProfileImage.pending]: (state) => {
            state.loading = true
        },
        [updateProfileImage.rejected]: (state, action) => {
            state.error = true
            state.loading = false
        },
        [updateProfileImage.fulfilled]: (state, action) => {
            state.loading = false
            state.userData = action.payload.body.profile
        },

        //user uploaded data
        [myUploadsData.pending]: (state) => {
            state.loading = true
        },
        [myUploadsData.rejected]: (state, action) => {
            state.error = true
            state.error_message = action.payload.message
            state.loading = false
        },
        [myUploadsData.fulfilled]: (state, action) => {
            state.loading = false
            state.load_more = action.payload.response.load_more
            state.uploadedData = [...state.uploadedData, ...action.payload.response.data]
        },

        //transaction data
        [getUserTransation.pending]: (state) => {
            state.loading = true
        },
        [getUserTransation.rejected]: (state, action) => {
            state.error = true
            state.error_message = action.payload.message
            state.loading = false
        },
        [getUserTransation.fulfilled]: (state, action) => {
            state.transaction.load_more = action.payload.response.load_more
            state.transaction.data = action.payload.dataMain.page === 1 ? action.payload.response.data : [...state.transaction.data, ...action.payload.response.data]
            state.loading = false
        },
        //payouts
        [getPayoutTransaction.pending]: (state) => {
            state.loading = true
        },
        [getPayoutTransaction.rejected]: (state, action) => {
            state.error = true
            state.error_message = action.payload.message
            state.loading = false
        },
        [getPayoutTransaction.fulfilled]: (state, action) => {
            if (action.payload.status === true) {
                state.payoutTransaction.data = action.payload.data
            }
            state.loading = false
        },
        //user favorites list
        [getFavoriteList.pending]: (state) => {
            state.favoriteLoading = true
        },
        [getFavoriteList.rejected]: (state, action) => {
            state.error = true
            state.error_message = action.payload.message
            state.favoriteLoading = false
        },
        [getFavoriteList.fulfilled]: (state, action) => {
            if (action.payload.response.status === true) {
                state.favoritesList.data = action.payload.dataMain.page === 1 ? action.payload.response.data : [...state.favoritesList.data, ...action.payload.response.data]
                state.favoritesList.load_more = action.payload.response.load_more
            } else {
                state.error = true
                state.error_message = action.payload.response.message
            }
            state.favoriteLoading = false
        },

        //user getLibrary list
        [getLibrary.pending]: (state) => {
            state.library.loading = true
        },
        [getLibrary.rejected]: (state, action) => {
            state.error = true
            state.error_message = action.payload.message
            state.library.loading = false
        },
        [getLibrary.fulfilled]: (state, action) => {
            if (action.payload.response.status === true) {
                state.library.data = action.payload.dataMain.page === 1 ? action.payload.response.data : [...state.library.data, ...action.payload.response.data]
                state.library.load_more = action.payload.response.load_more
                state.library.activeTab = action.payload.dataMain.tab
            } else {
                state.error = true
                state.error_message = action.payload.response.message
                state.library.activeTab = action.payload.dataMain.tab
            }
            state.library.loading = false
        },
        //revenue transaction data
        [getRevenueTransation.pending]: (state) => {
            state.loading = true
        },
        [getRevenueTransation.rejected]: (state, action) => {
            state.error = true
            state.error_message = action.payload.message
            state.loading = false
        },
        [getRevenueTransation.fulfilled]: (state, action) => {
            const {response, dataMain} = action.payload
            state.revenueTransaction.load_more = response.load_more
            state.revenueTransaction.data = dataMain.page === 1 ? response.data : [...state.revenueTransaction.data, ...response.data]
            state.loading = false 
        },
        [getNotifications.pending]: (state) => {
            state.notifications.loading = true
            state.notifications.data = []
        },
        [getNotifications.rejected]: (state, action) => {
            state.error = true
            state.error_message = action.payload.status === 404 ? "Not Notifications yet" : action.payload.data.message
            state.notifications.loading = false
        },
        [getNotifications.fulfilled]: (state, action) => {
            const {response} = action.payload
            state.notifications.data = response.data
            state.notifications.loading = false
            state.notifications.ref = response.data.content_id !== 0 ? 0 : 1
        }
        
    }
})

export const {
    notificationStatusUpdate,
    appendNotifications,
    updateMature,
    resetError,
    myUploadsDataReset,
    verifyCaptcha,
    setUserData,
    resetUserData,
    openpopup,
    closepopup,
    resetTransaction,
    resetFilterTransaction,
    selectPromotion_id,
    setRating,
    setTransactionPage,
    resetUserBalance,
    setTransactionSortby,
    setNotifications,
    setTransactionFilter,
    setTransactionSort_Show,
    setTransactionFiltersShow,
    setRevenueTransactionFilter,
    setRevenueTransactionPage,
    setRevenueTransactionFiltersShow,
    setRevenueTransactionSort_Show,
    resetRevenueTransaction,
    setSupportMessageStatus
} = userReducer.actions
export default userReducer.reducer