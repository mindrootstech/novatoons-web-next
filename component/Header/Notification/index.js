import React,{useState, useEffect} from 'react'

//redux
import {
  resettypes,
  modelShow,
  page_name,
  toggleMenus,
  idupdate,
  notificationBar,
  searchBarAction
} from "../../../redux/headerReducer";
import { useSelector, useDispatch } from "react-redux";
import {
  getUser,
  resetUserData,
  getNotifications,
  appendNotifications,
  notificationStatusUpdate
} from "../../../redux/userReducer";
import {isWindow} from '../../../utils/window'
const index = () => {
  const dispatch = useDispatch()
  const [redDotActive, setRedDotActive] = useState(false)
  const { notifications } = useSelector((state) => state.userReducer);
  const headerReducer = useSelector((state) => state.headerReducer);

  useEffect(() => {
    setRedDotActive(false)
    if (notifications.data.length > 0) {
      notifications.data.map(item => {
        if (item.status === 0) {
          return setRedDotActive(true)
        }
      })
    }

  }, [notifications?.data, isWindow()])

  const handleNotificationBar = async () => {
    dispatch(notificationBar(!headerReducer.notifyBar));
    dispatch(getNotifications());

  };
  const notification = redDotActive ? 'notificationIcon has-notification' : 'notificationIcon';
  const notificationSeen = async (item, dispatch, navigate, i) => {
    try {
      const dataMain = item
      if(item.status === 0) {
        await axiosRequest({sub_url: '/notificationseen', dataMain})
      }
    
      NotificationHandler(dataMain, dispatch, navigate)


      if(notifications.length === 0) {
        dispatch(getNotifications())
       }

      dispatch(
        notificationStatusUpdate({
          index: i
        })
      )

    } catch (err) {
      console.log(err)
      return toast.warning(
        <SuccessToast message={err?.response?.data?.message} />,
        { hideProgressBar: true, autoClose: 4000 }
      );
    }
  }

  
  const displayNotification = (item, index) => {
    let notification_message;
    if (item.notification_type === 1) {
      notification_message = "Content Created successfully";
    } else if (item.notification_type === 2) {
      notification_message = "Series Created successfully";
    } else if (item.notification_type === 3) {
      notification_message = `${item.sender_name} liked your comment.`;
    } else if (item.notification_type === 4) {
      notification_message = `${item.sender_name} comment on your content.`;
    } else if (item.notification_type === 5) {
      notification_message = `${item.sender_name} liked your content.`;
    } else if (item.notification_type === 6) {
      notification_message = `${item.sender_name} liked your series.`;
    } else if (item.notification_type === 7) {
      notification_message = `${item.sender_name} reply on your comment`;
    }
    return (
        <div
          className="cursorPointer notificationList"
          onClick={() => {
            item.status === 0 ? notificationSeen(item, dispatch, navigate, index) : NotificationHandler(item, dispatch, navigate)
          }}
        >
          <div className="notificationBar">
            <div className="notification notificationLi">
              <i className="fa fa-comments" aria-hidden="true"></i>
              <p>{notification_message}</p>
              {item.status === 0 && <span className="redDot redDot2"></span>}
            </div>
          </div>
        </div>
      );
  }
// const notifications= {data: [
//     {
//         "id": 1055,
//         "receiver_id": 5,
//         "sender_id": 103,
//         "status": 0,
//         "notification_type": 5,
//         "type": 1,
//         "content_id": 121,
//         "series_id": 0,
//         "slug": "test-1671108260",
//         "comment_id": 0,
//         "created_at": "2022-12-20T03:55:57.000Z",
//         "updated_at": "2022-12-20T03:55:57.000Z",
//         "sender_name": "mern stack developer"
//     },
//     {
//         "id": 1054,
//         "receiver_id": 5,
//         "sender_id": 103,
//         "status": 1,
//         "notification_type": 5,
//         "type": 1,
//         "content_id": 121,
//         "series_id": 0,
//         "slug": "test-1671108260",
//         "comment_id": 0,
//         "created_at": "2022-12-20T03:45:37.000Z",
//         "updated_at": "2022-12-20T03:45:37.000Z",
//         "sender_name": "mern stack developer"
//     },
//     {
//         "id": 1046,
//         "receiver_id": 5,
//         "sender_id": 23,
//         "status": 1,
//         "notification_type": 3,
//         "type": 1,
//         "content_id": 85,
//         "series_id": 0,
//         "slug": "comic-1-1669286869",
//         "comment_id": 573,
//         "created_at": "2022-12-16T05:39:59.000Z",
//         "updated_at": "2022-12-16T05:39:59.000Z",
//         "sender_name": "Brock Wayne"
//     },
//     {
//         "id": 1042,
//         "receiver_id": 5,
//         "sender_id": 23,
//         "status": 1,
//         "notification_type": 4,
//         "type": 1,
//         "content_id": 85,
//         "series_id": 0,
//         "slug": "comic-1-1669286869",
//         "comment_id": 572,
//         "created_at": "2022-12-16T05:39:01.000Z",
//         "updated_at": "2022-12-16T05:39:01.000Z",
//         "sender_name": "Brock Wayne"
//     },
// ]}
  return (
    <div
    onClick={handleNotificationBar}
    className="notification_user cursorPointer"
  >
    <div className={notification}>
      <i className="fa fa-bell"></i>
      {redDotActive ? <span className="redDot first"></span> : ''}
    </div>
    {headerReducer.notifyBar &&
      (notifications.loading &&
        notifications.data.length === 0 ? (
        <div className="notificationBg">
          <div className="notificationBarMain">
            <p>Loading...</p>
          </div>
        </div>
      ) : notifications.data.length > 0 ? (
        <div className="notificationBg">
          <div className="notificationBarMain">
            {notifications.data.map((n, index) =>
              displayNotification(n, index)
            )}
          </div>
        </div>
      ) : (
        <div className="notificationBg">
          <div className="notificationBarMain">
            <h6>No Notifications Yet</h6>
          </div>
        </div>
      ))}
  </div>
  )
}

export default index