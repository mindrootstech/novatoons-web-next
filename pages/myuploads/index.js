import React, { Fragment, useEffect, useState } from 'react';
//third party
import { Tab, Tabs, TabList } from 'react-tabs';
// import { Link, useNavigate } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating'
import { toast } from 'react-toastify'
//compontent
import Loader from '../../component/loader/loader'
import {Content_typeModel} from '../../component/model';
import { isWindow } from '../../utils/window';

//redux
import { myUploadsData, myUploadsDataReset } from '../../redux/userReducer'
import { getSeries, getContent, resetDetails } from '../../redux/editContentSeriesReducer'
import { modelShow } from '../../redux/headerReducer'
import { useSelector, useDispatch } from 'react-redux'
import { resetpdf } from '../../redux/pdfReducer';
import { resetSelected } from '../../redux/tagReducer'

// import 'react-tabs/style/react-tabs.css';
import { userData } from '../../config';

//fakedata
import {series} from '../../assets/fake-data/fake-user'
import Link from 'next/link';
import { useRouter } from 'next/router';
import RevenueTransaction from '../revenuetransaction';
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

const Myuploads = () => {
    const dispatch = useDispatch()
    const router = useRouter()
const placeholderImage = '/images/contentImages/placeholder.png'

const [contentSelected, setContentSelected] = useState('')
    const { loading, uploadedData, userData, load_more } = useSelector(state => state.userReducer)
    const { showModel } = useSelector(state => state.headerReducer)
 

    const [show, setShow] = useState(false)
    const [page, setPage] = useState(2)

    const [menuTab] = useState(
        [
            // {
            //     className: 'active',
            //     value: '0',
            //     name: 'All'
            // },
            // {
            //     className: '',
            //     value: '1',
            //     name: 'Comic'
            // },
            // {
            //     className: '',
            //     value: '2',
            //     name: 'Art'
            // },
            // {
            //     className: '',
            //     value: '3',
            //     name: 'E-book'
            // },
            // {
            //     className: '',
            //     value: '4',
            //     name: 'NFT'
            // },
        ]
    )

    useEffect(() => {
    setShow(true)
    },[])

    useEffect(() => {
        dispatch(myUploadsDataReset())
        dispatch(myUploadsData({
            "page": 1,
            "content_type": "1"
        }))
    }, [])

    useEffect(() => {
        dispatch(
            resetDetails()
        )
        dispatch(
            resetSelected()
        )
    })

    const showMoreItems = () => {

        setPage((preValue) => preValue + 1)
        dispatch(myUploadsData({
            "page": page,
            "content_type": contentSelected,
            LoadMore: load_more
        }))
    }

    const HandleTab = e => {
        setPage(2)
        setContentSelected(e.target.value)
        dispatch(myUploadsDataReset())
        dispatch(myUploadsData(
            {
                content_type: e.target.value,
            }))
    }

    isWindow() && sessionStorage.setItem('is_series', null)

    const editContent = (item) => {
        if (item.file_uploaded === "0" && item.type !== "series") {
            return toast.success(<SuccessToast message="Please wait file is under process" />, { hideProgressBar: true,  autoClose:  8000, })
        }
        if (item.type === "series") {
            sessionStorage.setItem('is_series', true)
            dispatch(
                getSeries({
                    series_id: item.id,
                })
            )
            dispatch(resetpdf())
            router.push(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/comicpromotion/${item.id}?type=1`)

        } else {
            sessionStorage.setItem('is_series', false)
            dispatch(
                getContent({
                    content_id: item.id
                })
            )
            dispatch(resetpdf())
            router.push(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/comicpromotion/${item.id}?type=0`)
        }
    }

    const handleUploadPopup = () => {
       if (userData.is_verified === "1"){
        dispatch(
            modelShow(true)
        )
       } else {
        return toast.warning(<SuccessToast message="Verify your email to use this feature" />, { hideProgressBar: true,  autoClose:  8000, })
       }
    }

    return ( isWindow() && show &&
        <div className='authors-2 userMyUploads'>
            <section className="tf-section authors">
                <div className="themesflat-container pt-80">
                    <div className="flat-tabs tab-authors">
                        <Tabs>
                            <TabList>
                                {
                                    menuTab.map((item, index) => (
                                        <Tab key={index} onClick={HandleTab} value={item.value}>{item.name}</Tab>
                                    ))
                                }
                            </TabList>

                            {
                                !loading && uploadedData.length === 0 && <div className='text-center DataNotFound'>
                                    <h2 className='mt-5'>No Content uploaded yet</h2>
                                    <div className='d-flex justify-content-center align-item-center'>
                                        <h4 className='mt-5 mr-3 cursorPointer'>
                                            <Link className='sc-button header-slider style style-1 fl-button pri-1' href={`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/`}>Go to Home</Link>
                                        </h4>
                                        <h4 className='mt-5 mr-3 cursorPointer' onClick={handleUploadPopup}>
                                            <div className='sc-button header-slider style style-1 fl-button pri-1'>Upload Content</div>
                                        </h4>
                                    </div>
                                </div>
                            }

                            {loading && uploadedData.length === 0 ? <Loader /> : <Fragment>
                                <div className="content-tab">
                                    <div className="content-inner">
                                        <div className="row">
                                            {
                                                uploadedData.map((item, index) => (
                                                    <div key={index} className="col-xl-3 col-lg-4 col-sm-6 col-12 card_style">
                                                        <div className="sc-card-product explode ">
                                                            <div className="card-media card-media2">
                                                                <Link className='CardImg cursorPointer' 
                                                                    href={`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/${item.type}/detail/${item.slug}`}>
                                                                    <img src={item.cover_image !== "" ? item.cover_image : placeholderImage} alt="Novatoons" />
                                                                </Link>
                                                                {item.file_uploaded === "0" && item.type === "content" ?
                                                                    <div className="wishlist-button clock"><span className="processingBatch">Processing</span></div> : null
                                                                }
                                                            </div>
                                                            <div className="card-title mg-bt-16 ">
                                                                <h5 className='w-75 text_size'>
                                                                    <Link className='cursorPointer'
                                                                        href={`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/${item.type}/detail/${item.slug}`}>
                                                                            {item.title.slice(0, 30)}{item.title.length > 30 && "..."}
                                                                    </Link>
                                                                </h5>
                                                                <h3 className='priceValue'>{item.is_paid !== 0 && item.price ? `$ ${item.price}` : null}</h3>
                                                            </div>
                                                            <div className="contentLikeComment">
                                                                <span className="likes">
                                                                    <i className="fa fa-heart"></i>
                                                                    {item.favourite_count}
                                                                </span>
                                                                <span className="comments">
                                                                    <i className="fa fa-comment-dots"></i>
                                                                    {item.total_comments}
                                                                </span>
                                                            </div>
                                                            <div className="card-bottom style-explode">
                                                                <div className="Rating myuploadsRating price">
                                                                    <h6 className='rating'>Rating</h6>

                                                                    {window.innerWidth < 480 ? <div className="ratingNumber d-flex rating_2 rating_st text_size">
                                                                    <i className="fa fa-star colorYellow"></i><span>{item.total_rating}</span>
                                                                </div> : 
                                                                <Fragment>
                                                                <Rating
                                                                    ratingValue={(parseInt(item.total_rating) * 100) / 5}
                                                                    allowHalfIcon={true}
                                                                    fillColor="#ffd700"
                                                                    emptyColor="#808080"
                                                                    iconsCount={5}
                                                                    size={20}
                                                                    readonly={true}
                                                                /> </Fragment>}
                                                                </div>
                                                                <div className="tags uploadsTag">
                                                                    {item.is_paid === 0 ? <span>
                                                                        <i className="fa fa-check mr-1" aria-hidden="true"></i>
                                                                        Free
                                                                    </span> : <span>
                                                                        <i className="fa fa-money-bill mr-1" aria-hidden="true"></i>
                                                                        Paid </span>}

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                            {
                                                load_more && <div className="col-md-12 wrap-inner load-more text-center">
                                                    <div id="load-more" className="sc-button cursorPointer loadmore fl-button pri-3" onClick={showMoreItems}><span>Load More</span></div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </Fragment>}
                        </Tabs>
                    </div>
                </div>
            </section>
            {showModel && <Content_typeModel />}
        </div>
    );

}

export default Myuploads;
