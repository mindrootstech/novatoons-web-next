import React, { Fragment, useEffect } from 'react';
// import { Link, useParams, useNavigate } from 'react-router-dom'
import paid from '../../../assets/images/contentImages/paid.svg'
import free from '../../../assets/images/contentImages/free.svg'
import download from '../../../assets/images/contentImages/download.svg'
import check from '../../../assets/images/icon/check.svg'
import paidIcon from '../../../assets/images/icon/paid.svg'
import placeholder from '../../../public/images/avatar/dummyuser.png'
//components
import Loader from '../../../component/loader/loader';
// import LiveAuction from '../../components/layouts/LiveAuction';
// import DirectDonationModel from '../../components/model/directDonationModel';
// import DonateMessage from '../../components/model/donateMessage';

//third party
import { Rating } from 'react-simple-star-rating'
import { toast } from 'react-toastify'
import { Col, Row, Button } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
//redux
import { getSeries, updateStatus, restoreModel, resetDetails, is_favouritedSet } from '../../../redux/editContentSeriesReducer'
import { useDispatch, useSelector } from 'react-redux';
import { sliderDurationShow } from '../../../redux/modelReducer';

// //config and apiauthor_id
import { isUserLoggedIn } from '../../../config';
import { postRequest } from '../../../commonApi';

// //model
// import SliderDurationModel from '../../components/model/sliderDuration';
import RejectionHandler from '../../../component/ErrorHandler/RejectionHandler';
// import RatingModel from '../../components/model/ratingModel';
// import DonateModel from '../../components/model/donateModel';
// import RestoreModel from '../../components/model/restorePopup';

//css
// import './detailPage.css'

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

const SeriesDetailPage = ({ socket }) => {
    const dispatch = useDispatch()
    // const navigate = useNavigate()
    
    //Images 
    const paid = '/images/contentImages/paid.svg'
    const free = '/images/contentImages/free.svg'
    const download = '/images/contentImages/download.svg'
    const placeholder = '/images/avatar/dummyuser.png'
    const router = useRouter()
    const routerData = router.query
    const slug = routerData.series_slug 
    const {
        series,
        isSeries,
        loading,
        dataType,
        is_mine,
        is_paid,
        favorite,
        err,
        error_message,
        is_rated,
        genre_name,
        sub_genres,
        author_id,
        RestoreStuff
    } = useSelector(state => state.editSeriesReducer)
    const { sliderDuration, ratingModel, donateModel, directDonation } = useSelector(state => state.modelReducer)
    const { userData } = useSelector(state => state.userReducer)

 

    const category = (isSeries === true) ? "series" : "content"
    
    
    const handleFavorites = async (value) => {

        if (Object.keys(userData).length === 0) {
            return toast.success(<SuccessToast message='Please login first' />, { hideProgressBar: true, autoClose: 8000, })
        }
        if (userData.is_verified === 0 || userData.is_verified === "0") {
            return toast.success(<SuccessToast message='Verify your email to use this feature' />, { hideProgressBar: true, autoClose: 8000, })
        }
        let dataMain = {
            series_id: series.seriesdata.id,
            is_liked: value
        }
        if (isUserLoggedIn()) {
            const response = await postRequest({ sub_url: '/favouritepost', dataMain })
            if (response.status === true) {
                if (value === 1) {
                if(userData != author_id ) {
                    if(socket) {    
                // socket?.emit("sendNotification",
                //     JSON.stringify({
                //     sender_name: userData?.user_name !== "" ? userData?.user_name : `${userData.first_name} ${userData.last_name}`,
                //     receiver_id: author_id,
                //     content_id: series.seriesdata.id,
                //     slug: slug,
                //     notification_type: 6,
                //     sender_id: userData.id
                //   })
                //   );
                        }
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
        if (slug) {
            dispatch(getSeries({ slug }))
        }
    }, [slug])


    const HandlePdfView = (item, type) => {

        if (series.seriesContent.length === 0) {
            toast.success(<SuccessToast message="There are no file uploaded in this Series" />, { hideProgressBar: true, autoClose: 8000, })
        }
        //series view
        if (type === "seeMore") {
            navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/content/detail/${item.slug}`)

        } else if (type === "readNow") {
            if (dataType === 2) {
                // dispatch(resetDetails())
                navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/${item.type}/view/${item.slug}`)
            } else {
                navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/series/view/${series.seriesdata.slug}/${item.id}`)
            }
        } else {
            // series case 
            if (dataType === 2) {
                dispatch(
                    sliderDurationShow({
                        show: true,
                        series_id: parseInt(series.seriesdata.id),
                        content_id: series.seriesContent[0].id
                    })
                )
            } else {
                // navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/${item.type}/view/${series.seriesdata.id}`)
            }
        }
    }
    const handleRestore = () => {
        dispatch(restoreModel({
            modelShow: true,
            content: series.seriesdata.id,
            isContent: false
        }))
    }
    const handleRating = () => {
        if (Object.keys(userData).length === 0) {
            return toast.success(<SuccessToast message='Please login first' />, { hideProgressBar: true, autoClose: 8000, })
        }

        if (userData.is_verified === 0 || userData.is_verified === "0") {
            return toast.success(<SuccessToast message='Verify your email to use this feature' />, { hideProgressBar: true, autoClose: 8000, })
        }

        return toast.success(<SuccessToast message='You can only Rate the content of the particular Series.' />, { hideProgressBar: true, autoClose: 8000, })
    }



    if (series.seriesdata) {
        return (
            <div className='item-details detailPage'>

                <div className="tf-section tf-item-details style-2 m-top-120">
                    <div className="themesflat-container pt-80">
                        <div className="row mx-90">

                            <div className="col-xxl-6 col-sm-12 col-md-4 content_size">
                                <div className="content-left">
                                    <div className="media single_commic">
                                        <img className='cursorPointer' src={series.seriesdata.cover_image} loading="lazy" alt="novatoons" />
                                    </div>
                                    {(is_mine === 1 && isUserLoggedIn()) ? (series.seriesdata.status != 0) ?
                                        <div className='comicp_edit_btn d-flex' style={{ gap: '7px' }}>
                                            <Link href={`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/edit${category}/${slug}`} className="btn previewBtn mt-4">Edit</Link>
                                            <Link href={`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/promotion/${category}/${slug}`} className="btn previewBtn mt-4">Promotion</Link>
                                        </div>
                                        : <div className='comicp_edit_btn d-flex' style={{ gap: '7px' }}>
                                            {/* <button  className="btn previewBtn mt-4" color='sucess' onClick= {() => handleRestore() }>Restore Series</button> */}
                                        </div> : ''
                                    }
                                </div>
                            </div>
                            <div className="col-xxl-6 col-sm-12  col-md-8">
                                <div className="content-right DetailsPageRight">
                                    <div className="sc-item-details">
                                        <div className="meta-item mainResponsive">
                                            <div className="left">
                                                <h2 className='DetailTitle'>{series.seriesdata.title}</h2>
                                            </div>
                                            {(series.seriesdata.is_paid === 1) &&
                                                <div className="right">
                                                    <h2 className='DetailTitle'>${`${Math.abs(parseFloat(series.seriesdata.price))}`}</h2>
                                                </div>}
                                        </div>
                                        <div className="meta-item iconsDetails">
                                            <div className="left">
                                                <span className="mr-2 cursorPointer" onClick={() => handleFavorites(favorite.is_favourited ? 0 : 1)}>
                                                    <i className={favorite.is_favourited ? 'fa fa-heart red' : 'fa fa-heart'} aria-hidden="true"></i>
                                                    {favorite.favorite_count}
                                                </span>

                                                {/* {dataType === 1 && 
                                                <span className="wishlist-button">
                                                    <i className="fa fa-commenting" aria-hidden="true"> </i>
                                                    {series.seriesdata.total_comments}
                                                </span> } */}

                                                {/* <span className="paid_btn">
                                                    {series.seriesdata?.is_paid === 1? <Fragment><img loading="lazy" src={paidIcon} alt="paid" /> Paid</Fragment> : <Fragment><img src={check} loading="lazy" alt="free" /> Free </Fragment>}
                                                </span> */}

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
                                                        <Link href={`/author/${series.seriesdata.user_id}`}>
                                                            <img loading="lazy" src={series.seriesdata?.profile_img !== "" ? series.seriesdata?.profile_img : placeholder} alt="novatoons" />
                                                        </Link>
                                                    </div>
                                                    <div className="info authorHeading">
                                                        <h4>Author</h4>
                                                        <h6>
                                                            <Link href={`/author/${series.seriesdata.user_id}`}>

                                                                {(series.seriesdata.user_name !== "" && series.seriesdata.is_creator === 1) ? series.seriesdata.user_name : `${series.seriesdata.first_name} ${series.seriesdata.last_name}`}

                                                            </Link>
                                                        </h6>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="meta-info_rating">
                                                <div className="single_rating">
                                                    <div
                                                        onClick={() => handleRating()}
                                                        className="info">
                                                        <h4>Rating</h4>
                                                        <Rating
                                                            ratingValue={(parseFloat(series.seriesdata.total_rating) * 100 / 5)}
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
                                        {(series.seriesdata.description !== "") && <p className='mb-3 descriptionDetail'>{series.seriesdata.description}</p>}

                                        <div className="seriesContentCounter">
                                            <p>Total Comics in this Series <b className='ml-3'> {series.seriesContent.length} </b></p>
                                        </div>


                                        <div className='contentListHeading'>
                                            List of Comics in this Series
                                        </div>

                                        <div className='seriesContentListSection'>
                                            {series.seriesContent.length !== 0 &&
                                                series.seriesContent.map(item => {
                                                    return <div className='seriesContentList'>
                                                        <Row>
                                                            <Col md={7} xs={6} className='flexMake'>
                                                                <div className="author-avatarContent">
                                                                    <Link href={process.env.REACT_APP_DEVELOPMENT_PREFIX + '/' + item.type + '/detail/' + item.slug}>
                                                                        <img loading="lazy" src={item.cover_image} alt="novatoons" className="avatar" />
                                                                    </Link>
                                                                </div>
                                                                <div className="name">
                                                                    <h6 className='mb-2'>
                                                                        <Link href={process.env.REACT_APP_DEVELOPMENT_PREFIX + '/' + item.type + '/detail/' + item.slug}>
                                                                            {item.title}
                                                                        </Link>
                                                                    </h6>
                                                                    <div className="bottomInfo">
                                                                        {(item.is_paid === "1" || item.is_paid === 1) && <p>${item.price}</p>}

                                                                        {(item.is_paid === "1" || item.is_paid === 1) ? <p><img loading="lazy" className="icons" alt="paid" src={paid} /> Paid</p> : <p><img loading="lazy" className="icons" alt="free" src={free} /> Free</p>}

                                                                        {(item.is_downloadable === "1" || item.is_downloadable === 1) && <p><img className="icons" loading="lazy" alt="download" src={download} />Downloadable</p>}
                                                                    </div>
                                                                </div>

                                                            </Col>
                                                            <Col md={5} xs={6} className='series_btn text-right'>

                                                                {dataType === 1 &&
                                                                    <button
                                                                        type="button"
                                                                        className='SeeMorebtn cursorPointer'
                                                                        onClick={(e) => HandlePdfView(item, "readNow")}
                                                                    >
                                                                        {dataType === 1 && (((item.is_bought === 1) || (item.is_paid === 0)) || ((item.is_available === "1" && userData.is_subscribed === 1) && item.is_read === 0)) ? 'Read Now' : ((item.is_available === "1" && userData.is_subscribed === 1) && item.is_read === 1) ? 'Continue' : `Preview`}

                                                                    </button>
                                                                }

                                                                {dataType === 2 && ((item.is_available === "1" && userData.is_subscribed === 1) || item.is_bought || item.is_paid === 0) ? <button
                                                                    type="button"
                                                                    className='SeeMorebtn cursorPointer'
                                                                    onClick={(e) => HandlePdfView(item, "readNow")}
                                                                >
                                                                    View Image
                                                                </button> : dataType === 2 && <button
                                                                    type="button"
                                                                    className='SeeMorebtn cursorPointer'
                                                                >
                                                                    <Link href={`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/content/detail/${item.slug}`}>Buy Now</Link>
                                                                </button>
                                                                }

                                                            </Col>
                                                        </Row>
                                                    </div>
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* {(series.seriesdata.recommend !== undefined) && <LiveAuction data={series.seriesdata.recommend} />}
                {sliderDuration.show && <SliderDurationModel />}
                {ratingModel && <RatingModel />}

                {donateModel.show && <DonateModel />}
                {directDonation.show && <DirectDonationModel />}
                {donateModel.briefModel.briefShow && <DonateMessage />}
                {RestoreStuff.modelShow && <RestoreModel />} */}

            </div>
        );
    } else if (!loading && err) {
        return <RejectionHandler data={error_message} />
    } else {
        return <Loader />
    }
}

export default SeriesDetailPage;
