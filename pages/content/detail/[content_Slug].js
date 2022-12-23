import React, { Fragment, useEffect, useState } from 'react';
// import { Link, useSearchParams } from 'react-router-dom'
//components
import Loader from '../../components/loader/loader';
// import LiveAuction from '../../components/layouts/LiveAuction';
// import DirectDonationModel from '../../components/model/directDonationModel';
// import DonateMessage from '../../components/model/donateMessage';

//third party
import { Rating } from 'react-simple-star-rating'
import { toast } from 'react-toastify'
import { Row, Col, Button } from 'reactstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
// //redux
import { getContent, downloading, updateStatus, buyAction, restoreModel, resetActionTextState, resetDetails, is_favouritedSet } from '../../../redux/editContentSeriesReducer'
import { useDispatch, useSelector } from 'react-redux';
import { resetpdf } from '../../../redux/pdfReducer'
import { donateModelShow, buyContentShow, ratingShow } from '../../../redux/modelReducer';

//config and apiauthor_id
import { isUserLoggedIn } from '../../../config';
import { postRequest } from '../../../commonApi';
import { isWindow } from '../../../utils/window';

//model
// import BuyContent from '../../components/model/buyContentModel';
// import SliderDurationModel from '../../components/model/sliderDuration';
import RejectionHandler from '../../../component/ErrorHandler/RejectionHandler';
// import RatingModel from '../../components/model/ratingModel';
// import DonateModel from '../../components/model/donateModel';
// import RestoreModel from '../../components/model/restorePopup';

//css
// import './detailPage.css'
// import 'react-tabs/style/react-tabs.css';
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

const DetailPage = ({ socket }) => {
    //images
    const paid = '/images/icon/paid.svg'
    const free = '/images/icon/check.svg'
    const placeholder = '/images/avatar/dummyuser.png'

    const dispatch = useDispatch()
    // const navigate = useNavigate()
    const router = useRouter()
    const routeData = router.query
    const slug = routeData.content_Slug

    // const [searchParams] = useSearchParams()
    const [data, setData] = useState({})
    const [startDownloading, setStartDownloading] = useState(false)

    const {
        series,
        content,
        loading,
        isSeries,
        dataType,
        is_mine,
        is_already_downloaded,
        is_paid,
        is_downloadable,
        is_available,
        is_bought,
        price,
        actionType,
        favorite,
        err,
        is_read,
        error_message,
        is_rated,
        genre_name,
        sub_genres,
        author_id,
        RestoreStuff
    } = useSelector(state => state.editSeriesReducer)
    const { buyContent, sliderDuration, ratingModel, donateModel, directDonation } = useSelector(state => state.modelReducer)
    const { userData } = useSelector(state => state.userReducer)

    const category = (isSeries === true) ? "series" : "content"
    useEffect(() => {
        if (startDownloading) {
            toast.success(<SuccessToast message="Your requested file is on the way! Please wait till the file gets downloaded" />, {
                hideProgressBar: true,
                autoClose: 5000,
                closeOnClick: true,
                pauseOnHover: true,
            })
        }
    }, [startDownloading])
    const handleFavorites = async (value) => {
        if (Object.keys(userData).length === 0) {
            return toast.success(<SuccessToast message='Please login first' />, { hideProgressBar: true, autoClose: 8000, })
        }
        if (userData.is_verified === 0 || userData.is_verified === "0") {
            return toast.success(<SuccessToast message='Verify your email to use this feature' />, { hideProgressBar: true, autoClose: 8000, })
        }
        let dataMain = {
            content_id: content.contentData.id,
            is_liked: value
        }

        if (isUserLoggedIn()) {
            const response = await postRequest({ sub_url: '/favouritepost', dataMain })
            if (response.status === true) {
                if ((userData?.id !== author_id) && (value === 1)) {
                    if (socket) {
                        socket.emit("sendNotification",
                            JSON.stringify({
                                sender_name: userData?.user_name !== "" ? userData?.user_name : `${userData.first_name} ${userData.last_name}`,
                                receiver_id: author_id,
                                content_id: content.contentData.id,
                                slug: slug,
                                notification_type: 5,
                                sender_id: userData.id
                            })
                        );
                    }
                }
                toast.success(<SuccessToast message={response.message} />, { hideProgressBar: true, autoClose: 8000, })
                dispatch(
                    is_favouritedSet({
                        is_favourited: !favorite.is_favourited,
                        favorite_count: response.body
                    })
                )
            }
        }
    }

    useEffect(() => {
        dispatch(resetDetails())
        dispatch(getContent({ slug }))
        dispatch(
            buyAction({
                actionType: null
            })
        )
        dispatch(resetpdf())
    }, [isWindow,slug])

    const HandlePdfView = (item, type) => {
        if (content.contentData.file_uploaded === "1") {
            navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/content/view/${content?.contentData.slug}`)
            /// under processing
        } else if (content.contentData?.file_uploaded === "0") {
            toast.success(<SuccessToast message="Your upload is being processed. You will be notified when it is completed" />, { hideProgressBar: true, autoClose: 8000, })
        }
    }

    const handleEdit = () => {
        if (searchParams.get('type') === '0') {
            dispatch(
                getContent({
                    slug
                })
            )
            dispatch(resetpdf())
            navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/myuploads/edit/${slug}?type=0`)
        }
    }

    const donateHandle = () => {
        if (Object.keys(userData).length === 0) {
            return toast.success(<SuccessToast message='Please login first' />, { hideProgressBar: true, autoClose: 8000, })
        }
        if (userData.is_verified === 0 || userData.is_verified === "0") {
            return toast.success(<SuccessToast message='Verify your email to use this feature' />, { hideProgressBar: true, autoClose: 8000, })
        }
        dispatch(
            donateModelShow({
                donateFor: 'content',
                show: true
            })
        )
    }

    const handleDownloadFree = async (dataMain) => {
        if (is_bought) {
            setStartDownloading(true)
        }
        dataMain.is_download = 1
        const response = await postRequest({ sub_url: '/buycontent', dataMain })
        const a = document.createElement('a')
        if (response.status === true) {
            if (!isSeries) {
                //free content download
                function toDataURL(url) {
                    return fetch(url).then((response) => {
                        return response.blob();
                    }).then(blob => {
                        return URL.createObjectURL(blob);
                    });
                }
                const contentDownload = async () => {
                    a.href = await toDataURL(response.data[0])
                    if (content.contentData.content_type === 1) { //comic
                        a.download = `${content.contentData.title}.pdf`;
                    } else if (content.contentData.content_type === 2) { //art
                        a.download = `${content.contentData.title}`;
                    }
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    dispatch(downloading(true))
                    setStartDownloading(false)
                }

                contentDownload()
            }
            dispatch(
                buyAction({
                    actionType: null
                })
            )
            dispatch(
                resetActionTextState({
                    is_alreadyDownloaded: true,
                    is_paid: false,
                    is_downloadable: content.contentData.is_downloadable === 1 ? true : false,
                    price: null,
                    is_bought: true
                })
            )
            if (!is_bought) {
                return toast.success(<SuccessToast message={response.message} />, { hideProgressBar: true, autoClose: 8000, })
            }
        }
    }


    const handlePurchase = (type) => {
        if (Object.keys(userData).length === 0 || !isUserLoggedIn()) {
            return toast.success(<SuccessToast message="Please Login first" />, { hideProgressBar: true, autoClose: 8000, })
        } else if (userData.is_verified === 0 || userData.is_verified === "0") {
            return toast.success(<SuccessToast message='Verify your email to use this feature' />, { hideProgressBar: true, autoClose: 8000, })
        } else if ((parseInt(price) > parseInt(userData.total_amount) || parseInt(price) > parseInt(userData.total_amount))) {
            return toast.success(<SuccessToast message="Please add some more credits" />, { hideProgressBar: true, autoClose: 8000, })
        }
        dispatch(
            buyAction({
                actionType: type
            })
        )
    }
    const handleRestore = () => {
        dispatch(restoreModel({
            modelShow: true,
            content: content.contentData.id,
            isContent: true
        }))
    }
    const downloadContentFile = async () => {
        if (is_bought) {
            setStartDownloading(true)
        }

        const dataMain = {
            content_id: slug,
            type: 'content',
            is_download: is_bought ? 1 : 0
        }
        const response = await postRequest({ sub_url: '/buycontent', dataMain })
        const fileName = isSeries ? series.seriesdata.title : !isSeries && content.contentData.title
        const fileType = isSeries ? series.seriesdata.content_type : !isSeries && content.contentData.content_type
        const a = document.createElement('a')
        function toDataURLs(url) {
            return fetch(url).then((response) => {
                return response.blob();
            }).then(blob => {
                return URL.createObjectURL(blob);
            });
        }
        const contentDownload = async () => {
            a.href = await toDataURLs(response.data[0])
            if (fileType === 1) { //comic
                a.download = `${fileName}.pdf`;
            } else if (fileType === 2) { //art
                a.download = `${fileName}.png`;
            }
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            dispatch(downloading(true))
            setStartDownloading(false)
        }
        contentDownload()
    }

    useEffect(() => {
        if (!loading) {
            if (!isSeries && content.contentData.is_paid === 1) {

                setData({
                    content_id: content.contentData.id,
                    type: 'content'

                })
                if (actionType === 'buy') {
                    dispatch(
                        buyContentShow(true)
                    )
                }
                if (actionType === 'download' && !is_already_downloaded) {
                    downloadContentFile()
                }
            } else if (!isSeries && content.contentData.is_paid === 0) { //action for free content download
                const dataMain = {
                    content_id: slug,
                    type: 'content'
                }
                if (actionType === 'download' && !is_already_downloaded) {
                    handleDownloadFree(dataMain)
                }
            }
        }
    }, [actionType])

    const handleRating = () => {
        if (Object.keys(userData).length === 0) {
            return toast.success(<SuccessToast message='Please login first' />, { hideProgressBar: true, autoClose: 8000, })
        }

        if (userData.is_verified === 0 || userData.is_verified === "0") {
            return toast.success(<SuccessToast message='Verify your email to use this feature' />, { hideProgressBar: true, autoClose: 8000, })
        }

        if ((!isSeries && is_paid && !is_bought && !is_available) || (is_paid && !is_bought && userData.is_subscribed === 1 && !is_available) || (is_paid && !is_bought && userData.is_subscribed === 0 && is_available) || (is_mine === 1)) {
            return console.warn("restricted")
        }


        if (isSeries) {
            return toast.success(<SuccessToast message='You can only Rate the content of the particular Series.' />, { hideProgressBar: true, autoClose: 8000, })
        }

        if (is_rated) {
            return toast.success(<SuccessToast message='Your have already rated this content' />, { hideProgressBar: true, autoClose: 8000, })
        }


        dispatch(
            ratingShow({
                show: true,
                id: isSeries ? series.seriesdata.id : content.contentData.id,
                type: isSeries ? 'series' : 'content'
            })
        )
    }

    const handleThumnail = (id) => {
        if ((!is_bought && dataType === 2 && is_paid && userData.is_subscribed === 0) || (userData.is_subscribed === 0 && !is_available && dataType === 2 && is_paid)) {
            return toast.success(<SuccessToast message='Buy Now to view this content.' />, { hideProgressBar: true, autoClose: 8000, })
        }

        navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/content/view/${content.contentData.slug}?type=0`)

    }
    if (!loading
        && Object.keys(content?.contentData).length > 0
    ) {
        return (
            <div className='item-details detailPage'>

                <div className={isSeries ? "tf-section tf-item-details style-2 m-top-120" : "tf-section tf-item-details style-2 pb-80 m-top-120"}>
                    <div className="themesflat-container pt-80">
                        <div className="row mx-90">
                            <div className=" col-xxl-6 col-sm-12 col-md-4 content_size2">
                                <div className="content-left">
                                    <div className="media single_commic">

                                        <img className='cursorPointer' src={content?.contentData.cover_image} alt="novatoons" onClick={handleThumnail} />
                                    </div>
                                    {(is_mine === 1 && isUserLoggedIn()) ? (content?.contentData.status != 0) ?
                                        <div className='comicp_edit_btn d-flex' style={{ gap: '7px' }}>
                                            <Link href={`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/edit${category}/${slug}`} className="btn previewBtn mt-4">Edit</Link>
                                            <Link href={`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/promotion/${category}/${slug}`} className="btn previewBtn mt-4">Promotion</Link>
                                        </div>
                                        : <div className='comicp_edit_btn d-flex' style={{ gap: '7px' }}>
                                            {/* <button  className="btn previewBtn mt-4" onClick= {() => handleRestore() }>Restore Content</button> */}
                                        </div> : ''
                                    }
                                </div>
                            </div>
                            <div className="col-xl-7 col-xxl-6 col-md-6 col-sm-12">
                                <div className="content-right DetailsPageRight">
                                    <div className="sc-item-details">
                                        <div className="meta-item mainResponsive">
                                            <div className="left">
                                                <h2 className='DetailTitle'>{content.contentData.title}</h2>
                                            </div>
                                            {content.contentData.is_paid === 1 &&
                                                <div className="right">
                                                    <h2 className='DetailTitle'>${`${Math.abs(parseFloat(content.contentData.price))}`}</h2>
                                                </div>
                                            }
                                        </div>
                                        <div className="meta-item iconsDetails">
                                            <div className="left">
                                                <span className="mr-2 cursorPointer" onClick={() => handleFavorites(favorite.is_favourited ? 0 : 1)}>
                                                    <i className={favorite.is_favourited ? 'fa fa-heart red' : 'fa fa-heart'} aria-hidden="true"></i>
                                                    {favorite.favorite_count}
                                                </span>

                                                <span className="wishlist-button">
                                                    <i className="fa fa-commenting" aria-hidden="true"> </i>
                                                    {content.contentData.total_comments}
                                                </span>

                                                <span className="paid_btn">
                                                    {series.seriesdata?.is_paid === 1 || content.contentData?.is_paid === 1 ? <Fragment><img loading="lazy" src={paid} alt="paid" /> Paid</Fragment> : <Fragment><img loading="lazy" src={free} alt="free" /> Free </Fragment>}
                                                </span>

                                                {genre_name && <Fragment> <span className="paid_btn genreMain">{genre_name}</span> </Fragment>}

                                                {sub_genres.length > 0 && <span className="seprator"></span>}

                                                {sub_genres.length > 0 && sub_genres.map((item, index) => {
                                                    return <Fragment> <span key={index} className="paid_btn" id={index}>{item.genre}</span> </Fragment>
                                                })}


                                            </div>

                                            {/* <div className="right">
                                                <Link className="share" to="/mern"></Link>
                                            </div> */}

                                        </div>
                                        <div className="client-infor sc-card-product">

                                            <div className="meta-info">
                                                <div className="author">
                                                    <div className="avatar">
                                                        <Link href={`/author/${content.contentData.user_id}`}>
                                                            <img loading="lazy" src={content.contentData?.profile_img !== "" ? content.contentData?.profile_img : placeholder} alt="novatoons" />
                                                        </Link>
                                                    </div>
                                                    <div className="info authorHeading">
                                                        <h4>Author</h4>
                                                        <h6>
                                                            <Link href={`/author/${isSeries ? series.seriesdata.user_id : content.contentData.user_id}`}>
                                                                {(content.contentData.user_name !== "" && content.contentData.is_creator === 1) ? content.contentData.user_name : `${content.contentData.first_name} ${content.contentData.last_name}`}
                                                            </Link>
                                                        </h6>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="meta-info_rating">
                                                <div className="single_rating">
                                                    <div onClick={() => handleRating()} className="info">
                                                        <h4>Rating</h4>
                                                        <Rating
                                                            ratingValue={(parseFloat(content.contentData.total_rating) * 100 / 5)}
                                                            allowHalfIcon={true}
                                                            fillColor='#ffd700'
                                                            emptyColor='#808080'
                                                            iconsCount={5}
                                                            size={25}
                                                            readonly={true}
                                                            className='cursorPointer'
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Rating end */}

                                        {content.contentData.description && content.contentData.description !== "" && <p>{content.contentData.description}</p>}

                                        <div className="profile_two_btn">
                                            <Row>
                                                {
                                                    dataType === 1 ? //logic for comic preview button
                                                        is_available && is_paid ? // data only for subscribed user and paid
                                                            //have subscriber
                                                            userData.is_subscribed === 1 ?
                                                                !is_read ?
                                                                    <Col className="mt-3" sm={6}>
                                                                        <button className="full_btn" onClick={(e) => HandlePdfView('content_reading')}>Start Reading</button>
                                                                    </Col>
                                                                    : userData.is_subscribed === 1 &&
                                                                    is_read &&
                                                                    <Col className="mt-3" sm={6}>
                                                                        <button className="full_btn" onClick={(e) => HandlePdfView('content_reading')}>Continue Reading</button>
                                                                    </Col>
                                                                :
                                                                //not subscriber
                                                                ((userData.is_subscribed === 0 && !is_bought && !is_read) || (Object.keys(userData).length === 0 && is_paid)) ?
                                                                    <Col className="mt-3" sm={6}>
                                                                        <button className="full_btn" onClick={(e) => HandlePdfView('content_reading')}>Preview (First {userData.preview_page} Pages)</button>
                                                                    </Col> :
                                                                    ((userData.is_subscribed === 0 && is_bought && !is_read) || (Object.keys(userData).length === 0 && !is_paid)) ?
                                                                        <Col className="mt-3" sm={6}>
                                                                            <button className="full_btn" onClick={(e) => HandlePdfView('content_reading')}>Start Reading</button>
                                                                        </Col>
                                                                        :
                                                                        (userData.is_subscribed === 0 && is_bought && is_read) &&
                                                                        <Col className="mt-3" sm={6}>
                                                                            <button className="full_btn" onClick={(e) => HandlePdfView('content_reading')}>Continue Reading</button>
                                                                        </Col>
                                                            :
                                                            !is_available && is_paid ?
                                                                //content not subscriber but 
                                                                !is_bought && !is_read ?
                                                                    <Col className="mt-3" sm={6}>
                                                                        <button className="full_btn" onClick={(e) => HandlePdfView('content_reading')}>Preview (First {userData.preview_page} Pages)</button>
                                                                    </Col>
                                                                    : (is_bought || is_mine) && !is_read ?
                                                                        <Col className="mt-3" sm={6}>
                                                                            <button className="full_btn" onClick={(e) => HandlePdfView('content_reading')}>Start Reading</button> </Col>
                                                                        : (is_bought || is_mine) && is_read &&
                                                                        <Col className="mt-3" sm={6}>
                                                                            <button className="full_btn" onClick={(e) => HandlePdfView('content_reading')}>Continue Reading</button>
                                                                        </Col>
                                                                :
                                                                //logic for free content
                                                                !is_paid && !is_read ?
                                                                    <Col className="mt-3" sm={6}>
                                                                        <button className="full_btn" onClick={(e) => HandlePdfView('content_reading')}>Start Reading</button>
                                                                    </Col> :
                                                                    <Col className="mt-3" sm={6}>
                                                                        <button className="full_btn" onClick={(e) => HandlePdfView('content_reading')}>Continue Reading</button>
                                                                    </Col>

                                                        ///////////////Logic complete for comic///////////////////////

                                                        //logic for art 
                                                        : dataType === 2 &&
                                                        ((is_bought && is_paid) || (!is_paid) || (is_available && userData.is_subscribed === 1)) &&
                                                        <Col className="mt-3" sm={6}>
                                                            <button className="full_btn" onClick={(e) => HandlePdfView('content_reading')}>View Image</button>
                                                        </Col>
                                                }


                                                {
                                                    is_mine === 0 || is_mine === 1 ? //logic for comic download button

                                                        ((is_paid && !is_bought && userData.is_subscribed === 0) || (is_paid && !is_bought && Object.keys(userData).length === 0) || (userData.is_subscribed === 1 && !is_available && !is_bought && !is_mine)) ?
                                                            <Col className="mt-3" sm={6}><button onClick={(e) => handlePurchase('buy', price)} className="full_btn">{`Buy Now $${price}`}</button> </Col>
                                                            : (
                                                                (!isSeries && (is_bought || is_mine) && is_downloadable && !is_already_downloaded) || (userData.is_subscribed === 1 && is_available && is_downloadable && !is_already_downloaded && !isSeries)
                                                            ) ?
                                                                <Col className="mt-3" sm={6}><button onClick={(e) => handlePurchase('download')} className="full_btn">Download</button> </Col> :
                                                                (
                                                                    (!isSeries && (is_bought || is_mine) && is_downloadable && is_already_downloaded) ||
                                                                    (userData.is_subscribed === 1 && is_available && is_downloadable && is_already_downloaded && !isSeries)
                                                                ) && <Col className="mt-3" sm={6}><button className="full_btn">Downloaded</button></Col>
                                                        :
                                                        !is_paid ?
                                                            !isSeries && (is_bought || is_mine) && is_downloadable && !is_already_downloaded ?
                                                                <Col className="mt-3" sm={6}> <button onClick={(e) => handlePurchase('download')} className="full_btn">Download</button></Col> :
                                                                !isSeries && is_bought && is_downloadable && is_already_downloaded && <Col className="mt-3" sm={6}><button className="full_btn">Downloaded</button></Col>

                                                            : null
                                                }

                                                <Col
                                                    className="mt-3"
                                                    sm={((!is_paid && !is_downloadable) || (userData.is_subscribed === 1 && is_available && !is_downloadable) || (!isSeries && !is_downloadable && (is_bought || is_mine)) || (isSeries && (is_bought || is_mine)) || (dataType === 2 && is_paid && !(is_bought || is_mine) && userData.is_subscribed === 0) || (dataType === 2 && is_paid && !(is_bought || is_mine) && userData.is_subscribed === 0 && is_available)) ? 6 : 12}>
                                                    <button onClick={donateHandle} className="donate_btn">Donate</button>
                                                </Col>

                                            </Row>


                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* {(!isSeries && content.contentData.recommend !== undefined) && <LiveAuction data={content.contentData.recommend} />} */}
                {/* {buyContent && <BuyContent data={data} />}
                {sliderDuration.show && <SliderDurationModel />}
                {ratingModel && <RatingModel />}

                {donateModel.show && <DonateModel/> }
                {directDonation.show && <DirectDonationModel/>}
                {donateModel.briefModel.briefShow && <DonateMessage />}
                {RestoreStuff.modelShow && <RestoreModel />} */}

            </div>
        );
    } else if (!loading && err) {
        return <RejectionHandler data={error_message} />
    } else {
        return <Loader/>
    }
}

export default DetailPage;
