import {getSingleComment} from '../redux/commentsReducer'
import { commentsModelShow } from '../redux/modelReducer'


export const NotificationHandler = (item, dispatch, navigate) => {
    if(item.notification_type === 1) {  
        navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/content/detail/${item.slug}`)
    } else if(item.notification_type === 2) {
        navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/series/detail/${item.slug}`)
    } else if(item.notification_type === 3) {
        navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/content/view/${item.slug}`)
        if(item.comment_id && item.content_id) {
            return dispatch(
                getSingleComment({
                    comment_id: item.comment_id,
                    content_id: item.content_id
                })
            )
        }

    } else if(item.notification_type === 4) {
        if(!item.notification_type.notfication_content_type) {

            navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/content/view/${item.slug}`)
            return dispatch(
                getSingleComment({
                    comment_id: item.comment_id,
                    content_id: item.content_id
                })
            )
        } else {

            navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/content/view/${item.slug}`)
            return dispatch(
                getSingleComment({
                    comment_id: item.comment_id,
                    content_id: item.content_id
                })
            )
        }
    } else if(item.notification_type === 5) {

        navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/content/detail/${item.slug}`)

    } else if(item.notification_type === 6) {

        navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/series/detail/${item.slug}`)
    } else if(item.notification_type === 7) {
        navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/content/view/${item.slug}`)
        return dispatch(
            getSingleComment({
                comment_id: item.comment_id,
                content_id: item.content_id
            })
        )
    }

}