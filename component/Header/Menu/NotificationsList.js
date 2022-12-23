import React from 'react'

const NotificationsList = ({item, index}) => {
    
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
        onClick={() => notificationSeen(item, dispatch, navigate, index)}
        >
        <div className="notificationBar">
            <div className="notification notificationLi">  
            <i className="fa fa-comments" aria-hidden="true"></i>
            <p>{notification_message}</p>
            {item.status === 0 && <span className="redDot"></span>}
            </div>
        </div>
        </div>
    );
}

export default NotificationsList