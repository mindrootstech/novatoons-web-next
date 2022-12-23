import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    content_type: null,
    type: null,
    steps:0,
    loading: false,
    pageName: null,
    toggleMenu: false,
    showModel: false,
    id:null,
    notifyBar:false,
    searchBar: false
}


const authReducer = createSlice({
    name: "content",
    initialState,
    reducers: {
        resettypes: (state, action) => {
            state.content_type = null
            state.type = null
            state.steps = 0
        },
        modelShow: (state, action) => {
            state.showModel = action.payload
        },
        uploadContent: (state, action) => {
            const {content_type, type, steps} = action.payload
            state.content_type = content_type
            state.type = type
            state.steps = steps
        },
        page_name: (state, action) => {
            state.pageName = action.payload
        },
        toggleMenus: (state, action) => {
            state.toggleMenu = action.payload
        },
        idupdate: (state, action) => {
            state.id = action.payload
        },
        notificationBar: (state, action) => {
            state.notifyBar = action.payload
        },
        searchBarAction: (state, action) => {
            state.searchBar = action.payload
        }

    }
})

export const { resettypes, uploadContent, page_name, toggleMenus, modelShow, idupdate, notificationBar, searchBarAction} = authReducer.actions
export default authReducer.reducer