import React, { Fragment, useEffect, useState } from 'react';
import img1 from '../../../../assets/images/avatar/profileimage.png'
import timeAgoConverter from '../../../../helpers/TimeAgoConverter';
import SubComment from './SubComment';
import { useParams, useSearchParams } from 'react-router-dom';
import { postRequest } from '../../commonApi';

//third-party
import { toast } from 'react-toastify'
import { FormFeedback } from 'reactstrap'

//redux
import {
    openActionMenu,
    likeCounter,
    likeComment,
    openReplyInput,
    postComment,
    resetSelected,
    actionClose,
    setSingleCommentData,
    getSingleComment
} from '../../../../redux/commentsReducer';
import { useDispatch, useSelector } from 'react-redux';
import { reportAndDeleteShow } from '../../../../redux/modelReducer'
import ReportAndDelete from '../../../../components/model/reportAndDeleteComment';


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


const Comments = ({socket, item, index }) => {
    const actionImg = '/images/icon/actionImg.png'

    const params = useParams()
    const [commentText, setCommentText] = useState('')
    const [validationError, setValidationError] = useState(null)
    const [receiverID, setReceiverID] = useState(null)
    const [action, setAction] = useState(null)

    const dispatch = useDispatch();
    const { data, selectedComment, singleComment, lastComment, lastLikedComment } = useSelector(state => state.commentReducer)
    const {content} = useSelector(state => state.editSeriesReducer)
    const {reportAndDelete} = useSelector(state => state.modelReducer)
    const { userData } = useSelector(state => state.userReducer);
    const { selectedContent } = useSelector(state => state.pdfReducer)
    const [dataCb, setDataCb] = useState(null)
    
    let increment ;
    if(singleComment.show === true) {
    increment = parseInt(singleComment.comment.is_liked) === 1 ? false : true ;
    }else {
    increment = parseInt(data[index].is_liked) === 1 ? false : true ;

    }

    // Post sub comment
    const postSubComment = async (item) => {
        if (Object.keys(userData).length === 0) {

            return toast.success(<SuccessToast message='Please login first' />, { hideProgressBar: true,  autoClose:  8000, })
        }
        if (userData.is_verified === 0  || userData.is_verified === "0") {

            return toast.success(<SuccessToast message='Verify your email to use this feature' />, { hideProgressBar: true,  autoClose:  8000, })
        }
        if (commentText === '') {

            return setValidationError('Please type a Comment first')
        } else {

            setValidationError(null)
        }
        const id = params.type === "content" ? selectedContent?.id : params?.id
        setAction("comment")

            // if(action === "comment")
            // { dispatch(
            //     postComment({
            //         comment: commentText,
            //         content_id: id,
            //         comment_parent_id: item.id,
            //         singleComment: singleComment.show === true ? '1' :'0',
            //         parentIndex: index,
            //         is_child: true, 
            //     }, setDataCb(dataCb))
            // )}
            // dispatch(
            //     postComment({
            //         comment: commentText,
            //         content_id: id,
            //         comment_parent_id: item.id,
            //         singleComment: singleComment.show === true ? '1' :'0',
            //         parentIndex: index,
            //         is_child: true,
            //     }, setDataCb(dataCb))
            // )
       
            try {
                let dataMain  
                if (action === 'comment') {
                    dataMain = {
                        comment: commentText,
                        content_id: id,
                        comment_parent_id: item.id,
                        singleComment: singleComment.show === true ? '1' :'0',
                        parentIndex: index,
                        is_child: true, 
                            }
                        setDataCb(dataCb)

                } else {

                dataMain = { 
                        comment: commentText,
                        content_id: id,
                        comment_parent_id: item.id,
                        singleComment: singleComment.show === true ? '1' :'0',
                        parentIndex: index,
                        is_child: true,
                        }
                        setDataCb(dataCb)
                    }
                const response = await postRequest({ sub_url: '/postcomment', dataMain })

                 if (response.status === true) {

                    if((userData.id !== receiverID)) { 
                        if(socket) {
                            socket?.emit("sendNotification",
                            JSON.stringify({   
                                sender_name: userData?.user_name !== "" ? userData?.user_name : `${userData.first_name} ${userData.last_name}`,
                                receiver_id: receiverID,
                                content_id: response.body[0].content_id,
                                slug: params.slug,
                                notification_type: 7 ,
                                comment_id: response.body[0].comment_parent_id , 
                                sender_id: userData.id,
                            
                            })
                        )
                        
                   
                        }
                    }
                    dispatch(setSingleCommentData(
                        { response, dataMain}
                     ))
                   
                }
    
            } catch (err) {
    
            }

        dispatch(
            resetSelected()
        )

        setCommentText('')
    }

    // const sendNotification = (data) => {
    //     if(socket) {
    //         socket?.emit("sendNotification", data);
    //     }
    // }
    
       
       


    // Like comment
    const handleMainCommentLike = async (item) => {
        if (Object.keys(userData).length === 0) {
            return toast.success(<SuccessToast message='Please login first' />, { hideProgressBar: true,  autoClose:  8000, })
        }
        if (userData.is_verified === 0  || userData.is_verified === "0") {
            return toast.success(<SuccessToast message='Verify your email to use this feature' />, { hideProgressBar: true,  autoClose:  8000, })
        }
        setReceiverID(item.user_id)
        setAction("like")
        dispatch(
            likeCounter({
                comment_id: item.id,
                index,
                increment: increment,
                content_id: params.type === "content" ? content.contentData.id : params.id,
                singleComment: singleComment.show === true ? '1' : '0',
                is_child: false
            })
        )
        // dispatch(
        //     likeComment({
        //         comment_id: item.id,
        //         index,
        //         increment:increment,    
        //         content_id: params.type === "content" ? content.contentData.id : params.id,
        //         slug: params.slug,
        //         is_child: false
        //     })
        // )
        try {
            const dataMain ={
                comment_id: item.id,
                index,
                increment:increment,    
                content_id: params.type === "content" ? content.contentData.id : params.id,
                slug: params.slug,
                is_child: false
                    }
            const response = await postRequest({ sub_url: '/likecomment', dataMain })
             if (response.status === true) {
                if((increment === true) && (userData.id !== receiverID)) { 
                    if(socket) {
                        socket?.emit("sendNotification",
                      JSON.stringify({   
                            sender_name: userData?.user_name !== "" ? userData?.user_name : `${userData.first_name} ${userData.last_name}`,
                            receiver_id: item.user_id,
                            content_id:  content.contentData.id,
                            slug: params.slug,
                            notification_type: 3,
                            comment_id: item.id, 
                            sender_id: userData.id,
                        })
                    )
                    }
                }
            }

        } catch {

        }
      

        
    }

    // Toggle sub comment area
    const actionToggle = (item) => {
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

    // Toggle sub comment area
    const toggleSubCommentBox = (item) => {
        setReceiverID(item.user_id)
        if (Object.keys(userData).length === 0) {
            return toast.success(<SuccessToast message='Please login first' />, { hideProgressBar: true,  autoClose:  8000, })
        }
        if (userData.is_verified === 0  || userData.is_verified === "0") {
            return toast.success(<SuccessToast message='Verify your email to use this feature' />, { hideProgressBar: true,  autoClose:  8000, })
        }
        if (selectedComment.comment.id && selectedComment.comment.id !== item.id) {
            return dispatch(
                openReplyInput({
                    reply_open: true,
                    comment: item,
                    is_child: item.comment_parent_id === 0 ? false : true
                })
            )
        }
        if (!selectedComment.comment.id) {
            return dispatch(
                openReplyInput({
                    reply_open: true,
                    comment: item,
                    is_child: item.comment_parent_id === 0 ? false : true
                })
            )
        }
        dispatch(   
            openReplyInput({
                reply_open: false,
                comment: {},
                is_child: null
            })
        )

    }

    const reportCommentHandle = (item) => {
        if (Object.keys(userData).length === 0) {
            return toast.success(<SuccessToast message='Please login first' />, { hideProgressBar: true,  autoClose:  8000, })
        }
        if (userData.is_verified === 0  || userData.is_verified === "0") {
            return toast.success(<SuccessToast message='Verify your email to use this feature' />, { hideProgressBar: true,  autoClose:  8000, })
        }
        dispatch(
            reportAndDeleteShow({
                show: true,
                comment_id : item.id,
                singleComment: singleComment.show === true ? '1' : '0',
                type: "report"
            })
        )
        dispatch(actionClose())
    }

    const deleteComment = (item) => {
        if (Object.keys(userData).length === 0) {
            return toast.success(<SuccessToast message='Please login first' />, { hideProgressBar: true,  autoClose:  8000, })
        }
        if (userData.is_verified === 0  || userData.is_verified === "0") {
            return toast.success(<SuccessToast message='Verify your email to use this feature' />, { hideProgressBar: true,  autoClose:  8000, })
        }

        dispatch(
            reportAndDeleteShow({
                show: true,
                comment_id : item.id,
                type: "delete",
                is_childComment : false,
                singleComment: singleComment.show === true ? '1' : '0',
                parentComment: null,
                myIndex: index
            })
        )
        dispatch(actionClose())

    }
    useEffect(() => {
        if(singleComment.show === true && dataCb !== null){
            item = dataCb[index]
        }
    },[dataCb])
        
    return (
        <div className="parentComment" key={`item${index}`}>
            <div className="imgSide name_n_img">
                <img src={item.profile_img ? item.profile_img : img1} alt='user' />
            </div>
            <div className="details">
                <div className='user_details subNameSection'>
                    <span>
                        <span className='commentorUName'>{(item.is_creator === 1 && item.user_name !== "") ? `${item.user_name}` : `${item.first_name} ${item.last_name}`}</span>
                    </span>
                    <span className="edit_comment">
                        <span>{timeAgoConverter(item.created_at)}</span>
                        <span className='comActionBg' type="button" onClick={(e) => actionToggle(item)}>
                            <img src={actionImg} alt="novatoons" />
                        </span>

                        {/* Actionbox */}
                        {((selectedComment.action_open && item.id === selectedComment.comment.id) && (!selectedComment.is_child) && (item.is_mine === 0)) ? <div className="actionBox">
                            <div className="report" onClick={() => reportCommentHandle(item)}>
                                <i className="fa fa-book" aria-hidden="true"></i>
                                Report
                            </div>
                        </div> : ((selectedComment.action_open && item.id === selectedComment.comment.id) && (!selectedComment.is_child)) && <div className="actionBox">
                            <div className="report" onClick={() =>  deleteComment(item)}>
                                <i className="fa fa-trash" aria-hidden="true"></i>
                                Delete
                            </div>
                        </div>}
                        {/* Actionbox */}

                    </span>
                </div>
                <p className='msg_text'>
                    {item.comment}
                </p>
                <ul className='comment_btn'>
                    <li onClick={() => handleMainCommentLike(item)}>
                        {`${item.like_count > 0 ? item.like_count + ' Likes' : 'Like'}`}
                    </li>
                    <li onClick={(e) => toggleSubCommentBox(item)} type="button">Reply</li>
                </ul>
            </div>

            {/* CommentBox */}
            {(selectedComment.comment.id === item.id && selectedComment.reply_open) &&
                <div className='comment_box commentreplybox'>
                    <div className='messageBoxIcon'>
                        <img src={userData.profile_img !== "" ? userData.profile_img : img1} alt='user' />
                    </div>
                    <div className='subTextboxWrapper'>
                        <textarea
                            rows={1}
                            name="text"
                            id={`textbox${item.id}`}
                            value={commentText} onChange={(e) => setCommentText(e.target.value)}
                            className={validationError !== null && 'is-invalid'}
                        />
                        {validationError !== null && <FormFeedback className='ml-40px'>{validationError}</FormFeedback>}
                    </div>
                    <div
                        type="button"
                        onClick={() => postSubComment(item)} className='sendmessage'>
                        <i className="fa fa-paper-plane" aria-hidden="true"></i>
                    </div>
                </div>
            }
            {/* END OF CommentBox */}


            {/* SUBCOMMENTS */}
            {item.reply && item.reply.length ?
                <div className="subcomments">
                    {(item.reply.map((sub_item, sub_index) => {
                        return <SubComment
                            key={`Subcomment${item.id}${Math.floor((Math.random() * 1000) + 1)}${index + 444}`}
                            socket={socket}
                            sub_item={sub_item}
                            index={sub_index}
                            parentIndex={index}
                        />
                    }))}
                </div> : null}
            {/* END OF PARENT COMMENT */}

            {reportAndDelete.show && <ReportAndDelete/>}

        </div> 

    )
}

export default Comments