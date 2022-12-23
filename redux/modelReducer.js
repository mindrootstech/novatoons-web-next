import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    donateModel: {
        donateFor:false,
        show: false,
        briefModel: {
            briefShow: false,
            message: null
        }
    },
    mutureModel: false,
    directDonation: {
        show: false,
        amount: null,
        user_id: null
    },
    resetSwitchbtn: false,
    verifyUserModel: false,
    redirectToHome: false,
    payoutModel: false,
    commentsModel: false,
    cancelPlan: false,
    buyContent: false,
    profilePicture: false,
    forgotPass: false,
    changePass: false,
    adminReplyModel: {
        supportMessageReply: null,
        show: false
    },
    sliderDuration: {
        show: false,
        series_id: null,
        content_id: null
    },
    reportAndDelete: {
        show: false,
        type: null,
        comment_id: null,
        is_childComment: null,
        singleComment: null,
        parentComment: null,
        myIndex:null
    },
    ratingModel: {
        show: false,
        id: null,
        type: null,
        index: null
    },
    seriesPreviewData: {
        show: false,
        data: {}
    },
    seriesContentShow: {
        show: false,
        index: null
    }
}

const modelReducer = createSlice({
    name: "models",
    initialState,
    reducers: {
        seriesContentModel: (state, action) => {
            state.seriesContentShow.show = action.payload.show
            state.seriesContentShow.index = action.payload.index
        },
        donateModelShow: (state, action) => {
            const {donateFor, show, briefShow, message} = action.payload
            state.donateModel.donateFor = donateFor
            state.donateModel.show = show
            state.donateModel.briefModel.briefShow = briefShow
            state.donateModel.briefModel.message = message
        },
        payoutModelShow: (state, action) => {
            state.payoutModel = action.payload
        }, 
        commentsModelShow: (state, action) =>{
            state.commentsModel = action.payload
        },
        cancelPlanShow: (state, action) =>{
            state.cancelPlan = action.payload
        },
        buyContentShow: (state, action) =>{
            state.buyContent = action.payload
        },
        profilePictureShow: (state, action) => {
            state.profilePicture = action.payload
        },
        forgotPassShow: (state, action) => {
            state.forgotPass = action.payload
        },
        changePassShow: (state, action) => {
            state.changePass = action.payload
        },
        adminReplyShow: (state, action) => {
            state.adminReplyModel.supportMessageReply = action.payload.supportMessageReply
            state.adminReplyModel.show = action.payload.show
        },
        ratingShow: (state, action) => {
            state.ratingModel.show = action.payload.show
            state.ratingModel.id = action.payload.id
            state.ratingModel.type = action.payload.type
            state.ratingModel.index = action.payload.index
        },
        sliderDurationShow: (state, action) => {
            state.sliderDuration.show = action.payload.show
            state.sliderDuration.series_id = action.payload.series_id
            state.sliderDuration.content_id = action.payload.content_id
        },
        reportAndDeleteShow : (state, action) => {
            state.reportAndDelete.show = action.payload.show
            state.reportAndDelete.comment_id = action.payload.comment_id
            state.reportAndDelete.type = action.payload.type
            state.reportAndDelete.singleComment = action.payload.singleComment
            state.reportAndDelete.is_childComment = action.payload.is_childComment
            state.reportAndDelete.parentComment = action.payload.parentComment
            state.reportAndDelete.myIndex = action.payload.myIndex
        },
        verifyUserShow: (state, action) => {
            state.verifyUserModel = action.payload
        },
        makeDirectDonation: (state, action) => {
            state.directDonation.show = action.payload.show
            state.directDonation.amount = action.payload.amount
            state.directDonation.user_id = action.payload.user_id
        },
        redirectToHomeModel: (state, action) => {
            state.redirectToHome = action.payload
        },
        mutureModelToggle:(state, action) => {
            state.mutureModel = action.payload
        },
        resetSwitch:(state, action) => {
            state.resetSwitchbtn = action.payload
        },
        seriesPreview: (state, action) => {
            state.seriesPreviewData.show = action.payload.show
            state.seriesPreviewData.data = action.payload.data
        }
    }
})

export const { 
    seriesContentModel,
    seriesPreview,
    resetSwitch,
    donateModelShow, 
    payoutModelShow, 
    commentsModelShow, 
    cancelPlanShow, 
    buyContentShow,
    profilePictureShow,
    forgotPassShow,
    changePassShow,
    sliderDurationShow,
    reportAndDeleteShow,
    ratingShow,
    adminReplyShow,
    verifyUserShow,
    makeDirectDonation,
    redirectToHomeModel,
    mutureModelToggle
} = modelReducer.actions

export default modelReducer.reducer