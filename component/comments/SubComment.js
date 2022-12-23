import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import img1 from '../../../../assets/images/avatar/profileimage.png'
import timeAgoConverter from '../../../../helpers/TimeAgoConverter';
import { openActionMenu, likeComment, likeCounter, actionClose } from '../../../../redux/commentsReducer';
import actionImg from '../../../../assets/images/icon/actionImg.png'
import { postRequest } from '../../../../commonApi';

import { reportAndDeleteShow } from '../../../../redux/modelReducer'

//third-party
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom';

function SuccessToast({ message }) {
    return (
        <Fragment>
            <div className='toastify-header'>
                <div className='title-wrapper'>
                    <h6 className='toast-title'>{message}</h6>
                </div>
            </div>
        </Fragment>
    )
}


const SubComment = ({ sub_item, index, parentIndex, socket }) => {

    const dispatch = useDispatch();
    const params = useParams()
    const [receiverID, setReceiverID] = useState(null)
    const { data, selectedComment,singleComment , lastLikedComment } = useSelector(state => state.commentReducer)
    const {content} = useSelector(state => state.editSeriesReducer)
    const { userData } = useSelector(state => state.userReducer)

    const commentData = singleComment.comment
       let increment ;
       
        if(singleComment.show === true){
            increment = parseInt(commentData.reply[index].is_liked) === 1 ? false : true
        } else {
            increment = parseInt(data[parentIndex].reply[index].is_liked) === 1 ? false : true
        }

    
    // Like comment
    const likeCommentFn = async (item,index) => {
        

        if (Object.keys(userData).length === 0) {
            return toast.success(<SuccessToast message='Please login first' />, { hideProgressBar: true,  autoClose:  8000, })
        }
        if (userData.is_verified === 0  || userData.is_verified === "0") {
            return toast.success(<SuccessToast message='Verify your email to use this feature' />, { hideProgressBar: true,  autoClose:  8000, })
        }
        dispatch(
            likeCounter({
                comment_id: item.id,
                index,
                increment: increment,
                parentIndex,
                content_id: params.type === "content" ? content.contentData.id : params.id,
                singleComment: singleComment.show === true ? '1' : '0',
                is_child: true
            })
        )
        // dispatch(
        //     likeComment({
        //         comment_id: item.id,
        //         index: item.id === sub_item.id ? index : '',
        //         increment: increment,
        //         slug:params.slug,
        //         parentIndex,
        //         content_id: params.type === "content" ? content.contentData.id : params.id,
        //         is_child: true,
        //         comment_parent_id: item.comment_parent_id

        //     })
        // )

        try {
            const dataMain ={
                        comment_id: item.id,
                        index: item.id === sub_item.id ? index : '',
                        increment: increment,
                        slug:params.slug,
                        parentIndex,
                        content_id: params.type === "content" ? content.contentData.id : params.id,
                        is_child: true,
                        comment_parent_id: item.comment_parent_id
                    }
            const response = await postRequest({ sub_url: '/likecomment', dataMain })
             if (response.status === true) {
                if((userData.id !== item.user_id) && (increment === true)) { 
                    if(socket) {
                    socket?.emit("sendNotification", 
                        JSON.stringify({
                            sender_name: userData?.user_name !== "" ? userData?.user_name : `${userData.first_name} ${userData.last_name}`,
                            receiver_id: item.user_id,
                            content_id: item.content_id,
                            slug: params.slug,
                            notification_type: 3,
                            comment_id: item.id, 
                            sender_id: userData.id,
                            comment_parent_id: item.comment_parent_id
                        })
                    )
                }
            }   
            }

        } catch {

        }
       
    }

    // Toggle sub comment actionBox
    const SubCommentAction = (item) => {
        if (selectedComment.comment.id && selectedComment.comment.id !== item.id) {
            return dispatch(
                openActionMenu({
                    action_open: true,
                    comment: item,
                    is_child: item.comment_parent_id === 0 ? false : true
                })
            )
        }
        if (!selectedComment.comment.id) {
            return dispatch(
                openActionMenu({
                    action_open: true,
                    comment: item,
                    is_child: item.comment_parent_id === 0 ? false : true
                })
            )
        }
        dispatch(
            openActionMenu({
                action_open: false,
                comment: {},
                is_child: null
            })
        )
    }


    const reportCommentHandle = (item) => {
        if (Object.keys(userData).length === 0) {
            return toast.success(<SuccessToast message='Please login first' />, { hideProgressBar: true,  autoClose:  8000, })
        }
        if (userData.is_verified === 0 || userData.is_verified === "0") {
            return toast.success(<SuccessToast message='Verify your email to use this feature' />, { hideProgressBar: true,  autoClose:  8000, })
        }
        dispatch(
            reportAndDeleteShow({
                show: true,
                comment_id: item.id,
                singleComment: singleComment.show === true ? '1' : '0',
                type: "report"
            })
        )
        dispatch(actionClose())

    }


    const handledeleteSubComment = (item) => {
        if (Object.keys(userData).length === 0) {
            return toast.success(<SuccessToast message='Please login first' />, { hideProgressBar: true,  autoClose:  8000, })
        }
        if (userData.is_verified === 0 || userData.is_verified === "0") {
            return toast.success(<SuccessToast message='Verify your email to use this feature' />, { hideProgressBar: true,  autoClose:  8000, })
        }
        dispatch(
            reportAndDeleteShow({
                show: true,
                comment_id: item.id,
                type: "delete",
                is_childComment: true,
                singleComment: singleComment.show === true ? '1' : '0',
                parentComment: parentIndex,
                myIndex: index
            })
        )
        dispatch(actionClose())

    }


    return (
        <>
            <div className='reply sub_comment'>
                <div className="imgSide">
                    <img
                        src={(sub_item.is_mine === 1 && userData.profile_img === "") ? img1 : (sub_item.is_mine === 1 && userData.profile_img !== "") ? userData.profile_img : (sub_item.is_mine === 0 && sub_item.profile_img !== "") ? sub_item.profile_img : img1}
                        alt='user' />
                </div>
                <div className='details'>
                    <div className='meta-item'>
                        <div className='user_details subNameSec'>

                            <span className="subCommentorName">
                                {(sub_item.is_creator === 1 && sub_item.user_name !== "") ? `${sub_item.user_name}` : `${sub_item.first_name} ${sub_item.last_name}`}
                            </span>

                            <span className="edit_comment">

                                <span>
                                    {timeAgoConverter(sub_item.created_at)}
                                </span>
                                <span className='comActionBg' onClick={(e) => SubCommentAction(sub_item)}>
                                    <img src={actionImg} alt="" />
                                </span>

                                {/* Actionbox */}
                                {((selectedComment.action_open && selectedComment.comment.id === sub_item.id) && (selectedComment.is_child) &&
                                    (sub_item.is_mine === 0)) ?
                                    <div className="actionBox" onClick={(e) => reportCommentHandle(sub_item)}>
                                        <div className="report">
                                            <i className="fa fa-book" aria-hidden="true"></i>
                                            Report
                                        </div>
                                    </div> : ((selectedComment.action_open && selectedComment.comment.id === sub_item.id) && (selectedComment.is_child) &&
                                        (selectedComment.comment.is_mine === 1)) && <div className="actionBox" onClick={(e) => handledeleteSubComment(sub_item)}>
                                        <div className="report">
                                            <i className="fa fa-trash" aria-hidden="true"></i>
                                            Delete
                                        </div>
                                    </div>}
                                {/* Actionbox */}

                            </span>

                        </div>
                        <div>
                            <p className='msg_text'>
                                {sub_item.comment}
                            </p>
                        </div>
                        <div>
                            <ul className='comment_btn'>
                                <li onClick={() => likeCommentFn(sub_item,index)}>
                                    {`${sub_item.like_count > 0 ? sub_item.like_count + ' Likes' : 'Like'}`}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SubComment