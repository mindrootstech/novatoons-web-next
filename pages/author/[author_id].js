import React, { Fragment, useEffect, useState } from 'react';
// import { Link, useNavigate, useParams } from 'react-router-dom';
import { Tab, Tabs, TabList } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Rating } from 'react-simple-star-rating'
import { toast } from 'react-toastify'
// import placeholderImage from '/images/avatar/profileimage.png'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { isWindow } from '../../utils/window';
import Card from '../../component/Card';

import Loader from '../../component/loader/loader'
// import './style.css'
//redux
import { getSeries, getContent, resetDetails } from '../../redux/editContentSeriesReducer'
import { modelShow } from '../../redux/headerReducer'
import { useSelector, useDispatch } from 'react-redux'
import { resetpdf } from '../../redux/pdfReducer';
import { getAuthor, getAuthorPosts, resetAuthorPosts } from '../../redux/authorReducer'
import { donateModelShow } from '../../redux/modelReducer'
import {DonateMessage, DonateModel, DirectDonationModel} from '../../component/model'
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

const AuthorProfile = () => {
    const dispatch = useDispatch()
    // const navigate = useNavigate()
    // const params = useParams()
    const placeholderImage = '/images/avatar/profileimage.png'
    const [show, setShow] = useState(false)
    const router = useRouter()
    const params ={id: router.query.author_id}

    const { loading, authordata, authorposts } = useSelector(state => state.authorReducer)
    const { userData } = useSelector(state => state.userReducer)
    const { donateModel, directDonation } = useSelector(state => state.modelReducer)

    const [page, setPage] = useState(1)
    const [menuTab] = useState(
        [
            {
                className: 'active',
                value: '',
                name: 'All'
            },
            {
                className: '',
                value: '1',
                name: 'Comic'
            },
            {
                className: '',
                value: '2',
                name: 'Art'
            }
        ]
    )

    useEffect(() => {

        if(params.id !== undefined) {
        setShow(true)
        dispatch(
            getAuthor({
                user_id: params.id,

            })
        )
        dispatch(
            getAuthorPosts({
                user_id: params.id,
                content_type: "",
                page: 1
            })
        )
        }
    }, [params.id])

    useEffect(() => {
        dispatch(
            resetDetails()
        )
    }, [])

    const showMoreItems = () => {

        setPage((preValue) => preValue + 1)
        dispatch(
            getAuthorPosts({
                user_id: params.id,
                content_type: "",
                page: page + 1,
            })
        )
    }

    const HandleTab = e => {
        setPage(1)
        dispatch(resetAuthorPosts())
        dispatch(
            getAuthorPosts({
                user_id: params.id,
                content_type: e.target.value === 0 ? "" : e.target.value,
                page: 1,
            })
        )
    }

    const donationhandle = () => {
        if (Object.keys(userData).length === 0) {
            return toast.success(<SuccessToast message='Please login first' />, { hideProgressBar: true, autoClose: 8000, })
        }

        if (userData.is_verified === 0 || userData.is_verified === "0") {
            return toast.success(<SuccessToast message='Verify your email to use this feature' />, { hideProgressBar: true, autoClose: 8000, })
        }

        dispatch(
            donateModelShow({
                donateFor: 'author',
                show: true
            })
        )
    }

    isWindow() && sessionStorage.setItem('is_series', null)

    const editContent = (item) => {
        if (item.file_uploaded === "0" && item.type !== "series") {
            return toast.success(<SuccessToast message="Please wait file is under process" />, { hideProgressBar: true, autoClose: 8000, })
        }
        if (item.type === "series") {
            isWindow() && sessionStorage.setItem('is_series', true)
            dispatch(
                getSeries({
                    series_id: item.id,
                })
            )
            dispatch(resetpdf())
            navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/series/detail/${item.slug}`)

        } else {
            isWindow() && sessionStorage.setItem('is_series', false)
            dispatch(
                getContent({
                    content_id: item.id
                })
            )
            dispatch(resetpdf())
            navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/content/detail/${item.slug}`)
        }
    }
    const handleUploadPopup = () => {
        dispatch(
            modelShow(true)
        )
    }

    if (loading && Object.keys(authordata).length === 0 || params.id != authordata.id) {
        return <Loader />
    } else {
    return (isWindow() && show &&
        <div className='authors-2'>
            <section className="tf-section authors">
                <div className="themesflat-container mt-5">
                    <div className='flat-tabs tab-authors'>
                        <div className="row author-profile flex">
                            <div className='feature-profile'>
                                <img className='avatar' src={authordata.profile_img && authordata.profile_img !== '' ? authordata.profile_img : placeholderImage} alt="author" />
                            </div>
                            <div className='infor-profile'>
                                <span>Author Profile</span>
                                <h2 className='title'>{authordata.user_name !== "" && authordata.is_creator === 1 ? authordata.user_name : authordata?.first_name + ' ' + authordata?.last_name}</h2>
                                <p className='content'>{authordata?.bio}</p>
                                <button onClick={donationhandle} className='donation_btn'>Donate</button>
                            </div>
                            <div className='widget-social style-3'>
                                <div className="socialMediaLinks">
                                    <ul className='social_media_icon'>
                                        {authordata.facebook_url !== "" &&
                                            <a rel="noreferrer" href={authordata.facebook_url} target='_blank'>
                                                <li><i className="fab fa-facebook"></i></li>
                                            </a>}

                                        {authordata.twitter_url !== "" &&
                                            <a rel="noreferrer" href={authordata.twitter_url} target='_blank'>
                                                <li><i className="fab fa-twitter"></i></li>
                                            </a>}

                                        {authordata.instagram_url !== "" &&
                                            <a rel="noreferrer" href={authordata.instagram_url} target='_blank'>
                                                <li><i className="fab fa-instagram"></i></li>
                                            </a>}

                                        {authordata.tiktok_url !== "" &&
                                            <a rel="noreferrer" href={authordata.tiktok_url} target='_blank'>
                                                <li><i className="fab fa-tiktok"></i></li>
                                            </a>}

                                    </ul>
                                </div>
                                <div className='uploadedContent'>
                                    <ul>
                                        <li className='authorTotalContent'>Total Content Uploaded : <span className='totalAuthorContent'>{authordata.total_content}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {authorposts.length === 0 && loading ? <Loader /> :
                            <Tabs>
                                <TabList>
                                    {
                                        menuTab.map((item, index) => (
                                            <Tab key={index} onClick={HandleTab} value={item.value}>{item.name}</Tab>
                                        ))
                                    }
                                </TabList>

                                {
                                    !loading && authorposts.posts.length === 0 && <div className='text-center DataNotFound'>
                                        <h2 className='mt-5'>Data Not Found</h2>
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

                                {loading && authorposts.posts.length === 0 ? <Loader /> : <Fragment>
                                    <div className="content-tab">
                                        <div className="content-inner">
                                            <div className="row">
                                                {
                                                    authorposts.posts.map((item, index) => (
                                                        <Card classes={"fl-item col-lg-3 col-md-6 col-sm-6 col-6 card_style"} item={item} index={index} />

                                                    ))
                                                }
                                                {
                                                    authorposts.load_more && <div className="col-md-12 wrap-inner load-more text-center">
                                                        <div id="load-more" className="sc-button cursorPointer loadmore fl-button pri-3" onClick={showMoreItems}><span>Load More</span></div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>}
                            </Tabs>}
                    </div>
                </div>

            </section>
            
                {donateModel.show && <DonateModel data={authordata} />}
                {donateModel.briefModel.briefShow && <DonateMessage />}
                {directDonation.show && <DirectDonationModel />}

        </div>
    );
}
}

export default AuthorProfile
