import React, { Fragment, useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import placeHolder from '../../../../assets/images/avatar/profileimage.png'
import { postRequest } from '../../../../commonApi';

//Component
import Comments from './comments'
import Loader from '../../../../components/loader/loader'

//redux
import { getComments, postComment, resetSelected, setLoadMore, setSingleCommentData } from '../../../../redux/commentsReducer'
import { useSelector, useDispatch } from 'react-redux';

//third-party
import { toast } from 'react-toastify'
import InfiniteScroll from 'react-infinite-scroll-component';

//css
import './comments.css'
import { FormFeedback } from 'reactstrap'

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

const CommentView = ({ socket }) => {
    const params = useParams()
    const dispatch = useDispatch()
    const [page, setPage] = useState(1)
    const [commentText, setCommentText] = useState('')
    const [validationError, setValidationError] = useState(null)
    const { content } = useSelector(state => state.editSeriesReducer)
    const { data, load_more, singleComment, error, err_message, loading, lastComment } = useSelector(state => state.commentReducer)
    const { mode, selectedContent } = useSelector(state => state.pdfReducer)
    const { userData } = useSelector(state => state.userReducer);

    useEffect(() => {
        if (params.type === 'content' && singleComment.show !== true) {
            let data = { content_id: content.contentData.id, page }
            dispatch(getComments(data));
        } else if (params.type != 'content' && singleComment.show !== true) {
            let data = { content_id: params.id, page }
            dispatch(getComments(data));
        }
    }, [dispatch])
    //infinite scroll
    const fetchMoreComments = (fetchData) => {
        setPage(prevState => prevState + 1)
        let data = { content_id: params.type === 'content' ? content.contentData.id : params.id, page }
        dispatch(getComments(data));
    }

    // Post comment
    const postCommentFun = async () => {
        if (Object.keys(userData).length === 0) {
            return toast.success(<SuccessToast message='Please login first' />, { hideProgressBar: true, autoClose: 8000, })
        }

        if (userData.is_verified === 0 || userData.is_verified === "0") {
            return toast.success(<SuccessToast message='Verify your email to use this feature' />, { hideProgressBar: true, autoClose: 8000, })
        }
        if (commentText === '') {
            return setValidationError('Please type a Comment first')
        } else {
            setValidationError(null)
        }

        // dispatch(
        //     postComment({
        //         comment: commentText,
        //         content_id: selectedContent?.id,
        //         comment_parent_id: 0
        //     })
        // )
        try {
            let dataMain = { 
                comment: commentText,
                content_id: selectedContent?.id,
                comment_parent_id: 0
                }
            const response = await postRequest({ sub_url: '/postcomment', dataMain })

             if (response.status === true) {
                if ((userData.id !== selectedContent?.user_id)) {
                    if(socket) {
                    socket.emit("sendNotification",
                     JSON.stringify({
                        sender_name: userData?.user_name !== "" ? userData?.user_name : `${userData.first_name} ${userData.last_name}`,
                        receiver_id: selectedContent?.user_id,
                        content_id: response.body[0].content_id,
                        slug: params.slug,
                        comment_id: response.body[0].id,
                        notification_type: 4,
                        notfication_content_type: params.type,
                        sender_id: userData.id
                    })
                    );
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
    


    if (singleComment.show === true) {
        const item = singleComment.comment
        const index = 0


        if (loading) {
            return <Loader />
        } else {
            return (
                <Fragment>
                    <div className='comment_views'>
                        <h2 className='text-center pb-5 commentHeadingMain'>Comments</h2>
                        {singleComment.dataFound ? <Fragment>
                            <div className={error ? 'commentpannel no_comments' : 'commentpannel'} id="commentpannel">
                                <div className='main_comment_box'>
                                    {/* {console.log(error)} */}
                                    <div className='meta-item'>
                                        <InfiniteScroll
                                            className='commentpannel'
                                            scrollableTarget="commentpannel"
                                            dataLength={Object.keys(item).length}
                                            // next={data}
                                            // hasMore={load_more}
                                            loader={
                                                <div className='text-white text-center m-0'>
                                                    <div className="spinner-border loader_color" role="status">
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                </div>
                                            }
                                        >
                                            {/* PARENT COMMENT */}

                                            <Comments
                                                socket={socket}
                                                key={`parentComponent${item.id}`}
                                                item={item}
                                                index={index}
                                            />

                                            {/* END OF PARENT COMMENT */}
                                        </InfiniteScroll>

                                    </div>
                                </div>
                            </div> </Fragment> :
                            <div className='noComments'>
                                <h3>Comments Not Found</h3>
                            </div>

                        }
                        {/*     
                        <div className='comment_box main'>
                            <div className='user_image'>
                                <img src={Object.keys(userData).length === 0 ? placeHolder : userData.profile_img !== "" ? userData.profile_img : placeHolder} alt='user' />
                            </div>
                            <div className='inputComment'>
                                <textarea name="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} id="postComment" placeholder='Post a comment' rows={2} className={validationError !== null && 'is-invalid'} />
                                {validationError !== null && <FormFeedback className='ml-40px'>{validationError}</FormFeedback>}
                            </div>
                            <div
                                type="button"
                                onClick={postCommentFun}
                                className='sendmessage'>
                                <i className="fa fa-paper-plane" aria-hidden="true"></i>
                            </div>
                        </div> */}
                    </div>
                </Fragment>
            )
        }
    } else {
        if (loading) {
            return <Loader />
        } else {
            return (
                <Fragment>
                    <div className='comment_views'>
                        <h2 className='text-center pb-5 commentHeadingMain'>Comments</h2>
                        {data.length > 0 ? <Fragment>
                            <div className={error ? 'commentpannel no_comments' : 'commentpannel'} id="commentpannel">
                                <div className='main_comment_box'>
                                    <div className='meta-item'>
                                        <InfiniteScroll
                                            className='commentpannel'
                                            scrollableTarget="commentpannel"
                                            dataLength={data.length}
                                            next={fetchMoreComments}
                                            hasMore={load_more}
                                            loader={
                                                <div className='text-white text-center m-0'>
                                                    <div className="spinner-border loader_color" role="status">
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                </div>
                                            }
                                        >
                                            {/* PARENT COMMENT */}
                                            {(error ? <Fragment>
                                                <div className='noComments'>
                                                    <h3>No Comments</h3>
                                                </div>
                                            </Fragment> : data.map((item, index) => {
                                                return <Comments
                                                    socket={socket}
                                                    key={`parentComponent${item.id}`}
                                                    item={item}
                                                    index={index}
                                                />
                                            }))}
                                            {/* END OF PARENT COMMENT */}
                                        </InfiniteScroll>

                                    </div>
                                </div>
                            </div> </Fragment> :
                            <div className='noComments'>
                                <h3>Comments Not Found</h3>
                            </div>

                        }

                        <div className='comment_box main'>
                            <div className='user_image'>
                                <img src={Object.keys(userData).length === 0 ? placeHolder : userData.profile_img !== "" ? userData.profile_img : placeHolder} alt='user' />
                            </div>
                            <div className='inputComment'>
                                <textarea name="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} id="postComment" placeholder='Post a comment' rows={2} className={validationError !== null && 'is-invalid'} />
                                {validationError !== null && <FormFeedback className='ml-40px'>{validationError}</FormFeedback>}
                            </div>
                            <div
                                type="button"
                                onClick={postCommentFun}
                                className='sendmessage'>
                                <i className="fa fa-paper-plane" aria-hidden="true"></i>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )
        }
    }
}

export default CommentView