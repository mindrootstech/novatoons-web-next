import {
    filterGenre,
    filterPage,
    filterContent_type,
    filterIs_mature,
    filterIs_paid,
    filterSortby
} from '../redux/allDataReducer'


export const filteration = (dispatch, data) => {
    const { filterType, filterKey, append } = data
    if (filterType === "genre" && append) {
        dispatch(
            filterGenre({
                genre_id: `${filterKey}`,
                append
            })
        )
    } else if (filterType === "genre" && !append) {
        dispatch(
            filterGenre({
                genre_id: `${filterKey}`,
                append
            })
        )
    } else if (filterType === "Free/Paid" && append) {
        dispatch(
            filterIs_paid({
                is_paid: `${filterKey}`,
                append
            })
        )
    } else if (filterType === "Free/Paid" && !append) {
        dispatch(
            filterIs_paid({
                is_paid: `${filterKey}`,
                append
            })
        )
    } else if (filterType === "Audience" && append) {
        dispatch(
            filterIs_mature({
                is_mature: `${filterKey}`,
                append
            })
        )
    } else if (filterType === "Audience" && !append) {
        dispatch(
            filterIs_mature({
                is_mature: `${filterKey}`,
                append
            })
        )
    } else if (filterType === "Content Type" && append) {
        dispatch(
            filterContent_type({
                content_type : filterKey,
                append
            })
        )
    } else if (filterType === "Content Type" && !append) {
        dispatch(
            filterContent_type({
                content_type : filterKey,
                append
            })
        )
    }
}